// @TODO: What features should we test for?
// @TODO: How should we configure the tests?

export default function createFeatureDetection (tests) {
  function detectAll () {
    return {
      touch: false
    }
  }

  return {
    detectAll
  }
}
