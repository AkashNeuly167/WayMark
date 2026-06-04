import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import memoryRoutes from "./routes/memory.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import searchRoutes from "./routes/search.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import bucketListRoutes from "./routes/bucketList.routes.js";
import passportRoutes from "./routes/passport.routes.js";
import travelWrappedRoutes from "./routes/travelWrapped.routes.js";
import exploreRoutes from "./routes/explore.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api", commentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bucketlist", bucketListRoutes);
app.use("/api/passport", passportRoutes);
app.use("/api/travel-wrapped", travelWrappedRoutes);
app.use("/api/explore", exploreRoutes);



app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);



app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Waymark API Running"
  });
});

export default app;