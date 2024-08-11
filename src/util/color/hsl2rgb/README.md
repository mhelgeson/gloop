## hsl2rgb

Convert hue saturation lightness (hsl) notation into rgb component values.

### Syntax

```js
hsl2rgb(hue, sat, lum);
```

### Parameters

- `hue`
  A numeric `hue` color component, range 0 to 360.
  0 = red, 60 = yellow, 120 = green, 180 = cyan, 240 = blue, 300 = magenta

- `sat`
  A numeric saturation color component, range 0 to 100.
  0 = gray, 100 = pure color

- `lum`
  A numeric lightness color component, range 0 to 100.
  0 = black, 50 = even, 100 = white

### Return

An array of red, green, blue component numeric values (range 0 to 255)

### Example

```js
hsl2rgb(240, 100, 50); // [0, 0, 255]
```
