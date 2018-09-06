const textInput = document.getElementById('textInput');
const chat = document.getElementById('chat');

let context = {};

const templateChatMessage = (message, from) => `
  <div class="from-${from}">
    <div class="message-inner">
      <p>${message}</p>
    </div>
  </div>
  `;

const InsertTemplateInTheChatandSpeak = (template,from) => {
  const div = document.createElement('div');
  div.innerHTML = template;
  if(from === 'watson') watsonSay(div.textContent); 

  chat.appendChild(div);
};

const getWatsonMessageAndInsertTemplate = async (text = '') => {
  const uri = 'watson/';

  const response = await (await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      context,
    }),
  })).json();

  context = response.context;

  const template = templateChatMessage(response.output.text, 'watson');
  
  InsertTemplateInTheChatandSpeak(template, 'watson');
};

const watsonSay = (text) => {
  responsiveVoice.speak(text, "Brazilian Portuguese Female");
}

textInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && textInput.value) {
    getWatsonMessageAndInsertTemplate(textInput.value);

    const template = templateChatMessage(textInput.value, 'user');
    InsertTemplateInTheChatandSpeak(template, 'user');
    
    textInput.value = '';
  }
});

getWatsonMessageAndInsertTemplate();
