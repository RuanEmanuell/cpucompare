import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();

app.use(cors());

const cpuList = [
    {
        cpu: 'Ryzen 7 5800X3d',
        brand: 'AMD',
        shopLink: 'https://www.kabum.com.br/produto/320796/processador-amd-ryzen-7-5800x3d-3-4ghz-4-5ghz-max-turbo-cache-100mb-am4-sem-video-100-100000651wof?gad_source=1',
        benchmarkLink: 'https://www.cpubenchmark.net/cpu.php?id=4823&cpu=AMD+Ryzen+7+5800X3D'
    },
    {
        cpu: 'Ryzen 5 4600G',
        brand: 'AMD',
        shopLink: 'https://www.kabum.com.br/produto/333145/processador-amd-ryzen-5-4600g-3-7ghz-4-2ghz-max-turbo-cache-11mb-am4-video-integrado-100-100000147box?gad_source=1',
        benchmarkLink: 'https://www.cpubenchmark.net/cpu.php?cpu=AMD+Ryzen+5+4600G&id=3807'
    }
]

async function fetchData(cpuName) {
    let cpuIndex = -1;
    function formatString(string){
        let formatedString = string.toLowerCase().replaceAll(' ', '').trim();
        return formatedString;
    }
    for (var i=0; i<cpuList.length; i++){
        if(formatString(cpuList[i]['cpu']) == formatString(cpuName)){
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
    
    return { cpuName: name, cpuPrice: price, cpuImage: image, cpuScore: score, cpuBrand: brand};
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


const port = 3001;

app.listen(port, () => {
    console.log(`Servidor rodando na portaa ${port}`);
});
