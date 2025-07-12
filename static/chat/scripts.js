document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("send-button");
    const messageInput = document.getElementById("message-input");
    const messages = document.getElementById("messages");
    const menuButton = document.getElementById("menu-button");
    const sidebar = document.getElementById("sidebar");
    const chatBackground = document.getElementById("chat-background");

    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Toggle sidebar on menu click
    menuButton.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        chatBackground.classList.toggle("sidebar-open");
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        appendMessage("You", message);
        messageInput.value = "";

        fetch("/chat/api/chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({ message: message })
        })
            .then(response => response.json())
            .then(data => {
                appendMessage("Bot", data.response || "Sorry, no response.");
            })
            .catch(() => {
                appendMessage("Bot", "Error contacting server.");
            });
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.className = "message";
        if (sender === "You") messageElement.classList.add("user-message");
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        messages.appendChild(messageElement);
        messages.scrollTop = messages.scrollHeight;
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
