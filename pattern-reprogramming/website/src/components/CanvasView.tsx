import { useEffect, useRef } from 'react';
import type { DrawCommand } from '../lib/interpreter/types';

interface CanvasViewProps {
    commands: DrawCommand[];
}

export const CanvasView = ({ commands }: CanvasViewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw
        // Coordinate system: 1000x1000.
        // Commands already have resolved coords and styles.

        // Optimize: Batching? Nah, 10000 commands is fine for native canvas.

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (const cmd of commands) {
            ctx.save();
            ctx.translate(cmd.x, cmd.y);
            ctx.rotate((cmd.angle * Math.PI) / 180);

            ctx.strokeStyle = cmd.color;
            ctx.lineWidth = cmd.strokeWidth;

            ctx.beginPath();

            if (cmd.shape === 'circle') {
                ctx.arc(0, 0, cmd.radius, 0, Math.PI * 2);
            } else if (cmd.shape === 'x') {
                // const r = cmd.radius; // Unused
                // Spec says: "x: 斜線2本"
                // Radius or Length?
                // Spec section 6 Base Parameters: R0=18, L0=28.
                // Shapes: 
                // o: Radius R
                // x: diagonal?
                // +: vertical horizontal
                // |: vertical
                // -: horizontal
                // Usually X, +, |, - use L (length)? Or R?
                // Spec: "o: 円（半径 R）"
                // Spec doesn't explicitly calculate L for others but defined L0.
                // Assuming others use L or R.
                // Let's use L (Length) for lines, R (Radius) for circle.
                // "R = R0*s, L = L0*s"
                // For X, +, |, - it makes sense to use L as full length or half length?
                // If L is "length", then coordinate should include -L/2 to L/2?
                // Spec R0=18, L0=28.
                // 18 radius -> 36 diameter.
                // 28 length -> smaller than circle diameter?
                // I will assume L is the half-size (like radius) or full size?
                // Usually "L" vs "R" -> L might be full length.
                // If L=28, half is 14.
                // 36 vs 28.
                // I'll assume L is the extend from center (radius-like) for now to be safe, or L is full length.
                // Given `o` uses R=18, `x` likely uses similar scale.
                // I will use L as the extent from center (i.e., draw from -L to +L or -L/2 to L/2).
                // If L=28 is "Length", then -14 to 14.
                // If L=28 is "extent", then -28 to 28.
                // Let's guess L is "extent" (radius-equivalent) because 28 is closer to 18 than 56 to 36.
                // Actually 28 is > 18.
                // I'll stick to L being the extent for now.
                const ext = cmd.length;

                // Draw X
                // \ line
                ctx.moveTo(-ext, -ext);
                ctx.lineTo(ext, ext);
                // / line
                ctx.moveTo(ext, -ext);
                ctx.lineTo(-ext, ext);
            } else if (cmd.shape === 'plus') {
                const L = cmd.length;
                ctx.moveTo(-L / 2, 0); ctx.lineTo(L / 2, 0);
                ctx.moveTo(0, -L / 2); ctx.lineTo(0, L / 2);
            } else if (cmd.shape === 'vline') {
                const L = cmd.length;
                ctx.moveTo(0, -L / 2); ctx.lineTo(0, L / 2);
            } else if (cmd.shape === 'hline') {
                const L = cmd.length;
                ctx.moveTo(-L / 2, 0); ctx.lineTo(L / 2, 0);
            }

            ctx.stroke();
            ctx.restore();
        }

    }, [commands]);

    return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-[#0a0a0a]">
            {/* 
                Canvas container 
                Maintain aspect ratio 1:1 using max-h / max-w logic
            */}
            <canvas
                ref={canvasRef}
                width={1000}
                height={1000}
                className="w-full h-auto max-w-[80vh] max-h-[80vh] aspect-square bg-black shadow-2xl border border-[#222]"
            />
        </div>
    );
};
