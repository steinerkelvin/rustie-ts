declare const TAG_KEY: unique symbol
export type Tag<T> = { readonly [TAG_KEY]: T }

export type Tagged<T, V> = Tag<T> & V
