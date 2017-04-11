export default function goToFactory (url) {
  function goTo ({router, resolve}) {
    router.goTo(resolve.value(url))
  }

  return goTo
}
