const prisma = require('../../../config/prisma');
const db = require('../../../core/database/db');
const HttpError = require('../../../shared/utils/httpError');

const publicSelect = { id: true, name: true, email: true, role: true, isVerified: true, createdAt: true };

const adminService = {
  async getSummary() {
    const [totalAccounts, users, owners, admins, verified] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'OWNER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { isVerified: true } })
    ]);
    return {
      accounts: { total: totalAccounts, users, owners, admins, verified, pending: totalAccounts - verified },
      facilities: db.facilities.length,
      courts: db.facilities.reduce((sum, f) => sum + (f.courts?.length || 0), 0),
      bookings: db.bookings.length,
      matches: db.matches.length,
      reviews: db.reviews.length
    };
  },

  listAccounts({ role, search } = {}) {
    const where = {};
    if (role) where.role = String(role).toUpperCase();
    if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }];
    return prisma.user.findMany({ where, select: publicSelect, orderBy: { createdAt: 'desc' } });
  },

  async updateAccountRole(id, role, actingAdminId) {
    const next = String(role || '').toUpperCase();
    if (!['USER', 'OWNER', 'ADMIN'].includes(next)) throw new HttpError(400, 'Invalid role');
    if (id === actingAdminId) throw new HttpError(400, 'You cannot change your own role');
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new HttpError(404, 'Account not found');
    return prisma.user.update({ where: { id }, data: { role: next }, select: publicSelect });
  },

  async deleteAccount(id, actingAdminId) {
    if (id === actingAdminId) throw new HttpError(400, 'You cannot delete your own account');
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new HttpError(404, 'Account not found');
    await prisma.user.delete({ where: { id } });
    return { id };
  },

  listFacilities() {
    return db.facilities.map(({ courts, ...f }) => ({ ...f, courtsCount: courts?.length || 0 }));
  }
};

module.exports = adminService;
