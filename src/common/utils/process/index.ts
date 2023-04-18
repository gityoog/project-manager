import { exec, spawn, ChildProcessWithoutNullStreams } from 'child_process'

type pid = number | string
type ThreadTree = { [pid: pid]: pid[] }
type ThreadPids = { [pid: pid]: pid }

function ProcessKill(pid: pid, signal: string, callback?: () => void): void
function ProcessKill(pid: pid, callback?: () => void): void
function ProcessKill(pid: pid, arg1?: string | (() => void), arg2?: () => void) {

  const tree: ThreadTree = {}
  const pidsToProcess: ThreadPids = {}

  tree[pid] = []
  pidsToProcess[pid] = 1

  const signal = typeof arg1 === 'string' ? arg1 : 'SIGKILL'
  const callback = typeof arg1 === 'function' ? arg1 : arg2

  switch (process.platform) {
    // win32
    case 'win32':
      exec('taskkill /pid ' + pid + ' /T /F', callback)
      break
    // darwin
    case 'darwin':
      buildProcessTree(pid, tree, pidsToProcess, function (parentPid) {
        return spawn('pgrep', ['-P', parentPid.toString()])
      }, function () {
        killAll(tree, signal, callback)
      })
      break
    // linux
    default:
      buildProcessTree(pid, tree, pidsToProcess, function (parentPid) {
        return spawn('ps', ['-o', 'pid', '--no-headers', '--ppid', parentPid.toString()])
      }, function () {
        killAll(tree, signal, callback)
      })
      break
  }
};

function killAll(tree: ThreadTree, signal: string, callback?: (error?: unknown) => void) {
  const killed: Record<pid, number> = {}

  try {
    Object.keys(tree).forEach(function (pid) {
      tree[pid].forEach(function (pidpid) {
        if (!killed[pidpid]) {
          killPid(pidpid, signal)
          killed[pidpid] = 1
        }
      })

      if (!killed[pid]) {
        killPid(pid, signal)
        killed[pid] = 1
      }
    })
  } catch (error) {
    if (callback) {
      return callback(error)
    } else {
      throw error
    }
  }

  if (callback) {
    return callback()
  }
}

function killPid(pid: pid, signal: string) {
  try {
    process.kill(typeof pid === 'string' ? parseInt(pid, 10) : pid, signal)
  } catch (error: any) {
    if (error.code !== 'ESRCH') throw error
  }
}

function buildProcessTree(parentPid: pid, tree: ThreadTree, pidsToProcess: ThreadPids, spawnChildProcessesList: (pid: pid) => ChildProcessWithoutNullStreams, callback: () => void) {
  var allData = ''
  var ps = spawnChildProcessesList(parentPid)

  ps.stdout.on('data', function (data) {
    allData += data.toString('ascii')
  })

  var onClose = function (code: number) {
    delete pidsToProcess[parentPid]
    if (code !== 0) {
      if (Object.keys(pidsToProcess).length === 0) {
        callback()
      }
      return
    }
    allData.match(/\d+/g)?.forEach(function (item) {
      const pid = parseInt(item, 10)
      tree[parentPid].push(pid)
      tree[pid] = []
      pidsToProcess[pid] = 1
      buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, callback)
    })
  }

  ps.on('close', onClose)
}

export default ProcessKill