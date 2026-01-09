import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SlideRenderer } from '../components/SlideRenderer';

interface PPTXData {
    slides: Array<{
        id: number;
        texts: Array<{
            text: string;
            layout: { x?: number, y?: number, w?: number, h?: number };
        }>;
        media: Array<{
            type: string;
            src: string;
            layout: { x?: number, y?: number, w?: number, h?: number };
        }>;
    }>;
    width: number;
    height: number;
}

export const OldKeynote = () => {
    const [data, setData] = useState<PPTXData | null>(null);

    useEffect(() => {
        fetch('/keynote/pptx/slides.json')
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error("Failed to load pptx slides", err));
    }, []);

    if (!data) return <div className="min-h-screen flex items-center justify-center text-text-muted bg-background">Loading Archive...</div>;

    return (
        <div className="min-h-screen bg-background text-text-primary font-sans selection:bg-white selection:text-black">
            {/* Header */}
            <nav className="fixed top-0 left-0 w-full z-40 px-6 py-4 mix-blend-difference flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <Link to="/" className="text-sm font-bold tracking-tight hover:underline opacity-80 hover:opacity-100 pointer-events-auto">← Back to Revival</Link>
                <div className="text-xs font-mono opacity-60">ARCHIVE: 2009 KEYNOTE (PPTX RECONSTRUCTION)</div>
            </nav>

            {/* Vertical Scroll Layout */}
            <div className="container mx-auto px-4 py-24 max-w-5xl space-y-16">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-text-primary">Pa++ern (2009)</h1>
                    <p className="text-text-muted text-sm font-mono uppercase tracking-widest">Original Documentation Slides</p>
                    <p className="text-xs text-text-faint max-w-lg mx-auto leading-relaxed">
                        Reconstructed from the original PPTX Source. Text is selectable. Native Media.
                    </p>
                </div>

                <div className="flex flex-col gap-0 max-w-3xl mx-auto">
                    {data.slides.map((slide, index) => (
                        <div key={slide.id} className="w-full relative group">
                            {/* Slide Number (Optional sidebar marker) */}
                            <div className="absolute -left-16 top-12 text-xs font-mono text-text-faint hidden lg:block opacity-50">
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            {/* Reconstructed Flow Slide */}
                            <SlideRenderer
                                data={slide}
                            />
                        </div>
                    ))}
                </div>

                <div className="text-center pt-24 pb-12">
                    <Link to="/" className="text-sm text-text-muted hover:text-white transition-colors border-b border-border hover:border-white pb-1">
                        Return to Revival
                    </Link>
                </div>
            </div>
        </div>
    );
};
