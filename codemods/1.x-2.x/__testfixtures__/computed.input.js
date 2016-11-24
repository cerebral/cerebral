/* eslint-disable */
import {connect as Cerebral} from 'cerebral/react';
import {limitedList} from "./limitedList";
import {anotherComputed} from "./anotherComputed";

export default Cerebral({
  anotherComputed: anotherComputed(),
  limitedList: limitedList({ foo: "bar" }),
  myState: "path.to.state"
},
  function List(props) {

  }
)
