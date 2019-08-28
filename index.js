const request = require('request-promise');
const cheerio = require('cheerio');

const sampleResult = {
    title = 'Bohemian Rhapsody',
    rank: 1,
    imdbRating: 8.0,
    descriptionUrl: 'https://www.imdb.com/title/tt1727824/?ref_=nv_sr_1?ref_=nv_sr_1',
    moviePosterUrl: 'https://www.imdb.com/title/tt1727824/mediaviewer/rm2666152448'
};

// Function for scraping movie titles, rankings and ratings
async function scrapingTitlesRankingsAndRatings(){
    const result = await request.get(
        'https://www.imdb.com/chart/moviemeter?ref_=nv_mv_mvm'
    );

    const $ = await cheerio.load(result);
    
}

scrapingTitlesRankingsAndRatings();
