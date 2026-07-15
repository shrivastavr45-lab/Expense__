import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail:  { type: String },
  action:     { type: String, enum: ['CREATE','UPDATE','DELETE','LOGIN','LOGOUT','SIGNUP','EMAIL_VERIFIED','PASSWORD_RESET'], required: true },
  entityType: { type: String },
  entityId:   { type: mongoose.Schema.Types.ObjectId },
  oldValues:  { type: mongoose.Schema.Types.Mixed },
  newValues:  { type: mongoose.Schema.Types.Mixed },
  ipAddress:  { type: String },
}, { timestamps: true });

auditSchema.index({ userId: 1 });
auditSchema.index({ createdAt: -1 });
auditSchema.index({ entityType: 1, entityId: 1 });

export default mongoose.model('AuditLog', auditSchema);
