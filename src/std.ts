import { Enum, MatchDictFor, match } from "."

export type Option<T> = T | null

export type Result<T, E> = Enum<{
    Ok: T,
    Err: E,
}>

interface ResultI<T, E> {
    match<T, E, U>({ Ok, Err }: MatchDictFor<Result<T, E>, U>): U
    map<U>(f: (value: T) => U): ResultI<U, E>
    map_err<U>(f: (value: E) => U): ResultI<T, U>
}

const result_prototype = {
    match<T, E, U>(this: Result<T, E>, matcher: MatchDictFor<Result<T, E>, U>): U {
        return match(this)(matcher)
    },
    map<T, E, U>(this: Result<T, E>, f: (value: T) => U): Result<U, E> {
        return match(this)({
            Ok: (value) => result.Ok<U, E>(f(value)),
            Err: (value) => result.Err<U, E>(value),
        })
    },
    map_err<T, E, U>(this: Result<T, E>, f: (value: E) => U): Result<T, U> {
        return match(this)({
            Ok: (value) => result.Ok<T, U>(value),
            Err: (value) => result.Err<T, U>(f(value)),
        })
    },
}

export const result = {
    Ok: <T, E>(value: T) => result.with<T, E>({ Ok: value }),
    Err: <T, E>(value: E) => result.with<T, E>({ Err: value }),
    with: <T, E>(value: Result<T, E>): Result<T, E> & ResultI<T, E> => {
        const overlay_proxy_handler = {
            get: (target: Result<T, E>, prop: string) => {
                // console.log(`PROP: ${prop}`)
                if (prop in result_prototype) {
                    return Reflect.get(result_prototype, prop, target)
                }
                return Reflect.get(target, prop)
            },
        }
        return new Proxy(value, overlay_proxy_handler) as Result<T, E> & ResultI<T, E>
    }
}

const val_1 = { Ok: 1 }
const val_2 = { Err: "aaa" }

const test_items: Result<number, string>[] = [val_1, val_2]

for (const elem of test_items) {
    result.with(elem)
        .map((value) => value + 10)
        .map_err((err) => `ERROR[${err}]`)
        .match({
            Ok: (value) => console.log(`This is an Ok:   ${value}`),
            Err: (err) => console.log(`This is an Err:  ${err}`),
        })
}

// OUTPUT:
// This is an Ok:   11
// This is an Err:  ERROR(aaa)
