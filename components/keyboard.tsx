// components/Keyboard.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { handleClientScriptLoad } from 'next/script';

type KeyboardProps = {
  onKeyClick: (key: string) => void;
  onHintClick: () => void;
  guesses: Set<string>;
  correctLetters: Set<string>;
  hintLetters: Set<string>;
  hideHint: boolean;
};

const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const Keyboard: React.FC<KeyboardProps> = ({ onKeyClick, onHintClick, guesses, correctLetters, hintLetters, hideHint }) => {
  return (
    <div className='flex flex-col items-center'>
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className='flex gap-1 mb-1'>
          {row.map((key, index) => (
            <Button
              key={index}
              onClick={() => onKeyClick(key)}
              variant={'secondary'}
              size={'keyboard'}
              disabled={guesses.has(key)}
              className={cn(
                correctLetters.has(key) ? (hintLetters.has(key) ? 'bg-blue-700' : 'bg-green-700') : 'bg-neutral-700'
              )}
            >
              {key}
            </Button>
          ))}
          {rowIndex == 2
            ? <Button
              onClick={onHintClick}
              size={'keyboard'}
              disabled={hideHint}
              className={cn('fade-in')}
              style={{ visibility: hideHint ? 'hidden' : 'visible' }}
            >?</Button>
            : <></>}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;