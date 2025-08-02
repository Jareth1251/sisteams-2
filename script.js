let cart = [];
let currentIndex = 0;
let carouselInterval;

function addToCart(nombre, precio) {
  cart.push({ nombre, precio });
  updateCartCount();
}

function updateCartCount() {
  document.getElementById("cart-count").innerText = cart.length;
}

function generateQuote() {
  const container = document.getElementById("quote-container");
  const tbody = document.getElementById("quote-table").querySelector("tbody");
  const totalEl = document.getElementById("total-price");
  const dateEl = document.getElementById("quote-date");

  if (cart.length === 0) {
    alert("No hay productos en el carrito.");
    return;
  }

  // Fecha actual
  const fecha = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  dateEl.innerText = fecha;

  tbody.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item.nombre}</td><td>$${item.precio} MXN</td>`;
    tbody.appendChild(row);
    total += item.precio;
  });

  totalEl.innerText = `Total: $${total} MXN`;
  container.style.display = "block";
}

function printQuote() {
  printJS({
    printable: 'quote-content',
    type: 'html',
    header: 'Cotización de Vinilos - JARETH\'S SOUND',
    style: `
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      h4 { text-align: right; font-size: 16px; margin-top: 10px; }
      p { font-size: 14px; margin-bottom: 10px; }
    `
  });
}

// Carrusel
function moveCarousel(direction) {
  const track = document.querySelector('.carousel-track');
  const items = document.querySelectorAll('.carousel-item');
  const totalItems = items.length;

  currentIndex = (currentIndex + direction + totalItems) % totalItems;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function startCarouselAutoplay() {
  carouselInterval = setInterval(() => {
    moveCarousel(1);
  }, 5000);
}

function stopCarouselAutoplay() {
  clearInterval(carouselInterval);
}

window.addEventListener('DOMContentLoaded', () => {
  startCarouselAutoplay();

  document.querySelector('.carousel-button.prev').addEventListener('click', () => {
    stopCarouselAutoplay();
    moveCarousel(-1);
  });

  document.querySelector('.carousel-button.next').addEventListener('click', () => {
    stopCarouselAutoplay();
    moveCarousel(1);
  });
});


// ------------------------------
// Chatbox Lógica
// ------------------------------
function toggleChat() {
  const chat = document.getElementById("chat-container");
  chat.classList.toggle("hidden");
}

function sendMessage() {
  const input = document.getElementById("chat-text");
  const msg = input.value.trim();
  if (msg === "") return;

  const chat = document.getElementById("chat-messages");
  const userMessage = document.createElement("div");
  userMessage.innerHTML = `<strong>Tú:</strong> ${msg}`;
  chat.appendChild(userMessage);
  input.value = "";

  setTimeout(() => {
    const reply = getBotReply(msg);
    const botMessage = document.createElement("div");
    botMessage.innerHTML = `<strong>Bot:</strong> ${reply}`;
    chat.appendChild(botMessage);
    chat.scrollTop = chat.scrollHeight;
  }, 500);
}

function handleChatKey(event) {
  if (event.key === "Enter") sendMessage();
}

function getBotReply(userMessage) {
  const m = userMessage.toLowerCase();

  if (m.includes("hola")) return "¡Hola! ¿En qué puedo ayudarte?";

  if (m.includes("pdf")) {
    return `
      Aquí tienes el catálogo en PDF: <br />
      <button onclick="window.open('catalogo.pdf', '_blank')" style="margin-top:5px; background:#198754; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">📄 Ver PDF</button>
    `;
  }

  if (m.includes("cotización")) {
    return `
      Para generar tu cotización haz clic aquí: <br />
      <button onclick="generateQuote()" style="margin-top:5px; background:#198754; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">🧾 Generar Cotización</button>
    `;
  }

  if (m.includes("precio")) return "Puedes ver los precios en la sección de vinilos 🎵.";

  return "Lo siento, no entendí eso. Puedes escribir: <br>• 'pdf'<br>• 'cotización'<br>• 'precio'";
}
