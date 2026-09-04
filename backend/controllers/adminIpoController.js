import Ipo from "../models/Ipo.js";

/* GET ALL IPOs */
export const getAllIpos = async (req, res) => {
  const ipos = await Ipo.find().sort({ createdAt: -1 });
  res.json(ipos);
};

/* CREATE IPO */
export const createIpo = async (req, res) => {
  const ipo = await Ipo.create(req.body);
  res.status(201).json(ipo);
};

/* UPDATE IPO */
export const updateIpo = async (req, res) => {
  const ipo = await Ipo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ipo);
};

/* CLOSE IPO */
export const closeIpo = async (req, res) => {
  const ipo = await Ipo.findById(req.params.id);
  ipo.status = "closed";
  await ipo.save();
  res.json({ message: "IPO closed" });
};
