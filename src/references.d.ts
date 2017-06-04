
// Small part of the Map<> spec that goes beyond ES5 but is supported in IE11
interface Map<K, V> {
    has(key: K): boolean;
    get(key: K): V;
    set(key: K, value?: V): Map<K, V>;
}

interface MapConstructor {
    new <K, V>(): Map<K, V>;
    prototype: Map<any, any>;
}

declare var Map: MapConstructor;
