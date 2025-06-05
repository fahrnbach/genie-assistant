// genie-assistant.js
import './styles.css';

export class GenieAssistant {
    constructor({ target = 'body', apiBaseUrl = '/api' } = {}) {
      this.target = document.querySelector(target);
      this.apiBaseUrl = apiBaseUrl;
      this.renderUI();
    }
  
    renderUI() {
      this.container = document.createElement('div');
      this.container.id = 'genie-chat';
      this.target.appendChild(this.container);
  
      this.chatBox = document.createElement('div');
      this.chatBox.classList.add('chat-box');
      this.container.appendChild(this.chatBox);
  
      this.inputField = document.createElement('input');
      this.inputField.type = 'text';
      this.inputField.placeholder = 'Speak your wish...';
      this.container.appendChild(this.inputField);
  
      this.responseBox = document.createElement('div');
      this.responseBox.classList.add('response-box');
      this.container.appendChild(this.responseBox);
  
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const question = this.inputField.value.trim();
          if (!question) return;
          this.handleInput(question);
        }
      });
    }
  
    async handleInput(question) {
      const verified = await this.verifyRiddle(question);
      if (!verified) {
        this.responseBox.innerHTML = "🧞‍♂️ Hmm... that answer doesn't seem quite right. Try again!";
        return;
      }
  
      const reply = await this.ask(question);
      this.renderResponse(reply);
    }
  
    async verifyRiddle(answer) {
      try {
        const res = await fetch(`${this.apiBaseUrl}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer })
        });
        const data = await res.json();
        return data.correct;
      } catch (error) {
        console.error('Verification error:', error);
        return false;
      }
    }
  
    async ask(prompt) {
      try {
        const res = await fetch(`${this.apiBaseUrl}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        return data.reply;
      } catch (error) {
        console.error('Ask error:', error);
        return "🧞‍♂️ Sorry, I couldn't understand that wish. Try again?";
      }
    }
  
    renderResponse(reply) {
      this.responseBox.innerHTML = reply;
    }
  }
  