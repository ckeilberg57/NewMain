document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const datePicker = document.getElementById('date-picker');
    const saveBtn = document.getElementById('save-btn');

    let chatBoxVisible = false;
    let dateSelectionMode = false;
    let appointmentBooked = false;

    userInput.addEventListener('input', function() {
        if (!chatBoxVisible && userInput.value.trim() !== '') {
            chatBox.classList.remove('hidden');
            chatBoxVisible = true;
        }
    });

    // Listen for the "Enter" key press
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevents the default action (e.g., form submission)
            sendBtn.click(); // Simulate a click on the "Send" button
        }
    });

    sendBtn.addEventListener('click', function() {
        const userMessage = userInput.value.trim();

        if (userMessage !== '') {
            appendMessage('You', userMessage);
            if (appointmentBooked) {
                handlePostBookingResponse(userMessage);
            } else {
                getBotResponse(userMessage);
            }
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
            botMessage = 'Great, let me work on scheduling your appointment. Can you please select a date and time for your appointment?';
            dateSelectionMode = true;

            // Show the bot's message and then show the date picker and save button
            appendMessage('Bot', botMessage);
            setTimeout(() => {
                datePicker.classList.remove('hidden');
                saveBtn.classList.remove('hidden');
            }, 500); // Slight delay to simulate bot response
            return; // Exit the function to avoid sending the message twice
        }

        setTimeout(() => appendMessage('Bot', botMessage), 500);
    }

    saveBtn.addEventListener('click', function() {
        if (dateSelectionMode) {
            const selectedDateTime = datePicker.value;
            if (selectedDateTime) {
                appendMessage('You', `Selected date and time: ${selectedDateTime}`);
                appendMessage('Bot', 'Your appointment is booked. Is there anything else I can assist with?');
                
                // Hide the date picker and save button
                datePicker.classList.add('hidden');
                saveBtn.classList.add('hidden');

                // Enable post-booking response handling
                dateSelectionMode = false;
                appointmentBooked = true;
            }
        }
    });

    function handlePostBookingResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();
        if (lowerCaseMessage.includes('yes')) {
            appendMessage('Bot', 'Learn more about labs.');
        } else if (lowerCaseMessage.includes('no')) {
            // Generate a random number for the consultation link
            const randomNumbers = Math.floor(100000 + Math.random() * 900000);
            const consultationLink = `https://example.com/webapp/m/ph${randomNumbers}/role=guest`;

            // Create the .ics file content
            const selectedDateTime = datePicker.value;
            const dateTime = new Date(selectedDateTime);
            const formattedDate = dateTime.toISOString().replace(/-|:|\.\d+/g, '');
            const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Your Product//EN
BEGIN:VEVENT
UID:${randomNumbers}
DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, '')}
DTSTART:${formattedDate}
DTEND:${formattedDate}
SUMMARY:Consultation with Provider
DESCRIPTION:Your consultation is booked. Use the following link: ${consultationLink}
URL:${consultationLink}
END:VEVENT
END:VCALENDAR`;

            // Create a Blob from the .ics content
            const blob = new Blob([icsContent], { type: 'text/calendar' });
            const icsUrl = URL.createObjectURL(blob);

            // Append the message and download link with the calendar icon
            appendMessage('Bot', `Please download your appointment here: <span style="display: flex; align-items: center;"><a href="${icsUrl}" download="consultation.ics"><img src="path_to_calendar_icon.png" alt="Calendar" style="width: 16px; height: 16px; margin-right: 5px;">Download .ics</a></span>`);

            // Reset appointment booking mode
            appointmentBooked = false;
        } else {
            appendMessage('Bot', "I'm sorry, I didn't catch that. Could you please answer 'yes' or 'no'?");
        }
    }
});
