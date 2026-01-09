export type CommandType =
    | 'DRAW_CIRCLE'
    | 'DRAW_X'
    | 'DRAW_PLUS'
    | 'DRAW_VLINE'
    | 'DRAW_HLINE'
    | 'MOVE_FORWARD'
    | 'MOVE_BACKWARD'
    | 'MOVE_RIGHT'
    | 'MOVE_LEFT'
    | 'SCALE_UP'
    | 'SCALE_DOWN'
    | 'ROTATE'
    | 'COLOR_SHIFT';

export interface Command {
    type: CommandType;
}

export interface State {
    pos: { x: number; y: number };
    angle: number; // degrees
    scale: number;
    hue: number; // 0.0 - 1.0
}

export interface DrawCommand {
    shape: 'circle' | 'x' | 'plus' | 'vline' | 'hline';
    x: number;
    y: number;
    angle: number;
    scale: number;
    hue: number;
    strokeWidth: number;
    radius: number;
    length: number;
    color: string; // hsla string
}

export const MAX_INSTRUCTIONS = 1000000;
