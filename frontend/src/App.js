import './App.css';
import { useState } from 'react';
import { Client } from '@stomp/stompjs';
let client;

function App() {

  const [username, setUsername] = useState('');
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
  const [createRoomName, setCreateRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState();
  const [message, setMessage] = useState('');

  const initialiseConnections = () => {
    client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => {
        console.log('connected');
        client.subscribe('/topic/common', message => () => {
          console.log(`Received: ${message.body}`);
        }
        );

        client.subscribe(`/topic/${username}`, message => {
          const response = JSON.parse(message.body);
          if (response.messageType !== 'ACK') {
            setRooms(response);
          }
        });

        client.publish({ destination: '/app/newUser', body: JSON.stringify({ messageType: 'NEWUSER', messageString: `${username}`, username: username }) });


      },
      onWebSocketError: () => {
        console.log('Error with the websocket');
      },
      onStompError: () => {
        console.log('Stomp error');
      },
      onDisconnect: () => {
        console.log('Disconnected');
      }
    });

    client.activate();
  }

  const handleRoomJoin = (room) => {
    client.unsubscribe(`/topic/${room}`);
    console.log(client);
    const messageBody = { messageType: 'JOINROOM', messageString: `${room}`, username: username }
    client.publish({ destination: `/app/joinRoom`, body: JSON.stringify(messageBody) });
    setRoom(room);
    setMessages([]);
    client.subscribe(`/topic/${room}`, message => {
      console.log('Received message', message.body);
      const response = JSON.parse(message.body);
      setMessages(prevState => [{username: response.messageSender, messageText: response.messageText}, ...prevState]);
    });
  }

  const handleRoomCreate = () => {
    const messageBody = { messageType: 'CREATEROOM', messageString: `${createRoomName}`, username: username };
    client.publish({ destination: '/app/createRoom', body: JSON.stringify(messageBody) });
    client.subscribe(`topic/${createRoomName}`, message => {
      const response = JSON.parse(message.body);
      setMessages(prevState => [{username: response.messageSender, messageText: response.messageText}, ...prevState]);
    });
    setCreateRoomName('');
  }

  const handleSubmitClick = () => {
    if (username === '') {
      return;
    }

    setSubmitButtonClicked(true);
    initialiseConnections();
  }

  const handleSendMessage = () => {
    const messageBody = {messageText : message, messageRoom : room, messageSender : username};
    console.log(messageBody);
    client.publish({destination : `/app/message`, body : JSON.stringify(messageBody)});
    setMessage('');
  } 

  return (
    <div className="App">
      {!submitButtonClicked && <div className="input-field">
        <label htmlFor="">Enter username</label>
        <input type="text" onChange={(event) => setUsername(event.target.value)} />
        <button onClick={handleSubmitClick}>Submit</button>
      </div>}
      {submitButtonClicked && <div className="input-room-field">
        <label>Create a new room</label>
        <input type="text" onChange={(event) => setCreateRoomName(event.target.value)} />
        <button onClick={handleRoomCreate}> Enter Room </button>
      </div>}
      <div className="main-body">
        {rooms.length > 0 ? (<div className="rooms-list">
          <h1 style={{ textAlign: 'left' }}>Rooms Available</h1>
          {rooms.map(room =>
            (<div key={room} className="room-name" onClick={() => handleRoomJoin(room)}>{room}</div>)
          )}
        </div>) : 
        (<h2 style={{color:'grey'}}>No rooms available. Start by createing one</h2>)
        }
        {submitButtonClicked && <div className="message-box">
          <div className="messages">
            {messages.map((message) => (
              <div className="message" style={{backgroundColor : `${message.username === username ? '#616161' : '#a9a8a8'}`,
                left : `${message.username === username ? '55%' : '2%'}`
                }}>
                <div className="message-username" >
                  {message.username}
                </div>
                <div className="message-text">
                  {message.messageText}
                </div>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input type="text" className='message-input-text' placeholder='Type your message' onChange={(event) => setMessage(event.target.value)} value={message} />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>}
      </div>
    </div>
  );
}

export default App;
