import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface HowWeCalculatePopoverProps {
  title: string;
  children: React.ReactNode;
}

export function HowWeCalculatePopover({ title, children }: HowWeCalculatePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Como calculamos?
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 border-white/20 bg-consortium-dark shadow-2xl">
        <div className="p-4">
          <h3 className="text-white font-semibold mb-3 text-base">{title}</h3>
          <div className="text-white/90 text-sm space-y-3">
            {children}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
