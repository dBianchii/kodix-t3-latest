import { Popover, PopoverContent } from "@ui/popover";
import {
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  Command,
} from "@ui/command";
import { Signal, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import { useState } from "react";
import { cn } from "@/components/ui/lib/utils";

export function PriorityPopover({
  setPriority,
  children,
}: {
  setPriority: (priority: Priority) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const prioritiesArr: Priority[] = [0, 1, 2, 3];
  return (
    <Popover open={open} onOpenChange={setOpen}>
      {children}
      <PopoverContent className="w-300 p-0" side="bottom" align={"start"}>
        <Command>
          <CommandInput placeholder="Change priority..." />
          <CommandList
            onSelect={() => {
              setOpen(false);
            }}
          >
            <CommandGroup>
              {prioritiesArr.map((num) => (
                <CommandItem
                  key={num}
                  onSelect={() => {
                    setPriority(num);
                    setOpen(false);
                  }}
                >
                  <PriorityIcon priority={num} className="mr-2" />
                  {PriorityToTxt(num)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/**
 * None, Low, Medium, High
 */
export type Priority = 0 | 1 | 2 | 3;
export function PriorityIcon({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}) {
  switch (priority) {
    case 0:
      return <SignalLow className={cn("h-4 w-4 text-white/60", className)} />;
    case 1:
      return (
        <SignalMedium className={cn("h-4 w-4 text-green-400", className)} />
      );
    case 2:
      return (
        <SignalHigh className={cn("h-4 w-4 text-yellow-400", className)} />
      );
    case 3:
      return <Signal className={cn("h-4 w-4 text-red-400", className)} />;
  }
}

export function PriorityToTxt(priority: Priority) {
  switch (priority) {
    case 0:
      return "None";
    case 1:
      return "Low";
    case 2:
      return "Medium";
    case 3:
      return "High";
  }
}
