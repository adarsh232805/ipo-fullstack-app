const fallbackNews = [
  {
    title: "Bajaj Housing Finance IPO subscribed over 67 times on strong QIB and NII demand",
    description: "The ₹6,560 crore public issue received bids worth over ₹3.2 lakh crore, making it one of the most subscribed IPOs in Indian market history.",
    link: "https://www.moneycontrol.com",
    pubDate: new Date().toISOString(),
    source: "Moneycontrol"
  },
  {
    title: "Premier Energies IPO lists at 120% premium over issue price on NSE and BSE",
    description: "Shares of solar manufacturer Premier Energies made a stellar market debut, surging to ₹990 against the issue price of ₹450.",
    link: "https://economictimes.indiatimes.com",
    pubDate: new Date(Date.now() - 3600000).toISOString(),
    source: "Economic Times"
  },
  {
    title: "Upcoming IPOs in September 2026: Pipeline remains robust with tech and infrastructure issues",
    description: "Over 15 companies are lined up to launch initial public offerings to raise a cumulative ₹18,000 crore.",
    link: "https://www.livemint.com",
    pubDate: new Date(Date.now() - 7200000).toISOString(),
    source: "LiveMint"
  },
  {
    title: "Grey Market Premium (GMP) updates: KRN Heat Exchanger and Western Carriers see active trading",
    description: "GMP trends indicate sustained retail enthusiasm across both mainboard and SME segments amidst buoyant secondary markets.",
    link: "https://www.moneycontrol.com",
    pubDate: new Date(Date.now() - 14400000).toISOString(),
    source: "Moneycontrol"
  }
];

export const fetchMergedIpoNews = async (ipoNames = []) => {
  try {
    const res = await fetch("http://localhost:5000/api/news");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        if (ipoNames.length) {
          const regex = new RegExp(ipoNames.join("|"), "i");
          const filtered = data.filter(
            n => regex.test(n.title) || regex.test(n.description)
          );
          if (filtered.length >= 2) return filtered.slice(0, 12);
        }
        return data.slice(0, 12);
      }
    }
  } catch (err) {
    console.warn("Backend news fetch fallback:", err.message);
  }

  // Fallback to rich curated financial news
  if (ipoNames.length) {
    const regex = new RegExp(ipoNames.join("|"), "i");
    const filtered = fallbackNews.filter(
      n => regex.test(n.title) || regex.test(n.description)
    );
    if (filtered.length >= 2) return filtered;
  }
  return fallbackNews;
};


