const express = require('express');
const cheerio = require('cheerio');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

// Endpoint for handling Wikipedia loop checks
app.post('/wikipedialoopchecker', async (req, res) => {
    const url = req.body.url;

    // Check if the provided URL is a valid Wikipedia URL
    if (!url.match('https://en.wikipedia.org/wiki/')) {
        res.json({
            success: 0, message: 'Please enter a valid wikipedia URL !!'
        });
    } else {
        // Perform the loop check and send the result in the response
        const result = await checkLoop(url);
        res.json(result);
    }

});

// Function to perform the Wikipedia loop check
async function checkLoop(url) {
    const visitedPages = [];
    let currentUrl = url;
    let count = 0;

    // Continue loop until reaching the Philosophy page or detecting a loop
    while (currentUrl.toLowerCase() !== 'https://en.wikipedia.org/wiki/philosophy') {
        // If the page is already visited, return an error
        if (visitedPages.includes(currentUrl)) {
            return {
                success: 0, message: "Loop Detected !! A page that is already visited !"
            }
        }

        visitedPages.push(currentUrl);

        // Fetch the content of the current page
        const pageData = await fetch(currentUrl);
        const pageContent = await pageData.text();

        // Get the first valid link from the page content
        currentUrl = getNextLink(pageContent);

        // If no valid URL is found, return an error
        if (!currentUrl) {
            return {
                success: 0, message: "No Valid URL find in Loop"
            }
        }

        // Increment the request count
        count++;
    }

    // Add the Philosophy page to the visited pages array
    visitedPages.push(currentUrl);

    // Return the result of the loop check
    return {
        count,
        visitedPages,
        success: 1,
        message: "Successfully visited Philosophy Page"
    };
}

// Function to extract the first valid link from the page content
function getNextLink(pageContent) {
    const $ = cheerio.load(pageContent);
    const paragraphs = $('#bodyContent p');

    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = $(paragraphs[i]);
        const links = paragraph.find('a[href^="/wiki/"]');

        for (let j = 0; j < links.length; j++) {
            const link = $(links[j]);

            // Check if the link is not within a span element
            if (!link.parents().filter('span').length) {
                const href = link.attr('href');
                console.log(href);

                if (href) {
                    return `https://en.wikipedia.org${href}`;
                }
            }
        }
    }

    // Return null if no valid URL is found
    return null;
}

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});