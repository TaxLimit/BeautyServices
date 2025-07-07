import express from "express";
import serviceRouter from "./routes/serviceRouter.mjs";
import userRouter from "./routes/userRouter.mjs";
import rsvpRouter from "./routes/rsvpRouter.mjs";
import AppError from "./utils/appError.mjs";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// parse body
app.use(express.json());

// Add cookie parser
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Routes

app.use(`/api/v1/services`, serviceRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/rsvps", rsvpRouter);

app.all("*", (req, res, next) => {
  //naudosime sukurtą AppError klasę
  const err = new AppError(`Cant find ${req.originalUrl} on this server!`, 404);

  //express žino pats, kad tai yra klaida ir ją perduoda centrinei klaidų valdymo funkcijai
  next(err);
});

// Global error handler (should be after all routes)
app.use((err, req, res, next) => {
  // If the request is for an API route, return JSON
  if (req.originalUrl.startsWith("/api/")) {
    res.status(err.statusCode || 500).json({
      status: err.status || "error",
      message: err.message || "Internal Server Error",
    });
  } else {
    // Otherwise, let Express handle it (for non-API routes)
    res.status(err.statusCode || 500);
    res.send(`<pre>${err.message}</pre>`);
  }
});

export default app;
