import { exec } from './exec'

// biome-ignore lint/suspicious/noExplicitAny: git command output type
export async function gitCommit(message: string): Promise<any> {
  const command = 'git'
  const args = ['commit', '-m', `${message}`]

  const output = await exec(command, args)

  return output
}
