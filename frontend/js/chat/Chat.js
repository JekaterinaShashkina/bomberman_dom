import frame from '../../framework/framework.js';
import WebSocketService from '../utils/Websocket.js';
import { Message } from './Message.js';

export default class Chat {
    constructor(nickname) {
        this.chat = document.getElementById('chat-container');
        const elements = this.createChatElements(this.chat)
        this.chatInput = elements.chatInput;
        this.chatForm = elements.chatForm
        this.messagesDiv = elements.messagesDiv

        this.webSocketService = new WebSocketService()
        this.webSocketService.connect()

        this.chatForm.submit((event) => {
            event.preventDefault();
            this.sendMessage(nickname);
        });

        this.webSocketService.addMessageHandler(data => {
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

    createChatElements(container) {
        const chatInput = frame.createInput({
            type: 'text',
            id: 'chat-input',
            placeholder: 'Type your message...'
        })

        const chatForm = frame.createForm({
            id: 'chat-form'
        },
            chatInput,
            frame.createButton({
                type: 'submit',
                id: 'send-button',
            }, "Send")
        )

        const messagesDiv = frame.createDiv({
            id: 'messages'
        })

        container.append(
            messagesDiv,
            frame.createDiv({
                id: 'chat-input-container'
            },
                chatForm,
            )
        )

        return {
            chatInput: chatInput,
            chatForm: chatForm,
            messagesDiv: messagesDiv,
        }
    }
}
