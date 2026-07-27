import ChartOfAccount from '../../models/ChartOfAccount.js';
import JournalEntry from '../../models/JournalEntry.js';
import JournalLine from '../../models/JournalLine.js';

const accountingController = {
  // Plan de Cuentas
  getChartOfAccounts: async (req, res) => {
    try {
      const accounts = await ChartOfAccount.findAll();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAccountById: async (req, res) => {
    try {
      const account = await ChartOfAccount.findByPk(req.params.id);
      if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createAccount: async (req, res) => {
    try {
      const { code, name, type, subType, balance } = req.body;

      const account = await ChartOfAccount.create({
        code,
        name,
        type,
        subType,
        balance: balance || 0,
      });

      res.status(201).json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateAccount: async (req, res) => {
    try {
      const account = await ChartOfAccount.findByPk(req.params.id);
      if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });
      await account.update(req.body);
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const account = await ChartOfAccount.findByPk(req.params.id);
      if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });
      await account.destroy();
      res.json({ message: 'Cuenta eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAccountsByType: async (req, res) => {
    try {
      const { type } = req.params;
      const accounts = await ChartOfAccount.findAll({ where: { type } });
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Asientos Contables
  getJournalEntries: async (req, res) => {
    try {
      const entries = await JournalEntry.findAll({
        include: [{ model: JournalLine, as: 'lines' }],
        order: [['date', 'DESC']],
      });
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getJournalEntryById: async (req, res) => {
    try {
      const entry = await JournalEntry.findByPk(req.params.id, {
        include: [{ model: JournalLine, as: 'lines' }],
      });
      if (!entry) return res.status(404).json({ error: 'Asiento no encontrado' });
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createJournalEntry: async (req, res) => {
    try {
      const {
        date,
        description,
        referenceType,
        referenceId,
        lines,
      } = req.body;

      // Validar que débito = crédito
      const totalDebit = lines.reduce((sum, line) => sum + parseFloat(line.debit || 0), 0);
      const totalCredit = lines.reduce((sum, line) => sum + parseFloat(line.credit || 0), 0);

      if (totalDebit !== totalCredit) {
        return res.status(400).json({
          error: 'El débito no es igual al crédito',
          totalDebit,
          totalCredit,
        });
      }

      const entryNumber = `JE-${Date.now()}`;
      const entry = await JournalEntry.create({
        entryNumber,
        date: date || new Date(),
        description,
        referenceType,
        referenceId,
        status: 'draft',
        createdBy: req.user.id,
      });

      // Crear líneas de asiento
      await Promise.all(
        lines.map(line =>
          JournalLine.create({
            journalEntryId: entry.id,
            accountCode: line.accountCode,
            debit: line.debit || 0,
            credit: line.credit || 0,
            description: line.description,
          }),
        ),
      );

      const fullEntry = await JournalEntry.findByPk(entry.id, {
        include: [{ model: JournalLine, as: 'lines' }],
      });

      res.status(201).json(fullEntry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  postJournalEntry: async (req, res) => {
    try {
      const entry = await JournalEntry.findByPk(req.params.id);
      if (!entry) return res.status(404).json({ error: 'Asiento no encontrado' });

      if (entry.status !== 'draft') {
        return res.status(400).json({ error: 'Solo pueden publicarse asientos en borrador' });
      }

      entry.status = 'posted';
      await entry.save();

      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  cancelJournalEntry: async (req, res) => {
    try {
      const entry = await JournalEntry.findByPk(req.params.id);
      if (!entry) return res.status(404).json({ error: 'Asiento no encontrado' });

      entry.status = 'cancelled';
      await entry.save();

      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Balance General (Trial Balance)
  getTrialBalance: async (req, res) => {
    try {
      const accounts = await ChartOfAccount.findAll();

      const trialBalance = accounts.map(account => ({
        code: account.code,
        name: account.name,
        type: account.type,
        balance: account.balance,
      }));

      const totalDebits = trialBalance
        .filter(acc => ['asset', 'expense'].includes(acc.type))
        .reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

      const totalCredits = trialBalance
        .filter(acc => ['liability', 'equity', 'revenue'].includes(acc.type))
        .reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

      res.json({
        accounts: trialBalance,
        totalDebits,
        totalCredits,
        isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reportes Financieros
  getIncomeStatement: async (req, res) => {
    try {
      const revenues = await ChartOfAccount.findAll({
        where: { type: 'revenue' },
      });
      const expenses = await ChartOfAccount.findAll({
        where: { type: 'expense' },
      });

      const totalRevenue = revenues.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
      const totalExpense = expenses.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
      const netIncome = totalRevenue - totalExpense;

      res.json({
        revenues,
        expenses,
        totalRevenue,
        totalExpense,
        netIncome,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBalanceSheet: async (req, res) => {
    try {
      const assets = await ChartOfAccount.findAll({ where: { type: 'asset' } });
      const liabilities = await ChartOfAccount.findAll({ where: { type: 'liability' } });
      const equity = await ChartOfAccount.findAll({ where: { type: 'equity' } });

      const totalAssets = assets.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
      const totalLiabilities = liabilities.reduce(
        (sum, acc) => sum + parseFloat(acc.balance),
        0,
      );
      const totalEquity = equity.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

      res.json({
        assets,
        liabilities,
        equity,
        totalAssets,
        totalLiabilities,
        totalEquity,
        totalLiabilitiesEquity: totalLiabilities + totalEquity,
        isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default accountingController;
