import Memory from "../models/Memory.js";

export const getTravelWrapped = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year + 1}-01-01`);

    const memories = await Memory.find({
      author: req.user._id,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const countries = [...new Set(memories.map((m) => m.country))];
    const cities = [...new Set(memories.map((m) => m.city))];

    const totalLikes = memories.reduce(
      (sum, memory) => sum + memory.likes.length,
      0
    );

    const totalComments = memories.reduce(
      (sum, memory) => sum + (memory.commentsCount || 0),
      0
    );

    const mostLikedMemory = memories.sort(
      (a, b) => b.likes.length - a.likes.length
    )[0];

    return res.status(200).json({
      success: true,
      year,
      wrapped: {
        memoriesCreated: memories.length,
        countriesVisited: countries.length,
        citiesVisited: cities.length,
        totalLikes,
        totalComments,
        topMemory: mostLikedMemory || null,
        countries,
        cities,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};