import { assign, cloneDeep, concat, isArray } from 'radashi'
import { isMergeableObject } from './isMergeableObject'

function cloneUnlessOtherwiseSpecified<T>(value: T): T {
  return (isMergeableObject(value) ? cloneDeep(value as object) : value) as T
}

export function deepMergeRight(target: unknown, source: unknown): unknown {
  const sourceIsArray = isArray(source)
  const targetIsArray = isArray(target)
  if (sourceIsArray !== targetIsArray) return cloneUnlessOtherwiseSpecified(source)
  if (sourceIsArray) return concat(target as unknown[], source as unknown[]).map(cloneUnlessOtherwiseSpecified)
  return isMergeableObject(target) ? assign(target as object, source as object) : assign({}, source as object)
}
