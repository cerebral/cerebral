import React from 'react';
import styles from './styles.css';

function getTime(date) {
  const hours = String(date.getHours()).length === 2 ? date.getHours() : '0' + date.getHours();
  const minutes = String(date.getMinutes()).length === 2 ? date.getMinutes() : '0' + date.getMinutes();
  const seconds = String(date.getSeconds()).length === 2 ? date.getSeconds() : '0' + date.getSeconds();
  return hours + ':' + minutes + ':' + seconds;
}

function extractPaths(paths) {
  const allPaths = [];
  function traverse(currentPaths, pathArray) {
    Object.keys(currentPaths).forEach(key => {
      pathArray.push(key);
      if (currentPaths[key] === true) {
        allPaths.push(pathArray.join('.'));
      } else {
        traverse(currentPaths[key], pathArray);
      }
      pathArray.pop();
    });
  }
  traverse(paths, []);

  return allPaths;
}

function unique(array) {
  return array.reduce((newArray, item) => {
    if (newArray.indexOf(item) === -1) {
      return newArray.concat(item);
    }

    return newArray;
  }, [])
}

class Renders extends React.Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.renderWrapper}>
          {this.props.renders.map((render, index) => {
            const date = new Date(render.start);

            return (
              <div className={styles.item} key={index}>
                <div className={styles.itemHeader}>
                  <strong>{getTime(date)}</strong> - {render.duration}ms
                </div>
                <div className={styles.renderDataWrapper}>
                  <div className={styles.paths}>
                    <div className={styles.pathsHeader}><small>Paths changed</small></div>
                    <div className={styles.pathsList}>
                      {extractPaths(render.changes || {}).map((path, index) => {
                        return (
                          <div className={styles.path} key={index}>
                            <strong>{path}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className={styles.components}>
                    <div className={styles.componentsHeader}><small>Components rendered</small></div>
                    <div className={styles.componentsList}>{unique(render.components).join(', ')}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

 export default Renders;
