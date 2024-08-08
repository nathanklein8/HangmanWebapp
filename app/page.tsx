"use client"

import HungMan from "@/components/hung-man"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronsUp, LucideGithub, LucideLinkedin, MessageCircleQuestion, Wrench } from "lucide-react"
import { useState } from "react"
import Confetti from "react-dom-confetti"
import { cn } from "@/lib/utils"
import ModeToggle from "@/components/mode-toggle"


export default function Home() {

  const [guesses, setGuesses] = useState<Set<string>>(new Set)
  const [guess, setGuess] = useState<string | null>(null)
  const [secretPhrase, setSecretPhrase] = useState<string>("I love Applesauce!")
  const [confettiTrigger, setConfettiTrigger] = useState<boolean>(false)
  const [gameState, setGameState] = useState<number>(0)

  const failState = 6
  const victoryState = -1

  const launchConfetti = () => {
    setConfettiTrigger(true)
    setTimeout(() => setConfettiTrigger(false), 1000)
  }

  const isGameWon = () => {
    const phrase = secretPhrase.toUpperCase().replace(/[^a-zA-Z]/g, '');
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

  const HiddenPhrase = () => {
    const text = (gameState == failState)
      ? secretPhrase.toUpperCase()
      : secretPhrase.toUpperCase().replace(/[A-Z]/g, char => guesses.has(char) ? char : '_')
    const words = text.split(' ')
    return (
      <div className="flex flex-row justify-center">
        <div className="flex grow"></div>
        <div className="flex flex-wrap justify-center text-2xl max-w-[650px] g-blue-400">
          {words.map((word, i) => {
            return (
              <div key={i} className="flex flex-row gap-0 mx-1 g-red-600">
                {Array.from(word).map((char, i) => {
                  const color = (gameState == failState && !guesses.has(char) && /^[A-Z]$/.test(char)) ? "text-red-600 dark:text-red-500" : ""
                  const lessSpacingChars = ".,?!-()$%#'\""
                  const spacing = lessSpacingChars.includes(char) ? "min-w-1" : (char == ' ' ? "min-w-4" : "min-w-[28px] ml-1")
                  return (
                    <div key={i} className={cn("text-center g-green-300", color, spacing)}>
                      {(char == '_') ? '__' : char}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div className="flex grow"></div>
      </div>
    )
  }

  const GuessGraveyard = () => {
    return (
      <div className="flex justify-center">
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
    )
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between p-2 gap-4">
        <div className="flex grow justify-end gap-2">
          <a href="https://github.com/nathanklein8/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon"><LucideGithub /></Button>
          </a>
          <a href="https://linkedin.com/in/nathan-e-klein/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon"><LucideLinkedin /></Button>
          </a>
        </div>
        <div className="flex max-w-fit justify-center">
          <h1 className="text-4xl font-bold italic underline">Hangman</h1>
        </div>
        <div className="flex grow justify-start gap-2">
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
                  disabled={gameState == victoryState}
                  onClick={() => { setGameState(failState) }}>Reveal</Button>
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => {
                    setGuess(null)
                    setGuesses(new Set)
                    setGameState(0)
                  }}>Reset</Button>
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

      <HungMan size={128} gameState={gameState} failState={failState} />

      <HiddenPhrase />

      <div className="flex items-end justify-center gap-2">
        <Input
          value={guess ? guess : ''}
          maxLength={1}
          className="max-w-10 text-center border-solid"
          disabled={gameState == victoryState || gameState == failState}
          onChange={(event) => {
            const g = event.target.value.toUpperCase()
            !guesses.has(g) && /^[A-Z]$/.test(g) ? setGuess(g) : setGuess(null)
          }}
          onKeyDown={(event) => {
            if (event.key == 'Enter' && guess) {
              submitGuess()
            }
          }}
        />
        <Confetti active={confettiTrigger} />
        <Button
          size="icon" variant={!guess ? "secondary" : "default"}
          disabled={!guess}
          onClick={submitGuess}>
          {guess ? <ChevronsUp /> : <MessageCircleQuestion />}
        </Button>
      </div>

      <GuessGraveyard />

      {gameState == victoryState || gameState == failState ?
        <>
          <div className="flex justify-center">
            <Button onClick={() => {
              setGuess(null)
              setGuesses(new Set)
              setGameState(0)
            }}>
              Reset Puzzle
            </Button>
          </div>
          <div className="flex flex-row justify-center items-center gap-1 text-sm text-muted-foreground italic">
            Hint: change the secret phrase in the
            <Wrench size={16} />
            menu
          </div>
        </>
        : <></>}

    </div>
  )
}
