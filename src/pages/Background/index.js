import { setupSentry } from '../../sentry.js';

import Api from '../../api';

chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);

  if (command === 'refresh_extension') {
    chrome.runtime.reload();
  }
});

// Listen for any messages sent from other parts of the extension, like content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('message received', request.action);
  if (request.action === 'generateReply') {
    return generateReply(request, sendResponse);
  }

  if (request.action === 'confirmReply') {
    return confirmReply(request, sendResponse);
  }
});

function generateReply(request, sendResponse) {
  const params = {
    tweet: request.tweetText,
    tweetId: request.tweetId,
    replyAuthor: request.username,
    walletAddress: request.walletAddress,
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

  // Api.api()
  //   .post('/troll/twitter', params)
  //   .then((response) => {
  //     if (!response.ok) {
  //       // If the response is not 2xx, it's considered an error
  //       throw new Error('API error with status code: ' + response.status);
  //     }
  //     //return response.json();
  //     console.error('generate reply response', response);
  //   })
  //   .then((data) => {
  //     sendResponse(data);
  //     console.error('generate reply data', data);
  //     // Send the API response back to the content script
  //     // sendResponse({ reply: data.reply });
  //   })
  //   .catch((errors) => {
  //     sendResponse({ errors: errors });
  //   });

  // Keep the messaging channel open for the asynchronous response
  return true;
}

async function confirmReply(request, sendResponse) {
  const params = {
    tweetId: request.tweetId,
    replyId: request.replyId,
    walletAddress: request.walletAddress,
  };
  console.log(params);

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
