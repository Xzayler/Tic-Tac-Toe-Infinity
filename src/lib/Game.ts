import Queue from './Queue';

export type GridIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Player = 'x' | 'o';
export type CellValue = Player | null;

export default class Game {
  public turns: number = 0;
  private cells: CellValue[] = new Array(9).fill(null);
  private currPlayer: Player = 'x';
  public isGameOver: boolean = false;
  private toRemove: Queue<GridIndex | null> = new Queue(9);
  private nextToRemove: GridIndex | null = null;

  constructor() {
    // Fill it with nulls to delay when real cells start being cleared
    this.toRemove.enqueue(null);
    this.toRemove.enqueue(null);
    this.toRemove.enqueue(null);
    this.toRemove.enqueue(null);
    this.toRemove.enqueue(null);
  }

  public getCurrPlayer(): Player {
    return this.currPlayer;
  }

  public getCells(): CellValue[] {
    return [...this.cells];
  }

  public getCell(index: GridIndex): CellValue {
    return this.cells[index];
  }

  private clearCell(next: GridIndex) {
    if (this.nextToRemove !== null) {
      this.cells[this.nextToRemove] = null;
    }
    this.nextToRemove = next;
  }

  private isWinningMove(index: GridIndex): boolean {
    // There is redundancy in this function since I'm rechecking cells[index] === currPlayer
    // which I know to be true.

    //Check current row.
    const currPlayer = this.currPlayer;
    const rowStart = Math.floor(index / 3) * 3;
    let i = 0;
    while (i < 3 && this.cells[rowStart + i] === currPlayer) {
      i++;
    }
    if (i === 3) return true;

    // Check the column
    i = 0;
    const columnStart = index % 3;
    while (i < 3 && this.cells[columnStart + 3 * i] === currPlayer) {
      i++;
    }
    if (i === 3) return true;

    // Don't check the diagonals if they index is not on the main diagonal axes
    if (index % 2 !== 0) return false;

    // Check the center
    if (this.cells[4] !== currPlayer) return false;

    // Check opposite corner
    // 0 <-> 8
    // 2 <-> 6
    // mirror on 4 = 4 + (4-index) = 8 - index
    return this.cells[8 - index] === currPlayer && index !== 4;
  }

  public move(index: GridIndex): boolean {
    if (this.cells[index] !== null) return false;
    this.cells[index] = this.currPlayer;
    this.turns++;
    if (this.isWinningMove(index)) {
      this.isGameOver = true;
      return true;
    }

    this.toRemove.enqueue(index);
    const item = this.toRemove.dequeue();
    if (item || item === 0) {
      this.clearCell(item);
    }
    if (this.currPlayer == 'x') {
      this.currPlayer = 'o';
    } else {
      this.currPlayer = 'x';
    }
    return true;
  }

  public resetCells() {
    this.cells = new Array(9).fill(null);
  }

  public getNextToRemove() {
    return this.nextToRemove;
  }
}
