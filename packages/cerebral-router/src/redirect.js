export default function redirect (url) {
  function redirect ({router}) {
    router.redirect(url)
  }

  return redirect
}
