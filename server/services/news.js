const axios = require('axios');
require('dotenv').config();

const fetchNews = async () => {
    const apiKey = process.env.NEWS_API_KEY; // Ensure correct variable name
    const url = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log(response.data.articles); // Log the articles received
        return response.data.articles;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw new Error('Unable to fetch news');
    }
};

module.exports = fetchNews;