import styles from "../../styles/order.module.scss";
import Header from "../../components/header";
import Order from "../../models/Order";
import User from "../../models/User";

import { IoIosArrowForward } from "react-icons/io";

import db from "../../utils/db";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { useReducer, useEffect, useState } from "react";
import axios from "axios";
import StripePayment from "../../components/stripePayment";

import { getSession } from "next-auth/react";

function reducer(state, action) {
  switch (action.type) {
    case "PAY_REQUEST":
      return { ...state, loading: true };
    case "PAY_SUCCESS":
      return { ...state, loading: false, success: true };
    case "PAY_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_RESET":
      return { ...state, loading: false, success: false, error: false };
  }
}

const ButtonWrapper = ({
  showSpinner, 
  orderData,
  createHandler,
  approveHandler,
  errorHandler
}) => {
  const style = {"layout":"vertical"};

  return (
      <>
          { (showSpinner && isPending) && <div className="spinner" /> }
          {
          <PayPalButtons
              style={style}
              disabled={false}
              forceReRender={[style]}
              fundingSource={undefined}
              createOrder={createHandler}
              onApprove={approveHandler}
              onError={errorHandler}
          />
          }
      </>
  );
}

export default function order({
  orderData,
  paypal_client_id,
  stripe_public_key,
  country
}) {
  
  function createOrderHanlder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: orderData.total,
            },
          },
        ],
      })
      .then((order_id) => {
        return order_id;
      });
  }
  
  function onApproveHandler(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        //dispatch({ type: "PAY_REQUEST" });
        console.log('PAY_REQUEST');
        const { data } = await axios.put(
          `/api/order/${orderData._id}/pay`,
          details
        );
        //dispatch({ type: "PAY_SUCCESS", payload: data });
        console.log('PAY_SUCCESS', data);
        window.location.reload(false);
      } catch (error) {
        //dispatch({ type: "PAY_ERROR", payload: error });
        console.log('PAY_ERROR', error);
      }
    });
  }
  
  function onErroHandler(error) {
    console.log(error);
  }

  console.log('orderData: ',orderData);
  console.log('Client: ',paypal_client_id);  
  
  return (
    <>
      <Header country={country} />
      <div className={styles.order}>
        <div className={styles.container}>
          <div className={styles.order__infos}>
            <div className={styles.order__header}>
              <div className={styles.order__header_head}>
                Home <IoIosArrowForward /> Orders <IoIosArrowForward /> ID{" "}
                {orderData._id}
              </div>
              <div className={styles.order__header_status}>
                Payment Status :{" "}
                {orderData.isPaid ? (
                  <img src="../../../images/verified.png" alt="paid" />
                ) : (
                  <img src="../../../images/unverified.png" alt="paid" />
                )}
              </div>
              <div className={styles.order__header_status}>
                Order Status :
                <span
                  className={
                    orderData.status == "Not Processed"
                      ? styles.not_processed
                      : orderData.status == "Processing"
                      ? styles.processing
                      : orderData.status == "Dispatched"
                      ? styles.dispatched
                      : orderData.status == "Cancelled"
                      ? styles.cancelled
                      : orderData.status == "Completed"
                      ? styles.completed
                      : ""
                  }
                >
                  {orderData.status}
                </span>
              </div>
            </div>
            <div className={styles.order__products}>
              {orderData.products.map((product) => (
                <div className={styles.product} key={product._id}>
                  <div className={styles.product__img}>
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className={styles.product__infos}>
                    <h1 className={styles.product__infos_name}>
                      {product.name.length > 30
                        ? `${product.name.substring(0, 30)}...`
                        : product.name}
                    </h1>
                    <div className={styles.product__infos_style}>
                      <img src={product.color.image} alt="" /> / {product.size}
                    </div>
                    <div className={styles.product__infos_priceQty}>
                      ${product.price} x {product.qty}
                    </div>
                    <div className={styles.product__infos_total}>
                      ${product.price * product.qty}
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.order__products_total}>
                {orderData.couponApplied ? (
                  <>
                    <div className={styles.order__products_total_sub}>
                      <span>Subtotal</span>
                      <span>${orderData.totalBeforeDiscount}</span>
                    </div>
                    <div className={styles.order__products_total_sub}>
                      <span>
                        Coupon Applied <em>({orderData.couponApplied})</em>{" "}
                      </span>
                      <span>
                        -$
                        {(
                          orderData.totalBeforeDiscount - orderData.total
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className={styles.order__products_total_sub}>
                      <span>Tax price</span>
                      <span>+${orderData.taxPrice}</span>
                    </div>
                    <div
                      className={`${styles.order__products_total_sub} ${styles.bordertop}`}
                    >
                      <span>TOTAL TO PAY</span>
                      <b>${orderData.total}</b>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.order__products_total_sub}>
                      <span>Tax price</span>
                      <span>+${orderData.taxPrice}</span>
                    </div>
                    <div
                      className={`${styles.order__products_total_sub} ${styles.bordertop}`}
                    >
                      <span>TOTAL TO PAY</span>
                      <b>${orderData.total}</b>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={styles.order__actions}>
            <div className={styles.order__address}>
              <h1>Customer's Order</h1>
              <div className={styles.order__address_user}>
                <div className={styles.order__address_user_infos}>
                  <img src={orderData.user.image} alt="" />
                  <div>
                    <span>{orderData.user.name}</span>
                    <span>{orderData.user.email}</span>
                  </div>
                </div>
              </div>
              <div className={styles.order__address_shipping}>
                <h2>Shipping Address</h2>
                <span>
                  {orderData.shippingAddress.firstName}{" "}
                  {orderData.shippingAddress.lastName}
                </span>
                <span>{orderData.shippingAddress.address1}</span>
                <span>{orderData.shippingAddress.address2}</span>
                <span>
                  {orderData.shippingAddress.state},
                  {orderData.shippingAddress.city}
                </span>
                <span>{orderData.shippingAddress.zipCode}</span>
                <span>{orderData.shippingAddress.country}</span>
              </div>
              <div className={styles.order__address_shipping}>
                <h2>Billing Address</h2>
                <span>
                  {orderData.shippingAddress.firstName}{" "}
                  {orderData.shippingAddress.lastName}
                </span>
                <span>{orderData.shippingAddress.address1}</span>
                <span>{orderData.shippingAddress.address2}</span>
                <span>
                  {orderData.shippingAddress.state},
                  {orderData.shippingAddress.city}
                </span>
                <span>{orderData.shippingAddress.zipCode}</span>
                <span>{orderData.shippingAddress.country}</span>
              </div>
            </div>
            {!orderData.isPaid && (
              <div className={styles.order__payment}>
                
                {orderData.paymentMethod == "paypal" && (
                  <div>
                    <PayPalScriptProvider options={{ clientId: paypal_client_id, components: "buttons", currency: "USD" }}>
                      <ButtonWrapper 
                        orderData={orderData} 
                        createHandler={createOrderHanlder}
                        approveHandler={onApproveHandler}
                        errorHandler={onErroHandler}
                      />
                    </PayPalScriptProvider>
                  </div>
                )}
                
                {orderData.paymentMethod == "credit_card" && (
                  <StripePayment
                    total={orderData.total}
                    order_id={orderData._id}
                    stripe_public_key={stripe_public_key}
                  />
                )}
                
                {orderData.paymentMethod == "cash" && (
                  <div className={styles.cash}>cash</div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await db.connect();
  
  const { query } = context;
  const id = query.id;
  
  const order = await Order.findById(id)
    .populate({ path: "user", model: User })
    .lean();
  
  let paypal_client_id = process.env.PAYPAL_CLIENT_ID;
  let stripe_public_key = process.env.STRIPE_PUBLIC_KEY;

  //console.log('PP: ', paypal_client_id);
  
  await db.disconnect();
  
  return {
    props: {
      orderData: JSON.parse(JSON.stringify(order)),
      paypal_client_id,
      stripe_public_key,
      country: { name: 'United States', flag: '../../../../images/us-flag.png' }
    },
  };
}
