import { getMutex } from "../mutex";

describe("getMutex", () => {
  it("executes read/writes in order", async () => {
    const mutex = getMutex();
    let i = 1;
    const inc = async () => {
      const [lock, release] = mutex.getLock();
      await lock;

      // read current value
      const temp = i;

      // Async action: give control flow to the next function before changing value
      await Promise.resolve();
      i = temp + 1;

      release();
    };
    await Promise.all([inc(), inc(), inc(), inc()]);
    expect(i).toBe(5);
  });
});
