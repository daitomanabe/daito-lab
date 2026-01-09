import { useState, useMemo } from 'react';
import { Editor } from '../components/Editor';
import { CanvasView } from '../components/CanvasView';
import { InfoPanel } from '../components/InfoPanel';
import { parse } from '../lib/interpreter/parser';
import { execute } from '../lib/interpreter/engine';
import { Link } from 'react-router-dom';

const EXAMPLES = [
    {
        code: "(o>*)...( ? > o * )..,",
        desc: "Looped walk with rotation and hue shift. Good for small edits.",
    },
    {
        code: "(+?)........................",
        desc: "Rotation-only ring. Increase dots to complete a full turn.",
    },
    {
        code: "(!o>*)........",
        desc: "Scale up, draw, step forward, shift hue. Simple 'caterpillar'.",
    },
    {
        code: "((o<+)..-v)...",
        desc: "Nested loop expansion demo (as specified).",
    },
    {
        code: "(*o^?*o^?*o^?*o^?*o^?*o^?)",
        desc: "Manual repetition: alternating hue + rotate while advancing.",
    },
    {
        code: "(o^?)*,,,,",
        desc: "Large repeat via commas (×5). Watch the 10k instruction limit.",
    },
];

export const Home = () => {
    const [code, setCode] = useState(EXAMPLES[0].code);
    const [continuousMode, setContinuousMode] = useState(false);
    const [scaleMultiplier, setScaleMultiplier] = useState(2.0); // Default 2.0 (Double)

    const { drawCommands, error } = useMemo(() => {
        try {
            if (!code.trim()) return { drawCommands: [], error: null };
            const commands = parse(code);
            const drawCommands = execute(commands, { continuousMode, scaleMultiplier });
            return { drawCommands, error: null };
        } catch (e: any) {
            return { drawCommands: [], error: e.message };
        }
    }, [code, continuousMode, scaleMultiplier]);

    return (
        <div className="container mx-auto px-6 py-12 max-w-6xl">
            {/* Header / Brand */}
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="space-y-4 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Pa++ern (2009) — Revival</h1>
                    <p className="text-text-muted text-lg leading-relaxed">
                        A tiny language for drawing patterns. Type code. Get a pattern. <br className="hidden md:block" />
                        In 2009, the output was stitched by an embroidery machine—today, it returns as a web-native revival.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1 bg-control rounded-full text-xs font-mono text-text-muted border border-border">Not Turing-complete</span>
                        <span className="px-3 py-1 bg-control rounded-full text-xs font-mono text-text-muted border border-border">1000×1000 logical canvas</span>
                        <span className="px-3 py-1 bg-control rounded-full text-xs font-mono text-text-muted border border-border">Limit: 1,000,000</span>
                    </div>
                </div>

                <nav className="flex flex-wrap items-center justify-end gap-2 text-sm text-text-muted">
                    {['about', 'how', 'language', 'examples', 'archive'].map(link => (
                        <a key={link} href={`#${link}`} className="px-3 py-1 hover:text-white border border-transparent hover:border-border rounded-full transition-colors capitalize">
                            {link}
                        </a>
                    ))}
                </nav>
            </header>

            {/* Playground Area */}
            <div className="border border-border rounded-xl bg-[#0b0b0b] overflow-hidden shadow-2xl mb-16">
                {/* Playbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-border bg-[#0f0f0f]">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-wrap gap-2 text-xs font-mono text-text-faint">
                            <span className="bg-black/30 px-2 py-1 rounded border border-border/50">Allowed: o x + | - ^ v &lt; &gt; ! i ? * ( ) . ,</span>
                            <span className="bg-black/30 px-2 py-1 rounded border border-border/50">θ=270° is Up</span>
                        </div>

                        {/* New Controls */}
                        <div className="flex items-center gap-3 pl-2 border-l border-border/30">
                            <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer hover:text-white transition-colors">
                                <input
                                    type="checkbox"
                                    checked={continuousMode}
                                    onChange={e => setContinuousMode(e.target.checked)}
                                    className="rounded border-border bg-black/50 text-white focus:ring-0 focus:border-white w-3 h-3"
                                />
                                Continuous Mode
                            </label>

                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <span>Scale (! i):</span>
                                <select
                                    value={scaleMultiplier}
                                    onChange={e => setScaleMultiplier(parseFloat(e.target.value))}
                                    className="bg-black/50 border border-border rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-white"
                                >
                                    <option value={1.25}>1.25x</option>
                                    <option value={1.5}>1.5x</option>
                                    <option value={2.0}>2.0x</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setCode(EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)].code)}
                            className="bg-control hover:bg-control-hover text-text-muted hover:text-white px-3 py-1.5 rounded text-xs transition-colors border border-border"
                        >
                            Random Example
                        </button>
                        <button
                            onClick={() => setCode('')}
                            className="bg-control hover:bg-red-900/30 text-text-muted hover:text-red-400 px-3 py-1.5 rounded text-xs transition-colors border border-border hover:border-red-900/50"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row h-[600px] md:h-[500px]">
                    <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-border relative">
                        <Editor value={code} onChange={setCode} error={error} />
                    </div>
                    <div className="w-full md:w-1/2 h-1/2 md:h-full bg-black/50 p-4 flex items-center justify-center">
                        <CanvasView commands={drawCommands} />
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-16">
                <section id="about" className="pt-8 border-t border-border">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-6 border border-border rounded-xl bg-[#0f0f0f]">
                            <h3 className="text-white font-bold mb-4">What is Pa++ern?</h3>
                            <p className="text-text-muted leading-relaxed text-sm">
                                A compact pattern-drawing language: five drawing primitives, movement, scale, rotation, hue-shift, and nested loops. It is deliberately not general-purpose—only for producing patterns. The revival keeps the core constraint: you should be able to type small strings and still get surprising structure.
                            </p>
                        </div>
                        <div className="p-6 border border-border rounded-xl bg-[#0f0f0f]">
                            <h3 className="text-white font-bold mb-4">Why revive it now?</h3>
                            <p className="text-text-muted leading-relaxed text-sm">
                                The original work used social code as input and a physical machine as output.
                                The revival keeps the same idea—code as material—while making the feedback loop instant and browser-native.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="how" className="pt-8 border-t border-border">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-white font-bold mb-4 text-xl">How it worked (2009)</h3>
                            <div className="p-6 border border-border rounded-xl bg-[#0f0f0f]">
                                <p className="text-text-muted leading-relaxed text-sm mb-4">
                                    The 2009 installation accepted short user-generated code strings (tweet-length),
                                    interpreted valid programs, returned a preview, and converted the result into a machine-readable pattern.
                                    The output was stitched: pattern on the front, code on the back.
                                </p>
                                <p className="text-xs text-text-faint">
                                    This revival replaces the physical output with a direct canvas renderer—but preserves the same input grammar.
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4 text-xl">Revival edition</h3>
                            <div className="p-6 border border-border rounded-xl bg-[#0f0f0f]">
                                <p className="text-text-muted leading-relaxed text-sm mb-4">
                                    This page renders on a fixed 1000×1000 logical canvas and scales responsively.
                                    Movements respect direction and scale. Lines scale with size.
                                </p>
                                <div className="bg-black/30 p-4 rounded border border-border font-mono text-xs text-text-muted whitespace-pre">
                                    State: pos(x,y), θ (deg), s, h{'\n'}
                                    Translate: ^ v &gt; &lt; use θ and s{'\n'}
                                    Loop: ( ... ) followed by . (×1) and , (×5){'\n'}
                                    Limit: 10,000 executed commands
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="language" className="pt-8 border-t border-border">
                    <h3 className="text-white font-bold mb-6 text-xl">Language Reference</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-6 border border-border rounded-xl bg-[#0f0f0f]">
                            <div className="font-mono text-sm text-text-muted whitespace-pre leading-relaxed">
                                Drawing:    o x + | -{'\n'}
                                Translate:  ^ v &gt; &lt;{'\n'}
                                Scale:      ! (×2), i (÷2){'\n'}
                                Rotation:   ? (+15°){'\n'}
                                Color:      * (Hue +10%){'\n'}
                                Loop:       ( ... ) then '.' (×1) and ',' (×5){'\n'}
                            </div>
                            <p className="mt-4 text-xs text-text-faint">Errors: broken parentheses or instruction limit exceeded.</p>
                        </div>
                        <div className="p-6 border border-border rounded-xl bg-[#0f0f0f]">
                            <h4 className="text-white font-bold mb-2 text-sm">Loop Examples</h4>
                            <div className="font-mono text-sm text-text-muted whitespace-pre leading-relaxed bg-black/30 p-3 rounded mb-4 border border-border/50">
                                (o&lt;o&gt;)...{'\n'}
                                ≡ o&lt;o&gt;o&lt;o&gt;o&lt;o&gt;
                            </div>
                            <div className="font-mono text-sm text-text-muted whitespace-pre leading-relaxed bg-black/30 p-3 rounded border border-border/50">
                                ((o&lt;+)..-v)...{'\n'}
                                ≡ o&lt;+o&lt;+-vo&lt;+o&lt;+-vo&lt;+o&lt;+-v
                            </div>
                        </div>
                    </div>
                </section>

                <section id="examples" className="pt-8 border-t border-border">
                    <h3 className="text-white font-bold mb-6 text-xl">Examples</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {EXAMPLES.map((ex, i) => (
                            <div key={i} className="p-4 border border-border rounded-xl bg-[#0f0f0f] flex flex-col gap-4">
                                <div
                                    onClick={() => setCode(ex.code)}
                                    className="font-mono text-sm bg-black/40 p-3 rounded border border-border cursor-pointer hover:border-white transition-colors text-white break-all"
                                >
                                    {ex.code}
                                </div>
                                <div className="flex justify-between items-start gap-2">
                                    <p className="text-xs text-text-muted flex-1">{ex.desc}</p>
                                    <button
                                        onClick={() => setCode(ex.code)}
                                        className="text-xs border border-border px-2 py-1 rounded hover:bg-white hover:text-black transition-colors"
                                    >
                                        Load
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="archive" className="pt-8 border-t border-border pb-24">
                    <h3 className="text-white font-bold mb-6 text-xl">Archive</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-6 border border-border rounded-xl bg-[#0f0f0f] space-y-3">
                            <a href="https://neural.it/2009/09/paern-esoteric-language-for-embroidery/" target="_blank" rel="noreferrer" className="block text-text-muted hover:text-white hover:underline decoration-border underline-offset-4">Neural (2009) — overview article</a>
                            <a href="https://j-mediaarts-festival.bunka.go.jp/en/award/single/paern/index-2.html" target="_blank" rel="noreferrer" className="block text-text-muted hover:text-white hover:underline decoration-border underline-offset-4">Japan Media Arts Festival — page</a>
                            <a href="https://www.youtube.com/watch?v=19orgugM3iQ" target="_blank" rel="noreferrer" className="block text-text-muted hover:text-white hover:underline decoration-border underline-offset-4">YouTube — documentation video</a>
                            <Link to="/old-keynote" className="block text-white font-bold hover:underline decoration-border underline-offset-4 pt-2">View 2009 Keynote Presentation →</Link>
                        </div>
                        <div className="p-6 border border-border rounded-xl bg-[#0f0f0f]">
                            <h4 className="text-white font-bold mb-2">Credits</h4>
                            <p className="text-text-muted text-sm mb-4">Daito Manabe + Motoi Ishibashi</p>
                            <p className="text-xs text-text-faint border-t border-border pt-4">Originally presented in 2009. Revival edition: browser-based interpreter and renderer.</p>
                        </div>
                    </div>
                </section>

                <footer className="border-t border-border pt-8 text-center text-xs text-text-muted pb-12">
                    Pa++ern — Revival (single-page). Built for immediate play, not exhaustive explanation.
                </footer>

                <InfoPanel />
            </div>
        </div>
    );
};
