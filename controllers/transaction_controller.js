import Product from "../models/product_model.js";
import connectToDB from "../db/connection.js";
import { getMonthNumber } from "../utils/dateUtils.js";

const filterTransactions = async (req, res) => {
    try {
        await connectToDB();
        // console.log("welcome to transaction controller file");

        let { search = "", month, page = 1, per_page = 10 } = req.query;
        page = parseInt(page);
        per_page = parseInt(per_page);

        // Convert month name to number
        if (month) {
            month = isNaN(month) ? getMonthNumber(month) : parseInt(month);
        }

        let query = {};

        // Filter by Month 
        if (month >= 1 && month <= 12) {
            query.$expr = { $eq: [{ $month: { $toDate: "$dateOfSale" } }, month] };
        }

        // Search Functionality (title, description, price)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { price: !isNaN(search) ? Number(search) : null }
            ];
        }

        // Fetch total count (before pagination)
        const total = await Product.countDocuments(query);

        // Fetch filtered & paginated transactions
        const transactions = await Product.find(query)
            .skip((page - 1) * per_page)
            .limit(per_page);

        // Return response
        res.json({
            total,
            page,
            per_page,
            data: transactions
        });

    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default filterTransactions;