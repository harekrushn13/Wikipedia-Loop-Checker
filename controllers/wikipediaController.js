// Import the 'cheerio' library for web scraping
const cheerio = require('cheerio');

async function checkloop(req, res) {
    const url = req.body.url;

    // Check if the provided URL is a valid Wikipedia URL
    if (!url.match('https://en.wikipedia.org/wiki/')) {
        return res.json({
            success: 0, message: 'Please enter a valid wikipedia URL !!'
        });
    }

    const visitedPages = [];
    let count = 0;
    let currentUrl = url;

    // Loop until the current URL reaches the Philosophy page
    while (currentUrl !== 'https://en.wikipedia.org/wiki/Philosophy') {
        const pageData = await fetch(currentUrl);

        // Check if the page data is not OK (e.g., invalid URL)
        if (!pageData.ok) {
            return res.json({
                success: 0, message: 'Please enter a valid wikipedia URL !!'
            });

        }
        // Extract the page content
        const pageContent = await pageData.text();

        // Load the page content into Cheerio for easier manipulation
        const $ = cheerio.load(pageContent);
        const paragraphs = $('#bodyContent p');

        // Iterate through #bodyContent's paragraphs to find the first valid link
        let firstLink = null;
        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = $(paragraphs[i]);
            const links = paragraph.find('a[href^="/wiki/"]');

            for (let j = 0; j < links.length; j++) {
                const link = $(links[j]);

                if (!link.parents().filter('span').length) {
                    const href = link.attr('href');
                    console.log(href);

                    if (href) {
                        firstLink = 'https://en.wikipedia.org' + href;
                        break;
                    }
                }
            }

            if (firstLink) {
                // Check for loop detection by verifying if the link has been visited before
                if (visitedPages.includes(firstLink)) {
                    visitedPages.push(firstLink);
                    errorMessage = 'Loop Detected !! Page ' + firstLink.replace('https://en.wikipedia.org/wiki/', '') + ' Already visited !!'
                    res.json({
                        success: 0, message: errorMessage, visitedPages
                    })
                    return;
                } else {
                    // Update the current URL and add it to the visited pages array
                    currentUrl = firstLink;
                    visitedPages.push(currentUrl);
                }
                break;
            }
        }

        // If no valid link is found
        if (visitedPages.length == 0) {
            return res.json({
                success: 0, message: 'Unable to reach Philosophy page !!'
            });
        }

        count++;
    }

    // Respond with the result including the step count and visited pages
    res.json({
        count,
        visitedPages,
        success: 1,
        message: "Successfully visited Philosophy Page"
    })

}


module.exports = {
    checkloop,
}