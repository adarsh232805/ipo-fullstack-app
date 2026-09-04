export function aiAnalyzeIpos(ipos) {
  if (!ipos || ipos.length < 2) return "";

  let result = "📊 IPO Comparison Summary:\n\n";

  const sortedByGmp = [...ipos].sort((a, b) => (b.gmp || 0) - (a.gmp || 0));
  const safest = [...ipos].sort(
    (a, b) =>
      (a.risks?.length || 0) - (b.risks?.length || 0)
  );

  result += `🔥 Highest GMP Momentum: ${sortedByGmp[0].company}\n`;
  result += `🛡️ Lowest Risk Profile: ${safest[0].company}\n\n`;

  ipos.forEach((ipo) => {
    result += `• ${ipo.company}: GMP ₹${ipo.gmp || 0}, Total Sub ${
      ipo.subscription?.total || 0
    }x\n`;
  });

  result +=
    "\n⚠️ High GMP can be risky. Always balance fundamentals with market sentiment.";

  return result;
}

export function aiChatReply(question, ipos) {
  const q = question.toLowerCase();

  if (q.includes("safe")) {
    const safest = ipos.reduce((a, b) =>
      (a.risks?.length || 0) < (b.risks?.length || 0) ? a : b
    );
    return `${safest.company} appears safer due to fewer listed risks.`;
  }

  if (q.includes("gmp")) {
    const top = ipos.reduce((a, b) => (a.gmp || 0) > (b.gmp || 0) ? a : b);
    return `${top.company} has the highest GMP, but high GMP can reverse quickly.`;
  }

  return "This IPO comparison suggests evaluating both GMP momentum and long-term fundamentals before investing.";
}
