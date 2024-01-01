import bcrypt from 'bcrypt'
import User from '@/models/User';
import db from '@/utils/db'
import {createActivationToken} from '@/utils/token'
import {sendEmail} from '@/utils/sendEmail'
import { validateEmail } from '@/utils/validation';
import { createRouter } from 'next-connect';
import { activateEmailTemplate } from '@/emails/activateEmailTemplate';
const router = createRouter();

router.post( async(req,res)=>{
    try {
        await db.connect();
        //const data = await req.body;
        const [name,email,password] = Object.values(req.body);
        console.log(req.body);

        //Check we have all the values filled in
        if(!name || !email || !password) {
            res.statusCode = 400;
            res.send({ message: 'Missing data.  Please fill in all fields.'});
        }
        //Check if the email has valid structure
        if(!validateEmail(email)) {
            res.statusCode = 400;
            res.send({ message: 'Invalid email'});
        }
        //Check that the password has 6 or more characters
        if(password.length<6) {
            res.statusCode = 400;
            res.send({ message: 'Invalid password length.  Must be at least 6 characters.'});
        }
        //Check if the email is already registered
        const user = await User.findOne({email});
        if (user) {
            res.statusCode = 400;
            res.send({ message: 'This email is already registered.'});
        }
        const encryptedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name,
            email,
            password:encryptedPassword
        });
        const addedUser = await newUser.save();

        const activation_token = createActivationToken({
            id: addedUser._id.toString()
        });

        const url=`${process.env.BASE_URL}/activate/${activation_token}`;
        sendEmail(email,url,'','Verify your email!', activateEmailTemplate);

        await db.disconnect();

        res.statusCode = 201;
        res.send({ message: 'Success! Please activate you email to start.', data: addedUser});
    } catch (error) {
        res.statusCode = 500;
        res.send({ message: error.message});
    }
    res.send('Welcome');
});

export default router.handler();