const request = require('request-promise');
const cheerio = require('cheerio');

const sampleResult = {
    title: 'Bohemian Rhapsody',
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

    // Using the parent element tr as you would not be able to get the rating
    // from inside the td title elementelement).find(
    const movies = $('tr')
        .map((i, element) => {
            const title = $(element).find('td.titleColumn > a').text();
            const descriptionUrl = 
            'https://www.imdb.com/' + $(element).find('td.titleColumn > a').attr('href');
            const imdbRating = $(element).find('td.ratingColumn.imdbRating').text().trim();

            // The ranking can be resolved easily by attaching it to the index
            // which is created when mapping
            return {title, imdbRating, rank: i, descriptionUrl}; 
        })
        .get();

    return movies;
}

async function scrapePosterUrl(movies){
    const moviePosterUrls = await Promise.all(
        movies.map(async movie => {
            // Using try catch as there are a lot of requests and there might be
            // errors in some 
            try {
                const html = await request.get(movie.descriptionUrl);
                const $ = await cheerio.load(html);

                movie.posterUrl = $('div.posterUrl > a').attr('href');
                return movie;
            } catch(err){
                console.error(err);
            }
        })
    );

    return moviePosterUrls
}

async function main() {
    // Will cause an error if there is no await
    let movies = await scrapingTitlesRankingsAndRatings();

    // This will return the movies array
    movies = await scrapePosterUrl(movies);
    console.log(movies);
}

// Calls the main function
main();
