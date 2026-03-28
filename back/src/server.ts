import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";

const allowedOrigins = [
  "http://localhost:3000",
  "https://your-money.vercel.app",
  "https://siimoney.vercel.app",
];
const app = express();
const port = process.env.PORT || 8080;
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`O servidor esta rodando: http://localhost:${port}`);
});
