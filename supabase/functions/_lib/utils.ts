export function getObjectWithMostKeys<T = object>(result: {
  [key: string]: unknown
}): T {
  let maxKeys = 0
  let objectWithMostKeys: object = {}

  for (const key in result) {
    const currentObject = result[key]
    if (
      !currentObject ||
      typeof currentObject === 'string' ||
      Array.isArray(currentObject)
    ) {
      continue
    }

    const keyCount = Object.keys(currentObject).length

    if (keyCount > maxKeys) {
      maxKeys = keyCount
      objectWithMostKeys = currentObject
    }
  }

  return objectWithMostKeys as T
}
