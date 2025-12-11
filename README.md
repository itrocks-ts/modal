[![npm version](https://img.shields.io/npm/v/@itrocks/modal?logo=npm)](https://www.npmjs.org/package/@itrocks/modal)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/modal)](https://www.npmjs.org/package/@itrocks/modal)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/modal?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/modal)
[![issues](https://img.shields.io/github/issues/itrocks-ts/modal)](https://github.com/itrocks-ts/modal/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# modal

Lightweight modal with default styling and auto-close on form submit or link click.

*This documentation was written by an artificial intelligence and may contain errors or approximations.
It has not yet been fully reviewed by a human. If anything seems unclear or incomplete,
please feel free to contact the author of this package.*

## Installation

Install the package from npm:

```bash
npm i @itrocks/modal
```

Then include the stylesheet in your page. With a bundler:

```ts
import '@itrocks/modal/modal.css'
```

Or by linking to the built CSS file directly in HTML:

```html
<link rel="stylesheet" href="/node_modules/@itrocks/modal/modal.css">
```

## Usage

`@itrocks/modal` provides default styles for a full-screen overlay container
with the id `modal`, plus a small helper function `modalForm` that
automatically closes the modal when:

- the contained form is successfully submitted, or
- a link with `href="about:blank"` is clicked.

The package is intentionally minimal: you are free to render any content
inside the modal and to decide when it should appear.

### Minimal example

```ts
import { modalForm } from '@itrocks/modal'

// Suppose you have just injected a `<form>` into `#modal` dynamically
const form = document.querySelector<HTMLFormElement>('#modal form')
if (form) {
  modalForm(form)
}
```

```html
<div id="modal">
  <form>
    <p>Confirm action?</p>

    <button type="submit">OK</button>
    <a href="about:blank">Cancel</a>
  </form>
</div>
```

In this setup:

- When the user submits the form (by clicking **OK**), the surrounding
  `#modal` element is removed from the DOM, effectively closing the modal.
- When the user clicks the **Cancel** link (whose `href` is `about:blank`),
  the closest `#modal` ancestor is removed as well.

### Complete example with lazy-loaded modal

The following example shows a small confirmation modal that is created on
the fly when the user clicks a button. The modal is then automatically
closed when the form is submitted or the cancel link is clicked.

```ts
import { modalForm } from '@itrocks/modal'

function openConfirmModal(message: string, onConfirm: () => void) {
  // Create the modal container if it does not exist yet
  let modal = document.querySelector<HTMLDivElement>('#modal')
  if (!modal) {
    modal = document.createElement('div')
    modal.id = 'modal'
    document.body.appendChild(modal)
  }

  // Inject the confirmation form
  modal.innerHTML = `
    <form>
      <p>${message}</p>
      <button type="submit">Confirm</button>
      <a href="about:blank">Cancel</a>
    </form>
  `

  const form = modal.querySelector('form') as HTMLFormElement

  // Wire the helper to auto-close the modal
  modalForm(form)

  // Perform custom logic on submit (e.g. call an API)
  form.addEventListener('submit', (event) => {
    event.preventDefault() // keep page from reloading
    onConfirm()
    // The modal element is removed by modalForm's submit listener
  })
}

// Example: attach to a button
document
  .querySelector<HTMLButtonElement>('#delete-button')
  ?.addEventListener('click', () => {
    openConfirmModal('Are you sure you want to delete this item?', () => {
      // Custom confirm callback
      console.log('Item deleted')
    })
  })
```

With the stylesheet from this package, the `#modal` overlay covers the
whole viewport and slightly darkens the background while displaying your
content in a centered box.

## API

### `function modalForm(form: HTMLFormElement): void`

Attach auto-close behavior to a form displayed inside a modal overlay.

The function looks for the closest ancestor element with the id `modal`
and, if found, registers two behaviors:

1. On form submission, the `#modal` element is removed from the DOM.
2. For each anchor inside the form whose `href` is exactly
   `about:blank`, a click handler is added that removes the closest
   `#modal` ancestor.

If the form is not inside a `#modal` container, the function does
nothing.

#### Parameters

- `form` – the `HTMLFormElement` to enhance. It is expected to be a
  direct or indirect child of the `#modal` element.

#### Return value

- `void` – the function does not return anything. It registers the
  relevant event listeners on the provided form.

#### Example

```ts
import { modalForm } from '@itrocks/modal'

const form = document.querySelector<HTMLFormElement>('#modal form')
if (form) {
  modalForm(form)
}
```

## Typical use cases

- Simple confirmation dialogs ("Are you sure?" before deleting an item)
  that should disappear as soon as the user confirms or cancels.
- Small input forms (e.g. rename, quick comment, password prompt)
  displayed in a centered overlay without having to write modal logic
  from scratch.
- Temporary status or error popups that can be dismissed with a
  dedicated "Close" link using `href="about:blank"`.
- Projects that want a lightweight, dependency-free modal behavior and
  default styling that can be easily overridden with custom CSS.
