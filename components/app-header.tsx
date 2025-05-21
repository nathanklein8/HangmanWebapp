import { LucideGithub, LucideLinkedin } from "lucide-react";
import { Button } from "./ui/button";
import ModeToggle from "./mode-toggle";

const AppHeader = () => {
  return (<div className="flex justify-between items-center p-2 gap-5">
    <div className="flex grow justify-start md:justify-end gap-1 md:gap-2 animated-div">
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
    <div className="flex grow justify-end md:justify-start gap-1 md:gap-2 animated-div">
      <div className="w-10 md:w-0 animated-div"></div>
      <ModeToggle />
      <div className="w-0 md:w-10 animated-div"></div>
    </div>
  </div>)
}
export default AppHeader;