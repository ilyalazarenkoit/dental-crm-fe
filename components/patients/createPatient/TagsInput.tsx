"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
  placeholder?: string;
  hint?: string;
  maxTags?: number;
  disabled?: boolean;
}

export const TagsInput = ({
  value,
  onChange,
  error,
  placeholder = "Add tag and press Enter",
  hint,
  maxTags = 20,
  disabled = false,
}: TagsInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (!tag || value.includes(tag) || value.length >= maxTags) return;
    onChange([...value, tag]);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleChange = (raw: string) => {
    if (raw.endsWith(",")) {
      addTag(raw.slice(0, -1));
    } else {
      setInputValue(raw);
    }
  };

  const isAtMax = value.length >= maxTags;

  return (
    <div className="space-y-1.5">
      <div
        className={cn(
          "min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          error && "border-destructive focus-within:ring-destructive",
          disabled && "opacity-50 pointer-events-none",
          "cursor-text"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag, index) => (
            <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="rounded-sm hover:bg-destructive/20 p-0.5 transition-colors"
                aria-label={`Remove tag ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={!isAtMax ? placeholder : undefined}
            disabled={disabled || isAtMax}
            className="flex-1 min-w-24 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            aria-label="Add tag"
          />
        </div>
        <div className="mt-1 flex justify-end">
          <span className="text-xs text-muted-foreground">
            {value.length}/{maxTags}
          </span>
        </div>
      </div>
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
};
