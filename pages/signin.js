import styles from '@/styles/signin.module.scss'
import Footer from '@/components/footer';
import Header from '@/components/header';
import React, { useState } from 'react';
import { BiLeftArrowAlt } from 'react-icons/bi';
import Link from 'next/link';
import { Form, Formik } from 'formik';
import LoginInput from '@/components/inputs/loginInputs';
import * as Yup from 'yup'
import IconButton from '@/components/buttons/iconButton';
import Links from '@/components/footer/Links';
import { getCsrfToken, getProviders, getSession, signIn } from 'next-auth/react';
import axios from 'axios';
import DotLoaderSpinner from '@/components/loaders/dotLoader';
import Router from 'next/router';

const initialValues={
  login_email:'',
  login_password:'',
  name:'',
  email:'',
  password:'',
  confirm_password:'',
  success: '',
  error: '',
  login_error: ''
}

export default function signin({country, ...props}) {
  const [loading, setLoading]=useState(false);
  const [user, setUser]=useState(initialValues);
  const { 
    login_email, 
    login_password, 
    name, 
    email, 
    password, 
    confirm_password, 
    success, 
    error, 
    login_error 
  } = user;
  
  const handleChange= (e)=>{
    const {name,value} = e.target;
    setUser({...user, [name]: value});
  };
  const loginValidation=Yup.object({
    login_email: Yup.
      string().
      required('Email is required').
      email('Please enter a valid email address'),
    login_password:Yup.string().required('Password is required')
  })
  const registerValidation=Yup.object({
    name: Yup.
      string().
      required('Name is required'),
    email: Yup.
      string().
      required('Email is required').
      email('Please enter a valid email address'),
    password: Yup.
      string().
      required('Password is required').
      min(6),
    confirm_password: Yup.
      string().
      required('Password is required').
      oneOf([Yup.ref('password')], 'Passwords must match')
  })

  const signUpHandler = async() => {
    try {
      setLoading(true);
      const {data}=await axios.post('api/auth/signup', {
        name, 
        email, 
        password
      });
      setUser({...user, success: data.message, error: ''});
      setLoading(false);
      setTimeout(async () => {
        let options = {
          redirect: false,
          email: email,
          password: password
        };
        const res = await signIn('credentials', options);
        Router.push('/');
      },2000);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setUser({...user, success: '', error: error.response.data.message});
    }
  };

  const signInHandler = async() => {
    setLoading(true);
    let options = {
      redirect: false,
      email: login_email,
      password: login_password
    };
    const res = await signIn('credentials', options);
    setUser({...user, success: '', error: ''});
    setLoading(false);
    if (res?.error)
      setUser({ ...user, login_error: res?.error });
    else
      Router.push(props.callbackUrl || '/');
  }

  return (
      <>
        {          
          loading && <DotLoaderSpinner loading={loading}/>
        }        
        <Header country={country}/>
        <div className={styles.login}>
          <div className={styles.login__container}>
            <div className={styles.login__header}>
              <div className={styles.back__svg}>
                <BiLeftArrowAlt />
              </div>
              <span>
                Please join us! <Link href='/'>Start Shopping</Link>
              </span>
            </div>

            <div className={styles.login__form}>
              <h1>Sign in</h1>
              <p>
                Access our online shop.
              </p>
              <Formik
                enableReinitialize
                initialValues={{
                  login_email,
                  login_password
                }}
                validationSchema={loginValidation}
                onSubmit={()=>{
                  signInHandler();
                }}
              >
                {
                  (form) => (
                    <Form method='post' action='/api/auth/singin/email'>
                      <input type='hidden' 
                        name='csrfToken'
                        defaultValue={props.csrfToken}
                        />
                      <LoginInput 
                        type="text"
                        name="login_email"
                        icon="email" 
                        placeholder="Email Address"
                        onChange={handleChange}
                        />
                      
                      <LoginInput 
                        type="password"
                        name="login_password"
                        icon='password' 
                        placeholder='Password' 
                        onChange={handleChange}
                        />
                      <IconButton type='submit' text='Sign in' />

                      {
                        login_error && 
                        (
                          <span className={styles.error}>{login_error}</span>
                        )
                      }

                      <div className={styles.forgotPassword}>
                        <Link href='/auth/forgot'>Forgot password?</Link>
                      </div>
                    </Form>
                  )
                }
              </Formik>
              <div className={styles.login__socials}>
                <span className={styles.or}>Or continue with</span>
                <div className={styles.login__socials_wrap}>
                {
                  props.providers.map((provider) => {
                    if(provider.name == "Credentials") {
                      return;
                    }
                    return (                      
                      <div key={provider.name}>
                        <button 
                          className={styles.social__btn} 
                          onClick={()=>signIn(provider.id)}
                        >
                          <img src={`icons/${provider.name}.png`} alt=''/>
                          Sign in with {provider.name}
                        </button>
                      </div>
                    )
                  })
                }
                </div>
              </div>
            </div>
          </div>

          <div className={styles.login__container}>

            <div className={styles.login__form}>
              <h1>Sign up</h1>
              <p>
                Access our online shop.
              </p>
              <Formik
                enableReinitialize
                initialValues={{
                  name,
                  email,
                  password,
                  confirm_password
                }}
                validationSchema={registerValidation}
                onSubmit={ ()=>{
                  signUpHandler();
                }}
              >
                {
                  (form) => (
                    <Form>
                      <LoginInput 
                        type="text"
                        name="name"
                        icon="user" 
                        placeholder="Enter your name"
                        onChange={handleChange}
                        />
                      <LoginInput 
                        type="text"
                        name="email"
                        icon='email' 
                        placeholder='Enter your emal address.' 
                        onChange={handleChange}
                        />
                      <LoginInput 
                        type="password"
                        name="password"
                        icon='password' 
                        placeholder='Enter your password.' 
                        onChange={handleChange}
                        />
                      <LoginInput 
                        type="password"
                        name="confirm_password"
                        icon='password' 
                        placeholder='Re-enter your password.' 
                        onChange={handleChange}
                        />
                      <IconButton type='submit' text='Sign up' />
                    </Form>
                  )
                }
              </Formik>
              <div>
                {
                  success && <span className={styles.success}>{success}</span>
                }
              </div>
              <div>
                {
                  error && <span className={styles.error}>{error}</span>
                }
              </div>
            </div>
          </div>

        </div>
        <Footer country={country}/>
      </>
  );
}

export async function getServerSideProps(context) {
    // let data = await axios.get('https://api.ipregistry.co?key=k9lzetyo3dearkdh').then((res)=>{
    //   return res.data.location.country;
    // }).catch((err)=>{
    //   console.log(err);
    // });
    const {req,query} = context;
    const {callbackUrl} = query;
    const session = await getSession({req});
    const providers = Object.values(await getProviders());

    if(session) {
      return {
        redirect: {
          destination: callbackUrl
        }
      }
    }

    const csrfToken = await getCsrfToken(context);

    return {
      props:{
        providers: providers,
        csrfToken,
        callbackUrl,
        //country: { name: data.name, flag: data.flag.emojitwo }
        country: { name: 'United States', flag: '../../../images/us-flag.png' }
      }
    }
  }