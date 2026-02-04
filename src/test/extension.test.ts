// biome-ignore lint/style/useNodejsImportProtocol: Node builtin
import { strictEqual } from 'assert'
import { copySync } from 'fs-extra'
// biome-ignore lint/style/useNodejsImportProtocol: Node builtin
import { join } from 'path'

import { exec } from '../helpers/exec'

suite('Git Automator Extension Tests', () => {
  const fixturesPath = join(__dirname, 'fixtures')
  const fixturesSourcePath = join(__dirname, '..', '..', 'src', 'test', 'fixtures')

  suiteSetup(() => {
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

    strictEqual(undefined, error)
    strictEqual('# Hello World !\n', output)
  })
})
