import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./routes/index";

//middleware
const app = express();
// app.use(cors());
app.use(
  cors({
    origin: `https://67729n-3000.csb.app`,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));
app.use(cookieParser());

//Routes
app.use("/api", routes.authRouter);

//database
import "./config/database";

//server listening
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
