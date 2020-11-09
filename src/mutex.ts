export const getMutex = () => {
  const queue: (() => void)[] = []
  let busy = 0

  const getLock = () => {
    const isLocked = busy > 0
    const lock = new Promise<void>(resolve => {
      queue.push(resolve)
    })

    busy++
    let released = false

    const releaser = () => {
      const resolve = queue.shift()
      if (resolve) {
        if (released) {
          busy--
        }
        released = true
        resolve()
      }
    }

    if (!isLocked) {
      releaser()
    }
    return [lock, releaser] as const
  }
  return { getLock }
}
