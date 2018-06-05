import * as tags from 'cerebral/tags'
import { IContext } from 'cerebral'
import * as App from './main/types'

type State = App.State

type Computed = App.Computed

type Sequences = App.Sequences

type Providers = App.Providers

export type Context = IContext<{}> & Providers

export const state = tags.state as State
export const sequences = tags.sequences as Sequences
export const computed = tags.computed as Computed
export const props = tags.props
