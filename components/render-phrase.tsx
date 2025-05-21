import { failState } from "@/data/data"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export const RenderPhrase = (props: {
  phrase: string,
  state: number,
  isVictory: boolean,
  guesses: Array<string>,
  hintLetters: Set<string>,
}) => {
  if (props.phrase == "") {
    // return an empty spacer div so that for the .1 second it takes to fetch
    // the word, the content doesn't shift ugily
    return <div className="flex justify-center items-center gap-1.5 min-h-8 text-muted-foreground">
      {/* <Loader2 className="animate-spin" size={"20px"} /> <p>Generating Secret Word...</p> */}
    </div>
  }
  const text = (props.state == failState)
    ? props.phrase.toUpperCase()
    : props.phrase.toUpperCase().replace(/[A-Z]/g, char => props.guesses.indexOf(char) != -1 ? char : '_')
  return (
    <div className="flex flex-wrap justify-center text-2xl gap-4 min-h-8">
      {text.split(' ').map((word, i) => {
        return <RenderWord
          key={i}
          word={word}
          state={props.state}
          isVictory={props.isVictory}
          guesses={props.guesses}
          hintLetters={props.hintLetters}
        />
      })}
    </div>
  )
}

const RenderWord = (props: {
  word: string,
  state: number,
  isVictory: boolean,
  guesses: Array<string>,
  hintLetters: Set<string>,
}) => {
  const gap = props.state == failState || props.isVictory ? "gap-0.5" : "gap-1" // gap between letters
  return <div className={cn("flex flex-row", gap)}>
    {Array.from(props.word).map((char, i) => {
      return <RenderChar
        key={i}
        letter={char}
        state={props.state}
        isVictory={props.isVictory}
        guesses={props.guesses}
        hintLetters={props.hintLetters}
      />
    })}
  </div>
}

const RenderChar = (props: {
  letter: string,
  state: number,
  isVictory: boolean,
  guesses: Array<string>,
  hintLetters: Set<string>,
}) => {
  const color = (props.state == failState || props.isVictory)
    ? ((props.guesses.indexOf(props.letter) == -1)
      ? "text-red-600 dark:text-red-500"
      : (props.hintLetters.has(props.letter)
        ? "text-blue-600 dark:text-blue-500"
        : ""))
    : ""

  const spacing = props.state == failState || props.isVictory || ",.?!-'\"()$".includes(props.letter) ? "min-w-1" : "min-w-[27px]"
  return <div className={cn("text-center animated-div", color, spacing)}>
    {props.letter == '_' ? '__' : props.letter}
  </div>
}