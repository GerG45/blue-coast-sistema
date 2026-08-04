const authRoot = document.querySelector("#auth-root");
const appRoot = document.querySelector("#app");
const config = window.BLUE_COAST_AUTH || {};
const bootConfig = window.BLUE_COAST_AUTH_BOOT || {};
const accounts = Object.entries(config.accounts || {}).reduce((result, [alias, account]) => {
  const email = String(account?.email || "").trim().toLowerCase();
  if (!email) return result;
  result[alias.toLowerCase()] = { ...account, alias, email };
  return result;
}, {});

let firebaseAuth = null;
let authApi = null;
let applicationLoaded = false;
let sessionMenuOpen = false;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isConfigured() {
  const firebaseConfig = config.firebaseConfig || {};
  return ["apiKey", "authDomain", "projectId", "appId"].every((key) =>
    Boolean(String(firebaseConfig[key] || "").trim())
  );
}

function getAccountByEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  return Object.values(accounts).find((account) => account.email === normalizedEmail) || null;
}

function resolveLoginEmail(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return accounts[normalized]?.email || normalized;
}

function setAuthView(view) {
  document.documentElement.dataset.authState = view;
  document.body?.setAttribute("data-auth-state", view);
}

function renderSetupRequired() {
  setAuthView("setup");
  if (!authRoot) return;
  authRoot.innerHTML = `
    <main class="auth-page" aria-labelledby="auth-title">
      <section class="auth-card auth-card--notice">
        <img class="auth-brand-logo" src="${escapeHtml(new URL("./assets/blue-coast-logo.svg", import.meta.url).href)}" alt="Blue Coast Sistema Hotelero" />
        <p class="auth-eyebrow">Configuración de acceso</p>
        <h1 id="auth-title">Firebase todavía no está vinculado</h1>
        <p>La puerta de acceso está instalada, pero falta asociar el proyecto de Firebase y crear las cuatro cuentas iniciales.</p>
        <div class="auth-notice">El sistema permanece cerrado para evitar publicar una pantalla de acceso incompleta.</div>
      </section>
    </main>
  `;
}

function renderLogin({ message = "", username = "" } = {}) {
  setAuthView("signed-out");
  if (!authRoot) return;
  authRoot.innerHTML = `
    <main class="auth-page" aria-labelledby="auth-title">
      <section class="auth-card">
        <div class="auth-brand-lockup">
          <img class="auth-brand-logo" src="${escapeHtml(new URL("./assets/blue-coast-logo.svg", import.meta.url).href)}" alt="Blue Coast Sistema Hotelero" />
          <div>
            <p class="auth-eyebrow">Acceso operativo</p>
            <h1 id="auth-title">Ingresar al sistema</h1>
            <p>Usá la cuenta asignada para acceder a Blue Coast.</p>
          </div>
        </div>
        <form class="auth-form" data-auth-login-form novalidate>
          <label class="auth-field">
            <span>Usuario o correo</span>
            <input name="username" type="text" autocomplete="username" value="${escapeHtml(username)}" required autofocus />
          </label>
          <label class="auth-field">
            <span>Contraseña</span>
            <input name="password" type="password" autocomplete="current-password" required />
          </label>
          <p class="auth-error" data-auth-error ${message ? "" : "hidden"}>${escapeHtml(message)}</p>
          <button class="auth-submit" type="submit">Ingresar</button>
        </form>
        <p class="auth-security-note">La sesión se conserva únicamente en este navegador hasta que cierres sesión. Para recuperar el acceso, contactá a Administración.</p>
      </section>
    </main>
  `;

  const form = authRoot.querySelector("[data-auth-login-form]");
  form?.addEventListener("submit", handleLoginSubmit);
}

function setFormBusy(form, busy) {
  if (!form) return;
  form.toggleAttribute("aria-busy", busy);
  Array.from(form.elements).forEach((element) => {
    element.disabled = busy;
  });
  const submitButton = form.querySelector(".auth-submit");
  if (submitButton) {
    submitButton.textContent = busy ? "Verificando..." : "Ingresar";
  }
}

function getFriendlyAuthError(error) {
  const code = String(error?.code || "");
  if (["auth/invalid-credential", "auth/user-not-found", "auth/wrong-password"].includes(code)) {
    return "El usuario o la contraseña no son correctos.";
  }
  if (code === "auth/too-many-requests") {
    return "Se realizaron demasiados intentos. Esperá unos minutos y volvé a probar.";
  }
  if (code === "auth/network-request-failed") {
    return "No se pudo conectar con Firebase. Revisá la conexión a Internet.";
  }
  return "No se pudo iniciar sesión. Volvé a intentarlo.";
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const errorBox = form.querySelector("[data-auth-error]");

  if (!username || !password) {
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.textContent = "Completá el usuario y la contraseña.";
    }
    return;
  }

  setFormBusy(form, true);
  if (errorBox) errorBox.hidden = true;
  try {
    await authApi.signInWithEmailAndPassword(
      firebaseAuth,
      resolveLoginEmail(username),
      password
    );
  } catch (error) {
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.textContent = getFriendlyAuthError(error);
    }
    setFormBusy(form, false);
  }
}

function loadApplication() {
  if (applicationLoaded) return;
  const appScript = String(bootConfig.appScript || "").trim();
  if (!appScript) {
    throw new Error("No se configuró el script de inicio del módulo.");
  }
  applicationLoaded = true;
  const script = document.createElement("script");
  script.src = appScript;
  script.async = false;
  script.dataset.authenticatedApplication = "true";
  script.addEventListener("error", () => {
    applicationLoaded = false;
    renderLogin({ message: "No se pudo cargar el sistema. Actualizá la página." });
  });
  document.body.appendChild(script);
}

function isEmbeddedContext() {
  try {
    return window.self !== window.top;
  } catch (error) {
    return true;
  }
}

function renderSessionControl(user, account) {
  document.querySelector("[data-auth-session-control]")?.remove();
  if (isEmbeddedContext()) return;

  const control = document.createElement("div");
  control.className = "auth-session-control";
  control.dataset.authSessionControl = "true";
  control.innerHTML = `
    <button class="auth-session-trigger" type="button" aria-expanded="false" aria-label="Abrir menú de sesión">
      <span aria-hidden="true">${escapeHtml((account?.label || user.email || "U").slice(0, 1).toUpperCase())}</span>
    </button>
    <section class="auth-session-menu" hidden>
      <strong>${escapeHtml(account?.label || "Usuario")}</strong>
      <span>${escapeHtml(account?.role || "Acceso general")}</span>
      <small>${escapeHtml(user.email || "")}</small>
      <button type="button" data-auth-sign-out>Cerrar sesión</button>
    </section>
  `;
  document.body.appendChild(control);

  const trigger = control.querySelector(".auth-session-trigger");
  const menu = control.querySelector(".auth-session-menu");
  trigger?.addEventListener("click", () => {
    sessionMenuOpen = !sessionMenuOpen;
    trigger.setAttribute("aria-expanded", String(sessionMenuOpen));
    menu.hidden = !sessionMenuOpen;
  });
  control.querySelector("[data-auth-sign-out]")?.addEventListener("click", async () => {
    sessionMenuOpen = false;
    await authApi.signOut(firebaseAuth);
    window.location.reload();
  });
}

async function acceptSession(user) {
  const account = getAccountByEmail(user.email);
  if (!account) {
    await authApi.signOut(firebaseAuth);
    renderLogin({ message: "Esta cuenta no está habilitada para Blue Coast." });
    return;
  }

  window.BLUE_COAST_AUTH_SESSION = Object.freeze({
    uid: user.uid,
    email: user.email,
    alias: account.alias,
    label: account.label,
    role: account.role,
    getIdToken: (forceRefresh = false) => user.getIdToken(forceRefresh),
  });
  setAuthView("signed-in");
  authRoot?.replaceChildren();
  if (appRoot) appRoot.hidden = false;
  renderSessionControl(user, account);
  loadApplication();
}

function rejectSession() {
  if (applicationLoaded) {
    window.location.reload();
    return;
  }
  window.BLUE_COAST_AUTH_SESSION = null;
  document.querySelector("[data-auth-session-control]")?.remove();
  if (appRoot) {
    appRoot.hidden = true;
    appRoot.replaceChildren();
  }
  applicationLoaded = false;
  renderLogin();
}

async function startAuthentication() {
  if (!isConfigured()) {
    renderSetupRequired();
    return;
  }

  const [firebaseAppApi, firebaseAuthApi] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"),
  ]);
  authApi = firebaseAuthApi;
  const firebaseApp = firebaseAppApi.initializeApp(config.firebaseConfig);
  firebaseAuth = firebaseAuthApi.getAuth(firebaseApp);
  await firebaseAuthApi.setPersistence(
    firebaseAuth,
    firebaseAuthApi.browserLocalPersistence
  );
  firebaseAuthApi.onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      acceptSession(user);
    } else {
      rejectSession();
    }
  });
}

if (appRoot) appRoot.hidden = true;
setAuthView("checking");
startAuthentication().catch((error) => {
  console.error("No se pudo iniciar Firebase Authentication.", error);
  renderLogin({ message: "No se pudo iniciar el servicio de acceso." });
});
