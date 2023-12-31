const express = require('express');
const cheerio = require('cheerio');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.post('/wikipedialoopchecker', async (req, res) => {
    // console.log(req.body);
    const url = req.body.url;

    if (!url.match('https://en.wikipedia.org/wiki/')) {
        res.json({
            success: 0, message: 'Please enter a valid wikipedia URL !!'
        });
    } else {
        const result = await checkLoop(url);
        console.log(result);

        res.json(result);
    }

});

async function checkLoop(url) {
    const visitedPages = [];
    let currentUrl = url;
    let count = 0;

    while (currentUrl.toLowerCase() !== 'https://en.wikipedia.org/wiki/philosophy') {
        if (visitedPages.includes(currentUrl)) {
            return {
                success: 0, message: "Loop Detected !! A page that is already visited !"
            }
        }

        visitedPages.push(currentUrl);

        const pageData = await fetch(currentUrl);
        const pageContent = await pageData.text();
        currentUrl = getNextLink(pageContent);

        if (!currentUrl) {
            return {
                success: 0, message: "No Valid URL find in Loop"
            }
        }

        count++;
    }

    visitedPages.push(currentUrl);

    return {
        count,
        visitedPages,
        success: 1,
        message: "Successfully visited Philosophy Page"
    };
}

function getNextLink(pageContent) {
    const $ = cheerio.load(pageContent);
    const paragraphs = $('#bodyContent p');

    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = $(paragraphs[i]);
        const links = paragraph.find('a[href^="/wiki/"]');

        for (let j = 0; j < links.length; j++) {
            const link = $(links[j]);

            if (!link.parents().filter('span').length) {
                const href = link.attr('href');
                console.log(href);

                if (href) {
                    return `https://en.wikipedia.org${href}`;
                }
            }
        }
    }

    return null;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});