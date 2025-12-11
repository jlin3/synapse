"use client";

import { motion } from "framer-motion";
import { Calendar, Quote, Users, ExternalLink } from "lucide-react";

interface PaperCardProps {
  title: string;
  authors: string[];
  publicationDate: string;
  abstract: string | null;
  citedByCount: number;
  journal: string | null;
  doi: string | null;
  index: number;
  onClick?: () => void;
}

export default function PaperCard({
  title,
  authors,
  publicationDate,
  abstract,
  citedByCount,
  journal,
  doi,
  index,
  onClick,
}: PaperCardProps) {
  const formattedDate = new Date(publicationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const truncatedAbstract = abstract
    ? abstract.length > 200
      ? abstract.slice(0, 200) + "..."
      : abstract
    : null;

  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="group p-5 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-white leading-snug group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
        {doi && (
          <a
            href={`https://doi.org/${doi.replace("https://doi.org/", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleExternalLinkClick}
            className="shrink-0 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Open paper"
          >
            <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-purple-400" />
          </a>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span className="truncate max-w-[200px]">
            {authors.slice(0, 3).join(", ")}
            {authors.length > 3 && ` +${authors.length - 3}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        {citedByCount > 0 && (
          <div className="flex items-center gap-1.5">
            <Quote className="w-4 h-4" />
            <span>{citedByCount} citations</span>
          </div>
        )}
      </div>

      {journal && (
        <div className="mt-2">
          <span className="inline-block px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-full border border-purple-500/20">
            {journal}
          </span>
        </div>
      )}

      {truncatedAbstract && (
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
          {truncatedAbstract}
        </p>
      )}
    </motion.article>
  );
}
