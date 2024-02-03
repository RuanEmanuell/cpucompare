import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();

app.use(cors());

const cpuList = [
    {
        cpu: 'Ryzen 5 4600G',
        brand: 'AMD',
        shopLink: 'https://www.kabum.com.br/produto/333145/processador-amd-ryzen-5-4600g-3-7ghz-4-2ghz-max-turbo-cache-11mb-am4-video-integrado-100-100000147box?gad_source=1',
        benchmarkLink: 'https://www.cpubenchmark.net/cpu.php?cpu=AMD+Ryzen+5+4600G&id=3807'
    },
    {
        cpu: 'Ryzen 5 5500',
        brand: 'AMD',
        shopLink: 'https://www.kabum.com.br/produto/320799/processador-amd-ryzen-5-5500-3-6ghz-4-2ghz-max-turbo-cache-19mb-am4-sem-video-100-100000457box',
        benchmarkLink: 'https://www.cpubenchmark.net/cpu.php?id=4807&cpu=AMD+Ryzen+5+5500'
    },
    {
        cpu: 'Ryzen 5 5600',
        brand: 'AMD',
        shopLink: 'https://www.kabum.com.br/produto/320798/processador-amd-ryzen-5-5600-3-5ghz-4-4ghz-max-turbo-cache-35mb-am4-sem-video-100-100000927box',
        benchmarkLink: 'https://www.cpubenchmark.net/cpu.php?cpu=AMD+Ryzen+5+5600&id=4811'
    },
    {
        cpu: 'Ryzen 7 5800X3D',
        brand: 'AMD',
        shopLink: 'https://www.kabum.com.br/produto/320796/processador-amd-ryzen-7-5800x3d-3-4ghz-4-5ghz-max-turbo-cache-100mb-am4-sem-video-100-100000651wof?gad_source=1',
        benchmarkLink: 'https://www.cpubenchmark.net/cpu.php?id=4823&cpu=AMD+Ryzen+7+5800X3D'
    },
    {
        cpu: 'Core i3 10100F',
        brand: 'Intel',
        shopLink: 'https://www.kabum.com.br/produto/129960/processador-intel-core-i3-10100f-3-6ghz-4-3ghz-max-boost-cache-6mb-quad-core-8-threads-lga-1200-bx8070110100f',
        benchmarkLink: 'https://www.cpubenchmark.net/cpu.php?cpu=Intel+Core+i3-10100F+%40+3.60GHz&id=3863'
    },
    {
        cpu: 'Core i5 12400F',
        brand: 'Intel',
        shopLink: 'https://www.kabum.com.br/produto/283718/processador-intel-core-i5-12400f-2-5ghz-4-4ghz-max-turbo-cache-18mb-lga-1700-bx8071512400f',
        benchmarkLink: 'https://www.cpubenchmark.net/cpu.php?cpu=Intel+Core+i5-12400F&id=4681'
    },
    {
        cpu: 'Core i9 13900K',
        brand: 'Intel',
        shopLink: 'https://www.kabum.com.br/produto/386971/processador-intel-core-i9-13900k-13-geracao-5-8ghz-max-turbo-cache-36mb-24-nucleos-lga-1700-video-integrado-bx8071513900k',
        benchmarkLink: 'https://www.cpubenchmark.net/cpu.php?id=5022&cpu=Intel+Core+i9-13900K'
    },
    {
        cpu: 'Core i7 14700K',
        brand: 'Intel',
        shopLink: 'https://www.kabum.com.br/produto/497575/processador-intel-core-i7-14700k-14-geracao-5-6-ghz-max-turbo-cache-33mb-20-nucleos-28-threads-lga1700-bx8071514700k',
        benchmarkLink: 'https://www.cpubenchmark.net/cpu.php?cpu=Intel+Core+i7-14700K&id=5719'
    },
]

async function fetchData(cpuName) {
    let cpuIndex = -1;
    function formatString(string) {
        let formatedString = string.toLowerCase().replaceAll(' ', '').trim();
        return formatedString;
    }
    for (var i = 0; i < cpuList.length; i++) {
        if (formatString(cpuList[i]['cpu']) == formatString(cpuName)) {
            cpuIndex = i;
            break;
        }
    }

    let cpuLink = cpuList[cpuIndex]['shopLink'];
    let cpuTest = cpuList[cpuIndex]['benchmarkLink'];

    const browserPromise = puppeteer.launch();
    const browser = await browserPromise;
    let page = await browser.newPage();
    await page.goto(cpuLink);

    const name = await page.$eval('#description h2', (h2) => h2.innerText);
    const price = await page.$eval('.sc-5492faee-2.ipHrwP.finalPrice', (h4) => h4.innerText);
    const image = await page.$eval('.image img', (img) => img.src);
    const brand = cpuList[i]['brand'];

    page = await browser.newPage();
    await page.goto(cpuTest);


    const score = await page.$eval('.right-desc span:nth-child(3)', (span) => span.innerText);
    
    let cores;
    if (await page.$('.mobile-column')) {
        cores = (await page.$eval('.mobile-column', (p) => p.innerText))
    } else {
        cores = await page.$eval('.desc-body .desc-foot:nth-child(4) p', (p) => p.innerText);
        cores = cores.substring(cores.length - 21);
    }

    let performanceCalc = Math.ceil(parseInt(score) / 6000);

    if(performanceCalc > 5){
        performanceCalc = 5;
    }

    let performance = '⭐';

    for(var i=1; i<performanceCalc; i++){
        performance = performance + '⭐';
    }

    let cost = '⭐';
    let costCalc = price.substring(2);
    costCalc = costCalc.replaceAll('.', '');
    costCalc = parseInt(costCalc);
    costCalc = Math.round(performanceCalc * 900 / costCalc);

    if(costCalc > 5){
        costCalc = 5;
    }


    for(var i=1; i<costCalc; i++){
        cost = cost + '⭐';
    }

    return { cpuName: name, cpuPrice: price, cpuImage: image, cpuSpecs: cores, cpuScore: score, cpuBrand: brand, performanceRating: performance, costRating: cost};
}

app.get('/cpulist', async (req, res) => {
    const data = cpuList;
    res.json(data);
});

app.get('/cpulist/ryzen75800x3d', async (req, res) => {
    const data = await fetchData('ryzen75800x3d');
    res.json(data);
});

app.get('/cpulist/ryzen54600g', async (req, res) => {
    const data = await fetchData('ryzen54600g');
    res.json(data);
});

app.get('/cpulist/ryzen55500', async (req, res) => {
    const data = await fetchData('ryzen55500');
    res.json(data);
});

app.get('/cpulist/ryzen55600', async (req, res) => {
    const data = await fetchData('ryzen55600');
    res.json(data);
});

app.get('/cpulist/corei310100f', async (req, res) => {
    const data = await fetchData('corei310100f');
    res.json(data);
});

app.get('/cpulist/corei512400f', async (req, res) => {
    const data = await fetchData('corei512400f');
    res.json(data);
});

app.get('/cpulist/corei913900k', async (req, res) => {
    const data = await fetchData('corei913900k');
    res.json(data);
});

app.get('/cpulist/corei714700k', async (req, res) => {
    const data = await fetchData('corei714700k');
    res.json(data);
});


const port = 3001;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
