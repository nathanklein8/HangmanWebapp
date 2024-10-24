async function RandomWord() {
    try {
        const response = await fetch("http://localhost:5099/api/randomword");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error making API request:', error);
        throw error;
    }
}
export default RandomWord