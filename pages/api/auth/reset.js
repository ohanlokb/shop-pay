import bcrypt from 'bcrypt'
import User from '@/models/User';
import db from '@/utils/db'
import {createResetToken} from '@/utils/token'
import {sendEmail} from '@/utils/sendEmail'
import { validateEmail } from '@/utils/validation';
import { createRouter } from 'next-connect';
import { resetEmailTemplate } from '@/emails/resetEmailTemplate';
const router = createRouter();

router.put( async(req,res)=>{
    try {
        await db.connect();
        const {user_id,password} = req.body;
        const user = await User.findById(user_id);
        if (!user) {
            res.statusCode = 400;
            res.send({ message: 'This account does not exist.'});
            return; 
        }
        const cryptedPassword = await bcrypt.hash(password,12);
        await user.updateOne({
            password: cryptedPassword
        });
        res.send({ email: user.email });
        await db.disconnect();        
    } catch (error) {
        res.statusCode = 500;
        res.send({ message: error.message});
    }
    res.send('Welcome');
});

export default router.handler();