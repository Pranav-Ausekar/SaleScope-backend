import Product from "../models/product_model.js";
import connectToDB from "../db/connection.js";
import { getMonthNumber } from "../utils/dateUtils.js";


const barChartData = async (req, res) => {
    try {
        await connectToDB();

        let { month } = req.query;

        if (month) {
            month = isNaN(month) ? getMonthNumber(month) : parseInt(month);
        }

        // Validate month
        if (!month || month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month provided" });
        }

        // Fetch all transactions
        const transactions = await Product.find();

        // Filter transactions that belong to the selected month
        const filteredTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.dateOfSale);
            return transactionDate.getMonth() + 1 === month; // getMonth() is 0-based
        });

        // Define price ranges
        const priceRanges = {
            "0-100": 0,
            "101-200": 0,
            "201-300": 0,
            "301-400": 0,
            "401-500": 0,
            "501-600": 0,
            "601-700": 0,
            "701-800": 0,
            "801-900": 0,
            "901-above": 0
        };

        // Categorize transactions based on price
        filteredTransactions.forEach((transaction) => {
            const price = transaction.price;

            if (price >= 0 && price <= 100) priceRanges["0-100"]++;
            else if (price >= 101 && price <= 200) priceRanges["101-200"]++;
            else if (price >= 201 && price <= 300) priceRanges["201-300"]++;
            else if (price >= 301 && price <= 400) priceRanges["301-400"]++;
            else if (price >= 401 && price <= 500) priceRanges["401-500"]++;
            else if (price >= 501 && price <= 600) priceRanges["501-600"]++;
            else if (price >= 601 && price <= 700) priceRanges["601-700"]++;
            else if (price >= 701 && price <= 800) priceRanges["701-800"]++;
            else if (price >= 801 && price <= 900) priceRanges["801-900"]++;
            else priceRanges["901-above"]++;
        });

        // Return structured response
        res.json({ priceRanges });

    } catch (error) {
        console.error("Error fetching bar chart data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default barChartData;