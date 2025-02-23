import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import allRoutes from './routes/allRoutes.js'

const app = express();
app.use(cors());
// app.use(cors({ origin: "http://localhost:5173" }));

dotenv.config();

const PORT = 4000;

app.get('/', (req, res) => {
    res.send("Welcome");
})

app.use('/api', allRoutes);

const port = process.env.PORT || PORT;
app.listen(port, (req, res) => {
    console.log(`listening on server ${port}`);
})