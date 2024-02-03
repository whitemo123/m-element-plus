import * as Undertaker from 'undertaker'
import { run } from './process'
import { buildRoot } from '../constant'

export const withTaskName = <T extends Undertaker.TaskFunction>(name: string, fn: T) =>
  Object.assign(fn, { displayName: name })

export const runTask = (name: string) =>
  withTaskName(`shellTask:${name}`, () =>
    run(`pnpm run start ${name}`, buildRoot)
  )
