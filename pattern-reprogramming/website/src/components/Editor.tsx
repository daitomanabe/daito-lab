// import React from 'react'; // JSX transform handles it

interface EditorProps {
    value: string;
    onChange: (val: string) => void;
    error?: string | null;
}

export const Editor = ({ value, onChange, error }: EditorProps) => {
    return (
        <div className="relative w-full h-full flex flex-col">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full bg-transparent text-white font-mono text-lg md:text-2xl p-6 md:p-12 resize-none focus:outline-none placeholder:text-text-faint"
                placeholder="(Start typing pattern code...)"
                spellCheck={false}
                autoFocus
            />
            {error && (
                <div className="absolute bottom-4 left-6 right-6 p-4 bg-red-900/90 text-white border border-red-500 rounded font-mono text-sm shadow-xl backdrop-blur-sm">
                    Error: {error}
                </div>
            )}
        </div>
    );
};
