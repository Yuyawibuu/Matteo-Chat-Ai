
        // Konfigurasi API
        const API_KEY = "AIzaSyCT8DMom0zqPS7yEu9Kktirt2yhYkBLUNE";
        const MODEL = "gemini-1.5-flash";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
        
        // Elemen DOM
        const chatContainer = document.getElementById('chatContainer');
        const userInput = document.getElementById('userInput');
        const sendButton = document.getElementById('sendButton');
        const typingIndicator = document.getElementById('typingIndicator');
        
        // Fungsi untuk menambahkan pesan ke chat
        function addMessage(content, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
            
            const messageWithPic = document.createElement('div');
            messageWithPic.className = 'message-with-pic';
            
            if (isUser) {
                const userPic = document.createElement('div');
                userPic.className = 'user-profile-pic';
                userPic.innerHTML = '<i class="fas fa-user"></i>';
                messageWithPic.appendChild(createMessageContent(content, isUser));
                messageWithPic.appendChild(userPic);
            } else {
                const aiPic = document.createElement('img');
                aiPic.src = 'https://media.tenor.com/HqD7fs6lHYAAAAAe/thomas-shelby-cat.png';
                aiPic.alt = 'Thomas Shelby Cat';
                aiPic.className = 'profile-pic';
                messageWithPic.appendChild(aiPic);
                messageWithPic.appendChild(createMessageContent(content, isUser));
            }
            
            messageDiv.appendChild(messageWithPic);
            chatContainer.appendChild(messageDiv);
            
            // Scroll ke bawah
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        
        // Fungsi untuk membuat konten pesan
        function createMessageContent(content, isUser) {
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            
            const messageInfo = document.createElement('div');
            messageInfo.className = 'message-info';
            
            if (isUser) {
                messageInfo.innerHTML = '<i class="fas fa-user"></i><span style="margin-left: 6px;">Anda</span>';
            } else {
                messageInfo.innerHTML = '<i class="fas fa-robot"></i><span style="margin-left: 6px;">Matteo AI</span>';
            }
            
            messageContent.appendChild(messageInfo);
            messageContent.appendChild(document.createTextNode(content));
            
            return messageContent;
        }
        
        // Fungsi untuk menampilkan indikator mengetik
        function showTypingIndicator() {
            typingIndicator.style.display = 'block';
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        
        // Fungsi untuk menyembunyikan indikator mengetik
        function hideTypingIndicator() {
            typingIndicator.style.display = 'none';
        }
        
        // Fungsi untuk mendapatkan respons dari Gemini API
        async function getAIResponse(prompt) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            role: "user",
                            parts: [{
                                text: prompt
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
            
            // Tampilkan indikator mengetik
            showTypingIndicator();
            
            // Dapatkan respons AI
            const aiResponse = await getAIResponse(message);
            
            // Sembunyikan indikator mengetik
            hideTypingIndicator();
            
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
        
        // Mencegah zoom pada input focus (untuk iOS)
        document.addEventListener('touchstart', function() {}, {passive: true});
    