import React from 'react';
import styles from './styles.css';
import connector from 'connector';

class StatePaths extends React.Component {
  componentMapPathClick(path) {
    connector.sendEvent('componentMapPath', path);
  }
  render() {
    let uniqueComponents = [];

    return (
      <div className={styles.wrapper}>
        <div className={styles.componentsWrapper}>
          <div
            key="header"
            className={styles.itemHeader}
          >
            <div className={styles.pathName}>
              {Object.keys(this.props.map).length} <small>active state paths</small>
            </div>
            <div className={styles.components}>
              {Object.keys(this.props.map).reduce((count, key) => {
                const components = this.props.map[key].filter(component => uniqueComponents.indexOf(component) === -1);
                uniqueComponents = uniqueComponents.concat(components);
                return count + components.length;
              }, 0)} {' '} <small>registered components</small>
            </div>
          </div>
          {Object.keys(this.props.map).map(key => {
            return (
              <div
                key={key}
                className={styles.item}
                onClick={() => this.componentMapPathClick({
                  mapPath: key
                })}
              >
                <div className={styles.pathName}>{key}</div>
                <div className={styles.components}>
                  {this.props.map[key].map((component) => {
                    return component.name
                  }).join(', ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

 export default StatePaths;
