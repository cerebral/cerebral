import init from './signals/init'
import create from './signals/create'
import discardDraft from './signals/discardDraft'
import edit from './signals/edit'
import newItem from './signals/newItem'
import remove from './signals/remove'
import removed from './signals/removed'
import update from './signals/update'
import updated from './signals/updated'
import updateDraft from './signals/updateDraft'
import updateFilter from './signals/updateFilter'
import uploadProgress from './signals/uploadProgress'

export default function collection (moduleName, initState) {
  return {
    create: create(moduleName),
    discardDraft: discardDraft(moduleName),
    edit: edit(moduleName),
    init: init(moduleName, initState),
    newItem: newItem(moduleName),
    update: update(moduleName),
    updated: updated(moduleName),
    remove: remove(moduleName),
    removed: removed(moduleName),
    updateFilter: updateFilter(moduleName),
    updateDraft: updateDraft(moduleName),
    uploadProgress: uploadProgress(moduleName)
  }
}
