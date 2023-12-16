import { timer } from '../utils/timer.js';
import webSocketService from '../utils/websocket.js';

document.addEventListener('DOMContentLoaded', function () {
  // Connect to WebSocket
  webSocketService.connect();

  // Reference important DOM elements
  const joinButton = document.getElementById('join-button');
  const nicknameInput = document.getElementById('nickname-input');
  const playerCounter = document.getElementById('player-count');
  const countdownElement = document.getElementById('countdown');
  const elem = document.querySelector('.wait__players');

  // When the "Join Game" button is clicked
  joinButton.addEventListener('click', () => {
    if (playerCounter >= 2 && playerCounter < 4) {
      timer(elem);
    }
    const nickname = nicknameInput.value.trim();
    if (nickname.length === 0) {
      alert('Please enter a nickname!');
      return;
    }

    webSocketService.send({
      type: 'join-game',
      nickname: nickname,
    });

    joinButton.disabled = true;
    joinButton.innerText = 'Joining...';
  });

  // Handle incoming WebSocket messages
  webSocketService.addMessageHandler((data) => {
    switch (data.type) {
      case 'update-player-count':
        playerCounter.innerHTML = data.count;
        break;

      case 'update-countdown':
        countdownElement.innerText = `${data.time} seconds`;
        break;

      case 'joined-successfully':
        joinButton.innerText = 'Joined! Waiting...';
        playerID = data.playerID
        console.log(playerID)
        break;

      case 'join-error':
        joinButton.disabled = false;
        joinButton.innerText = 'Join Game';
        alert(data.message || 'Error joining game');
        break;

      case 'game-start':
        // board = data.map;
        // ! карта передается успешно но не рендерится
        // const b = data.map;
        // console.log('come', b);
        // renderBoard(data);
        window.location.href = '/game';
        break;
    }
  });
});
