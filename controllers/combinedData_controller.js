import connectToDB from "../db/connection.js";
import { getMonthNumber } from "../utils/dateUtils.js";
import Product from "../models/product_model.js";

const combinedData = async (req, res) => {
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

        // Filter transactions based on the selected month
        const filteredTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.dateOfSale);
            return transactionDate.getMonth() + 1 === month; // getMonth() returns 0-based index
        });

        // *** Statistics Data ***
        let totalSaleAmount = 0;
        let totalSoldItems = 0;
        let totalUnsoldItems = 0;

        filteredTransactions.forEach((transaction) => {
            if (transaction.sold) {
                totalSaleAmount += transaction.price;
                totalSoldItems++;
            } else {
                totalUnsoldItems++;
            }
        });

        const statisticsData = {
            totalSaleAmount,
            totalSoldItems,
            totalUnsoldItems
        };

        // *** Bar Chart Data (Price Range Distribution) ***
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

        filteredTransactions.forEach((transaction) => {
            const price = transaction.price;
            if (price <= 100) priceRanges["0-100"]++;
            else if (price <= 200) priceRanges["101-200"]++;
            else if (price <= 300) priceRanges["201-300"]++;
            else if (price <= 400) priceRanges["301-400"]++;
            else if (price <= 500) priceRanges["401-500"]++;
            else if (price <= 600) priceRanges["501-600"]++;
            else if (price <= 700) priceRanges["601-700"]++;
            else if (price <= 800) priceRanges["701-800"]++;
            else if (price <= 900) priceRanges["801-900"]++;
            else priceRanges["901-above"]++;
        });

        const barChartData = Object.entries(priceRanges).map(([range, count]) => ({
            priceRange: range,
            itemCount: count
        }));

        // *** Pie Chart Data (Category Distribution) ***
        const categoryCounts = {};

        filteredTransactions.forEach((transaction) => {
            const category = transaction.category;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const pieChartData = Object.entries(categoryCounts).map(([category, count]) => ({
            category,
            items: count
        }));

        // *** Combined Response ***
        res.json({
            statisticsData,
            barChartData,
            pieChartData
        });

    } catch (error) {
        console.error("Error fetching combined data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default combinedData;
