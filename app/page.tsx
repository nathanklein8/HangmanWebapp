"use client"

import HungMan from "@/components/hung-man"
import { Button } from "@/components/ui/button"
import { LucideGithub, LucideLinkedin } from "lucide-react"
import { useEffect, useState } from "react"
import Confetti from "react-dom-confetti"
import ModeToggle from "@/components/mode-toggle"
import { cn, failState } from "@/lib/utils"
import { RenderPhrase } from "@/components/render-phrase"
import RandomWord from "@/data/data"
import Keyboard from "@/components/keyboard"
import { isMobile } from 'react-device-detect';
import LoadingSpinner from "@/components/loading-spinner"

export default function Home() {

  const [guesses, setGuesses] = useState<Array<string>>([])
  const [secretPhrase, setSecretPhrase] = useState<string>("")
  const [confettiTrigger, setConfettiTrigger] = useState<boolean>(false)
  const [numIncorrect, setNumIncorrect] = useState<number>(0)
  const [isVictory, setIsVictory] = useState<boolean>(false)
  const [hintAvailable, setHintAvailable] = useState<boolean>(true)
  const [hintLetters, setHintLetters] = useState<Set<string>>(new Set())
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set())

  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    NewWord()
    setTimeout(() => setMounted(true), 250)
  }, [])

  const launchConfetti = () => {
    setConfettiTrigger(true)
    setTimeout(() => setConfettiTrigger(false), 1000)
  }

  async function NewWord() {
    setGuesses([])
    setNumIncorrect(0)
    setIsVictory(false)
    setHintLetters(new Set())
    setCorrectLetters(new Set())
    const word = await RandomWord()
    setSecretPhrase(word.toUpperCase())
  }

  const submitGuess = (letter: string, hint = false) => {
    // add guess to set
    const newGuesses = guesses.concat([letter])
    setGuesses(prevGuesses => newGuesses)
    // increment game state if guess was wrong
    if (!secretPhrase.toUpperCase().includes(letter)) {
      setNumIncorrect(numIncorrect => numIncorrect + 1)
    } else {
      // check for victory
      setCorrectLetters(prev => new Set([...prev, letter]))
      if (hint) {
        setHintLetters(prev => new Set([...prev, letter]))
      }
      if (new Set(secretPhrase).isSubsetOf(new Set(newGuesses))) {
        launchConfetti()
        setIsVictory(true)
      }
    }
  }

  const revealHint = () => {
    const possibleLetters = Array.from(new Set(secretPhrase).difference(new Set(guesses)))
    const index = Math.floor(Math.random() * possibleLetters.length);
    const chosen = possibleLetters[index]
    submitGuess(chosen, true)
    setHintAvailable(false)
    setTimeout(() => {
      setHintAvailable(true)
    }, 10000)
  }

  if (!mounted) {
    return (
      <LoadingSpinner/>
    )
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between p-2 gap-4">
        <div className="flex grow justify-end gap-2">
          <a href="https://www.github.com/nathanklein8/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon"><LucideGithub /></Button>
          </a>
          <a href="https://www.linkedin.com/in/nathan-e-klein/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon"><LucideLinkedin /></Button>
          </a>
        </div>
        <div className="flex max-w-fit justify-center">
          <h1 className="text-4xl font-bold italic underline">Hangman</h1>
        </div>
        <div className="flex grow justify-start gap-2">
          <div className="w-10"></div>
          <ModeToggle />
        </div>
      </div>

      <HungMan size={135} numIncorrect={numIncorrect} />

      <RenderPhrase phrase={secretPhrase} guesses={guesses} isVictory={isVictory} state={numIncorrect} />

      <div className={isMobile ? "absolute inset-x-0 bottom-[5%]" : ""}>
        <Keyboard
          onKeyClick={(guess) => {
            if (!isVictory && numIncorrect != failState) {
              submitGuess(guess)
            }
          }}
          onHintClick={revealHint}
          onNewGameClick={() => {
            if (isVictory || numIncorrect == failState) {
              NewWord()
            }
          }}
          guesses={new Set(guesses)}
          correctLetters={correctLetters}
          hintLetters={hintLetters}
          hideHint={isVictory || numIncorrect < 4 || !hintAvailable || numIncorrect == failState}
          renderMobile={isMobile}
        />
      </div>

      <div className="flex justify-center">
        <Confetti active={confettiTrigger} />
      </div>

      {isVictory || numIncorrect == failState ?
        <div className="flex-col text-center gap-2">
          <Button
            className="mb-1"
            variant="outline"
            onClick={() => { NewWord() }}
          >New Game</Button>
          {!isMobile
            ? <p className="text-sm text-muted-foreground italic">
              (Spacebar)
            </p>
            : <></>}
        </div>
        : <></>}

    </div>
  )
}
