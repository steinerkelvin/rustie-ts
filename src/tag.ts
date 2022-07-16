declare const TAG: unique symbol
export type Tag<T> = { readonly [TAG]: T }

export type Tagged<T, V> = Tag<T> & V
