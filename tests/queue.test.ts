import { describe, it, expect, beforeEach } from 'vitest';
import Queue from '../src/lib/Queue';

describe('Custom Queue Class', () => {
  let q: Queue<number>;

  beforeEach(() => {
    q = new Queue(4);
  });

  it('Should initialise empty', () => {
    expect(q.peek()).toBe(undefined);
  });

  it('Should add an element and also return it if peeking, without removing it', () => {
    expect(q.enqueue(1)).toBe(true);
    expect(q.peek()).toBe(1);
    expect(q.peek()).toBe(1);
  });

  it('Should return false when enqueing to full queue', () => {
    expect(q.enqueue(1)).toBe(true);
    expect(q.enqueue(2)).toBe(true);
    expect(q.enqueue(3)).toBe(true);
    expect(q.enqueue(4)).toBe(true);
    expect(q.enqueue(5)).toBe(false);
  });

  it('Should return the first element', () => {
    expect(q.enqueue(1)).toBe(true);
    expect(q.enqueue(2)).toBe(true);
    expect(q.peek()).toBe(1);
    expect(q.dequeue()).toBe(1);
  });

  it('Should return undefined when dequeueing empty Queue', () => {
    expect(q.dequeue()).toBe(undefined);
  });

  it('Should dequeue until empty', () => {
    expect(q.enqueue(1)).toBe(true);
    expect(q.enqueue(2)).toBe(true);
    expect(q.dequeue()).toBe(1);
    expect(q.dequeue()).toBe(2);
    expect(q.dequeue()).toBe(undefined);
  });

  it('Should be able to enqueue after filling up and dequeueing', () => {
    expect(q.enqueue(1)).toBe(true);
    expect(q.enqueue(2)).toBe(true);
    expect(q.enqueue(3)).toBe(true);
    expect(q.enqueue(4)).toBe(true);
    expect(q.enqueue(5)).toBe(false);
    expect(q.dequeue()).toBe(1);
    expect(q.enqueue(5)).toBe(true);
    expect(q.enqueue(6)).toBe(false);
  });

  it('Should dequeue items in order', () => {
    expect(q.enqueue(1)).toBe(true);
    expect(q.enqueue(2)).toBe(true);
    expect(q.enqueue(3)).toBe(true);
    expect(q.enqueue(4)).toBe(true);
    expect(q.dequeue()).toBe(1);
    expect(q.dequeue()).toBe(2);
    expect(q.dequeue()).toBe(3);
    expect(q.enqueue(5)).toBe(true);
    expect(q.enqueue(6)).toBe(true);
    expect(q.dequeue()).toBe(4);
    expect(q.dequeue()).toBe(5);
    expect(q.dequeue()).toBe(6);
  });
});
