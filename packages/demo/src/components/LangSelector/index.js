import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../common/computed/translations'
import * as LANGS from '../../common/translations'

const LANG_OPTS = Object.keys(LANGS).map(lang => (
  [lang, LANGS[lang].language]
))

export default connect(
  {
    t: translations,
    showSelector: 'app.$showLangSelector'
  },
  {
    onBackgroundClick: 'app.langSelectorBackgroundClicked',
    onClick: 'app.langSelectorClicked',
    onOptionClick: 'app.langOptionClicked'
  },
  function LangSelector ({showSelector, t, onBackgroundClick, onClick, onOptionClick}) {
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
