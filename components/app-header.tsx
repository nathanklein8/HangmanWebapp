import { CalendarFold, Dices, LucideGithub, LucideLinkedin } from "lucide-react";
import { Button } from "./ui/button";
import ThemeToggle from "./theme-toggle";

const AppHeader = (props: {
  isDaily: boolean;
  onClick: () => void;
}) => {
  return (<div className="flex justify-between items-center p-2 gap-5">
    <div className="flex grow justify-start md:justify-end gap-2">
      <a href="https://www.github.com/nathanklein8/" target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="icon"><LucideGithub /></Button>
      </a>
      <a href="https://www.linkedin.com/in/nathan-e-klein/" target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="icon"><LucideLinkedin /></Button>
      </a>
    </div>
    <div className="flex max-w-fit justify-center">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold italic underline">Hangman</h1>
    </div>
    <div className="flex grow justify-end md:justify-start gap-2">
      <Button
        variant="outline" size="icon"
        onClick={(e) => {
          e.currentTarget.blur(); // remove focus from mode toggle
          // fixes bug: toggle to 'played' -> spacebar = double toggle mode
          // because: spacebar keydown gets new random, then on keyup, spacebar
          //          'clicks' the in focus button, getting the daily word again
          props.onClick();
        }}
      >
        {props.isDaily ? <Dices /> : <CalendarFold />}
      </Button>
      <ThemeToggle />
    </div>
  </div>)
}
export default AppHeader;