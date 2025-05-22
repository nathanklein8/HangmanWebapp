import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";

const WordDefinition = (props: {
  definitionPhrase: string,
  secretWord: string,
}) => {
  return (
    <>
      <p className="text-lg">{props.definitionPhrase}</p>
      <a href={"https://en.wiktionary.org/wiki/" + props.secretWord.toLowerCase()} target="_blank" rel="noopener noreferrer">
        <Button
          className="text-blue-500 text-md whitespace-nowrap inline-flex items-center gap-1"
          variant='link'
        >
          Definition <ArrowUpRight size={18} />
        </Button>
      </a>
    </>
  )
}

export default WordDefinition;