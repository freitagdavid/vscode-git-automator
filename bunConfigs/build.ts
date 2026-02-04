import Bun from 'bun'

const build = async (): Promise<void> => {
  await Bun.build({
    entrypoints: ['src/extension.ts'],
    external: ['vscode', 'path', 'child_process', 'fs'],
    format: 'cjs',
    minify: true,
    outdir: 'out',
    sourcemap: true,
    splitting: true,
    target: 'node', // "es2015" is not a valid value, use a valid Target like "bun", "browser", or "node"
  })
}

build()
