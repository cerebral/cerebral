import {convertObjectWithTemplates} from '../utils'

function uploadFileFactory (urlValue, filesValue, optionsValue) {
  function uploadFile ({http, resolve}) {
    const url = resolve.value(urlValue)
    const files = resolve.value(filesValue)
    const options = convertObjectWithTemplates(optionsValue)

    return http.uploadFile(url, files, options)
  }
  return uploadFile
}

export default uploadFileFactory
