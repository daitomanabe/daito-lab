import type { Command, CommandType, DrawCommand, State } from './types';

// Original: import { Command, DrawCommand, State } from './types';
// I will just change it to type import.


const INITIAL_STATE: State = {
    pos: { x: 500, y: 500 },
    angle: 270, // Start facing Up, so ^ is Up and > is Right
    scale: 1.0,
    hue: 0.0,
};

// Constants
const STEP_BASE = 24;
const R0 = 18;
const L0 = 28;
const W0 = 2;

const SCALE_MIN = 1 / 64;
const SCALE_MAX = 64;

export function execute(
    commands: Command[],
    options: { continuousMode?: boolean; scaleMultiplier?: number } = {}
): DrawCommand[] {
    const { continuousMode = false, scaleMultiplier = 2.0 } = options;

    // Deep copy initial state
    let state: State = { ...INITIAL_STATE, pos: { ...INITIAL_STATE.pos } };
    const drawCommands: DrawCommand[] = [];

    // Track current active shape for continuous mode
    // Default to 'circle' (o) if user starts moving immediately? 
    // Or null until explicitly set? 
    // "o > > >" implies o sets the mode.
    // Spec doesn't describe this, but user request implies statefulness.
    let currentShapeCmd: CommandType | null = null;

    // Helper to perform draw at current state using a specific command type
    const performDraw = (type: CommandType) => {
        /*
        Common Properties:
        - Center: pos
        - Rotation: th
        - Size: R=R0*s, L=L0*s
        - StrokeWidth: max(1, W0*s)
        - Color: hsla(h*360, 80%, 60%, 0.7)
        */
        const s = state.scale;
        const color = `hsla(${Math.round(state.hue * 360)}, 80%, 60%, 0.7)`;
        const strokeWidth = Math.max(1, W0 * s);

        let shape: DrawCommand['shape'] = 'circle';
        if (type === 'DRAW_CIRCLE') shape = 'circle';
        if (type === 'DRAW_X') shape = 'x';
        if (type === 'DRAW_PLUS') shape = 'plus';
        if (type === 'DRAW_VLINE') shape = 'vline';
        if (type === 'DRAW_HLINE') shape = 'hline';

        drawCommands.push({
            shape,
            x: state.pos.x,
            y: state.pos.y,
            angle: state.angle,
            scale: s,
            hue: state.hue,
            strokeWidth,
            radius: R0 * s,
            length: L0 * s,
            color
        });
    }

    for (const cmd of commands) {
        switch (cmd.type) {
            // --- SCALE ---
            case 'SCALE_UP':
                // Use configurable multiplier
                state.scale = Math.min(state.scale * scaleMultiplier, SCALE_MAX);
                break;
            case 'SCALE_DOWN':
                // Use configurable multiplier (inverse)
                state.scale = Math.max(state.scale / scaleMultiplier, SCALE_MIN);
                break;

            // --- ROTATE ---
            case 'ROTATE':
                state.angle = (state.angle + 15) % 360;
                break;

            // --- COLOR ---
            case 'COLOR_SHIFT':
                state.hue = (state.hue + 0.10) % 1.0;
                break;

            // --- MOVEMENT ---
            case 'MOVE_FORWARD':
            case 'MOVE_BACKWARD':
            case 'MOVE_RIGHT':
            case 'MOVE_LEFT': {
                // If Continuous Mode is ON and we have a shape selected, DRAW first
                if (continuousMode && currentShapeCmd) {
                    performDraw(currentShapeCmd);
                }

                const rad = (state.angle * Math.PI) / 180;
                const delta = STEP_BASE * state.scale;

                let dx = 0;
                let dy = 0;

                if (cmd.type === 'MOVE_FORWARD') {
                    dx = Math.cos(rad) * delta;
                    dy = Math.sin(rad) * delta;
                } else if (cmd.type === 'MOVE_BACKWARD') {
                    dx = -Math.cos(rad) * delta;
                    dy = -Math.sin(rad) * delta;
                } else if (cmd.type === 'MOVE_RIGHT') {
                    const radRight = ((state.angle + 90) * Math.PI) / 180;
                    dx = Math.cos(radRight) * delta;
                    dy = Math.sin(radRight) * delta;
                } else if (cmd.type === 'MOVE_LEFT') {
                    const radRight = ((state.angle + 90) * Math.PI) / 180;
                    dx = -Math.cos(radRight) * delta;
                    dy = -Math.sin(radRight) * delta;
                }

                state.pos.x += dx;
                state.pos.y += dy;
                break;
            }

            // --- DRAWING ---
            case 'DRAW_CIRCLE':
            case 'DRAW_X':
            case 'DRAW_PLUS':
            case 'DRAW_VLINE':
            case 'DRAW_HLINE': {
                if (continuousMode) {
                    // In continuous mode, these commands ONLY switch the "pen"
                    // They do NOT draw immediately (unless we decide they do both? User said "drawmodeを変えるだけで" - just change mode)
                    currentShapeCmd = cmd.type;
                } else {
                    // Standard mode: Draw immediately
                    performDraw(cmd.type);
                }
                break;
            }
        }
    }

    return drawCommands;
}
