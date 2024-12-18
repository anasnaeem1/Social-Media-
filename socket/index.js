const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let users = [];
let visitInbox = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const addUserOnVisitInbox = (userId, convoId, socketId) => {
  const userExists = visitInbox.some(
    (entry) => entry.userId === userId && entry.convoId === convoId
  );

  if (userExists) {
    return; // Do not add the same user to the visitInbox again
  }
  visitInbox.push({ userId, convoId, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const removeUserFromInbox = (socketId) => {
  visitInbox = visitInbox.filter((user) => user.socketId !== socketId);
};

// When User Connects
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);
  io.emit("welcome", "hello this is socket server");

  // Add user on connection
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // Handle visitInbox event
  socket.on("visitInbox", ({ userId, convoId }) => {
    if (userId && convoId) {
      addUserOnVisitInbox(userId, convoId, socket.id);
      io.emit("getVisitInbox", visitInbox);
    }
  });

  // Handle message sending
  socket.on("sendMessage", ({ recieverId, senderId, text }) => {
    console.log("sendMessage event received:", { recieverId, senderId, text });
    const user = getUser(recieverId);
    if (user) {
      console.log("Receiver found:", user);
      io.to(user.socketId).emit("getMessage", { senderId, text });
    } else {
      console.error("Receiver not found or not connected");
    }
  });

  // Handle user disconnecting from visitInbox
  socket.on("disconnectUserFromInbox", () => {
    console.log("A user disconnected from inbox");
    removeUserFromInbox(socket.id);  // Remove from visitInbox
    io.emit("getVisitInbox", visitInbox);
  });

  // Handle user disconnection
  socket.on("disconnectUser", () => {
    console.log("A user disconnected");
    removeUser(socket.id);  // Remove from users
    removeUserFromInbox(socket.id);  // Remove from visitInbox
    io.emit("getUsers", users);
    io.emit("getVisitInbox", visitInbox);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
    removeUser(socket.id);
    removeUserFromInbox(socket.id);
    io.emit("getUsers", users);
    io.emit("getVisitInbox", visitInbox);
  });
});
