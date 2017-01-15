import {dependencyMatch} from './utils'

class DependencyStore {
  constructor () {
    this.map = {}
  }
  /*
    Adds the entity to all the depending paths
  */
  addEntity (entity, depsMap) {
    for (const depsMapKey in depsMap) {
      this.map[depsMapKey] = this.map[depsMapKey] ? this.map[depsMapKey].concat(entity) : [entity]
    }
  }
  /*
    Removes the entity from all depending paths
  */
  removeEntity (entity, depsMap) {
    for (const depsMapKey in depsMap) {
      this.map[depsMapKey].splice(this.map[depsMapKey].indexOf(entity), 1)
    }
  }
  /*
    Updates entity based on changed dependencies
  */
  updateEntity (entity, prevDepsMap, nextDepsMap) {
    const toRemove = Object.keys(prevDepsMap).filter((prevKey) => !(prevKey in nextDepsMap))
    const toAdd = Object.keys(nextDepsMap).filter((nextKey) => !(nextKey in prevDepsMap))

    toRemove.forEach((depsMapKey) => {
      this.map[depsMapKey].splice(this.map[depsMapKey].indexOf(entity), 1)
    })

    toAdd.forEach((depsMapKey) => {
      this.map[depsMapKey] = this.map[depsMapKey] ? this.map[depsMapKey].concat(entity) : [entity]
    })
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
    the model flush method.
  */
  getUniqueEntities (changesMap) {
    return dependencyMatch(changesMap, this.map)
  }
}

export default DependencyStore
