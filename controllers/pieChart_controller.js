import Product from "../models/product_model.js";
import connectToDB from "../db/connection.js";
import { getMonthNumber } from "../utils/dateUtils.js";

const pieChartData = async (req, res) => {
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

        // Create a map to store category counts
        const categoryCounts = {};

        filteredTransactions.forEach((transaction) => {
            const category = transaction.category;

            if (categoryCounts[category]) {
                categoryCounts[category]++;
            } else {
                categoryCounts[category] = 1;
            }
        });

        // Convert categoryCounts object into an array of objects
        const pieChartData = Object.entries(categoryCounts).map(([category, count]) => ({
            category,
            items: count
        }));

        // Return structured response
        res.json({ pieChartData });

    } catch (error) {
        console.error("Error fetching pie chart data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default pieChartData;