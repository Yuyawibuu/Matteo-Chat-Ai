
    // Konfigurasi API
    const GEMINI_KEY = "AIzaSyCT8DMom0zqPS7yEu9Kktirt2yhYkBLUNE";
    const MODEL = "gemini-1.5-flash";
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`;

    const NEWSAPI_KEY = "3f031b3ab3664ed488854fe67d14a600";
    const NEWSAPI_URL = `https://newsapi.org/v2/everything?q=presiden+Indonesia&sortBy=publishedAt&apiKey=${NEWSAPI_KEY}`;

    // Elemen DOM
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // Fungsi untuk menambahkan pesan ke chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

        if (isUser) {
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            messageContent.style.marginLeft = 'auto';
            messageContent.style.borderBottomLeftRadius = '18px';
            messageContent.style.borderBottomRightRadius = '5px';

            const messageInfo = document.createElement('div');
            messageInfo.className = 'message-info';
            messageInfo.innerHTML = '<i class="fas fa-user"></i><span style="margin-left: 8px;">Anda</span>';
            messageInfo.style.justifyContent = 'flex-end';
            messageInfo.style.color = 'rgba(255, 255, 255, 0.9)';

            messageContent.appendChild(messageInfo);
            messageContent.appendChild(document.createTextNode(content));
            messageDiv.appendChild(messageContent);
        } else {
            const messageWithPic = document.createElement('div');
            messageWithPic.className = 'message-with-pic';

            const aiPic = document.createElement('img');
            aiPic.src = 'https://media.tenor.com/HqD7fs6lHYAAAAAe/thomas-shelby-cat.png';
            aiPic.alt = 'Matteo AI';
            aiPic.className = 'profile-pic';

            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';

            const messageInfo = document.createElement('div');
            messageInfo.className = 'message-info';
            messageInfo.innerHTML = '<i class="fas fa-robot"></i><span style="margin-left: 8px;">Matteo AI</span>';

            messageContent.appendChild(messageInfo);
            messageContent.appendChild(document.createTextNode(content));

            messageWithPic.appendChild(aiPic);
            messageWithPic.appendChild(messageContent);
            messageDiv.appendChild(messageWithPic);
        }

        chatContainer.appendChild(messageDiv);

        // Scroll ke bawah
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);
    }

    // Fungsi ambil berita terbaru dari NewsAPI
    async function getLatestNews() {
        try {
            const res = await fetch(NEWSAPI_URL);
            const data = await res.json();
            if (data.articles && data.articles.length > 0) {
                // Ambil 3 berita saja
                return data.articles.slice(0, 3).map(n => `Judul: ${n.title}\nDeskripsi: ${n.description}`).join("\n\n");
            }
            return "Tidak ada berita terbaru yang ditemukan.";
        } catch (err) {
            console.error("Error ambil berita:", err);
            return "Gagal mengambil berita.";
        }
    }

    // Fungsi untuk mendapatkan respons dari Gemini API
    async function getAIResponse(prompt) {
        try {
            // Ambil berita dulu
            const newsContext = await getLatestNews();

            const response = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{
                            text: `Berita terbaru tentang presiden Indonesia:\n${newsContext}\n\nPertanyaan user: ${prompt}\n\nJawablah berdasarkan berita di atas jika relevan.`
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Respons tidak valid dari API');
            }
        } catch (error) {
            console.error('Error:', error);
            return "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
        }
    }

    // Fungsi untuk menangani pengiriman pesan
    async function handleSendMessage() {
        const message = userInput.value.trim();

        if (!message) return;

        // Tambahkan pesan pengguna
        addMessage(message, true);
        userInput.value = '';

        // Dapatkan respons AI
        const aiResponse = await getAIResponse(message);

        // Tambahkan respons AI
        addMessage(aiResponse);
    }

    // Event listeners
    sendButton.addEventListener('click', handleSendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Fokus pada input saat halaman dimuat
    window.addEventListener('load', () => {
        userInput.focus();
    });




