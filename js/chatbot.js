document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const datePicker = document.getElementById('date-picker');

    let chatBoxVisible = false;
    let dateSelectionMode = false;

    userInput.addEventListener('input', function() {
        if (!chatBoxVisible && userInput.value.trim() !== '') {
            chatBox.classList.remove('hidden');
            chatBoxVisible = true;
        }
    });

    sendBtn.addEventListener('click', function() {
        const userMessage = userInput.value.trim();

        if (userMessage !== '') {
            appendMessage('You', userMessage);
            getBotResponse(userMessage);
            userInput.value = '';
        }
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `${sender}: ${message}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function getBotResponse(userMessage) {
        let botMessage = "I don't understand that.";
        const lowerCaseMessage = userMessage.toLowerCase();

        if (lowerCaseMessage.includes('hello')) {
            botMessage = 'Hello! How can I help you today?';
        } else if (lowerCaseMessage.includes('help')) {
            botMessage = 'Sure, what do you need help with?';
        } else if (lowerCaseMessage.includes('schedule') || 
                   lowerCaseMessage.includes('appointment') || 
                   lowerCaseMessage.includes('appt') || 
                   lowerCaseMessage.includes('book')) {
            botMessage = 'Great, let me work on scheduling your appointment. Can you please select a date for your appointment?';
            dateSelectionMode = true;

            // Show the bot's message and then show the date picker
            appendMessage('Bot', botMessage);
            setTimeout(() => {
                datePicker.classList.remove('hidden');
            }, 500); // Slight delay to simulate bot response
            return; // Exit the function to avoid sending the message twice
        }

        setTimeout(() => appendMessage('Bot', botMessage), 500);
    }

    datePicker.addEventListener('change', function() {
        if (dateSelectionMode) {
            const selectedDate = datePicker.value;
            if (selectedDate) {
                appendMessage('You', `Selected date: ${selectedDate}`);
                appendMessage('Bot', 'Great, I have booked your consultation with a provider.');

                // Generate a random number for the consultation link
                const randomNumbers = Math.floor(100000 + Math.random() * 900000);
                const consultationLink = `https://example.com/webapp/m/ph${randomNumbers}/role=guest`;

                // Create the .ics file content
                const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Your Product//EN
BEGIN:VEVENT
UID:${randomNumbers}
DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, '')}
DTSTART:${selectedDate.replace(/-/g, '')}T090000Z
DTEND:${selectedDate.replace(/-/g, '')}T100000Z
SUMMARY:Consultation with Provider
DESCRIPTION:Your consultation is booked. Use the following link: ${consultationLink}
URL:${consultationLink}
END:VEVENT
END:VCALENDAR`;

                // Create a Blob from the .ics content
                const blob = new Blob([icsContent], { type: 'text/calendar' });
                const icsUrl = URL.createObjectURL(blob);

                // Append a download link to the chat
                appendMessage('Bot', `Download your appointment: <a href="${icsUrl}" download="consultation.ics"><button>Download .ics</button></a>`);
                
                // Hide the date picker and reset date selection mode
                datePicker.classList.add('hidden');
                dateSelectionMode = false;
            }
        }
    });
});
