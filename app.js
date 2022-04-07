const express = require("express");
const socket = require("socket.io");
const port = 3000;

const app = express();  // initialize and server ready
app.use(express.static("public")); // to display static html page present in public folder

let server = app.listen(port, () => {
    console.log(`listening to the port no ${port}`);
})

let io = socket(server);    // connect socket with server


io.on("connection", (socket) => {       // as soon as frontend connects from backend
    console.log("Made Socket Connection ");
    
    // recevies (data) from frontend 
    socket.on("beginPath", (data) => {
        // emits to all sockets
        io.sockets.emit("beginPath", data);
    })

    socket.on("drawStroke", (data) => {
        // emits to all sockets
        io.sockets.emit("drawStroke", data);
    })

    socket.on("undoRedo", (data) => {
        // emits to all sockets
        io.sockets.emit("undoRedo", data);
    })
    
})
