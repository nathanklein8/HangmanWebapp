async function RandomWord() {
    try {
        const response = await fetch("https://random-word-api.herokuapp.com/word");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error making API request:', error);
        throw error;
    }
}
export default RandomWord