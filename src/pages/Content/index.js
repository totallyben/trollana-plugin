import { twind, cssom, observe } from '@twind/core';
import 'construct-style-sheets-polyfill';

import '../../styles/main.css';
import config from './twind.config';

import '../../lang';

import { getKeyFromLocalStorage } from '../../utils';

// https://twitter.com/benalphamoon/status/1755004956917039450

// const shadow = document.createElement('div');
// shadow.id = 'shadow';
// const shadowRoot = shadow.attachShadow({ mode: 'open' });

// // set up twind
// const sheet = cssom(new CSSStyleSheet());
// const tw = twind(config, sheet);

// // link sheet target to shadow dom root
// shadowRoot.adoptedStyleSheets = [sheet.target];
// observe(tw, shadowRoot);

// // add fonts
// (async () => {
//   const yallaURL = await fetch(chrome.runtime.getURL('yalla.woff2'));
//   const satoshiURL = await fetch(chrome.runtime.getURL('Satoshi-Medium.woff2'));

//   const fontFaceYalla = new FontFace('Yalla', `url(${yallaURL.url})`);
//   document.fonts.add(fontFaceYalla);

//   const fontFaceSatoshi = new FontFace('Satoshi', `url(${satoshiURL.url})`);
//   document.fonts.add(fontFaceSatoshi);
// })();

const TrollHelper = {
  url: '',
  tweetId: '',
  modalOpen: false,
  modalButtonAdded: false,
  inlineButtonAdded: false,
  replyContent: '',
  replyContentSet: false,
  replyPostConfirmed: false,

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
    if (!window.location.href.includes('twitter.com')) {
      return;
    }
    TrollHelper.checkPageLoad();
    TrollHelper.monitorUIState();
  },

  /**
   * Monitor UI state
   *
   * @returns void
   */
  monitorUIState() {
    // check if modal has changed state - modal is open if div[data-testid="tweetButton"] exists
    const modalTweetButton = document.querySelector(
      'div[data-testid="tweetButton"]'
    );

    // modal was closed but is now open
    if (modalTweetButton && !TrollHelper.modalButtonAdded) {
      TrollHelper.addModalButton();
      TrollHelper.modalOpen = true;
      TrollHelper.modalButtonAdded = true;
    }

    // modal was open but is now closed
    if (!modalTweetButton && TrollHelper.modalOpen) {
      TrollHelper.modalOpen = false;
      TrollHelper.modalButtonAdded = false;
    }

    // inline toolbar is available
    if (!TrollHelper.url.includes('/home')) {
      const toolBar = document.querySelector('main div[data-testid="toolBar"]');
      if (toolBar && !TrollHelper.inlineButtonAdded) {
        TrollHelper.addInlineButton();
      }
    }

    setTimeout(() => {
      // console.log('monitorUIState settimeout');
      TrollHelper.monitorUIState();
    }, 1000);
  },

  /**
   * Add troll button to the modal
   *
   * @returns void
   */
  addModalButton() {
    const trollButtonId = 'trollButton';

    TrollHelper.addButton('tweetButton', trollButtonId);
    TrollHelper.modalButtonAdded = true;
  },

  /**
   * Add troll button to the inline reply area
   *
   * @returns void
   */
  addInlineButton() {
    const trollButtonId = 'trollButtonInline';

    TrollHelper.addButton('tweetButtonInline', trollButtonId);
    TrollHelper.inlineButtonAdded = true;
  },

  /**
   * Add troll button to the UI
   *
   * @returns void
   */
  addButton(replyButtonId, trollButtonId) {
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'xx-relative';
    contentWrapper.innerHTML =
      `
      <button id="` +
      trollButtonId +
      `" 
      class="xx-rounded-full xx-bg-purple-600 xx-px-4 xx-py-2.5 xx-text-sm 
        xx-font-semibold xx-text-white xx-shadow-sm xx-hover:bg-purple-500 
        xx-focus-visible:outline xx-focus-visible:outline-2 
        xx-focus-visible:outline-offset-2 xx-focus-visible:outline-purple-600">
        Troll
      </button>
      `;

    let replyButton = document.querySelector(
      'div[data-testid="' + replyButtonId + '"]'
    );
    replyButton.parentNode.insertBefore(contentWrapper, replyButton);

    const trollButton = document.getElementById(trollButtonId);
    trollButton.addEventListener('click', TrollHelper.trollButtonClickHandler);
  },

  // /**
  //  * Add troll button to the UI
  //  *
  //  * @returns void
  //  */
  // addButtonInline() {
  //   if (
  //     TrollHelper.inlineButtonAdded ||
  //     !TrollHelper.url.includes('/status/')
  //   ) {
  //     return;
  //   }

  //   const toolBar = document.querySelector('main div[data-testid="toolBar"]');
  //   if (!toolBar) {
  //     setTimeout(() => {
  //       console.log('add troll button settimeout');
  //       TrollHelper.addButton();
  //     }, 1000);

  //     return;
  //   }

  //   const contentWrapper = document.createElement('div');
  //   contentWrapper.className = 'relative';
  //   contentWrapper.innerHTML =
  //     `
  //     <button id="troll-button"
  //         class="rounded-full bg-purple-600 px-4 py-2.5 text-sm
  //     font-semibold text-white shadow-sm hover:bg-purple-500
  //     focus-visible:outline focus-visible:outline-2
  //     focus-visible:outline-offset-2 focus-visible:outline-purple-600">Troll</button>
  //     <div class="troll-message-box flex flex-row
  //         invisible absolute top-full mt-4 -left-20
  //         bg-white/75 text-slate-700 p-4 shadow-xl rounded w-80
  //         ring-offset-2 ring-2 ring-purple-600 ring-offset-transparent">
  //         <div class="message-content grow"></div>
  //         <div class="pl-3">
  //             <img src="` +
  //     chrome.runtime.getURL('sticker.gif') +
  //     `" width="64" height="64" />
  //         </div>
  //     </div>
  //     `;

  //   let replyButton = document.querySelector('div[data-testid="tweetButton"]');

  //   if (!replyButton) {
  //     TrollHelper.modalOpen = false;
  //     replyButton = document.querySelector(
  //       'div[data-testid="tweetButtonInline"]'
  //     );
  //   }

  //   replyButton.parentNode.insertBefore(contentWrapper, replyButton);

  //   const trollButton = document.getElementById('troll-button');

  //   trollButton.addEventListener('click', TrollHelper.trollButtonClickHandler);

  //   TrollHelper.inlineButtonAdded = true;
  //   console.log('button added');
  // },

  /**
   * Handle the Troll button click
   *
   * @returns void
   */
  async trollButtonClickHandler() {
    console.log('getTweetText');
    var tweetTextDiv = document.querySelector('div[data-testid="tweetText"]');
    if (!tweetTextDiv) {
      console.log('could not identify tweet content');
      return;
    }

    const tweetText = TrollHelper.extractTweetContentWithEmojis(tweetTextDiv);

    TrollHelper.generateReply(tweetText);
    // TrollHelper.generateReplyTest();
    // TrollHelper.testWatchForReplyAddedToUI();
  },

  /**
   * Generate reply
   *
   * Once generated will trigger watchForPaste()
   *
   * @param {string} tweetText
   * @returns void
   */
  async generateReply(tweetText) {
    TrollHelper.setThinkingPlaceholder();
    chrome.runtime.sendMessage(
      {
        action: 'generateReply',
        tweetId: TrollHelper.tweetId,
        tweetText: tweetText,
        username: TrollHelper.getUsername(),
        walletAddress: await getKeyFromLocalStorage('walletAddress'),
      },
      function (response) {
        // console.log('receive response', response);
        if (response && response.error) {
          console.log('errors from the API', response.error);
          return;
        }

        TrollHelper.writeToClipboard(response.reply);
        TrollHelper.replyContentSet = true;
        TrollHelper.replyContent = response.reply;
        TrollHelper.setPasteInstructionsPlaceholder();
        TrollHelper.watchForPaste();
      }
    );
  },

  /**
   * Generate a test reply
   *
   * Once generated will trigger watchForPaste()
   *
   * @returns void
   */
  generateReplyTest() {
    const testMessage = 'testing clip';

    TrollHelper.setThinkingPlaceholder();
    setTimeout(function () {
      TrollHelper.writeToClipboard(testMessage);
      TrollHelper.replyContentSet = true;
      TrollHelper.replyContent = testMessage;
      TrollHelper.setPasteInstructionsPlaceholder();
      TrollHelper.watchForPaste();
    }, 3000);
  },

  /**
   * Watch the reply content area to see if the content matches the generated troll
   *
   * If a match is found, trigger a click on the reply button to force the reply
   *
   * @returns void
   */
  watchForPaste() {
    if (!TrollHelper.replyContentSet) {
      return;
    }

    const replyArea = document.querySelector(
      'div[data-testid="tweetTextarea_0"]'
    );
    if (replyArea.textContent === TrollHelper.replyContent) {
      TrollHelper.submitReply();
      return;
    }

    setTimeout(() => {
      console.log('watchForPaste settimeout');
      TrollHelper.watchForPaste();
    }, 500);
  },

  /**
   * Trigger the reply submission
   *
   * Once triggered will trigger watchForReplyAddedToUI()
   *
   * @returns void
   */
  submitReply() {
    const button = document.querySelector(
      'div[data-testid="tweetButtonInline"]'
    );
    if (!button) {
      return;
    }

    const event = new MouseEvent('click', {
      bubbles: true, // Event will bubble up through the DOM
      cancelable: true, // Event can be canceled
    });
    button.dispatchEvent(event);
    TrollHelper.watchForReplyAddedToUI();
  },

  /**
   * Check the UI for the reply to appear
   *
   * If appears will trigger validation call with the API
   *
   * @return void
   */
  watchForReplyAddedToUI() {
    if (TrollHelper.replyPostConfirmed) {
      return;
    }

    const latestReply = TrollHelper.getLatestReply();
    if (!latestReply) {
      setTimeout(() => {
        console.log('watchForReplyAddedToUI settimeout');
        TrollHelper.watchForReplyAddedToUI();
      }, 500);
      return;
    }

    const latestReplyTextDiv = latestReply.querySelector(
      'div[data-testid="tweetText"]'
    );
    if (!latestReplyTextDiv) {
      setTimeout(() => {
        console.log('watchForReplyAddedToUI settimeout');
        TrollHelper.watchForReplyAddedToUI();
      }, 500);
      return;
    }

    const latestReplyText =
      TrollHelper.extractTweetContentWithEmojis(latestReplyTextDiv);

    console.log('checking latest reply');
    console.log('reply text');
    console.log('"' + latestReplyText + '"');
    console.log('generated reply');
    console.log('"' + TrollHelper.replyContent + '"');

    const matchFound = latestReplyText === TrollHelper.replyContent;

    if (!matchFound) {
      setTimeout(() => {
        console.log('watchForReplyAddedToUI settimeout');
        TrollHelper.watchForReplyAddedToUI();
      }, 500);
      return;
    }

    TrollHelper.confirmReply(latestReply);
  },

  /**
   * Tell API to confirm replt
   *
   * @param {Element} messageBox
   */
  async confirmReply(latestReply) {
    console.log('reply id', this.getReplyId(latestReply));
    TrollHelper.setConfirmingMessage();

    chrome.runtime.sendMessage(
      {
        action: 'confirmReply',
        tweetId: TrollHelper.tweetId,
        replyId: this.getReplyId(latestReply),
        walletAddress: await getKeyFromLocalStorage('walletAddress'),
      },
      function (response) {
        // console.log('receive response', response);
        if (response && response.error) {
          console.log('errors from the API', response.error);
          return;
        }

        TrollHelper.replyPostConfirmed = true;
        TrollHelper.reset();
      }
    );
  },

  /**
   * Test watching the UI for a reply to appear
   *
   *  retourn void
   */
  testWatchForReplyAddedToUI() {
    if (TrollHelper.replyPostConfirmed) {
      return;
    }

    const latestReply = TrollHelper.getLatestReply();
    const latestReplyText = latestReply.querySelector(
      'div[data-testid="tweetText"]'
    );
    console.log(
      'checking latest reply',
      latestReplyText.textContent,
      'test message'
    );

    if (latestReplyText.textContent !== 'test message') {
      setTimeout(() => {
        console.log('testWatchForReplyAddedToUI settimeout');
        TrollHelper.testWatchForReplyAddedToUI();
      }, 500);
      return;
    }

    console.log('testWatchForReplyAddedToUI - reply found');
    console.log('reply id', this.getReplyId(latestReply));
  },

  /**
   * Get username for current user
   *
   * @returns String
   */
  getUsername() {
    let username = '';

    // determine username from profile link
    const profileLink = document.querySelector(
      'a[data-testid="AppTabBar_Profile_Link"]'
    );
    if (profileLink) {
      username = profileLink.getAttribute('href').slice(1);
    }

    return username;
  },

  /**
   * Get dom element containing the latest reply to a tweet
   *
   * @return Element
   */
  getLatestReply() {
    const conversationItems = document.querySelectorAll(
      'div[data-testid="cellInnerDiv"]'
    );

    return conversationItems[2];
  },

  /**
   * Get tweet ID from latestReply
   *
   * @param {Relement} latestReply
   * @returns String
   */
  getReplyId(latestReply) {
    const replyLinks = latestReply.querySelectorAll('a');

    const replyLink = Array.from(replyLinks).find((link) => {
      const url = link.getAttribute('href');
      const pathSegments = url.split('/');
      return pathSegments.length === 4 && pathSegments[2] === 'status';
    });

    let replyId = replyLink ? replyLink.getAttribute('href').split('/')[3] : '';

    return replyId;
  },

  /**
   * Write to message area
   *
   * @param {String} message
   */
  writeMessage(message) {
    const notificationWrapper = document.getElementById('troll-notifications');
    const notificationDiv = notificationWrapper.querySelector(
      '.notification-content'
    );

    notificationWrapper.classList.replace('xx-invisible', 'xx-visible');
    notificationDiv.textContent = message;
  },

  /**
   * Set thinking message
   *
   * @param {Element} messageBox
   */
  setThinkingPlaceholder(messageBox) {
    const randomIndex = Math.floor(
      Math.random() * TrollHelper.thinkingTexts.length
    );

    TrollHelper.writeMessage(TrollHelper.thinkingTexts[randomIndex]);
  },

  /**
   * Set confirming message
   *
   * @returns void
   */
  setConfirmingMessage() {
    TrollHelper.writeMessage('Confirming your tweet');
  },

  /**
   * Set paste instructions
   *
   *  @returns void
   */
  setPasteInstructionsPlaceholder() {
    const placeholder = document.querySelector(
      'div.public-DraftEditorPlaceholder-inner'
    );
    placeholder.textContent = 'Paste your troll here!!';

    TrollHelper.writeMessage(
      'Reply added to clipboard, paste it and click Reply to earn $TROLLANA!!'
    );
  },

  /**
   * Extact tweet text from a dom element
   *
   * @param {Element} tweetElement
   * @returns String
   */
  extractTweetContentWithEmojis(tweetElement) {
    let content = '';
    const nodes = tweetElement.childNodes;

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Directly use the text content of text nodes
        content += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'IMG' && node.getAttribute('alt')) {
          // Use the alt attribute of img elements (for emojis)
          content += node.getAttribute('alt');
        } else if (node.tagName === 'A') {
          // Append the text content of <a> tags
          content += node.textContent;
        } else if (node.tagName === 'SPAN' || node.tagName === 'DIV') {
          // Recursively handle span or div elements to capture nested text/emojis
          content += TrollHelper.extractTweetContentWithEmojis(node);
        }
        // Add handling for other element types if necessary
      }
    });

    return content;
  },

  /**
   * Write content to clipboard
   *
   * @param {string} text
   * @returns void
   */
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

  /**
   * Check for a new page load
   *
   * @return void
   */
  checkPageLoad() {
    // const username = TrollHelper.getUsername();
    // if (!username) {
    //   return;
    // }

    if (
      TrollHelper.url !== window.location.href &&
      !window.location.href.includes('/compose/post')
    ) {
      TrollHelper.url = window.location.href;
      TrollHelper.reset();
    }

    setTimeout(() => {
      TrollHelper.checkPageLoad();
    }, 1000);
  },

  /**
   * Reset the helper
   *
   * @return void
   */
  reset() {
    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split('/');
    const tweetId = pathSegments[pathSegments.length - 1];

    TrollHelper.tweetId = tweetId;
    TrollHelper.modalOpen = false;
    TrollHelper.modalButtonAdded = false;
    TrollHelper.inlineButtonAdded = false;
    TrollHelper.replyContent = '';
    TrollHelper.replyContentSet = false;
    TrollHelper.replyPostConfirmed = false;

    TrollHelper.addNotificationArea();
  },

  /**
   * Add notification area to the dom
   *
   * @return void
   */
  addNotificationArea() {
    const notificationArea = document.createElement('div');
    notificationArea.id = 'troll-notifications';
    notificationArea.className =
      'xx-pointer-events-none xx-fixed xx-top-6 xx-right-6 xx-w-96';

    notificationArea.innerHTML =
      `
    <div class="xx-flex xx-w-full xx-flex-col xx-items-center xx-space-y-4 xx-sm:items-end">
      <div class="xx-pointer-events-auto xx-border-b-4 xx-border-indigo-500 xx-bg-slate-100 xx-w-full xx-max-w-sm xx-overflow-hidden xx-rounded-lg xx-ring-1 xx-ring-black xx-ring-opacity-5">
        <div class="xx-p-4">
          <div class="xx-flex xx-items-start">
            <div class="xx-flex-shrink-0">
              <img src="` +
      chrome.runtime.getURL('icon-128.png') +
      `" width="32" height="32" />
            </div>
            <div class="xx-ml-3 xx-w-0 xx-flex-1 xx-pt-0.5 xx-text-sm xx-text-gray-900">
              <p class="xx-font-medium xx-text-gray-900">
                Trollana Troll Helper....let's got trolling!
              </p>
              <p class="instructions xx-mt-3">
                Click "Post your reply" or
                <svg viewBox="0 0 24 24" class="xx-h-5 xx-inline-block xx-fill-current"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
                and our "Troll" button will appear.
                Click it and watch the magic happen...
              </p>
              <p class="instructions xx-mt-3">
                Post the generated reply to earn $TROLLANA!
              </p>
              <p class="notification-content xx-mt-3 xx-text xx-text-gray-500">
              </p>
              <div class="xx-mt-3 xx-flex xx-space-x-7">
                <button type="button" class="xx-hidden rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Undo</button>
                <button type="button" class="xx-hidden rounded-md bg-white text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Dismiss</button>
              </div>
            </div>
            <div class="xx-ml-4 xx-flex xx-flex-shrink-0">
              <button type="button" class="xx-inline-flex xx-rounded-md xx-bg-white xx-text-gray-400 xx-hover:text-gray-500 xx-focus:outline-none xx-focus:ring-2 xx-focus:ring-indigo-500 xx-focus:ring-offset-2">
                <span class="xx-sr-only">Close</span>
                <svg class="xx-h-5 xx-w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

    document.body.appendChild(notificationArea);
  },
};

TrollHelper.init();
