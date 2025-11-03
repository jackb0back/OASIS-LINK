const messageBox = $("#messageTextBox");
const messageList = $("#messageList");

messageBox.on("input", () => resize_messageInput(messageBox[0]));
messageBox.on("keydown", handleMessageKeypress);

function resize_messageInput(element,onblur) { 
  if (element.value == "" || onblur == true) { 
    element.style.height = "30px"; 
  }else { 
    element.style.height = "0px"; 
    // console.log(element.scrollHeight - 20) 
    element.style.height = (element.scrollHeight - 20) + "px"; 
  } 
  $("#messageBar").height(70 + $(element).height() - 30) 
}


function handleMessageKeypress(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    const raw = messageBox.val();
    const cleaned = cleanMessage(raw);
    if (!cleaned.replace(/\s+/g, "").length) return; // still empty? skip
    sendMessage("gurt", cleaned);
    messageBox.val("");
    resize_messageInput(messageBox[0]);
  }
}

function cleanMessage(text) {
  return text
    .replace(/[ \t]+/g, " ")     // collapse multiple spaces/tabs into one
    .replace(/\n{3,}/g, "\n\n")  // limit 3+ newlines down to 2
    .trim();                     // remove leading/trailing whitespace
}

function sendMessage(author, text) {
  const msg = { author, body: parseMessage(text), timestamp: getTimestamp() };
  renderMessage(msg);
}

function parseMessage(text) {
  // Escape HTML to prevent injection
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\n/g, "<br>");
}

function renderMessage({ author, body, timestamp }) {
  const message = document.createElement("div");
  message.className = "message";
  message.innerHTML = `
    <span class="message-timestamp">${timestamp}</span>
    <span class="message-user">[${author}]</span>
    <p class="message-body">${body}</p>
  `;
  messageList.append(message);
  messageList.scrollTop(messageList[0].scrollHeight);
}

function getTimestamp(format = "time") {
  const now = new Date();
  const pad = n => n.toString().padStart(2, "0");
  let hours = now.getHours();
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = pad(hours % 12 || 12);
  const date = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()}`;
  const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  switch (format) {
    case "date": return date;
    case "week": return `${weekdays[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}`;
    default: return `${hours}:${minutes}:${seconds} ${ampm}`;
  }
}
