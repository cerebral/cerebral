* Up/down arrows in project selector should select projects in current selector list.
* enable Report page with url query for filtering by client/project/date, etc
* on update of client website url, add missing 'http://' if needed and in Client/index.js and Client/form.js, remove adding http://

* @henri-hulski apply cerebral forms on signIn
* @gaspard split signIn and signUp
* @gaspard save running task to firebase.
  * start: create with id 'running'
  * name update: write to firebase
  * stop: copy to real ref, remove start time in 'running'
  ==> create does not set input`key` if exists
  ==> set key to 'running' before create
  ==> timer gets running task from tasks.all.running
  ==> forget about tasks.$draft

* Collection.updated should update draft if key matches
