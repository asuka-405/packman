# PackMan

- Pull code directly into your codebase

```js
const tags = item.keywords.split(",").map((tag) => {
  return `<span class="tag">${tag
    .trim()
    .replace(/\s/g, "-")
    .toLowerCase()}</span>`
})
```
