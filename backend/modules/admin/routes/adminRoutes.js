const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/summary', adminController.getSummary);
router.get('/accounts', adminController.listAccounts);
router.patch('/accounts/:id/role', adminController.updateAccountRole);
router.delete('/accounts/:id', adminController.deleteAccount);
router.get('/facilities', adminController.listFacilities);

module.exports = router;
