(function () {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    app.querySelector("#join-user").addEventListener("click", function () {
        let username = document.querySelector("#Username").value.trim();

        if (username.length === 0) {
            alert("Please enter a username.");
            return;
        }

        uname = username;
        socket.emit("newuser", uname);

        document.querySelector(".join-screen").classList.remove("active");
        document.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector("#send-message").addEventListener("click", function () {
        let message = document.querySelector("#message-input").value.trim();

        if (message.length === 0) {
            return;
        }

        renderMessage("my", { username: uname, text: message });

        socket.emit("chat", { username: uname, text: message });

        document.querySelector("#message-input").value = "";
    });

    socket.on("update", function (data) {
        renderMessage("update", data);
    });

    socket.on("chat", function (data) {
        console.log("Received chat data:", data);

        if (typeof data === "object" && data.username !== uname) {
            renderMessage("other", { username: data.username, text: data.text });
        }
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");

        let el = document.createElement("div");

        if (type === "my") {
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div class="bubble my-bubble">
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type === "other") {
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div class="bubble other-bubble">
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type === "update") {
            el.setAttribute("class", "update-message");
            el.innerHTML = `<div class="update-text">${message.message}</div>`;
        }

        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
})();
