import { Enum } from "."

export type Option<T> = T | null

export type Result<T, E> = Enum<{
    Ok: T,
    Err: E,
}>

export type Ok<T> = { Ok: T } // ExtractVariant<Result<T, never>, "Ok">
export type Err<E> = { Err: E } // ExtractVariant<Result<never, E>, "Err">
