import React from 'react'
import {connect} from 'cerebral/react'
import {signal, state} from 'cerebral/tags'
import translations from '../../common/computed/translations'
import * as LANGS from '../../common/translations'

const LANG_OPTS = Object.keys(LANGS).map(lang => (
  [lang, LANGS[lang].language]
))

export default connect(
  {
    onBackgroundClick: signal`app.langSelectorBackgroundClicked`,
    onClick: signal`app.langSelectorClicked`,
    onOptionClick: signal`app.langOptionClicked`,
    showSelector: state`app.$showLangSelector`,
    t: translations
  },
  function LangSelector ({onBackgroundClick, onClick, onOptionClick, showSelector, t}) {
    return (
      <div className='Selector'>
        <a onClick={() => onClick()}>{t.language}</a>
        { showSelector &&
          <div>
            <div className='SelectorBackground' onClick={() => onBackgroundClick()} />
            <div className='SelectorLeft'>
              <div className='menu'>
                <ul className='menu-list'>
                  {LANG_OPTS.map(lang => (
                    <li key={lang[0]}
                      onClick={() => onOptionClick({lang: lang[0]})}>
                      <a className={`${lang[0] === t.lang ? 'is-active' : ''}`}>
                        {lang[1]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
)
