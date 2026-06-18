const crypto = require('crypto');
const axios = require('axios');

const PAYOS_API_BASE_URL = process.env.PAYOS_API_BASE_URL || 'https://api-merchant.payos.vn';

const getPayosConfig = () => {
    const requiredKeys = ['PAYOS_CLIENT_ID', 'PAYOS_API_KEY', 'PAYOS_CHECKSUM_KEY', 'PAYOS_RETURN_URL', 'PAYOS_CANCEL_URL'];
    const missingKeys = requiredKeys.filter((key) => !process.env[key]);

    if (missingKeys.length) {
        const error = new Error(`Missing payOS configuration: ${missingKeys.join(', ')}`);
        error.statusCode = 500;
        throw error;
    }

    return {
        clientId: process.env.PAYOS_CLIENT_ID,
        apiKey: process.env.PAYOS_API_KEY,
        checksumKey: process.env.PAYOS_CHECKSUM_KEY,
        returnUrl: process.env.PAYOS_RETURN_URL,
        cancelUrl: process.env.PAYOS_CANCEL_URL,
    };
};

const createHmacSignature = (data, checksumKey) =>
    crypto.createHmac('sha256', checksumKey).update(data).digest('hex');

const buildSortedDataString = (data) =>
    Object.keys(data)
        .sort()
        .map((key) => `${key}=${data[key] ?? ''}`)
        .join('&');

const createPaymentRequestSignature = ({ amount, cancelUrl, description, orderCode, returnUrl }, checksumKey) =>
    createHmacSignature(
        buildSortedDataString({ amount, cancelUrl, description, orderCode, returnUrl }),
        checksumKey
    );

const verifyWebhookSignature = (payload) => {
    const { checksumKey } = getPayosConfig();
    const dataString = buildSortedDataString(payload.data || {});
    const expectedSignature = createHmacSignature(dataString, checksumKey);
    const signature = payload.signature || '';

    if (expectedSignature.length !== signature.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(signature, 'utf-8')
    );
};

const createPayosOrderCode = (order) => {
    const timestampPart = Date.now().toString().slice(-8);
    const orderPart = parseInt(order._id.toString().slice(-5), 16).toString().slice(-4).padStart(4, '0');
    return Number(`${timestampPart}${orderPart}`);
};

const createPayosPaymentLink = async ({ order, user }) => {
    const { clientId, apiKey, checksumKey, returnUrl, cancelUrl } = getPayosConfig();
    const orderCode = createPayosOrderCode(order);
    const amount = Math.round(order.totalPrice);
    const description = `DH${orderCode.toString().slice(-8)}`;
    const items = order.orderItems.map((item) => ({
        name: item.name.slice(0, 100),
        quantity: Number(item.qty),
        price: Math.round(Number(item.price)),
    }));

    // Cấu hình URL động chứa mã đơn hàng
    const dynamicReturnUrl = `${returnUrl.replace(/\/$/, '')}/orders/${order._id}?payment=success`;
    const dynamicCancelUrl = `${cancelUrl.replace(/\/$/, '')}/orders/${order._id}?payment=cancel`;

    const signature = createPaymentRequestSignature(
        { amount, cancelUrl: dynamicCancelUrl, description, orderCode, returnUrl: dynamicReturnUrl },
        checksumKey
    );

    const { data } = await axios.post(
        `${PAYOS_API_BASE_URL}/v2/payment-requests`,
        {
            orderCode,
            amount,
            description,
            buyerName: user.name,
            buyerEmail: user.email,
            items,
            cancelUrl: dynamicCancelUrl,
            returnUrl: dynamicReturnUrl,
            signature,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': clientId,
                'x-api-key': apiKey,
            },
        }
    );

    if (data.code !== '00') {
        const error = new Error(data.desc || 'Could not create payOS payment link');
        error.statusCode = 502;
        error.payosResponse = data;
        throw error;
    }

    return {
        orderCode,
        paymentLink: data.data,
    };
};

module.exports = {
    createPayosPaymentLink,
    verifyWebhookSignature,
};
