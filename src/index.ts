import { stdin, stdout } from 'node:process';
import { Writable } from 'node:stream';

class MyWriter extends Writable {
  _write(chunk: Buffer, encoding: BufferEncoding, callback: Function) {
    process.stdout.write(`Hey, I wrote this:  ${chunk.toString('utf8')}`);
    callback();
  }
}

const myWriter = new MyWriter();

stdin.pipe(myWriter);
