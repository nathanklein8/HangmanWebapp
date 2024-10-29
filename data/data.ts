async function RandomWord(): Promise<string> {

    try {
        const response = await fetch("https://app.nklein.xyz/api/word");
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
export default RandomWord
