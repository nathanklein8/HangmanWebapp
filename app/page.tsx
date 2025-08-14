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
import { toast } from "sonner"
import { FetchGameState, SaveGameState, ClearGameState } from "@/lib/client-side-save"
import { CalendarFold, Dices } from "lucide-react"
import { setDailyGuesses } from "@/lib/cookies"

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
    if (numIncorrect == failState || isVictory) {
      async function SubmitStats() {
        if (puzzleMode == "daily") {
          ClearGameState()
        }
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
    }
  }, [isVictory, numIncorrect])


  async function NewWord(mode: "daily" | "random") {
    // reset all game state
    setPuzzleMode(mode)
    setConfettiTrigger(false)
    setWordId(0)
    setSecretWord("")
    setGuesses([])
    setHintLetters([])
    setNumIncorrect(0)
    setIsVictory(false)

    // get a new word based on puzzle mode
    const data = await GetWord(mode)
    setSecretWord(data.word ? data.word.text.toUpperCase() : "")
    setWordId(data.word ? data.word.id : 0)

    // handle new random game
    if (mode == "random") { return }

    // handle already played daily game
    if (data.played) {
      setPuzzleMode("played")
      if (data.guesses && data.hintLetters) {
        // set game state based on server side cookie if api returned it
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
        // case when server says user has played, but doesn't have game save
        toast.error('Unable to load your Daily Word performance.  Are Cookies enabled??')
        setNumIncorrect(failState)
      }
    }

    // handle new or incomplete daily game
    else {
      const saved = FetchGameState()
      if (saved && saved.wordId == data.word.id) {
        // only update state if saved progress is for the same word
        setGuesses(saved.guesses)
        setNumIncorrect(saved.guesses.filter(l => !data.word.text.toUpperCase().includes(l)).length)
      }
    }
  }

  const submitGuess = (letter: string, hint = false) => {
    if (puzzleMode == 'daily') {
      SaveGameState(wordId, guesses.join('') + letter)
    }
    // add guess to set
    const newGuesses = guesses.concat([letter])
    setGuesses(prevGuesses => newGuesses)
    // increment game state if guess was wrong
    if (!secretWord.toUpperCase().includes(letter)) {
      setNumIncorrect(numIncorrect => numIncorrect + 1)
    } else {
      // check for victory
      if (hint) {
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

      <AppHeader
        isDaily={puzzleMode != 'random'}
        onClick={() => {
          NewWord(puzzleMode == 'random'
            ? 'daily'
            : 'random')
        }}
      />

      <HangMan
        size={200}
        numIncorrect={numIncorrect}
        strokeWidth={1.5}
      />

      {puzzleMode == "played"
        ? <div className="flex flex-col items-center leading-none tracking-tight text-center px-2 pb-2">
          <p className="text-lg">
            You already completed the Daily Puzzle!
          </p>
          <p className="text-md text-muted-foreground italic text-wrap text-center">
            {isMobile ? "Tap" : "Click"}{" "}
            <span className="inline-flex items-center align-middle">
              <Dices size={18} />
            </span> | <span className="inline-flex items-center align-middle">
              <CalendarFold size={18} />
            </span>
            {" "}to toggle between Random and Daily puzzles
          </p>
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
