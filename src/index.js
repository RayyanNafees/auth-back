import express from 'express'
import mongoose from 'mongoose'
import userMiddleware from './middlewares/verify-jwt.js'
import authRouter from './routes/auth.js'


const app = express();
const port = process.env.PORT;

//middleware provided by Express to parse incoming JSON requests.
app.use(express.json()); 
// app.use(express.urlencoded())


await mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("MongoDB is connected!");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/auth', authRouter)

app.get("/protected", userMiddleware, (req, res) => {
  const { username } = req.user;
  res.send(`This is a Protected Route. Welcome ${username}`);
});


app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});

