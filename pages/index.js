
import styles from '@/styles/Home.module.scss'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Main from '@/components/home/main'
import axios from 'axios'
import { useSession, signIn, signOut } from "next-auth/react"
import FlashDeals from '@/components/home/flashDeals'
import Category from '@/components/home/category'

import db from '../utils/db';

import Product from '@/models/Product';

import { useMediaQuery } from "react-responsive";

import { useSelector } from 'react-redux';

import {
  women_accessories,
  women_dresses,
  women_shoes,
  women_swiper,
  gamingSwiper,
  homeImprovSwiper
} from "../data/home";
import ProductsSwiper from '@/components/productsSwiper'
import ProductCard from '@/components/productCard'

export default function Home({country, products}) {
  const { data: session } = useSession();
  const isMedium = useMediaQuery({ query: "(max-width:850px)" });
  const isMobile = useMediaQuery({ query: "(max-width:550px)" });

  return (
    <div>
      <Header country={country}/>
      <div className={styles.home}>
        <div className={styles.container}>
          <Main />
          <FlashDeals />

          <div className={styles.home__category}>
            <Category
              header="Dresses"
              products={women_dresses}
              background="#555555"
            />
            {!isMedium && (
              <Category
                header="Shoes"
                products={women_shoes}
                background="#888888"
              />
            )}
            {isMobile && (
              <Category
                header="Shoes"
                products={women_shoes}
                background="#333333"
              />
            )}
            <Category
              header="Accessories"
              products={women_accessories}
              background="#000"
            />
          </div>

          <ProductsSwiper products={women_swiper} />

          <div className={styles.products}>
            {
              products.map((product,i)=>(
                <ProductCard key={i} product={product}/>
              ))
            }            
          </div>
          
          <ProductsSwiper products={gamingSwiper} header='For Gamers' />
          <ProductsSwiper products={homeImprovSwiper} header='Home Improvement'/>

        </div>
      </div>
      <Footer country={country}/>
    </div>
  )
}

export async function getServerSideProps() {
  await db.connect();
  let products = await Product.find().sort({createdAt:-1}).lean();
  console.log(products);

  // let data = await axios.get('https://api.ipregistry.co?key=k9lzetyo3dearkdh').then((res)=>{
  //   return res.data.location.country;
  // }).catch((err)=>{
  //   console.log(err);
  // });  

  return {
    props:{
      products: JSON.parse(JSON.stringify(products)),
      //country: { name: data.name, flag: data.flag.emojitwo }
      country: { name: 'United States', flag: '../../../images/us-flag.png' }
    }
  }
}