/* eslint-disable */
import {action1, action2, action3, oldAsyncAction} from "./actions.js";

export default [
  action1,
  [
    action2,
    action3
  ],
  [
    oldAsyncAction
  ]
];
