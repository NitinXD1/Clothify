import {stripe} from '../lib/stripe.js'
import Coupon from '../models/coupon.model.js'
import {Order} from '../models/order.model.js'

async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once"
    });

    return coupon.id;
}

async function createNewCoupon(userId) {

    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: userId
    });

    await newCoupon.save();

    return newCoupon;
}

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid or empty products array" });
        }

        let totalAmount = 0;

        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100);
            totalAmount += amount * product.quantity;

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount
                },
                quantity: product.quantity || 1
            };
        });

        let coupon = null;
        let stripeCouponId = null;

        if (couponCode) {
            coupon = await Coupon.findOne({
                code: couponCode,
                isActive: true,
                userId: req.user._id
            });

            if (coupon) {
                stripeCouponId = await createStripeCoupon(coupon.discountPercentage);
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session-id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            }
        });

        if (totalAmount >= 20000) {
            await createNewCoupon(req.user._id);
        }

        return res.status(200).json({
            id: session.id,
            totalAmount: totalAmount / 100
        });

    } catch (error) {
        console.log("Error in the stripe session controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const checkoutSuccess = async (req,res) => {
    try {
        const {sessionId} = req.body
    
        const session = await stripe.checkout.sessions.retrieve(sessionId);
    
        if(session.payment_status === 'paid'){
    
            if(session.metadata.couponCode){
                await Coupon.findOneAndUpdate(
                    {
                        code : session.metadata.couponCode,
                        userId : session.metadata.userId,
                    },
                    {
                        isActive : false
                    }
                )
            }
    
            const products = JSON.parse(session.metadata.products)
            const newOrder = await Order.create(
                {
                    user : session.metadata.userId,
                    products : products.map((p) => {
                        return {
                            product : p.id,
                            price : p.price,
                            quantity : p.quantity
                        }
                    }),
                    totalAmount : session.amount_total / 100,
                    stripeSessionId : sessionId
                }
            )
    
            return res.status(200).json(
                {
                    sucess : true,
                    message : "payment successfull , order created , and coupon deactivated if used",
                    orderId : newOrder._id,
                })
        }
    } catch (error) {
        console.log("Error in fetching successfull order controller")
        return res.status(500).json({message:"Error processing successfull checkout",error : error.message})
    }
}
