//listen to any updates in the tab system
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    if (tab.url && tab.url.includes("twitter.com")) {
      console.log("The tab with ID " + tabId + " was refreshed.");

      // //Tweet ID
      // const tweetId = tab.url.split("/")[5];
      // console.log(`tweetID is: ${tweetId}`);

      // //sender
      // let msg ={ txt: tweetId }
      // chrome.tabs.sendMessage(tabId, msg);
    }
  }
});

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    
  if (request.open_new_tab) {
      //sender is the tab the above content script code is injected in
      chrome.tabs.create({url: request.url, index: sender.tab.index + 1})
  }
  
  //if you are using Manifest V3 then always call sendResponse as below
  sendResponse(true)
  
})

//FastAPI intigration