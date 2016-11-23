import init from './signals/init'
import create from './signals/create'
import discardDraft from './signals/discardDraft'
import edit from './signals/edit'
import update from './signals/update'
import updated from './signals/updated'
import remove from './signals/remove'
import removed from './signals/removed'
import updateDraft from './signals/updateDraft'
import updateFilter from './signals/updateFilter'

export default function collection (moduleName, initState) {
  return {
    create: create(moduleName),
    discardDraft: discardDraft(moduleName),
    edit: edit(moduleName),
    init: init(moduleName, initState),
    update: update(moduleName),
    updated: updated(moduleName),
    remove: remove(moduleName),
    removed: removed(moduleName),
    updateFilter: updateFilter(moduleName),
    updateDraft: updateDraft(moduleName)
  }
}
