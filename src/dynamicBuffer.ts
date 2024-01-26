export interface DynamicBuf {
  data: Buffer;
  length: number;
}

export function bufPush(buf: DynamicBuf, data: Buffer): void {
  const newLen = buf.length + data.length;

  if (newLen > buf.data.length) {
    let cap = Math.max(buf.data.length, 32);
    while (cap < newLen) {
      cap *= 2;
    }

    const grownBuffer = Buffer.alloc(cap);
    buf.data.copy(grownBuffer, 0, 0);
    buf.data = grownBuffer;
  }

  data.copy(buf.data, buf.length, 0);
  buf.length = newLen;
}

export function bufPop(): void {}
