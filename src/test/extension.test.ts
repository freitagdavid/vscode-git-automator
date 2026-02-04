import { copySync, mkdirSync } from 'fs-extra'
// biome-ignore lint/style/useNodejsImportProtocol: Node builtin
import { join } from 'path'
import { beforeAll, describe, expect, test } from 'bun:test'

import { exec } from '../helpers/exec'

describe('Git Automator Extension Tests', () => {
  const fixturesSourcePath = join(import.meta.dir, 'fixtures')
  const fixturesPath = join(import.meta.dir, 'fixtures', 'run')

  beforeAll(() => {
    mkdirSync(fixturesPath, { recursive: true })
    copySync(join(fixturesSourcePath, 'sample.md'), join(fixturesPath, 'sample.md'))
  })

  test('Test helpers/exec()', async () => {
    let command: string
    switch (process.platform) {
      case 'win32':
        command = 'type'
        break

      default:
        command = 'cat'
        break
    }

    // biome-ignore lint/suspicious/noExplicitAny: test output/error
    let output: any
    // biome-ignore lint/suspicious/noExplicitAny: test output/error
    let error: any
    try {
      output = await exec(command, [join(fixturesPath, 'sample.md')])
    } catch (e) {
      error = e
    }

    expect(error).toBeUndefined()
    expect(output).toBe('# Hello World !\n')
  })
})
