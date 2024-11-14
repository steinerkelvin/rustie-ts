import type { AllUnionKeys, Key, MergeUnionFields } from "./fields"

import { assert, Extends } from "tsafe"

/**
 * Base type for specifications of Rust-like enumerations.
 *
 * @example
 * interface EventSpec extends EnumSpec {
 *   KeyPress: { key: string },
 *   Click: { x: number, y: number },
 * }
 *
 * type Event = Enum<EventSpec>
 */
export type EnumSpec = Record<Key, any>

/**
 * A utility type that transforms a record type into a union of objects,
 * where each object has a single key from the original record type and its
 * corresponding value.
 *
 * @template T - A record type.
 *
 * @example
 * type MyEnum = Enum<{ a: number; b: string }>;
 * // Resulting type:
 * // { a: number } | { b: string }
 */
export type Enum<T extends EnumSpec> = {
  [K in keyof T]: { [x in K]: T[K] }
}[keyof T]

// == Extraction ==

export type EnumAny = Record<Key, any>

export type EnumTags<T extends EnumAny> = keyof MergeUnionFields<T>

export type ToEnumSafe<T extends EnumAny> = {
  [K in keyof T]: { $: K; val: T[K] }
}[keyof T]

export type FlattenEnumSafe<T extends EnumAny> = ToEnumSafe<MergeUnionFields<T>>

export function extract_variant<E extends EnumAny>(
  value: E
): FlattenEnumSafe<E> {
  for (let key in value) {
    // TODO: use Object.keys
    let _result = value[key]
    let result = { $: key, val: _result }
    return result as unknown as FlattenEnumSafe<E>
  }
  throw new Error(`Variant is empty: '${value}'.`)
}

// == Test ===

namespace _test {
  interface _EventSpec {
    Ping: null
    KeyPress: { key: string }
    Click: { x: number; y: number }
  }

  assert<Extends<_EventSpec, EnumSpec>>()

  type _Event = Enum<_EventSpec>

  assert<
    Extends<
      _Event,
      | { Ping: null }
      | { KeyPress: { key: string } }
      | { Click: { x: number; y: number } }
    >
  >()

  type Test1 = AllUnionKeys<_Event>

  type Test2 = FlattenEnumSafe<_Event>
}
