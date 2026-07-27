import express from 'express';
import hrController from '../controllers/hrController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Empleados
router.get('/employees', hrController.getEmployees);
router.get('/employees/:id', hrController.getEmployeeById);
router.post('/employees', hrController.createEmployee);
router.put('/employees/:id', hrController.updateEmployee);
router.delete('/employees/:id', hrController.deleteEmployee);

// Nómina
router.get('/payrolls', hrController.getPayrolls);
router.get('/payrolls/:id', hrController.getPayrollById);
router.post('/payrolls', hrController.createPayroll);
router.post('/payrolls/:id/process', hrController.processPayroll);
router.post('/payrolls/:id/pay', hrController.payPayroll);
router.get('/payrolls-by-period', hrController.getPayrollsByPeriod);

// Asistencia
router.get('/attendance', hrController.getAttendance);
router.get('/attendance/:id', hrController.getAttendanceById);
router.post('/attendance/check-in', hrController.checkIn);
router.post('/attendance/check-out', hrController.checkOut);
router.post('/attendance/record', hrController.recordAttendance);
router.get('/attendance-summary', hrController.getAttendanceSummary);

export default router;
