import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MultiSelectChipsProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  allowCustom?: boolean;
  placeholder?: string;
  testIdPrefix?: string;
}

export function MultiSelectChips({
  options,
  selected,
  onChange,
  allowCustom = true,
  placeholder = "Add custom...",
  testIdPrefix = "chip"
}: MultiSelectChipsProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const addCustom = () => {
    const trimmed = customValue.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustomValue("");
    setShowCustomInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustom();
    } else if (e.key === "Escape") {
      setCustomValue("");
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {/* Predefined options */}
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <Badge
              key={option}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                isSelected ? "bg-primary hover:bg-primary/90" : "hover:bg-muted"
              }`}
              onClick={() => toggleOption(option)}
              data-testid={`${testIdPrefix}-${option.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {option}
              {isSelected && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(option);
                  }}
                  className="ml-1 inline-flex items-center"
                  aria-label={`Remove ${option}`}
                  data-testid={`${testIdPrefix}-remove-${option.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          );
        })}

        {/* Custom chips (not in predefined options) */}
        {selected
          .filter(item => !options.includes(item))
          .map((custom) => (
            <Badge
              key={custom}
              variant="default"
              className="cursor-pointer bg-primary hover:bg-primary/90"
              onClick={() => toggleOption(custom)}
              data-testid={`${testIdPrefix}-custom-${custom.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {custom}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(custom);
                }}
                className="ml-1 inline-flex items-center"
                aria-label={`Remove ${custom}`}
                data-testid={`${testIdPrefix}-remove-custom-${custom.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}

        {/* Other + button */}
        {allowCustom && !showCustomInput && (
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-muted border-dashed"
            onClick={() => setShowCustomInput(true)}
            data-testid={`${testIdPrefix}-add-custom`}
          >
            <Plus className="w-3 h-3 mr-1" />
            Other
          </Badge>
        )}
      </div>

      {/* Custom input field */}
      {showCustomInput && (
        <div className="flex gap-2">
          <Input
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!customValue.trim()) {
                setShowCustomInput(false);
              }
            }}
            placeholder={placeholder}
            autoFocus
            className="h-8 text-sm"
            data-testid={`${testIdPrefix}-custom-input`}
          />
          <Button
            type="button"
            size="sm"
            onClick={addCustom}
            disabled={!customValue.trim()}
            data-testid={`${testIdPrefix}-custom-add-button`}
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
