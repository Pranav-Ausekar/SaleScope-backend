import Product from "../models/product_model.js";
import connectToDB from "../db/connection.js";
import { getMonthNumber } from "../utils/dateUtils.js";

const statisticsData = async (req, res) => {
    // res.send("statistics controller");

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
            return transactionDate.getMonth() + 1 === month; // getMonth() returns 0-based index
        });

        // Calculate statistics using JavaScript methods
        // let totalSaleAmount = 0;
        // let totalSoldItems = 0;
        // let totalUnsoldItems = 0;

        // filteredTransactions.forEach((transaction) => {
        //     if (transaction.sold) {
        //         totalSaleAmount += transaction.price;
        //         totalSoldItems++;
        //     } else {
        //         totalUnsoldItems++;
        //     }
        // });

        let totalSaleAmount = filteredTransactions
            .filter(transaction => transaction.sold)
            .reduce((sum, transaction) => sum + Number(transaction.price), 0);

        let totalSoldItems = filteredTransactions.filter(transaction => transaction.sold).length;
        let totalUnsoldItems = filteredTransactions.filter(transaction => !transaction.sold).length;



        // Return statistics response
        res.json({
            totalSaleAmount,
            totalSoldItems,
            totalUnsoldItems
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default statisticsData;