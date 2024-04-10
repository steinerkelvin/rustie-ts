import type { AllFields } from "./magic"
import type { Key } from "./common"

export type Variant<Tag extends Key, T> = { [x in Tag]: T }

export type TagVariants<T> = { [K in keyof T]: Variant<K, T[K]> }
export type Enum<T> = TagVariants<T>[keyof T]

export type RuntimeTag<Tag extends Key, T> = { $: Tag; val: T }
export type ExtractVariantsToRuntimeTagged<T> = {
  [K in keyof T]: RuntimeTag<K, T[K]>
}[keyof T]

export type VariantsFrom<T> = AllFields<T>
export type FlatEnumFrom<T> = ExtractVariantsToRuntimeTagged<VariantsFrom<T>>

export type FlatVariant<Tag extends Key, T> = { $: Tag } & T
export type FlatEnum<T> = {
  [K in keyof T]: FlatVariant<K, T[K]>
}[keyof T]

/** Needs testing */
export type _ExtractVariant<T, Tag extends keyof VariantsFrom<T>> = {
  [K in Tag]: VariantsFrom<T>[K]
}

export function flatten_enum<V>(value: Enum<V>): FlatEnum<V> {
  for (let key in value) {
    // TODO: use Object.keys
    if (key !== "$") {
      let _result = value[key]
      let result = { $: key, ..._result }
      return result
    }
  }
  throw new Error(`Variant is empty: '${value}'.`)
}

export function extract_variant<E>(value: E): FlatEnumFrom<E> {
  for (let key in value) {
    // TODO: use Object.keys
    let _result = value[key]
    let result = { $: key, val: _result }
    return result as unknown as FlatEnumFrom<E>
  }
  throw new Error(`Variant is empty: '${value}'.`)
}
