import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create a gig!"));

  try {
    const {
      lat,
      lng,
      city,
      area,
      address,
      ...rest
    } = req.body;

    const newGig = new Gig({
      ...rest,
      userId: req.userId,
      city,
      area,
      address: address || "",
      location:
        lat !== undefined && lng !== undefined
          ? {
              type: "Point",
              coordinates: [Number(lng), Number(lat)], // [lng, lat]
            }
          : undefined,
    });

    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return next(createError(404, "Gig not found!"));
    }

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

    if (!gig) return next(createError(404, "Gig not found!"));

    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};

export const getGigs = async (req, res, next) => {
  try {
    const q = req.query;

    const min = q.min !== undefined && q.min !== "" ? Number(q.min) : undefined;
    const max = q.max !== undefined && q.max !== "" ? Number(q.max) : undefined;
    const lat = q.lat !== undefined && q.lat !== "" ? Number(q.lat) : undefined;
    const lng = q.lng !== undefined && q.lng !== "" ? Number(q.lng) : undefined;

    if (
      (min !== undefined && Number.isNaN(min)) ||
      (max !== undefined && Number.isNaN(max))
    ) {
      return next(createError(400, "Invalid min/max price"));
    }

    if (
      (lat !== undefined && Number.isNaN(lat)) ||
      (lng !== undefined && Number.isNaN(lng))
    ) {
      return next(createError(400, "Invalid latitude/longitude"));
    }

    const filters = {
      ...(q.userId && { userId: q.userId }),

      ...(q.cat && { cat: { $regex: q.cat, $options: "i" } }),

      ...(q.search && {
        $or: [
          { title: { $regex: q.search, $options: "i" } },
          { desc: { $regex: q.search, $options: "i" } },
          { shortTitle: { $regex: q.search, $options: "i" } },
          { shortDesc: { $regex: q.search, $options: "i" } },
        ],
      }),

      ...(q.city && { city: { $regex: `^${escapeRegex(q.city)}$`, $options: "i" } }),

      ...(q.area && { area: { $regex: `^${escapeRegex(q.area)}$`, $options: "i" } }),

      ...((min !== undefined || max !== undefined) && {
        price: {
          ...(min !== undefined && { $gte: min }),
          ...(max !== undefined && { $lte: max }),
        },
      }),
    };

    let gigs = await Gig.find(filters).lean();

    if (lat !== undefined && lng !== undefined) {
      gigs = gigs.map((gig) => {
        const coords = gig.location?.coordinates;

        if (!coords || coords.length !== 2) {
          return {
            ...gig,
            distanceKm: null,
          };
        }

        const [gigLng, gigLat] = coords;

        const distanceKm = getDistanceKm(lat, lng, gigLat, gigLng);

        return {
          ...gig,
          distanceKm: Number(distanceKm.toFixed(2)),
        };
      });
    }

    if (q.sort === "distance") {
      gigs.sort((a, b) => {
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    } else {
      const allowedSort = ["sales", "createdAt", "price"];
      const sortField = allowedSort.includes(q.sort) ? q.sort : "sales";

      gigs.sort((a, b) => {
        if (sortField === "createdAt") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return (b[sortField] || 0) - (a[sortField] || 0);
      });
    }

    res.status(200).send(gigs);
  } catch (err) {
    next(err);
  }
};

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}