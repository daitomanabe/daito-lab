import type { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-background text-text-primary font-sans selection:bg-white selection:text-black">
            <main className="w-full min-h-screen">
                {children}
            </main>
        </div>
    );
};
