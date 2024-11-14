# rustie-ts

TypeScript library with helper types and functions to type-safely handle Rust's
`serde` JSON serialization of enums.

`rustie` can also be used standalone to implement enums/tagged-unions in
TypeScript with plain objects.

## Installation

```sh
npm install --save rustie
# OR
yarn add rustie
```

## Example

```ts
import type { Enum } from "rustie"
import { extract_variant, match, if_let } from "rustie"

type Event = Enum<{
  Ping: null
  KeyPress: { key: string }
  Click: { x: number; y: number }
}>

const a = { Click: { x: 10, y: 20 } }
const b = { KeyPress: { key: "a" } }
const c = { Ping: null }

const events: Event[] = [a, b, c]

// == Matching with 'match' function ==

for (const elem of events) {
  match(elem, {
    Click: ({ x, y }) => console.log(`Click at ${x}, ${y}`),
    KeyPress: ({ key }) => console.log(`Key pressed: ${key}`),
    Ping: () => console.log(`Ping!`),
  })
}

// == Matching with 'if_let' function ==

for (const elem of events) {
  if_let(
    elem,
    "Click",
    (color) => console.log(`This is click: X:${color.x} Y:${color.y}`),
    (x) => console.log(`This is not click:`, x)
  )
}

// == Matching with `extract_variant` function ==

for (const elem of events) {
  const variant = extract_variant(elem)
  switch (variant.$) {
    case "Click":
      const click = variant.val
      console.log(`Click at ${click.x}, ${click.y}`)
      // console.log(`${click.key}`) // Type check FAILS
      break
    case "KeyPress":
      const key_press = variant.val
      console.log(`Key pressed: ${key_press.key}`)
      // console.log(`${key_press.x}`) // Type check FAILS
      break
    case "Ping":
      console.log(`Ping!`)
      break
  }
}

// == Overlapping else ==

type Status = Enum<{
  Ok: null
  Warn: { message: string }
  Err: { message: string }
}>

const statuses: Status[] = [{ Ok: null }, { Err: { message: "Error" } }]

for (const status of statuses) {
  if_let(
    status,
    "Ok",
    () => console.log("This is Ok"), // Runs only on Ok
    ({ message }) => console.log(`This is not Ok: ${message}`) // Runs on Warn and Err
  )
}
```
