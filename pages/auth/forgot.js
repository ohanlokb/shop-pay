
import styles from '@/styles/forgot.module.scss'

import Header from '@/components/header'
import Footer from '@/components/footer'
import IconButton from '@/components/buttons/iconButton';

import { Form, Formik } from 'formik';
import * as Yup from 'yup'

import { useState } from 'react';
import Link from 'next/link';
import LoginInput from '@/components/inputs/loginInputs';
import { BiLeftArrowAlt } from 'react-icons/bi';
import axios from 'axios';
import DotLoaderSpinner from '@/components/loaders/dotLoader';

export default function forgot({country}) {
    const [email,setEmail] = useState('');
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');

    const forgotHandler = async () => {
        try{
            setLoading(true);
            const {data} = await axios.post('/api/auth/forgot', { email });
            setLoading(false);
            setError('');
            setSuccess(data.message);
            setEmail('');
        } catch (error) {
            setLoading(false);
            setSuccess('');
            setError(error.response.data.message);
        }
    };

    const emailValidation=Yup.object({
        email: Yup.
          string().
          required('Email is required').
          email('Please enter a valid email address')
      });
    console.log(country);
  return (
    <>
      {          
        loading && <DotLoaderSpinner loading={loading}/>
      }
      <Header country={country}/>
        <div className={styles.forgot}>
            <div>
                <div className={styles.forgot__header}>
                    <div className={styles.back__svg}>
                        <BiLeftArrowAlt />
                    </div>
                    <span>
                        Forgot your password? <Link href='/'>Back to login</Link>
                    </span>
                </div>

                <div>
                    <Formik
                        enableReinitialize
                        initialValues={{
                        email
                        }}
                        validationSchema={emailValidation}
                        onSubmit={()=>{
                        forgotHandler();
                        }}
                    >
                        {
                        (form) => (
                            <Form>
                            <LoginInput 
                                type="text"
                                name="email"
                                icon="email" 
                                placeholder="Email Address"
                                onChange={ (e)=>setEmail(e.target.value)}
                                />
                            <IconButton type='submit' text='Send link' />
                            <div style={ {marginTop: '10px'} }>
                            {
                                error && 
                                (
                                <span className={styles.error}>{error}</span>
                                )
                            }
                            {
                                success && 
                                (
                                <span className={styles.success}>{success}</span>
                                )
                            }
                            </div>
                            </Form>
                        )
                        }
                    </Formik>
                </div>

            </div>
        </div>
      <Footer country={country}/>
    </>
  )
}

export async function getServerSideProps() {
    return {
      props:{
        //country: { name: data.name, flag: data.flag.emojitwo }
        country: { name: 'United States', flag: '../../../images/us-flag.png' }
      }
    }
  }