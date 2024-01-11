import { stdin, stdout } from 'node:process';
import { Writable } from 'node:stream';

class MyWriter extends Writable {
  backwards(text: string): string {
    let back = '';
    for(let i = text.length - 1; i >= 0; i--) {
      back += text[i];
    }
    return back;
  }
  _write(chunk: Buffer, encoding: BufferEncoding, callback: Function) {
    const backwards = this.backwards(chunk.toString('utf8'));
    process.stdout.write(`${backwards} \n`);
    callback();
  }
}

const myWriter = new MyWriter();

stdin.pipe(myWriter);
