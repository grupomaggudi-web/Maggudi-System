import Employee from '../../models/Employee.js';
import Payroll from '../../models/Payroll.js';
import Attendance from '../../models/Attendance.js';

const hrController = {
  // Empleados
  getEmployees: async (req, res) => {
    try {
      const employees = await Employee.findAll();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getEmployeeById: async (req, res) => {
    try {
      const employee = await Employee.findByPk(req.params.id, {
        include: [{ association: 'payrolls' }, { association: 'attendances' }],
      });
      if (!employee) return res.status(404).json({ error: 'Empleado no encontrado' });
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createEmployee: async (req, res) => {
    try {
      const employee = await Employee.create(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateEmployee: async (req, res) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee) return res.status(404).json({ error: 'Empleado no encontrado' });
      await employee.update(req.body);
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteEmployee: async (req, res) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee) return res.status(404).json({ error: 'Empleado no encontrado' });
      await employee.destroy();
      res.json({ message: 'Empleado eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Nómina
  getPayrolls: async (req, res) => {
    try {
      const payrolls = await Payroll.findAll({ include: ['employee'] });
      res.json(payrolls);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPayrollById: async (req, res) => {
    try {
      const payroll = await Payroll.findByPk(req.params.id, { include: ['employee'] });
      if (!payroll) return res.status(404).json({ error: 'Nómina no encontrada' });
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createPayroll: async (req, res) => {
    try {
      const {
        employeeId,
        period,
        baseSalary,
        bonuses = 0,
        deductions = 0,
      } = req.body;

      // Calcular impuestos simplificado (10% del salario)
      const taxes = (baseSalary + bonuses) * 0.1;
      const netSalary = baseSalary + bonuses - deductions - taxes;

      const payroll = await Payroll.create({
        employeeId,
        period,
        baseSalary,
        bonuses,
        deductions,
        taxes,
        netSalary,
        status: 'pending',
      });

      res.status(201).json(payroll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  processPayroll: async (req, res) => {
    try {
      const payroll = await Payroll.findByPk(req.params.id);
      if (!payroll) return res.status(404).json({ error: 'Nómina no encontrada' });

      payroll.status = 'processed';
      await payroll.save();
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  payPayroll: async (req, res) => {
    try {
      const payroll = await Payroll.findByPk(req.params.id);
      if (!payroll) return res.status(404).json({ error: 'Nómina no encontrada' });

      payroll.status = 'paid';
      payroll.paymentDate = new Date();
      await payroll.save();
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPayrollsByPeriod: async (req, res) => {
    try {
      const { period } = req.query;
      const payrolls = await Payroll.findAll({
        where: { period },
        include: ['employee'],
      });
      res.json(payrolls);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Asistencia
  getAttendance: async (req, res) => {
    try {
      const { employeeId, date } = req.query;
      let where = {};
      if (employeeId) where.employeeId = employeeId;
      if (date) where.date = date;

      const attendance = await Attendance.findAll({ where, include: ['employee'] });
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAttendanceById: async (req, res) => {
    try {
      const record = await Attendance.findByPk(req.params.id, { include: ['employee'] });
      if (!record) return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  checkIn: async (req, res) => {
    try {
      const { employeeId } = req.body;
      const today = new Date().toISOString().split('T')[0];

      let attendance = await Attendance.findOne({
        where: { employeeId, date: today },
      });

      if (!attendance) {
        attendance = await Attendance.create({
          employeeId,
          date: today,
          checkInTime: new Date(),
          status: 'present',
        });
      } else {
        return res.status(400).json({ error: 'Ya existe registro de asistencia para hoy' });
      }

      res.status(201).json(attendance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  checkOut: async (req, res) => {
    try {
      const { employeeId } = req.body;
      const today = new Date().toISOString().split('T')[0];

      const attendance = await Attendance.findOne({
        where: { employeeId, date: today },
      });

      if (!attendance) {
        return res.status(404).json({ error: 'No hay check-in registrado' });
      }

      attendance.checkOutTime = new Date();
      const checkInTime = new Date(attendance.checkInTime);
      const checkOutTime = new Date();
      const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);
      attendance.hoursWorked = parseFloat(hoursWorked.toFixed(2));

      await attendance.save();
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  recordAttendance: async (req, res) => {
    try {
      const { employeeId, date, status, hoursWorked, notes } = req.body;

      const attendance = await Attendance.create({
        employeeId,
        date,
        status,
        hoursWorked,
        notes,
      });

      res.status(201).json(attendance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAttendanceSummary: async (req, res) => {
    try {
      const { employeeId, month } = req.query;

      const summary = await Attendance.findAll({
        where: { employeeId },
        raw: true,
      });

      const stats = {
        present: summary.filter(s => s.status === 'present').length,
        absent: summary.filter(s => s.status === 'absent').length,
        late: summary.filter(s => s.status === 'late').length,
        halfDay: summary.filter(s => s.status === 'half_day').length,
        vacation: summary.filter(s => s.status === 'vacation').length,
        totalHours: summary.reduce((sum, s) => sum + (s.hoursWorked || 0), 0),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default hrController;
