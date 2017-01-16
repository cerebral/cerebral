export default function goTo (url) {
  function goTo ({router}) {
    router.goTo(url)
  }

  return goTo
}
