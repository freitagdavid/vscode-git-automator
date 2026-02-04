import { describe, expect, test } from 'bun:test'
import { deepMergeRight } from './deepMergeRight'

/**
 * Tests for deepMergeRight.ts with 100% coverage of every function.
 * Structure: one describe block per function (emptyTarget, cloneUnlessOtherwiseSpecified,
 * arrayMerge, mergeObject, deepMergeRight), with tests for every branch.
 */

describe('deepMergeRight', () => {
  describe('emptyTarget (indirect: via cloneUnlessOtherwiseSpecified)', () => {
    test('array branch: returns [] when value is array', () => {
      const target: unknown = []
      const source = [1, 2, 3]
      const result = deepMergeRight(target, source)
      expect(Array.isArray(result)).toBe(true)
      expect(result).toEqual([1, 2, 3])
    })

    test('object branch: returns {} when value is plain object', () => {
      const target = {}
      const source = { a: 1, b: 2 }
      expect(deepMergeRight(target, source)).toEqual({ a: 1, b: 2 })
    })
  })

  describe('cloneUnlessOtherwiseSpecified (indirect)', () => {
    test('mergeable path: objects are merged via deepMergeRight(emptyTarget(value), value)', () => {
      const target = { a: 1 }
      const source = { b: { c: 2 } }
      expect(deepMergeRight(target, source)).toEqual({ a: 1, b: { c: 2 } })
    })

    test('non-mergeable path: returns value as-is for primitives', () => {
      const target = { a: 1 }
      const source = { a: null, b: 'str', c: true }
      expect(deepMergeRight(target, source)).toEqual({ a: null, b: 'str', c: true })
    })

    test('non-mergeable path: returns value as-is for Date and RegExp', () => {
      const d = new Date('2025-01-01')
      const r = /bar/g
      const target = { a: 1 }
      const source = { a: d, b: r }
      const result = deepMergeRight(target, source)
      expect(result.a).toBe(d)
      expect(result.b).toBe(r)
    })
  })

  describe('arrayMerge (indirect: when both target and source are arrays)', () => {
    test('concatenates target and source', () => {
      const target = [1, 2]
      const source = [3, 4]
      expect(deepMergeRight(target, source)).toEqual([1, 2, 3, 4])
    })

    test('maps each element through cloneUnlessOtherwiseSpecified (primitives)', () => {
      expect(deepMergeRight([1], [2])).toEqual([1, 2])
    })

    test('maps each element through cloneUnlessOtherwiseSpecified (objects)', () => {
      const target = [{ a: 1 }]
      const source = [{ b: 2 }]
      const result = deepMergeRight(target, source)
      expect(result).toEqual([{ a: 1 }, { b: 2 }])
      expect(result[0]).not.toBe(target[0])
      expect(result[1]).not.toBe(source[0])
    })

    test('handles empty target and empty source', () => {
      expect(deepMergeRight([], [])).toEqual([])
      expect(deepMergeRight([1], [])).toEqual([1])
      expect(deepMergeRight([], [1, 2])).toEqual([1, 2])
    })
  })

  describe('mergeObject (indirect: when both target and source are objects)', () => {
    test('when isMergeableObject(target) is true: copies all target keys first', () => {
      const target = { a: 1, nested: { x: 10, y: 20 } }
      const source = { nested: { y: 99, z: 30 } }
      expect(deepMergeRight(target, source)).toEqual({
        a: 1,
        nested: { x: 10, y: 99, z: 30 },
      })
    })

    test('when isMergeableObject(target) is false: skips copying target keys', () => {
      const target = new Date('2020-01-01')
      const source = { a: 1, b: 2 }
      expect(deepMergeRight(target, source)).toEqual({ a: 1, b: 2 })
    })

    test('when isMergeableObject(target) is false (RegExp): skips copying target keys', () => {
      const target = /foo/
      const source = { a: 1 }
      expect(deepMergeRight(target, source)).toEqual({ a: 1 })
    })

    test('for each source key: !isMergeableObject(source[key]) → cloneUnlessOtherwiseSpecified', () => {
      const target = { a: { b: 1 } }
      const source = { a: 42 }
      expect(deepMergeRight(target, source)).toEqual({ a: 42 })
    })

    test('for each source key: !target[key] → cloneUnlessOtherwiseSpecified(source[key])', () => {
      const target = { a: 1 }
      const source = { b: { c: 2 } }
      expect(deepMergeRight(target, source)).toEqual({ a: 1, b: { c: 2 } })
    })

    test('for each source key: both mergeable and target[key] exists → deepMergeRight branch', () => {
      const target = { a: { b: 1, c: 2 } }
      const source = { a: { c: 99 } }
      expect(deepMergeRight(target, source)).toEqual({ a: { b: 1, c: 99 } })
    })
  })

  describe('deepMergeRight (public API)', () => {
    test('!sourceAndTargetTypesMatch: returns cloneUnlessOtherwiseSpecified(source)', () => {
      const target: unknown = []
      const source = { a: 1 }
      const result = deepMergeRight(target, source)
      expect(result).toEqual({ a: 1 })
      expect(result).not.toBe(source)
    })

    test('!sourceAndTargetTypesMatch (object vs array): returns clone of source array', () => {
      const target = { a: 1 }
      const source = [2, 3]
      expect(deepMergeRight(target, source)).toEqual([2, 3])
    })

    test('!sourceAndTargetTypesMatch with non-mergeable source: returns source as-is', () => {
      const target = [1]
      const source = /baz/
      const result = deepMergeRight(target, source)
      expect(result).toBe(source)
    })

    test('sourceIsArray: returns arrayMerge(target, source)', () => {
      const target = [1, 2]
      const source = [3, 4]
      expect(deepMergeRight(target, source)).toEqual([1, 2, 3, 4])
    })

    test('else: returns mergeObject(target, source)', () => {
      const target = { a: 1, b: 2 }
      const source = { b: 20, c: 3 }
      expect(deepMergeRight(target, source)).toEqual({ a: 1, b: 20, c: 3 })
    })

    test('does not mutate target or source', () => {
      const target = { a: 1, n: { x: 1 } }
      const source = { b: 2, n: { y: 2 } }
      const targetCopy = JSON.parse(JSON.stringify(target))
      const sourceCopy = JSON.parse(JSON.stringify(source))
      deepMergeRight(target, source)
      expect(target).toEqual(targetCopy)
      expect(source).toEqual(sourceCopy)
    })
  })
})
