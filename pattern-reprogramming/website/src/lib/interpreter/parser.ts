import { MAX_INSTRUCTIONS } from './types';
import type { Command, CommandType } from './types';

const CHAR_TO_COMMAND: Record<string, CommandType> = {
    'o': 'DRAW_CIRCLE',
    'x': 'DRAW_X',
    '+': 'DRAW_PLUS',
    '|': 'DRAW_VLINE',
    '-': 'DRAW_HLINE',
    '^': 'MOVE_FORWARD',
    'v': 'MOVE_BACKWARD',
    '>': 'MOVE_RIGHT',
    '<': 'MOVE_LEFT',
    '!': 'SCALE_UP',
    'i': 'SCALE_DOWN',
    '?': 'ROTATE',
    '*': 'COLOR_SHIFT', // Correction: Spec says '*' is color shift, but overview didn't mention it explicitly in allowed chars list but did in section 5. Wait, section 3 allows `*`? Let me check spec artifact. section 3 'Allowed Characters' -> Color section lists '*' in commands but maybe not in allowed chars header? 
    // Checking spec: "66: •" (Bullet point? No, line 66 is empty-ish). 
    // Line 132: "| `*` | `h = (h + 0.10) mod 1.0` |"
    // So '*' is the char.
};
// Re-checking spec content from step 13:
// Line 66: "	•	" It seems to be a bullet but maybe the char is missing or it IS a bullet?
// Line 132 clearly says `*`.
// I will assume `*` is the character.

export function parse(code: string): Command[] {
    const result: Command[] = [];
    // Tokenize: Remove ignored chars
    // Allowed: o x + | - ^ v > < ! i ? * ( ) . ,
    const cleanCode = code.replace(/[^ox+||\-^v><!i?*().,]/g, '');

    let index = 0;

    function parseBlock(): Command[] {
        let blockCommands: Command[] = [];

        while (index < cleanCode.length) {
            if (result.length + blockCommands.length > MAX_INSTRUCTIONS) {
                throw new Error(`Instruction limit exceeded (${MAX_INSTRUCTIONS})`);
            }

            const char = cleanCode[index];
            index++;

            if (char === '(') {
                // Recursively parse block
                const innerCommands = parseBlock();

                // Check for repeat modifiers
                let d = 0;
                let c = 0;

                while (index < cleanCode.length) {
                    const nextChar = cleanCode[index];
                    if (nextChar === '.') {
                        d++;
                        index++;
                    } else if (nextChar === ',') {
                        c++;
                        index++;
                    } else {
                        break;
                    }
                }

                const n = (d + 1) * Math.pow(5, c);

                // Expand loop
                for (let k = 0; k < n; k++) {
                    if (result.length + blockCommands.length + innerCommands.length > MAX_INSTRUCTIONS) {
                        throw new Error(`Instruction limit exceeded (${MAX_INSTRUCTIONS})`);
                    }
                    blockCommands.push(...innerCommands);
                }

            } else if (char === ')') {
                return blockCommands;
            } else if (CHAR_TO_COMMAND[char]) {
                blockCommands.push({ type: CHAR_TO_COMMAND[char] });
            } else {
                // . and , appearing outside of loop suffix are ignored or treated as 0 repeats?
                // Spec says: "Repeat markers (block only)"
                // "Rules: . , are block only"
                // So harmless if they appear elsewhere? Or syntax error?
                // "Allowed characters ... others ignored"
                // If . appears standalone, it does nothing?
                // Spec: "Repeat markers (block immediately after)"
                // "Rules: . , are **block immediately after**"
                // If I see . here, it means it wasn't valid suffix. Ignore.
            }
        }

        // If we reach end and are inside a block (recursion), it means missing ')'
        // But this function is used for top level too.
        // We need to know if we are at top level.
        // Simplification: Parsing top level is like a block that ends at EOF.
        return blockCommands;
    }

    // Pre-check for strict bracket matching to throw proper error
    let balance = 0;
    for (const char of cleanCode) {
        if (char === '(') balance++;
        if (char === ')') balance--;
        if (balance < 0) throw new Error("Unexpected ')'");
    }
    if (balance > 0) throw new Error("Missing ')'");

    // Reset index for actual parsing
    index = 0;
    // Parse top level
    // We need to handle that `)` at top level is error, but we checked balance.

    // Note: The recursive function `parseBlock` consumes `)` and returns. 
    // At top level, we shouldn't see `)`.

    while (index < cleanCode.length) {
        const char = cleanCode[index];

        if (result.length > MAX_INSTRUCTIONS) {
            throw new Error(`Instruction limit exceeded (${MAX_INSTRUCTIONS})`);
        }

        if (char === '(') {
            index++; // Consume (
            const inner = parseBlock(); // Will consume )

            // Check for repeat modifiers
            let d = 0;
            let c = 0;
            while (index < cleanCode.length) {
                const nextChar = cleanCode[index];
                if (nextChar === '.') {
                    d++;
                    index++;
                } else if (nextChar === ',') {
                    c++;
                    index++;
                } else {
                    break;
                }
            }

            const n = (d + 1) * Math.pow(5, c);
            for (let k = 0; k < n; k++) {
                if (result.length + inner.length > MAX_INSTRUCTIONS) {
                    throw new Error(`Instruction limit exceeded (${MAX_INSTRUCTIONS})`);
                }
                result.push(...inner);
            }

        } else if (CHAR_TO_COMMAND[char]) {
            result.push({ type: CHAR_TO_COMMAND[char] });
            index++;
        } else {
            // Ignore . , at top level (or treats as error? Spec says ignore others)
            // Spec says "Repeat markers (block immediately after)"
            // So if they are here, they are invalid or ignored. I'll ignore.
            index++;
        }
    }

    return result;
}
