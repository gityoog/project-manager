import { ModuleMetadata } from "@nestjs/common"

export function mergeModuleMetadata(...data: ModuleMetadata[]) {
  return {
    controllers: data.map(d => d.controllers || []).reduce((a, b) => a.concat(b), []),
    providers: data.map(d => d.providers || []).reduce((a, b) => a.concat(b), []),
    imports: data.map(d => d.imports || []).reduce((a, b) => a.concat(b), []),
    exports: data.map(d => d.exports || []).reduce((a, b) => a.concat(b), []),
  } as ModuleMetadata
}