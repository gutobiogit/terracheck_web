/*
 * terracheck-attribution.js
 *
 * Inclui via <script src="/terracheck-attribution.js" defer></script>
 * em toda pagina da landing (terracheck.com.br).
 *
 * So' dispara quando ha' marcador de campanha na URL (utm_*, gclid,
 * fbclid, li_fat_id) -- navegacao interna sem isso NAO sobrescreve
 * atribuicao ja conhecida. visitor_id nunca e' gerado nem lido aqui --
 * o backend cuida disso via cookie HttpOnly na resposta do /track.
 *
 * AJUSTAR antes de subir: API_BASE precisa apontar pro host real que
 * serve /api/v1/analytics/track a partir do dominio da landing. Se
 * for um host diferente de terracheck.com.br, o backend precisa ter
 * CORS liberado pra essa origem com credentials (ver analytics.py).
 */
(function () {
  "use strict";

  var API_BASE = "https://app.terracheck.com.br/api/v1/analytics"; // AJUSTAR se o host real for outro
  var SESSION_FLAG_KEY = "tc_last_tracked_qs";

  function getParam(params, key) {
    return params.get(key) || null;
  }

  function main() {
    var params = new URLSearchParams(window.location.search);
    var utm = {
      utm_source: getParam(params, "utm_source"),
      utm_medium: getParam(params, "utm_medium"),
      utm_campaign: getParam(params, "utm_campaign"),
      utm_content: getParam(params, "utm_content"),
      utm_term: getParam(params, "utm_term"),
      gclid: getParam(params, "gclid"),
      fbclid: getParam(params, "fbclid"),
      li_fat_id: getParam(params, "li_fat_id"),
    };

    var hasCampaignMarker =
      utm.utm_source || utm.utm_medium || utm.utm_campaign ||
      utm.gclid || utm.fbclid || utm.li_fat_id;
    if (!hasCampaignMarker) {
      return; // sem marcador de campanha -- nao sobrescreve atribuicao conhecida
    }

    // Dedupe local: mesma querystring de campanha dentro da mesma aba
    // nao reenvia (evita reenviar a cada reload/back-forward). Isto e'
    // so' otimizacao -- o servidor deduplica de verdade por touch_id.
    var qs = window.location.search;
    try {
      if (window.sessionStorage.getItem(SESSION_FLAG_KEY) === qs) {
        return;
      }
    } catch (e) {
      // sessionStorage indisponivel (modo privado/bloqueado) -- segue
      // sem dedupe local, o touch_id abaixo ainda protege no servidor
      // se por algum motivo esta funcao rodar 2x.
    }

    var touchId = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : null;
    if (!touchId) {
      return; // navegador sem crypto.randomUUID -- nao envia touch sem id valido
    }

    var payload = {
      touch_id: touchId,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      utm_term: utm.utm_term,
      gclid: utm.gclid,
      fbclid: utm.fbclid,
      li_fat_id: utm.li_fat_id,
      landing_page: window.location.href,
      referrer: document.referrer || null,
    };

    fetch(API_BASE + "/track", {
      method: "POST",
      credentials: "include", // essencial -- e' o que permite o Set-Cookie cross-subdomain funcionar
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true, // sobrevive a navegacao imediata pra outra pagina apos o clique no anuncio
    }).then(function () {
      try {
        window.sessionStorage.setItem(SESSION_FLAG_KEY, qs);
      } catch (e) {
        // ignora -- dedupe local e' so' otimizacao
      }
    }).catch(function (err) {
      // Nunca deixa erro de analytics aparecer pro usuario nem quebrar a pagina.
      if (window.console && console.warn) {
        console.warn("terracheck-attribution: falha ao enviar touch", err);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
