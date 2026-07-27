import express from 'express';
import accountingController from '../controllers/accountingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Plan de Cuentas
router.get('/chart-of-accounts', accountingController.getChartOfAccounts);
router.get('/chart-of-accounts/:id', accountingController.getAccountById);
router.post('/chart-of-accounts', accountingController.createAccount);
router.put('/chart-of-accounts/:id', accountingController.updateAccount);
router.delete('/chart-of-accounts/:id', accountingController.deleteAccount);
router.get('/accounts-by-type/:type', accountingController.getAccountsByType);

// Asientos Contables
router.get('/journal-entries', accountingController.getJournalEntries);
router.get('/journal-entries/:id', accountingController.getJournalEntryById);
router.post('/journal-entries', accountingController.createJournalEntry);
router.post('/journal-entries/:id/post', accountingController.postJournalEntry);
router.post('/journal-entries/:id/cancel', accountingController.cancelJournalEntry);

// Reportes
router.get('/trial-balance', accountingController.getTrialBalance);
router.get('/income-statement', accountingController.getIncomeStatement);
router.get('/balance-sheet', accountingController.getBalanceSheet);

export default router;
