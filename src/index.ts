import type { FlatEnumFrom, VariantsFrom } from "./enum"
import { extract_variant } from "./enum"

export type { Enum } from "./enum"
export { extract_variant, flatten_enum } from "./enum"

export { Tag, Tagged } from './tag'

export type Option<T> = T | null

export const extract_variant_f =
  <N>(value: N) =>
  <R>(f: (v: FlatEnumFrom<N>) => R) =>
    f(extract_variant(value))

type MatchDict<V, R = void> = { [tag in keyof V]: (v: V[tag]) => R }

export const match =
  <N>(value: N) =>
  <R>(matcher: MatchDict<VariantsFrom<N>, R>): R =>
    extract_variant_f(value)(({ $, val }) => {
      let arm = matcher[$]
      return arm(val)
    })

export const if_let =
  <N>(value: N) =>
  <K extends keyof VariantsFrom<N>>(tag: K) =>
  <R>(th: (v: VariantsFrom<N>[K]) => R) =>
  (el: () => R): R =>
    extract_variant_f(value)(({ $, val }) => ($ === tag ? th(val) : el()))
