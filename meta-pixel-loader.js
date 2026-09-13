/*
 * meta-pixel-loader.js
 *
 * Equivalente do metaPixel.js (app React) pra landing pública. So'
 * carrega o fbq depois de consentimento de "marketing". Sem eventos
 * de conversao aqui -- CompleteRegistration/InitiateCheckout/Purchase
 * acontecem no app (app.terracheck.com.br), nao na landing.
 *
 * Inclui via <script src="/meta-pixel-loader.js" defer></script>,
 * depois de cookie-consent.js.
 */
(function () {
  "use strict";

  var PIXEL_ID = "2309751379561351";
  var loaded = false;

  function loadScript() {
    if (loaded) return;
    loaded = true;

    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }

  function handleConsent(consent) {
    if (consent && consent.marketing) {
      loadScript();
    }
  }

  var existing = window.tcGetConsent ? window.tcGetConsent() : null;
  if (existing) handleConsent(existing);

  window.addEventListener("tc:consent-changed", function (e) {
    handleConsent(e.detail);
  });
})();
