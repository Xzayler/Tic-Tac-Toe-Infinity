class Queue<T> {
  private data: T[] = [];
  private count: number = 0;
  private nextFree: number = 0;
  private nextOut: number = 0;
  private maxLength: number = 0;

  constructor(maxLength: number) {
    if (maxLength <= 0)
      throw new Error('Queue maxLength must be greate than 0');
    this.maxLength = maxLength;
  }

  enqueue(item: T): boolean {
    if (this.count === this.maxLength) return false;
    this.data[this.nextFree] = item;
    this.count++;
    this.nextFree = ++this.nextFree % this.maxLength;
    return true;
  }

  dequeue(): T | undefined {
    if (this.count === 0) return undefined;
    const t = this.data[this.nextOut];
    this.nextOut = ++this.nextOut % this.maxLength;
    this.count--;
    return t;
  }

  peek() {
    if (this.count === 0) return undefined;
    return this.data[this.nextOut];
  }
}

export default Queue;
