export default function redirect (url) {
  function redirect ({router, resolve}) {
    router.redirect(resolve.value(url))
  }

  return redirect
}
