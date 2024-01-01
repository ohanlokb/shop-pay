
import CartHeader from '@/components/cart/cartHeader';
import Checkout from '@/components/cart/checkout';
import Empty from '@/components/cart/empty';
import Header from '@/components/cart/header';
import PaymentMethods from '@/components/cart/paymentMethods';
import Product from '@/components/cart/product';
import styles from '@/styles/cart.module.scss'
import ProductsSwiper from '@/components/productsSwiper'

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { women_swiper } from "../data/home";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

import { saveCart } from '@/requests/user';

import axios from "axios";
import { updateCart } from '@/store/checkoutSlice';

export default function cart({country}) {
  const Router = useRouter();
  const { data: session } = useSession();

  const [selected, setSelected] = useState([]);
  const checkout = useSelector( state => state.checkout );
  
  const [shippingFee, setShippingFee] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    const update = async () => {
      const { data } = await axios.post("/api/updateCart", {
        products: checkout.checkoutItems
      });
      dispatch(updateCart(data));
    };
    if(checkout.checkoutItems.length>0) {
      update();
    }
  }, []);
  
  useEffect(() => {
    setShippingFee(
      selected.reduce((a, c) => a + Number(c.shipping), 0).toFixed(2)
    );
    setSubtotal(selected.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2));
    setTotal(
      (
        selected.reduce((a, c) => a + c.price * c.qty, 0) + Number(shippingFee)
      ).toFixed(2)
    );
  }, [selected]);

  const saveCartToDbHandler = async () => {
    if (session) {
      const res = saveCart(selected);
      console.log('Go to checkout');
      Router.push("/checkout");
    } else {
      signIn();
    }
  };

  return (
  <>
    <Header country={country} />
    <div className={styles.cart}>
      { checkout.checkoutItems.length > 0 ? (
          <div className={styles.cart__container}>
            <CartHeader 
              checkoutItems={checkout.checkoutItems} 
              selected={selected}
              setSelected={setSelected}
            />
            
            <div className={styles.cart__products}>
              {
                checkout.checkoutItems.map((product)=> (
                  <Product 
                    product={product} 
                    key={product._uid}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ))
              }
            </div>

            <Checkout 
              subtotal={subtotal} 
              shippingFee={shippingFee} 
              total={total} 
              selected={selected} 
              setSelected={setSelected}
              saveCartToDbHandler={saveCartToDbHandler}
            />
            <PaymentMethods/>
          </div>
        ) : (
          <Empty />
        )
      }
      <ProductsSwiper products={women_swiper} />
    </div>
  </>
  );
}

export async function getServerSideProps() {
    return {
      props:{
        //country: { name: data.name, flag: data.flag.emojitwo }
        country: { name: 'United States', flag: '../../../images/us-flag.png' }
      }
    }
  }