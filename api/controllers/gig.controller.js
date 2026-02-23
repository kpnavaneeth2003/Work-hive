import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create a gig!"));

  // ✅ IMPORTANT: userId must be last so req.body can't override it
  const newGig = new Gig({
    ...req.body,
    userId: req.userId,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig.userId !== req.userId)
      return next(createError(403, "You can delete only your gig!"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};
export const getGigs = async (req, res, next) => {
  try {
    const q = req.query;

    // ✅ parse numbers safely
    const min = q.min !== undefined && q.min !== "" ? Number(q.min) : undefined;
    const max = q.max !== undefined && q.max !== "" ? Number(q.max) : undefined;

    // optional: if invalid numbers
    if ((min !== undefined && Number.isNaN(min)) || (max !== undefined && Number.isNaN(max))) {
      return next(createError(400, "Invalid min/max price"));
    }

    const filters = {
      ...(q.userId && { userId: q.userId }),

      ...(q.cat && { cat: { $regex: q.cat, $options: "i" } }),

      ...(q.search && { title: { $regex: q.search, $options: "i" } }),

      ...((min !== undefined || max !== undefined) && {
        price: {
          ...(min !== undefined && { $gte: min }), // ✅ inclusive
          ...(max !== undefined && { $lte: max }), // ✅ inclusive
        },
      }),
    };

    // ✅ whitelist sort fields (prevents weird values)
    const allowedSort = ["sales", "createdAt", "price"];
    const sortField = allowedSort.includes(q.sort) ? q.sort : "sales";

    const gigs = await Gig.find(filters).sort({ [sortField]: -1 });

    res.status(200).send(gigs);
  } catch (err) {
    next(err);
  }
};
