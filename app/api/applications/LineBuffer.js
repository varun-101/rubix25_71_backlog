// Offset-based follower using Node core only (fs.watch + stat fallback).
// Emits complete lines; handles rotation & copytruncate.
const fs = require('fs');
const fsp = require('fs/promises');
const { EventEmitter } = require('events');
const path = require('path');

class LineBuffer {
  constructor(maxLineBytes = 1024 * 1024) { this._carry = ''; this.max = maxLineBytes; }
  feed(chunkStr) {
    const s = this._carry + chunkStr;
    const parts = s.split(/\r?\n/);
    this._carry = parts.pop() ?? '';
    return parts.map(x => (x.length > this.max ? x.slice(0, this.max) + '…' : x));
  }
  flush() { if (!this._carry) return []; const x = this._carry; this._carry=''; return [x]; }
}

class FileTailer extends EventEmitter {
  constructor(filePath, { pollMs = 300, readBlock = 64 * 1024, maxLineBytes = 1024 * 1024 } = {}) {
    super();
    this.path = filePath;
    this.pollMs = pollMs;
    this.readBlock = readBlock;
    this.lineBuf = new LineBuffer(maxLineBytes);
    this.fd = null; this.offset = 0; this.timer = null; this.watcher = null; this.devIno = null;
  }

  async _openAtEnd() {
    this.fd = await fsp.open(this.path, 'r');
    const st = await this.fd.stat();
    this.devIno = ${st.dev}:${st.ino};
    this.offset = st.size; // start at end; initial seed done separately
  }

  async start() {
    await fsp.mkdir(path.dirname(this.path), { recursive: true });
    try { await fsp.access(this.path); } catch { await fsp.writeFile(this.path, ''); }
    await this._openAtEnd();

    this.watcher = fs.watch(this.path, { persistent: true }, () => this._tick().catch(()=>{}));
    this.timer = setInterval(() => this._tick().catch(()=>{}), this.pollMs);
    await this._tick();
  }

  async stop() {
    if (this.timer) clearInterval(this.timer);
    if (this.watcher) this.watcher.close();
    if (this.fd) await this.fd.close();
  }

  async _reopenIfRotatedOrTruncated() {
    const st = await fsp.stat(this.path).catch(() => null);
    if (!st) return;
    const now = ${st.dev}:${st.ino};
    if (now !== this.devIno) {
      if (this.fd) await this.fd.close().catch(()=>{});
      this.fd = await fsp.open(this.path, 'r');
      this.devIno = now;
      this.offset = 0;
      this.emit('rotate');
    } else if (st.size < this.offset) {
      this.offset = 0;
      this.emit('truncate');
    }
  }

  async _tick() {
    if (!this.fd) return;
    await this._reopenIfRotatedOrTruncated();

    const st = await this.fd.stat().catch(() => null);
    if (!st) return;

    let remaining = st.size - this.offset;
    while (remaining > 0) {
      const len = Math.min(remaining, this.readBlock);
      const buf = Buffer.allocUnsafe(len);
      const { bytesRead } = await this.fd.read({ buffer: buf, position: this.offset });
      if (!bytesRead) break;
      this.offset += bytesRead;
      remaining -= bytesRead;
      const lines = this.lineBuf.feed(buf.toString('utf8', 0, bytesRead));
      for (const line of lines) this.emit('line', line);
    }
  }
}

module.exports = { FileTailer };
