# TerraCheck — Como consultar o CAR pelo mapa

Pacote estático, em português brasileiro, preparado em 04/11/2026.

## Publicação

1. Descompacte o ZIP mantendo a estrutura de pastas.
2. Publique **todo o conteúdo** da pasta `terracheck-car/` no caminho `/como-consultar-car-pelo-mapa/` da hospedagem do site. O arquivo `index.html` deve ficar na raiz desse caminho.
3. Confirme que o servidor devolve `text/html; charset=utf-8` para o HTML e `image/svg+xml` para os SVGs. O conteúdo não requer JavaScript ou build.
4. Confirme o carregamento de `assets/css/style.css` e dos cinco SVGs em `assets/imagens/`.
5. Abra no desktop e em celular; teste links externos, CTA e FAQ. Solicite indexação da URL no Search Console e inclua a URL no sitemap do site, se aplicável.

## Conteúdo

- `index.html`: artigo, metas Open Graph, canonical, JSON-LD Article/FAQPage/BreadcrumbList e conteúdo.
- `assets/css/style.css`: CSS responsivo (fontes externas opcionais, com fallback local).
- `assets/imagens/*.svg`: cinco figuras originais (capa + quatro ilustrações técnicas), com descrição ALT e legenda no artigo.

## Cuidados editoriais

- Todas as figuras e exemplos são **didáticos/fictícios**, não evidências de imóveis reais.
- O artigo enfatiza que CAR não constitui título fundiário nem implica aprovação ambiental.
- Não alterar a URL canônica sem atualizar também `og:url`, `mainEntityOfPage`, `BreadcrumbList` e as URLs das imagens no JSON-LD.
- A interface e as informações oficiais podem mudar: revisar periodicamente os links e o texto.
- SVGs foram preparados sem scripts e sem links externos; fontes Google são opcionais e têm fallback.

## Verificação rápida

`unzip -t terracheck-como-consultar-car-pelo-mapa-20261104.zip`

O ZIP não executa instalação, não contém informações pessoais, bibliotecas de terceiros ou imagens que se apresentem como fotografias reais.

## Revisão SEO de 04/11/2026 (v2)

- Removido FAQPage para evitar divergência com FAQ visível. FAQ continua no HTML.
- Metadados de redes sociais usam PNG 1200 × 630; Article aponta variantes 16:9, 4:3 e 1:1.
- Imagens e CSS usam caminhos absolutos sob `/como-consultar-car-pelo-mapa/`. Para testes locais via `file://`, um servidor HTTP local com esse caminho é necessário.
- Links para a plataforma usam `?ref=artigo_car_mapa` (parâmetro neutro, sem UTM). Verificar preservação durante redirecionamentos e configurar medição entre domínios se ambos usam a mesma propriedade GA4.
- Autoria institucional mantida. Substituir por pessoa física apenas após confirmar nome, credenciais e URL pública de perfil.
- Conferir se o servidor faz redirect 301 de `/como-consultar-car-pelo-mapa` para `/como-consultar-car-pelo-mapa/`.
- Executar link-check periódico nos portais oficiais, em especial rotas com `#/`.

## Revisão de atribuição (v3)

- UTMs internas removidas dos três links para `app.terracheck.com.br`.
- Parâmetro neutro `ref=artigo_car_mapa` identifica a origem editorial sem se declarar campanha de aquisição.
- Para atribuição confiável, medir clique em GA4 e validar configuração cross-domain com `_gl` quando ambos compartilham uma propriedade e fluxo de navegação.
- Se a aplicação registrar `ref`, observar tratamento de consentimento e evitar expor dados pessoais no parâmetro.
