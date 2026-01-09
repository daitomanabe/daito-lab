import { describe, it, expect } from 'vitest';
import { parse } from '../parser';
import { execute } from '../engine';

describe('Interpreter Parser', () => {
    it('parses simple commands', () => {
        const code = 'oo';
        const commands = parse(code);
        expect(commands).toHaveLength(2);
        expect(commands[0].type).toBe('DRAW_CIRCLE');
    });

    it('handles loops with . (1 time)', () => {
        const code = '(o).';
        const commands = parse(code);
        expect(commands).toHaveLength(1);
    });

    it('handles loops with , (5 times)', () => {
        const code = '(o),';
        const commands = parse(code);
        expect(commands).toHaveLength(5);
    });

    it('handles nested loops ((o).),', () => {
        // Inner: (o). -> 1 circle
        // Outer: ( ... ), -> 5 * 1 = 5 circles
        const code = '((o).),';
        const commands = parse(code);
        expect(commands).toHaveLength(5);
    });

    it('handles mixed repeat markers ., -> 1*5=5', () => {
        const code = '(o).,';
        const commands = parse(code);
        expect(commands).toHaveLength(5);
    });

    it('throws on unclosed parenthesis', () => {
        expect(() => parse('(o')).toThrow("Missing ')'");
    });

    it('throws on extra parenthesis', () => {
        expect(() => parse('o)')).toThrow("Unexpected ')'");
    });

    it('enforces instruction limit', () => {
        // (o),,,,,, -> 5^6 = 15625 -> Limit 10000
        const code = '(o),,,,,,';
        expect(() => parse(code)).toThrow(/Instruction limit exceeded/);
    });
});

describe('Interpreter Engine', () => {
    it('generates draw commands', () => {
        const result = execute(parse('o'));
        expect(result).toHaveLength(1);
        expect(result[0].shape).toBe('circle');
        expect(result[0].x).toBe(500);
        expect(result[0].y).toBe(500);
    });

    it('moves correctly with ^', () => {
        // Init: 500,500. Angle 0 (Right). ^ moves Forward (+x)
        // o^o
        // 1. Circle at 500,500
        // 2. Move Right by 24 -> 524, 500
        // 3. Circle at 524, 500
        const result = execute(parse('o^o'));
        expect(result).toHaveLength(2);
        expect(result[0].x).toBe(500);
        expect(result[1].x).toBe(524);
        expect(result[1].y).toBe(500);
    });

    it('rotates and moves', () => {
        // o?^o
        // 1. Circle at 500,500. Angle 0.
        // 2. Rotate ? -> +15 deg. Angle 15.
        // 3. Move ^ -> dx = cos(15)*24, dy = sin(15)*24
        // 4. Circle at new pos.
        const result = execute(parse('o?^o'));
        expect(result).toHaveLength(2);
        const rad = 15 * Math.PI / 180;
        const dx = Math.cos(rad) * 24;
        const dy = Math.sin(rad) * 24;
        expect(result[1].x).toBeCloseTo(500 + dx);
        expect(result[1].y).toBeCloseTo(500 + dy);
    });
});
