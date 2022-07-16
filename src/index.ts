import type { FlatEnumFrom, VariantsFrom } from "./enum"
import { flatten_enum } from "./enum"

export type { Enum } from "./enum"
export { flatten_enum } from "./enum"

export const flatten_enum_f =
  <N>(value: N) =>
  <R>(f: (v: FlatEnumFrom<N>) => R) =>
    f(flatten_enum(value))

type MatchDict<V, R = void> = { [tag in keyof V]: (v: V[tag]) => R }

export const match =
  <N>(value: N) =>
  <R>(matcher: MatchDict<VariantsFrom<N>, R>): R =>
    flatten_enum_f(value)(({ $, val }) => {
      let arm = matcher[$]
      return arm(val)
    })

export const if_let =
  <N>(value: N) =>
  <K extends keyof VariantsFrom<N>>(tag: K) =>
  <R>(th: (v: VariantsFrom<N>[K]) => R) =>
  (el: () => R): R =>
    flatten_enum_f(value)(({ $, val }) => ($ === tag ? th(val) : el()))
