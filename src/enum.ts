import type { AllFields } from "./magic"
import type { Key } from "./common"

export type Variant<Tag extends Key, T> = { [x in Tag]: T }

export type TagVariants<T> = { [K in keyof T]: Variant<K, T[K]> }
export type Enum<T> = TagVariants<T>[keyof T]

export type FlatVariant<Tag extends Key, T> = { $: Tag; val: T }
export type FlatEnum<T> = { [K in keyof T]: FlatVariant<K, T[K]> }[keyof T]

export type VariantsFrom<T> = AllFields<T>
export type FlatEnumFrom<T> = FlatEnum<VariantsFrom<T>>

export type FlatVariantOld<Tag extends Key, T> = { $: Tag } & T
export type FlatEnumOld<T> = {
  [K in keyof T]: FlatVariantOld<K, T[K]>
}[keyof T]

export function flatten_enum_old<V>(value: Enum<V>): FlatEnumOld<V> {
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

export function flatten_enum<E>(value: E): FlatEnumFrom<E> {
  for (let key in value) {
    // TODO: use Object.keys
    let _result = value[key]
    let result = { $: key, val: _result }
    return result as unknown as FlatEnumFrom<E>
  }
  throw new Error(`Variant is empty: '${value}'.`)
}
