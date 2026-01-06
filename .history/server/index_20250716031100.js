<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>RajjoBot 💕</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      background: #fff0f3;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    header {
      text-align: center;
      padding: 1rem;
    }
    header h1 {
      margin: 0.5rem 0;
      font-size: 2rem;
      color: #d1006b;
    }
    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 4px solid #d1006b;
      margin: 1rem auto;
      background-image: url("rajjo.jpg");
      background-size: cover;
      background-position: center;
    }
    .chat-container {
      width: 100%;
      max-width: 600px;
      flex-grow: 1;
      background: white;
      border-radius: 20px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      padding: 1rem;
      overflow-y: auto;
      margin-bottom: 1rem;
      height: 60vh;
      display: flex;
      flex-direction: column;
    }
    .message-wrapper {
      display: flex;
      margin: 0.5rem 0;
    }
    .user-wrapper {
      justify-content: flex-end;
    }
    .bot-wrapper {
      justify-content: flex-start;
    }
    .message {
      padding: 0.7rem 1rem;
      border-radius: 18px;
      max-width: 70%;
      font-size: 0.95rem;
      line-height: 1.4;
      word-wrap: break-word;
    }
    .user {
      background-color: #e1e1e1;
      color: #333;
      border-radius: 18px 18px 0 18px;
    }
    .bot {
      background-color: #d1006b;
      color: #fff;
      border-radius: 18px 18px 18px 0;
    }
    .input-area {
      width: 100%;
      max-width: 600px;
      display: flex;
      padding: 0 1rem 1rem;
    }
    input {
      flex: 1;
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 12px;
    }
    button {
      padding: 0.75rem 1.25rem;
      background: #d1006b;
      color: white;
      border: none;
      border-radius: 12px;
      margin-left: 0.5rem;
      font-weight: bold;
      cursor: pointer;
      transition: 0.2s;
    }
    button:hover {
      background: #b8005c;
    }
    .modal {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background-color: rgba(0,0,0,0.6);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 999;
    }
    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 0 20px rgba(0,0,0,0.3);
    }
    .modal-content h2 { color: #d1006b; }

    .music-control {
      margin-bottom: 1rem;
    }

    .music-control button {
      margin: 0 0.3rem;
    }
    .typing-dots {
      display: inline-block;
    }
    .typing-dots span {
      animation: blink 1.4s infinite both;
      display: inline-block;
      font-size: 1.2rem;
    }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes blink {
      0% { opacity: 0.2; }
      20% { opacity: 1; }
      100% { opacity: 0.2; }
    }
  </style>
</head>
<body>
  <header>
    <h1>RajjoBot 💖</h1>
    <div class="avatar"></div>
    <p style="color:#555;">Hey baba, I’m always here when you need me 😘</p>
  </header>

  <div class="music-control">
    <button onclick="toggleMusic()" id="musicBtn">Pause Music 🎵</button>
    <button onclick="nextSong()">Next Song ⏭️</button>
  </div>

  <div class="chat-container" id="chatBox"></div>

  <div class="input-area">
    <input type="text" id="userInput" placeholder="Type your message..." />
    <button onclick="sendMessage()">Send</button>
  </div>

  <div class="modal" id="birthdayModal">
    <div class="modal-content">
      <h2>🎉 Happy Birthday Rajjo! 🎂</h2>
      <p>My love, even though I’m not there in person, I’m thinking about you every second today. 💖</p>
      <p>This is your special day, and I hope RajjoBot makes you smile like I always try to. </p>
      <button onclick="closeModal()">Aww thank you 🥹</button>
    </div>
  </div>

  <canvas id="confetti-canvas" style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;"></canvas>

  <audio id="musicPlayer" loop></audio>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <script>
    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const music = document.getElementById("musicPlayer");
    const musicBtn = document.getElementById("musicBtn");

    const songs = [
      "birthday-song.mp3",
      "punjabi-track1.mp3",
      "romantic-vibe.mp3"
    ];
    let currentSongIndex = 0;

    function playSong(index) {
      currentSongIndex = index % songs.length;
      music.src = songs[currentSongIndex];
      music.volume = 0.3;
      music.play().catch(() => {});
      musicBtn.innerText = "Pause Music 🎵";
    }

    function playRandomSong() {
      const index = Math.floor(Math.random() * songs.length);
      playSong(index);
    }

    function nextSong() {
      playSong(currentSongIndex + 1);
    }

    music.addEventListener("ended", nextSong);

    let messageHistory = JSON.parse(localStorage.getItem("rajjoHistory")) || [];
    let isBotTyping = false;

    function renderMessages() {
      chatBox.innerHTML = "";
      messageHistory.forEach((msg) => {
        const wrapper = document.createElement("div");
        wrapper.className = `message-wrapper ${msg.type}-wrapper`;

        const time = new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        wrapper.innerHTML = `
          <div class="message ${msg.type}">
            ${msg.text}
            <div style="font-size: 0.7rem; color: #888; margin-top: 4px;">
              ${msg.type === "bot" ? "RajjoBot • " : ""}${time}
              ${msg.type === "bot" ? "✓✓" : ""}
            </div>
          </div>`;
        chatBox.appendChild(wrapper);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function addMessage(type, text) {
      messageHistory.push({ type, text, time: new Date().toISOString() });
      localStorage.setItem("rajjoHistory", JSON.stringify(messageHistory));
      renderMessages();
    }

    function setLoadingState(loading) {
      isBotTyping = loading;
      if (loading) {
        addMessage("bot", `<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`);
      } else {
        messageHistory = messageHistory.filter(msg => !msg.text.includes("typing-dots"));
        localStorage.setItem("rajjoHistory", JSON.stringify(messageHistory));
        renderMessages();
      }
    }

    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message || isBotTyping) return;

      addMessage("user", message);
      userInput.value = "";
      setLoadingState(true);
      userInput.disabled = true;

      try {
        const res = await fetch("http://localhost:3000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });

        const data = await res.json();
        setLoadingState(false);
        addMessage("bot", data.reply);
      } catch (err) {
        setLoadingState(false);
        addMessage("bot", "Oops! Something went wrong 💔");
      } finally {
        userInput.disabled = false;
        resetHorSunao();
      }
    }

    userInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") sendMessage();
    });

    function toggleMusic() {
      if (music.paused) {
        music.play();
        musicBtn.innerText = "Pause Music 🎵";
      } else {
        music.pause();
        musicBtn.innerText = "Play Music 🎵";
      }
    }

    function closeModal() {
      document.getElementById("birthdayModal").style.display = "none";
    }

    function triggerBirthdayCelebration() {
      document.getElementById("birthdayModal").style.display = "flex";
      const duration = 6 * 1000;
      const end = Date.now() + duration;
      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }

    let horSunaoTimer;
    function resetHorSunao() {
      clearTimeout(horSunaoTimer);
      horSunaoTimer = setTimeout(() => {
        addMessage("bot", "HOR sunao 😄 I'm listening...");
      }, 45000);
    }

    // On page load
    window.addEventListener("load", () => {
      const today = new Date();
      const isBirthday = today.getDate() === 23 && today.getMonth() + 1 === 7;

      if (isBirthday) triggerBirthdayCelebration();
      playRandomSong();

      if (messageHistory.length === 0) {
        addMessage("bot", "Hi Rajjo! What’s on your mind today, love? 💬");
      } else {
        renderMessages();
      }
    });
  </script>
</body>
</html>
