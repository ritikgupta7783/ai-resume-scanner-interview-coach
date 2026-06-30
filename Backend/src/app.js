const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")  // ✅ Only need this once

const app = express()

app.use(express.json())
app.use(cookieParser())

// ✅ CORS configuration - fixed
app.use(cors({
  origin: 'https://ai-resume-scanner-interview-coach.vercel.app',
  credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.get("/", (req, res) => {
  res.send("Backend Running 🚀")
})

module.exports = app