const mongoose = require('mongoose');

const proActivationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    source: {
      type: String,
      enum: ['order_purchase', 'pro_subscription', 'admin_grant'],
      required: true,
    },
    daysAdded: { type: Number, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
    activatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    note: { type: String, default: '' },
    isRevoked: { type: Boolean, default: false },
    revokedAt: { type: Date, default: null },
    revokedReason: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProActivation', proActivationSchema);
