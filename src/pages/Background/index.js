import { setupSentry } from '../../sentry.js';

import Api from '../../api';

chrome.commands.onCommand.addListener((command) => {
  console.log('lets reload');
  console.log(command);
  if (command === 'reload_extension') {
    // Reload the extension
    chrome.runtime.reload();
  }
});

// Listen for any messages sent from other parts of the extension, like content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('message received', request.action);
  if (request.action === 'generateTrollReply') {
    return generateTrollReply(request, sendResponse);
  }

  if (request.action === 'generateAiHelperReply') {
    return generateAiHelperReply(request, sendResponse);
  }

  if (request.action === 'confirmReply') {
    return confirmReply(request, sendResponse);
  }
});

function generateTrollReply(request, sendResponse) {
  const params = {
    tweet: request.tweetText,
    tweetId: request.tweetId,
    replyAuthor: request.username,
    walletAddress: request.walletAddress,
    shill: request.shillModeEnabled,
    increasedXCharacterLimit: request.increasedXCharacterLimitEnabled,
  };

  Api.api()
    .post('/troll/twitter', params)
    .then((response) => {
      // console.error('generate reply response', response);
      if (response && response.error) {
        sendResponse({ response: response });
        return;
      }
      sendResponse({ reply: response.reply });
    })
    .catch((error) => {
      console.error('error', error);
      sendResponse({ error: error });
    });

  // Keep the messaging channel open for the asynchronous response
  return true;
}

function generateAiHelperReply(request, sendResponse) {
  const params = {
    tweet: request.tweetText,
    tweetId: request.tweetId,
    replyAuthor: request.username,
    personaId: request.personaId,
    customPersona: request.customPersona,
  };

  Api.api()
    .post('/reply/twitter', params)
    .then((response) => {
      // console.error('generate reply response', response);
      if (response && response.error) {
        sendResponse({ response: response });
        return;
      }
      sendResponse({ reply: response.reply });
    })
    .catch((error) => {
      console.error('error', error);
      sendResponse({ error: error });
    });

  // Keep the messaging channel open for the asynchronous response
  return true;
}

async function confirmReply(request, sendResponse) {
  const params = {
    tweetId: request.tweetId,
    replyId: request.replyId,
    walletAddress: request.walletAddress,
  };

  Api.api()
    .post('/troll/twitter/confirm', params)
    .then((response) => {
      console.error('confirm reply response', response);
      if (response && response.error) {
        sendResponse({ response: response });
        return;
      }
      sendResponse({ confirmed: response.confirmed });
    })
    .catch((error) => {
      console.error('error', error);
      sendResponse({ error: error });
    });

  return true;
}
