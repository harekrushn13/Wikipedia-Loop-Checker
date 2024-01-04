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

    while (url !== 'https://en.wikipedia.org/wiki/Philosophy') {
        if (visitedPages.includes(url)) {
            res.json({
                success: 0, message: "Loop Detected !! A page that is already visited !"
            })
            return;
        }

        const pageData = await fetch(url);
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
                        firstLink = `https://en.wikipedia.org${href}`;
                        return;
                    }
                }
            }
        }

        if (firstLink) {
            url = firstLink;
        }

        visitedPages.push(url);

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