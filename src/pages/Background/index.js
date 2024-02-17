import { setupSentry } from '../../sentry.js';

import { getKeyFromLocalStorage } from '../../utils';
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

  if (request.action === 'recordReply') {
    return recordReply(request, sendResponse);
  }
});

async function recordReply(request, sendResponse) {
  // record reply
  // console.log('recordReply background', tweetId);
  // console.log('bg walletAddress', walletAddress);
  // fetch('https://api.app.trollana.io/v1/twitter', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ tweet: tweetText }),
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     // Send the API response back to the content script
  //     sendResponse({ reply: data.reply });
  //   })
  //   .catch((error) => console.error('Error:', error));
  // // Keep the messaging channel open for the asynchronous response
  // return true;
}

function generateReply(request, sendResponse) {
  const url = new URL(request.url);

  // Split the pathname by '/' and take the last part
  const pathSegments = url.pathname.split('/');
  const tweetId = pathSegments[pathSegments.length - 1];

  const params = {
    tweet: request.tweetText,
    tweetId: tweetId,
    replyAuthor: request.username,
    walletAddress: request.walletAddress,
  };
  console.log(params);

  Api.api()
    .post('/troll/twitter', params)
    .then((response) => {
      console.error('generate reply response', response);
      sendResponse({ response: response });
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
