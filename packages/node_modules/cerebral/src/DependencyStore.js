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
      const path = depsMapKey.split('.')

      path.reduce((currentMapLevel, key, index) => {
        if (!currentMapLevel[key]) {
          currentMapLevel[key] = {}
        }

        if (index < path.length - 1) {
          currentMapLevel[key].children = currentMapLevel[key].children || {}

          return currentMapLevel[key].children
        }

        currentMapLevel[key].entities = currentMapLevel[key].entities ? currentMapLevel[key].entities.concat(entity) : [entity]

        return currentMapLevel
      }, this.map)
    }
  }
  /*
    Removes the entity from all depending paths
  */
  removeEntity (entity, depsMap) {
    for (const depsMapKey in depsMap) {
      const path = depsMapKey.split('.')
      path.reduce((currentMapLevel, key, index) => {
        if (index === path.length - 1) {
          currentMapLevel[key].entities.splice(currentMapLevel[key].entities.indexOf(entity), 1)

          if (!currentMapLevel[key].entities.length) {
            delete currentMapLevel[key].entities
          }
        }

        return currentMapLevel[key].children
      }, this.map)
    }
  }
  /*
    Updates entity based on changed dependencies
  */
  updateEntity (entity, prevDepsMap, nextDepsMap) {
    const toRemove = Object.keys(prevDepsMap).reduce((removeDepsMap, prevDepsMapKey) => {
      if (!nextDepsMap[prevDepsMapKey]) {
        removeDepsMap[prevDepsMapKey] = true
      }

      return removeDepsMap
    }, {})
    const toAdd = Object.keys(nextDepsMap).reduce((addDepsMap, nextDepsMapKey) => {
      if (!prevDepsMap[nextDepsMapKey]) {
        addDepsMap[nextDepsMapKey] = true
      }

      return addDepsMap
    }, {})

    this.removeEntity(entity, toRemove)

    this.addEntity(entity, toAdd)
  }
  /*
    As same entity can appear in multiple paths, this method returns
    all unique entities. Used by view to render all components
  */
  getAllUniqueEntities () {
    const entities = []

    function traverseChildren (children) {
      for (const childKey in children) {
        if (children[childKey].entities) {
          for (let y = 0; y < children[childKey].entities.length; y++) {
            if (entities.indexOf(children[childKey].entities[y]) === -1) {
              entities.push(children[childKey].entities[y])
            }
          }
        }

        if (children[childKey].children) {
          traverseChildren(children[childKey].children)
        }
      }
    }
    traverseChildren(this.map)

    return entities
  }
  /*
    Returns entities based on a change map returned from
    the model flush method.
  */
  getUniqueEntities (changesMap) {
    return dependencyMatch(changesMap, this.map).reduce((unique, match) => {
      return (match.entities || []).reduce((currentUnique, entity) => {
        if (currentUnique.indexOf(entity) === -1) {
          return currentUnique.concat(entity)
        }

        return currentUnique
      }, unique)
    }, [])
  }
}

export default DependencyStore
