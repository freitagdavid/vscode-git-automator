import { exec } from './exec'

// biome-ignore lint/suspicious/noExplicitAny: git command output type
export async function gitPush(): Promise<any> {
  const command = 'git'
  const args = ['push', 'origin', 'HEAD']

  const output = await exec(command, args)

  return output
}
