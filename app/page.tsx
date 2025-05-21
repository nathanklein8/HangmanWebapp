"use client"

import HungMan from "@/components/hung-man"
import { useEffect, useState, useMemo } from "react"
import Confetti from "react-dom-confetti"
import { RenderPhrase } from "@/components/render-phrase"
import { LoseDefinitionPhrases, RandomWord, WinDefinitionPhrases, failState } from "@/data/data"
import Keyboard from "@/components/keyboard"
import { isMobile } from 'react-device-detect';
import LoadingSpinner from "@/components/loading-spinner"
import WordDefinition from "@/components/word-definition"
import AppHeader from "@/components/app-header"
import { Word } from "@prisma/client"

export default function Home() {

  const [mounted, setMounted] = useState<boolean>(false);
  const [data, setData] = useState<Word | null>(null)
  const secretWord: string = useMemo(() => {
    if (data) {
      return data.text.trim().toUpperCase()
    } else {
      return ""
    }
  }, [data]);
  const wordId: number | null = useMemo(() => {
    if (data) {
      return data.id
    } else {
      return null
    }
  }, [data])
  const [guesses, setGuesses] = useState<Array<string>>([])
  const [confettiTrigger, setConfettiTrigger] = useState<boolean>(false)
  const [numIncorrect, setNumIncorrect] = useState<number>(0)
  const [isVictory, setIsVictory] = useState<boolean>(false)
  const [hintAvailable, setHintAvailable] = useState<boolean>(true)
  const [hintLetters, setHintLetters] = useState<Set<string>>(new Set())
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMounted(true)
    NewWord()
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
    const data = await RandomWord()
    setData(data)
  }

  const submitGuess = (letter: string, hint = false) => {
    // add guess to set
    const newGuesses = guesses.concat([letter])
    setGuesses(prevGuesses => newGuesses)
    // increment game state if guess was wrong
    if (!secretWord.toUpperCase().includes(letter)) {
      setNumIncorrect(numIncorrect => numIncorrect + 1)
    } else {
      // check for victory
      setCorrectLetters(prev => new Set([...prev, letter]))
      if (hint) {
        setHintLetters(prev => new Set([...prev, letter]))
      }
      if (new Set(secretWord).isSubsetOf(new Set(newGuesses))) {
        launchConfetti()
        setIsVictory(true)
      }
    }
  }

  const revealHint = () => {
    const possibleLetters = Array.from(new Set(secretWord).difference(new Set(guesses)))
    const index = Math.floor(Math.random() * possibleLetters.length);
    const chosen = possibleLetters[index]
    submitGuess(chosen, true)
    setHintAvailable(false)
    setTimeout(() => {
      setHintAvailable(true)
    }, 10000) // 10 second hint cooldown
  }

  const getDefinitionPhrase = () => {
    if (isVictory) {
      const index = Math.floor(Math.random() * WinDefinitionPhrases.length);
      return WinDefinitionPhrases[index]
    } else {
      const index = Math.floor(Math.random() * LoseDefinitionPhrases.length);
      return LoseDefinitionPhrases[index]
    }
  }

  const definitionPhrase = useMemo(() => {
    if (isVictory || numIncorrect === failState) {
      return getDefinitionPhrase();
    }
    return "";
  }, [isVictory, numIncorrect]);

  // some components depend on theme, wait till this page gets mounted
  // to get theme cookie so that content displays correctly
  if (!mounted) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <div className="flex flex-col space-y-1">
      <AppHeader />

      <HungMan
        size={200}
        numIncorrect={numIncorrect}
        strokeWidth={1.5}
      />

      <RenderPhrase
        phrase={secretWord}
        guesses={guesses}
        isVictory={isVictory}
        state={numIncorrect}
        hintLetters={hintLetters}
      />

      <WordDefinition
        definitionPhrase={definitionPhrase}
        secretWord={secretWord}
        show={isVictory || numIncorrect == failState}
      />

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
        hideHint={numIncorrect < 4 || !hintAvailable}
        renderMobile={isMobile}
        blurred={isVictory || numIncorrect == failState}
      />

      <div className="flex justify-center">
        <Confetti active={confettiTrigger} />
      </div>

    </div>
  )
}
