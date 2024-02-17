import { twind, cssom, observe } from '@twind/core';
import 'construct-style-sheets-polyfill';

import '../../styles/main.css';
import config from './twind.config';

import '../../lang';

import { getKeyFromLocalStorage } from '../../utils';

// https://twitter.com/benalphamoon/status/1755004956917039450

const shadow = document.createElement('div');
shadow.id = 'shadow';
const shadowRoot = shadow.attachShadow({ mode: 'open' });

// set up twind
const sheet = cssom(new CSSStyleSheet());
const tw = twind(config, sheet);

// link sheet target to shadow dom root
shadowRoot.adoptedStyleSheets = [sheet.target];
observe(tw, shadowRoot);

// add fonts
(async () => {
  const yallaURL = await fetch(chrome.runtime.getURL('yalla.woff2'));
  const satoshiURL = await fetch(chrome.runtime.getURL('Satoshi-Medium.woff2'));

  const fontFaceYalla = new FontFace('Yalla', `url(${yallaURL.url})`);
  document.fonts.add(fontFaceYalla);

  const fontFaceSatoshi = new FontFace('Satoshi', `url(${satoshiURL.url})`);
  document.fonts.add(fontFaceSatoshi);
})();

const TrollHelper = {
  url: '',
  buttonAdded: false,
  replyContent: '',
  replyContentSet: false,
  username: '',

  thinkingTexts: [
    'Just a moment',
    "Hang tight, I'm on it",
    'Hold on, magic in progress',
    'Brace yourself',
    'Conjuring up something special',
    'Designing your wow moment',
    'Polishing a gem of a response',
    'Stitching together something spectacular.',
    'Cooking',
  ],

  init() {
    console.log('TrollHelper.checkPageLoad');
    TrollHelper.checkPageLoad();
  },

  addButton() {
    if (TrollHelper.buttonAdded || !TrollHelper.url.includes('/status/')) {
      return;
    }

    // determine username from profile link
    if (TrollHelper.username === '') {
      const profileLink = document.querySelector(
        'a[data-testid="AppTabBar_Profile_Link"]'
      );
      if (profileLink) {
        TrollHelper.username = profileLink.getAttribute('href').slice(1);
      }
    }

    const toolBar = document.querySelector('div[data-testid="toolBar"]');
    if (!toolBar) {
      setTimeout(() => {
        console.log('settimeout');
        TrollHelper.addButton();
      }, 1000);

      return;
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'relative';
    contentWrapper.innerHTML =
      `
      <button id="troll-button" 
          class="rounded-full bg-purple-600 px-4 py-2.5 text-sm 
      font-semibold text-white shadow-sm hover:bg-purple-500 
      focus-visible:outline focus-visible:outline-2 
      focus-visible:outline-offset-2 focus-visible:outline-purple-600">Troll</button>
      <div class="troll-message-box flex flex-row
          invisible absolute top-full mt-4 -left-20 
          bg-white/75 text-slate-700 p-4 shadow-xl rounded w-80
          ring-offset-2 ring-2 ring-purple-600 ring-offset-transparent">
          <div class="message-content grow"></div>
          <div class="pl-3">
              <img src="` +
      chrome.runtime.getURL('sticker.gif') +
      `" width="64" height="64" />
          </div>
      </div>
      `;

    const replyButton = document.querySelector(
      'div[data-testid="tweetButtonInline"]'
    );
    replyButton.parentNode.insertBefore(contentWrapper, replyButton);

    const trollButton = document.getElementById('troll-button');

    trollButton.addEventListener('click', TrollHelper.trollButtonClickHandler);

    TrollHelper.buttonAdded = true;
  },

  async trollButtonClickHandler() {
    console.log('getTweetText');
    const messageBox = document.querySelector('div.troll-message-box');
    messageBox.classList.replace('invisible', 'visible');

    var tweetTextDiv = document.querySelector('div[data-testid="tweetText"]');
    if (!tweetTextDiv) {
      console.log('could not identify tweet content');
      return;
    }

    TrollHelper.generateReply(tweetTextDiv.textContent, messageBox);
    // TrollHelper.generateReplyTest(messageBox);
  },

  async generateReply(tweetText, messageBox) {
    TrollHelper.setThinkingPlaceholder(messageBox);
    chrome.runtime.sendMessage(
      {
        action: 'generateReply',
        tweetText: tweetText,
        url: TrollHelper.url,
        username: TrollHelper.username,
        walletAddress: await getKeyFromLocalStorage('walletAddress'),
      },
      function (response) {
        console.log('receive response', response);
        if (response && response.error) {
          console.log('errors from the API', response.error);
          return;
        }

        TrollHelper.writeToClipboard(response.reply);
        TrollHelper.replyContentSet = true;
        TrollHelper.replyContent = response.reply;
        TrollHelper.setPasteInstructionsPlaceholder(messageBox);
        TrollHelper.watchForPaste();
      }
    );
  },

  generateReplyTest(messageBox) {
    const testMessage = 'testing clip';

    TrollHelper.setThinkingPlaceholder(messageBox);
    TrollHelper.writeToClipboard(testMessage);
    TrollHelper.replyContentSet = true;
    TrollHelper.replyContent = testMessage;
    TrollHelper.setPasteInstructionsPlaceholder(messageBox);
    TrollHelper.watchForPaste();
  },

  watchForPaste() {
    if (!TrollHelper.replyContentSet) {
      return;
    }

    const replyArea = document.querySelector(
      'div[data-testid="tweetTextarea_0"]'
    );
    if (replyArea.textContent == TrollHelper.replyContent) {
      console.log('"matches!!');
      TrollHelper.submitReply();
      return;
    }

    setTimeout(() => {
      console.log('watchForPaste settimeout');
      TrollHelper.watchForPaste();
    }, 500);
  },

  submitReply() {
    var button = document.querySelector('div[data-testid="tweetButtonInline"]');
    console.log('button', button);
    if (!button) {
      return;
    }

    var event = new MouseEvent('click', {
      bubbles: true, // Event will bubble up through the DOM
      cancelable: true, // Event can be canceled
    });
    button.dispatchEvent(event);
  },

  setThinkingPlaceholder(messageBox) {
    const randomIndex = Math.floor(
      Math.random() * TrollHelper.thinkingTexts.length
    );

    // const placeholder = document.querySelector('div.public-DraftEditorPlaceholder-inner');
    const messageContent = messageBox.querySelector('.message-content');
    messageContent.textContent = TrollHelper.thinkingTexts[randomIndex];
  },

  setPasteInstructionsPlaceholder(messageBox) {
    const placeholder = document.querySelector(
      'div.public-DraftEditorPlaceholder-inner'
    );
    placeholder.textContent = 'Paste your troll here!!';

    const messageContent = messageBox.querySelector('.message-content');
    messageContent.textContent =
      'Reply added to clipboard, paste it and click Reply to earn $TROLLANA!!';
  },

  postReply(reply) {
    console.log('postReply', reply);
    // // remove placeholder
    // var placeholder = document.querySelector('div.public-DraftEditorPlaceholder-root');
    // if (placeholder) {
    //     console.log('remoev placeholder');
    //     placeholder.remove();
    // }

    // var brElement = document.querySelector('br[data-text="true"]');
    // if (brElement) {
    //     console.log('replace br with span');
    //     // Create a new span element
    //     var spanElement = document.createElement('span');

    //     // Copy the data-text attribute from the br element to the span element
    //     var dataText = brElement.getAttribute('data-text');
    //     if (dataText) {
    //         spanElement.setAttribute('data-text', dataText);
    //     }

    //     // Replace the br element with the new span element
    //     brElement.replaceWith(spanElement);
    // }

    // var br = document.querySelector('br[data-text="true"]');
    // console.log('br focus');
    // br.focus();

    // Find the reply text area and set the API's reply
    // const replyArea = document.querySelector('span[data-text="true"]');
    // const replyArea = document.querySelector('br[data-text="true"]');
    const replyArea = document.querySelector(
      'div[data-testid="tweetTextarea_0"]'
    );
    if (!replyArea) {
      console.log('no replyArea found');
      return;
    }

    TrollHelper.writeToClipboard('testing clip');
    return;

    // simulateTyping3(replyArea, "a");
    let keyChar = 'a';
    const keyboardEventInit = {
      bubbles: false,
      cancelable: false,
      composed: false,
      key: '',
      code: '',
      location: 0,
    };
    replyArea.dispatchEvent(new KeyboardEvent('keydown', keyboardEventInit));
    replyArea.textContent = keyChar;
    replyArea.dispatchEvent(new KeyboardEvent('keyup', keyboardEventInit));
    replyArea.dispatchEvent(new Event('change', { bubbles: true })); // usually not needed
    return;

    // submit the reply
    var button = document.querySelector('div[data-testid="tweetButtonInline"]');
    console.log('button', button);
    if (!button) {
      return;
    }

    // console.log('submit reply');
    // var event = new MouseEvent('click', {
    //     bubbles: true, // Event will bubble up through the DOM
    //     cancelable: true // Event can be canceled
    // });
    // button.dispatchEvent(event);
  },

  writeToClipboard(text) {
    navigator.clipboard.writeText(text).then(
      function () {
        console.log('Clipboard successfully set');
      },
      function (err) {
        console.error('Could not write to clipboard: ', err);
      }
    );
  },

  checkPageLoad() {
    if (TrollHelper.url !== window.location.href) {
      TrollHelper.url = window.location.href;
      TrollHelper.buttonAdded = false;
      TrollHelper.addButton();
    }

    setTimeout(() => {
      TrollHelper.checkPageLoad();
    }, 1000);
  },
};

TrollHelper.init();

console.log('content loaded');
