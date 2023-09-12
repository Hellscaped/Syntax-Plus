// ==UserScript==
// @name        Syntax+
// @namespace   Hellscaped's Scripts
// @match       https://www.syntax.eco/*
// @grant       GM_webRequest
// @version     1.0
// @author      Hellscaped
// @description 9/11/2023, 9:08:17 PM
// @webRequest   [{"selector":"*://www.syntax.eco/static/js/presence.js","action":"cancel"}]
// ==/UserScript==

// Hello!
// Feel free to take a look at the code.

// ignore this hack cuz eslint is too dumb to know that this is a userscript
// eslint-disable-next-line no-undef
GM_webRequest([
    { selector: 'https://www.syntax.eco/static/js/presence.js', action: 'cancel' },
], function(info, message, details) {
    console.log(info, message, details);
});

setInterval(function() {
      fetch('https://www.syntax.eco/presence')
      console.log("Fetched!")
}, 50000);

if (document.querySelector("body > div:nth-child(1) > nav > div > a > h1")) {
    document.querySelector("body > div:nth-child(1) > nav > div > a > h1").innerHTML = "SYNTAX+";
    document.querySelector("body > div:nth-child(1) > nav > div > a").href = "https://www.syntax.eco/plus";
}

