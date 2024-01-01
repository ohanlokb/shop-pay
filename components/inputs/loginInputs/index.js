import styles from './styles.module.scss'
import { BiUser } from 'react-icons/bi';
import { SiMinutemailer } from 'react-icons/si';
import { IoKeyOutline } from 'react-icons/io5';
import { ErrorMessage, useField } from 'formik';
import React from 'react';

export default function LoginInput( {icon, placeholder, ...props} ) {
    const [field, meta] = useField(props);

    console.log(meta);
    
    const inputIcon = () => {
        switch(icon) {
          case "user":   return <BiUser/>;
          case "email":   return <SiMinutemailer/>
          case "password": return <IoKeyOutline/>;
 
          default: <BiUser/>;
        }
      };

    return (
        <div className={`${styles.input} ${meta.touched && meta.error ? styles.error : ""}`}>
            { inputIcon() }
            <input 
                name={field.name} 
                type={field.type} 
                placeholder={placeholder}
                {...field}
                {...props}
            />
            {
                meta.touched && meta.error && 
                <div className={styles.error__popup}>
                    <span></span>
                    <ErrorMessage name={field.name} />
                </div>
            }
        </div>
    );
}
