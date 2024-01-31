import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();

app.use(cors());

const cpuList = [
    ['ryzen75800x3d', 'i310100f', 'ryzen54600g'],
    [
        'https://www.kabum.com.br/produto/320796/processador-amd-ryzen-7-5800x3d-3-4ghz-4-5ghz-max-turbo-cache-100mb-am4-sem-video-100-100000651wof?gad_source=1',
        'https://www.kabum.com.br/produto/129960/processador-intel-core-i3-10100f-3-6ghz-4-3ghz-max-boost-cache-6mb-quad-core-8-threads-lga-1200-bx8070110100f',
        'https://www.kabum.com.br/produto/333145/processador-amd-ryzen-5-4600g-3-7ghz-4-2ghz-max-turbo-cache-11mb-am4-video-integrado-100-100000147box?gad_source=1', 'https://www.kabum.com.br/produto/333145/processador-amd-ryzen-5-4600g-3-7ghz-4-2ghz-max-turbo-cache-11mb-am4-video-integrado-100-100000147box?gad_source=1'
    ],
    ['https://www.cpubenchmark.net/cpu.php?id=4823&cpu=AMD+Ryzen+7+5800X3D', 
    'https://www.cpubenchmark.net/cpu.php?cpu=Intel+Core+i3-10100F+%40+3.60GHz&id=3863',
    'https://www.cpubenchmark.net/cpu.php?cpu=AMD+Ryzen+5+4600G&id=3807']];

async function fetchData(cpuName) {
    let cpuIndex = cpuList[0].indexOf(cpuName);
    let cpuLink = cpuList[1][cpuIndex];
    let cpuTest = cpuList[2][cpuIndex];

    const browserPromise = puppeteer.launch();
    const browser = await browserPromise;
    let page = await browser.newPage();
    await page.goto(cpuLink);

    const name = await page.$eval('#description h2', (h2) => h2.innerText);
    const price = await page.$eval('.sc-5492faee-2.ipHrwP.finalPrice', (h4) => h4.innerText);
    const image = await page.$eval('.image img', (img) => img.src);

    page = await browser.newPage();
    await page.goto(cpuTest);

    const score = await page.$eval('.right-desc span:nth-child(3)', (span) => span.innerText);

    return { cpuName: name, cpuPrice: price, cpuImage: image, cpuScore: score };
}

app.get('/cpulist/i310100f', async (req, res) => {
    const data = await fetchData('i310100f');
    res.json(data);
});

app.get('/cpulist/ryzen54600g', async (req, res) => {
    const data = await fetchData('ryzen54600g');
    res.json(data);
});

app.get('/cpulist/ryzen75800x3d', async (req, res) => {
    const data = await fetchData('ryzen75800x3d');
    res.json(data);
});

const port = 3001;

app.listen(port, () => {
    console.log(`Servidor rodando na portaa ${port}`);
});
