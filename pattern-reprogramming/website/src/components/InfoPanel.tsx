import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const InfoPanel = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-40 bg-control text-white p-3 rounded-full hover:bg-control-hover transition-colors shadow-lg border border-border"
                aria-label="Toggle Help"
            >
                <HelpCircle size={24} />
            </button>

            <div className={clsx(
                "fixed top-0 right-0 h-full w-80 bg-panel border-l border-border transform transition-transform duration-300 z-50 shadow-2xl overflow-y-auto p-6 pt-20",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="space-y-8 text-sm">
                    <section>
                        <h3 className="font-bold mb-4 text-white border-b border-border pb-2">Drawing</h3>
                        <div className="grid grid-cols-2 gap-2 text-text-muted font-mono">
                            <div>o</div><div>Circle</div>
                            <div>x</div><div>X Shape</div>
                            <div>+</div><div>Plus</div>
                            <div>|</div><div>V-Line</div>
                            <div>-</div><div>H-Line</div>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold mb-4 text-white border-b border-border pb-2">Movement</h3>
                        <div className="grid grid-cols-2 gap-2 text-text-muted font-mono">
                            <div>^</div><div>Forward</div>
                            <div>v</div><div>Backward</div>
                            <div>&lt;</div><div>Left</div>
                            <div>&gt;</div><div>Right</div>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold mb-4 text-white border-b border-border pb-2">Transform</h3>
                        <div className="grid grid-cols-2 gap-2 text-text-muted font-mono">
                            <div>!</div><div>Scale Up</div>
                            <div>i</div><div>Scale Down</div>
                            <div>?</div><div>Rotate 15°</div>
                            <div>*</div><div>Color Shift</div>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold mb-4 text-white border-b border-border pb-2">Loops</h3>
                        <div className="space-y-2 text-text-muted font-mono">
                            <div className="flex gap-2">
                                <span className="text-white">( ... )</span>
                                <span>Group</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-white">.</span>
                                <span>Repeat 1x</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-white">,</span>
                                <span>Repeat 5x</span>
                            </div>
                            <div className="text-xs pt-2 text-text-faint sans-serif">
                                Suffix only. Combine . and , (n * 5^c)
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};
