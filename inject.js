function loadScript(src) {
  let script = document.createElement("script");
  script.src = browser.runtime.getURL(src);
  script.type = "module";
  script.async = false;
  //
  //let code = `if(typeof chrome === "undefined")
  //  window.addEventListener("message", receiveMessage, false);
  //  function receiveMessage(event) {
  //    console.log("main received from " + event.origin + " data " + event.data);
  //    console.log(event.source === window);
  //    //window.postMessage("this is main posting", "*");
  //  }`;
  //let codeElement = document.createTextNode(code);
  //script.appendChild(codeElement);
  //
  //document.querySelector("head").appendChild(script);
  document.getElementsByTagName('head')[0].appendChild(script);
  script.onload = function() { script.parentNode.removeChild(script); };

}

loadScript('scripts/timestamp-player.js');
