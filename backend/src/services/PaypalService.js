const axios = require('axios');

const getAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to get PayPal access token');
  }
};

const createPayPalOrder = async (orderData) => {
  try {
    const accessToken = await getAccessToken();

    const items = orderData.orderItems.map((item) => ({
      name: item.name,
      sku: item.product,
      unit_amount: {
        currency_code: 'USD',
        value: (item.price / 25000).toFixed(2),
      },
      quantity: item.amount.toString(),
    }));

    const response = await axios.post(
      'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: (orderData.totalPrice / 25000).toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: (orderData.itemsPrice / 25000).toFixed(2),
                },
                shipping: {
                  currency_code: 'USD',
                  value: (orderData.shippingPrice / 25000).toFixed(2),
                },
              },
            },
            items: items,
            shipping: {
              name: {
                full_name: orderData.shippingAddress.fullname,
              },
              address: {
                address_line_1: orderData.shippingAddress.address,
                admin_area_2: orderData.shippingAddress.city,
                country_code: 'VN',
              },
            },
          },
        ],
        application_context: {
          brand_name: 'E-Commerce Store',
          locale: 'en-US',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orderSuccess`,
          cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      status: 'OK',
      message: 'Order created successfully',
      data: {
        orderID: response.data.id,
        approveLink: response.data.links.find((link) => link.rel === 'approve').href,
      },
    };
  } catch (error) {
    throw error;
  }
};

const capturePayPalOrder = async (orderID) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      status: 'OK',
      message: 'Payment captured successfully',
      data: {
        id: response.data.id,
        status: response.data.status,
        payer: response.data.payer,
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPayPalOrder,
  capturePayPalOrder,
};