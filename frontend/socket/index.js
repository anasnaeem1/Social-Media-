const io = require("socket.io")(8900, {
  cors: {
    origin: "https://social-media-eosin-ten.vercel.app",
  },
});

let users = [];
let visitInbox = [];

// Utility functions
const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const addUserOnVisitInbox = (userId, convoId, socketId) => {
  const userExists = visitInbox.some(
    (entry) => entry.userId === userId && entry.convoId === convoId
  );

  if (!userExists) {
    visitInbox.push({ userId, convoId, socketId });
  }
};

const getUser = (userId) => users.find((user) => user.userId === userId);

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const removeUserFromInbox = (socketId) => {
  visitInbox = visitInbox.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Add user to active users
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log("User added:", userId, socket.id);
    io.emit("getUsers", users);
  });

  // Handle user visiting inbox
  socket.on("visitInbox", ({ userId, convoId }) => {
    if (userId && convoId) {
      addUserOnVisitInbox(userId, convoId, socket.id);
      console.log(`User ${userId} is visiting inbox ${convoId}`);
      io.emit("getVisitInbox", visitInbox);
    }
  });

  // Handle sending messages
  socket.on("sendMessage", ({ recieverId, senderId, text }) => {
    console.log("Message sent:", { recieverId, senderId, text });
    if (text && text.trim() !== "" ) {
      const receiver = getUser(recieverId); 
      if (receiver) {
        console.log(`Delivering message to ${ receiver.socketId}`);
        io.to(receiver.socketId).emit("getMessage", { senderId, text });
      } else {
        console.error("Receiver not found or not connected");
      }
    } else {
      console.error("Message text is empty or invalid");
    }
  });

  // Handle user disconnecting from inbox
  socket.on("disconnectUserFromInbox", () => {
    console.log("User disconnected from inbox:", socket.id);
    removeUserFromInbox(socket.id);
    io.emit("getVisitInbox", visitInbox);
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    removeUser(socket.id);
    removeUserFromInbox(socket.id);
    io.emit("getUsers", users);
    io.emit("getVisitInbox", visitInbox);
  });
});
