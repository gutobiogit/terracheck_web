/*
 * linkedin-insight-loader.js
 *
 * Equivalente do linkedInInsight.js (app React) pra landing publica.
 * So' carrega a tag depois de consentimento de "marketing". Sem
 * eventos de conversao aqui -- mesma ressalva do arquivo React: o
 * LinkedIn exige um conversion_id numerico criado no Campaign Manager
 * pra cada acao, ainda nao configurado.
 *
 * Inclui via <script src="/linkedin-insight-loader.js" defer></script>,
 * depois de cookie-consent.js.
 */
(function () {
  "use strict";

  var PARTNER_ID = "10861745";
  var loaded = false;

  function loadScript() {
    if (loaded) return;
    loaded = true;

    window._linkedin_partner_id = PARTNER_ID;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(PARTNER_ID);

    (function (l) {
      if (!l) {
        window.lintrk = function (a, b) {
          window.lintrk.q.push([a, b]);
        };
        window.lintrk.q = [];
      }
      var s = document.getElementsByTagName("script")[0];
      var b = document.createElement("script");
      b.type = "text/javascript";
      b.async = true;
      b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
      s.parentNode.insertBefore(b, s);
    })(window.lintrk);
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
