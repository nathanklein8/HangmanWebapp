import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type KeyboardProps = {
  onKeyClick: (key: string) => void;
  onHintClick: () => void;
  onNewGameClick: () => void;
  guesses: Set<string>;
  correctLetters: Set<string>;
  hintLetters: Set<string>;
  hideHint: boolean;
  renderMobile: boolean;
  blurred: boolean;
};

const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '?']
];

const Keyboard: React.FC<KeyboardProps> = ({
  onKeyClick,
  onHintClick,
  onNewGameClick,
  guesses,
  correctLetters,
  hintLetters,
  hideHint,
  renderMobile,
  blurred,
}) => {
  //** HANDLE KEYBOARD INPUT */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (key == ' ') {
        onNewGameClick();
      } else if (key == '?') {
        if (!hideHint) onHintClick()
      } else if (keys[0].includes(key) || keys[1].includes(key) || keys[2].includes(key)) {
        if (!guesses.has(key)) {
          onKeyClick(key);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyClick]);

  return (
    <div className={cn(
      'flex flex-col items-center', blurred ? 'blur-[2px]' : '' 
    )}>
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className={cn(
          'flex w-full gap-1 justify-center mb-1',
        )}>
          {row.map((key, index) => (
            <div key={index}>
              {key != '?'
              ? <Button
                onClick={() => onKeyClick(key)}
                variant={guesses.has(key) ? 'keyboardGhost' : 'keyboard'}
                size={'keyboard'}
                disabled={guesses.has(key) || blurred}
                className={cn(
                  renderMobile ? 'h-12' : '',
                  correctLetters.has(key) ? (hintLetters.has(key) ? 'bg-blue-500' : 'bg-primary') : ''
                )}
              >{key}</Button>
              : (!hideHint
                ? <Button
                onClick={onHintClick}
                variant={'keyboardGhost'}
                size={'keyboard'}
                className={cn(
                  renderMobile ? 'h-12' : '',
                  'fade-in dark:bg-blue-600 bg-blue-500',
                )}
              >?</Button>
              : <div className='w-8'></div>
              )}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;