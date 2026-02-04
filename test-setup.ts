/**
 * Preloaded before bun test. Mocks the 'vscode' module so tests that import
 * from 'vscode' (e.g. helpers/exec.ts) run without the real VS Code runtime.
 */
import { mock } from 'bun:test'
import { join } from 'path'

const projectRoot = join(import.meta.dir, '..')

mock.module('vscode', () => ({
  window: {
    showErrorMessage: mock(() => {}),
    showInformationMessage: mock(() => {}),
    showWarningMessage: mock(() => {}),
    showOpenDialog: mock(() => {}),
    createOutputChannel: mock(() => ({
      appendLine: mock(() => {}),
      show: mock(() => {}),
      clear: mock(() => {}),
      dispose: mock(() => {}),
    })),
    withProgress: mock((_options: unknown, task: (progress: unknown) => Promise<unknown>) => task({})),
  },
  workspace: {
    getConfiguration: mock(() => ({})),
    workspaceFolders: [
      {
        uri: { fsPath: projectRoot },
        name: 'test-workspace',
        index: 0,
      },
    ],
  },
  commands: {
    registerCommand: mock(() => ({ dispose: mock(() => {}) })),
    executeCommand: mock(() => Promise.resolve()),
  },
  ProgressLocation: { Window: 1, SourceControl: 2, Notification: 15 },
  Uri: {
    file: (path: string) => ({ fsPath: path }),
  },
  Disposable: class {},
  Event: class {},
}))
