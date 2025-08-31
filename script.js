// Konfigurasi API
        const API_KEY = "AIzaSyCT8DMom0zqPS7yEu9Kktirt2yhYkBLUNE";
        const MODEL = "gemini-1.5-flash";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
        
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
