document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.querySelector(".chat-input input");
    const sendButton = document.querySelector(".chat-input button");
    const chatHistory = document.getElementById("chatHistory");

    // fuction for message to ui
    function appendMessage(text, isUser = false) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.classList.add(isUser ? "user" : "ai"); // Add 'user' or 'ai' class
        
        //  styling for user messages dynamically if css not have
        if (isUser) {
            messageDiv.style.marginLeft = "auto";
            messageDiv.style.background = "rgba(255, 255, 255, 0.1)";
            messageDiv.style.borderLeft = "none";
            messageDiv.style.borderRight = "3px solid #ffffff";
        }

        messageDiv.textContent = text;
        chatHistory.appendChild(messageDiv);
        
        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    //Function to talk to Python Backend
    async function sendMessage() {
        const query = chatInput.value.trim();
        if (!query) return;

        // A-Show User Message
        appendMessage(query, true);
        chatInput.value = ""; // Clear input

        // B-Show "Thinking..."
        const loadingDiv = document.createElement("div");
        loadingDiv.className = "message ai";
        loadingDiv.textContent = "Thinking...";
        chatHistory.appendChild(loadingDiv);

        try {
            // c Python Server connection
            const response = await fetch("https://shivam-99x-trying.hf.space/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: query })
            });

            const data = await response.json();

            // D- put response
            chatHistory.removeChild(loadingDiv);
            
            if (data.answer) {
                appendMessage(data.answer, false);
            } else {
                appendMessage("Sorry, I didn't get a response.", false);
            }

        } catch (error) {
            console.error("Error:", error);
            chatHistory.removeChild(loadingDiv);
            appendMessage("Error: Could not connect to the club brain. Is the server running?", false);
        }
    }

    // 3 Event Listeners
    sendButton.addEventListener("click", sendMessage);

    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

});



