class Message {
    constructor(sender, content) {
        this.sender = sender;   // Nickname of the sender
        this.content = content; // Message content
        this.timestamp = new Date().toISOString(); // Timestamp when the message was sent
    }
}

export { Message };
