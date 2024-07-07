const fetchNews = require('./services/news');

const testFetchNews = async () => {
    try {
        const articles = await fetchNews();
        console.log('Fetched Articles:', articles);
    } catch (error) {
        console.error('Error:', error);
    }
};

testFetchNews();