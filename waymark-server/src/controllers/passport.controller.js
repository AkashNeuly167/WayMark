import Memory from "../models/Memory.js";
import BucketList from "../models/BucketList.js";

export const getPassport = async (req, res) => {
  try {

    const memories = await Memory.find({
      author: req.user._id,
    });

    const bucketList =
      await BucketList.find({
        user: req.user._id,
      });

    const countries =
      [...new Set(
        memories.map(
          memory => memory.country
        )
      )];

    const cities =
      [...new Set(
        memories.map(
          memory => memory.city
        )
      )];

    return res.status(200).json({
      success: true,
      passport: {
        countriesVisited:
          countries.length,

        citiesVisited:
          cities.length,

        memoriesCreated:
          memories.length,

        bucketListCount:
          bucketList.length,

        countries,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};