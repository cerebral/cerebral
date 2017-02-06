export default function goTo (url) {
  function goTo ({router, resolve}) {
    router.goTo(resolve.value(url))
  }

  return goTo
}
