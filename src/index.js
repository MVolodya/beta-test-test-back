import express from "express";
import middlewaresConfig from "./config/middlewares";
import pollRoutes from "./routes/pollRoutes.js";

const app = express();

middlewaresConfig(app);

const PORT = process.env.PORT || 8000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api", pollRoutes);

app.listen(PORT, err => {
  if (err) {
    throw err;
  } else {
    console.log(
      `Server running on port: ${PORT} || Welcome to ${
        process.env.NODE_ENV
      } mode`
    );
  }
});
