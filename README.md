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

type Pixel = Enum<{
  Color: {
    r: number
    g: number
    b: number
  }
  BW: {
    value: boolean
  }
}>

const a = { Color: { r: 10, g: 20, b: 35 } }
const b = { BW: { value: true } }

const pixels: Pixel[] = [a, b]

console.log(`Matching with 'match'...`)

for (const elem of pixels) {
  match(elem)({
    Color: (color) => console.log(color.r + color.g + color.b),
    BW: (bw) => console.log(bw.value),
  })
}

console.log(`Matching with 'if_let'...`)

for (const elem of pixels) {
  if_let(elem)("Color")((color) =>
    console.log(`This is color: R:${color.r} G:${color.g} B:${color.b}`)
  )(() => console.log(`This is not color: ${elem}`))
}

console.log(`Matching with 'extract_variant'...`)

for (const elem of pixels) {
  const variant = extract_variant(elem)
  switch (variant.$) {
    case "Color":
      const color = variant.val
      console.log(`R: ${color.r}, G: ${color.b} + B: ${color.g}`)
      // console.log(`${color.value}`) // Type check FAILS
      break
    case "BW":
      const bw = variant.val
      console.log(`Value: ${bw.value}`)
      // console.log(`${bw.r}`) // Type check FAILS
      break
  }
}
```
