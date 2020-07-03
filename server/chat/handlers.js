const mysql = require('promise-mysql');
const _ = require('lodash');

(async() => {
  connection = await mysql.createConnection({
      host     : "turon-education.ctskthir5ejh.us-east-2.rds.amazonaws.com",
      user     : "root",
      password : "turonpassword",
      database:  "turondb",
      port     : 3306,
      timeout: 60000
  });

})();


exports.handleGetChatrooms = async({userid, type}, callback) => {
  let rooms;

  if(type === 'student'){
    rooms = await connection.query(`select b.firstName, b.lastName, a.responder, a.id from chatrooms a join tutor b on a.responder = b.id where a.requester = ${connection.escape(userid)}`);

    for(let i = 0; i < rooms.length; i++){
      const message = await connection.query(`select * from chatmessages where roomid = ${rooms[i].id} order by ts desc limit 0,1`);
      
      rooms[i] = {
        ...rooms[i],
        ..._.first(message)
      }
    }
  }

  return callback(null, Array.prototype.slice.call(rooms));
}


// function makeHandleEvent(client, clientManager, chatroomManager) {
//   function ensureExists(getter, rejectionMessage) {
//     return new Promise(function (resolve, reject) {
//       const res = getter()
//       return res
//         ? resolve(res)
//         : reject(rejectionMessage)
//     })
//   }

//   function ensureUserSelected(clientId) {
//     return ensureExists(
//       () => clientManager.getUserByClientId(clientId),
//       'select user first'
//     )
//   }

//   function ensureValidChatroom(chatroomName) {
//     return ensureExists(
//       () => chatroomManager.getChatroomByName(chatroomName),
//       `invalid chatroom name: ${chatroomName}`
//     )
//   }

//   function ensureValidChatroomAndUserSelected(chatroomName) {
//     return Promise.all([
//       ensureValidChatroom(chatroomName),
//       ensureUserSelected(client.id)
//     ])
//       .then(([chatroom, user]) => Promise.resolve({ chatroom, user }))
//   }

//   function handleEvent(chatroomName, createEntry) {
//     return ensureValidChatroomAndUserSelected(chatroomName)
//       .then(function ({ chatroom, user }) {
//         // append event to chat history
//         const entry = { user, ...createEntry() }
//         chatroom.addEntry(entry)

//         // notify other clients in chatroom
//         chatroom.broadcastMessage({ chat: chatroomName, ...entry })
//         return chatroom
//       })
//   }

//   return handleEvent
// }

// module.exports = function (client, clientManager, chatroomManager) {
//   const handleEvent = makeHandleEvent(client, clientManager, chatroomManager)

//   const handleRegister()

//   function handleRegister(userName, callback) {
//     if (!clientManager.isUserAvailable(userName))
//       return callback('user is not available')

//     const user = clientManager.getUserByName(userName)
//     clientManager.registerClient(client, user)

//     return callback(null, user)
//   }

//   function handleJoin(chatroomName, callback) {
//     const createEntry = () => ({ event: `joined ${chatroomName}` })

//     handleEvent(chatroomName, createEntry)
//       .then(function (chatroom) {
//         // add member to chatroom
//         chatroom.addUser(client)

//         // send chat history to client
//         callback(null, chatroom.getChatHistory())
//       })
//       .catch(callback)
//   }

//   function handleLeave(chatroomName, callback) {
//     const createEntry = () => ({ event: `left ${chatroomName}` })

//     handleEvent(chatroomName, createEntry)
//       .then(function (chatroom) {
//         // remove member from chatroom
//         chatroom.removeUser(client.id)

//         callback(null)
//       })
//       .catch(callback)
//   }

//   function handleMessage({ chatroomName, message } = {}, callback) {
//     const createEntry = () => ({ message })

//     handleEvent(chatroomName, createEntry)
//       .then(() => callback(null))
//       .catch(callback)
//   }

//   function handleGetAvailableUsers(_, callback) {
//     return callback(null, clientManager.getAvailableUsers())
//   }

//   function handleDisconnect() {
//     // remove user profile
//     clientManager.removeClient(client)
//     // remove member from all chatrooms
//     chatroomManager.removeClient(client)
//   }

//   return {
//     handleRegister,
//     handleJoin,
//     handleLeave,
//     handleMessage,
//     handleGetChatrooms,
//     handleGetAvailableUsers,
//     handleDisconnect
//   }
// }