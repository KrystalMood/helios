"use client";
import { useState, type ReactNode } from "react";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
};

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id);

  const currentActiveTab = activeTab ?? internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (activeTab === undefined) {
      setInternalActiveTab(tabId);
    }

    onTabChange?.(tabId);
  };

  if (!tabs.length) return null;

  return (
    <div>
      <div
        role="tablist"
        className="flex w-full items-center gap-4 border-b border-border mb-6 overflow-x-auto scrollbar-none"
      >
        {tabs.map((tab) => {
          const isActive = currentActiveTab === tab.id;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`whitespace-nowrap pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${isActive ? "border-foreground text-foreground" : "border-transparent text-muted hover:text-foreground"}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        className="mt-4 focus:outline-none"
        role="tabpanel"
        id={`panel-${currentActiveTab}`}
        aria-labelledby={`tab-${currentActiveTab}`}
        tabIndex={0}
      >
        {tabs.find((t) => t.id === currentActiveTab)?.content}
      </div>
    </div>
  );
}
