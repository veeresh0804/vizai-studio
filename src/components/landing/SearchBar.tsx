import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mic } from "lucide-react";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

const suggestions = ["solar system", "human heart", "DNA helix", "wind turbine", "bridge"];

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSubmit(query.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="w-full max-w-xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative glow-input rounded-xl overflow-hidden border border-border/50 focus-within:border-primary/50 transition-all duration-300">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a concept to visualize..."
            className="w-full bg-card/80 backdrop-blur-xl text-foreground pl-12 pr-12 py-4 text-lg focus:outline-none placeholder:text-muted-foreground/60"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            title="Voice Query"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => { setQuery(s); onSubmit(s); }}
            className="px-3 py-1.5 text-sm rounded-lg bg-secondary/60 text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/30 hover:border-primary/30 transition-all duration-200"
          >
            {s}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 flex justify-center"
      >
        <button
          onClick={() => { if (query.trim()) onSubmit(query.trim()); }}
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl glow-button hover:brightness-110 transition-all duration-200"
        >
          Visualize Concept
        </button>
      </motion.div>
    </motion.div>
  );
}
