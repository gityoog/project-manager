export function diff<T extends Record<string, any>>(origin: T, target: T) {
  const originKeys = getKeys(origin)
  const targetKeys = getKeys(target)
  if (originKeys.length !== targetKeys.length) {
    return true
  }
  for (const key of originKeys) {
    if (isObject(origin[key]) && isObject(target[key])) {
      if (diff(origin[key], target[key])) {
        return true
      }
    } else {
      if (origin[key] !== target[key]) {
        return true
      }
    }
  }
  return false
}

function getKeys(data: Record<string, any>) {
  const keys = []
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      keys.push(key)
    }
  }
  return keys
}

function isObject(data: unknown): data is Record<string, any> {
  return typeof data === 'object' && data !== null
}