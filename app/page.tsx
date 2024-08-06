"use client"

import HungMan from "@/components/hung-man"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronsUp, LucideGithub, LucideLinkedin, MessageCircleQuestion, Wrench } from "lucide-react"
import { useState } from "react"
import Confetti from "react-dom-confetti"
import { toast } from "sonner"


export default function Home() {

  const [guesses, setGuesses] = useState<Set<string>>(new Set)
  const [guess, setGuess] = useState<string | null>(null)
  const [secretPhrase, setSecretPhrase] = useState<string>("I love Applesauce")
  const [confettiTrigger, setConfettiTrigger] = useState<boolean>(false)
  const [gameState, setGameState] = useState<number>(0)

  const gameOverState = 6
  const victoryState = -1

  const launchConfetti = () => {
    setConfettiTrigger(true)
    setTimeout(() => setConfettiTrigger(false), 1000)
  }

  const revealPuzzle = () => {
    const chars = new Set(secretPhrase.toUpperCase().replaceAll(' ', ''))
    setGuesses(chars)
    setGameState(gameOverState)
  }

  const resetPuzzle = () => {
    setGuess(null)
    setGuesses(new Set)
    setGameState(0)
  }

  const getHiddenPhrase = (phrase: string, show: Set<string>): string => {
    return phrase.toUpperCase().replace(/[A-Z]/g, char => show.has(char) ? char : '_')
  }

  const isGameWon = () => {
    const phrase = secretPhrase.toUpperCase().replaceAll(' ', '')
    for (let char of phrase) {
      if (!guesses.has(char)) { return false }
    }
    return true
  }

  const submitGuess = () => {
    // add guess to set
    setGuesses(guesses.add(guess!))

    // increment game state if guess was wrong
    if (!secretPhrase.toUpperCase().includes(guess!)) {
      const newState = gameState + 1
      setGameState(newState)
      if (newState == gameOverState) {
        console.log('reavleaing')
        revealPuzzle()
      }
    } else {
      // check if the game was won
      if (isGameWon()) {
        launchConfetti()
        setGameState(victoryState)
      }
    }

    // reset guess back to empty
    setGuess(null)
  }



  return (
    <>
      <div className="flex justify-between items-start p-2 mb-2">
        <div className="flex grow max-w-40">
          <a href="https://github.com/nathanklein8/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon"><LucideGithub /></Button>
          </a>
          <a href="https://linkedin.com/in/nathan-e-klein/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon"><LucideLinkedin /></Button>
          </a>
        </div>
        <h1 className="text-4xl font-bold italic underline text-center">Hangman</h1>
        <div className="flex flex-row grow max-w-40 justify-end gap-2">
          <ModeToggle />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon"><Wrench /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <div className="flex flex-row gap-2 mb-2">
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={revealPuzzle}>Reveal</Button>
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={resetPuzzle}>Reset</Button>
              </div>
              <div className="flex flex-row gap-2">
                <Input
                  placeholder="Enter Secret Phrase..."
                  onChange={(event) => {
                    setSecretPhrase(event.target.value)
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {gameState == gameOverState ?
        <p className="text-center text-xl">Game Over</p> : <></>
      }

      <div className="flex justify-center my-4">
        <HungMan size={128} gameState={gameState} />
      </div>

      <div className="flex justify-center tracking-widest text-2xl">
        <p className="max-w-96 text-center">
          {getHiddenPhrase(secretPhrase, guesses)}
        </p>
      </div>


      <div className="flex items-end justify-center gap-2 m-4">
        <Input
          value={guess ? guess : ''}
          maxLength={1}
          className="max-w-10 text-center border-solid"
          disabled={gameState == victoryState || gameState == gameOverState}
          onChange={(event) => {
            const g = event.target.value.toUpperCase()
            !guesses.has(g) && /^[A-Z]$/.test(g) ? setGuess(g) : setGuess(null)
          }}
        />
        <Confetti active={confettiTrigger} />
        <Button
          size="icon" variant="secondary"
          disabled={!guess}
          onClick={submitGuess}>
          {guess ? <ChevronsUp color="green" /> : <MessageCircleQuestion />}
        </Button>
      </div>

      <div className="flex justify-center mb-2">
        <div className="grid grid-cols-6 min-w-40 justify-center gap-2">
          {Array.from(guesses).map((guess) => {
            if (!secretPhrase.toUpperCase().includes(guess)) {
              return (
                <div key={guess} className="flex justify-center">
                  {guess}
                </div>
              )
            }
          })}
        </div>
      </div>

      {gameState == victoryState || gameState == gameOverState ?
        <div className="flex justify-center">
          <Button variant="destructive" onClick={resetPuzzle}>
            Reset Puzzle
          </Button>
        </div>
        : <></>}

    </>
  )
}
