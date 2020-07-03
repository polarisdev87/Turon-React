const mysql = require('promise-mysql');
const _ = require('lodash');
const Twilio = require('twilio');
const TwillioAccountSid = 'ACac9aa470fafc7e2de434c6000c52f909';
const TwillioAuthToken = '15817ff330a59bb6e08c7d043a5bdec0';

const twilio = new Twilio(TwillioAccountSid, TwillioAuthToken);

const MailgunApi = '01c73be9e79ba235670353cc3d740ac7-985b58f4-c3e0e6c7';
const mailgun = require('mailgun-js')({apiKey: MailgunApi, domain: 'sandboxbe0f2a7209544f2fa42a40429e0e70f9.mailgun.org'});


const sendEmail = async(email, message) => {
    try{
        const data = {
            from: 'Turon.co <me@samples.mailgun.org>',
            to: email,
            subject: '🔊🔊IMPORTANT: You have been REQUESTED for tutoring 🔊🔊',
            text: message
        };

        await new Promise((resolve, reject) => {
            mailgun.messages().send(data, function (error, body) {
                if(error){
                    reject(error);
                    return;
                }

                resolve(body);
            });
        })

    }catch(e){
        console.log(e);
    }
}

const sendSMS = async (phone, message) => {
    try{
        await twilio.messages.create({
            body: message,
            to: phone,
            from: '+18317099094'
        })
    }catch(e){
        console.log(e);
    }
}

(async() => {
  connection = await mysql.createConnection({
      host     : "turon-education.ctskthir5ejh.us-east-2.rds.amazonaws.com",
      user     : "root",
      password : "turonpassword",
      database:  "turondb",
      port     : 3306,
      timeout: 60000
  });

  console.log(`Connected to MYSQL server.`);

})();

const server = require('http').createServer();
const io = require('socket.io')(server);

const PORT = 3002;

const clients = new Map();

io.on('connection', function (client) {
    console.log('client connected...', client.id);

    const getChatrooms = async({userid}) => {
        let rooms;

        rooms = await connection.query(`select CONCAT(b.firstName, ' ', b.lastName) as teacherName, CONCAT(c.firstName, ' ', c.lastName) as studentName,  requester as student, a.responder as teacher, a.id from chatrooms a join user b on a.responder = b.id join user c on a.requester = c.id where responder = ${connection.escape(userid)} or a.requester = ${connection.escape(userid)} order by a.ts desc`)

        for(let i = 0; i < rooms.length; i++){
            const message = await connection.query(`select roomid, message, author, ts, (SELECT count(*) from chatmessages where isRead = 0 and roomid = ${rooms[i].id} and author != ${connection.escape(userid)}) as unread from chatmessages where roomid = ${rooms[i].id} order by ts desc limit 0,1`);

            rooms[i].message = _.first(message);
          }

        return rooms;
    }

    client.on('create_room', async({tutorid, userid, message}, callback) => {
        const ts = new Date();
        const {insertId} = await connection.query(`INSERT INTO chatrooms (requester, responder, ts) values (${connection.escape(userid)}, ${connection.escape(tutorid)}, ${connection.escape(ts.getTime())})`);
    
        if(clients.get(tutorid) && io.sockets.connected[clients.get(tutorid)]){
            io.sockets.connected[clients.get(tutorid)].join(insertId);
        }

        client.join(insertId);

        const {insertId: messageId} = await connection.query(`INSERT INTO chatmessages (message, roomid, author, ts) values (${connection.escape(message)}, ${connection.escape(insertId)}, ${connection.escape(userid)}, ${connection.escape(ts.getTime())})`);
        
        const _message = await connection.query(`SELECT a.id, a.roomid, a.message, a.ts, a.author, b.firstName, b.lastName from chatmessages a join user b on a.author = b.id where a.id = ${connection.escape(messageId)}`);
        
        io.to(insertId).emit('message', Array.prototype.slice.call(_message));

        const tutor = await connection.query(`SELECT a.phone, a.id as tutorid, b.email from tutor a join user b on a.id = b.tutor where b.id = ${connection.escape(tutorid)}`);

        const phone = tutor.length ? tutor[0].phone : null;
        const email = tutor.length ? tutor[0].email : null;

        if(phone){
            await sendSMS(phone, 'You have a tutoring session request, please go on to Turon and reply as soon as possible. www.turon.co Thank you!');
        }

        if(email){
            await sendEmail(email, 'You have a tutoring session request, please go on to Turon and reply as soon as possible. www.turon.co Thank you!');
        }

        callback(null);
    })

    client.on('register', async({userid}, callback) => {
        clients.set(userid, client.id);

        const rooms = await getChatrooms({userid});        

        client.join(_.map(rooms, i => String(i.id)));

        return callback(null, Array.prototype.slice.call(rooms));
    })

    client.on('get_rooms', async({userid}, callback) => {
        const rooms = await getChatrooms({userid});        

        return callback(null, Array.prototype.slice.call(rooms));
    })

    client.on('getMessages', async({roomid}, callback) => {
        const messages = await connection.query(`SELECT a.id, a.roomid, a.message, a.ts, a.author, b.firstName, b.lastName from chatmessages a join user b on a.author = b.id where roomid = ${connection.escape(roomid)} order by ts`);

        return callback(null, Array.prototype.slice.call(messages));
    })

    client.on('read_messages', async({roomid, userid, isTutor}, callback) => {
        if(isTutor){
            await connection.query(`UPDATE chatrooms set isReplied = 1 where id = ${connection.escape(roomid)}`);
        }

        await connection.query(`UPDATE chatmessages set isRead = 1 where roomid = ${connection.escape(roomid)} and author != ${connection.escape(userid)}`);
    
        callback(null);
    })

    client.on('message', async({message, room, author}, callback) => {
        const ts = new Date();
        const {insertId} = await connection.query(`INSERT INTO chatmessages (message, roomid, author, ts) values (${connection.escape(message)}, ${connection.escape(room)}, ${connection.escape(author)}, ${connection.escape(ts.getTime())})`);
        
        const _message = await connection.query(`SELECT a.id, a.roomid, a.message, a.ts, a.author, b.firstName, b.lastName from chatmessages a join user b on a.author = b.id where a.id = ${connection.escape(insertId)}`);
        
        io.to(room).emit('message', Array.prototype.slice.call(_message));
        callback(null, []);
    })
  
    client.on('disconnect', function () {
      console.log('client disconnect...', client.id)
    })
  
    client.on('error', function (err) {
      console.log('received error from client:', client.id)
      console.log(err)
    })
  })

server.listen(PORT, () => {
    console.log(`Chat is listening to port ${PORT}`);
});