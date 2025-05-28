"use client"

import HangMan from "@/components/hang-man-graphic"
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
import { Dices } from "lucide-react"
import { toast } from "sonner"

export default function Home() {

  const [mounted, setMounted] = useState<boolean>(false);
  const [secretWord, setSecretWord] = useState<string>("")
  const [wordId, setWordId] = useState<number>(0)
  const [guesses, setGuesses] = useState<Array<string>>([])
  const [confettiTrigger, setConfettiTrigger] = useState<boolean>(false)
  const [numIncorrect, setNumIncorrect] = useState<number>(0)
  const [isVictory, setIsVictory] = useState<boolean>(false)
  const [hintAvailable, setHintAvailable] = useState<boolean>(true)
  const [hintLetters, setHintLetters] = useState<Array<string>>([])
  const [puzzleMode, setPuzzleMode] = useState<"daily" | "random" | "played">("daily")

  useEffect(() => {
    setMounted(true)
    NewWord("daily")
  }, [])

  useEffect(() => {
    async function SubmitStats() {
      if (puzzleMode != "played" && (isVictory || numIncorrect == failState)) {
        SubmitStat(
          wordId,
          isVictory,
          numIncorrect,
          (puzzleMode == "daily" ? guesses : null),
          (puzzleMode == "daily" ? Array.from(hintLetters) : null),
        )
      }
    }
    SubmitStats()
  }, [isVictory, numIncorrect])

  // use this function to reset the game
  async function NewWord(mode: "daily" | "random") {
    setPuzzleMode(mode)
    setConfettiTrigger(false)
    setWordId(0)
    setSecretWord("")
    setGuesses([])
    setHintLetters([])
    setNumIncorrect(0)
    setIsVictory(false)
    const data = await GetWord(mode)
    if (data.played) {
      setPuzzleMode("played")
      if (data.guesses && data.hintLetters) {
        setGuesses(data.guesses)
        setHintLetters(data.hintLetters)
        const phraseSet = new Set(data.word.text.toUpperCase())
        if (phraseSet.isSubsetOf(new Set(data.guesses))) {
          setIsVictory(true)
          setNumIncorrect(data.guesses.length - phraseSet.size)
        } else {
          setNumIncorrect(failState)
        }
      } else {
        toast.error('whoopsie! something bad happened \\o/')
      }
    }
    setSecretWord(data.word ? data.word.text.toUpperCase() : "")
    setWordId(data.word ? data.word.id : 0)
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
      if (hint) {
        // setHintLetters(prev => new Set([...prev, letter]))
        setHintLetters(prev => prev.concat([letter]))
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

      {/* <p>word: {secretWord} id: {wordId}</p>

      <p>guesses: {guesses} #: {guesses.length}</p>

      <p>hints: {hintLetters} #: {hintLetters.length}</p>

      <p>stored: {guesses.join('') + '$' + Array.from(hintLetters).join('')}</p>

      <p>mode: {puzzleMode}</p>

      <p>state: {numIncorrect} fail: {failState}</p>

      <p>won? {isVictory ? 'yes' : 'no'}</p> */}

      <AppHeader
        isDaily={["daily", "played"].includes(puzzleMode)}
        onClick={() => {
          NewWord(['daily', 'played'].includes(puzzleMode)
            ? 'random'
            : 'daily')
        }}
      />

      <HangMan
        size={200}
        numIncorrect={numIncorrect}
        strokeWidth={1.5}
      />

      {puzzleMode == "played"
        ? <div className="flex flex-col items-center leading-none tracking-tight">
          <p className="text-lg">
            You already completed the Daily Puzzle!
          </p>
          {/* <p className="text-md text-muted-foreground italic whitespace-nowrap inline-flex items-center gap-1">
            {isMobile ? "Tap" : "Click"} <Dices size={20} /> to keep playing random puzzles
          </p> */}
        </div>
        : <></>}

      <RenderPhrase
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
            definitionPhrase={puzzleMode == "played" ? '' : definitionPhrase}
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
        phrase={secretWord}
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
        guesses={guesses}
        hintLetters={hintLetters}
        hideHint={numIncorrect < 4 || !hintAvailable}
        renderMobile={isMobile}
        blurred={isVictory || numIncorrect == failState}
        disabled={numIncorrect == -1 || secretWord == ""} // && blurred
      />

    </div>
  )
}
