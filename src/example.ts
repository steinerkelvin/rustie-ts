import type { Enum } from "."
import { extract_variant, match, if_let } from "."

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
