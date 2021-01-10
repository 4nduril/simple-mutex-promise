export const getMutex = () => {
  const queue: (() => void)[] = []
  let busy = 0

  const getLock = () => {
    const isLocked = busy > 0

    const lock = new Promise<void>(resolve => {
      if (!isLocked) {
        resolve()
        return
      }
      queue.push(resolve)
    })

    busy++

    const releaser = () => {
      const resolve = queue.shift()
      busy--
      if (resolve) {
        resolve()
      }
    }

    return [lock, releaser] as const
  }
  return { getLock }
}
