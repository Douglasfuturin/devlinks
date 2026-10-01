function applyThemeState() {
  const light = document.documentElement.classList.contains("light")
  const img = document.querySelector("#profile img")

  if (img) {
    const next = light
      ? img.getAttribute("data-avatar-light")
      : img.getAttribute("data-avatar")
    if (next) img.setAttribute("src", next)
  }

  const themeColor = document.querySelector('meta[name="theme-color"]')
  if (themeColor) {
    const next = light
      ? themeColor.getAttribute("data-theme-light") || "#d0d0d0"
      : themeColor.getAttribute("data-theme-dark") || "#2a0246"
    themeColor.setAttribute("content", next)
  }

  const switchEl = document.getElementById("switch")
  if (switchEl) {
    switchEl.setAttribute("aria-checked", light ? "true" : "false")
    switchEl.setAttribute(
      "aria-label",
      light ? "Ativar tema escuro" : "Ativar tema claro"
    )
  }
}

function toggleMode() {
  document.documentElement.classList.toggle("light")

  try {
    localStorage.setItem(
      "devlinks-theme",
      document.documentElement.classList.contains("light") ? "light" : "dark"
    )
  } catch (error) {}

  applyThemeState()
}

function onSwitchKey(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    toggleMode()
  }
}

function trackClick(anchor) {
  const config = window.DEVLINKS
  if (!config || !config.analytics || !config.analytics.enabled) return

  const data = {
    profile: config.profile,
    link: anchor.getAttribute("data-link-id") || "",
  }

  if (config.analytics.vercel && typeof window.va === "function") {
    window.va("event", {
      name: "link_click",
      data: data,
    })
  }

  if (
    config.analytics.plausibleDomain &&
    typeof window.plausible === "function"
  ) {
    window.plausible("link_click", { props: data })
  }
}

document.addEventListener("click", function (event) {
  const anchor = event.target.closest("a[data-link-id]")
  if (!anchor) return
  trackClick(anchor)
})

applyThemeState()
