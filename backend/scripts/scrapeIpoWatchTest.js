import * as cheerio from "cheerio";
import fetch from "node-fetch";

export async function scrapeIpoWatchFull() {
  const url = "https://ipowatch.in/ipo-grey-market-premium-latest-ipo-gmp/";
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  const html = await res.text();
  const $ = cheerio.load(html);
  const results = [];

  // Table 1: Mainboard IPOs
  $("table").eq(0).find("tbody tr, tr").slice(1).each((_, tr) => {
    const cells = $(tr).find("td").map((_, td) => $(td).text().trim().replace(/\s+/g, " ")).get();
    const link = $(tr).find("td").eq(0).find("a").attr("href") || null;
    if (cells.length >= 7) {
      const name = cells[0];
      if (!name || name === "NSE" || name.toLowerCase().includes("name")) return;
      const gmp = parseFloat(cells[1].replace(/[^0-9.-]/g, "")) || 0;
      const price = parseFloat(cells[3].replace(/[^0-9.-]/g, "")) || 0;
      const dateRange = cells[5] || "";
      const statusRaw = cells[6]?.toLowerCase() || "upcoming";
      const status = statusRaw.includes("open") ? "open" : statusRaw.includes("closed") ? "closed" : statusRaw.includes("listed") ? "listed" : "upcoming";

      results.push({
        companyName: name,
        board: "MAINBOARD",
        priceBand: price ? `₹${price}` : "TBA",
        gmp,
        status,
        dateRange,
        detailUrl: link
      });
    }
  });

  // Table 2: SME IPOs
  $("table").eq(1).find("tbody tr, tr").slice(1).each((_, tr) => {
    const cells = $(tr).find("td").map((_, td) => $(td).text().trim().replace(/\s+/g, " ")).get();
    const link = $(tr).find("td").eq(0).find("a").attr("href") || null;
    if (cells.length >= 7) {
      const name = cells[0];
      if (!name || name.toLowerCase().includes("name")) return;
      const gmp = parseFloat(cells[1].replace(/[^0-9.-]/g, "")) || 0;
      const price = parseFloat(cells[3].replace(/[^0-9.-]/g, "")) || 0;
      const dateRange = cells[5] || "";
      const statusRaw = cells[6]?.toLowerCase() || "upcoming";
      const status = statusRaw.includes("open") ? "open" : statusRaw.includes("closed") ? "closed" : statusRaw.includes("listed") ? "listed" : "upcoming";

      results.push({
        companyName: name,
        board: "SME",
        priceBand: price ? `₹${price}` : "TBA",
        gmp,
        status,
        dateRange,
        detailUrl: link
      });
    }
  });

  return results;
}

export async function scrapeDetailPageGmpHistory(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    if (!res.ok) {
      console.log(`Failed to fetch ${url}, status: ${res.status}`);
      return [];
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    console.log("HTML length of detail page:", html.length);
    console.log("Tables on page:", $("table").length);

    const history = [];
    $("table").each((idx, table) => {
      const fullText = $(table).text().replace(/\s+/g, " ");
      console.log(`Table ${idx} snippet:`, fullText.slice(0, 150));
      if (fullText.includes("Date") && (fullText.includes("GMP") || fullText.includes("Rates"))) {
        console.log(`Found matching GMP table at index ${idx}!`);
        $(table).find("tr").slice(1).each((_, tr) => {
          const cells = $(tr).find("td").map((_, td) => $(td).text().trim().replace(/\s+/g, " ")).get();
          if (cells.length >= 2) {
            const dateStr = cells[0];
            const gmpMatch = cells[1].match(/([0-9.-]+)/);
            const gmpVal = gmpMatch ? parseFloat(gmpMatch[1]) : (cells[1].includes("-") ? 0 : 0);
            if (dateStr && !dateStr.toLowerCase().includes("date")) {
              history.push({
                date: dateStr,
                gmp: isNaN(gmpVal) ? 0 : gmpVal,
                trend: cells[2] || "Active",
                gain: cells[3] || ""
              });
            }
          }
        });
      }
    });
    return history;
  } catch (err) {
    console.error("Error in scrapeDetailPageGmpHistory:", err.message);
    return [];
  }
}

async function testTargetUrls() {
  const urls = [
    "https://ipowatch.in/deepa-jewellers-ipo-gmp/",
    "https://ipowatch.in/deepa-jewellers-ipo-gmp-grey-market-premium/",
    "https://ipowatch.in/deepa-jewellers-ipo/"
  ];
  for (const u of urls) {
    console.log(`\nTesting URL: ${u}`);
    const h = await scrapeDetailPageGmpHistory(u);
    console.log(`Results from ${u}: count = ${h.length}`);
    if (h.length > 0) {
      console.log("First 3 items:", h.slice(0, 3));
      break;
    }
  }
}

testTargetUrls().catch(console.error);
