import { describe, expect, test } from 'bun:test';
import { formatISK, formatISKSigned, formatISKShort, parseISKInput, formatPercent } from '../src/lib/format';

describe('parseISKInput', () => {
  test('reads k/m/b suffixes', () => {
    expect(parseISKInput('250k')).toBe(250_000);
    expect(parseISKInput('150m')).toBe(150_000_000);
    expect(parseISKInput('1.5b')).toBe(1_500_000_000);
  });

  test('accepts a comma as the decimal mark', () => {
    expect(parseISKInput('1,5b')).toBe(1_500_000_000);
    expect(parseISKInput('0,13b')).toBe(130_000_000);
  });

  test('reads grouped thousands in both styles', () => {
    expect(parseISKInput('150.000.000')).toBe(150_000_000);
    expect(parseISKInput('1,234,567')).toBe(1_234_567);
    expect(parseISKInput('1.234.567')).toBe(1_234_567);
  });

  test('reads a plain number', () => {
    expect(parseISKInput('890000000')).toBe(890_000_000);
    expect(parseISKInput('1500')).toBe(1_500);
  });

  test('returns 0 for junk instead of NaN', () => {
    expect(parseISKInput('')).toBe(0);
    expect(parseISKInput('   ')).toBe(0);
    expect(parseISKInput('abc')).toBe(0);
    expect(parseISKInput('m')).toBe(0);
  });

  test('is case insensitive', () => {
    expect(parseISKInput('2.5B')).toBe(2_500_000_000);
  });
});

describe('formatISK', () => {
  test('compacts billions and millions', () => {
    expect(formatISK(1_500_000_000)).toBe('1.50B ISK');
    expect(formatISK(150_000_000)).toBe('150.00M ISK');
    expect(formatISK(150_000)).toBe('150.00K ISK');
    expect(formatISK(999)).toBe('999 ISK');
  });

  test('keeps the sign on losses', () => {
    expect(formatISK(-84_000_000)).toBe('-84.00M ISK');
    expect(formatISKSigned(-84_000_000)).toBe('-84.00M ISK');
  });

  test('marks profit with a plus', () => {
    expect(formatISKSigned(2_160_000_000)).toBe('+2.16B ISK');
    expect(formatISKSigned(0)).toBe('0 ISK');
  });

  test('short form drops the unit for tight columns', () => {
    expect(formatISKShort(3_000_000_000)).toBe('3B');
    expect(formatISKShort(647_060_000)).toBe('647.06M');
    expect(formatISKShort(-1_500_000)).toBe('-1.5M');
  });

  test('percent formatting tolerates a bad base', () => {
    expect(formatPercent(86.4, 0)).toBe('86%');
    expect(formatPercent(Number.NaN)).toBe('—');
  });
});
