async function RandomWord(): Promise<string> {

    try {
        const response = await fetch("/api/word");
        if (response.ok) {
            const data = await response.json();
            return data.word;
        }
        else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error making API request:', error);
        throw error;
    }

}

const WinDefinitionPhrases = [
    "Big brain energy",
    "You nailed it!",
    "Word master, huh?",
    "Flawless victory!",
    "You speak fluent wizard",
    "Smashed it!",
    "You knew that?!",
    "Flex those syllables",
    "Rolled a nat 20 on vocabulary",
    "You’re a certified wordsmith",
    "Well-read and well-fed",
    "A true lexical legend",
    "The word never stood a chance",
    "You’ve unlocked bonus knowledge",
    "Somebody call Merriam-Webster",
    "Grammatically glorious",
    "You made it look easy",
    "Too smart for this game",
    "Who needs hints anyway?",
    "That word feared you",
];

const LoseDefinitionPhrases = [
    "No way that's a word...",
    "This feels illegal",
    "Words are hard",
    "I've got questions",
    "Is that really a word?!?",
    "Okay, now you’re just making stuff up",
    "My brain just blue-screened",
    "Sounds suspicious",
    "That was English?",
    "Summon the sages",
    "Check the scrolls",
    "Ancient runes detected",
    "Cast ‘Comprehend Languages’",
    "Whomst invented this?",
    "Might be cursed",
    "A wild word appears!",
    "Word alchemy failed",
    "Echoes of forbidden grammar",
    "Straight out of a wizard’s thesaurus",
    "Not even Google knows that one",
    "You fought the word and the word won",
    "Lost in the linguistic sauce",
    "Should’ve brought a thesaurus",
];





export { RandomWord, WinDefinitionPhrases, LoseDefinitionPhrases }
