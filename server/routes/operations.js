let express = require('express');
let router = express.Router();
let fs=require('fs');
let expressSessions = require("express-session");
let mysql = require('promise-mysql');
let bluebird = require('bluebird');
const AWS = require('aws-sdk');
const multiparty = require('multiparty');
const fileType = require('file-type');

const request = require('request-promise');

const uuidv1 = require('uuid/v1');
const _ = require('lodash');

(async() => {
    const connection = await mysql.createConnection({
        host     : "turondb2019.cfmqt4tzpfq4.us-east-1.rds.amazonaws.com",
        user     : "root",
        password : "turonpassword",
        database:  "turondb2019",
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
                    redirect_uri: 'http://localhost:3000/linkedin_redirect',
                    client_id: '86a231wz11ia56',
                    client_secret: 'bdKoQKLoeaRgyxCG'
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
})();



let S3_BUCKET="aws-profile";
let AWS_ACCESS_KEY_ID="AKIAI566MHJKC2G6WS5A";
let AWS_SECRET_ACCESS_KEY="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";

AWS.config.update({
    accessKeyId:AWS_ACCESS_KEY_ID,
    secretAccessKey:AWS_SECRET_ACCESS_KEY
});

AWS.config.setPromisesDependency(bluebird);
const s3 = new AWS.S3();
var filename="";

const uploadFile = (buffer, name, type) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket:S3_BUCKET,
        ContentType: type.mime,
        Key: `${name}.${type.ext}`
    };
    filename=name+"."+type.ext;
    console.log("FileName-->", filename);
    let urlParams = {Bucket: S3_BUCKET, Key: filename};
    s3.getSignedUrl('getObject', urlParams, function(err, url){
        console.log('the url of the image is', url);
        filename=url.replace(/^https:\/\//i, 'http://');
    })
    return s3.upload(params).promise();
};

var urlParams = {Bucket: S3_BUCKET, Key: filename};
s3.getSignedUrl('getObject', urlParams, function(err, url){
    console.log('the url of the image is', url);
})

// router.post('/login', function (req, res, next) {
//     let email = req.body.email;
//     let password = req.body.password;
//     console.log("reached login");
//     let array = [];
//     array.push([email,password]);

//     connection.query('SELECT * FROM user WHERE email = ?', [email], function (err, results) {
//         if (err) throw err;
//         console.log('--> ', results);

//         if (results === null || results.length === 0) {
//             console.log("bad request");
//             return res.json({status: 401});
//         }
//         else if (results[0]) {
//             console.log("results", results);
//             let pass = results[0].password;
//             let email=results[0].email;
//             if (pass === password) {
//                 console.log("success", results[0]);
//                 connection.query('SELECT * FROM tutor WHERE email = ?', [email], function (err, res1) {
//                     if(res1 != null && res1.length !== 0){
//                         console.log("profile-->",res1);
//                         return res.json({message: "Logged in Successfully", email: email, status: 200, tutor:true, profile: res1[0]});
//                     }
//                     else {
//                         return res.json({message: "Logged in Successfully", email: email, status: 200, tutor:false});
//                     }
//                 });

//             }
//             else {
//                 return res.json({status: 401});
//             }
//         }
//     });
// });


router.post('/FindTutor', function (req, res, next) {

    let email = req.body.email;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let about = req.body.about;
    let date = req.body.date;
    let fees = req.body.fees;
    let teacher = req.body.teacher;
    // let profile = req.body.File[0].base64;
    let profile=filename;
    let phone = req.body.phone;
    let gender = req.body.gender;
    let school = req.body.school;
    let subject = req.body.subject;

    console.log("reached BLOB image-->", req.body);

    let array = [];
    array.push([email, firstName, lastName, about, date, fees, teacher, profile, phone, gender, school, subject]);

    connection.query('SELECT * FROM user WHERE email = ?', [email], function (err, results) {
        if (err) throw err;
        console.log('>>>>>>>>>>>>>>>> ', results);
        if (results !== null || results.length !== 0) {
            connection.query('INSERT INTO tutor (email, firstName, lastName, about, date, fees, teacher, profile, phone, gender, school, subject) VALUES ?', [array], function (err, result) {
               if(err)
               {
                   console.log("Error-->", err);
               }
                console.log("Result-->", result)
                res.json({message: "FindTutor is successful ", value: email});
            });
        }
        else {
            console.log("User is already registered with this email id");
            return res.json({message: "User is already registered with this email id", value: "User already registered"
            });
        }
    });
});


router.post('/test-upload', (request, response) => {
    console.log("Reached Test Upload -->");
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
        if (error) throw new Error(error);
        console.log("files-->", files.file[0].path);
        try {
            const path = files.file[0].path;
            const buffer = fs.readFileSync(path);
            // console.log("buffer-->", buffer);
            const type = fileType(buffer);
            // console.log("type-->",type);
            const timestamp = Date.now().toString();
            filename = `bucketFolder/${timestamp}-lg`;
            const data = uploadFile(buffer, filename, type);
            // console.log("URL-->", s3.getUrl(S3_BUCKET, `${filename}.${type.ext}`));
           console.log("data-->",data);
            return response.status(200).send(data);
        } catch (error) {
            return response.status(400).send(error);
        }
    });
});

router.post('/humid', function (req, res, next) {
    console.log("reached humid");
});

router.post('/table', function (req, res, next) {
    console.log("reached table");
    var device_type = req.body.device_type+" Sensor";
    var street_name = req.body.street_name;

    console.log("device_type :" + device_type);
    console.log("street_name :" + street_name);
});

router.post('/find', function (req, res, next) {
    let university = req.body.university;
    let subject = req.body.subject;
    // let course = req.body.course;
    let array = [];
    array.push([university]);

    if(university === ""){
        connection.query('SELECT * FROM tutor', function (err, results) {
            if (err) throw err;
            console.log("Results->", results);
              res.json({message: "Inside FindTutor University ", value: results});
            });
    }
    else{
        connection.query('SELECT * FROM tutor WHERE school = ?', [university], function (err, results) {
            if (err) throw err;
            console.log("findtutor res", results);
            if (results === null || results.length === 0) {
                res.json({message: "Inside FindTutor University ", value: results});
                }
        });
    }
});





router.post('/logout', function(req,res){
    var session=req.session;
    dummy="dummy";
    console.log("In logout ", req.session.user)
    session.user = null;
    session.destroy();
    res.json({
        status:'200',
        message : "Logged Out."
    });
});

module.exports = router;