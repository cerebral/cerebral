import * as cerebral from 'cerebral'
import * as App from './main/types'

type State = App.State

type Sequences = App.Sequences

type Providers = App.Providers

export type Context = cerebral.IContext<{}> & Providers

export const state = cerebral.state as State
export const sequences = cerebral.sequences as Sequences
export const props = cerebral.props
