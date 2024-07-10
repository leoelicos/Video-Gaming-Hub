const apiKey = import.meta.API_KEY

export const getAllGames = async (search) => {
	try {
		let apiURL =
			'https://api.rawg.io/api/games?key=9cdfe8e7af674d6d825da9805c8c6545'
		if (search) {
			apiURL += `&added&page_size=9&search=-${search}&search_precise`
		}
		console.log('fetching', apiURL)
		const response = await fetch(apiURL)
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}

		const data = await response.json()
		const { results } = data
		return results
	} catch (error) {
		console.error('Error fetching data:', error)
	}
}
