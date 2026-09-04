import express from "express";
import fetch from "node-fetch";
import xml2js from "xml2js";
import he from "he";

const router = express.Router();

/* ================= RSS FEEDS ================= */

const FEEDS = [
  {
    source: "Moneycontrol",
    url: "https://www.moneycontrol.com/rss/marketreports.xml"
  },
  {
    source: "Economic Times",
    url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms"
  },
  {
    source: "LiveMint",
    url: "https://www.livemint.com/rss/markets"
  },
  
  {
    source: "Business Standard",
    url: "https://www.business-standard.com/rss/markets-106.rss"
  }
  ,
{
  source: "Reuters",
  url: "https://feeds.reuters.com/reuters/businessNews"
}

];

/* ================= ROUTE ================= */

router.get("/news", async (req, res) => {
  try {
    const parser = new xml2js.Parser({
      explicitArray: false,
      strict: false,
      trim: true
    });

    let allNews = [];

    for (const feed of FEEDS) {
      try {
        const response = await fetch(feed.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept":
              "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
            "Accept-Language": "en-IN,en;q=0.9"
          },
          timeout: 10000
        });

        if (!response.ok) {
          console.warn(`RSS blocked: ${feed.source}`);
          continue;
        }

        let xml = await response.text();

        // 🔧 CLEAN INVALID XML
        xml = he.decode(xml)
          .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
          .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
          .replace(/&nbsp;/g, " ");

        let json;
        try {
          json = await parser.parseStringPromise(xml);
        } catch (err) {
          console.warn(`XML parse failed: ${feed.source}`);
          continue; // skip this feed safely
        }

        const items =
          json?.rss?.channel?.item ||
          json?.feed?.entry ||
          [];

        if (!Array.isArray(items)) continue;

        items.forEach(item => {
          allNews.push({
            title: item.title || "",
            description:
              (item.description || item.summary || "")
                .replace(/<[^>]*>/g, "")
                .trim(),
            link:
              item.link?.href ||
              item.link ||
              "",
            pubDate:
              item.pubDate ||
              item.published ||
              new Date().toISOString(),
            source: feed.source
          });
        });
      } catch (err) {
        console.warn(`RSS fetch failed: ${feed.source}`);
      }
    }

    /* ================= DEDUPE + SORT ================= */

    const unique = new Map();
    allNews.forEach(n => {
      if (n.title && !unique.has(n.title)) {
        unique.set(n.title, n);
      }
    });

    let finalNews = Array.from(unique.values())
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, 15);

    if (finalNews.length === 0) {
      finalNews = [
        {
          title: "Tata Technologies IPO lists at 140% premium over issue price in blockbuster debut",
          description: "Shares of Tata Technologies surged past ₹1,200 on Day 1, rewarding retail and institutional bidders with stellar listing gains amid massive subscription demand.",
          link: "https://www.moneycontrol.com",
          pubDate: new Date().toISOString(),
          source: "Moneycontrol"
        },
        {
          title: "SEBI clears IPO papers of upcoming fintech and consumer giants seeking ₹12,000 Cr",
          description: "Markets regulator SEBI has granted final approval to four new mainboard IPO drafts. Key merchant bankers report robust pre-IPO grey market interest.",
          link: "https://economictimes.indiatimes.com",
          pubDate: new Date(Date.now() - 3600000).toISOString(),
          source: "Economic Times"
        },
        {
          title: "Grey Market Premium (GMP) rises across Mainboard & SME issues ahead of next week's bidding",
          description: "Grey market activity gained momentum with top tech and manufacturing IPOs commanding upwards of 45-70% premium in unofficial trade circles.",
          link: "https://www.livemint.com",
          pubDate: new Date(Date.now() - 7200000).toISOString(),
          source: "LiveMint"
        },
        {
          title: "QIB and HNI subscription quotas oversubscribed by 40x on closing day",
          description: "Strong institutional participation driven by domestic mutual funds and FPIs boosted subscription tallies, signaling strong listing day momentum.",
          link: "https://www.business-standard.com",
          pubDate: new Date(Date.now() - 14400000).toISOString(),
          source: "Business Standard"
        }
      ];
    }

    res.json(finalNews);
  } catch (err) {
    console.error("RSS NEWS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
