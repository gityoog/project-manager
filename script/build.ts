import { rimrafSync } from 'rimraf'
import path from 'path'
import { spawn } from 'child_process'
import Ncc from '@vercel/ncc'
import fs from 'fs'

(async () => {
  const cwd = path.resolve(__dirname, '../')
  console.log('Clear ...')
  rimrafSync(path.resolve(cwd, './dist'))
  console.log('Building web...')
  await buildWeb(cwd)
  console.log('Building server...')
  await buildServer(cwd)
  console.log('Build success!')
})()

async function buildWeb(cwd: string) {
  return new Promise<number | null>((resolve, reject) => {
    const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
      cwd: path.resolve(cwd, './packages/web'),
      stdio: 'inherit',
      env: process.env
    })
    child.on('exit', (code) => {
      resolve(code)
    })
  })
}

async function buildServer(cwd: string) {
  return Ncc(path.resolve(cwd, './src/bin.ts'), {
    transpileOnly: true
  }).then(({ err, code, assets, symlinks }) => {
    if (err) {
      throw err
    }
    const dist = path.resolve(cwd, './dist')
    if (!fs.existsSync(dist)) {
      fs.mkdirSync(dist)
    }
    fs.writeFileSync(path.resolve(dist, 'index.js'), code)
    for (const name in assets) {
      // exclude client-dist
      if (/^client-dist/.test(name)) {
        continue
      }
      const file = path.resolve(dist, name)
      const content = assets[name]
      const dir = path.dirname(file)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(file, content.source, { mode: content.permissions })
    }
    for (const name in symlinks) {
      const symlinkPath = path.resolve(dist, name)
      fs.symlinkSync(symlinks[name], symlinkPath)
    }
    if (process.platform === 'win32') {
      fs.copyFileSync(path.resolve(cwd, 'node_modules/node-pty/build/Release/winpty-agent.exe'), path.resolve(dist, 'build/Release/winpty-agent.exe'))
    }
  })
}