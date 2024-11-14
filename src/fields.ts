import type { Equals, UnionToIntersection } from "tsafe"
import { assert } from "tsafe"

import type { EnumAny } from "./enum"

// Used some magic from
// https://stackoverflow.com/a/65928340
// and
// https://stackoverflow.com/a/50375286

export type Key = string

// I replaced `undefined` usages with this unique symbol placeholder so we can
// exclude it properly on the end on the `MergeUnionFields` type.
declare const PLACEHOLDER: unique symbol
type Placeholder = typeof PLACEHOLDER

/**
 * Lets T be indexed by any key.
 */
type Indexify<T> = T & { [k: Key]: Placeholder }

// To make a type where all values are undefined, so that in AllUnionKeys<T>
// TS doesn't remove the keys whose values are incompatible e.g. string & number
type UndefinedVals<T> = { [K in keyof T]: unknown }

/**
 * Extracts all the keys from a union of records.
 *
 * @template T - A union of records.
 *
 * @example
 * ```ts
 * type A = { a: number };
 * type B = { b: string };
 *
 * type Keys = AllUnionKeys<A | B>; // "a" | "b"
 * ```
 */
export type AllUnionKeys<T> = keyof UnionToIntersection<UndefinedVals<T>>

/**
 * Constructs a new type by merging all the fields of a union of records.
 *
 * @example
 * ```ts
 * type A = { a: number };
 * type B = { b: string };
 *
 * type Merged = MergeUnionFields<A | B>; // { a: number; b: string }
 */
export type MergeUnionFields<T extends EnumAny> = {
  [K in AllUnionKeys<T> & Key]: Exclude<Indexify<T>[K], Placeholder>
}

// == Test ==

namespace _test {
  type Base =
    | { a: number }
    | { a: bigint }
    | { b: string }
    | { b: boolean }
    | { c: {} }
    | { d: null }
    | { e: undefined }

  type _Test0 = UndefinedVals<Base>

  type _Test1 = AllUnionKeys<Base>

  assert<Equals<_Test1, "a" | "b" | "c" | "d" | "e">>

  type _Test2 = MergeUnionFields<Base>

  assert<
    Equals<
      _Test2,
      {
        a: number | bigint
        b: string | boolean
        c: {}
        d: null
        e: undefined
      }
    >
  >

  type _Test3 = Omit<MergeUnionFields<Base>, "a">
}
