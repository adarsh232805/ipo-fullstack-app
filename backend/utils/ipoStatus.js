export const getIpoStatus = (ipo) => {
  if (!ipo.openDate || !ipo.closeDate) return "open";

  const now = new Date();
  const open = new Date(ipo.openDate);
  const close = new Date(ipo.closeDate);

  if (now < open) return "upcoming";
  if (now > close) return "closed";
  return "open";
};
