import { compute } from 'cerebral'
import { state } from 'cerebral/tags'
import * as TRANSLATIONS from '../translations'

export default compute(state`user.lang`, function translations(lang) {
  return TRANSLATIONS[lang] || TRANSLATIONS.en
})
