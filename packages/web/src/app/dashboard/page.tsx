'use client';

import TopBar from '../../components/dashboard/TopBar';
import SidebarNav from '../../components/dashboard/SidebarNav';
import SidebarExplorer from '../../components/dashboard/SidebarExplorer';
import SidebarConversations from '../../components/dashboard/SidebarConversations';
import CodePanel from '../../components/dashboard/CodePanel';
import ChatPanel from '../../components/dashboard/ChatPanel';
import { useState } from 'react';

type SidebarView = 'explorer' | 'conversations';
type LayoutView = 'compact' | 'split' | 'fullscreen' | 'mobile';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<SidebarView>('conversations');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [layoutView, setLayoutView] = useState<LayoutView>('split');

  const handleNavClick = (view: SidebarView) => {
    if (activeView === view && sidebarOpen) {
      setSidebarOpen(false);
    } else {
      setActiveView(view);
      setSidebarOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-900 text-neutral-100 overflow-hidden">
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
        codePanelOpen={chatOpen}
        onToggleCodePanel={() => setChatOpen(v => !v)}
        layoutView={layoutView}
        onLayoutViewChange={setLayoutView}
      />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav activeView={activeView} isOpen={sidebarOpen} onViewChange={handleNavClick} />
        {sidebarOpen && (
          <>
            {activeView === 'explorer' && <SidebarExplorer />}
            {activeView === 'conversations' && <SidebarConversations />}
          </>
        )}
        <CodePanel />
        {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
      </div>
    </div>
  );
}
