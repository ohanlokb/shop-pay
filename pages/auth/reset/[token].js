
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
import jwt from 'jsonwebtoken';
import DotLoaderSpinner from '@/components/loaders/dotLoader';
import { Router } from 'next/router';
import { getSession, signIn } from 'next-auth/react';

export default function reset({country, user_id}) {
    const [password,setPassword] = useState('');
    const [confirm_password,setConfirm_password] = useState('');
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');

    console.log("user_id", user_id);

    const resetHandler = async () => {
        try{
            setLoading(true);
            const {data} = await axios.put('/api/auth/reset', {
                user_id,
                password
            });

            let options = {
                redirect: false,
                email: data.email,
                password: password
              };
            await signIn('credentials', options);            
            Window.location.reload(true);            
        } catch (error) {
            setLoading(false);
            setSuccess('');
            //setError(error.response.data.message);
        }
    };

    const passwordValidation=Yup.object({
        password: Yup.
            string().
            required('Password is required').
            min(6),
        confirm_password: Yup.
            string().
            required('Password must match').
            oneOf([Yup.ref('password')], 'Passwords must match')
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
                        Reset your password? <Link href='/'>Login instead</Link>
                    </span>
                </div>

                <div>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            password,
                            confirm_password
                        }}
                        validationSchema={passwordValidation}
                        onSubmit={()=>{
                            resetHandler();
                        }}
                    >
                        {
                        (form) => (
                            <Form>
                            <LoginInput 
                                type="password"
                                name="password"
                                icon='password' 
                                placeholder='Enter your password.' 
                                onChange={(e) => setPassword(e.target.value)}
                                />
                            <LoginInput 
                                type="password"
                                name="confirm_password"
                                icon='password' 
                                placeholder='Re-enter your password.' 
                                onChange={(e) => setConfirm_password(e.target.value)}
                                />
                            <IconButton type='submit' text='Submit' />
                            <div style={ {marginTop: '10px'} }>
                            {
                                error && 
                                (
                                <span className={styles.error}>{error}</span>
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

export async function getServerSideProps(context) {
    const {query,req}=context;
    const session = await getSession({req});
    if(session) {
        return {
            redirect: {
                destination: '/'
            }
        }
    }
    const token = query.token;
    const user_id = jwt.verify(token,process.env.RESET_TOKEN_SECRET);
    console.log(user_id);
    return {
      props:{
        user_id: user_id.id,
        //country: { name: data.name, flag: data.flag.emojitwo }
        country: { name: 'United States', flag: '../../../images/us-flag.png' }
      }
    }
  }