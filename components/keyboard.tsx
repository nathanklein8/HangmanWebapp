import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type KeyboardProps = {
  phrase: string,
  onKeyClick: (key: string) => void;
  onHintClick: () => void;
  onNewGameClick: () => void;
  guesses: Array<string>;
  hintLetters: Array<string>;
  hideHint: boolean;
  renderMobile: boolean;
  blurred: boolean;
  disabled?: boolean;
};

const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '?']
];

const Keyboard: React.FC<KeyboardProps> = ({
  phrase,
  onKeyClick,
  onHintClick,
  onNewGameClick,
  guesses,
  hintLetters,
  hideHint,
  renderMobile,
  blurred,
  disabled,
}) => {
  //** HANDLE KEYBOARD INPUT */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!disabled) {
        const key = event.key.toUpperCase();
        if (key == ' ') {
          onNewGameClick();
        } else if (key == '?') {
          if (!hideHint) onHintClick()
        } else if (keys[0].includes(key) || keys[1].includes(key) || keys[2].includes(key)) {
          if (!guesses.includes(key)) {
            onKeyClick(key);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyClick]);

  return (
    <div className="relative mb-4">
      <div className={cn(
        'flex flex-col items-center', blurred ? 'opacity-40' : ''
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
                    variant={guesses.includes(key) ? 'keyboardGhost' : 'keyboard'}
                    size={'keyboard'}
                    disabled={guesses.includes(key) || blurred || disabled}
                    className={cn(
                      renderMobile ? 'h-12' : '',
                      (phrase.includes(key) && guesses.includes(key))
                        ? (hintLetters.includes(key) ? 'bg-blue-500' : 'bg-primary')
                        : ''
                    )}
                  >{key}</Button>
                  : (!hideHint && !blurred
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
      {blurred ? // new game button, positioned in center, relative to parent div
        <Button
          className="shadow-[0_0_50px] shadow-neutral-400 dark:shadow-neutral-700
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    text-md md:text-lg max-w-fit max-h-fit p-4 z-10"
          variant="altOutline"
          onClick={onNewGameClick}
        >
         New Game
        </Button>
        : <></>}
    </div>
  );
};

export default Keyboard;