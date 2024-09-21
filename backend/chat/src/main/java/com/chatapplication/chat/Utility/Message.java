package com.chatapplication.chat.Utility;

public class Message {
    private String username;
    private MessageType messageType;
    private String messageString;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public String getMessageString() {
        return messageString;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageString(String messageString) {
        this.messageString = messageString;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }
}
