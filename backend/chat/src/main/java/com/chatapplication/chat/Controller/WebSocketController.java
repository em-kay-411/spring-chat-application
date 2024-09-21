package com.chatapplication.chat.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.chatapplication.chat.Utility.Message;
import com.chatapplication.chat.Utility.MessageBody;
import com.chatapplication.chat.Utility.MessageType;

@Controller
public class WebSocketController {
    private Map<String, List<String>> rooms = new HashMap<>();
    private List<String> users = new ArrayList<>();

    @Autowired
    private SimpMessagingTemplate simpMessageCareer;

    public void setRooms(Map<String, List<String>> rooms) {
        this.rooms = rooms;
    }

    public Map<String, List<String>> getRooms() {
        return rooms;
    }


    @MessageMapping("/newUser")
    public void handleNewUser(Message message){
        // System.out.println(message.getUsername());
        users.add(message.getUsername());
        Set<String> roomNames = rooms.keySet();
        message.setMessageType(MessageType.ACK);
        simpMessageCareer.convertAndSend("/topic/" + message.getUsername(), roomNames);
    }


    @MessageMapping("/createRoom")
    public void createRoom(Message message){
        if(message.getMessageType().equals(MessageType.CREATEROOM)){
            // System.out.println(message.getMessageString());
            String roomName = message.getMessageString();
            rooms.put(roomName, new ArrayList<>());
            rooms.get(roomName).add(message.getUsername());
            message.setMessageType(MessageType.ACK);
            message.setMessageString("Created and connected to " + roomName);
            simpMessageCareer.convertAndSend("/topic/" + message.getUsername(), message);
            Set<String> roomNames = rooms.keySet();
            simpMessageCareer.convertAndSend("/topic/" + message.getUsername(), roomNames);
            return;
        }
        message.setMessageType(MessageType.ACK);
        message.setMessageString("Error");
        simpMessageCareer.convertAndSend("/topic/" + message.getUsername(), message);
    }

    @MessageMapping("/joinRoom")
    public void joinRoom(Message message){
        if(message.getMessageType().equals(MessageType.JOINROOM)){
            // System.out.println(message.getMessageString());
            String roomName = message.getMessageString();
            rooms.get(roomName).add(message.getUsername());
            message.setMessageType(MessageType.ACK);
            message.setMessageString("Connected to room " + roomName);
            simpMessageCareer.convertAndSend("/topic/" + message.getUsername(), message);
            return;
        }

        message.setMessageType(MessageType.ACK);
        message.setMessageString("Error");
        simpMessageCareer.convertAndSend("/topic/" + message.getUsername(), message);
    }

    @MessageMapping("/message")
    public void sendMessage(MessageBody messageBody){
        String room = messageBody.getMessageRoom();
        String text = messageBody.getMessageText();
        System.out.println(text);
        simpMessageCareer.convertAndSend("/topic/" + room, messageBody);
    }

}
