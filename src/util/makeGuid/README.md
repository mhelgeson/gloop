# util/makeGuid

Create a function to issue globally unique identifiers. It is based on the
current performance time in milliseconds (to make it hard to guess) and a
counter (for uniqueness) and can include an optional prefix (for scoping). The
generated guids are only unique within the scope of a single page session and
are not cryptographically secure.

## Syntax

```
makeGuid(prefix)
```

## Parameters

- `prefix` (String)

  An optional prefix to be prepended to return values.

## Return value

A function that generates the next guid.

## Example

```js
const guid = makeGuid("foo");
const id = guid(); // foo-el4k-1
```
