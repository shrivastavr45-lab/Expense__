import AuditLog from '../models/AuditLog.js';

export const audit = async (userId, userEmail, action, entityType, entityId, oldValues, newValues, req) => {
  try {
    const ip = req?.headers['x-forwarded-for']?.split(',')[0] || req?.ip;
    await AuditLog.create({ userId, userEmail, action, entityType, entityId, oldValues, newValues, ipAddress: ip });
  } catch (e) {
    console.warn('Audit log failed:', e.message);
  }
};
