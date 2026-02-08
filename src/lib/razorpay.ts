import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrder = async (amount: number, currency: string = 'INR') => {
    const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return order;
};

export const verifyPayment = (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
): boolean => {
    const crypto = require('crypto');
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');

    return expectedSignature === razorpaySignature;
};
