import NewTodo from './modules/new'
import List from './modules/list'
import Footer from './modules/footer'

export default (options = {}) => {
  return (module) => {
    module.addModules({
      new: NewTodo(),
      list: List(),
      footer: Footer()
    })
  }
}
