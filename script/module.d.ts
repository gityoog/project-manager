declare module '@vercel/ncc' {
  type options = {
    cache?: string | false
    externals?: string[]
    filterAssetBase?: string
    minify?: boolean
    sourceMap?: boolean
    assetBuilds?: boolean
    sourceMapBasePrefix?: string
    sourceMapRegister?: boolean
    license?: string
    v8cache?: boolean
    quiet?: boolean
    debugLog?: boolean
    transpileOnly?: boolean
  }
  type result = {
    err: Error | null
    code: string
    map: string
    assets: Record<string, { source: Buffer, permissions: number }>
    symlinks: Record<string, string>
  }
  function Ncc(input: string, options?: options & { watch?: false }): Promise<result>
  function Ncc(input: string, options?: options & { watch: true }): {
    handler(callback: (data: result) => void): void
    rebuild(callback: () => void): void
    close(): void
  }
  function Ncc(input: string, options?: options & { watch?: boolean }): Promise<result> | {
    handler(callback: (data: result) => void): void
    rebuild(callback: () => void): void
    close(): void
  }

  export default Ncc
}