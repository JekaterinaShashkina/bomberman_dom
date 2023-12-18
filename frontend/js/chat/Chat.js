import WebSocketService from '../utils/websocket.js';
import { Message } from './Message.js';

export default class Chat {
    constructor(nickname) {
        this.chat = document.getElementById('chat-container');
        this.chatInput = document.getElementById('chat-input');
        this.chatForm = document.getElementById('chat-form');
        this.messagesDiv = document.getElementById('messages');
        this.webSocketService = new WebSocketService()
        this.webSocketService.connect()

        this.chatForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.sendMessage(nickname);
        });

        this.webSocketService.addMessageHandler(data => {
            console.log('Received data from server:', data);
            if (data.type === 'chat-message') {
                this.displayMessage(data.sender, data.content);
            }
        });
    }

    show() {
        this.chat.style.display = "block"
    }

    hide() {
        this.chat.style.display = "none"
    }

    sendMessage(nickname) {
        const messageContent = this.chatInput.value.trim();

        if (nickname === '') {
            console.error('Sender is undefined or null.');
            return;
        }

        if (messageContent) {
            const message = new Message(nickname, messageContent)

            this.webSocketService.send(message);
            this.chatInput.value = '';
        }
    }

    displayMessage(sender, text) {
        const messageElement = document.createElement('p');
        messageElement.textContent = `${sender}: ${text}`;
        this.messagesDiv.appendChild(messageElement);
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
        console.log(`Displaying message. Sender: ${sender}, Message: ${text}`);
    }
}
