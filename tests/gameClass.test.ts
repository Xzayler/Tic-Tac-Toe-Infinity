import { describe, it, expect, beforeEach } from 'vitest';
import Game from '../src/lib/Game';

describe('Tic-Tac-Toe Game Class', () => {
  let g: Game;

  beforeEach(() => {
    g = new Game();
  });

  it('Should initialise with empty grid of 9 cells', () => {
    const cells = g.getCells();
    expect(cells.length).toBe(9);

    cells.forEach((cell) => {
      expect(cell).toBe(null);
    });
  });

  it('X player should start, and switch at every move', () => {
    expect(g.getCurrPlayer()).toBe('x');
    g.move(0);
    expect(g.getCurrPlayer()).toBe('o');
    g.move(1);
    expect(g.getCurrPlayer()).toBe('x');
  });

  it('Should correctly register a correct move', () => {
    expect(g.move(4)).toBe(true);

    let cells = g.getCells();
    expect(cells.length).toBe(9);

    cells.forEach((cell, i) => {
      expect(cell).toBe(i === 4 ? 'x' : null);
    });
    expect(g.move(0)).toBe(true);
    cells = g.getCells();
    cells.forEach((cell, i) => {
      expect(cell).toBe(i === 4 ? 'x' : i === 0 ? 'o' : null);
    });
  });

  it('Should detect illegal moves and not change the state', () => {
    expect(g.move(1)).toBe(true);
    expect(g.getCell(1)).toBe('x');
    expect(g.move(1)).toBe(false);
    expect(g.getCell(1)).toBe('x');
    expect(g.getCurrPlayer()).toBe('o');
  });

  it('Should detect wins: rows', () => {
    //row win
    g.move(0);
    expect(g.isGameOver).toBe(false);
    g.move(3);
    expect(g.isGameOver).toBe(false);
    g.move(1);
    expect(g.isGameOver).toBe(false);
    g.move(4);
    expect(g.isGameOver).toBe(false);
    g.move(2);
    expect(g.isGameOver).toBe(true);
  });

  it('Should detect wins: rows', () => {
    g.move(2);
    expect(g.isGameOver).toBe(false);
    g.move(3);
    expect(g.isGameOver).toBe(false);
    g.move(5);
    expect(g.isGameOver).toBe(false);
    g.move(4);
    expect(g.isGameOver).toBe(false);
    g.move(8);
    expect(g.isGameOver).toBe(true);
  });

  it('Should detect wins: diagonals', () => {
    g.move(4);
    expect(g.isGameOver).toBe(false);
    g.move(3);
    expect(g.isGameOver).toBe(false);
    g.move(0);
    expect(g.isGameOver).toBe(false);
    g.move(5);
    expect(g.isGameOver).toBe(false);
    g.move(8);
    expect(g.isGameOver).toBe(true);
  });

  it('Should start clearing cells in the 6th turn', () => {
    expect(g.getRemoved()).toBe(null);
    g.move(0);
    expect(g.getCell(0)).toBe('x');
    g.move(1);
    expect(g.getCell(1)).toBe('o');

    g.move(2);
    g.move(4);

    g.move(8);
    g.move(5);

    g.move(7);
    expect(g.getRemoved()).toBe(0);
    expect(g.getCell(0)).toBe(null);
    g.move(6);
    expect(g.getRemoved()).toBe(1);
    expect(g.getCell(1)).toBe(null);

    g.move(3);
    expect(g.getRemoved()).toBe(2);
    expect(g.getCell(2)).toBe(null);
    g.move(2);
    expect(g.getRemoved()).toBe(null);
    expect(g.isGameOver).toBeTruthy();
    expect(g.getCell(4)).toBe('o'); // doesn't get removed because the win interrupts the clearing
  });
});
