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
  tweetText: '',
  modalOpen: false,
  modalButtonAdded: false,
  inlineButtonAdded: false,
  replyContent: '',
  replyContentSet: false,
  replyPostConfirmed: false,
  lastRepliedToTweetId: '',

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

  replyHeaders: [
    'Voilà',
    'And here it is',
    'All yours',
    'Something special for you',
    'Here you go',
    'Tailored for you',
    'Your exclusive:',
  ],

  init() {
    if (
      (!window.location.href.includes('twitter.com') &&
        !window.location.href.includes('app.trollana.vip')) ||
      window.location.href === 'https://twitter.com'
    ) {
      return;
    }

    if (window.location.href.includes('app.trollana.vip')) {
      // todo
      return;
    }

    TrollHelper.checkPageLoad();
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
      TrollHelper.setTweetId();
      TrollHelper.addModalButton();
      TrollHelper.modalOpen = true;
      TrollHelper.modalButtonAdded = true;
    }

    // modal was open but is now closed
    if (!modalTweetButton && TrollHelper.modalOpen) {
      TrollHelper.setTweetId();
      TrollHelper.modalOpen = false;
      TrollHelper.modalButtonAdded = false;
    }

    if (TrollHelper.tweetText === '') {
      TrollHelper.setTweetId();
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

  /**
   * Handle the Troll button click
   *
   * @returns void
   */
  async trollButtonClickHandler() {
    const tweetTextDiv = document.querySelector('div[data-testid="tweetText"]');
    if (!tweetTextDiv) {
      this.displayErrors('Ccould not identify tweet content', true);
      return;
    }

    TrollHelper.generateReply();
    // TrollHelper.generateReplyTest();
    // TrollHelper.testWatchForReplyAddedToUI();
  },

  /**
   * Generate reply
   *
   * Once generated will trigger watchForPaste()
   *
   * @returns void
   */
  async generateReply() {
    TrollHelper.clearNotifications();
    TrollHelper.displayThinking();

    chrome.runtime.sendMessage(
      {
        action: 'generateReply',
        tweetId: TrollHelper.tweetId,
        tweetText: TrollHelper.tweetText,
        username: TrollHelper.getUsername(),
        walletAddress: await getKeyFromLocalStorage('walletAddress'),
      },
      function (response) {
        TrollHelper.hideThinking();

        // console.log('receive response', response);
        if (response && response.error) {
          let error = response.error;
          if (error !== '' && error.length === 0) {
            error = 'An unknown error occurred';
          }
          TrollHelper.displayErrors(error, true);
          console.log('error generating a reply', response);
          return;
        }

        TrollHelper.writeToClipboard(response.reply);
        TrollHelper.replyContentSet = true;
        TrollHelper.replyContent = response.reply;
        TrollHelper.displayReply(response.reply);
        // TrollHelper.setPasteInstructionsPlaceholder();
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
    let buttonSelector = 'div[data-testid="tweetButtonInline"]';
    if (TrollHelper.modalOpen) {
      buttonSelector = 'div[data-testid="tweetButton"]';
    }
    const button = document.querySelector(buttonSelector);
    if (!button) {
      return;
    }

    // clone the original tweet id
    const tweetId = TrollHelper.tweetId.toString();

    const event = new MouseEvent('click', {
      bubbles: true, // Event will bubble up through the DOM
      cancelable: true, // Event can be canceled
    });
    button.dispatchEvent(event);

    // if (TrollHelper.modalOpen) {
    //   TrollHelper.watchForAlertAddedToUI();
    //   return;
    // }
    TrollHelper.watchForAlertAddedToUI(tweetId);
  },

  /**
   * Check the UI for the alert with reply tweet link in
   *
   * If appears will trigger validation call with the API
   *
   * @param {String} tweetId
   *
   * @returns void
   */
  watchForAlertAddedToUI(tweetId) {
    if (TrollHelper.replyPostConfirmed) {
      return;
    }

    const alertDiv = document.querySelector('div[role="alert"]');
    if (!alertDiv) {
      setTimeout(() => {
        console.log('watchForAlertAddedToUI settimeout');
        TrollHelper.watchForAlertAddedToUI(tweetId);
      }, 500);
      return;
    }

    const link = alertDiv.querySelector('a[role="link"]');
    if (!link) {
      setTimeout(() => {
        console.log('watchForAlertAddedToUI settimeout');
        TrollHelper.watchForAlertAddedToUI(tweetId);
      }, 500);
      return;
    }

    const url = link.getAttribute('href');
    const pathSegments = url.split('/');
    const replyId = pathSegments[pathSegments.length - 1];

    console.log('found alert with reply link');
    console.log('tweetId', tweetId);
    console.log('reply tweetId', replyId);

    TrollHelper.confirmReply(tweetId, replyId);
  },

  /**
   * Tell API to confirm replt
   *
   * @param {String} tweetId
   * @param {String} replyId
   *
   * @returns void
   */
  async confirmReply(tweetId, replyId) {
    TrollHelper.clearNotifications();
    console.log('confirming reply id', replyId);
    TrollHelper.showLoader('Confirming your tweet');

    chrome.runtime.sendMessage(
      {
        action: 'confirmReply',
        tweetId: tweetId,
        replyId: replyId,
        walletAddress: await getKeyFromLocalStorage('walletAddress'),
      },
      function (response) {
        TrollHelper.hideLoader();

        // console.log('receive response', response);
        if (response && response.error) {
          let error = response.error;
          if (error !== '' || error.length === 0) {
            error = 'An unknown error occurred';
          }
          TrollHelper.displayErrors(error, true);
          console.log('error confirming reply', response);
          return;
        }

        TrollHelper.displayNotification(
          "Woo hoo!! Well done, one in the bank for the Troll Army!!<br />Let's go again!",
          true
        );

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
   * Write to notification area
   *
   * @param {String} message
   * @param {Boolean} clearErrors
   *
   * @returns void
   */
  displayNotification(message, clearErrors) {
    const notificationArea = document.getElementById('troll-notifications');
    const notificationSelector = '.notification-content';

    notificationArea.classList.replace('xx-hidden', 'xx-block');

    if (clearErrors) {
      TrollHelper.displayErrors('');
    }

    TrollHelper.hideLoader();

    if (message === '') {
      TrollHelper.hideNotificationComponent(notificationSelector);
    } else {
      TrollHelper.displayNotificationComponent(notificationSelector);
    }

    const notificationDiv =
      notificationArea.querySelector(notificationSelector);
    notificationDiv.innerHTML = message;
  },

  /**
   * Clear all notifications
   */
  clearNotifications() {
    TrollHelper.displayNotification('', true);
    TrollHelper.displayReply('');
  },

  /**
   * Display an error
   *
   * @param {String} error
   * @param {Boolean} clearNotitication
   *
   * @returns void
   */
  displayErrors(message, clearNotification) {
    const notificationArea = document.getElementById('troll-notifications');
    const errorsSelector = '.error-messages';

    if (clearNotification) {
      TrollHelper.displayNotification('');
    }

    TrollHelper.hideLoader();

    notificationArea.classList.replace('xx-hidden', 'xx-block');

    message = TrollHelper.capitalizeFirstLetter(message);

    if (message === '') {
      TrollHelper.hideNotificationComponent(errorsSelector);
    } else {
      TrollHelper.displayNotificationComponent(errorsSelector);
    }

    message = `
      <svg xmlns="http://www.w3.org/2000/svg" class="xx-h-5 xx-inline-block xx-fill-current" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
      ${message}
    `;

    const errorsDiv = notificationArea.querySelector(errorsSelector);
    errorsDiv.innerHTML = message;
  },

  /**
   * Show loader
   *
   * @param {String} headerText
   *
   * @returns void
   */
  showLoader(headerText) {
    TrollHelper.showLoaderHeader(headerText);
    TrollHelper.displayNotificationComponent('.loader-wrapper');
  },

  /**
   * Hide loader
   *
   * @returns void
   */
  hideLoader() {
    TrollHelper.hideLoaderHeader();
    TrollHelper.hideNotificationComponent('.loader-wrapper');
  },

  /**
   * Show loader header
   *
   * @param {String} headerText
   *
   * @returns void
   */
  showLoaderHeader(headerText) {
    const notificationArea = document.getElementById('troll-notifications');
    const selector = '.loader-header';
    const header = notificationArea.querySelector(selector);
    header.textContent = headerText;

    TrollHelper.displayNotificationComponent(selector);
  },

  /**
   * Hide loader header
   *
   * @returns void
   */
  hideLoaderHeader() {
    const notificationArea = document.getElementById('troll-notifications');
    const selector = '.loader-header';
    const header = notificationArea.querySelector(selector);
    header.textContent = '';

    TrollHelper.hideNotificationComponent(selector);
  },

  /**
   * Display thinking message
   *
   * @returns void
   */
  displayThinking() {
    const randomIndex = Math.floor(
      Math.random() * TrollHelper.thinkingTexts.length
    );

    TrollHelper.showLoader(TrollHelper.thinkingTexts[randomIndex]);
  },

  /**
   * Hide loader header
   *
   * @returns void
   */
  hideThinking() {
    TrollHelper.hideLoader();
  },

  /**
   * Display reply
   *
   * @param {String} reply
   *
   * @returns void
   */
  displayReply(reply) {
    const notificationArea = document.getElementById('troll-notifications');
    const wrapperSelector = '.reply-wrapper';

    if (reply === '') {
      TrollHelper.hideNotificationComponent(wrapperSelector);
      return;
    }

    // set reply header
    const randomIndex = Math.floor(
      Math.random() * TrollHelper.replyHeaders.length
    );
    const replyHeader = notificationArea.querySelector('.reply-header');
    replyHeader.textContent = TrollHelper.replyHeaders[randomIndex] + ':';

    // set reply
    const replyDiv = notificationArea.querySelector('.reply-content');
    replyDiv.textContent = reply;

    TrollHelper.displayNotificationComponent(wrapperSelector);
  },

  /**
   * Display instructions
   *
   * @returns void
   */
  displayInstructions() {
    TrollHelper.displayNotificationComponent('.instructions');
  },

  /**
   * Hide instructions
   *
   * @returns void
   */
  hideInstructions() {
    TrollHelper.hideNotificationComponent('.instructions');
  },

  /**
   * Display notification component
   *
   * @param {String} selector
   *
   * @returns void
   */
  displayNotificationComponent(selector) {
    const notificationArea = document.getElementById('troll-notifications');
    const components = notificationArea.querySelectorAll(selector);

    components.forEach((component) => {
      component.classList.replace('xx-hidden', 'xx-block');
      console.log('show', selector);
    });
  },

  /**
   * Hide notification component
   *
   * @param {String} selector
   *
   * @returns void
   */
  hideNotificationComponent(selector) {
    const notificationArea = document.getElementById('troll-notifications');
    const components = notificationArea.querySelectorAll(selector);

    components.forEach((component) => {
      if (!component) {
        return;
      }
      console.log('hide', selector);
      component.classList.replace('xx-block', 'xx-hidden');
    });
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

    TrollHelper.displayNotification(
      'Reply added to clipboard, paste it and click Reply to earn $TROLLANA!!'
    );
  },

  /**
   * Set tweet ID of tweet being replied to
   *
   * @returns void
   */
  setTweetId() {
    let tweetId = '';

    const tweetText = TrollHelper.getTweetText();

    if (window.location.href.includes('/compose/post')) {
      // find matching tweet from page
      const pageTweets = document.querySelectorAll(
        'main div[data-testid="tweetText"]'
      );
      pageTweets.forEach((div) => {
        if (tweetId !== '') {
          return;
        }

        const testTweet = TrollHelper.extractTweetContentWithEmojis(div);
        if (testTweet === tweetText) {
          // console.log('found matching tweet');
          tweetId = TrollHelper.getTweetIdFromConversationListArticle(
            div.closest('article')
          );
        }
      });
    } else {
      const url = new URL(window.location.href);
      const pathSegments = url.pathname.split('/');
      tweetId = pathSegments[pathSegments.length - 1];
    }

    if (tweetId === '1') {
      return;
    }
    TrollHelper.tweetId = tweetId;
    TrollHelper.tweetText = tweetText;
    // console.log('tweetId', tweetId);
    // console.log('tweetText', tweetText);
  },

  /**
   * Get tweet ID for conversation list tweet
   *
   * @param {Element} article
   *
   * @return string
   */
  getTweetIdFromConversationListArticle(article) {
    const links = article.querySelectorAll('a[role="link"]');
    let tweetId = '';
    links.forEach((link) => {
      const url = link.getAttribute('href');
      if (tweetId !== '' || !url.includes('/status')) {
        return;
      }

      const pathSegments = url.split('/');
      tweetId = pathSegments[pathSegments.length - 1];
    });

    return tweetId;
  },

  /**
   * Get text of text being replied to or quoted
   *
   * @retuns String
   */
  getTweetText() {
    const tweetTextDiv = document.querySelector('div[data-testid="tweetText"]');

    if (!tweetTextDiv) {
      return '';
    }

    return TrollHelper.extractTweetContentWithEmojis(tweetTextDiv);
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

    // remove media
    const regex = / https:\/\/pic\.twitter\.com\/.*$/;
    content = content.replace(regex, '');

    return content;
  },

  /**
   * Capitalise the first letter in a string
   * @param {String} str
   *
   * @returns
   */
  capitalizeFirstLetter(str) {
    if (!str) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
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
    TrollHelper.modalOpen = false;
    TrollHelper.modalButtonAdded = false;
    TrollHelper.inlineButtonAdded = false;
    TrollHelper.replyContent = '';
    TrollHelper.replyContentSet = false;
    TrollHelper.replyPostConfirmed = false;

    TrollHelper.setTweetId();
    TrollHelper.addNotificationArea();
  },

  /**
   * Add notification area to the dom
   *
   * @return void
   */
  addNotificationArea() {
    const areaExits = document.getElementById('troll-notifications');
    if (areaExits) {
      return;
    }

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
            <div class="xx-ml-3 xx-w-0 xx-flex-1 xx-pt-0.5 xx-text-sm xx-text-slate-900">
              <p class="xx-font-bold xx-text-indigo-500">
                Trollana Troll Helper....let's got trolling!
              </p>
              <p class="instructions xx-block xx-mt-3">
                Click "Post your reply" or
                <svg viewBox="0 0 24 24" class="xx-h-5 xx-inline-block xx-fill-current"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
                and our "Troll" button will appear.
                Click it and watch the magic happen...
              </p>
              <p class="instructions xx-hidden xx-mt-3">
                Post the generated reply to earn $TROLLANA!
              </p>
              <p class="error-messages xx-hidden xx-mt-3 xx-text-red-500 xx-font-bold"></p>
              <p class="notification-content xx-text-center xx-mt-3 xx-text-lg xx-text-indigo-800 xx-font-bold"></p>
              <div class="reply-wrapper xx-hidden xx-mt-3">
                <div class="reply-header xx-text-lg xx-text-indigo-800 xx-font-bold"></div>
                <div class="reply-content xx-mt-2 xx-italic xx-p-4 xx-text-indigo-800 xx-bg-slate-300 xx-rounded-lg xx-border-indigo-800 xx-border-2 xx-border-dotted"></div>
                <div class="reply-instructions xx-mt-2 xx-text-sm">
                  Your reply has already been added to your clipboard, paste it in and click Reply to earn $TROLLANA!!
                </div>
              </div>
              <div class="loader-header xx-hidden xx-text-center xx-mt-3 xx-text-lg xx-text-indigo-800 xx-font-bold"></div>
              <div class="loader-wrapper xx-hidden xx-text-center xx-my-3">
                <div class="troll-loader xx-inline-block"></div>
              </div>
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

    (async () => {
      const walletAddress = await getKeyFromLocalStorage('walletAddress');
      if (!walletAddress) {
        TrollHelper.displayErrors(
          'Wallet address not set.  Please open the plugin and follow the instructions.  Once set come back here and reload the page.'
        );
        TrollHelper.hideInstructions();
        return;
      }
      TrollHelper.monitorUIState();
    })();
  },
};

TrollHelper.init();
