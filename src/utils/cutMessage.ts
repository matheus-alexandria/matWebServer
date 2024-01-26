import { DynamicBuf, bufPop } from "../dynamicBuffer";

export function cutMessage(buf: DynamicBuf): null | Buffer {
  const EOLIndex = buf.data.subarray(0, buf.length).indexOf('\n');

  if (EOLIndex < 0) {
    return null;
  }

  const msg = Buffer.from(buf.data.subarray(0, EOLIndex + 1));
  bufPop(buf, EOLIndex + 1);
  return msg;
}
