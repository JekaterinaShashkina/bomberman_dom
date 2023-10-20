import { Message } from './message.js';
import webSocketService from '../utils/websocket.js';

class Chat {
    constructor(chatInput, chatForm, messagesDiv) {
        this.messages = [];
        this.chatInput = chatInput;
        this.chatForm = chatForm;
        this.messagesDiv = messagesDiv;

        this.chatInput.addEventListener('input', (e) => {
            console.log('Input field changed:', e.target.value);
        });

        webSocketService.addMessageHandler(data => {
            console.log('Received data from server:', data);
            if (data.type === 'chat-message') {
                this.displayMessage(data.sender, data.text);
            }
        });
    }

    getCurrentUser() {
        const user = "John"; 
        console.log("Current User:", user);
        return user;
    }

    sendMessage() {
        console.log('Value of chatInput at sendMessage start:', this.chatInput.value);
        const sender = this.getCurrentUser();
        const messageContent = this.chatInput.value.trim();
        
        if (!sender) {
            console.error('Sender is undefined or null.');
            return;
        }
    
        if (messageContent) {
            const message = new Message(sender, messageContent);
            this.messages.push(message);
            const nicknameValue = "John"; 
            const payload = {
                type: 'chat-message',
                text: messageContent,
                nickname: nicknameValue
            };
            
            console.log('About to send message:', payload);
            webSocketService.send(payload);
            
            this.displayMessage(nicknameValue, messageContent);
            this.chatInput.value = '';
        } 
    }

    displayMessage(sender, text) {
        const messageElement = document.createElement('p');
        messageElement.textContent = `${sender}: ${text}`;
        this.messagesDiv.appendChild(messageElement);
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
        console.log(`Displaying message in DOM. Sender: ${sender}, Message: ${text}`);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const chatInput = document.getElementById('chat-input');
    const chatForm = document.getElementById('chat-form');
    const messagesDiv = document.getElementById('messages');

    const chat = new Chat(chatInput, chatForm, messagesDiv);

    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Form submitted!');
        chat.sendMessage();
    });

    console.log(chat);
});
