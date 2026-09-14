/*
 * ga4-loader.js
 *
 * Equivalente do ga4.js (app React) pra landing publica. So' carrega
 * o gtag depois de consentimento de "analytics" -- ver
 * cookie-consent.js. Sem eventos de conversao aqui: sign_up/
 * begin_checkout/purchase acontecem no app (app.terracheck.com.br),
 * nao na landing. Isso so' cobre page_view (automatico do gtag
 * config) pra medir trafego/canal de aquisicao na landing em si.
 *
 * Inclui via <script src="/ga4-loader.js" defer></script>, DEPOIS de
 * cookie-consent.js e terracheck-attribution.js na ordem das tags.
 */
(function () {
  "use strict";

  var MEASUREMENT_ID = "G-GVFJGDQKDC";
  var loaded = false;

  function loadScript() {
    if (loaded) return;
    loaded = true;

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID);
  }

  function handleConsent(consent) {
    if (consent && consent.analytics) {
      loadScript();
    }
  }

  var existing = window.tcGetConsent ? window.tcGetConsent() : null;
  if (existing) handleConsent(existing);

  window.addEventListener("tc:consent-changed", function (e) {
    handleConsent(e.detail);
  });
})();
