import View from '../View'

export default function connect (dependencies, component) {
  component.inject = component.inject ? component.inject.concat(['cerebral_controller']) : ['cerebral_controller']

  component.methods = Object.assign(component.methods || {}, {
    _cererebral_onUpdate: function (stateChanges, force) {
      this.view.updateFromState(stateChanges, this.$props, force)
      Object.assign(this, this.view.getProps(this.$props))
      this.$forceUpdate()
    }
  })

  const existingBeforeMount = component.beforeMount
  component.beforeMount = function (...args) {
    existingBeforeMount && existingBeforeMount.call(this, ...args)

    this.view = new View({
      dependencies,
      mergeProps: null,
      props: this.$props,
      controller: this.cerebral_controller,
      displayName: component.name || 'NoName',
      onUpdate: this._cererebral_onUpdate
    })

    this.view.onMount()
    Object.assign(this, this.view.getProps(this.$props))

    Object.keys(this.$props).forEach((prop) => {
      this.$watch(prop, function (newVal, oldVal) {
        const oldProps = Object.assign({}, this.$props, {[prop]: oldVal})
        const hasUpdate = this.view.onPropsUpdate(oldProps, this.$props)

        if (hasUpdate) {
          Object.assign(this, this.view.getProps(this.$props))
          this.$forceUpdate()
        }
      })
    })
  }

  const existingBeforeDestroyed = component.beforeDestroyed
  component.beforeDestroyed = function (...args) {
    existingBeforeDestroyed && existingBeforeDestroyed.call(this, ...args)
    this.view.onUnMount()
  }
  return component
}
