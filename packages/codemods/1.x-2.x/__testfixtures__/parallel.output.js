/* eslint-disable */
import {action1, action2, action3, oldAsyncAction} from "./actions.js";

import { parallel } from "cerebral";

export default [
  action1,
  parallel([action2, action3]),
  parallel([oldAsyncAction])
];
