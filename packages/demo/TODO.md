* Up/down arrows in project selector should select projects in current selector list.
* enable Report page with url query for filtering by client/project/date, etc
* on update of client website url, add missing 'http://' if needed and in Client/index.js and Client/form.js, remove adding http://
* refuse to delete project with tasks or move tasks to no-project.
* refuse to delete client with projects or move projects to no-client.
* Create (dark) footer with links to cerebral stuff and language selector.
* Tasks component to search for tasks.., not sure what should go there.
* CSS style file upload <input> (also when $imageFile is in draft to show file.name)

* @julio ? implement sendEmailVerification
and applyActionCode

* @gaspard edit/delete tasks...
* @gaspard fix editing name of running task (it is saved and the `updated` call changes the field the user is currently typing in). Should prevent updates to forms field when it is focussed.
