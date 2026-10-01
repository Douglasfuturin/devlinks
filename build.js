const fs = require("fs")
const path = require("path")

const ROOT = __dirname
const PROFILES_DIR = path.join(ROOT, "profiles")
const TEMPLATE_PATH = path.join(ROOT, "template.html")
const MANIFEST_PATH = path.join(ROOT, "generated-profiles.json")
const RESERVED = new Set([
  "assets",
  "profiles",
  "scripts",
  "node_modules",
])

function ion(inner) {
  return `<svg viewBox="0 0 512 512" aria-hidden="true" focusable="false">${inner}</svg>`
}

const ION = {
  "logo-github": ion(
    '<path fill="currentColor" d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z"/>'
  ),
  "logo-instagram": ion(
    '<path fill="currentColor" d="M349.33 69.33a93.62 93.62 0 0193.34 93.34v186.66a93.62 93.62 0 01-93.34 93.34H162.67a93.62 93.62 0 01-93.34-93.34V162.67a93.62 93.62 0 0193.34-93.34h186.66m0-37.33H162.67C90.8 32 32 90.8 32 162.67v186.66C32 421.2 90.8 480 162.67 480h186.66C421.2 480 480 421.2 480 349.33V162.67C480 90.8 421.2 32 349.33 32z"/><path fill="currentColor" d="M377.33 162.67a28 28 0 1128-28 27.94 27.94 0 01-28 28zM256 181.33A74.67 74.67 0 11181.33 256 74.75 74.75 0 01256 181.33m0-37.33a112 112 0 10112 112 112 112 0 00-112-112z"/>'
  ),
  "logo-linkedin": ion(
    '<path fill="currentColor" d="M444.17 32H70.28C49.85 32 32 46.7 32 66.89v374.72C32 461.91 49.85 480 70.28 480h373.78c20.54 0 35.94-18.21 35.94-38.39V66.89C480.12 46.7 464.6 32 444.17 32zm-273.3 373.43h-64.18V205.88h64.18zM141 175.54h-.46c-20.54 0-33.84-15.29-33.84-34.43 0-19.49 13.65-34.42 34.65-34.42s33.85 14.82 34.31 34.42c-.01 19.14-13.31 34.43-34.66 34.43zm264.43 229.89h-64.18V296.32c0-26.14-9.34-44-32.56-44-17.74 0-28.24 12-32.91 23.69-1.75 4.2-2.22 9.92-2.22 15.76v113.66h-64.18V205.88h64.18v27.77c9.34-13.3 23.93-32.44 57.88-32.44 42.13 0 74 27.77 74 87.64z"/>'
  ),
  "logo-youtube": ion(
    '<path fill="currentColor" d="M508.64 148.79c0-45-33.1-81.2-74-81.2C379.24 65 322.74 64 265 64h-18c-57.6 0-114.2 1-169.6 3.6C36.6 67.6 3.5 104 3.5 149 1 184.59-.06 220.19 0 255.79q-.15 53.4 3.4 106.9c0 45 33.1 81.5 73.9 81.5 58.2 2.7 117.9 3.9 178.6 3.8q91.2.3 178.6-3.8c40.9 0 74-36.5 74-81.5 2.4-35.7 3.5-71.3 3.4-107q.34-53.4-3.26-106.9zM207 353.89v-196.5l145 98.2z"/>'
  ),
  "logo-tiktok": ion(
    '<path fill="currentColor" d="M412.19 118.66a109.27 109.27 0 01-9.45-5.5 132.87 132.87 0 01-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14 23.9 350 16 350.13 16h-82.44v318.78c0 4.28 0 8.51-.18 12.69 0 .52-.05 1-.08 1.56 0 .23 0 .47-.05.71v.18a70 70 0 01-35.22 55.56 68.8 68.8 0 01-34.11 9c-38.41 0-69.54-31.32-69.54-70s31.13-70 69.54-70a68.9 68.9 0 0121.41 3.39l.1-83.94a153.14 153.14 0 00-118 34.52 161.79 161.79 0 00-35.3 43.53c-3.48 6-16.61 30.11-18.2 69.24-1 22.21 5.67 45.22 8.85 54.73v.2c2 5.6 9.75 24.71 22.38 40.82A167.53 167.53 0 00115 470.66v-.2l.2.2c39.91 27.12 84.16 25.34 84.16 25.34 7.66-.31 33.32 0 62.46-13.81 32.32-15.31 50.72-38.12 50.72-38.12a158.46 158.46 0 0027.64-45.93c7.46-19.61 9.95-43.13 9.95-52.53V176.49c1 .6 14.32 9.41 14.32 9.41s19.19 12.3 49.13 20.31c21.48 5.7 50.42 6.9 50.42 6.9v-81.84c-10.14 1.1-30.73-2.1-51.81-12.61z"/>'
  ),
  "logo-whatsapp": ion(
    '<path fill="currentColor" fill-rule="evenodd" d="M414.73 97.1A222.14 222.14 0 00256.94 32C134 32 33.92 131.58 33.87 254a220.61 220.61 0 0029.78 111L32 480l118.25-30.87a223.63 223.63 0 00106.6 27h.09c122.93 0 223-99.59 223.06-222A220.18 220.18 0 00414.73 97.1zM256.94 438.66h-.08a185.75 185.75 0 01-94.36-25.72l-6.77-4-70.17 18.32 18.73-68.09-4.41-7A183.46 183.46 0 0171.53 254c0-101.73 83.21-184.5 185.48-184.5a185 185 0 01185.33 184.64c-.04 101.74-83.21 184.52-185.4 184.52zm101.69-138.19c-5.57-2.78-33-16.2-38.08-18.05s-8.83-2.78-12.54 2.78-14.4 18-17.65 21.75-6.5 4.16-12.07 1.38-23.54-8.63-44.83-27.53c-16.57-14.71-27.75-32.87-31-38.42s-.35-8.56 2.44-11.32c2.51-2.49 5.57-6.48 8.36-9.72s3.72-5.56 5.57-9.26.93-6.94-.46-9.71-12.54-30.08-17.18-41.19c-4.53-10.82-9.12-9.35-12.54-9.52-3.25-.16-7-.2-10.69-.2a20.53 20.53 0 00-14.86 6.94c-5.11 5.56-19.51 19-19.51 46.28s20 53.68 22.76 57.38 39.3 59.73 95.21 83.76a323.11 323.11 0 0031.78 11.68c13.35 4.22 25.5 3.63 35.1 2.2 10.71-1.59 33-13.42 37.63-26.38s4.64-24.06 3.25-26.37-5.11-3.71-10.69-6.48z"/>'
  ),
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"))
}

function siteBase(url) {
  const trimmed = String(url || "")
    .trim()
    .replace(/\/+$/, "")
  if (!/^https?:\/\/[^\s]+$/.test(trimmed)) {
    throw new Error(
      "site.json: siteUrl precisa ser uma URL http(s) absoluta, sem barra no final."
    )
  }
  return trimmed
}

function safeCssValue(value, label) {
  const text = String(value).trim()
  if (!/^[#(),.%\s\w+/-]+$/.test(text)) {
    throw new Error(`${label}: cor inválida (${text})`)
  }
  return text
}

function isHttp(url) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch (error) {
    return false
  }
}

function applyUtm(url, profileId, utm) {
  if (!url || url.startsWith("#") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url
  }
  let parsed
  try {
    parsed = new URL(url)
  } catch (error) {
    return url
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return url
  const source = (utm && utm.source) || "instagram"
  const medium = (utm && utm.medium) || "bio"
  if (!parsed.searchParams.has("utm_source")) {
    parsed.searchParams.set("utm_source", source)
  }
  if (!parsed.searchParams.has("utm_medium")) {
    parsed.searchParams.set("utm_medium", medium)
  }
  if (!parsed.searchParams.has("utm_campaign")) {
    parsed.searchParams.set("utm_campaign", profileId)
  }
  return parsed.toString()
}

function outboundHref(link, profileId, utm) {
  const raw = String(link.url || "").trim()
  if (link.utm === false) return raw
  return applyUtm(raw, profileId, utm)
}

function assertSafeUrl(url, label) {
  const value = String(url || "").trim()
  if (!value) throw new Error(`${label}: url vazia`)
  if (value === "#") return
  if (/^#[a-z0-9-]+$/.test(value)) return
  let parsed
  try {
    parsed = new URL(value)
  } catch (error) {
    throw new Error(`${label}: URL inválida (${value})`)
  }
  if (!["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)) {
    throw new Error(`${label}: protocolo não permitido (${parsed.protocol})`)
  }
}

function assertId(id, label) {
  if (!/^[a-z0-9-]+$/.test(id || "")) {
    throw new Error(`${label}: id "${id}" precisa ser minúsculo, com números e hífen.`)
  }
  if (RESERVED.has(id)) {
    throw new Error(`${label}: id "${id}" é reservado.`)
  }
}

function assertProfile(profile, filename) {
  assertId(profile.id, filename)
  if (profile.id !== filename) {
    throw new Error(`${filename}: o id "${profile.id}" precisa ser igual ao nome do arquivo.`)
  }
  if (!profile.profile || !profile.profile.name) {
    throw new Error(`${filename}: profile.name é obrigatório.`)
  }
  if (!profile.seo || !profile.seo.title || !profile.seo.description) {
    throw new Error(`${filename}: seo.title e seo.description são obrigatórios.`)
  }
  const seen = new Set()
  for (const section of profile.sections || []) {
    assertId(section.id, `${filename} seção`)
    if (!section.title) throw new Error(`${filename}: seção ${section.id} sem título.`)
    if (section.layout && !["list", "social"].includes(section.layout)) {
      throw new Error(`${filename}: layout "${section.layout}" inválido.`)
    }
    for (const link of section.links || []) {
      const label = `${filename}/${link.id || "?"}`
      assertId(link.id, label)
      if (seen.has(link.id)) throw new Error(`${label}: id de link repetido.`)
      seen.add(link.id)
      if (!link.title) throw new Error(`${label}: title é obrigatório.`)
      assertSafeUrl(link.url, label)
      if (typeof link.enabled !== "boolean") {
        throw new Error(`${label}: enabled precisa ser true ou false.`)
      }
    }
  }
}

function iconMarkup(icon, label) {
  if (!icon) return ""
  if (ION[icon]) {
    return `<span class="link-icon" aria-hidden="true">${ION[icon]}</span>`
  }
  if (/^[a-z0-9-]+$/.test(icon)) {
    throw new Error(
      `${label}: ícone "${icon}" desconhecido. Use um emoji ou: ${Object.keys(ION).join(", ")}`
    )
  }
  return `<span class="link-icon" aria-hidden="true">${esc(icon)}</span>`
}

function renderListLink(link, profileId, utm) {
  const href = outboundHref(link, profileId, utm)
  const external = isHttp(href)
  const finalHref = href === "#" ? `#${link.id}` : href
  const classAttr = link.highlight ? ' class="highlight"' : ""
  const blank = external ? ' target="_blank" rel="noopener noreferrer"' : ""
  const desc = link.description
    ? `\n              <span class="link-desc">${esc(link.description)}</span>`
    : ""
  const badge = link.badge ? `\n            <span class="badge">${esc(link.badge)}</span>` : ""
  const extra = external
    ? `\n            <span class="sr-only"> (abre em nova aba)</span>`
    : ""
  return `        <li>
          <a id="${esc(link.id)}" href="${esc(finalHref)}" data-link-id="${esc(link.id)}"${classAttr}${blank}>
            ${iconMarkup(link.icon, link.id)}
            <span class="link-copy">
              <span class="link-title">${esc(link.title)}</span>${desc}
            </span>${badge}${extra}
          </a>
        </li>`
}

function renderSocialLink(link, profileId, utm) {
  const href = outboundHref(link, profileId, utm)
  const external = isHttp(href)
  const finalHref = href === "#" ? `#${link.id}` : href
  const blank = external ? ' target="_blank" rel="me noopener noreferrer"' : ""
  const graphic = ION[link.icon]
    ? ION[link.icon]
    : iconMarkup(link.icon, link.id)
  return `        <a href="${esc(finalHref)}" data-link-id="${esc(link.id)}" aria-label="${esc(link.title)} (abre em nova aba)"${blank}>
          ${graphic}
        </a>`
}

function visibleLinks(section) {
  return (section.links || []).filter((link) => link.enabled)
}

function renderSections(profile) {
  const utm = profile.utm || {}
  const lists = []
  const socials = []
  for (const section of profile.sections || []) {
    const links = visibleLinks(section)
    if (!links.length) continue
    const layout = section.layout || "list"
    if (layout === "social") {
      socials.push(`      <section class="social-section" aria-labelledby="secao-${esc(section.id)}">
        <h2 id="secao-${esc(section.id)}" class="section-title">${esc(section.title)}</h2>
        <div id="social-links">
${links.map((link) => renderSocialLink(link, profile.id, utm)).join("\n")}
        </div>
      </section>`)
    } else {
      lists.push(`      <section aria-labelledby="secao-${esc(section.id)}">
        <h2 id="secao-${esc(section.id)}" class="section-title">${esc(section.title)}</h2>
        <ul>
${links.map((link) => renderListLink(link, profile.id, utm)).join("\n")}
        </ul>
      </section>`)
    }
  }
  return {
    lists: lists.join("\n"),
    social: socials.join("\n"),
  }
}

function themeBlock(theme) {
  if (!theme) return ""
  const map = {
    textColor: "--text-color",
    strokeColor: "--stroke-color",
    surfaceColor: "--surface-color",
    surfaceColorHover: "--surface-color-hover",
    highlightColor: "--highlight-color",
    accent: "--accent",
    accentText: "--accent-text",
    mark: "--mark",
    pageBg: "--page-bg",
    bgUrl: "--bg-url",
    sectionColor: "--section-color",
    subtitleColor: "--subtitle-color",
  }
  const lines = (group, label) => {
    if (!group) return ""
    return Object.entries(map)
      .filter(([key]) => group[key])
      .map(([key, cssVar]) => `      ${cssVar}: ${safeCssValue(group[key], label + " " + key)};`)
      .join("\n")
  }
  const dark = lines(theme, "theme")
  const light = lines(theme.light, "theme.light")
  if (!dark && !light) return ""
  return `<style id="profile-theme">
    :root {
${dark}
    }
    .light {
${light}
    }
  </style>`
}

function sameAs(profile) {
  const urls = []
  for (const section of profile.sections || []) {
    if ((section.layout || "list") !== "social") continue
    for (const link of visibleLinks(section)) {
      if (isHttp(link.url)) urls.push(link.url.trim())
    }
  }
  return urls
}

function jsonLdScript(entity) {
  const json = JSON.stringify(entity).replace(/</g, "\\u003c")
  return `<script type="application/ld+json">${json}</script>`
}

function profileJsonLd(profile, canonical) {
  const kind = profile.profile.kind === "organization" ? "Organization" : "Person"
  const main = {
    "@type": kind,
    name: profile.profile.name,
    description: profile.profile.bio || profile.seo.description,
    url: canonical,
  }
  if (profile.profile.handle) main.alternateName = profile.profile.handle
  const social = sameAs(profile)
  if (social.length) main.sameAs = social
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    inLanguage: "pt-BR",
    name: profile.seo.title,
    description: profile.seo.description,
    url: canonical,
    mainEntity: main,
  }
}

function fill(template, map) {
  let html = template
  for (const [key, value] of Object.entries(map)) {
    html = html.split(`@@${key}@@`).join(value == null ? "" : String(value))
  }
  const leftover = html.match(/@@[A-Z0-9_]+@@/)
  if (leftover) throw new Error(`Token sem valor: ${leftover[0]}`)
  return html
}

function asset(prefix, file) {
  return `${prefix}${String(file).replace(/^\.?\//, "")}`
}

function analyticsHead(analytics) {
  if (!analytics || !analytics.enabled) return ""
  const parts = []
  if (analytics.vercel) {
    parts.push(`    <script>
      window.va =
        window.va ||
        function () {
          ;(window.vaq = window.vaq || []).push(arguments)
        }
    </script>
    <script defer src="/_vercel/insights/script.js"></script>`)
  }
  if (analytics.plausibleDomain) {
    parts.push(
      `    <script defer data-domain="${esc(analytics.plausibleDomain)}" src="https://plausible.io/js/script.js"></script>`
    )
  }
  return parts.join("\n")
}

function analyticsBoot(profileId, analytics) {
  const payload = {
    profile: profileId,
    analytics: {
      enabled: Boolean(analytics && analytics.enabled),
      vercel: Boolean(analytics && analytics.vercel),
      plausibleDomain: (analytics && analytics.plausibleDomain) || "",
    },
  }
  return `<script>window.DEVLINKS = ${JSON.stringify(payload).replace(/</g, "\\u003c")}</script>`
}

function pageMap(options) {
  const avatar = asset(options.prefix, options.avatar)
  const avatarLight = asset(options.prefix, options.avatarLight || options.avatar)
  return {
    TITLE: esc(options.title),
    DESCRIPTION: esc(options.description),
    CANONICAL: esc(options.canonical),
    OG_TYPE: esc(options.ogType || "website"),
    OG_IMAGE: esc(options.ogImage),
    OG_IMAGE_ALT: esc(options.ogImageAlt),
    SITE_NAME: esc(options.siteName),
    ASSET_PREFIX: options.prefix,
    AVATAR: esc(avatar),
    AVATAR_LIGHT: esc(avatarLight),
    AVATAR_ALT: esc(options.avatarAlt),
    AVATAR_CLASS: options.avatarFit === "logo" ? "logo" : "avatar",
    AVATAR_SIZE:
      options.avatarFit === "logo" ? 'width="320" height="246"' : 'width="112" height="112"',
    FAVICON: esc(asset(options.prefix, options.favicon || "assets/favicon.svg")),
    FAVICON_TYPE: esc(options.faviconType || "image/svg+xml"),
    THEME_COLOR: esc(options.themeColor || "#2a0246"),
    THEME_COLOR_LIGHT: esc(options.themeColorLight || "#d0d0d0"),
    NAME: esc(options.name),
    HANDLE: options.handle ? `<p id="handle">${esc(options.handle)}</p>` : "",
    SUBTITLE: options.subtitle ? `<p id="subtitle">${esc(options.subtitle)}</p>` : "",
    BIO: options.bio ? `<p id="bio">${esc(options.bio)}</p>` : "",
    LINKS: options.links,
    SOCIAL: options.social,
    FOOTER: esc(options.footer),
    JSON_LD: options.jsonLd,
    THEME_STYLE: options.themeStyle || "",
    ANALYTICS_HEAD: analyticsHead(options.analytics),
    ANALYTICS_BOOT: analyticsBoot(options.profileId, options.analytics),
  }
}

function requireOg(file) {
  const full = path.join(ROOT, file)
  if (!fs.existsSync(full)) {
    throw new Error(`Falta ${file}. Rode: python3 scripts/og-images.py`)
  }
}

function loadProfiles() {
  const files = fs
    .readdirSync(PROFILES_DIR)
    .filter((name) => name.endsWith(".json"))
    .sort()
  if (!files.length) throw new Error("Nenhum arquivo em profiles/.")
  const profiles = files.map((name) => {
    const profile = readJson(path.join(PROFILES_DIR, name))
    assertProfile(profile, name.replace(/\.json$/, ""))
    return profile
  })
  profiles.sort(
    (a, b) => (a.order ?? 100) - (b.order ?? 100) || a.id.localeCompare(b.id)
  )
  return profiles
}

function collectTodos(profiles) {
  const lines = []
  for (const profile of profiles) {
    for (const note of profile.todos || []) lines.push(`${profile.id}: ${note}`)
    for (const section of profile.sections || []) {
      for (const link of section.links || []) {
        if (link.todo) lines.push(`${profile.id}/${link.id}: ${link.todo}`)
      }
    }
  }
  return lines
}

function cleanRemoved(currentIds) {
  if (!fs.existsSync(MANIFEST_PATH)) return
  const previous = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"))
  for (const id of previous) {
    if (currentIds.includes(id) || RESERVED.has(id)) continue
    const dir = path.join(ROOT, id)
    const index = path.join(dir, "index.html")
    if (!fs.existsSync(index)) continue
    const html = fs.readFileSync(index, "utf8")
    if (!html.includes("Página gerada por build.js")) continue
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

function writeText(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents)
}

function build() {
  const site = readJson(path.join(ROOT, "site.json"))
  const base = siteBase(site.siteUrl)
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8")
  const profiles = loadProfiles()
  const analytics = site.analytics || {}
  cleanRemoved(profiles.map((profile) => profile.id))

  requireOg("assets/og-home.png")
  const homeSections = renderSections({
    id: "home",
    utm: {},
    sections: [
      {
        id: "perfis",
        title: site.home.sectionTitle,
        layout: "list",
        links: profiles.map((profile) => ({
          id: `perfil-${profile.id}`,
          title: profile.navTitle || profile.profile.name,
          description: profile.navDescription || profile.profile.bio || "",
          url: `${profile.id}/`,
          icon: profile.navIcon || "",
          badge: "",
          highlight: false,
          enabled: true,
          utm: false,
        })),
      },
    ],
  })

  const homeCanonical = `${base}/`
  const homeHtml = fill(
    template,
    pageMap({
      prefix: "./",
      title: site.home.title,
      description: site.home.description,
      canonical: homeCanonical,
      ogType: "website",
      ogImage: `${base}/assets/og-home.png`,
      ogImageAlt: site.home.ogImageAlt,
      siteName: site.home.name,
      avatar: site.home.avatar,
      avatarAlt: site.home.avatarAlt,
      name: site.home.name,
      handle: "",
      bio: site.home.bio,
      links: homeSections.lists,
      social: homeSections.social,
      footer: site.home.footer,
      profileId: "home",
      analytics,
      themeStyle: "",
      jsonLd: jsonLdScript({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        inLanguage: "pt-BR",
        name: site.home.title,
        description: site.home.description,
        url: homeCanonical,
        hasPart: profiles.map((profile) => ({
          "@type": "ProfilePage",
          name: profile.profile.name,
          url: `${base}/${profile.id}/`,
        })),
      }),
    })
  )
  writeText(path.join(ROOT, "index.html"), homeHtml)

  for (const profile of profiles) {
    requireOg(`assets/og-${profile.id}.png`)
    const canonical = `${base}/${profile.id}/`
    const sections = renderSections(profile)
    const html = fill(
      template,
      pageMap({
        prefix: "../",
        title: profile.seo.title,
        description: profile.seo.description,
        canonical,
        ogType: profile.seo.type || "website",
        ogImage: `${base}/assets/og-${profile.id}.png`,
        ogImageAlt: profile.seo.imageAlt || profile.seo.title,
        siteName: profile.seo.siteName || profile.profile.name,
        avatar: profile.profile.avatar,
        avatarLight: profile.profile.avatarLight,
        avatarAlt: profile.profile.avatarAlt || profile.profile.name,
        avatarFit: profile.profile.avatarFit,
        favicon: profile.profile.favicon,
        faviconType: profile.profile.faviconType,
        subtitle: profile.profile.subtitle,
        themeColor: profile.theme && profile.theme.themeColor,
        themeColorLight: profile.theme && profile.theme.light && profile.theme.light.themeColor,
        name: profile.profile.name,
        handle: profile.profile.handle,
        bio: profile.profile.bio,
        links: sections.lists,
        social: sections.social,
        footer: profile.profile.footer || profile.profile.name,
        profileId: profile.id,
        analytics,
        themeStyle: themeBlock(profile.theme),
        jsonLd: jsonLdScript(profileJsonLd(profile, canonical)),
      })
    )
    writeText(path.join(ROOT, profile.id, "index.html"), html)
  }

  const urls = [homeCanonical, ...profiles.map((profile) => `${base}/${profile.id}/`)]
  writeText(
    path.join(ROOT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((url) => `  <url><loc>${esc(url)}</loc></url>`)
      .join("\n")}\n</urlset>\n`
  )
  writeText(
    path.join(ROOT, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`
  )
  writeText(MANIFEST_PATH, `${JSON.stringify(profiles.map((profile) => profile.id), null, 2)}\n`)

  assertBuilt(profiles)
  const todos = collectTodos(profiles)
  console.log(`Páginas geradas: / e ${profiles.map((profile) => "/" + profile.id + "/").join(" ")}`)
  if (todos.length) {
    console.log("Pendências (não aparecem na página):")
    for (const line of todos) console.log(`- ${line}`)
  }
}

function assertBuilt(profiles) {
  const home = fs.readFileSync(path.join(ROOT, "index.html"), "utf8")
  const douglas = fs.readFileSync(path.join(ROOT, "douglasdev", "index.html"), "utf8")
  const espanhol = fs.readFileSync(path.join(ROOT, "espanhol", "index.html"), "utf8")

  const expect = (html, text, message) => {
    if (!html.includes(text)) throw new Error(message)
  }
  const reject = (html, text, message) => {
    if (html.includes(text)) throw new Error(message)
  }

  expect(home, 'href="douglasdev/"', "Home sem link para /douglasdev/")
  expect(home, 'href="espanhol/"', "Home sem link para /espanhol/")
  expect(home, "Escolha o perfil da bio do Instagram.", "Home sem a chamada em pt-BR")
  expect(douglas, "utm_source=instagram", "UTM source ausente em /douglasdev/")
  expect(douglas, "utm_medium=bio", "UTM medium ausente em /douglasdev/")
  expect(douglas, "utm_campaign=douglasdev", "UTM campaign ausente em /douglasdev/")
  expect(
    douglas,
    "https://darkpagesai.vercel.app/?utm_source=instagram&amp;utm_medium=bio&amp;utm_campaign=douglasdev",
    "Dark Pages sem UTM"
  )
  expect(douglas, 'href="#curso-chuteiras"', "Placeholder de chuteiras deveria continuar #")
  reject(douglas, "utm_campaign=douglasdev#", "UTM grudou num link interno")
  reject(douglas, "curso-chuteiras?utm", "Placeholder de chuteiras não pode levar UTM")
  expect(douglas, "https://instagram.com/o.douglas.dev?utm_source=instagram", "Instagram sem UTM")
  expect(
    douglas,
    "https://github.com/Douglasfuturin?utm_source=instagram",
    "GitHub sem UTM"
  )
  reject(douglas, "Kit Sobrevivência", "Curso de espanhol vazou para /douglasdev/")
  expect(espanhol, "Kit Sobrevivência", "Kit ausente")
  expect(espanhol, ">Flashcards<", "Flashcards ausente")
  expect(espanhol, "Fluência na Prática", "Fluência ausente")
  expect(espanhol, "Morar e Trabalhar na Espanha", "Morar e trabalhar ausente")
  expect(espanhol, "R$19,90", "Preço do kit ausente")
  reject(espanhol, "R$9,90", "Preço antigo do kit ainda está na página")
  expect(espanhol, "R$47", "Preço dos flashcards ausente")
  expect(espanhol, "R$97", "Preço de fluência ausente")
  expect(espanhol, "R$197", "Preço de morar e trabalhar ausente")
  expect(espanhol, "GRÁTIS", "Selo do material grátis ausente")
  expect(
    espanhol,
    'href="https://lastlink.com/p/CA990C2E4/checkout-payment?utm_source=instagram&amp;utm_medium=bio&amp;utm_campaign=espanhol"',
    "Checkout do kit sem UTM da página"
  )
  expect(
    espanhol,
    'href="https://lastlink.com/p/CC267EA60/checkout-payment?utm_source=instagram&amp;utm_medium=bio&amp;utm_campaign=espanhol"',
    "Checkout dos flashcards sem UTM da página"
  )
  expect(
    espanhol,
    'href="https://lastlink.com/p/CE3770193/checkout-payment?utm_source=instagram&amp;utm_medium=bio&amp;utm_campaign=espanhol"',
    "Checkout de Fluência na Prática sem UTM da página"
  )
  expect(
    espanhol,
    'href="https://lastlink.com/p/CBDB5423A/checkout-payment?utm_source=instagram&amp;utm_medium=bio&amp;utm_campaign=espanhol"',
    "Checkout de Morar e Trabalhar sem UTM da página"
  )
  expect(espanhol, 'class="highlight"', "Destaque dos flashcards ausente")
  expect(espanhol, "--accent: #fdba01;", "Amarelo da marca ausente")
  expect(espanhol, "--mark: #dd1014;", "Vermelho da Espanha ausente")
  expect(espanhol, "--page-bg: #031228;", "Azul-marinho da marca ausente")
  expect(espanhol, "Espanhol do Brasileiro", "Nome da marca ausente")
  expect(espanhol, "FLASHCARDS", "Subtítulo FLASHCARDS ausente")
  expect(espanhol, "Professor de Espanhol", "Bônus do tutor ausente")
  expect(espanhol, "assets/espanhol/logo.png", "Logo ausente no cabeçalho")
  expect(espanhol, "assets/espanhol/favicon.png", "Favicon da marca ausente")
  expect(espanhol, 'class="logo"', "Logo sem a classe de cabeçalho")
  reject(espanhol, "Rumo à Espanha", "Nome antigo ainda está na página")
  reject(home, "Rumo à Espanha", "Nome antigo ainda está na home")
  reject(espanhol, "darkpagesai", "Dark Pages vazou para /espanhol/")
  expect(espanhol, ">@espanhol.do.brasileiro<", "Arroba do Instagram ausente")
  expect(
    espanhol,
    'href="https://www.instagram.com/espanhol.do.brasileiro/?utm_source=instagram&amp;utm_medium=bio&amp;utm_campaign=espanhol"',
    "Link do Instagram sem UTM da página"
  )
  reject(espanhol, "TODO", "Texto de TODO vazou para o HTML")
  reject(douglas, "TODO", "Texto de TODO vazou para o HTML")
  reject(home, "TODO", "Texto de TODO vazou para a home")
  reject(douglas, "maykbrito", "Link antigo do template ainda está na página")
  reject(douglas, "Rocketseat", "Crédito antigo ainda está na página")
  expect(douglas, 'lang="pt-BR"', "Idioma da página incorreto")
  expect(espanhol, 'property="og:locale" content="pt_BR"', "Open Graph sem pt_BR")

  const kept = applyUtm(
    "https://example.com/curso?utm_source=outro",
    "douglasdev",
    { source: "instagram", medium: "bio" }
  )
  if (!kept.includes("utm_source=outro") || !kept.includes("utm_campaign=douglasdev")) {
    throw new Error("UTM existente foi sobrescrito ou a campanha não entrou")
  }
  if (applyUtm("#curso", "douglasdev", {}) !== "#curso") {
    throw new Error("UTM entrou em link #")
  }
  if (applyUtm("mailto:a@b.com", "douglasdev", {}) !== "mailto:a@b.com") {
    throw new Error("UTM entrou em mailto")
  }
  const espanholCampaign = applyUtm("https://lastlink.example/checkout", "espanhol", {
    source: "instagram",
    medium: "bio",
  })
  if (
    espanholCampaign !==
    "https://lastlink.example/checkout?utm_source=instagram&utm_medium=bio&utm_campaign=espanhol"
  ) {
    throw new Error(`Campanha do espanhol incorreta: ${espanholCampaign}`)
  }
  const analyticsOn = analyticsHead({
    enabled: true,
    vercel: true,
    plausibleDomain: "links.exemplo.com",
  })
  if (!analyticsOn.includes("/_vercel/insights/script.js")) {
    throw new Error("snippet da Vercel ausente")
  }
  if (!analyticsOn.includes('data-domain="links.exemplo.com"')) {
    throw new Error("snippet do Plausible ausente")
  }
  if (analyticsHead({ enabled: false, vercel: true, plausibleDomain: "x" }) !== "") {
    throw new Error("analytics desligado ainda injeta script")
  }

  for (const profile of profiles) {
    if (!fs.existsSync(path.join(ROOT, profile.id, "index.html"))) {
      throw new Error(`Página de ${profile.id} não foi gerada`)
    }
  }
}

build()
