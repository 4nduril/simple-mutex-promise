# simple-mutex

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Build Status](https://www.travis-ci.com/4nduril/simple-mutex.svg?branch=main)](https://www.travis-ci.com/4nduril/simple-mutex)

This library provides a very simple [mutex/lock](https://en.wikipedia.org/wiki/Lock_(computer_science)) implementation in JavaScript.

## Usage

### The problem

You have an operation / a function that does the following:
1. A value from outside of the operation is read.
2. An asynchronous action takes place which leads to giving the execution context to another part of the code.
3. That other part of the code (can also be another invocation of the same function) does also use the value from outside. Also potentially modifying it.
4. The first (invocation of the) operation continues and writes a *changed* value to the same place (variable) that was read from initially.

This kind of code can lead to race conditions where a stale value is read, modified and written back while other parts of the code have already changed it by themselves. One very simple example is shown as unit test case: [](./src/__tests__/mutex.spec.ts).

### The solution

Before the value in question is read and potentially modified a lock or mutex (mutual exclusion) has to be aquired which blocks (or queues) other parts of the code from accessing the same value. Once the operation is done the lock is released and if other code already tried to access the variable they are informed that execution can continue.

### Usage with this library

Install it with npm

```shell
npm install simple-mutex
```

or with yarn

```shell
yarn add simple-mutex
```

In your code import it and create the mutex instance *outside* of the critical function:

```typescript
import { getMutex } from 'simple-mutex'

const mutex = getMutex()
```

It is important that all parts of the code that access the value in question use the same instance returned from `getMutex()`.

Then acquire the lock inside the critical function before __any__ and release it after __every__ usage of the variable is done:
```typescript

let i = 1

async function criticalAsyncFunction() {
  const [lock, release] = mutex.getLock()
  await lock                               // 1

  const temp = i

  await someAsyncAction()                  // 2
  i = temp + 1

  release()                                // 3
}
```

Before the outside value is used we `await` the lock `(1)`. So function execution is paused and only continued when the `lock` resolves. Then we can read the value and use it `(2)`. In this case we don't use the value in the async action but typically that would be the case. After writing to the outside variable is done we release the lock and now other execution contexts can make use of the value `(3)`. We made sure that other code is only run when all our updates are done.

## Types

`simple-mutex` is written in TypeScript and type declarations are also part of the build. You don't need to install them separately.
