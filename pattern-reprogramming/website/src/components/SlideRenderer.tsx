import { useMemo } from 'react';
import clsx from 'clsx';

interface Layout {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
}

interface SlideData {
    id: number;
    texts: Array<{
        text: string;
        layout: Layout;
    }>;
    media: Array<{
        type: string;
        src: string;
        layout: Layout;
    }>;
}

interface SlideProps {
    data: SlideData;
    // container dimensions not needed for flow layout
}

type ContentItem =
    | { type: 'text'; text: string; y: number; h?: number }
    | { type: 'media'; mediaType: string; src: string; y: number };

export const SlideRenderer = ({ data }: SlideProps) => {

    const sortedContent = useMemo(() => {
        const items: ContentItem[] = [];

        // Flatten texts
        data.texts.forEach(t => {
            // Filter empty text
            if (!t.text.trim()) return;
            items.push({
                type: 'text',
                text: t.text,
                y: t.layout.y || 0,
                h: t.layout.h
            });
        });

        // Flatten media
        data.media.forEach(m => {
            items.push({
                type: 'media',
                mediaType: m.type,
                src: m.src,
                y: m.layout.y || 0
            });
        });

        // Sort by Y position to create a natural flow
        // Add a tolerance so items roughly on same line are stable? 
        // For now simple Y sort is likely sufficient for this single-column conversion.
        return items.sort((a, b) => a.y - b.y);
    }, [data]);

    return (
        <section className="w-full py-12 border-b border-border/40 last:border-0">
            <div className="flex flex-col gap-8">
                {sortedContent.map((item, i) => {
                    if (item.type === 'text') {
                        // Heuristic for Heading vs Body based on slide structure
                        // In PPTX, title is usually at top. 
                        // We can heuristics: if it's the first item and Short ? Title : Body.
                        const isTitle = i === 0 && item.text.length < 100;
                        const isCode = item.text.includes(';') || item.text.includes('=') || item.text.includes('(');

                        return (
                            <div key={i} className={clsx("prose prose-invert max-w-none", {
                                "text-center mb-8": i === 0, // Assume first item is a slide title/header
                            })}>
                                {isTitle ? (
                                    <h2 className="text-2xl font-bold tracking-tight text-white m-0">
                                        {item.text}
                                    </h2>
                                ) : (
                                    <div className={clsx("text-text-muted whitespace-pre-wrap leading-relaxed text-lg", {
                                        "font-mono bg-panel-bg p-6 rounded-sm border border-border text-sm": isCode
                                    })}>
                                        {item.text}
                                    </div>
                                )}
                            </div>
                        );
                    } else {
                        return (
                            <div key={i} className="w-full flex justify-center my-4">
                                {item.mediaType === 'video' ? (
                                    <video
                                        src={item.src}
                                        controls
                                        playsInline
                                        muted
                                        loop
                                        className="max-w-full rounded-sm border border-border bg-black"
                                        style={{ maxHeight: '80vh' }}
                                    />
                                ) : (
                                    <img
                                        src={item.src}
                                        alt=""
                                        className="max-w-full h-auto rounded-sm border border-border"
                                    />
                                )}
                            </div>
                        );
                    }
                })}
            </div>
        </section>
    );
};
