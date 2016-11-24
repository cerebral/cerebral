/* eslint-disable */
import {connect as Cerebral} from 'cerebral/react';
import {limitedList} from "./limitedList";
import {anotherComputed} from "./anotherComputed";

@Cerebral({
  anotherComputed: anotherComputed(),
  limitedList: limitedList({ foo: "bar" }),
  myState: "path.to.state"
})
export default class List {
  render() {
    return <div />;
  }
}
