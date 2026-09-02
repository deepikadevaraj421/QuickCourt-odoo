const adminService = require('../services/adminService');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const adminController = {
  getSummary: wrap(async (req, res) => {
    const data = await adminService.getSummary();
    res.json({ success: true, message: 'Admin summary retrieved', data });
  }),

  listAccounts: wrap(async (req, res) => {
    const data = await adminService.listAccounts(req.query);
    res.json({ success: true, message: 'Accounts retrieved', data });
  }),

  updateAccountRole: wrap(async (req, res) => {
    const data = await adminService.updateAccountRole(req.params.id, req.body.role, req.user.id);
    res.json({ success: true, message: 'Account role updated', data });
  }),

  deleteAccount: wrap(async (req, res) => {
    const data = await adminService.deleteAccount(req.params.id, req.user.id);
    res.json({ success: true, message: 'Account deleted', data });
  }),

  listFacilities: wrap(async (req, res) => {
    res.json({ success: true, message: 'Facilities retrieved', data: adminService.listFacilities() });
  })
};

module.exports = adminController;
