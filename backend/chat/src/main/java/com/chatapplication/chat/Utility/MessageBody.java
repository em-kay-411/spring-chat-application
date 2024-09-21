package com.chatapplication.chat.Utility;

public class MessageBody {
    private String messageText;
    private String messageRoom;
    private String messageSender;

    public String getMessageRoom() {
        return messageRoom;
    }

    public String getMessageSender() {
        return messageSender;
    }

    public void setMessageSender(String messageSender) {
        this.messageSender = messageSender;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageRoom(String messageRoom) {
        this.messageRoom = messageRoom;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }
}
