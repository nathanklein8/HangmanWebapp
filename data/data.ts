async function RandomWord(): Promise<string> {

    try {
        const response = await fetch("http://localhost:3000/api/word");
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