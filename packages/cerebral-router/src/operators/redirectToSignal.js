export default function redirectToSignalFactory (signal, payload) {
  function redirectToSignal ({router, resolve}) {
    router.redirectToSignal(resolve.value(signal), resolve.value(payload))
  }

  return redirectToSignal
}
