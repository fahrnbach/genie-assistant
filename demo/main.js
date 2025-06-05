// demo/main.js
import { GenieAssistant } from '../src/genie-assistant';

const genie = new GenieAssistant({
  target: '#chat-wrapper',
  apiBaseUrl: 'http://localhost:3000' // matches your demo backend
});