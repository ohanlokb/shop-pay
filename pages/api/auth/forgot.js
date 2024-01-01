import bcrypt from 'bcrypt'
import User from '@/models/User';
import db from '@/utils/db'
import {createResetToken} from '@/utils/token'
import {sendEmail} from '@/utils/sendEmail'
import { validateEmail } from '@/utils/validation';
import { createRouter } from 'next-connect';
import { resetEmailTemplate } from '@/emails/resetEmailTemplate';
const router = createRouter();

router.post( async(req,res)=>{
    try {
        await db.connect();
        //const data = await req.body;
        const {email} = req.body; //Object.values(req.body);
        console.log(req.body);

        const user = await User.findOne({email});
        if(!user) {
            res.statusCode = 400;
            return res.send({message:'This email is not registered.'});
        }

        const reset_token = createResetToken({
            id: user._id.toString()
        });

        const url=`${process.env.BASE_URL}/auth/reset/${reset_token}`;
        sendEmail(email,url,'','Reset your password.', resetEmailTemplate);

        await db.disconnect();

        res.statusCode = 200;
        res.send({ message: 'You have been sent an email with a link to reset your password.'});
    } catch (error) {
        res.statusCode = 500;
        res.send({ message: error.message});
    }
    res.send('Welcome');
});

export default router.handler();