import './styles.css'
import Inferno from 'inferno' // eslint-disable-line
import {shell} from 'electron'

export default function NewVersion ({giveReminder, ignoreReminder}) {
  return (
    <div className='version'>
      <h2>There is a new version of the debugger available</h2>
      <p>
        Go to <a href='' onClick={() => shell.openExternal('https://cerebral.github.io/docs/get_started/debugger.html')}>Cerebral Devtools website</a> to download the new version.
      </p>
      <p><strong>OR</strong></p>
      <div className='remind-me' onClick={giveReminder}>give reminder on next startup</div>
      <p><strong>OR</strong></p>
      <div className='remind-me' onClick={ignoreReminder}>ignore reminder on this version</div>
    </div>
  )
}
