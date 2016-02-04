import matchMediaPolyfill from 'match-media'

matchMediaPolyfill

export default function matchMedia (mediaQueryString) {
  return window.matchMedia(mediaQueryString)
}
