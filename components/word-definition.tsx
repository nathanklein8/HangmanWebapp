import { BookOpen, Search } from "lucide-react";

const WordDefinition = (props: {
  definitionPhrase: string,
  secretWord: string,
  show: boolean,
}) => {
  if (props.show) {
    return (
      <div className="flex flex-col items-center gap-1">
        <p className="text-lg">{props.definitionPhrase}</p>
        <a href={"https://en.wiktionary.org/wiki/" + props.secretWord.toLowerCase()} target="_blank" rel="noopener noreferrer">
          <div className="text-blue-500 underline-offset-4 hover:underline flex items-center gap-2 font-medium text-[16px]">
            <p>Wiktionary Definition</p> <div className="flex gap-0.5">
              <BookOpen size={24} strokeWidth={1.5} /><Search size={24} strokeWidth={1.5} />
            </div>
          </div>
        </a>
      </div>
    )
  } else {
    return <></>
  }
}

export default WordDefinition;