# rustie-ts

TypeScript library with helper types and functions to type-safely handle Rust's
`serde` JSON serialization of Enums. It can also be used standalone to implement
enums/tagged-unions in TypeScript with plain objects.

## Installation

```sh
npm install --save rustie
# OR
yarn add rustie
```

## Example

```ts
import type { Enum } from "rustie"
import { flatten_enum, flatten_enum_f, match, if_let } from "rustie"

type Stuff = Enum<{
  Color: Color
  BW: BW
}>

interface Color {
  r: number
  g: number
  b: number
}

interface BW {
  value: boolean
}

const a: Stuff = { Color: { r: 10, g: 20, b: 35 } }
const b: Stuff = { BW: { value: true } }

const all: Stuff[] = [a, b]

for (const _elem of all) {
  console.log(`Matching with flatten_enum...`)
  const variant = flatten_enum(_elem)
  switch (variant.$) {
    case "Color":
      const color = variant.val
      console.log(`R: ${color.r}, G: ${color.b} + B: ${color.g}`)
      // console.log(`${color.value}`) // Type check FAILS
      break
    case "BW":
      const bw = variant.val
      console.log(`VALUE: ${bw.value}`)
      // console.log(`${bw.r}`) // Type check FAILS
      break
  }
}

for (const elem of all) {
  console.log(`Matching with flatten_enum_f...`)
  flatten_enum_f(elem)(({ $, val }) => {
    switch ($) {
      case "Color":
        console.log(`R: ${val.r}, G: ${val.b} + B: ${val.g}`)
        // console.log(`${val.v}`) // Type check FAILS
        break
      case "BW":
        console.log(`VALUE: ${val.value}`)
        // console.log(`${val.r}`) // Type check FAILS
        break
    }
  })
}

for (const elem of all) {
  console.log(`Matching with map_enum...`)
  match(elem)({
    Color: (color) => console.log(color.r + color.g + color.b),
    BW: (bw) => console.log(bw.value),
  })
}

for (const elem of all) {
  console.log(`Matching with if_let...`)
  if_let(elem)("Color")((color) =>
    console.log(`This is color: R:${color.r} G:${color.g} B:${color.b}`)
  )(() => console.log(`This is not color: ${elem}`))
}
```
