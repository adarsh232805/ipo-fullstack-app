import Ipo from "../../models/Ipo.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    const total = await Ipo.countDocuments();

    const upcoming = await Ipo.countDocuments({ status: "upcoming" });
    const open = await Ipo.countDocuments({ status: "open" });
    const closed = await Ipo.countDocuments({ status: "closed" });
    const listed = await Ipo.countDocuments({ status: "listed" });

    const trending = await Ipo.countDocuments({ isTrending: true });

    const gmpStats = await Ipo.aggregate([
      {
        $group: {
          _id: null,
          avgGmp: { $avg: "$gmp" },
          maxGmp: { $max: "$gmp" }
        }
      }
    ]);

    const latestIpos = await Ipo.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("companyName status gmp createdAt");

    res.json({
      total,
      status: {
        upcoming,
        open,
        closed,
        listed
      },
      trending,
      gmp: {
        average: Math.round(gmpStats[0]?.avgGmp || 0),
        highest: gmpStats[0]?.maxGmp || 0
      },
      latestIpos
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};
