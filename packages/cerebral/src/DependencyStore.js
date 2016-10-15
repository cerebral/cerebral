class DependencyStore {
  constructor () {
    this.map = {}
  }
  /*
    Adds the entity to all the depending paths
  */
  addEntity (entity, depsMap) {
    for (const depsMapKey in depsMap) {
      const key = depsMap[depsMapKey]
      this.map[key] = this.map[key] ? this.map[key].concat(entity) : [entity]
    }
  }
  /*
    Removes the entity from all depending paths
  */
  removeEntity (entity, depsMap) {
    for (const depsMapKey in depsMap) {
      const key = depsMap[depsMapKey]
      this.map[key].splice(this.map[key].indexOf(entity), 1)
    }
  }
  /*
    As same entity can appear in multiple paths, this method returns
    all unique entities. Used by view to render all components
  */
  getAllUniqueEntities () {
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
  /*
    Converts the changes map from "flush" to an array of paths
  */
  convertChangeMap (currentLevel, details = {currentPath: [], allPaths: []}) {
    Object.keys(currentLevel).forEach((key) => {
      details.currentPath.push(key)
      if (currentLevel[key] === true) {
        details.allPaths.push(details.currentPath.join('.'))
      } else {
        this.convertChangeMap(currentLevel[key], details)
      }
      details.currentPath.pop()
    })

    return details.allPaths
  }
  /*
    Returns entities based on a change map returned from
    the model flush method. It does this by checking if
    the changed path is part of any dependency path, or
    the opposite. "foo.bar.baz" will cause change on dependency
    "foo.bar" (dependency part of change path), and "foo.bar" will
    cause change on dependency "foo.bar.baz" (change path part of dependency path)
  */
  getUniqueEntities (changesMap) {
    let entities = []
    const paths = this.convertChangeMap(changesMap)

    for (const mapKey in this.map) {
      for (const pathKey in paths) {
        const path = paths[pathKey]

        if (mapKey.indexOf(path) === 0 || path.indexOf(mapKey) === 0) {
          for (const componentIndex in this.map[mapKey]) {
            if (entities.indexOf(this.map[mapKey][componentIndex]) === -1) {
              entities.push(this.map[mapKey][componentIndex])
            }
          }
        }
      }
    }

    return entities
  }
  /*
    Returns entities using strict path definition based on a
    change map returned from the model flush method
  */
  getStrictUniqueEntities (changesMap, currentKey = '') {
    let currentEntities = []
    for (const key in changesMap) {
      const pathKey = currentKey ? currentKey + '.' + key : key

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
        currentEntities = currentEntities.concat(this.getStrictUniqueEntities(changesMap[key], pathKey))
      }
    }

    return currentEntities
  }
}

export default DependencyStore
