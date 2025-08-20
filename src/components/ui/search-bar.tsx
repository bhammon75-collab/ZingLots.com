import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search as SearchIcon, X as ClearIcon } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
  autoFocus?: boolean;
};

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search…",
  className,
  size = "md",
  ariaLabel,
  autoFocus,
}: SearchBarProps) {
  const inputHeight = size === "lg" ? "h-14 text-base" : size === "sm" ? "h-9 text-sm" : "h-10";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        autoFocus={autoFocus}
        className={cn(
          "w-full rounded-xl bg-white pl-10 pr-10",
          inputHeight
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60"
        >
          <ClearIcon className="h-4 w-4" />
        </button>
      ) : null}
    </form>
  );
}

export default SearchBar;

