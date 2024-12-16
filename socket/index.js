// const { disconnect } = require("mongoose");

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// When User Connects
io.on("connection", (socket) => { 
  io.emit("welcome", "hello this is socket server");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

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
  

  // When User Disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
