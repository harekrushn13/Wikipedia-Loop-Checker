const cheerio = require('cheerio');

async function checkloop(req, res) {
    const url = req.body.url;

    if (!url.match('https://en.wikipedia.org/wiki/')) {
        return res.json({
            success: 0, message: 'Please enter a valid wikipedia URL !!'
        });
    }

    const visitedPages = [];
    let count = 0;
    let currentUrl = url;

    while (currentUrl !== 'https://en.wikipedia.org/wiki/Philosophy') {
        const pageData = await fetch(currentUrl);

        if (!pageData.ok) {
            return res.json({
                success: 0, message: 'Please enter a valid wikipedia URL !!'
            });

        }
        const pageContent = await pageData.text();

        const $ = cheerio.load(pageContent);
        const paragraphs = $('#bodyContent p');

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
                if (visitedPages.includes(firstLink)) {
                    visitedPages.push(firstLink);
                    errorMessage = 'Loop Detected !! Page ' + firstLink.replace('https://en.wikipedia.org/wiki/', '') + ' Already visited !!'
                    res.json({
                        success: 0, message: errorMessage, visitedPages
                    })
                    return;
                } else {
                    currentUrl = firstLink;
                    visitedPages.push(currentUrl);
                }
                break;
            }
        }
        if (visitedPages.length == 0) {
            return res.json({
                success: 0, message: 'Unable to reach Philosophy page !!'
            });
        }

        count++;
    }

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