import type { AllUnionKeys, MergeUnionFields } from "./fields"
import type { EnumAny, EnumTags, FlattenEnumSafe } from "./enum"
import { extract_variant } from "./enum"

export type { Enum } from "./enum"
export { extract_variant } from "./enum"

export const extract_variant_and =
  <T extends EnumAny>(value: T) =>
  <R>(f: (v: FlattenEnumSafe<T>) => R) =>
    f(extract_variant(value))

export type MatchDict<T, R = void> = { [k in keyof T]: (v: T[k]) => R }

export type MatchDictFor<T extends EnumAny, R = void> = MatchDict<
  MergeUnionFields<T>,
  R
>

export const match =
  <T extends EnumAny>(value: T) =>
  <R>(matcher: MatchDict<MergeUnionFields<T>, R>): R =>
    extract_variant_and(value)(({ $, val }) => {
      let arm = matcher[$]
      return arm(val)
    })

// export function match_uncurried<T extends EnumAny, R>(
//   value: T,
//   matcher: MatchDictFor<T, R>
// ): R {
//   return extract_variant_and(value)(({ $, val }) => {
//     let arm = matcher[$]
//     return arm(val)
//   })
// }

type MergeUnionFieldsExcept<
  T extends EnumAny,
  K extends EnumTags<T>,
> = MergeUnionFields<T>[Exclude<EnumTags<T>, K>]

export const if_let =
  <T extends EnumAny, K extends EnumTags<T>>(value: T, key: K) =>
  <R>(
    th: (v: MergeUnionFields<T>[K]) => R,
    el: (v: MergeUnionFieldsExcept<T, K>) => R
  ): R => {
    return extract_variant_and(value)(({ $, val }) =>
      $ === key ? th(val) : el(val)
    )
  }

import type { Enum } from "./enum"
import { assert, Equals } from "tsafe"

namespace _test {
  type Test = Enum<{
    A: number
    B: string
  }>
  const x: Test = { A: 1 }
  const y: Test = { B: "hello" }

  const items: Test[] = [x, y]

  for (const item of items) {
    const x = match(item)<number | string>({
      A: (v) => v,
      B: (v) => v,
    })
    const y = match(item)({
      A: (v): number | string => v,
      B: (v) => v,
    })
    assert<Equals<typeof x, number | string>>
    assert<Equals<typeof y, number | string>>
  }

  for (const item of items) {
    const x = if_let(item, "A")(
      (v): number | string => v,
      (v) => v
    )
    const y = if_let(item, "B")<number | string>(
      (v) => v,
      (v): number | string => v
    )
    assert<Equals<typeof x, number | string>>
    assert<Equals<typeof y, number | string>>
  }
}
