"use client";

import { useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface MultiSelectProps {
  placeholder: string;
  units: any[];
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  units,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  let selected: any[] = [];
console.log(value,"values testing")
  if (value.length > 0 && units) {
    selected = value
      .map((id) => units.find((unit) => unit?._id === id))
      .filter((unit) => unit) as any[];
  }

  const selectables = units?.filter(
    (unit) => !selected.includes(unit)
  );

  return (
    <div className="overflow-visible bg-white">
      <div className="flex gap-1 flex-wrap border rounded-md">
        {selected.map((unit) => (
          <Badge key={unit._id}>
            {unit.title}
            <button aria-label="button" type="button" className="ml-1 hover:text-red-1" onClick={() => onRemove(unit._id)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          className="w-full p-2 rounded-md"
        />
      </div>

      <div className="relative mt-2">
        {open && (
          <div className="absolute w-full z-[9999] backdrop-blur top-0 overflow-auto border rounded-md shadow-md">
            {selectables?.map((unit) => (
              <div
                key={unit._id}
                className="p-2 hover:bg-grey-2 cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(unit._id);
                  setInputValue("");
                }}
              >
                {unit.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;