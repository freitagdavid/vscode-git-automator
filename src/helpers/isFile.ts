// biome-ignore lint/style/useNodejsImportProtocol: Node builtin
import { lstatSync } from 'fs'

export function isFile(fileAbsolutePath: string): boolean {
  try {
    if (lstatSync(fileAbsolutePath).isFile()) {
      return true
    }

    return false
  } catch (_err) {
    return false
  }
}
