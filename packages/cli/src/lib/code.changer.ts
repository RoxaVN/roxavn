import { readFileSync, writeFileSync } from 'fs';

export class CodeChanger {
  private lines: string[];
  private fromLine = 0;
  private toLine = 0;
  private filePath: string;
  private startMarker: string;
  private endMarker: string;

  constructor(filePath: string, startMarker: string, endMarker: string) {
    const data = readFileSync(filePath, { encoding: 'utf-8' });
    this.lines = data.split('\n');
    this.filePath = filePath;
    this.startMarker = startMarker;
    this.endMarker = endMarker;
    this.update();
  }

  insertStart(line: string) {
    this.lines.splice(this.fromLine + 1, 0, line);
    this.toLine += 1;
    return this;
  }

  insertEnd(line: string) {
    this.lines.splice(this.toLine, 0, line);
    this.toLine += 1;
    return this;
  }

  removeLines(matcher: RegExp | string) {
    let removeCount = 0;
    for (let i = this.fromLine; i < this.toLine; i += 1) {
      const index = i - removeCount;
      const line = this.lines[index].trim();
      if (line.match(matcher)) {
        this.lines.splice(index, 1);
        removeCount += 1;
      }
    }
    this.update();
    return this;
  }

  save() {
    writeFileSync(this.filePath, this.lines.join('\n'), { encoding: 'utf-8' });
  }

  private update() {
    for (let i = 0; i < this.lines.length; i += 1) {
      const line = this.lines[i].trim();
      if (line === this.startMarker) {
        this.fromLine = i;
      } else if (line === this.endMarker) {
        this.toLine = i;
        break;
      }
    }
  }
}
