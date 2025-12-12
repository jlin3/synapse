"use client";

import { motion } from "framer-motion";
import { FileText, BarChart3, History } from "lucide-react";

export type TabType = "papers" | "benchmarks" | "history";

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  historyCount?: number;
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "papers", label: "Papers", icon: <FileText className="w-4 h-4" /> },
  { id: "benchmarks", label: "Benchmarks", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "history", label: "History", icon: <History className="w-4 h-4" /> },
];

export default function TabBar({ activeTab, onTabChange, historyCount }: TabBarProps) {
  return (
    <div className="flex items-center gap-2 border-b border-zinc-800/50 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {tab.icon}
          {tab.label}
          {tab.id === "history" && historyCount !== undefined && historyCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded-full">
              {historyCount}
            </span>
          )}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
