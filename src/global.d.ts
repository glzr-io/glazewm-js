import { WebSocket as WS } from 'ws';

declare global {
  var WebSocket: typeof WS;
}

/**
 * A utility type that ensures at least one property from a given object type is present.
 *
 * This type takes two generic parameters:
 * - `T`: The original object type where at least one key should be present.
 * - `U`: An auxiliary type that maps over the keys of `T` and creates an object type with only that single key.
 * 
 * The resulting type is a union of `Partial<T>` and `U[keyof U]`, where `Partial<T>` makes all properties in `T` optional,
 * and `U[keyof U]` constructs a union of all possible single-key objects.
 *
 * @template T - The type of the object where at least one property should be required.
 * @template U - An auxiliary type used to map over the keys of `T`. Defaults to `{[K in keyof T]: Pick<T, K>}`.
 * 
 * @example
 * // Example usage:
 * type Options = AtLeastOne<{ top: string; right: string; bottom: string; left: string; }>;
 * 
 * // Valid object with at least one property
 * const validOptions1: Options = { top: "10px" };
 * const validOptions2: Options = { right: "20px", left: "15px" };
 * 
 * // Invalid object with no properties
 * const invalidOptions: Options = {}; // Error: Type '{}' is not assignable to type 'AtLeastOne<...>'.
 */
type AtLeastOne<T, U = {[K in keyof T]: Pick<T, K>}> = Partial<T> & U[keyof U];
