import express from 'express';

import saveDataToDb from '../controllers/saveDataToDb_controller.js'
import filterTransactions from '../controllers/transaction_controller.js';
import statisticsData from '../controllers/statistics_controller.js';
import barChartData from '../controllers/barChartData_controller.js';
import pieChartData from '../controllers/pieChart_controller.js';
import combinedData from '../controllers/combinedData_controller.js';

const router = express.Router();

router.get('/savedata', saveDataToDb);
router.get('/transactions', filterTransactions);
router.get('/statistics', statisticsData);
router.get('/barChart', barChartData);
router.get('/pieChart', pieChartData);
router.get('/combinedData', combinedData);


export default router;