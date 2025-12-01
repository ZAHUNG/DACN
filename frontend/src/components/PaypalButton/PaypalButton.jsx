import React, { useEffect, useRef } from 'react';
import * as OrderService from '../../services/OrderService';
import * as message from '../Message/Message';

const PayPalButton = ({ totalPrice, orderItems, shippingAddress, onSuccess, user }) => {
  const paypalRef = useRef(null);

  useEffect(() => {
    if (!window.paypal) {
      console.error("PayPal SDK not loaded");
      return;
    }

    window.paypal.Buttons({
      createOrder: async (data, actions) => {
        try {
          const response = await OrderService.createPayPalOrder(user?.access_token, {
            orderItems,
            shippingAddress,
            itemsPrice: orderItems.reduce((total, item) => total + (item.price * item.amount), 0),
            shippingPrice: totalPrice - orderItems.reduce((total, item) => total + (item.price * item.amount), 0),
            totalPrice: totalPrice
          });

          if (response.data.status === "OK") {
            return response.data.data.orderID;
          } else {
            message.error("Failed to create PayPal order");
          }
        } catch (error) {
          console.error("Error creating order:", error);
          message.error("Error creating PayPal order");
        }
      },
      onApprove: async (data, actions) => {
        try {
          const response = await OrderService.capturePayPalOrder(user?.access_token, {
            orderID: data.orderID,
            orderData: {
              orderItems,
              shippingAddress,
              itemsPrice: orderItems.reduce((total, item) => total + (item.price * item.amount), 0),
              shippingPrice: totalPrice - orderItems.reduce((total, item) => total + (item.price * item.amount), 0),
              totalPrice: totalPrice
            }
          });

          if (response.data.status === "OK") {
            message.success("Payment successful!");
            onSuccess();
          }
        } catch (error) {
          console.error("Error capturing order:", error);
          message.error("Error processing payment");
        }
      },
      onError: (err) => {
        console.error("PayPal error:", err);
        message.error("Payment failed");
      }
    }).render(paypalRef.current);

  }, [orderItems, shippingAddress, totalPrice, user?.access_token, onSuccess]);

  return <div ref={paypalRef}></div>;
};

export default PayPalButton;