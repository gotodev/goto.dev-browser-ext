const endpoint = "https://api.goto.dev/github";

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    console.log("[goto.dev] Using endpoint: %s", endpoint);

    fetch(
      endpoint,
      {
        method: "POST",
        cors: "no-cors",
        body: JSON.stringify(msg),
        credentials: "include",
      },
    )
    .then(async (response) => {
      if (response.ok) {
        return response;
      }

      const text = await response.text();
      throw new Error(response.status + ": " + text);
    })
    .then((response) => response.json())
    .then((refs) => sendResponse({msg: msg, result: refs}))
    .catch((reason) => {
      console.log("[goto.dev] ERROR while resolving reference for %o: %o", msg, reason);
      sendResponse({msg: msg, error: reason.message});
    });

    return true;
  }
);

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: 'https://github.com/gotodev/gotodev-chrome/blob/main/demo/Demo.java',
      active: true,
    });

    chrome.runtime.setUninstallURL('https://goto.dev/?byebye');
  }
});
