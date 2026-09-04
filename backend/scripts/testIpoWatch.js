import * as cheerio from "cheerio";
import fetch from "node-fetch";

async function inspectIpoWatch() {
  console.log("Fetching IPOWatch...");
  const res = await fetch("https://ipowatch.in/ipo-grey-market-premium-latest-ipo-gmp/", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  console.log("Status:", res.status);
  const html = await res.text();
  const $ = cheerio.load(html);

  const tables = $("table");
  console.log("Found tables:", tables.length);

  tables.each((tIdx, table) => {
    console.log(`\n--- TABLE ${tIdx + 1} ---`);
    const headers = [];
    $(table).find("thead tr th, tr th").each((_, th) => {
      headers.push($(th).text().trim().replace(/\s+/g, " "));
    });
    console.log("Headers:", headers);

    const rows = [];
    $(table).find("tbody tr, tr").slice(1, 8).each((_, tr) => {
      const cells = [];
      $(tr).find("td").each((_, td) => {
        cells.push($(td).text().trim().replace(/\s+/g, " "));
      });
      if (cells.length) rows.push(cells);
    });
    console.log("Sample Rows:", rows);
  });
}

inspectIpoWatch().catch(console.error);
