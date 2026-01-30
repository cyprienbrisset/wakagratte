'use client';

import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0b0f19]">
      <Sidebar />
      <main className="ml-20 min-h-screen">
        {children}
      </main>
    </div>
  );
}
