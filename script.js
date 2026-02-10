// Load voices properly
let voices = [];
window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
};

// DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});

// Send message function
function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();
  if (!userText) return;

  addMessage("You", userText);
  input.value = "";

  fetch("https://smart-assist-chatbot.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userText })
  })
  .then(res => res.json())
  .then(data => {
    addMessage("Bot", data.reply);
    speakText(data.reply, "en-IN");
  })
  .catch(err => {
    console.error(err);
    addMessage("Bot", "⚠️ Server error. Try again.");
    speakText("Server error. Try again.");
  });
}

// Add message to chat
function addMessage(sender, text) {
  const chatArea = document.getElementById("chatArea");
  const msg = document.createElement("div");
  msg.innerHTML = `<b>${sender}:</b> ${text}`;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Speak text
function speakText(text, lang = "en-IN") {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = voices.find(v => v.lang === lang) || voices[0];
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.lang = lang;
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}
