import User from "../models/User.js";
import Notification from "../models/Notification.js";

// Get user profile
export const getMyProfile = async (req,res)=>{
    try{
        return res.status(200).json({
            success:true,
            user:req.user,
        });
    }
     catch(error){
        return res.status(500).json({
            success:false,
            message:"error.message",
        });
     }
};

// Update user profile
export const updateProfile = async (req,res) =>{
     try{
        const{
            fullName,
            bio,
            country,
            website,
        } = req.body;

        const updatedUser  = await User.findByIdAndUpdate(
            req.user._id,
            {
                fullName,
                bio,
                country,
                website,
            },
            {
                new:true,
                runValidators:true,
            }
        ).select("-password");

        return res.status(200).json({
            success:true,
            user:updatedUser,
        });
     } catch(error){
        return res.status(500).json({
            success:false,
            message:"error.message",
        })
     }
}

export const getUserProfile = async (req,res) =>{
    try{

          const user  = await User.findOne({username:req.params.username}).select("-password");

          if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
          }

            return res.status(200).json({
                success:true,
                user,
            });

            return res.status(200).json({
                success:true,
                user,
            });



    } catch(error){
        return res.status(500).json({
            success:false,
            message:"error.message",
        })
     }
}

export const toggleFollowUser = async (
  req,
  res
) => {
  try {

    const currentUser =
      await User.findById(req.user._id);

    const targetUser =
      await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      currentUser._id.toString() ===
      targetUser._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot follow yourself",
      });
    }

    const alreadyFollowing =
      currentUser.following.includes(
        targetUser._id
      );

    if (alreadyFollowing) {

      currentUser.following =
        currentUser.following.filter(
          id =>
            id.toString() !==
            targetUser._id.toString()
        );

      targetUser.followers =
        targetUser.followers.filter(
          id =>
            id.toString() !==
            currentUser._id.toString()
        );

      await currentUser.save();
      await targetUser.save();

     
        await Notification.create({
        recipient: targetUser._id,
        sender: currentUser._id,
        type: "follow",
      });
      
      

      return res.status(200).json({
        success: true,
        following: false,
      });
    }

    currentUser.following.push(
      targetUser._id
    );

    targetUser.followers.push(
      currentUser._id
    );

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({
      success: true,
      following: true,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};