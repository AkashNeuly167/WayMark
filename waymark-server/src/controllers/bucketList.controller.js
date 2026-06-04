import BucketList from "../models/BucketList.js";

export const createBucketItem = async (req, res) => {
  try {
     
    const missingFields = validateRequiredFields(req.body, [
  "title",
  "country",
  "city",
  "locationName",
]);

if (missingFields.length > 0) {
  return res.status(400).json({
    success: false,
    message: "Missing required fields",
    missingFields,
  });
}

    const bucketItem = await BucketList.create({
      ...req.body,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      bucketItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBucketList = async (req, res) => {
  try {
    const bucketList = await BucketList.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: bucketList.length,
      bucketList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBucketItem = async (req, res) => {
  try {
    const bucketItem = await BucketList.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!bucketItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      bucketItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBucketItem = async (req, res) => {
  try {
    const bucketItem = await BucketList.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!bucketItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bucket item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
