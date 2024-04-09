import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";

const wss = new WebSocketServer({ port: 4000 });
const users = {};

wss.on("connection", (ws) => {
  ws.userId = uuid();
  ws.on("message", (rawMessage) => {
    const parsedMessage = JSON.parse(rawMessage);

    if (parsedMessage.isMessage) {
      notifyAllClients({
        text: parsedMessage.message,
        senderName: users[ws.userId],
        isMessage: true,
      });
    } else {
      users[ws.userId] = parsedMessage.username;
      notifyAllClients({
        message: `Пользователь ${users[ws.userId]} подключился`,
        isMessage: false,
      });
    }
  });

  ws.on("close", () => {
    notifyAllClients({
      message: `Пользователь ${users[ws.userId]} вышел из чата`,
    });
    delete users[ws.userId];
  });
});

function notifyAllClients(data) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(data));
  });
}

console.log("WebSocketServer is running on port 4000");
