const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', function() {
    const userMessage = userInput.value;
    if (userMessage.trim() !== '') {
        appendMessage('You', userMessage);
        getBotResponse(userMessage);
        userInput.value = '';
    }
});

userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerText = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(userMessage) {
    // Simple logic for chatbot response
    let botMessage = "I don't understand that.";
    
    if (userMessage.toLowerCase().includes('hello')) {
        botMessage = 'Hello! How can I help you today?';
    } else if (userMessage.toLowerCase().includes('help')) {
        botMessage = 'Sure, what do you need help with?';
    }
    
    setTimeout(() => appendMessage('Bot', botMessage), 500);
}
