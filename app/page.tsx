"use client"

import HungMan from "@/components/hung-man"
import { useEffect, useState, useMemo } from "react"
import Confetti from "react-dom-confetti"
import { RenderPhrase } from "@/components/render-phrase"
import {
  SubmitStat,
  WinDefinitionPhrases,
  LoseDefinitionPhrases,
  failState,
  GetWord
} from "@/data/data"
import Keyboard from "@/components/keyboard"
import { isMobile } from 'react-device-detect';
import LoadingSpinner from "@/components/loading-spinner"
import WordDefinition from "@/components/word-definition"
import AppHeader from "@/components/app-header"
import { WordStats } from "@/components/word-stats"

export default function Home() {

  const [mounted, setMounted] = useState<boolean>(false);
  const [secretWord, setSecretWord] = useState<string>("")
  const [wordId, setWordId] = useState<number>(0)
  const [guesses, setGuesses] = useState<Array<string>>([])
  const [confettiTrigger, setConfettiTrigger] = useState<boolean>(false)
  const [numIncorrect, setNumIncorrect] = useState<number>(0)
  const [isVictory, setIsVictory] = useState<boolean>(false)
  const [hintAvailable, setHintAvailable] = useState<boolean>(true)
  const [hintLetters, setHintLetters] = useState<Set<string>>(new Set())
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set())
  const [puzzleMode, setPuzzleMode] = useState<"daily" | "random">("daily")

  useEffect(() => {
    setMounted(true)
    NewWord("daily")
  }, [])

  useEffect(() => {
    SubmitStats()
  }, [isVictory, numIncorrect])

  async function SubmitStats() {
    if (isVictory || numIncorrect == failState) {
      const res = await SubmitStat(wordId, isVictory, numIncorrect)
    }
  }

  async function NewWord(mode: "daily" | "random") {
    // reset all game state
    setWordId(0)
    setSecretWord("")
    setGuesses([])
    setNumIncorrect(0)
    setIsVictory(false)
    setHintLetters(new Set())
    setCorrectLetters(new Set())
    setConfettiTrigger(false)
    const data = await GetWord(mode)
    if (data.played) { setNumIncorrect(-1) }
    setSecretWord(data.word ? data.word.text.toUpperCase() : "")
    setWordId(data.word ? data.word.id : 0)
    setPuzzleMode(mode) // "daily" || "random"
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
        // launchConfetti()
        setConfettiTrigger(true)
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
    <div className="flex flex-col space-y-1 min-h-fit min-h-svh">

      {puzzleMode}

      <AppHeader
        isDaily={puzzleMode == 'daily'}
        onClick={() => {
          NewWord(puzzleMode == 'daily'
            ? 'random'
            : 'daily')
        }}
      />

      <HungMan
        size={200}
        numIncorrect={numIncorrect}
        strokeWidth={1.5}
      />

      <RenderPhrase
        played={numIncorrect == -1}
        phrase={secretWord}
        guesses={guesses}
        isVictory={isVictory}
        state={numIncorrect}
        hintLetters={hintLetters}
      />

      {isVictory
        || numIncorrect == failState
        || numIncorrect == -1
        ? <div className="flex flex-col items-center">
          <WordDefinition
            definitionPhrase={definitionPhrase}
            secretWord={secretWord}
          />
          <WordStats wordId={wordId} />
        </div>
        : <></>}

      {isMobile // spacer to push keyboard to bottom of screen on mobile
        ? <div className="flex grow"></div>
        : <></>}

      <div className="flex z-20 justify-around">
        <Confetti active={confettiTrigger} />
        <Confetti active={confettiTrigger} />
      </div>

      <Keyboard
        onKeyClick={(guess) => {
          if (!isVictory && numIncorrect != failState) {
            submitGuess(guess)
          }
        }}
        onHintClick={revealHint}
        onNewGameClick={() => {
          if (isVictory || numIncorrect == failState) {
            // if you new game on daily, it will just
            // show the error.  might as well switch mode
            NewWord('random')
          }
        }}
        guesses={new Set(guesses)}
        correctLetters={correctLetters}
        hintLetters={hintLetters}
        hideHint={numIncorrect < 4 || !hintAvailable}
        renderMobile={isMobile}
        blurred={isVictory || numIncorrect == failState}
        disabled={numIncorrect == -1 || secretWord == ""} // && blurred
      />

    </div>
  )
}
