import MetaData from "../layout/MetaData";
import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from "./CheckoutSteps";
import "./Payment.css";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { createOrder,clearErrors } from "../../actions/orderAction";
import { removeItemsFromCart} from "../../actions/cartAction";

const Payment = () => {

    const navigate = useNavigate();
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    const dispatch = useDispatch();
    const alert = useAlert();

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);


    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {

            order.paymentInfo = {
                id: user._id,
                status: "cash on delivery",
            };

            dispatch(createOrder(order));

            cartItems &&
            cartItems.forEach((item) => {
                dispatch(removeItemsFromCart(item.product));
            });

            navigate("/success");

        } catch (error) {
            alert.error(error.response.data.message);
        }
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error, alert]);


    return (
        <Fragment>
            <MetaData title="Payment" />
            <CheckoutSteps activeStep={2} />
            <div className="paymentContainer">
                <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>

                    <div>
                        <h3>Only Cash On delivery Option is Abvilable</h3>
                    </div>

                    <div className="totalAmount">
                        Your total Payable amount is <span> {` ₹${orderInfo && orderInfo.totalPrice}`}</span>
                    </div>

                    <input
                        type="submit"
                        value={`Confirm Order`}
                        className="paymentFormBtn"
                    />

                </form>
            </div>
        </Fragment>
    )


}

export default Payment
