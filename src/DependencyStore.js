class DependencyStore {
  constructor() {
    this.map = {}
  }
  addEntity(entity, depsMap) {
    for (const depsMapKey in depsMap) {
      const key = depsMap[depsMapKey]
      this.map[key] = this.map[key] ? this.map[key].concat(entity) : [entity]
    }
  }
  removeEntity(entity, depsMap) {
    for (const depsMapKey in depsMap) {
      this.map[depsMapKey].splice(this.map[depsMapKey].indexOf(entity), 1)
    }
  }
  getAllUniqueEntities() {
    const entities = []

    for (const mapKey in this.map) {
      const keyComponents = this.map[mapKey]
      for (let y = 0; y < keyComponents.length; y++) {
        if (entities.indexOf(keyComponents[y]) === -1) {
          entities.push(keyComponents[y])
        }
      }
    }

    return entities
  }
  getUniqueEntities(changesMap, currentKey = '') {
    let currentEntities = []
    for (const key in changesMap) {
      const pathKey = currentKey ?  currentKey + '.' + key : key

      let entities = []
      if (changesMap[key] === true) {
        if (this.map[pathKey]) {
          entities = entities.concat(this.map[pathKey])
        }
        if (this.map[pathKey + '.*']) {
          entities = entities.concat(this.map[pathKey + '.*'])
        }
        if (this.map[pathKey + '.**']) {
          entities = entities.concat(this.map[pathKey + '.**'])
        }
      } else {
        if (this.map[pathKey + '.*']) {
          const immediateKeys = Object.keys(changesMap[key])
          for (let z = 0; z < immediateKeys.length; z++) {
            if (changesMap[key][immediateKeys[z]] === true) {
              entities = entities.concat(this.map[pathKey + '.*'])
              break
            }
          }
        }
        if (this.map[pathKey + '.**']) {
          entities = entities.concat(this.map[pathKey + '.**'])
        }
      }

      for (let y = 0; y < entities.length; y++) {
        if (currentEntities.indexOf(entities[y]) === -1) {
          currentEntities.push(entities[y])
        }
      }

      if (changesMap[key] !== true) {
        currentEntities = currentEntities.concat(this.getUniqueEntities(changesMap[key], key))
      }
    }

    return currentEntities
  }
}

export default DependencyStore
