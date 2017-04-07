export function redirectFactory (url) {
  function redirect ({router, resolve}) {
    router.redirect(resolve.value(url))
  }

  return redirect
}
