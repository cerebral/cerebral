import {Computed} from 'cerebral'
import {state} from 'cerebral/tags'
import * as TRANSLATIONS from '../translations'

export default Computed(
  {
    lang: state`user.lang`
  },
  function translations ({lang}) {
    return TRANSLATIONS[lang] || TRANSLATIONS.en
  }
)
