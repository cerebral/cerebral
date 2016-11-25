* Up/down arrows in project selector should select projects in current selector list.
* enable Report page with url query for filtering by client/project/date, etc
* on update of client website url, add missing 'http://' if needed and in Client/index.js and Client/form.js, remove adding http://

* @henri-hulski apply cerebral forms on signIn
* @gaspard split signIn and signUp
* @gaspard save running task to firebase.
  * start: create with id 'running'
  * task name change: write to firebase
  * prevent updateNow from triggering more then once.
  * On timer start:
    1. create clean 'running' element => saved => draft
  * On timer end:
    1. create with new ref from draft
    2. create stopped 'running' element
