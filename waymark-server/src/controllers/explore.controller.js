import Memory from "../models/Memory.js";
import User from "../models/User.js";

export const getExplore = async (req, res) => {
  try {
    const trendingMemories = await Memory.find()
      .populate("author", "username fullName avatar")
      .sort({ createdAt: -1 })
      .limit(10);

    const popularTravelers = await User.find()
      .select("username fullName bio country avatar followers")
      .sort({ createdAt: -1 })
      .limit(10);

    const memories = await Memory.find();

    const countries = [...new Set(memories.map((m) => m.country))];
    const cities = [...new Set(memories.map((m) => m.city))];

    return res.status(200).json({
      success: true,
      explore: {
        trendingMemories,
        popularTravelers,
        popularCountries: countries,
        popularCities: cities,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};