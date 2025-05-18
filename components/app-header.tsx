import { LucideGithub, LucideLinkedin } from "lucide-react";
import { Button } from "./ui/button";
import ModeToggle from "./mode-toggle";

const AppHeader = () => {
    return (<div className="flex justify-between p-2 gap-4">
        <div className="flex grow justify-end gap-2">
          <a href="https://www.github.com/nathanklein8/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon"><LucideGithub /></Button>
          </a>
          <a href="https://www.linkedin.com/in/nathan-e-klein/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon"><LucideLinkedin /></Button>
          </a>
        </div>
        <div className="flex max-w-fit justify-center">
          <h1 className="text-4xl font-bold italic underline">Hangman</h1>
        </div>
        <div className="flex grow justify-start gap-2">
          <div className="w-10"></div>
          <ModeToggle />
        </div>
      </div>)
}
export default AppHeader;