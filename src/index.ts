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

export function match<T extends EnumAny, R>(
  value: T,
  matcher: MatchDictFor<T, R>
): R {
  return extract_variant_and(value)(({ $, val }) => {
    let arm = matcher[$]
    return arm(val)
  })
}

type MergeUnionFieldsExcept<
  T extends EnumAny,
  K extends EnumTags<T>,
> = MergeUnionFields<T>[Exclude<EnumTags<T>, K>]

export function if_let<T extends EnumAny, K extends keyof MatchDictFor<T>, R>(
  value: T,
  key: K,
  th: (v: MergeUnionFields<T>[K]) => R,
  el: (v: MergeUnionFieldsExcept<T, K>) => R
): R {
  return extract_variant_and(value)(({ $, val }) =>
    $ === key ? th(val) : el(val)
  )
}
