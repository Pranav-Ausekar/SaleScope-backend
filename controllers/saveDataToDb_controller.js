import axios from 'axios';
import connectToDB from '../db/connection.js';
import Product from '../models/product_model.js';


const saveDataToDb = async (req, res) => {
    try {
        const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json")
        // console.log(response.data);
        const data = await response.data;
        // res.send(data);

        // connect to db
        await connectToDB();
        console.log("Database connected successfully");

        await Product.insertMany(data);
        console.log("data inserted into DB");

        res.status(200).json({ message: "Data saved successfully" });
    } catch (error) {
        console.log("error fetching/saving data", error);
        res.status(500).send("failed to fetch and save data");
    }
}

export default saveDataToDb;