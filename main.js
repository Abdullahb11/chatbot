import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("API key not found! Make sure you have a .env file with VITE_GEMINI_API_KEY");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Get DOM elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');

// Add loading indicator
let isLoading = false;

// Function to add message to chat
function addMessage(text, isUser) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to handle AI response
async function getAIResponse(userMessage) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: userMessage,
    });

    // Get the raw response text
    let result = response.text;

    // Clean it AFTER receiving from Gemini
    result = result
      .replace(/\*\*\*(.*?)\*\*\*/g, '$1')  // remove ***bold***
      .replace(/\*\*(.*?)\*\*/g, '$1')      // remove **bold**
      .replace(/\*(.*?)\*/g, '$1')          // remove *italic*
      .replace(/\n{2,}/g, '\n')             // collapse double newlines to single
      .replace(/^\s*[-•]\s*/gm, '  - ')     // standardize bullet points
      .trim();

    return result;

  } catch (error) {
    console.error("Error:", error.message);
    return "Sorry, I encountered an error. Please try again.";
  }
}

// Function to handle send button click
async function handleSend() {
  const message = userInput.value.trim();
  if (message && !isLoading) {
    // Clear input
    userInput.value = '';
    
    // Add user message to chat
    addMessage(message, true);
    
    // Show loading state
    isLoading = true;
    sendButton.disabled = true;
    sendButton.textContent = 'Loading...';
    
    // Get and display AI response
    const response = await getAIResponse(message);
    addMessage(response, false);
    
    // Reset loading state
    isLoading = false;
    sendButton.disabled = false;
    sendButton.textContent = 'Send';
  }
}

// Event listeners
sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSend();
  }
});
