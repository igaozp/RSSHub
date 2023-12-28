const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const baseUrl = 'https://baoyu.io';

    const { data: response } = await got(baseUrl);
    const $ = cheerio.load(response);

    const items = await Promise.all(
        $('article')
            .toArray()
            .map((item) => {
                item = $(item);
                const title = item.find('h2').first();
                const link = item.find('a').first();
                return {
                    title: title.text(),
                    link: `${baseUrl}${link.attr('href')}`,
                    pubDate: parseDate(item.find('text-sm').text()),
                };
            })
    );

    ctx.state.data = {
        title: $('body > div.flex.min-h-screen.flex-col > header > div > div > a > span').text(),
        link: baseUrl,
        item: items,
    };
};
