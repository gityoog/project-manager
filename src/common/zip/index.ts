import JSZip from "jszip"
import fs from "fs"
import Path from "path"

export async function zipFolder<T extends JSZip.OutputType>(path: string, options?: JSZip.JSZipGeneratorOptions<T>) {
  const zipper = new JSZip()
  const fullpath = Path.resolve(path)
  await zipFolderRec(fullpath, zipper)
  return zipper.generateAsync(options)
}

async function zipFolderRec(path: string, zipper: JSZip) {
  return new Promise<void>((resolve, reject) => {
    fs.readdir(path, async (err, entries) => {
      if (err) return reject(err)
      for (const entry of entries) {
        const fullpath = Path.resolve(path, entry)
        await new Promise<void>((resolve, reject) => {
          fs.stat(fullpath, (err, stats) => {
            if (err) return reject(err)
            if (stats.isDirectory()) {
              resolve(zipFolderRec(fullpath, zipper.folder(entry)!))
            } else {
              fs.readFile(fullpath, (err, file) => {
                if (err) return reject(err)
                zipper.file(entry, file)
                resolve()
              })
            }
          })
        })
      }
      resolve()
    })
  })
}