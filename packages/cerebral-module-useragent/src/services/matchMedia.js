import matchMediaPolyfill from 'match-media'

export default function matchMedia (mediaQueryString) {
  return window.matchMedia(mediaQueryString)
}
