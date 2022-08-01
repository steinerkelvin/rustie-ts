import type { Enum } from "."
import {
  extract_variant,
  extract_variant_f,
  match,
  if_let,
} from "."

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

function example() {
  const a: Stuff = { Color: { r: 10, g: 20, b: 35 } }
  const b: Stuff = { BW: { value: true } }

  const items: Stuff[] = [a, b]

  console.log(`Matching with 'match'...`)
  for (const elem of items) {
    match(elem)({
      Color: (color) => console.log(color.r + color.g + color.b),
      BW: (bw) => console.log(bw.value),
    })
  }

  console.log(`Matching with 'if_let'...`)
  for (const elem of items) {
    if_let(elem)("Color")((color) =>
      console.log(`This is color: R:${color.r} G:${color.g} B:${color.b}`)
    )(() => console.log(`This is not color: ${elem}`))
  }

  console.log(`Matching with 'extract_variant'...`)
  for (const _elem of items) {
    const variant = extract_variant(_elem)
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

  console.log(`Matching with 'extract_variant_f'...`)
  for (const elem of items) {
    extract_variant_f(elem)(({ $, val }) => {
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
}

example()
