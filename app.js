const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const allroutes = require("./Routes/index");

/**
 * todo : using all middleware
 */

app.use(express.json());
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       const allowedOrigins = [
//         "http://localhost:5173",
//         "http://localhost:5174",
//         "https://dashboard.theclimatewatch.net",
//         // "https://www.theclimatewatch.net",
//         "https://theclimatewatch.net",
//         "https://test.theclimatewatch.net",
//       ];

//       // Allow requests with no origin (like Postman or curl)
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // Allow cookies and credentials
//   })
// );

app.use(cors());

// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(allroutes);

module.exports = { app };
