import { useRef, useState } from "react";
import Message from "./components/Message";
import "./css/style.css";

function App() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socket = useRef();

  function connect(e) {
    e.preventDefault();
    socket.current = new WebSocket("ws://localhost:4000");

    socket.current.onopen = () => {
      socket.current.send(JSON.stringify({ username: name, isMessage: false }));
      setIsConnected(true);
    };

    socket.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages((prev) => [...prev, message]);
    };
  }

  function sendMessage(e) {
    e.preventDefault();
    socket.current.send(JSON.stringify({ message: text, isMessage: true }));
  }

  if (!isConnected) {
    return (
      <div className="container">
        <h1 className="title">Войти в чат</h1>
        <div>
          <p className="label">Ваше имя пользователя</p>
          <form onSubmit={connect} className="form">
            <input
              type="text"
              placeholder="Введите ваше имя пользователя"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input type="submit" value="Войти" className="submit" />
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container box">
      <div className="wrapper">
        <div className="header">
          <h1 className="title">Вы вошли как {name}</h1>
        </div>
        <div className="chat">
          <div className="message-list">
            {messages.map((item) =>
              item.isMessage ? (
                <Message
                  text={item.text}
                  senderName={item.senderName}
                  isOwner={item.senderName === name}
                />
              ) : (
                <div className="connect">{item.message}</div>
              )
            )}
          </div>
        </div>
        <div className="send">
          <p className="label">Ваше сообщение</p>
          <form className="form" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Введите ваше сообщение"
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input type="submit" value="Отправить" className="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
