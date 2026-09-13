/*
 * cookie-consent.js
 *
 * Equivalente vanilla do CookieConsent.jsx (frontend React), pra
 * landing publica (terracheck.com.br). Inclui via
 * <script src="/cookie-consent.js" defer></script>.
 *
 * Mesma logica: localStorage "tc_consent" com {analytics, marketing,
 * given_at, version}, evento "tc:consent-changed" no window pra quem
 * for carregar GA4/Meta Pixel/LinkedIn Insight Tag escutar, e
 * window.tcGetConsent() pra leitura direta.
 *
 * A captura de touch propria (terracheck-attribution.js) NAO passa
 * por este gate -- ver comentario no topo do CookieConsent.jsx.
 */
(function () {
  "use strict";

  var CONSENT_KEY = "tc_consent";
  var CONSENT_VERSION = 1;

  function readConsent() {
    try {
      var raw = window.localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed.version !== CONSENT_VERSION) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(analytics, marketing) {
    var value = {
      analytics: analytics,
      marketing: marketing,
      given_at: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
    } catch (e) {
      // localStorage indisponivel -- consentimento nao persiste entre
      // reloads, mas a pagina nao quebra por isso.
    }
    window.dispatchEvent(new CustomEvent("tc:consent-changed", { detail: value }));
    return value;
  }

  window.tcGetConsent = readConsent;

  function buildBanner() {
    var wrap = document.createElement("div");
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", "Preferências de cookies");
    wrap.style.cssText =
      "position:fixed;left:0;right:0;bottom:0;z-index:9999;" +
      "background:#0d1f16;border-top:1px solid #1c3327;font-family:inherit;";

    var bar = document.createElement("div");
    bar.style.cssText =
      "display:flex;align-items:center;gap:20px;flex-wrap:wrap;" +
      "padding:18px 22px;max-width:1100px;margin:0 auto;";

    var text = document.createElement("p");
    text.style.cssText = "flex:1;min-width:220px;font-size:14px;line-height:1.6;color:#e4ede8;margin:0;";
    text.textContent =
      "Usamos cookies para entender de onde vêm nossas visitas e melhorar o TerraCheck. " +
      "Você pode aceitar, recusar ou escolher o que permitir.";

    var actions = document.createElement("div");
    actions.style.cssText = "display:flex;gap:8px;flex-shrink:0;";

    var btnCustomize = ghostButton("Personalizar");
    var btnReject = ghostButton("Rejeitar");
    var btnAccept = primaryButton("Aceitar");

    actions.appendChild(btnCustomize);
    actions.appendChild(btnReject);
    actions.appendChild(btnAccept);
    bar.appendChild(text);
    bar.appendChild(actions);
    wrap.appendChild(bar);

    var prefsPanel = document.createElement("div");
    prefsPanel.style.cssText =
      "display:none;border-top:1px solid #1c3327;padding:16px 22px;" +
      "max-width:1100px;margin:0 auto;flex-direction:column;gap:12px;";

    var analyticsLabel = checkboxLabel("Analytics (Google Analytics) — entender como o site é usado", true);
    var marketingLabel = checkboxLabel("Marketing (Meta, LinkedIn) — medir resultado de anúncios", true);
    var btnSave = primaryButton("Salvar preferências");
    var saveWrap = document.createElement("div");
    saveWrap.appendChild(btnSave);

    prefsPanel.appendChild(analyticsLabel.wrapper);
    prefsPanel.appendChild(marketingLabel.wrapper);
    prefsPanel.appendChild(saveWrap);
    wrap.appendChild(prefsPanel);

    btnCustomize.addEventListener("click", function () {
      var isOpen = prefsPanel.style.display === "flex";
      prefsPanel.style.display = isOpen ? "none" : "flex";
    });

    btnReject.addEventListener("click", function () {
      writeConsent(false, false);
      wrap.remove();
    });

    btnAccept.addEventListener("click", function () {
      writeConsent(true, true);
      wrap.remove();
    });

    btnSave.addEventListener("click", function () {
      writeConsent(analyticsLabel.checkbox.checked, marketingLabel.checkbox.checked);
      wrap.remove();
    });

    return wrap;
  }

  function ghostButton(labelText) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = labelText;
    b.style.cssText =
      "background:transparent;border:1px solid #3a4f42;color:#c3d3c9;" +
      "font-size:13px;padding:8px 14px;border-radius:8px;cursor:pointer;";
    return b;
  }

  function primaryButton(labelText) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = labelText;
    b.style.cssText =
      "background:#2f9e5c;border:none;color:#06180f;font-weight:500;" +
      "font-size:13px;padding:8px 16px;border-radius:8px;cursor:pointer;";
    return b;
  }

  function checkboxLabel(labelText, checkedDefault) {
    var wrapper = document.createElement("label");
    wrapper.style.cssText = "display:flex;align-items:center;gap:8px;font-size:13px;color:#c3d3c9;";
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checkedDefault;
    wrapper.appendChild(checkbox);
    wrapper.appendChild(document.createTextNode(labelText));
    return { wrapper: wrapper, checkbox: checkbox };
  }

  function main() {
    var existing = readConsent();
    if (!existing) {
      document.body.appendChild(buildBanner());
    } else {
      // Consentimento ja dado numa visita anterior -- redispara o
      // evento pra quem estiver ouvindo (loaders de GA4/Meta/LinkedIn).
      window.dispatchEvent(new CustomEvent("tc:consent-changed", { detail: existing }));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
