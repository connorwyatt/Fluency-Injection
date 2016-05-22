(function() {
  'use strict';

  const gulp = require('gulp'),
    typescript = require('gulp-typescript'),
    tsProject = typescript.createProject('./tsconfig.json'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge2'),
    guppy = require('git-guppy')(gulp),
    fs = require('fs'),
    runSequence = require('run-sequence'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul'),
    Collector = require('istanbul').Collector,
    Reporter = require('istanbul').Reporter;

  const sourceFilesTS = ['index.ts', 'src/**/*.ts'],
    sourceFilesJS = ['index.js', 'src/**/*.js'],
    testFilesTS = ['test/**/*.ts'],
    testFilesJS = ['test/**/*.js'],
    typings = ['node_modules/reflect-metadata/typings.d.ts', 'typings/**/*.d.ts'];

  gulp.task('default', ['build']);

  gulp.task('build', () => {
    return runSequence(
      '~compile',
      '~prepare-istanbul',
      '~run-tests',
      '~remap-istanbul',
      '~coverage-check'
    );
  });

  gulp.task('~compile', () => {
    let tsResult = gulp.src([...sourceFilesTS, ...testFilesTS, ...typings], { base: '.' })
      .pipe(sourcemaps.init())
      .pipe(typescript(tsProject));

      return merge([
        tsResult.js.pipe(sourcemaps.write()).pipe(gulp.dest('')),
        tsResult.dts.pipe(gulp.dest(''))
      ]);
  });

  gulp.task('~prepare-istanbul', () => {
    return gulp.src([...sourceFilesJS, '!test/**/*.mock.js', '!test/**/*.spec.js'])
      .pipe(istanbul())
      .pipe(istanbul.hookRequire());
  });

  gulp.task('~run-tests', () => {
    return gulp.src(testFilesJS, { read: false })
      .pipe(mocha())
      .on('error', function() {
        this.emit('end');
      })
      .pipe(istanbul.writeReports({
        reporters: ['json'],
        reportOpts: {
          'json': {
            dir: 'coverage',
            file: 'coverage-js.json'
          }
        }
      }));
  });

  gulp.task('~remap-istanbul', () => {
    return gulp.src('coverage/coverage-js.json')
      .pipe(remapIstanbul({
        reports: {
          'text-summary': '',
          'json': 'coverage/coverage.json',
          'html': 'coverage/html-report'
        }
      }));
  });

  gulp.task('~coverage-check', (cb) => {
    let collector = new Collector(),
      reporter = new Reporter();

    collector.add(JSON.parse(fs.readFileSync('coverage/coverage.json', 'utf8')));

    reporter.add('json-summary');
    reporter.write(collector, true, () => {
    });

    let coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));

    let percentages = [
      coverage.total.lines.pct,
      coverage.total.statements.pct,
      coverage.total.functions.pct,
      coverage.total.branches.pct
    ];

    let coveragePass = percentages.every((percent) => {
      return percent >= 100;
    });

    if (coveragePass) {
      cb();
    } else {
      cb(new Error('Code coverage was less than 100%'));
    }
  });

  gulp.task('pre-commit', ['test']);
}());
