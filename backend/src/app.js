import express from "express";
const app = express();


app.get("/", (req, res) => {
  res.send("Hello World!")
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: "OK",
  });
});

export default app;