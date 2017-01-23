import React from 'react'

function Footer (props) {
  return (
    <div className='docs-footer'>
      <div className='docs-footer-column'>
        <div className='docs-footer-header'>ORGANIZATION</div>
        <a className='docs-footer-link' href='https://github.com/cerebral/cerebral/graphs/contributors' target='_new'>
          Contributors
        </a>
        <a className='docs-footer-link' href='http://www.webpackbin.com' target='_new'>
          www.webpackbin.com
        </a>
        <a className='docs-footer-link' href='http://www.christianalfoni.com' target='_new'>
          www.christianalfoni.com
        </a>
      </div>
      <div className='docs-footer-column'>
        <div className='docs-footer-header'>ARTICLES AND USEFUL LINKS</div>
        <a className='docs-footer-link' href='http://medium.com/p/5793c08db2cc' target='_new'>
          The story of Cerebral
        </a>
        <a className='docs-footer-link' href='https://gist.github.com/christianalfoni/b08a99faa09df054afe87528a2134730' target='_new'>
          An unlikely success story
        </a>
      </div>
      <div className='docs-footer-column'>
        <div className='docs-footer-header'>HELP</div>
        <a className='docs-footer-link' href='https://github.com/cerebral/cerebral' target='_new'>
          Cerebral github repo
        </a>
        <a className='docs-footer-link' href='https://discord.gg/0kIweV4bd2bwwsvH' target='_new'>
          Discoard chat
        </a>
      </div>
    </div>
  )
}

export default Footer
