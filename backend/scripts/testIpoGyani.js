import * as cheerio from "cheerio";
import fetch from "node-fetch";

async function testScrape() {
  console.log("Fetching IPOGyani...");
  const res = await fetch("https://ipogyani.com/ipo-gmp-today", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  console.log("Status:", res.status);
  const html = await res.text();
  const $ = cheerio.load(html);

  const ipos = [];
  $("table tbody tr").each((_, row) => {
    const nameEl = $(row).find("td").eq(1);
    const company = nameEl.find("a").first().text().trim();
    const lotText = nameEl.text();
    const lotMatch = lotText.match(/Lot:\s*(\d+)/i);
    const lotSize = lotMatch ? parseInt(lotMatch[1], 10) : 0;
    const isSme = lotText.toLowerCase().includes("sme");

    const gmpCol = $(row).find("td").eq(2).text().trim();
    const aiCol = $(row).find("td").eq(3).text().trim();
    const gainCol = $(row).find("td").eq(4).text().trim();
    const priceCol = $(row).find("td").eq(5).text().trim();

    if (company) {
      ipos.push({
        company,
        board: isSme ? "SME" : "MAINBOARD",
        lotSize,
        gmpText: gmpCol,
        aiPredictionText: aiCol,
        gainPerLotText: gainCol,
        priceBand: priceCol
      });
    }
  });

  console.log("Total Scraped from IPOGyani:", ipos.length);
  console.log("Sample 4 IPOs:", JSON.stringify(ipos.slice(0, 4), null, 2));
}

testScrape().catch(console.error);
