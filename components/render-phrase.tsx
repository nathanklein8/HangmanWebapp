import { failState } from "@/data/data"
import { cn } from "@/lib/utils"
import { Dices } from "lucide-react"
import { isMobile } from "react-device-detect"

const RenderPhrase = (props: {
  phrase: string,
  state: number,
  isVictory: boolean,
  guesses: Array<string>,
  hintLetters: Array<string>,
}) => {
  if (props.phrase == "") {
    return <div className="flex justify-center min-h-8"></div>
  }
  const text = (props.state == failState)
    ? props.phrase.toUpperCase()
    : props.phrase.toUpperCase().replace(/[A-Z]/g, char => props.guesses.indexOf(char) != -1 ? char : '_')
  const textSize = (props.phrase.length > 10)
    ? "text-lg sm:text-xl md:text-2xl lg:text-3xl"
    : "text-2xl lg:text-3xl"
  const letterWidth = (props.phrase.length > 10)
    ? "min-w-[20px] sm:min-w-[24px] md:min-w-[28px] lg:min-w-[34px]"
    : "min-w-[28px] lg:min-w-[34px]"
  return (
    <div className={cn(
      "flex flex-row justify-center min-h-8 gap-1",
      textSize,
    )}>
      {Array.from(text).map((char, i) => {
        return <RenderChar
          key={i}
          letter={char}
          state={props.state}
          isVictory={props.isVictory}
          guesses={props.guesses}
          hintLetters={props.hintLetters}
          letterWidth={letterWidth}
        />
      })}
    </div>
  )
}

const RenderChar = (props: {
  letter: string,
  letterWidth: string,
  state: number,
  isVictory: boolean,
  guesses: Array<string>,
  hintLetters: Array<string>,
}) => {
  const color = (props.state == failState || props.isVictory)
    ? ((props.guesses.indexOf(props.letter) == -1)
      ? "text-red-600 dark:text-red-500"
      : (props.hintLetters.includes(props.letter)
        ? "text-blue-600 dark:text-blue-500"
        : ""))
    : ""
  const width = props.state == failState || props.isVictory
    ? "min-w-2"
    : props.letterWidth
  return <div className={cn("text-center phrase-char", color, width)}>
    {props.letter == '_' ? '__' : props.letter}
  </div>
}
export { RenderPhrase }