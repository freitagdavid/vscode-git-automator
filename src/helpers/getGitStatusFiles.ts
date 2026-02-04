import type { GitStatusFile } from '../types'
import { gitStatus } from './gitStatus'

interface GitShortActions {
  [action: string]: GitStatusFile['state']
}

const GIT_SHORT_ACTIONS: GitShortActions = {
  A: 'ADDED',
  D: 'DELETED',
  M: 'MODIFIED',
  R: 'RENAMED',
}

export async function getGitStatusFiles(): Promise<GitStatusFile[]> {
  let gitStatusStdOut = ''
  try {
    gitStatusStdOut = await gitStatus()
  } catch (err) {
    console.error(err)
  }

  const matches = gitStatusStdOut.match(/[^\r\n]+/g)

  return matches === null
    ? []
    : matches.reduce((linesPartial: GitStatusFile[], line: string) => {
        if (line.length === 0) {
          return linesPartial
        }

        const reg = line[0] === 'R' ? /^(\w)\s+(.*)(?=\s->\s|$)(\s->\s)(.*)/ : /^(\w)\s+(.*)/
        const regRes = line.match(reg)

        if (regRes === null || (regRes.length !== 3 && regRes.length !== 5)) {
          return linesPartial
        }

        linesPartial.push(
          Object.assign(
            {
              path: regRes[2],
              state: GIT_SHORT_ACTIONS[regRes[1]],
            },
            line[0] === 'R'
              ? {
                  oldPath: regRes[2],
                  path: regRes[4],
                }
              : undefined,
          ),
        )

        return linesPartial
      }, [])
}
