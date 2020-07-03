const express = require('express');
const router = express.Router();
const mysql = require('promise-mysql');
const request = require('request-promise');

const uuidv1 = require('uuid/v1');
const _ = require('lodash');

(async() => {
    const connection = await mysql.createConnection({
        host     : "turon-education.ctskthir5ejh.us-east-2.rds.amazonaws.com",
        user     : "root",
        password : "turonpassword",
        database:  "turondb",
        port     : 3306,
        timeout: 60000
    });
    
    const connection = await mysql.createConnection({
        host     : "turon-education.ctskthir5ejh.us-east-2.rds.amazonaws.com",
        user     : "root",
        password : "turonpassword",
        database:  "turondb",
        port     : 3306,
        timeout: 60000
    });

    // Login
    router.post('/login', async (req, res, next) => {
        try{
            const {email, password} = req.body;

            if(req.body.facebook_id){
                const user = await connection.query('SELECT * FROM user WHERE facebook_id = ?', [req.body.facebook_id]);

                if(!user.length){
                    throw Error(`Please sign up with Facebook first.`);
                }

                return res.status(200).send(user[0]);
            }

            if(req.body.google_id){
                const user = await connection.query('SELECT * FROM user WHERE google_id = ?', [req.body.google_id]);

                if(!user.length){
                    throw Error(`Please sign up with Google first.`);
                }

                return res.status(200).send(user[0]);
            }

            
            if(req.body.linkedin_id){
                const user = await connection.query('SELECT * FROM user WHERE linkedin_id = ?', [req.body.linkedin_id]);

                if(!user.length){
                    throw Error(`Please sign up with Linkedin first.`);
                }

                return res.status(200).send(user[0]);
            }

            const user = await connection.query('SELECT * FROM user WHERE email = ? and password = ?', [email, password]);

            if(!user.length){
                throw Error('Username or password is invalid.');
            }
    
            return res.status(200).send(user[0]);
    
        }catch(e){
            console.log(e);
    
            return res.status(400).send({message: e.message});
        }
    })

    // Signup
    router.post('/signup', async (req, res, next) => {
        try{
            let university = req.body.university || '';
            let firstName = req.body.firstName || '';
            let lastName = req.body.lastName || '';
            let email = req.body.email || '';
            let password = req.body.password || '';
            let zipcode = req.body.zipcode || '';

            let user_id = uuidv1();

            if(req.body.facebook_id){
                const { facebook_id } = req.body;

                let responseUser = await connection.query('SELECT * FROM user WHERE facebook_id = ?', [facebook_id]);

                if(responseUser.length){
                    return res.send(responseUser[0]);
                }

                await connection.query(`INSERT INTO user (id, email, firstName, lastName, facebook_id) VALUES (${connection.escape(user_id)}, ${connection.escape(email)}, ${connection.escape(firstName)}, ${connection.escape(lastName)}, ${connection.escape(facebook_id)})`);
                
                responseUser = await connection.query('SELECT * FROM user WHERE facebook_id = ?', [facebook_id]);

                if(!responseUser.length){
                    throw Error('Something went wrong.');
                }

                return res.send(responseUser[0]);
            }

            if(req.body.google_id){
                const { google_id } = req.body;

                let responseUser = await connection.query('SELECT * FROM user WHERE google_id = ?', [google_id]);

                if(responseUser.length){
                    return res.send(responseUser[0]);
                }

                await connection.query(`INSERT INTO user (id, email, firstName, lastName, google_id) VALUES (${connection.escape(user_id)}, ${connection.escape(email)}, ${connection.escape(firstName)}, ${connection.escape(lastName)}, ${connection.escape(google_id)})`);
                
                responseUser = await connection.query('SELECT * FROM user WHERE google_id = ?', [google_id]);

                if(!responseUser.length){
                    throw Error('Something went wrong.');
                }

                return res.send(responseUser[0]);
            }

            if(req.body.linkedin_id){
                const { linkedin_id } = req.body;

                let responseUser = await connection.query('SELECT * FROM user WHERE linkedin_id = ?', [linkedin_id]);

                if(responseUser.length){
                    return res.send(responseUser[0]);
                }

                await connection.query(`INSERT INTO user (id, email, firstName, lastName, linkedin_id) VALUES (${connection.escape(user_id)}, ${connection.escape(email)}, ${connection.escape(firstName)}, ${connection.escape(lastName)}, ${connection.escape(linkedin_id)})`);
                
                responseUser = await connection.query('SELECT * FROM user WHERE linkedin_id = ?', [linkedin_id]);

                if(!responseUser.length){
                    throw Error('Something went wrong.');
                }

                return res.send(responseUser[0]);
            }

            if(!email || !password){
                throw Error('Email or password is missing.');
            }
        
            const response = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
    
            if(response.length !== 0){
                throw Error('User is already registered with this email.');
            }

            await connection.query(`INSERT INTO user (id, email, university, firstName, lastName, password, zipcode) VALUES (${connection.escape(user_id)}, ${connection.escape(email)}, ${connection.escape(university)}, ${connection.escape(firstName)}, ${connection.escape(lastName)}, ${connection.escape(password)}, ${connection.escape(zipcode)})`);

            const user = await connection.query(`SELECT * from user WHERE email = ${connection.escape(email)} and password = ${connection.escape(password)}`);

            if(!user.length){
                throw Error('Something went wrong.');
            }

            return res.send(user[0]);

        }catch(e){
            return res.status(400).send({message: e.message});
        }
    });

    // update
    router.put('/update/:userid', async (req, res, next) => {
        try{
            const { userid } = req.params;

            let opts = {
                university: req.body.university,
                email: req.body.email,
                zipcode: req.body.zipcode
            }

            const query = [];

            for(let key in opts){
                if(opts[key]){
                    query.push(`${key} = ${connection.escape(opts[key])}`);
                }
            }

            if(query.length){
                await connection.query(`UPDATE user set ${query.join(',')} WHERE id = ${connection.escape(userid)}`);
            }

            const user = await connection.query(`SELECT * FROM user WHERE id = ${connection.escape(userid)}`);

            if(!user || !user.length){
                throw Error('Something went wrong.');
            }

            return res.send(user[0]);

        }catch(e){
            return res.status(400).send({message: e.message});
        }
    })

    router.get('/linkedin', async (req, res, next) => {
        try{
            if(!req.query.code){
                throw Error('Code is not defined');
            }

            const response = await request('https://www.linkedin.com/oauth/v2/accessToken', {
                method: 'POST',
                json: true,
                form: {
                    grant_type: 'authorization_code',
                    code: req.query.code,
                    redirect_uri: 'https://turon.co/linkedin_redirect',
                    client_id: '86af1b1sawv1pr',
                    client_secret: 'EC1hBz7uPwliql6c'
                }
            })

            if(!response.access_token){
                throw Error('Invalid access token');
            }

            const user = await request('https://api.linkedin.com/v1/people/~:(id,firstName,lastName,email-address)?format=json', {
                headers: {
                    'Authorization': `Bearer ${response.access_token}`
                },
                json: true
            })

            return res.status(200).send(user);
        }catch(e){
            return res.status(400).send({message: e.message});
        }
    })

    router.get('/tutors', async (req, res, next) => {
        try{
            if(!req.query.subject && !req.query.course){
                throw Error('Subject or course has to be present');
            }

            const tutors = await connection.query(`SELECT a.id as tutorid, b.id as id, fees, about, subject, profile, email, firstName, lastName, university, zipcode FROM tutor a join user b on a.id = b.tutor where subject like '%${req.query.subject}%' ${req.query.school ? 'and university = ' + connection.escape(req.query.school) : ''}`);

            if(!tutors || !tutors.length){
                throw Error('Nothing found.');
            }

            return res.status(200).send(tutors);

        }catch(e){
            return res.status(400).send({message: e.message});
        }
    })

    router.get('/tutors/:id', async (req, res, next) => {
        try{
            const tutor = await connection.query(`SELECT a.id as tutorid, b.id, fees, about, subject, profile, email, firstName, lastName, university, zipcode FROM tutor a join user b on a.id = b.tutor where a.id = ${connection.escape(req.params.id)} or b.id = ${connection.escape(req.params.id)}`);

            if(!tutor || !tutor.length){
                throw Error('Tutor is not found');
            }

            return res.status(200).send(tutor[0]);

        }catch(e){
            return res.status(400).send({message: e.message});
        }
    })

    router.post('/tutors/:id', async (req, res, next) => {
        try{
            if(!req.body.fees || !req.body.about || !req.body.subject || !req.body.profile || !req.body.phone){
                throw Error('Form is invalid.');
            }

            const id = uuidv1();
            await connection.query(`INSERT INTO tutor (id, fees, about, subject, profile, phone) values (${connection.escape(id)}, ${connection.escape(req.body.fees)}, ${connection.escape(req.body.about)}, ${connection.escape(req.body.subject)}, ${connection.escape(req.body.profile)}, ${connection.escape(req.body.phone)})`);
            
            await connection.query(`UPDATE user set tutor = ${connection.escape(id)} where id = ${connection.escape(req.params.id)}`);

            return res.status(200).send(String(req.params.id));

        }catch(e){
            return res.status(400).send({message: e.message});
        }
    })

    router.get('/reviews/:id', async (req, res, next) => {
        try{
            const reviews = await connection.query(`SELECT * FROM reviews where tutor = ${connection.escape(req.params.id)} order by date DESC`);
            const studentReview = await connection.query(`SELECT * FROM reviews where tutor = ${connection.escape(req.params.id)} and student = ${connection.escape(req.query.sid)}`);
            const studentMessages = await connection.query(`SELECT * FROM chatrooms where requester = ${connection.escape(req.query.sid)} and responder = ${connection.escape(req.params.id)}`);

            return res.status(200).send({
                reviews: reviews,
                canLeaveReview: !studentReview.length && studentMessages.length
            })

        }catch(e){
            return res.status(400).send({message: e.message});
        }
    })

    router.post('/reviews/:id', async (req, res, next) => {
        try{
            await connection.query(`INSERT INTO reviews (rating, message, date, student, tutor) values (${connection.escape(req.body.rating)}, ${connection.escape(req.body.message)}, ${connection.escape(new Date())}, ${connection.escape(req.body.student)}, ${connection.escape(req.params.id)})`);

            const reviews = await connection.query(`SELECT * FROM reviews where tutor = ${connection.escape(req.params.id)} order by date DESC`);
            const studentReview = await connection.query(`SELECT * FROM reviews where tutor = ${connection.escape(req.params.id)} and student = ${connection.escape(req.body.student)}`);

            return res.status(200).send({
                reviews: reviews,
                canLeaveReview: !(studentReview && studentReview.length)
            })

        }catch(e){
            return res.status(400).send({message: e.message});
        }
    })
})();

module.exports = router;
