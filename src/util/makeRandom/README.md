# util/makeRandom

A factory to create a pseudo random number generator for predictable output

## Syntax

```js
makeRandom(seed);
```

## Parameters

- `seed` (String)

  Seed for psuedo random number generation.

## Returns

A function to create random numbers, which accepts two optional params to
determine the range of the output. The order of higher/lower values does not
matter.

<ul>

### Syntax

```js
random(a, b);
```

### Parameters

- `a` (Number/float, default 1)

  A number to determine the upper or lower limit of the output.

- `b` (Number/float, default 0)

  A number to determine the upper or lower limit of the output.

### Returns

Number/float, range `a` to `b`

</ul>

## Example

```js
// create a prng with a fixed seed string
const random = makeRandom("kC9ZA48P");

// get float values between 0 to 1
const num1 = random(); // 0.20596039295196533

// get integer values between 0 to 100
const num2 = Math.round(random(100)); // 49

// get float values between E to Pi
const num3 = random(Math.E, Math.PI); // 3.042387672531788
```

## Notes

- not cryptographically secure

## References

-
