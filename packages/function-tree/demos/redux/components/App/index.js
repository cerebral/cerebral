import React from 'react';
import styles from './styles.css';
import run from '../../run'

import AddAssignment from '../AddAssignment';
import Assignments from '../Assignments';

import appMounted from '../../events/appMounted';

class App extends React.Component {
  componentDidMount() {
    run('appMounted', appMounted);
  }
  render() {
    return (
      <div className={styles.wrapper}>
        <AddAssignment />
        <Assignments />
      </div>
    );
  }
}

export default App;
