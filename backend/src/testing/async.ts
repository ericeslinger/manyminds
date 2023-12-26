export function wait(n: number) {
  return new Promise((resolve) => setTimeout(resolve, n));
}

export async function serialize(p: Array<Promise<unknown>>) {
  for (const prom of p) {
    await prom;
  }
}

export function parallelize(p: Array<Promise<unknown>>) {
  return Promise.all(p);
}

export function parallelizeWithDelay(p: Array<Promise<unknown>>) {
  return Promise.all(p.map((task) => wait(randUp(50)).then(() => task)));
}

export function randUp(n: number) {
  return Math.floor(Math.random() * n) + 1;
}
