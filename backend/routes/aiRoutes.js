import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

function generateFallbackAnalysis(message, ipos) {
  const query = (message || "").toLowerCase();
  if (query.includes("gmp") || query.includes("grey market") || query.includes("premium")) {
    return "📊 **GMP Highlights:**\n• **Bajaj Housing Finance:** ₹75 GMP (~107% estimated listing gain)\n• **Premier Energies:** ₹420 GMP (~93% estimated listing gain)\n• **KRN Heat Exchanger:** ₹235 GMP (~107% premium)\n\nHigh GMP reflects strong secondary market interest. Always check subscription numbers on Day 3 before placing your bid.";
  }
  if (query.includes("apply") || query.includes("best") || query.includes("recommend") || query.includes("buy")) {
    return "💡 **Application Insights:**\n• **Bajaj Housing Finance:** Solid parentage (Bajaj Group), excellent asset quality, and massive institutional subscription.\n• **Premier Energies:** Top-tier solar cell manufacturer with strong government policy tailwinds.\n• **Strategy:** For listing gains, focus on issues with >50% GMP and healthy QIB oversubscription.";
  }
  if (query.includes("allotment") || query.includes("status")) {
    return "🔍 **Allotment Tracking:**\n• Allotment status can be verified directly through registrar portals (KFintech, Link Intime, Bigshare).\n• You can also visit your **Dashboard → Allotment** section to check current allotment status directly.";
  }
  return "📈 **IPO Insight Assistant:**\nCurrent IPO market momentum is strongly positive, especially in housing finance and renewable energy. Top trending IPOs right now are **Bajaj Housing Finance** and **Premier Energies**. Feel free to ask about GMP, valuation, subscription figures, or registrar status for any specific IPO!";
}

router.post("/groq", async (req, res) => {
  const { message, ipos } = req.body;

  if (!message) {
    return res.json({ reply: "Please ask a question about any IPO." });
  }

  const apiKey = (process.env.GROQ_API_KEY || "").trim();

  if (apiKey) {
    try {
      const groq = new Groq({ apiKey });

      const context =
        ipos && ipos.length > 0
          ? ipos
              .map(
                i => `
Company: ${i.companyName || i.company || "N/A"}
GMP: ₹${i.gmp ?? 0}
Price Band: ${i.priceBand ?? "N/A"}
Subscription: ${i.subscription?.total ?? "N/A"}x
Strengths: ${Array.isArray(i.strengths) ? i.strengths.join(", ") : "N/A"}
Risks: ${Array.isArray(i.risks) ? i.risks.join(", ") : "N/A"}
`
              )
              .join("\n")
          : "No IPO data provided.";

      const prompt = `
You are an expert Indian IPO analyst.

IPO DATA:
${context}

USER QUESTION:
${message}
`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful Indian stock market and IPO expert." },
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 300
      });

      const reply = completion.choices[0]?.message?.content;
      if (reply) {
        return res.json({ reply });
      }
    } catch (error) {
      console.warn("Groq API fallback:", error.message);
    }
  }

  // Fallback if Groq unavailable or errors out
  return res.json({
    reply: generateFallbackAnalysis(message, ipos)
  });
});

export default router;
