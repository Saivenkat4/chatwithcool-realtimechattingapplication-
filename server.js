const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    console.log("A user connected");

    socket.on("newuser", function (username) {
        socket.username = username;
        socket.broadcast.emit("update", {
            type: "join",
            message: `${username} joined the conversation 🎉`,
        });
    });

    socket.on("exituser", function () {
        if (socket.username) {
            socket.broadcast.emit("update", {
                type: "leave",
                message: `${socket.username} left the conversation 😢`,
            });
        }
    });

    socket.on("chat", function (data) {
        console.log("Received message from client:", data);

        if (!data || typeof data !== "object" || !data.username || !data.text) {
            console.error("Invalid message format received:", data);
            return;
        }

        socket.broadcast.emit("chat", { username: data.username, text: data.text });
    });

    // socket.on("disconnect", function () {
    //     if (socket.username) {
    //         socket.broadcast.emit("update", {
    //             type: "leave",
    //             message: `${socket.username} left the conversation 😢`,
    //         });
    //     }
    // });
});

server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
