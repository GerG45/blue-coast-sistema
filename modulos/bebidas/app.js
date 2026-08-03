const STORAGE_KEY = "solanas-comandero-state-v5";
const CHECKIN_STORAGE_KEY = "solanas-checkin-state-v2";
const LEGACY_STORAGE_KEYS = [
  "solanas-comandero-state-v1",
  "solanas-comandero-state-v2",
  "solanas-comandero-state-v3",
  "solanas-comandero-state-v4",
];
const RESET_MARKER_KEY = "solanas-comandero-reset-2026-04-03-catalogo-base-nuevo";
const STOCK_SYNC_MARKER_KEY = "solanas-comandero-stock-sync-2026-05-15-stock-30-active-only";
const TEST_CLEANUP_MARKER_KEY = "solanas-comandero-test-cleanup-2026-04-05-checkpoint-real";
const DRIVER_COORDINATOR_PILOT_RESET_MARKER_KEY =
  "solanas-comandero-driver-coordinator-pilot-reset-2026-04-05";
const DRIVER_COORDINATOR_REBALANCE_MARKER_KEY =
  "solanas-comandero-driver-coordinator-rebalance-2026-04-04-ajuste-1";
const MOVEMENT_CLEANUP_MARKER_KEY =
  "solanas-comandero-movement-cleanup-2026-05-06-v1";
const SNAPSHOT_LIMIT = 8;
const ROOM_COUNT = 32;
const APP_QUERY = new URLSearchParams(window.location.search);
const SHELL_LAYOUT = APP_QUERY.get("layout") === "shell";
const SYSTEM_EMBEDDED = APP_QUERY.get("embed") === "system";
const SYSTEM_CHROME = SHELL_LAYOUT || SYSTEM_EMBEDDED;
const CATALOG_ONLY_VIEW = APP_QUERY.get("view") === "catalog";
const LOGO_URL = new URL("../logo-solanas.png", window.location.href).href;
const SIDEBAR_ICON_URLS = Object.freeze({
  menu: new URL("../../assets/sidebar-icons/dashboard.svg", window.location.href).href,
  reservas: new URL("../../assets/sidebar-icons/reservas.svg", window.location.href).href,
  checkin: new URL("../../assets/sidebar-icons/check-in.svg", window.location.href).href,
  bebidas: new URL("../../assets/sidebar-icons/bebidas.svg", window.location.href).href,
  checkout: new URL("../../assets/sidebar-icons/check-out.svg", window.location.href).href,
  cajas: new URL("../../assets/sidebar-icons/cajas.svg", window.location.href).href,
  registro: new URL("../../assets/sidebar-icons/book.svg", window.location.href).href,
  inventario: new URL("../../assets/sidebar-icons/package.svg", window.location.href).href,
  empleados: new URL("../../assets/sidebar-icons/empleados.svg", window.location.href).href,
});
const SIDEBAR_ICON_LIGHT_URLS = Object.freeze({
  menu: new URL("../../assets/sidebar-icons/light/dashboard.svg", window.location.href).href,
  reservas: new URL("../../assets/sidebar-icons/light/reservas.svg", window.location.href).href,
  checkin: new URL("../../assets/sidebar-icons/light/check-in.svg", window.location.href).href,
  bebidas: new URL("../../assets/sidebar-icons/light/bebidas.svg", window.location.href).href,
  checkout: new URL("../../assets/sidebar-icons/light/check-out.svg", window.location.href).href,
  cajas: new URL("../../assets/sidebar-icons/light/cajas.svg", window.location.href).href,
  registro: new URL("../../assets/sidebar-icons/light/book.svg", window.location.href).href,
  inventario: new URL("../../assets/sidebar-icons/light/package.svg", window.location.href).href,
  empleados: new URL("../../assets/sidebar-icons/light/empleados.svg", window.location.href).href,
});
const SHELL_SIDEBAR_ITEMS = Object.freeze([
  { key: "menu", label: "Dashboard" },
  { key: "reservas", label: "Reservas" },
  { key: "checkin", label: "Check-in" },
  { key: "bebidas", label: "Bebidas" },
  { key: "checkout", label: "Check-out" },
  { key: "cajas", label: "Cajas" },
  { key: "registro", label: "Libro de huéspedes", fallback: "LR" },
  { key: "inventario", label: "Stock e Inventario", fallback: "ST" },
  { key: "empleados", label: "Empleados", fallback: "EM" },
]);
const BLUE_COAST_LOGO_URL = new URL("../../assets/blue-coast-logo.svg", window.location.href).href;
const SHELL_HERO_ICON_URL = SIDEBAR_ICON_URLS.bebidas;
const SIDEBAR_PREF_KEY = "bluecoast-sidebar-collapsed-v1";
const THEME_PREF_KEY = "bluecoast-theme-v1";
const TITLE_FONT_URL = new URL("./fonts/libre-baskerville-bold.ttf", window.location.href).href;
const PRINT_FRAME_ID = "solanas-print-frame";
const APP_VERSION = 5;
const PAYMENT_METHOD_LABELS = {
  cash: "Efectivo",
  transfer: "Transferencia bancaria",
  stay: "Abona al final de la estadía",
  unknown: "Sin definir",
};
const STAFF_MEMBER_SEED = [
  "Valeria",
  "Valentina",
  "Gisela",
  "Angel",
  "Pochi",
  "Ramon",
  "Anabel",
  "Maria",
];

const DRIVER_COORDINATOR_GROUP_SEED = ["Grupo activo"];
const DRIVER_COORDINATOR_MEMBER_SEED = [
  "Coordinadora Marta",
  "chofer",
  "Abi",
  "Franco",
];
const SERVICE_LABEL_OPTIONS = ["ALMUERZO", "CENA"];
const DRIVER_COORDINATOR_DISCOUNT_FACTOR = 0.7;
const STANDARD_CATEGORIES = ["Sin alcohol", "Cervezas", "Vinos", "Tragos", "Insumos"];
const SERVICE_WINDOWS = {
  ALMUERZO: { start: "12:00", end: "15:30" },
  CENA: { start: "20:00", end: "23:30" },
};
const HOTEL_OPERATION_TIMES = {
  checkOut: "10:00",
  checkIn: "14:00",
};
const DRIVER_COORDINATOR_PRICING_LABELS = {
  "driver-free": "Bonificada",
  "driver-discount": "30% desc.",
};
const DISPLAY_TEXT_OVERRIDES = {
  "Estacion de Bebidas": "Estación de Bebidas",
  "Estación de Bebidas": "Estación de Bebidas",
  "Soda Venedictino  600ml": "Soda Venedictino 600ml",
  "Soda Venedictino 600ml": "Soda Venedictino 600ml",
  "Soda Vitalissima 500ml | Saleme Almacen": "Soda Vitalissima 500ml | Saleme Almacén",
  "Soda Vitalissima 500ml | Saleme Almacén": "Soda Vitalissima 500ml | Saleme Almacén",
  "Coca Cola 500ml": "Coca Cola 600ml",
  "Coca Cola 600ml": "Coca Cola 600ml",
  "Norton Cosecha Tardia 750ml": "Norton Cosecha Tardía 750ml",
  "Norton Cosecha Tardía 750ml": "Norton Cosecha Tardía 750ml",
};

function getInitialSidebarCollapsed() {
  try {
    const stored = window.localStorage.getItem(SIDEBAR_PREF_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
  } catch (error) {
    // Ignore storage errors and fall back to a viewport heuristic.
  }
  return window.matchMedia("(max-width: 1480px)").matches;
}

function persistSidebarPreference() {
  try {
    window.localStorage.setItem(SIDEBAR_PREF_KEY, ui.sidebarCollapsed ? "1" : "0");
  } catch (error) {
    // Ignore storage errors.
  }
}

function getInitialThemePreference() {
  try {
    return window.localStorage.getItem(THEME_PREF_KEY) === "light" ? "light" : "dark";
  } catch (error) {
    return "dark";
  }
}

function applyThemePreference(theme) {
  const normalizedTheme = theme === "light" ? "light" : "dark";
  document.documentElement.classList.toggle("theme-light-root", normalizedTheme === "light");
  document.documentElement.dataset.theme = normalizedTheme;
  document.body.classList.toggle("theme-light", normalizedTheme === "light");
  document.body.dataset.theme = normalizedTheme;
}

function persistThemePreference() {
  try {
    window.localStorage.setItem(THEME_PREF_KEY, ui.theme);
  } catch (error) {
    // Ignore storage errors.
  }
}

const MANAGER_CONTACTS = [
  {
    name: "Isis Larrocca",
    phoneLabel: "+54 9 3517 18-3023",
  },
  {
    name: "Sebastián Velez",
    phoneLabel: "+54 9 3512 11-2294",
  },
];

const PRODUCT_PRICE_SEED = [
  {
    name: "Agua Villamanaos 500 ml",
    category: "Sin alcohol",
    sellable: true,
    price: 2000,
    costPrice: 1000,
    stock: 4,
    trackStock: true,
  },
  {
    name: "Coca cero 6oo ml",
    category: "Sin alcohol",
    sellable: true,
    price: 3500,
    costPrice: 1666,
    stock: 5,
    trackStock: true,
  },
  {
    name: "Agua Vitalissima 500ml",
    category: "Sin alcohol",
    sellable: true,
    price: 2000,
    costPrice: 450,
    stock: 2,
    trackStock: true,
  },
  {
    name: "Soda Venedictino 600ml",
    category: "Sin alcohol",
    sellable: true,
    price: 2000,
    costPrice: 1000,
    stock: 11,
    trackStock: true,
  },
  {
    name: "Soda Vitalissima 500ml | Saleme Almacén",
    category: "Sin alcohol",
    sellable: true,
    price: 2000,
    costPrice: 611.22,
    stock: 3,
    trackStock: true,
  },
  {
    name: "Fernet Branca 750ml",
    category: "Insumos",
    sellable: false,
    price: 0,
    costPrice: 1166.67,
    stock: 2,
    trackStock: true,
  },
  {
    name: "Secco Tradicional 500ml",
    category: "Sin alcohol",
    sellable: true,
    price: 3000,
    costPrice: 616.67,
    stock: 9,
    trackStock: true,
  },
  {
    name: "Norton Cosecha Tardía 750ml",
    category: "Vinos",
    sellable: true,
    price: 10000,
    costPrice: 3572,
    stock: 10,
    trackStock: true,
  },
  {
    name: "Coca Cola 2500ml",
    category: "Insumos",
    sellable: false,
    price: 0,
    costPrice: 3750,
    stock: 6,
    trackStock: true,
  },
  {
    name: "Alma Mora Malbec 750ml",
    category: "Vinos",
    sellable: true,
    price: 10000,
    costPrice: 4418,
    stock: 9,
    trackStock: true,
  },
  {
    name: "Biofrut Fresh Naranja 1500ml",
    category: "Sin alcohol",
    sellable: true,
    price: 2000,
    costPrice: 1000,
    stock: 0,
    trackStock: true,
  },
  {
    name: "Biofrut Fresh Pomelo 1500ml",
    category: "Sin alcohol",
    sellable: true,
    price: 2000,
    costPrice: 1000,
    stock: 0,
    trackStock: true,
  },
  {
    name: "Biofrut Fresh Mix Frutal 1500ml",
    category: "Sin alcohol",
    sellable: true,
    price: 2000,
    costPrice: 1000,
    stock: 0,
    trackStock: true,
  },
  {
    name: "Biofrut Fresh Pera 1500ml",
    category: "Sin alcohol",
    sellable: true,
    price: 2000,
    costPrice: 1000,
    stock: 0,
    trackStock: true,
  },
  {
    name: "Levite Pomelo 500ml",
    category: "Sin alcohol",
    sellable: true,
    price: 2000,
    costPrice: 1041.67,
    stock: 0,
    trackStock: true,
  },
  {
    name: "Levite Naranja 500ml",
    category: "Sin alcohol",
    sellable: true,
    price: 2000,
    costPrice: 1041.67,
    stock: 6,
    trackStock: true,
  },
  {
    name: "Levite Manzana 500ml",
    category: "Sin alcohol",
    sellable: true,
    price: 2000,
    costPrice: 1041.67,
    stock: 4,
    trackStock: true,
  },
  {
    name: "Norte Lata 473ml",
    category: "Cervezas",
    sellable: true,
    price: 4000,
    costPrice: 1416.67,
    stock: 15,
    trackStock: true,
  },
  {
    name: "Fanta 500ml",
    category: "Sin alcohol",
    sellable: true,
    price: 3500,
    costPrice: 1701.31,
    stock: 8,
    trackStock: true,
  },
  {
    name: "Sprite 500ml",
    category: "Sin alcohol",
    sellable: true,
    price: 3500,
    costPrice: 1701.31,
    stock: 7,
    trackStock: true,
  },
  {
    name: "Coca Cola 600ml",
    category: "Sin alcohol",
    sellable: true,
    price: 3500,
    costPrice: 1701.31,
    stock: 3,
    trackStock: true,
  },
  {
    name: "Cerveza lata Quilmes",
    category: "Cervezas",
    sellable: true,
    price: 4000,
    costPrice: 1050,
    stock: 10,
    trackStock: true,
  },
];

const SEED_STOCK_LEVEL = 0;
const MIN_LOW_STOCK_THRESHOLD = 10;
const STOCK_SYNC_BY_NAME = {
  "Agua Villamanaos 500 ml": 30,
  "Coca cero 6oo ml": 30,
  "Agua Vitalissima 500ml": 30,
  "Soda Venedictino 600ml": 30,
  "Soda Vitalissima 500ml | Saleme Almacén": 30,
  "Fernet Branca 750ml": 30,
  "Secco Tradicional 500ml": 30,
  "Norton Cosecha Tardía 750ml": 30,
  "Coca Cola 2500ml": 30,
  "Alma Mora Malbec 750ml": 30,
  "Biofrut Fresh Naranja 1500ml": 30,
  "Biofrut Fresh Pomelo 1500ml": 30,
  "Biofrut Fresh Mix Frutal 1500ml": 30,
  "Biofrut Fresh Pera 1500ml": 30,
  "Levite Pomelo 500ml": 30,
  "Levite Naranja 500ml": 30,
  "Levite Manzana 500ml": 30,
  "Norte Lata 473ml": 30,
  "Fanta 500ml": 30,
  "Sprite 500ml": 30,
  "Coca Cola 600ml": 30,
  "Cerveza lata Quilmes": 30,
};
const MODULE_NAV_ITEMS = [
  { href: "#rooms-section", label: "Habitaciones" },
  { href: "#cashier-section", label: "Caja directa" },
  { href: "#staff-section", label: "Personal" },
  { href: "#closures-section", label: "Cierre" },
];

const ui = {
  selectedRoomId: "room-1",
  roomQuery: "",
  roomCategory: "all",
  cashierQuery: "",
  cashierCategory: "all",
  staffQuery: "",
  staffCategory: "all",
  driverCoordinatorQuery: "",
  driverCoordinatorCategory: "all",
  driverCoordinatorGroupId: "",
  catalogQuery: "",
  catalogCategory: "all",
  editingProductId: null,
  recipeDraftIngredients: [],
  catalogDraft: null,
  pendingPaymentRequest: null,
  pendingEmptyRoomWarningId: "",
  driverCoordinatorGroupEditor: null,
  sidebarCollapsed: SHELL_LAYOUT ? getInitialSidebarCollapsed() : false,
  theme: getInitialThemePreference(),
};

let managerReportLogoDataUrl;
let managerReportLogoPromise = null;
let managerReportTitleFontDataUrl;
let managerReportTitleFontPromise = null;
let heroVisibilityObserver = null;
let successToastHideTimeoutId = null;
let successToastRemoveTimeoutId = null;

clearLegacyStoredState();
let state = loadState();
let bridgedCheckinState = null;
applyTestCleanup();
applyDriverCoordinatorPilotReset();
applyDriverCoordinatorCourtesyRebalance();
applyMovementCleanupPreservingStock();
applySeedStockSync();
ui.catalogDraft = createCatalogDraft();

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureSuccessToastElement() {
  let toast = document.getElementById("success-toast");
  if (toast) {
    return toast;
  }

  toast = document.createElement("div");
  toast.id = "success-toast";
  toast.className = "success-toast";
  toast.setAttribute("aria-live", "polite");
  toast.setAttribute("aria-atomic", "true");
  toast.innerHTML = `
    <div class="success-toast-kicker">Operación exitosa</div>
    <div class="success-toast-message"></div>
  `;
  document.body.appendChild(toast);
  return toast;
}

function showSuccessToast(message) {
  if (!message) return;

  const toast = ensureSuccessToastElement();
  const messageElement = toast.querySelector(".success-toast-message");
  if (messageElement) {
    messageElement.textContent = message;
  }

  if (successToastHideTimeoutId) {
    clearTimeout(successToastHideTimeoutId);
    successToastHideTimeoutId = null;
  }
  if (successToastRemoveTimeoutId) {
    clearTimeout(successToastRemoveTimeoutId);
    successToastRemoveTimeoutId = null;
  }

  toast.classList.remove("is-hiding");
  toast.classList.add("is-mounted");
  void toast.offsetWidth;
  toast.classList.add("is-visible");

  successToastHideTimeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.classList.add("is-hiding");
  }, 3000);

  successToastRemoveTimeoutId = window.setTimeout(() => {
    toast.classList.remove("is-mounted", "is-hiding");
  }, 3400);
}

function uid(prefix) {
  if (window.crypto && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
}

function normalizeDisplayText(value) {
  const normalizedValue = String(value || "");
  return DISPLAY_TEXT_OVERRIDES[normalizedValue] || normalizedValue;
}

function inferCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes("cerveza")) return "Cervezas";
  if (lower.includes("vino") || lower.includes("nampe")) return "Vinos";
  if (
    lower.includes("fernet") ||
    lower.includes("whisky") ||
    lower.includes("gancia")
  ) {
    return "Tragos";
  }
  return "Sin alcohol";
}

function createCatalogDraft(product = null) {
  const isProduct = Boolean(product);
  return {
    name: isProduct ? product.name : "",
    category: isProduct ? product.category : "Sin alcohol",
    productKind: isProduct ? product.productKind : "fixed",
    sellable: isProduct ? product.sellable !== false : true,
    price:
      isProduct && product.sellable !== false && typeof product.price === "number"
        ? String(product.price)
        : "",
    costPrice:
      isProduct && typeof product.costPrice === "number" ? String(product.costPrice) : "0",
    stock:
      isProduct && typeof product.stock === "number" ? String(product.stock) : "",
    lowStockThreshold:
      isProduct ? String(getLowStockThreshold(product)) : String(MIN_LOW_STOCK_THRESHOLD),
    trackStock:
      isProduct
        ? product.productKind === "manufactured"
          ? false
          : product.trackStock !== false
        : true,
  };
}

function normalizeLowStockThreshold(value) {
  const numericValue = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numericValue)) {
    return MIN_LOW_STOCK_THRESHOLD;
  }
  return Math.max(MIN_LOW_STOCK_THRESHOLD, numericValue);
}

function getLowStockThreshold(product) {
  return normalizeLowStockThreshold(product ? product.lowStockThreshold : null);
}

function normalizeRecipeIngredient(ingredient) {
  const quantity = Number(ingredient && ingredient.quantity);
  if (!ingredient || !ingredient.ingredientProductId || Number.isNaN(quantity) || quantity <= 0) {
    return null;
  }
  return {
    ingredientProductId: ingredient.ingredientProductId,
    quantity,
  };
}

function normalizeStockRequirements(requirements) {
  if (!requirements || typeof requirements !== "object") {
    return null;
  }

  const normalized = Object.entries(requirements).reduce((accumulator, [productId, quantity]) => {
    const quantityNumber = Number(quantity);
    if (productId && !Number.isNaN(quantityNumber) && quantityNumber > 0) {
      accumulator[productId] = quantityNumber;
    }
    return accumulator;
  }, {});

  return Object.keys(normalized).length ? normalized : null;
}

function normalizeCatalogProduct(product) {
  const normalizedName = normalizeDisplayText(product.name || "Producto");
  const inferredCategory = inferCategory(normalizedName || "");
  const productKind = product && product.productKind === "manufactured" ? "manufactured" : "fixed";
  const stock =
    productKind === "manufactured" || product.stock === "" || product.stock === undefined
      ? null
      : product.stock === null
        ? null
        : Number(product.stock);
  const hasNumericStock = typeof stock === "number" && !Number.isNaN(stock);
  return {
    id: product.id || `product-${slugify(normalizedName || "producto")}-${Date.now()}`,
    name: normalizedName,
    category: product.category || inferredCategory,
    productKind,
    sellable: product.sellable !== false,
    price: typeof product.price === "number" ? product.price : Number(product.price) || 0,
    costPrice:
      typeof product.costPrice === "number"
        ? product.costPrice
        : Number(product.costPrice) || 0,
    stock: hasNumericStock ? stock : null,
    trackStock:
      productKind === "manufactured"
        ? false
        : product.trackStock === true || (product.trackStock !== false && hasNumericStock),
    archived: product.archived === true,
    lowStockThreshold: normalizeLowStockThreshold(product.lowStockThreshold),
    recipe: Array.isArray(product.recipe)
      ? product.recipe.map(normalizeRecipeIngredient).filter(Boolean)
      : [],
    createdAt: product.createdAt || new Date().toISOString(),
  };
}

function normalizeStaffMember(member) {
  const name = String((member && member.name) || "").trim();
  if (!name) {
    return null;
  }

  return {
    id: (member && member.id) || `staff-${slugify(name)}-${Date.now()}`,
    name,
    archived: member && member.archived === true,
    createdAt: (member && member.createdAt) || new Date().toISOString(),
  };
}

function normalizeDriverCoordinatorGroup(group) {
  const name = String((group && group.name) || "").trim();
  if (!name) {
    return null;
  }

  return {
    id: (group && group.id) || `driver-group-${slugify(name)}-${Date.now()}`,
    name,
    archived: group && group.archived === true,
    createdAt: (group && group.createdAt) || new Date().toISOString(),
  };
}

function normalizeDriverCoordinatorMember(member, options = {}) {
  const name = String((member && member.name) || "").trim();
  if (!name) {
    return null;
  }

  const defaultGroup = options.defaultGroup || null;
  const groupId = String(
    (member && member.groupId) || (defaultGroup ? defaultGroup.id : "")
  ).trim();
  const groupName = String(
    (member && member.groupName) || (defaultGroup ? defaultGroup.name : "")
  ).trim();

  return {
    id: (member && member.id) || `driver-${slugify(name)}-${Date.now()}`,
    name,
    groupId: groupId || null,
    groupName: groupName || "",
    archived: member && member.archived === true,
    createdAt: (member && member.createdAt) || new Date().toISOString(),
  };
}

function buildSeedCatalog() {
  return PRODUCT_PRICE_SEED.map((seed) => {
    const name = typeof seed === "string" ? seed : seed.name;
    const price = typeof seed === "object" && seed ? seed.price : 0;
    return normalizeCatalogProduct({
      id: `product-${slugify(name)}`,
      name,
      category: (typeof seed === "object" && seed && seed.category) || inferCategory(name),
      productKind:
        typeof seed === "object" && seed && seed.productKind === "manufactured"
          ? "manufactured"
          : "fixed",
      sellable: typeof seed === "object" && seed ? seed.sellable !== false : true,
      price,
      costPrice:
        typeof seed === "object" && seed ? Number(seed.costPrice) || 0 : 0,
      stock:
        typeof seed === "object" && seed && Object.prototype.hasOwnProperty.call(seed, "stock")
          ? seed.stock
          : SEED_STOCK_LEVEL,
      trackStock:
        typeof seed === "object" && seed
          ? seed.trackStock !== false
          : true,
      archived: false,
      lowStockThreshold:
        typeof seed === "object" && seed && seed.lowStockThreshold
          ? seed.lowStockThreshold
          : MIN_LOW_STOCK_THRESHOLD,
      recipe:
        typeof seed === "object" && seed && Array.isArray(seed.recipe)
          ? seed.recipe
          : [],
      createdAt: new Date().toISOString(),
    });
  });
}

function applySeedStockSync() {
  try {
    if (localStorage.getItem(STOCK_SYNC_MARKER_KEY) === "done") {
      return;
    }
  } catch (error) {
    console.error("No se pudo leer la marca de sincronizacion de stock.", error);
  }

  const stockBySlug = new Map(
    Object.entries(STOCK_SYNC_BY_NAME).map(([name, stock]) => [slugify(name), Number(stock)])
  );

  let hasChanges = false;
  state.catalog = state.catalog.map((product) => {
    if (product.archived === true) {
      return product;
    }

    const nextStock = stockBySlug.get(slugify(product.name || ""));
    if (typeof nextStock !== "number" || Number.isNaN(nextStock)) {
      return product;
    }

    if (product.productKind === "manufactured" || product.stock === nextStock) {
      return product;
    }

    hasChanges = true;
    return {
      ...product,
      stock: nextStock,
      trackStock: product.trackStock !== false,
    };
  });

  try {
    localStorage.setItem(STOCK_SYNC_MARKER_KEY, "done");
  } catch (error) {
    console.error("No se pudo guardar la sincronizacion de stock.", error);
  }

  if (hasChanges) {
    persistState("Actualizar stock interno", { snapshot: false, toast: false });
  }
}

function applyTestCleanup() {
  try {
    if (localStorage.getItem(TEST_CLEANUP_MARKER_KEY) === "done") {
      return;
    }
  } catch (error) {
    console.error("No se pudo leer la marca de limpieza de prueba.", error);
  }

  state.catalog = buildSeedCatalog();
  state.staffMembers = buildSeedStaffMembers();
  state.driverCoordinatorGroups = buildSeedDriverCoordinatorGroups();
  state.activeShift = createFreshShift();
  state.driverCoordinatorMembers = buildSeedDriverCoordinatorMembers();
  state.driverCoordinatorAccounts = [];
  state.driverCoordinatorGroupHistory = [];
  state.shiftHistory = [];
  state.safety = {
    snapshots: [],
    lastSavedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(TEST_CLEANUP_MARKER_KEY, "done");
  } catch (error) {
    console.error("No se pudo guardar la marca de limpieza de prueba.", error);
  }

  persistState("Reiniciar catálogo y datos operativos", { snapshot: false, toast: false });
}

function applyDriverCoordinatorPilotReset() {
  try {
    if (localStorage.getItem(DRIVER_COORDINATOR_PILOT_RESET_MARKER_KEY) === "done") {
      return;
    }
  } catch (error) {
    console.error("No se pudo leer la marca de limpieza piloto para grupos.", error);
  }

  state.driverCoordinatorGroups = [];
  state.driverCoordinatorMembers = [];
  state.driverCoordinatorAccounts = [];
  state.driverCoordinatorGroupHistory = [];
  state.activeShift.driverCoordinatorConsumption = [];
  state.shiftHistory = (state.shiftHistory || []).map((shift) => ({
    ...shift,
    driverCoordinatorConsumption: [],
    totals: {
      ...(shift.totals || {}),
      driverCoordinatorValue: 0,
      driverCoordinatorCourtesyValue: 0,
    },
    ranking: buildRanking([
      Array.isArray(shift.closedRooms) ? shift.closedRooms.flatMap((room) => room.items || []) : [],
      Array.isArray(shift.cashierSales) ? shift.cashierSales : [],
    ]),
  }));
  state.safety = {
    snapshots: [],
    lastSavedAt: new Date().toISOString(),
  };
  ui.driverCoordinatorGroupId = "";
  if (
    ui.pendingPaymentRequest &&
    ui.pendingPaymentRequest.kind === "driver-coordinator-add"
  ) {
    ui.pendingPaymentRequest = null;
  }

  try {
    localStorage.setItem(DRIVER_COORDINATOR_PILOT_RESET_MARKER_KEY, "done");
  } catch (error) {
    console.error("No se pudo guardar la marca de limpieza piloto para grupos.", error);
  }

  persistState("Limpiar grupos y choferes/coordinadores para prueba piloto", {
    snapshot: false,
    toast: false,
  });
}

function buildSeedStaffMembers() {
  return STAFF_MEMBER_SEED.map((name) =>
    normalizeStaffMember({
      id: `staff-${slugify(name)}`,
      name,
      archived: false,
    })
  ).filter(Boolean);
}

function buildSeedDriverCoordinatorGroups() {
  return DRIVER_COORDINATOR_GROUP_SEED.map((name) =>
    normalizeDriverCoordinatorGroup({
      id: `driver-group-${slugify(name)}`,
      name,
      archived: false,
    })
  ).filter(Boolean);
}

function buildSeedDriverCoordinatorMembers() {
  const seedGroups = buildSeedDriverCoordinatorGroups();
  const defaultGroup = seedGroups[0] || null;
  return DRIVER_COORDINATOR_MEMBER_SEED.map((name) =>
    normalizeDriverCoordinatorMember({
      id: `driver-${slugify(name)}`,
      name,
      archived: false,
    }, { defaultGroup })
  ).filter(Boolean);
}

function inferServiceLabel(date = new Date()) {
  const hour = date.getHours();
  return hour >= 19 || hour < 5 ? "CENA" : "ALMUERZO";
}

function normalizeServiceLabel(value, fallback = "ALMUERZO") {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();
  return SERVICE_LABEL_OPTIONS.includes(normalized) ? normalized : fallback;
}

function timeToMinutes(value) {
  const [hours, minutes] = String(value || "00:00").split(":").map(Number);
  return (Number(hours) || 0) * 60 + (Number(minutes) || 0);
}

function isNowInsideServiceWindow(serviceLabel, date = new Date()) {
  const windowConfig = SERVICE_WINDOWS[normalizeServiceLabel(serviceLabel)] || SERVICE_WINDOWS.ALMUERZO;
  const nowMinutes = date.getHours() * 60 + date.getMinutes();
  const start = timeToMinutes(windowConfig.start);
  const end = timeToMinutes(windowConfig.end);
  return start <= end
    ? nowMinutes >= start && nowMinutes <= end
    : nowMinutes >= start || nowMinutes <= end;
}

function getServiceWindowHint(serviceLabel, date = new Date()) {
  const normalized = normalizeServiceLabel(serviceLabel);
  const windowConfig = SERVICE_WINDOWS[normalized] || SERVICE_WINDOWS.ALMUERZO;
  const status = isNowInsideServiceWindow(normalized, date)
    ? "dentro de la ventana sugerida"
    : "fuera de la ventana sugerida";
  return `${normalized} ${windowConfig.start}-${windowConfig.end} (${status}). Check-out ${HOTEL_OPERATION_TIMES.checkOut} / Check-in ${HOTEL_OPERATION_TIMES.checkIn}.`;
}

function createRoom(index) {
  return {
    id: `room-${index}`,
    label: `Hab ${index}`,
    note: "",
    items: [],
    printedAt: null,
    deferredTicketPrintedAt: null,
    updatedAt: new Date().toISOString(),
  };
}

function createFreshShift() {
  const now = new Date();
  return {
    id: uid("shift"),
    openedAt: now.toISOString(),
    serviceLabel: normalizeServiceLabel(inferServiceLabel(now), "ALMUERZO"),
    rooms: Array.from({ length: ROOM_COUNT }, (_, index) => createRoom(index + 1)),
    cashierSales: [],
    staffConsumption: [],
    driverCoordinatorConsumption: [],
    closedRooms: [],
  };
}

function getLocalDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isShiftOperationallyEmpty(shift) {
  if (!shift || typeof shift !== "object") {
    return true;
  }
  const rooms = Array.isArray(shift.rooms) ? shift.rooms : [];
  const hasRoomItems = rooms.some((room) => Array.isArray(room.items) && room.items.length > 0);
  return (
    !hasRoomItems &&
    (!Array.isArray(shift.closedRooms) || shift.closedRooms.length === 0) &&
    (!Array.isArray(shift.cashierSales) || shift.cashierSales.length === 0) &&
    (!Array.isArray(shift.staffConsumption) || shift.staffConsumption.length === 0) &&
    (!Array.isArray(shift.driverCoordinatorConsumption) ||
      shift.driverCoordinatorConsumption.length === 0)
  );
}

function shouldRefreshEmptyShift(shift) {
  if (!isShiftOperationallyEmpty(shift)) {
    return false;
  }
  const openedDateKey = getLocalDateKey(shift && shift.openedAt);
  return Boolean(openedDateKey && openedDateKey !== getLocalDateKey(new Date()));
}

function createInitialState() {
  return {
    version: APP_VERSION,
    hotelName: "Solanas",
    stationName: "Estación de Bebidas",
    layoutLocked: true,
    currency: "ARS",
    catalog: buildSeedCatalog(),
    staffMembers: buildSeedStaffMembers(),
    driverCoordinatorGroups: buildSeedDriverCoordinatorGroups(),
    driverCoordinatorMembers: buildSeedDriverCoordinatorMembers(),
    driverCoordinatorAccounts: [],
    driverCoordinatorGroupHistory: [],
    activeShift: createFreshShift(),
    shiftHistory: [],
    safety: {
      snapshots: [],
      lastSavedAt: new Date().toISOString(),
    },
  };
}

function clearLegacyStoredState() {
  try {
    if (localStorage.getItem(RESET_MARKER_KEY) === "done") {
      return;
    }

    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(RESET_MARKER_KEY, "done");
  } catch (error) {
    console.error("No se pudo limpiar el estado anterior.", error);
  }
}

function sanitizeState(candidate) {
  if (!candidate || typeof candidate !== "object") return createInitialState();
  if (!Array.isArray(candidate.catalog) || !candidate.activeShift) {
    return createInitialState();
  }

  const normalizedCatalog = candidate.catalog.map(normalizeCatalogProduct);
  let normalizedDriverCoordinatorGroups =
    Array.isArray(candidate.driverCoordinatorGroups) && candidate.driverCoordinatorGroups.length
      ? candidate.driverCoordinatorGroups.map(normalizeDriverCoordinatorGroup).filter(Boolean)
      : [];
  const hasLegacyDriverCoordinatorData =
    (Array.isArray(candidate.driverCoordinatorMembers) &&
      candidate.driverCoordinatorMembers.length > 0) ||
    (Array.isArray(candidate.driverCoordinatorAccounts) &&
      candidate.driverCoordinatorAccounts.length > 0) ||
    (candidate.activeShift &&
      Array.isArray(candidate.activeShift.driverCoordinatorConsumption) &&
      candidate.activeShift.driverCoordinatorConsumption.length > 0) ||
    (Array.isArray(candidate.shiftHistory) &&
      candidate.shiftHistory.some(
        (shift) =>
          Array.isArray(shift.driverCoordinatorConsumption) &&
          shift.driverCoordinatorConsumption.length > 0
      ));
  if (!normalizedDriverCoordinatorGroups.length && hasLegacyDriverCoordinatorData) {
    const fallbackGroup = normalizeDriverCoordinatorGroup({
      id: "driver-group-grupo-activo",
      name: "Grupo activo",
      archived: false,
    });
    if (fallbackGroup) {
      normalizedDriverCoordinatorGroups = [fallbackGroup];
    }
  }
  const defaultDriverCoordinatorGroup =
    normalizedDriverCoordinatorGroups.find((group) => !group.archived) ||
    normalizedDriverCoordinatorGroups[0] ||
    null;
  const normalizedStaffMembers =
    Array.isArray(candidate.staffMembers) && candidate.staffMembers.length
      ? candidate.staffMembers.map(normalizeStaffMember).filter(Boolean)
      : buildSeedStaffMembers();
  const normalizedDriverCoordinatorMembers =
    Array.isArray(candidate.driverCoordinatorMembers) && candidate.driverCoordinatorMembers.length
      ? candidate.driverCoordinatorMembers
          .map((member) =>
            normalizeDriverCoordinatorMember(member, {
              defaultGroup: defaultDriverCoordinatorGroup,
            })
          )
          .filter(Boolean)
      : buildSeedDriverCoordinatorMembers();
  const catalogMap = new Map(normalizedCatalog.map((product) => [product.id, product]));
  const staffMemberMap = new Map(
    normalizedStaffMembers.map((member) => [member.id, member])
  );
  const driverCoordinatorGroupMap = new Map(
    normalizedDriverCoordinatorGroups.map((group) => [group.id, group])
  );
  const driverCoordinatorMemberMap = new Map(
    normalizedDriverCoordinatorMembers.map((member) => [member.id, member])
  );
  const normalizeCollectionItems = (items, options = {}) =>
    Array.isArray(items)
      ? items.map((item) =>
          normalizeSaleItem(
            item,
            catalogMap,
            staffMemberMap,
            driverCoordinatorMemberMap,
            driverCoordinatorGroupMap,
            options
          )
        )
      : [];
  const normalizedActiveShift = {
    ...candidate.activeShift,
    serviceLabel: normalizeServiceLabel(
      candidate.activeShift.serviceLabel,
      inferServiceLabel(new Date(candidate.activeShift.openedAt || Date.now()))
    ),
    rooms: Array.isArray(candidate.activeShift.rooms)
      ? candidate.activeShift.rooms.map((room, index) => ({
          id: room.id || `room-${index + 1}`,
          label: room.label || `Hab ${index + 1}`,
          note: room.note || "",
          items: normalizeCollectionItems(room.items),
          printedAt: room.printedAt || null,
          deferredTicketPrintedAt: room.deferredTicketPrintedAt || null,
          updatedAt: room.updatedAt || new Date().toISOString(),
        }))
      : createFreshShift().rooms,
    cashierSales: normalizeCollectionItems(candidate.activeShift.cashierSales),
    staffConsumption: normalizeCollectionItems(candidate.activeShift.staffConsumption, {
      priceMode: "cost",
    }),
    driverCoordinatorConsumption: normalizeCollectionItems(
      candidate.activeShift.driverCoordinatorConsumption,
      {
        pricingRuleFallback: "driver-discount",
      }
    ),
    closedRooms: Array.isArray(candidate.activeShift.closedRooms)
      ? candidate.activeShift.closedRooms.map((room, index) => ({
          ...room,
          id: room.id || `room-close-${index + 1}`,
          roomId: room.roomId || `room-${index + 1}`,
          roomLabel: room.roomLabel || `Hab ${index + 1}`,
          note: room.note || "",
          paymentMethod: normalizePaymentMethod(room.paymentMethod),
          deferredTicketPrintedAt: room.deferredTicketPrintedAt || null,
          guestName: room.guestName || "",
          items: normalizeCollectionItems(room.items),
          total:
            typeof room.total === "number"
              ? room.total
              : normalizeCollectionItems(room.items).reduce(
                  (sum, item) => sum + item.quantity * item.unitPrice,
                  0
                ),
        }))
      : [],
  };

  return {
    version: APP_VERSION,
    hotelName: candidate.hotelName || "Solanas",
    stationName: normalizeDisplayText(candidate.stationName || "Estación de Bebidas"),
    layoutLocked: candidate.layoutLocked !== false,
    currency: candidate.currency || "ARS",
    catalog: normalizedCatalog,
    staffMembers: normalizedStaffMembers,
    driverCoordinatorGroups: normalizedDriverCoordinatorGroups,
    driverCoordinatorMembers: normalizedDriverCoordinatorMembers,
    driverCoordinatorAccounts: normalizeCollectionItems(candidate.driverCoordinatorAccounts, {
      pricingRuleFallback: "driver-discount",
    }).filter(isPendingDriverCoordinatorAccountItem),
    driverCoordinatorGroupHistory: Array.isArray(candidate.driverCoordinatorGroupHistory)
      ? deepClone(candidate.driverCoordinatorGroupHistory)
      : [],
    activeShift: normalizedActiveShift,
    shiftHistory: Array.isArray(candidate.shiftHistory)
      ? candidate.shiftHistory.map((shift) => ({
          ...shift,
          serviceLabel: normalizeServiceLabel(
            shift.serviceLabel,
            inferServiceLabel(new Date(shift.openedAt || Date.now()))
          ),
          closedRooms: Array.isArray(shift.closedRooms)
            ? shift.closedRooms.map((room, index) => ({
                ...room,
                id: room.id || `shift-room-${index + 1}`,
                paymentMethod: normalizePaymentMethod(room.paymentMethod),
                deferredTicketPrintedAt: room.deferredTicketPrintedAt || null,
                guestName: room.guestName || "",
                items: normalizeCollectionItems(room.items),
              }))
            : [],
          cashierSales: normalizeCollectionItems(shift.cashierSales),
          staffConsumption: normalizeCollectionItems(shift.staffConsumption, {
            priceMode: "cost",
          }),
          driverCoordinatorConsumption: normalizeCollectionItems(
            shift.driverCoordinatorConsumption,
            {
              pricingRuleFallback: "driver-discount",
            }
          ),
          totals: {
            ...(shift.totals || {}),
            roomCourtesyValue: getClosedRoomsCourtesyValue(
              Array.isArray(shift.closedRooms)
                ? shift.closedRooms.map((room) => ({
                    ...room,
                    items: normalizeCollectionItems(room.items),
                  }))
                : []
            ),
            staffValue: getCollectionTotal(
              normalizeCollectionItems(shift.staffConsumption, {
                priceMode: "cost",
              })
            ),
            driverCoordinatorValue: getCollectionTotal(
              normalizeCollectionItems(shift.driverCoordinatorConsumption, {
                pricingRuleFallback: "driver-discount",
              })
            ),
            driverCoordinatorCourtesyValue: getDriverCoordinatorCourtesyValue(
              normalizeCollectionItems(shift.driverCoordinatorConsumption, {
                pricingRuleFallback: "driver-discount",
              })
            ),
          },
        }))
      : [],
    safety: {
      snapshots:
        candidate.safety && Array.isArray(candidate.safety.snapshots)
          ? candidate.safety.snapshots.slice(0, SNAPSHOT_LIMIT)
          : [],
      lastSavedAt:
        candidate.safety && candidate.safety.lastSavedAt
          ? candidate.safety.lastSavedAt
          : new Date().toISOString(),
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const nextState = sanitizeState(JSON.parse(raw));
    if (shouldRefreshEmptyShift(nextState.activeShift)) {
      nextState.activeShift = createFreshShift();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    }
    return nextState;
  } catch (error) {
    console.error("No se pudo cargar el estado guardado.", error);
    return createInitialState();
  }
}

function persistState(reason, options = {}) {
  const shouldSnapshot = options.snapshot !== false;
  const shouldToast = options.toast !== false;

  if (shouldSnapshot) {
    const snapshotPayload = deepClone({
      version: state.version,
      hotelName: state.hotelName,
      stationName: state.stationName,
      layoutLocked: state.layoutLocked,
      currency: state.currency,
      catalog: state.catalog,
      staffMembers: state.staffMembers,
      driverCoordinatorGroups: state.driverCoordinatorGroups,
      driverCoordinatorMembers: state.driverCoordinatorMembers,
      driverCoordinatorAccounts: state.driverCoordinatorAccounts,
      driverCoordinatorGroupHistory: state.driverCoordinatorGroupHistory,
      activeShift: state.activeShift,
      shiftHistory: state.shiftHistory,
    });

    state.safety.snapshots.unshift({
      id: uid("snapshot"),
      label: reason,
      createdAt: new Date().toISOString(),
      payload: snapshotPayload,
    });
    state.safety.snapshots = state.safety.snapshots.slice(0, SNAPSHOT_LIMIT);
  }

  state.safety.lastSavedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  postBeverageStateToParent();
  if (shouldToast) {
    showSuccessToast(reason);
  }
}

function postBeverageStateToParent() {
  if (!window.parent || window.parent === window) {
    return;
  }
  try {
    window.parent.postMessage(
      {
        type: "solanas:beverage-state",
        payload: state,
        emittedAt: new Date().toISOString(),
      },
      "*"
    );
  } catch (error) {
    console.error("No se pudo enviar el estado de bebidas al sistema.", error);
  }
}

function getStaffMembersSignature(members) {
  return JSON.stringify(
    (Array.isArray(members) ? members : []).map((member) => ({
      id: member && member.id,
      name: member && member.name,
      archived: member && member.archived === true,
    }))
  );
}

function applyStaffMembersFromEmployees(staffMembers) {
  if (!Array.isArray(staffMembers)) {
    return false;
  }
  const nextStaffMembers = staffMembers.map(normalizeStaffMember).filter(Boolean);
  if (getStaffMembersSignature(state.staffMembers) === getStaffMembersSignature(nextStaffMembers)) {
    return false;
  }
  state.staffMembers = nextStaffMembers;
  persistState("Actualizar personal desde Empleados", { snapshot: false, toast: false });
  render({ preserveScroll: true });
  return true;
}

function formatMoney(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDateTime(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatShortDate(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatFileSafeDate(value) {
  if (!value) return "sin-fecha";
  const date = new Date(value);
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayInputDate() {
  const date = new Date();
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidCheckinState(candidate) {
  return Boolean(candidate && Array.isArray(candidate.reservations));
}

function normalizeInputDate(value) {
  const text = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return "";
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCheckinStateFromStorage() {
  if (isValidCheckinState(bridgedCheckinState)) {
    return bridgedCheckinState;
  }
  try {
    const raw = localStorage.getItem(CHECKIN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidCheckinState(parsed) ? parsed : null;
  } catch (error) {
    console.error("No se pudo leer la ocupación del Check-in.", error);
    return null;
  }
}

function roomNumberFromLabel(value) {
  const match = String(value || "").match(/\d+/);
  return match ? match[0] : String(value || "").trim();
}

function getCheckinGuestName(reservation) {
  const responsible = reservation && reservation.responsible ? reservation.responsible : {};
  const responsibleName = [responsible.firstName, responsible.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (responsibleName) return responsibleName;

  const primaryGuest = Array.isArray(reservation && reservation.guests)
    ? reservation.guests[0]
    : null;
  const guestName = primaryGuest
    ? [primaryGuest.firstName, primaryGuest.lastName].filter(Boolean).join(" ").trim()
    : "";
  if (guestName) return guestName;

  return String((reservation && reservation.groupCompany) || "").trim();
}

function getCheckinGuestNames(reservation) {
  const guests = Array.isArray(reservation && reservation.guests) ? reservation.guests : [];
  const names = guests
    .map((guest) => [guest.firstName, guest.lastName].filter(Boolean).join(" ").trim())
    .filter(Boolean);
  if (names.length) return names;
  const fallbackName = getCheckinGuestName(reservation);
  return fallbackName ? [fallbackName] : [];
}

function getCheckinGroupName(reservation) {
  return String((reservation && reservation.groupCompany) || "").trim();
}

function getCheckinGroupColor(reservation) {
  const color = String((reservation && reservation.groupColor) || "").trim();
  return /^hsl\(\s*[\d.]+\s+[\d.]+%\s+[\d.]+%\s*\)$/i.test(color) ? color : "";
}

function getSoftHslColor(color, alpha = 0.16) {
  const match = String(color || "").match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)/i);
  if (!match) return `rgba(42, 114, 147, ${alpha})`;
  return `hsl(${match[1]} ${match[2]}% ${match[3]}% / ${alpha})`;
}

function getLighterHslColor(color, amount = 10) {
  const match = String(color || "").match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)/i);
  if (!match) return color || "#5fe9d3";
  const lightness = Math.min(78, Number(match[3]) + amount);
  return `hsl(${match[1]} ${match[2]}% ${lightness}%)`;
}

function getDarkerHslColor(color, amount = 12) {
  const match = String(color || "").match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)/i);
  if (!match) return "#0f8d88";
  const lightness = Math.max(18, Number(match[3]) - amount);
  return `hsl(${match[1]} ${match[2]}% ${lightness}%)`;
}

function getCheckinCompRoomType(reservation) {
  const type = String((reservation && reservation.groupCompRoomType) || "").trim();
  return type === "drivers" || type === "coordinators" ? type : "";
}

function getCheckinCompRoomLabel(type) {
  if (type === "drivers") return "Choferes";
  if (type === "coordinators") return "Coordinadores";
  return "";
}

function getCheckinCompRoomMaxGuests(type) {
  if (type === "drivers") return 2;
  if (type === "coordinators") return 3;
  return 0;
}

function getCheckinCompGuestCount(reservation) {
  const type = getCheckinCompRoomType(reservation);
  const maxGuests = getCheckinCompRoomMaxGuests(type);
  const guests = Array.isArray(reservation && reservation.guests) ? reservation.guests : [];
  const filledGuests = guests.filter((guest) =>
    Boolean(
      guest &&
        [guest.firstName, guest.lastName, guest.document, guest.nationality, guest.birthDate].some(
          (value) => String(value || "").trim()
        )
    )
  );
  const count = Math.max(1, filledGuests.length || guests.length || 1);
  return maxGuests ? Math.min(count, maxGuests) : count;
}

function getCheckinGroupKey(reservation) {
  const rawValue =
    (reservation && reservation.groupId) ||
    getCheckinGroupName(reservation) ||
    (reservation && reservation.id) ||
    "grupo-checkin";
  return `checkin-${slugify(String(rawValue)) || "grupo"}`;
}

function buildCheckinOccupantFromReservation(reservation, roomNumber, roomId = "") {
  const compRoomType = getCheckinCompRoomType(reservation);
  const guestNames = getCheckinGuestNames(reservation);
  const guestName = guestNames.length
    ? guestNames.join(", ")
    : getCheckinGuestName(reservation) || "Huesped activo";
  const groupName = getCheckinGroupName(reservation);
  return {
    roomNumber,
    roomId,
    guestName,
    guestNames,
    groupId: getCheckinGroupKey(reservation),
    groupName,
    groupColor: getCheckinGroupColor(reservation),
    regime: String((reservation && reservation.regime) || "").trim(),
    checkOutDate: normalizeInputDate(reservation && reservation.checkOutDate),
    reservationId: (reservation && reservation.id) || "",
    compRoomType,
    compRoomLabel: getCheckinCompRoomLabel(compRoomType),
    compRoomGuestCount: compRoomType ? getCheckinCompGuestCount(reservation) : 0,
  };
}

function isCheckinReservationActiveToday(reservation) {
  if (!reservation || reservation.archived) return false;
  const checkInDate = normalizeInputDate(reservation.checkInDate);
  const checkOutDate = normalizeInputDate(reservation.checkOutDate);
  const today = getTodayInputDate();
  return Boolean(checkInDate && checkOutDate && checkInDate <= today && today < checkOutDate);
}

function getRoomIdByNumber(roomNumber) {
  const normalizedRoom = roomNumberFromLabel(roomNumber);
  const room = state.activeShift.rooms.find(
    (item) => roomNumberFromLabel(item.label) === normalizedRoom
  );
  return room ? room.id : "";
}

function getActiveCheckinOccupants() {
  const checkinState = getCheckinStateFromStorage();
  if (!checkinState) return [];
  const occupantsByRoom = new Map();
  checkinState.reservations.forEach((reservation) => {
    if (!isCheckinReservationActiveToday(reservation)) return;
    const roomNumber = roomNumberFromLabel(reservation.roomNumber);
    const roomId = getRoomIdByNumber(roomNumber);
    if (!roomNumber || !roomId) return;
    occupantsByRoom.set(roomNumber, buildCheckinOccupantFromReservation(reservation, roomNumber, roomId));
  });
  return Array.from(occupantsByRoom.values()).sort(
    (left, right) => Number(left.roomNumber) - Number(right.roomNumber)
  );
}

function getRoomCheckinOccupant(roomNumber) {
  const normalizedRoom = roomNumberFromLabel(roomNumber);
  const checkinState = getCheckinStateFromStorage();
  if (!normalizedRoom || !checkinState) return null;

  const reservation = checkinState.reservations.find((item) => {
    if (roomNumberFromLabel(item.roomNumber) !== normalizedRoom) return false;
    return isCheckinReservationActiveToday(item);
  });

  if (!reservation) return null;
  return buildCheckinOccupantFromReservation(
    reservation,
    normalizedRoom,
    getRoomIdByNumber(normalizedRoom)
  );
}

function normalizePdfText(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapePdfText(value) {
  return normalizePdfText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function fitPdfColumn(value, width, align = "left") {
  let text = normalizePdfText(value);
  if (text.length > width) {
    text = width > 3 ? `${text.slice(0, width - 3)}...` : text.slice(0, width);
  }
  return align === "right" ? text.padStart(width, " ") : text.padEnd(width, " ");
}

function stringToPdfBytes(value) {
  const input = String(value || "");
  const bytes = new Uint8Array(input.length);
  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index);
    bytes[index] = code <= 255 ? code : 63;
  }
  return bytes;
}

function buildPdfDocument(objects) {
  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const objectIds = Object.keys(objects)
    .map(Number)
    .sort((a, b) => a - b);
  const offsets = [];

  objectIds.forEach((objectId) => {
    offsets[objectId] = pdf.length;
    pdf += `${objectId} 0 obj\n${objects[objectId]}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objectIds.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  objectIds.forEach((objectId) => {
    pdf += `${String(offsets[objectId]).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objectIds.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return stringToPdfBytes(pdf);
}

function downloadFile(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fallbackValue(value, fallback) {
  return value === undefined || value === null ? fallback : value;
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return `${value.toFixed(1)}%`;
}

function normalizePaymentMethod(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  if (!normalized) return "unknown";
  if (["1", "efectivo", "cash"].includes(normalized)) return "cash";
  if (
    [
      "2",
      "transferencia",
      "transferencia bancaria",
      "transfer",
      "transf",
      "banco",
      "bank",
    ].includes(normalized)
  ) {
    return "transfer";
  }
  if (
    [
      "3",
      "estadia",
      "estadía",
      "saldo",
      "saldo estadia",
      "saldo estadía",
      "abonar al final",
      "abono final",
      "stay",
    ].includes(normalized)
  ) {
    return "stay";
  }
  return "unknown";
}

function getPaymentMethodLabel(paymentMethod) {
  return PAYMENT_METHOD_LABELS[normalizePaymentMethod(paymentMethod)] || "Sin definir";
}

function getPaymentMethodChipClass(paymentMethod) {
  const normalized = normalizePaymentMethod(paymentMethod);
  if (normalized === "cash") return "chip payment-chip is-cash";
  if (normalized === "transfer") return "chip payment-chip is-transfer";
  if (normalized === "stay") return "chip payment-chip is-stay";
  return "chip payment-chip is-unknown";
}

function createPaymentBreakdown() {
  return {
    cash: { count: 0, total: 0 },
    transfer: { count: 0, total: 0 },
    stay: { count: 0, total: 0 },
    unknown: { count: 0, total: 0 },
  };
}

function appendPaymentBreakdownEntry(breakdown, paymentMethod, amount, count = 1) {
  const normalized = normalizePaymentMethod(paymentMethod);
  breakdown[normalized].count += count;
  breakdown[normalized].total += amount;
  return breakdown;
}

function mergePaymentBreakdowns(...breakdowns) {
  return breakdowns.reduce((merged, current) => {
    Object.keys(merged).forEach((paymentMethod) => {
      merged[paymentMethod].count += current[paymentMethod].count;
      merged[paymentMethod].total += current[paymentMethod].total;
    });
    return merged;
  }, createPaymentBreakdown());
}

function openPaymentMethodModal(request) {
  ui.pendingPaymentRequest = request;
  render({ preserveScroll: true });
}

function closePaymentMethodModal() {
  ui.pendingPaymentRequest = null;
  render({ preserveScroll: true });
}

function updateActiveShiftServiceLabel(nextServiceLabel) {
  const normalizedNextLabel = normalizeServiceLabel(
    nextServiceLabel,
    state.activeShift && state.activeShift.openedAt
      ? inferServiceLabel(new Date(state.activeShift.openedAt))
      : inferServiceLabel(new Date())
  );
  if (!state.activeShift || state.activeShift.serviceLabel === normalizedNextLabel) {
    return;
  }

  state.activeShift.serviceLabel = normalizedNextLabel;
  state.activeShift.cashierSales = state.activeShift.cashierSales.map((item) => ({
    ...item,
    serviceLabel: normalizedNextLabel,
  }));
  state.activeShift.staffConsumption = state.activeShift.staffConsumption.map((item) => ({
    ...item,
    serviceLabel: normalizedNextLabel,
  }));
  state.activeShift.rooms = state.activeShift.rooms.map((room) => ({
    ...room,
    items: (room.items || []).map((item) => ({
      ...item,
      serviceLabel: normalizedNextLabel,
    })),
  }));
  state.activeShift.driverCoordinatorConsumption = state.activeShift.driverCoordinatorConsumption.map(
    (item) => ({
      ...item,
      serviceLabel: normalizedNextLabel,
    })
  );
  persistState(`Cambiar servicio del turno a ${normalizedNextLabel}`);
  render({ preserveScroll: true });
}

function openDriverCoordinatorGroupEditor(mode, groupId = "") {
  if (mode === "edit") {
    const group = getDriverCoordinatorGroupById(groupId);
    if (!group) {
      alert("Primero selecciona un grupo para editar.");
      return;
    }
  }

  ui.driverCoordinatorGroupEditor = {
    mode,
    groupId: groupId || "",
  };
  render({ preserveScroll: true });
}

function closeDriverCoordinatorGroupEditor() {
  ui.driverCoordinatorGroupEditor = null;
  render({ preserveScroll: true });
}

function getClosedRoomsPaymentBreakdown(rooms) {
  return rooms.reduce(
    (breakdown, room) => {
      return appendPaymentBreakdownEntry(
        breakdown,
        room.paymentMethod,
        typeof room.total === "number" ? room.total : 0,
        1
      );
    },
    createPaymentBreakdown()
  );
}

function isDeferredStayRoom(room) {
  return normalizePaymentMethod(room && room.paymentMethod) === "stay";
}

function getDeferredStayRoomsTotal(rooms) {
  return rooms.reduce(
    (sum, room) => sum + (isDeferredStayRoom(room) ? Number(room.total) || 0 : 0),
    0
  );
}

function getCollectionPaymentBreakdown(items) {
  return items.reduce(
    (breakdown, item) =>
      appendPaymentBreakdownEntry(
        breakdown,
        item.paymentMethod,
        item.quantity * item.unitPrice,
        item.quantity
      ),
    createPaymentBreakdown()
  );
}

function getShiftPaymentBreakdown(closedRooms, cashierSales) {
  return mergePaymentBreakdowns(
    getClosedRoomsPaymentBreakdown(closedRooms),
    getCollectionPaymentBreakdown(cashierSales)
  );
}

function normalizePricingRule(value, fallback = "sale") {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (!normalized) return fallback;
  if (
    [
      "room-courtesy",
      "room-free",
      "courtesy",
      "gift",
      "gifted",
      "bonificacion-habitacion",
      "bonificada-habitacion",
    ].includes(normalized)
  ) {
    return "room-courtesy";
  }
  if (["driver-free", "bonificada", "bonificada-500"].includes(normalized)) {
    return "driver-free";
  }
  if (
    [
      "driver-discount",
      "descuento-30",
      "30-desc",
      "30%-off",
      "discount",
    ].includes(normalized)
  ) {
    return "driver-discount";
  }
  if (normalized === "cost") return "cost";
  return "sale";
}

function normalizeSaleItem(
  item,
  catalogMap,
  staffMemberMap,
  driverCoordinatorMemberMap,
  driverCoordinatorGroupMap,
  options = {}
) {
  const catalogProduct = catalogMap.get(item.productId);
  const linkedStaffMember =
    item && item.staffMemberId ? staffMemberMap.get(item.staffMemberId) : null;
  const linkedDriverCoordinatorMember =
    item && item.driverCoordinatorMemberId
      ? driverCoordinatorMemberMap.get(item.driverCoordinatorMemberId)
      : null;
  const linkedDriverCoordinatorGroup =
    item && item.driverCoordinatorGroupId
      ? driverCoordinatorGroupMap.get(item.driverCoordinatorGroupId)
      : linkedDriverCoordinatorMember && linkedDriverCoordinatorMember.groupId
        ? driverCoordinatorGroupMap.get(linkedDriverCoordinatorMember.groupId)
        : null;
  const fallbackCost = catalogProduct ? fallbackValue(getEstimatedUnitCost(catalogProduct), 0) : 0;
  const normalizedRequirements = normalizeStockRequirements(item.stockRequirements);
  const fallbackRequirements =
    normalizedRequirements ||
    (catalogProduct && !isManufacturedProduct(catalogProduct) && catalogProduct.trackStock
      ? { [catalogProduct.id]: 1 }
      : null);
  const unitCost = typeof item.unitCost === "number" ? item.unitCost : fallbackCost;
  const rawUnitPrice = Number(item.unitPrice) || 0;
  const rawOriginalUnitPrice =
    typeof item.originalUnitPrice === "number"
      ? item.originalUnitPrice
      : catalogProduct
        ? fallbackValue(catalogProduct.price, rawUnitPrice)
        : rawUnitPrice;
  const normalizedName = normalizeDisplayText(
    item.name || (catalogProduct ? catalogProduct.name : "Producto")
  );
  return {
    productId: item.productId,
    name: normalizedName,
    category: item.category || (catalogProduct ? catalogProduct.category : "Sin alcohol"),
    unitPrice: options.priceMode === "cost" ? unitCost : rawUnitPrice,
    unitCost,
    originalUnitPrice: rawOriginalUnitPrice,
    productKind:
      item.productKind ||
      (catalogProduct ? catalogProduct.productKind : "fixed"),
    stockRequirements: fallbackRequirements,
    paymentMethod: normalizePaymentMethod(item.paymentMethod),
    staffMemberId: item.staffMemberId || null,
    staffMemberName:
      item.staffMemberName ||
      (linkedStaffMember ? linkedStaffMember.name : options.priceMode === "cost" ? "Sin asignar" : ""),
    driverCoordinatorMemberId: item.driverCoordinatorMemberId || null,
    driverCoordinatorMemberName:
      item.driverCoordinatorMemberName ||
      (linkedDriverCoordinatorMember ? linkedDriverCoordinatorMember.name : ""),
    driverCoordinatorGroupId:
      item.driverCoordinatorGroupId ||
      (linkedDriverCoordinatorMember ? linkedDriverCoordinatorMember.groupId || null : null),
    driverCoordinatorGroupName:
      item.driverCoordinatorGroupName ||
      (linkedDriverCoordinatorGroup
        ? linkedDriverCoordinatorGroup.name
        : linkedDriverCoordinatorMember
          ? linkedDriverCoordinatorMember.groupName || ""
          : ""),
    pricingRule: normalizePricingRule(
      item.pricingRule,
      options.pricingRuleFallback || (options.priceMode === "cost" ? "cost" : "sale")
    ),
    sourceShiftId: item.sourceShiftId || null,
    serviceLabel: item.serviceLabel || options.serviceLabel || "",
    accountClosedAt: item.accountClosedAt || null,
    accountClosureId: item.accountClosureId || null,
    quantity: Number(item.quantity) || 0,
  };
}

function isManufacturedProduct(product) {
  return product && product.productKind === "manufactured";
}

function isSellableProduct(product) {
  return product && !product.archived && product.sellable !== false;
}

function getActiveCatalog(showArchived = false) {
  return state.catalog.filter((product) => showArchived || !product.archived);
}

function getSellableCatalog(showArchived = false) {
  return getActiveCatalog(showArchived).filter((product) => product.sellable !== false);
}

function getProductById(productId) {
  return state.catalog.find((product) => product.id === productId);
}

function getStaffMemberById(staffMemberId) {
  return state.staffMembers.find((member) => member.id === staffMemberId);
}

function getActiveStaffMembers(showArchived = false) {
  return state.staffMembers.filter((member) => showArchived || !member.archived);
}

function getStaffMemberLabel(staffMemberId, fallbackName = "") {
  const member = getStaffMemberById(staffMemberId);
  return member ? member.name : fallbackName || "Sin asignar";
}

function getDriverCoordinatorMemberById(memberId) {
  return state.driverCoordinatorMembers.find((member) => member.id === memberId);
}

function getActiveDriverCoordinatorMembers(showArchived = false) {
  return state.driverCoordinatorMembers.filter((member) => showArchived || !member.archived);
}

function getDriverCoordinatorMemberLabel(memberId, fallbackName = "") {
  const member = getDriverCoordinatorMemberById(memberId);
  return member ? member.name : fallbackName || "Sin asignar";
}

function getDriverCoordinatorGroupById(groupId) {
  return state.driverCoordinatorGroups.find((group) => group.id === groupId);
}

function getActiveDriverCoordinatorGroups(showArchived = false) {
  return (state.driverCoordinatorGroups || []).filter(
    (group) => showArchived || !group.archived
  );
}

function getDriverCoordinatorGroupLabel(groupId, fallbackName = "") {
  const group = getDriverCoordinatorGroupById(groupId);
  return group ? group.name : fallbackName || "Sin grupo";
}

function getSelectedDriverCoordinatorGroup() {
  const activeGroups = getActiveDriverCoordinatorGroups();
  if (!activeGroups.length) {
    ui.driverCoordinatorGroupId = "";
    return null;
  }

  const selectedGroup = activeGroups.find((group) => group.id === ui.driverCoordinatorGroupId);
  if (selectedGroup) {
    return selectedGroup;
  }

  ui.driverCoordinatorGroupId = activeGroups[0].id;
  return activeGroups[0];
}

function getDriverCoordinatorMembersForGroup(groupId, options = {}) {
  const showArchived = options.showArchived === true;
  return state.driverCoordinatorMembers.filter(
    (member) =>
      String(member.groupId || "") === String(groupId || "") &&
      (showArchived || !member.archived)
  );
}

function getDriverCoordinatorGroupIdForItem(item) {
  if (!item) return null;
  if (item.driverCoordinatorGroupId) return item.driverCoordinatorGroupId;
  const member = item.driverCoordinatorMemberId
    ? getDriverCoordinatorMemberById(item.driverCoordinatorMemberId)
    : null;
  return member ? member.groupId || null : null;
}

function getDriverCoordinatorGroupNameForItem(item) {
  if (!item) return "";
  if (item.driverCoordinatorGroupName) return item.driverCoordinatorGroupName;
  const member = item.driverCoordinatorMemberId
    ? getDriverCoordinatorMemberById(item.driverCoordinatorMemberId)
    : null;
  if (member && member.groupName) return member.groupName;
  const groupId = getDriverCoordinatorGroupIdForItem(item);
  return groupId ? getDriverCoordinatorGroupLabel(groupId, "") : "";
}

function getDriverCoordinatorItemsForGroup(items, groupId) {
  return (items || []).filter(
    (item) => String(getDriverCoordinatorGroupIdForItem(item) || "") === String(groupId || "")
  );
}

function isPendingDriverCoordinatorAccountItem(item) {
  return !item || !item.accountClosedAt;
}

function getDriverCoordinatorAccountItemsForGroup(groupId) {
  return getDriverCoordinatorItemsForGroup(
    state.driverCoordinatorAccounts.filter(isPendingDriverCoordinatorAccountItem),
    groupId
  );
}

function getDriverCoordinatorPricingLabel(pricingRule) {
  return DRIVER_COORDINATOR_PRICING_LABELS[normalizePricingRule(pricingRule)] || "Cuenta";
}

function isRoomCourtesyItem(item) {
  return normalizePricingRule(item && item.pricingRule) === "room-courtesy";
}

function getCourtesyValueByRules(items, pricingRules) {
  const rules = new Set((pricingRules || []).map((rule) => normalizePricingRule(rule)));
  return items.reduce((total, item) => {
    if (!rules.has(normalizePricingRule(item.pricingRule))) {
      return total;
    }
    return total + item.quantity * fallbackValue(item.originalUnitPrice, item.unitPrice);
  }, 0);
}

function getCourtesyQuantityByRules(items, pricingRules) {
  const rules = new Set((pricingRules || []).map((rule) => normalizePricingRule(rule)));
  return items.reduce((total, item) => {
    if (!rules.has(normalizePricingRule(item.pricingRule))) {
      return total;
    }
    return total + item.quantity;
  }, 0);
}

function getRoomCourtesyValue(items) {
  return getCourtesyValueByRules(items, ["room-courtesy"]);
}

function getRoomCourtesyQuantity(items) {
  return getCourtesyQuantityByRules(items, ["room-courtesy"]);
}

function getRoomById(roomId) {
  return state.activeShift.rooms.find((room) => room.id === roomId);
}

function getRoomTotal(room) {
  return room.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
}

function getOpenShiftRooms() {
  if (!state.activeShift || !Array.isArray(state.activeShift.rooms)) {
    return [];
  }
  return state.activeShift.rooms.filter((room) => Array.isArray(room.items) && room.items.length > 0);
}

function formatOpenShiftRoomsList(rooms = getOpenShiftRooms()) {
  const labels = rooms.map((room) => room.label || room.roomLabel || "Mesa sin nombre");
  const visibleLabels = labels.slice(0, 6);
  const extraCount = Math.max(0, labels.length - visibleLabels.length);
  return `${visibleLabels.join(", ")}${extraCount ? ` y ${extraCount} más` : ""}`;
}

function buildOpenShiftRoomsWarning(actionLabel, rooms = getOpenShiftRooms()) {
  const count = rooms.length;
  if (!count) {
    return "";
  }
  return `No se puede ${actionLabel} porque ${
    count === 1 ? "queda 1 habitación/mesa abierta" : `quedan ${count} habitaciones/mesas abiertas`
  }: ${formatOpenShiftRoomsList(rooms)}. Cerrá todas antes de continuar.`;
}

function canRunShiftClosingAction(actionLabel) {
  const openRooms = getOpenShiftRooms();
  if (!openRooms.length) {
    return true;
  }
  alert(buildOpenShiftRoomsWarning(actionLabel, openRooms));
  return false;
}

function getItemsUnits(items) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function getCollectionTotal(items) {
  return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
}

function getItemCostTotal(item) {
  return item.quantity * (typeof item.unitCost === "number" ? item.unitCost : 0);
}

function getCollectionCostTotal(items) {
  return items.reduce((total, item) => total + getItemCostTotal(item), 0);
}

function getCollectionProfitTotal(items) {
  return getCollectionTotal(items) - getCollectionCostTotal(items);
}

function getDriverCoordinatorDiscountedUnitPrice(value) {
  return Math.round((Number(value) || 0) * DRIVER_COORDINATOR_DISCOUNT_FACTOR);
}

function isDriverCoordinatorFreeEligibleItem(productOrItem) {
  if (!productOrItem) return false;
  const category = String(productOrItem.category || "").trim().toLowerCase();
  const name = String(productOrItem.name || "").trim().toLowerCase();
  return category === "sin alcohol" && /\b(500|600)\s*ml\b/.test(name);
}

function isDriverCoordinatorPricingItem(item) {
  const rule = normalizePricingRule(item && item.pricingRule);
  return rule === "driver-free" || rule === "driver-discount";
}

function getDriverCoordinatorRoomContext(room) {
  if (!room) return null;
  const occupant = getRoomCheckinOccupant(roomNumberFromLabel(room.label || room.roomLabel));
  return occupant && occupant.compRoomType ? occupant : null;
}

function getDriverCoordinatorClosedRoomContext(room) {
  if (!room || !room.checkinCompRoomType) return null;
  const compRoomType = getCheckinCompRoomType({ groupCompRoomType: room.checkinCompRoomType });
  if (!compRoomType) return null;
  const roomNumber = roomNumberFromLabel(room.roomLabel || room.label);
  const guestName = String(room.guestName || "").trim();
  return {
    roomNumber,
    roomId: room.roomId || "",
    guestName: guestName || `${getCheckinCompRoomLabel(compRoomType)} Hab. ${roomNumber}`,
    guestNames: guestName ? [guestName] : [],
    groupId: room.checkinGroupId || `checkin-${slugify(room.checkinGroupName || roomNumber)}`,
    groupName: room.checkinGroupName || "",
    regime: room.checkinRegime || "",
    checkOutDate: room.checkinCheckOutDate || "",
    reservationId: room.checkinReservationId || "",
    compRoomType,
    compRoomLabel: getCheckinCompRoomLabel(compRoomType),
    compRoomGuestCount: Math.max(1, Number(room.checkinCompGuestCount) || 1),
  };
}

function getDriverCoordinatorRoomItemMeta(room, context = null) {
  const resolvedContext =
    context || getDriverCoordinatorRoomContext(room) || getDriverCoordinatorClosedRoomContext(room);
  const roomNumber = resolvedContext
    ? resolvedContext.roomNumber
    : roomNumberFromLabel(room && (room.label || room.roomLabel));
  const roleLabel =
    (resolvedContext && resolvedContext.compRoomLabel) || "Choferes/coordinadores";
  const guestNames =
    resolvedContext && Array.isArray(resolvedContext.guestNames)
      ? resolvedContext.guestNames.filter(Boolean)
      : [];
  const guestSummary = guestNames.length ? guestNames.join(", ") : "";
  const memberName = guestSummary
    ? `${roleLabel} Hab. ${roomNumber}: ${guestSummary}`
    : `${roleLabel} Hab. ${roomNumber}`;
  const reservationId = resolvedContext ? resolvedContext.reservationId : "";
  const memberSlug = slugify(`${reservationId || roomNumber}-${roleLabel}`) || roomNumber || "habitacion";
  return {
    driverCoordinatorMemberId: `checkin-room-${memberSlug}`,
    driverCoordinatorMemberName: memberName,
    driverCoordinatorGroupId:
      (resolvedContext && resolvedContext.groupId) ||
      `checkin-${slugify((resolvedContext && resolvedContext.groupName) || roomNumber || "grupo")}`,
    driverCoordinatorGroupName:
      (resolvedContext && resolvedContext.groupName) || `Check-in Hab. ${roomNumber}`,
    sourceShiftId: state.activeShift.id,
    serviceLabel: state.activeShift.serviceLabel,
  };
}

function getDriverCoordinatorRoomAddOptions(room, product) {
  const context = getDriverCoordinatorRoomContext(room);
  if (!context || !product) return null;
  return {
    ...getDriverCoordinatorRoomItemMeta(room, context),
    originalUnitPrice: product.price,
    unitPrice: getDriverCoordinatorDiscountedUnitPrice(product.price),
    pricingRule: "driver-discount",
  };
}

function rebalanceDriverCoordinatorRoomItems(roomId) {
  const room = getRoomById(roomId);
  const context = getDriverCoordinatorRoomContext(room);
  if (!room || !context) return;

  const untouchedItems = [];
  const roomSpecialItems = [];
  room.items.forEach((item) => {
    if (isRoomCourtesyItem(item)) {
      untouchedItems.push(item);
    } else {
      roomSpecialItems.push(item);
    }
  });

  if (!roomSpecialItems.length) {
    room.items = untouchedItems;
    return;
  }

  const groupedItems = new Map();
  roomSpecialItems.forEach((item) => {
    const key = item.productId || item.name;
    const existing =
      groupedItems.get(key) ||
      {
        productId: item.productId,
        name: item.name,
        category: item.category,
        productKind: item.productKind,
        quantity: 0,
        unitCost: typeof item.unitCost === "number" ? item.unitCost : 0,
        originalUnitPrice: fallbackValue(item.originalUnitPrice, item.unitPrice),
        stockRequirements: normalizeStockRequirements(item.stockRequirements),
      };
    existing.quantity += item.quantity;
    if (!existing.stockRequirements && item.stockRequirements) {
      existing.stockRequirements = normalizeStockRequirements(item.stockRequirements);
    }
    groupedItems.set(key, existing);
  });

  const freeQuantityByKey = new Map();
  let freeAllowance = Math.max(1, Number(context.compRoomGuestCount) || 1);
  Array.from(groupedItems.entries())
    .filter(([, entry]) => {
      const product = getProductById(entry.productId);
      return isDriverCoordinatorFreeEligibleItem(product || entry) && entry.quantity > 0;
    })
    .sort(([, left], [, right]) => {
      const priceDiff =
        fallbackValue(right.originalUnitPrice, 0) - fallbackValue(left.originalUnitPrice, 0);
      if (priceDiff !== 0) return priceDiff;
      return left.name.localeCompare(right.name, "es");
    })
    .forEach(([key, entry]) => {
      if (freeAllowance <= 0) return;
      const freeQuantity = Math.min(entry.quantity, freeAllowance);
      freeQuantityByKey.set(key, freeQuantity);
      freeAllowance -= freeQuantity;
    });

  const baseMeta = getDriverCoordinatorRoomItemMeta(room, context);
  const rebuiltItems = Array.from(groupedItems.entries())
    .sort(([, left], [, right]) => left.name.localeCompare(right.name, "es"))
    .flatMap(([key, entry]) => {
      const product =
        getProductById(entry.productId) ||
        {
          id: entry.productId,
          name: entry.name,
          category: entry.category,
          productKind: entry.productKind,
          price: fallbackValue(entry.originalUnitPrice, 0),
        };
      const originalUnitPrice = fallbackValue(entry.originalUnitPrice, product.price);
      const freeQuantity = freeQuantityByKey.get(key) || 0;
      const discountedQuantity = Math.max(0, entry.quantity - freeQuantity);
      const rows = [];
      const commonOptions = {
        ...baseMeta,
        unitCost: entry.unitCost,
        originalUnitPrice,
      };

      if (freeQuantity > 0) {
        rows.push(
          buildSaleItem(product, freeQuantity, entry.stockRequirements, {
            ...commonOptions,
            unitPrice: 0,
            pricingRule: "driver-free",
          })
        );
      }

      if (discountedQuantity > 0) {
        rows.push(
          buildSaleItem(product, discountedQuantity, entry.stockRequirements, {
            ...commonOptions,
            unitPrice: getDriverCoordinatorDiscountedUnitPrice(originalUnitPrice),
            pricingRule: "driver-discount",
          })
        );
      }

      return rows;
    });

  room.items = rebuiltItems.concat(untouchedItems);
}

function annotateDriverCoordinatorRoomItem(item, room, context = null) {
  const meta = getDriverCoordinatorRoomItemMeta(room, context);
  return {
    ...item,
    driverCoordinatorMemberId: item.driverCoordinatorMemberId || meta.driverCoordinatorMemberId,
    driverCoordinatorMemberName:
      item.driverCoordinatorMemberName || meta.driverCoordinatorMemberName,
    driverCoordinatorGroupId: item.driverCoordinatorGroupId || meta.driverCoordinatorGroupId,
    driverCoordinatorGroupName: item.driverCoordinatorGroupName || meta.driverCoordinatorGroupName,
    sourceShiftId: item.sourceShiftId || meta.sourceShiftId,
    serviceLabel: item.serviceLabel || meta.serviceLabel,
  };
}

function getDriverCoordinatorItemsFromOpenRooms() {
  return state.activeShift.rooms.flatMap((room) => {
    const context = getDriverCoordinatorRoomContext(room);
    if (!context) return [];
    return (room.items || [])
      .filter(isDriverCoordinatorPricingItem)
      .map((item) => annotateDriverCoordinatorRoomItem(item, room, context));
  });
}

function getDriverCoordinatorItemsFromClosedRooms(rooms = []) {
  return (rooms || []).flatMap((room) => {
    const context = getDriverCoordinatorClosedRoomContext(room);
    if (!context) return [];
    return (room.items || [])
      .filter(isDriverCoordinatorPricingItem)
      .map((item) => annotateDriverCoordinatorRoomItem(item, room, context));
  });
}

function getDriverCoordinatorOperationalItems() {
  return deepClone(
    (state.activeShift.driverCoordinatorConsumption || [])
      .concat(getDriverCoordinatorItemsFromOpenRooms())
      .concat(getDriverCoordinatorItemsFromClosedRooms(state.activeShift.closedRooms))
  );
}

function getDriverCoordinatorCourtesyValue(items) {
  return getCourtesyValueByRules(items, ["driver-free"]);
}

function getClosedRoomsCourtesyValue(rooms) {
  return rooms.reduce((total, room) => total + getRoomCourtesyValue(room.items || []), 0);
}

function buildRoomCourtesyBreakdown(rooms) {
  return rooms
    .map((room) => {
      const courtesyItems = (room.items || []).filter((item) => isRoomCourtesyItem(item));
      if (!courtesyItems.length) {
        return null;
      }

      const productMap = new Map();
      courtesyItems.forEach((item) => {
        const productKey = item.productId || item.name;
        const productEntry =
          productMap.get(productKey) ||
          {
            name: item.name,
            quantity: 0,
            value: 0,
          };
        productEntry.quantity += item.quantity;
        productEntry.value += item.quantity * fallbackValue(item.originalUnitPrice, item.unitPrice);
        productMap.set(productKey, productEntry);
      });

      return {
        roomId: room.roomId || room.id || "",
        roomLabel: room.roomLabel || room.label || "Habitación",
        courtesyQuantity: getRoomCourtesyQuantity(courtesyItems),
        courtesyValue: getRoomCourtesyValue(courtesyItems),
        products: Array.from(productMap.values()).sort(
          (a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name, "es")
        ),
      };
    })
    .filter(Boolean);
}

function getRoomsRevenueTotal(rooms) {
  return rooms.reduce(
    (total, room) =>
      isDeferredStayRoom(room)
        ? total
        : total + room.items.reduce((roomTotal, item) => roomTotal + item.quantity * item.unitPrice, 0),
    0
  );
}

function getRoomsCostTotal(rooms) {
  return rooms.reduce(
    (total, room) => (isDeferredStayRoom(room) ? total : total + getCollectionCostTotal(room.items)),
    0
  );
}

function getRecipeIngredientCost(ingredient, trail) {
  const product = getProductById(ingredient.ingredientProductId);
  if (!product) return null;
  const ingredientUnitCost = getEstimatedUnitCost(product, trail);
  if (ingredientUnitCost === null) return null;
  return ingredientUnitCost * ingredient.quantity;
}

function getEstimatedUnitCost(product, trail = []) {
  if (!product) return null;
  if (!isManufacturedProduct(product)) {
    return typeof product.costPrice === "number" ? product.costPrice : 0;
  }

  if (trail.includes(product.id)) return null;
  if (!Array.isArray(product.recipe) || product.recipe.length === 0) return null;

  let total = 0;
  for (const ingredient of product.recipe) {
    const ingredientCost = getRecipeIngredientCost(ingredient, trail.concat(product.id));
    if (ingredientCost === null) return null;
    total += ingredientCost;
  }
  return total;
}

function getProductMarginData(product) {
  if (!product || product.sellable === false || product.price <= 0) {
    return { unitCost: null, unitProfit: null, marginPercent: null };
  }
  const unitCost = getEstimatedUnitCost(product);
  if (unitCost === null) {
    return { unitCost: null, unitProfit: null, marginPercent: null };
  }
  const unitProfit = product.price - unitCost;
  return {
    unitCost,
    unitProfit,
    marginPercent: product.price > 0 ? (unitProfit / product.price) * 100 : null,
  };
}

function getProductKindLabel(product) {
  return isManufacturedProduct(product) ? "Elaborada" : "Fija";
}

function formatRecipeQuantity(value) {
  const quantity = Number(value);
  if (Number.isNaN(quantity)) return "-";
  return quantity.toFixed(quantity % 1 === 0 ? 0 : 3);
}

function buildRanking(groups) {
  const map = new Map();
  groups.forEach((group) => {
    group.forEach((item) => {
      const existing = map.get(item.name) || { name: item.name, quantity: 0 };
      existing.quantity += item.quantity;
      map.set(item.name, existing);
    });
  });
  return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
}

function buildStaffConsumptionBreakdown(items) {
  const memberMap = new Map();

  items.forEach((item) => {
    const staffMemberId = item.staffMemberId || "";
    const staffMemberName = getStaffMemberLabel(staffMemberId, item.staffMemberName);
    const key = staffMemberId || `unassigned-${staffMemberName}`;
    const memberEntry =
      memberMap.get(key) ||
      {
        staffMemberId: staffMemberId || null,
        name: staffMemberName,
        total: 0,
        quantity: 0,
        products: new Map(),
      };

    const itemTotal = item.quantity * item.unitPrice;
    memberEntry.total += itemTotal;
    memberEntry.quantity += item.quantity;

    const productKey = item.productId || item.name;
    const productEntry =
      memberEntry.products.get(productKey) ||
      {
        name: item.name,
        quantity: 0,
        total: 0,
      };

    productEntry.quantity += item.quantity;
    productEntry.total += itemTotal;

    memberEntry.products.set(productKey, productEntry);
    memberMap.set(key, memberEntry);
  });

  return Array.from(memberMap.values())
    .map((entry) => ({
      ...entry,
      products: Array.from(entry.products.values()).sort((a, b) =>
        a.name.localeCompare(b.name, "es")
      ),
    }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, "es"));
}

function buildDriverCoordinatorBreakdown(items) {
  const memberMap = new Map();

  items.forEach((item) => {
    const memberId = item.driverCoordinatorMemberId || "";
    const memberName = getDriverCoordinatorMemberLabel(
      memberId,
      item.driverCoordinatorMemberName
    );
    const key = memberId || `driver-${memberName}`;
    const memberEntry =
      memberMap.get(key) ||
      {
        driverCoordinatorMemberId: memberId || null,
        name: memberName,
        driverCoordinatorGroupId: getDriverCoordinatorGroupIdForItem(item),
        groupName: getDriverCoordinatorGroupNameForItem(item),
        total: 0,
        quantity: 0,
        courtesyQuantity: 0,
        courtesyValue: 0,
        products: new Map(),
      };

    const itemTotal = item.quantity * item.unitPrice;
    const courtesyValue =
      normalizePricingRule(item.pricingRule) === "driver-free"
        ? item.quantity * fallbackValue(item.originalUnitPrice, 0)
        : 0;

    memberEntry.total += itemTotal;
    memberEntry.quantity += item.quantity;
    memberEntry.courtesyQuantity +=
      normalizePricingRule(item.pricingRule) === "driver-free" ? item.quantity : 0;
    memberEntry.courtesyValue += courtesyValue;

    const productKey = item.productId || item.name;
    const productEntry =
      memberEntry.products.get(productKey) ||
      {
        name: item.name,
        quantity: 0,
        total: 0,
        courtesyQuantity: 0,
        courtesyValue: 0,
        discountedQuantity: 0,
      };

    productEntry.quantity += item.quantity;
    productEntry.total += itemTotal;
    productEntry.courtesyQuantity +=
      normalizePricingRule(item.pricingRule) === "driver-free" ? item.quantity : 0;
    productEntry.courtesyValue += courtesyValue;
    productEntry.discountedQuantity +=
      normalizePricingRule(item.pricingRule) === "driver-discount" ? item.quantity : 0;

    memberEntry.products.set(productKey, productEntry);
    memberMap.set(key, memberEntry);
  });

  return Array.from(memberMap.values())
    .map((entry) => ({
      ...entry,
      products: Array.from(entry.products.values()).sort((a, b) =>
        a.name.localeCompare(b.name, "es")
      ),
    }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, "es"));
}

function buildDriverCoordinatorGroupBreakdown(items) {
  const groupMap = new Map();

  items.forEach((item) => {
    const groupId = getDriverCoordinatorGroupIdForItem(item) || "";
    const groupName = getDriverCoordinatorGroupNameForItem(item) || "Sin grupo";
    const key = groupId || `group-${groupName}`;
    const groupEntry =
      groupMap.get(key) ||
      {
        groupId: groupId || null,
        name: groupName,
        total: 0,
        quantity: 0,
        courtesyQuantity: 0,
        courtesyValue: 0,
        members: new Set(),
      };

    groupEntry.total += item.quantity * item.unitPrice;
    groupEntry.quantity += item.quantity;
    if (normalizePricingRule(item.pricingRule) === "driver-free") {
      groupEntry.courtesyQuantity += item.quantity;
      groupEntry.courtesyValue +=
        item.quantity * fallbackValue(item.originalUnitPrice, item.unitPrice);
    }

    const memberName = getDriverCoordinatorMemberLabel(
      item.driverCoordinatorMemberId,
      item.driverCoordinatorMemberName
    );
    if (memberName) {
      groupEntry.members.add(memberName);
    }

    groupMap.set(key, groupEntry);
  });

  return Array.from(groupMap.values())
    .map((entry) => ({
      ...entry,
      members: Array.from(entry.members.values()).sort((a, b) => a.localeCompare(b, "es")),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getShiftMetaById(shiftId) {
  if (!shiftId) return null;
  if (state.activeShift && state.activeShift.id === shiftId) {
    return {
      openedAt: state.activeShift.openedAt,
      closedAt: null,
      serviceLabel: state.activeShift.serviceLabel,
    };
  }
  const historicShift = (state.shiftHistory || []).find(
    (shift) => shift.id === shiftId || shift.sourceShiftId === shiftId
  );
  if (!historicShift) return null;
  return {
    openedAt: historicShift.openedAt,
    closedAt: historicShift.closedAt || null,
    serviceLabel: historicShift.serviceLabel || "",
  };
}

function getDriverCoordinatorServiceMeta(item) {
  const shiftMeta = getShiftMetaById(item && item.sourceShiftId);
  const serviceDate = shiftMeta && shiftMeta.openedAt ? formatShortDate(shiftMeta.openedAt) : "";
  const serviceLabel = item.serviceLabel || (shiftMeta ? shiftMeta.serviceLabel : "") || "Servicio";
  return {
    serviceDate,
    serviceLabel,
    label: [serviceDate, serviceLabel].filter(Boolean).join(" · ") || serviceLabel,
    sortAt: shiftMeta && shiftMeta.openedAt ? shiftMeta.openedAt : null,
    key: (item && item.sourceShiftId) || `${serviceDate}-${serviceLabel}`,
  };
}

function buildDriverCoordinatorServiceBreakdown(items) {
  const serviceMap = new Map();

  items.forEach((item) => {
    const serviceMeta = getDriverCoordinatorServiceMeta(item);
    const key = serviceMeta.key;
    const entry =
      serviceMap.get(key) ||
      {
        id: key,
        label: serviceMeta.label,
        sortAt: serviceMeta.sortAt,
        total: 0,
        quantity: 0,
        courtesyQuantity: 0,
        courtesyValue: 0,
        products: new Map(),
      };

    const itemTotal = item.quantity * item.unitPrice;
    const courtesyValue =
      normalizePricingRule(item.pricingRule) === "driver-free"
        ? item.quantity * fallbackValue(item.originalUnitPrice, item.unitPrice)
        : 0;

    entry.total += itemTotal;
    entry.quantity += item.quantity;
    entry.courtesyQuantity +=
      normalizePricingRule(item.pricingRule) === "driver-free" ? item.quantity : 0;
    entry.courtesyValue += courtesyValue;

    const productKey = `${item.driverCoordinatorMemberId || item.driverCoordinatorMemberName || "sin-asignar"}::${
      item.productId || item.name
    }::${normalizePricingRule(item.pricingRule)}`;
    const productEntry =
      entry.products.get(productKey) ||
      {
        memberName: getDriverCoordinatorMemberLabel(
          item.driverCoordinatorMemberId,
          item.driverCoordinatorMemberName
        ),
        name: item.name,
        quantity: 0,
        total: 0,
        courtesyQuantity: 0,
        discountedQuantity: 0,
      };

    productEntry.quantity += item.quantity;
    productEntry.total += itemTotal;
    productEntry.courtesyQuantity +=
      normalizePricingRule(item.pricingRule) === "driver-free" ? item.quantity : 0;
    productEntry.discountedQuantity +=
      normalizePricingRule(item.pricingRule) === "driver-discount" ? item.quantity : 0;

    entry.products.set(productKey, productEntry);
    serviceMap.set(key, entry);
  });

  return Array.from(serviceMap.values())
    .map((entry) => ({
      ...entry,
      products: Array.from(entry.products.values()).sort((a, b) =>
        a.memberName.localeCompare(b.memberName, "es") || a.name.localeCompare(b.name, "es")
      ),
    }))
    .sort((a, b) => {
      if (a.sortAt && b.sortAt) {
        return new Date(a.sortAt).getTime() - new Date(b.sortAt).getTime();
      }
      return a.label.localeCompare(b.label, "es");
    });
}

function buildDriverCoordinatorGroupedProductTotals(items) {
  const productMap = new Map();

  (items || []).forEach((item) => {
    const key = item.productId || item.name;
    const entry =
      productMap.get(key) ||
      {
        productId: item.productId || null,
        name: item.name,
        quantity: 0,
        total: 0,
        courtesyQuantity: 0,
        courtesyValue: 0,
        discountedQuantity: 0,
      };

    const itemTotal = item.quantity * item.unitPrice;
    const courtesyValue =
      normalizePricingRule(item.pricingRule) === "driver-free"
        ? item.quantity * fallbackValue(item.originalUnitPrice, item.unitPrice)
        : 0;

    entry.quantity += item.quantity;
    entry.total += itemTotal;
    entry.courtesyQuantity +=
      normalizePricingRule(item.pricingRule) === "driver-free" ? item.quantity : 0;
    entry.courtesyValue += courtesyValue;
    entry.discountedQuantity +=
      normalizePricingRule(item.pricingRule) === "driver-discount" ? item.quantity : 0;

    productMap.set(key, entry);
  });

  return Array.from(productMap.values()).sort(
    (a, b) => b.quantity - a.quantity || b.total - a.total || a.name.localeCompare(b.name, "es")
  );
}

function buildDriverCoordinatorMemberServiceBreakdown(items) {
  const memberMap = new Map();

  (items || []).forEach((item) => {
    const memberId = item.driverCoordinatorMemberId || "";
    const memberName = getDriverCoordinatorMemberLabel(
      memberId,
      item.driverCoordinatorMemberName
    );
    const memberKey = memberId || `driver-${memberName}`;
    const memberEntry =
      memberMap.get(memberKey) ||
      {
        driverCoordinatorMemberId: memberId || null,
        name: memberName,
        total: 0,
        quantity: 0,
        courtesyQuantity: 0,
        courtesyValue: 0,
        services: new Map(),
      };

    const itemTotal = item.quantity * item.unitPrice;
    const courtesyValue =
      normalizePricingRule(item.pricingRule) === "driver-free"
        ? item.quantity * fallbackValue(item.originalUnitPrice, item.unitPrice)
        : 0;
    const serviceMeta = getDriverCoordinatorServiceMeta(item);
    const serviceEntry =
      memberEntry.services.get(serviceMeta.key) ||
      {
        id: serviceMeta.key,
        label: serviceMeta.label,
        sortAt: serviceMeta.sortAt,
        total: 0,
        quantity: 0,
        courtesyQuantity: 0,
        courtesyValue: 0,
        products: new Map(),
      };

    memberEntry.total += itemTotal;
    memberEntry.quantity += item.quantity;
    memberEntry.courtesyQuantity +=
      normalizePricingRule(item.pricingRule) === "driver-free" ? item.quantity : 0;
    memberEntry.courtesyValue += courtesyValue;

    serviceEntry.total += itemTotal;
    serviceEntry.quantity += item.quantity;
    serviceEntry.courtesyQuantity +=
      normalizePricingRule(item.pricingRule) === "driver-free" ? item.quantity : 0;
    serviceEntry.courtesyValue += courtesyValue;

    const productKey = `${item.productId || item.name}::${normalizePricingRule(item.pricingRule)}`;
    const productEntry =
      serviceEntry.products.get(productKey) ||
      {
        name: item.name,
        quantity: 0,
        total: 0,
        courtesyQuantity: 0,
        discountedQuantity: 0,
      };

    productEntry.quantity += item.quantity;
    productEntry.total += itemTotal;
    productEntry.courtesyQuantity +=
      normalizePricingRule(item.pricingRule) === "driver-free" ? item.quantity : 0;
    productEntry.discountedQuantity +=
      normalizePricingRule(item.pricingRule) === "driver-discount" ? item.quantity : 0;

    serviceEntry.products.set(productKey, productEntry);
    memberEntry.services.set(serviceMeta.key, serviceEntry);
    memberMap.set(memberKey, memberEntry);
  });

  return Array.from(memberMap.values())
    .map((entry) => ({
      ...entry,
      services: Array.from(entry.services.values())
        .map((service) => ({
          ...service,
          products: Array.from(service.products.values()).sort(
            (a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name, "es")
          ),
        }))
        .sort((a, b) => {
          if (a.sortAt && b.sortAt) {
            return new Date(a.sortAt).getTime() - new Date(b.sortAt).getTime();
          }
          return a.label.localeCompare(b.label, "es");
        }),
    }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, "es"));
}

function buildCompactBreakdownPreview(entries, limit = 3) {
  if (!entries.length) return "";
  const preview = entries
    .slice(0, limit)
    .map((entry) => `${entry.name} ${formatMoney(entry.total)}`)
    .join(" | ");
  const remaining = entries.length - limit;
  return remaining > 0 ? `${preview} | +${remaining}` : preview;
}

function isTimestampWithinShiftWindow(value, shiftOpenedAt, shiftClosedAt = null) {
  if (!value || !shiftOpenedAt) return false;
  const timestamp = new Date(value).getTime();
  const openedAt = new Date(shiftOpenedAt).getTime();
  const closedAt = shiftClosedAt ? new Date(shiftClosedAt).getTime() : Date.now();
  if (!Number.isFinite(timestamp) || !Number.isFinite(openedAt) || !Number.isFinite(closedAt)) {
    return false;
  }
  return timestamp >= openedAt && timestamp <= closedAt;
}

function buildDriverCoordinatorGroupStoryStatus(entry) {
  if (entry.closedThisShift) {
    if (entry.createdThisShift) {
      return {
        tone: "closed",
        label: "Creado y cerrado en este turno",
        copy:
          entry.shiftQuantity > 0
            ? "Se creó y se cerró en este mismo turno. Aquí queda el detalle del consumo del servicio y el cierre final del viaje."
            : "Se creó y se cerró en este turno sin consumos nuevos registrados.",
      };
    }

    return {
      tone: "closed",
      label: "Cerrado en este turno",
      copy:
        entry.shiftQuantity > 0
          ? "Este fue el último turno del grupo. Aquí queda el detalle del servicio y el cierre final del viaje."
          : "Se cerró en este turno sin consumos nuevos; solo quedó saldada la cuenta acumulada.",
    };
  }

  if (entry.createdThisShift) {
    return {
      tone: "created",
      label: "Creado en este turno",
      copy:
        entry.shiftQuantity > 0
          ? "Se creó en este turno y sigue activo para próximos servicios."
          : "Se creó en este turno y quedó listo para las próximas comidas.",
    };
  }

  return {
    tone: "active",
    label: "Continúa abierto",
    copy:
      entry.shiftQuantity > 0
        ? "Grupo en continuidad. Este turno suma nuevo consumo y la cuenta sigue abierta."
        : "Grupo en continuidad sin movimientos nuevos en este turno.",
  };
}

function buildCurrentShiftDriverCoordinatorGroupStories(
  shiftItems,
  shiftOpenedAt,
  activeGroups,
  groupHistory
) {
  const itemsByGroup = new Map();
  (shiftItems || []).forEach((item) => {
    const groupId = getDriverCoordinatorGroupIdForItem(item) || "";
    const groupName = getDriverCoordinatorGroupNameForItem(item) || "Sin grupo";
    const key = groupId || `group-${groupName}`;
    const bucket = itemsByGroup.get(key) || {
      groupId: groupId || null,
      groupName,
      items: [],
    };
    bucket.items.push(item);
    itemsByGroup.set(key, bucket);
  });

  const stories = new Map();

  (activeGroups || []).forEach((group) => {
    const key = group.id || `group-${group.name}`;
    const groupItems = deepClone((itemsByGroup.get(key) && itemsByGroup.get(key).items) || []);
    const createdThisShift = isTimestampWithinShiftWindow(group.createdAt, shiftOpenedAt);
    if (!groupItems.length && !createdThisShift) {
      return;
    }

    const shiftBreakdown = buildDriverCoordinatorBreakdown(groupItems);
    const pendingItems = getDriverCoordinatorAccountItemsForGroup(group.id);
    const baseEntry = {
      groupId: group.id,
      name: group.name,
      createdAt: group.createdAt || null,
      closedAt: null,
      createdThisShift,
      closedThisShift: false,
      shiftItems: groupItems,
      shiftBreakdown,
      shiftTotal: getCollectionTotal(groupItems),
      shiftCourtesyValue: getDriverCoordinatorCourtesyValue(groupItems),
      shiftQuantity: getItemsUnits(groupItems),
      pendingTotal: getCollectionTotal(pendingItems),
      pendingCourtesyValue: getDriverCoordinatorCourtesyValue(pendingItems),
      finalTotal: null,
      finalCourtesyValue: null,
      memberCount: shiftBreakdown.length,
    };

    stories.set(key, {
      ...baseEntry,
      ...buildDriverCoordinatorGroupStoryStatus(baseEntry),
    });
  });

  (groupHistory || [])
    .filter((entry) => isTimestampWithinShiftWindow(entry.closedAt, shiftOpenedAt))
    .forEach((entry) => {
      const key = entry.groupId || `group-${entry.groupName || "grupo"}`;
      const current = stories.get(key) || null;
      const groupItems = deepClone((itemsByGroup.get(key) && itemsByGroup.get(key).items) || []);
      const shiftBreakdown = buildDriverCoordinatorBreakdown(groupItems);
      const nextEntry = {
        groupId: entry.groupId || (current ? current.groupId : null),
        name: entry.groupName || (current ? current.name : "Grupo"),
        createdAt: entry.groupCreatedAt || (current ? current.createdAt : null),
        closedAt: entry.closedAt || null,
        createdThisShift: isTimestampWithinShiftWindow(
          entry.groupCreatedAt || (current ? current.createdAt : null),
          shiftOpenedAt,
          entry.closedAt || null
        ),
        closedThisShift: true,
        shiftItems: groupItems,
        shiftBreakdown,
        shiftTotal: getCollectionTotal(groupItems),
        shiftCourtesyValue: getDriverCoordinatorCourtesyValue(groupItems),
        shiftQuantity: getItemsUnits(groupItems),
        pendingTotal: 0,
        pendingCourtesyValue: 0,
        finalTotal: fallbackValue(entry.snapshot && entry.snapshot.total, current ? current.pendingTotal : 0),
        finalCourtesyValue: fallbackValue(
          entry.snapshot && entry.snapshot.courtesyValue,
          current ? current.pendingCourtesyValue : 0
        ),
        memberCount: fallbackValue(entry.snapshot && entry.snapshot.memberCount, shiftBreakdown.length),
      };

      stories.set(key, {
        ...nextEntry,
        ...buildDriverCoordinatorGroupStoryStatus(nextEntry),
      });
    });

  itemsByGroup.forEach((bucket, key) => {
    if (stories.has(key)) {
      return;
    }

    const groupItems = deepClone(bucket.items || []);
    const shiftBreakdown = buildDriverCoordinatorBreakdown(groupItems);
    const pendingItems = bucket.groupId ? getDriverCoordinatorAccountItemsForGroup(bucket.groupId) : [];
    const fallbackEntry = {
      groupId: bucket.groupId,
      name: bucket.groupName,
      createdAt: null,
      closedAt: null,
      createdThisShift: false,
      closedThisShift: false,
      shiftItems: groupItems,
      shiftBreakdown,
      shiftTotal: getCollectionTotal(groupItems),
      shiftCourtesyValue: getDriverCoordinatorCourtesyValue(groupItems),
      shiftQuantity: getItemsUnits(groupItems),
      pendingTotal: getCollectionTotal(pendingItems),
      pendingCourtesyValue: getDriverCoordinatorCourtesyValue(pendingItems),
      finalTotal: null,
      finalCourtesyValue: null,
      memberCount: shiftBreakdown.length,
    };

    stories.set(key, {
      ...fallbackEntry,
      ...buildDriverCoordinatorGroupStoryStatus(fallbackEntry),
    });
  });

  return Array.from(stories.values()).sort((a, b) => {
    if (a.closedThisShift !== b.closedThisShift) {
      return a.closedThisShift ? 1 : -1;
    }
    if (a.createdThisShift !== b.createdThisShift) {
      return a.createdThisShift ? -1 : 1;
    }
    return a.name.localeCompare(b.name, "es");
  });
}

function getLowStockProducts() {
  return state.catalog.filter(
    (product) =>
      !product.archived &&
      product.trackStock &&
      typeof product.stock === "number" &&
      product.stock <= getLowStockThreshold(product)
  );
}

function buildConsumptionRequirements(productId, quantity, requirements = {}, trail = [], options = {}) {
  const product = getProductById(productId);
  if (!product) {
    return { ok: false, message: "Producto no encontrado." };
  }

  if (options.root !== false) {
    if (product.archived) {
      return { ok: false, message: `El producto ${product.name} está archivado.` };
    }
    if (product.sellable === false) {
      return { ok: false, message: `${product.name} está marcado como solo insumo.` };
    }
  }

  if (isManufacturedProduct(product)) {
    if (!Array.isArray(product.recipe) || product.recipe.length === 0) {
      return {
        ok: false,
        message: `${product.name} necesita una receta antes de poder venderse.`,
      };
    }
    if (trail.includes(product.id)) {
      return {
        ok: false,
        message: `Hay una receta circular en ${product.name}.`,
      };
    }
    for (const ingredient of product.recipe) {
      const result = buildConsumptionRequirements(
        ingredient.ingredientProductId,
        ingredient.quantity * quantity,
        requirements,
        trail.concat(product.id),
        { root: false }
      );
      if (!result.ok) return result;
    }
    return { ok: true, requirements };
  }

  if (product.trackStock) {
    requirements[product.id] = (requirements[product.id] || 0) + quantity;
  }
  return { ok: true, requirements };
}

function validateRequirements(requirements) {
  for (const [productId, quantity] of Object.entries(requirements)) {
    const product = getProductById(productId);
    if (!product) {
      return { ok: false, message: "No se encontro un insumo de la receta." };
    }
    const currentStock = typeof product.stock === "number" ? product.stock : 0;
    if (currentStock < quantity) {
      return {
        ok: false,
        message: `Stock insuficiente para ${product.name}. Falta ${(
          quantity - currentStock
        ).toFixed(3)}.`,
      };
    }
  }
  return { ok: true };
}

function getProductAvailability(productId, quantity = 1) {
  const requirementsResult = buildConsumptionRequirements(productId, quantity, {}, [], {
    root: true,
  });
  if (!requirementsResult.ok) {
    return requirementsResult;
  }
  return validateRequirements(requirementsResult.requirements);
}

function applyRequirements(requirements, direction) {
  Object.entries(requirements).forEach(([productId, quantity]) => {
    const product = getProductById(productId);
    if (!product || !product.trackStock) return;
    const currentStock = typeof product.stock === "number" ? product.stock : 0;
    product.stock = currentStock + quantity * direction;
  });
}

function scaleRequirements(requirements, multiplier) {
  const normalized = normalizeStockRequirements(requirements);
  if (!normalized) {
    return {};
  }

  return Object.entries(normalized).reduce((scaled, [productId, quantity]) => {
    scaled[productId] = quantity * multiplier;
    return scaled;
  }, {});
}

function buildSaleItem(product, quantity, stockRequirements = null, options = {}) {
  const margin = getProductMarginData(product);
  const unitCost =
    typeof options.unitCost === "number"
      ? options.unitCost
      : margin.unitCost === null
        ? 0
        : margin.unitCost;
  const originalUnitPrice =
    typeof options.originalUnitPrice === "number" ? options.originalUnitPrice : product.price;
  return {
    productId: product.id,
    name: product.name,
    category: product.category,
    productKind: product.productKind,
    unitPrice:
      typeof options.unitPrice === "number"
        ? options.unitPrice
        : options.priceMode === "cost"
          ? unitCost
          : product.price,
    unitCost,
    originalUnitPrice,
    stockRequirements: normalizeStockRequirements(stockRequirements),
    paymentMethod: normalizePaymentMethod(options.paymentMethod),
    staffMemberId: options.staffMemberId || null,
    staffMemberName: options.staffMemberName || "",
    driverCoordinatorMemberId: options.driverCoordinatorMemberId || null,
    driverCoordinatorMemberName: options.driverCoordinatorMemberName || "",
    driverCoordinatorGroupId: options.driverCoordinatorGroupId || null,
    driverCoordinatorGroupName: options.driverCoordinatorGroupName || "",
    pricingRule: normalizePricingRule(
      options.pricingRule,
      options.priceMode === "cost" ? "cost" : "sale"
    ),
    sourceShiftId: options.sourceShiftId || null,
    serviceLabel: options.serviceLabel || "",
    accountClosedAt: options.accountClosedAt || null,
    accountClosureId: options.accountClosureId || null,
    quantity,
  };
}

function findItemIndex(targetItems, productId, options = {}) {
  const hasPaymentMethod =
    Object.prototype.hasOwnProperty.call(options, "paymentMethod") &&
    options.paymentMethod !== undefined &&
    options.paymentMethod !== null &&
    options.paymentMethod !== "";
  const paymentMethod = hasPaymentMethod
    ? normalizePaymentMethod(options.paymentMethod)
    : null;
  const hasStaffMemberId = Object.prototype.hasOwnProperty.call(options, "staffMemberId");
  const staffMemberId = hasStaffMemberId ? String(options.staffMemberId || "") : null;
  const hasDriverCoordinatorMemberId = Object.prototype.hasOwnProperty.call(
    options,
    "driverCoordinatorMemberId"
  );
  const driverCoordinatorMemberId = hasDriverCoordinatorMemberId
    ? String(options.driverCoordinatorMemberId || "")
    : null;
  const hasPricingRule = Object.prototype.hasOwnProperty.call(options, "pricingRule");
  const pricingRule = hasPricingRule ? normalizePricingRule(options.pricingRule) : null;

  return targetItems.findIndex((item) => {
    if (item.productId !== productId) return false;
    if (hasPaymentMethod && normalizePaymentMethod(item.paymentMethod) !== paymentMethod) {
      return false;
    }
    if (hasStaffMemberId && String(item.staffMemberId || "") !== staffMemberId) {
      return false;
    }
    if (
      hasDriverCoordinatorMemberId &&
      String(item.driverCoordinatorMemberId || "") !== driverCoordinatorMemberId
    ) {
      return false;
    }
    if (hasPricingRule && normalizePricingRule(item.pricingRule) !== pricingRule) {
      return false;
    }
    return true;
  });
}

function addProductToItems(targetItems, productId, quantity = 1, options = {}) {
  const product = getProductById(productId);
  if (!product) return { ok: false, message: "Producto no encontrado." };
  const existingItemIndex = findItemIndex(targetItems, productId, options);
  const existingItem = existingItemIndex >= 0 ? targetItems[existingItemIndex] : null;
  const requirementsResult =
    existingItem && existingItem.stockRequirements
      ? { ok: true, requirements: scaleRequirements(existingItem.stockRequirements, quantity) }
      : buildConsumptionRequirements(productId, quantity, {}, [], {
          root: true,
        });
  if (!requirementsResult.ok) return requirementsResult;

  const unitRequirementsResult =
    !existingItem || !existingItem.stockRequirements
      ? buildConsumptionRequirements(productId, 1, {}, [], {
          root: true,
        })
      : null;
  if (unitRequirementsResult && !unitRequirementsResult.ok) return unitRequirementsResult;

  const validation = validateRequirements(requirementsResult.requirements);
  if (!validation.ok) return validation;

  applyRequirements(requirementsResult.requirements, -1);

  if (existingItem) {
    existingItem.quantity += quantity;
    if (typeof existingItem.unitCost !== "number") {
      const margin = getProductMarginData(product);
      existingItem.unitCost = margin.unitCost === null ? 0 : margin.unitCost;
    }
    if (typeof options.originalUnitPrice === "number") {
      existingItem.originalUnitPrice = options.originalUnitPrice;
    }
    if (typeof options.unitPrice === "number") {
      existingItem.unitPrice = options.unitPrice;
    }
    if (options.priceMode === "cost") {
      existingItem.unitPrice = existingItem.unitCost;
    }
    if (options.staffMemberId) {
      existingItem.staffMemberId = options.staffMemberId;
      existingItem.staffMemberName = options.staffMemberName || existingItem.staffMemberName || "";
    }
    if (options.driverCoordinatorMemberId) {
      existingItem.driverCoordinatorMemberId = options.driverCoordinatorMemberId;
      existingItem.driverCoordinatorMemberName =
        options.driverCoordinatorMemberName || existingItem.driverCoordinatorMemberName || "";
    }
    if (options.driverCoordinatorGroupId) {
      existingItem.driverCoordinatorGroupId = options.driverCoordinatorGroupId;
      existingItem.driverCoordinatorGroupName =
        options.driverCoordinatorGroupName || existingItem.driverCoordinatorGroupName || "";
    }
    if (options.pricingRule) {
      existingItem.pricingRule = normalizePricingRule(options.pricingRule, existingItem.pricingRule);
    }
    if (options.sourceShiftId) {
      existingItem.sourceShiftId = options.sourceShiftId;
    }
    if (options.serviceLabel) {
      existingItem.serviceLabel = options.serviceLabel;
    }
    if (options.accountClosedAt) {
      existingItem.accountClosedAt = options.accountClosedAt;
    }
    if (options.accountClosureId) {
      existingItem.accountClosureId = options.accountClosureId;
    }
    if (!existingItem.stockRequirements && unitRequirementsResult) {
      existingItem.stockRequirements = normalizeStockRequirements(
        unitRequirementsResult.requirements
      );
    }
  } else {
    targetItems.push(
      buildSaleItem(
        product,
        quantity,
        unitRequirementsResult ? unitRequirementsResult.requirements : null,
        options
      )
    );
  }
  return { ok: true };
}

function changeItemQuantity(targetItems, productId, delta, options = {}) {
  const itemIndex = findItemIndex(targetItems, productId, options);
  const item = itemIndex >= 0 ? targetItems[itemIndex] : null;
  const product = getProductById(productId);
  if (!item || !product) return { ok: false, message: "No se encontro el item." };

  if (delta > 0) {
    const requirementsResult = item.stockRequirements
      ? { ok: true, requirements: scaleRequirements(item.stockRequirements, delta) }
      : buildConsumptionRequirements(productId, delta, {}, [], {
          root: true,
        });
    if (!requirementsResult.ok) return requirementsResult;

    const unitRequirementsResult = !item.stockRequirements
      ? buildConsumptionRequirements(productId, 1, {}, [], {
          root: true,
        })
      : null;
    if (unitRequirementsResult && !unitRequirementsResult.ok) return unitRequirementsResult;

    const validation = validateRequirements(requirementsResult.requirements);
    if (!validation.ok) return validation;
    applyRequirements(requirementsResult.requirements, -1);
    item.quantity += delta;
    if (!item.stockRequirements && unitRequirementsResult) {
      item.stockRequirements = normalizeStockRequirements(unitRequirementsResult.requirements);
    }
    return { ok: true };
  }

  const absDelta = Math.abs(delta);
  const requirementsResult = item.stockRequirements
    ? { ok: true, requirements: scaleRequirements(item.stockRequirements, absDelta) }
    : buildConsumptionRequirements(productId, absDelta, {}, [], {
        root: false,
      });
  if (!requirementsResult.ok) return requirementsResult;

  if (absDelta >= item.quantity) {
    applyRequirements(requirementsResult.requirements, 1);
    targetItems.splice(itemIndex, 1);
    return { ok: true };
  }

  applyRequirements(requirementsResult.requirements, 1);
  item.quantity -= absDelta;
  return { ok: true };
}

function removeItem(targetItems, productId, options = {}) {
  const itemIndex = findItemIndex(targetItems, productId, options);
  const item = itemIndex >= 0 ? targetItems[itemIndex] : null;
  if (!item) return;
  const requirementsResult = item.stockRequirements
    ? { ok: true, requirements: scaleRequirements(item.stockRequirements, item.quantity) }
    : buildConsumptionRequirements(productId, item.quantity, {}, [], {
        root: false,
      });
  if (requirementsResult.ok) {
    applyRequirements(requirementsResult.requirements, 1);
  }
  targetItems.splice(itemIndex, 1);
}

function moveRoomItemPricing(roomId, productId, fromPricingRule, toPricingRule) {
  const room = getRoomById(roomId);
  const product = getProductById(productId);
  if (!room || !product) {
    return { ok: false, message: "No se encontró la habitación o el producto." };
  }

  const sourceIndex = findItemIndex(room.items, productId, {
    pricingRule: fromPricingRule,
  });
  const sourceItem = sourceIndex >= 0 ? room.items[sourceIndex] : null;

  if (!sourceItem || sourceItem.quantity <= 0) {
    return { ok: false, message: "No hay unidades disponibles para ese ajuste." };
  }

  const targetIndex = findItemIndex(room.items, productId, {
    pricingRule: toPricingRule,
  });
  const targetItem = targetIndex >= 0 ? room.items[targetIndex] : null;
  const normalizedTargetRule = normalizePricingRule(toPricingRule);
  const originalUnitPrice = fallbackValue(sourceItem.originalUnitPrice, product.price);
  const targetUnitPrice = normalizedTargetRule === "room-courtesy" ? 0 : originalUnitPrice;

  if (sourceItem.quantity === 1) {
    room.items.splice(sourceIndex, 1);
  } else {
    sourceItem.quantity -= 1;
  }

  if (targetItem) {
    targetItem.quantity += 1;
    targetItem.unitPrice = targetUnitPrice;
    targetItem.originalUnitPrice = originalUnitPrice;
    if (typeof sourceItem.unitCost === "number") {
      targetItem.unitCost = sourceItem.unitCost;
    }
  } else {
    room.items.push(
      buildSaleItem(product, 1, sourceItem.stockRequirements, {
        unitPrice: targetUnitPrice,
        unitCost: sourceItem.unitCost,
        originalUnitPrice,
        pricingRule: normalizedTargetRule,
      })
    );
  }

  room.updatedAt = new Date().toISOString();
  return { ok: true };
}

function syncDriverCoordinatorAccountsForActiveShift() {
  state.driverCoordinatorAccounts = state.driverCoordinatorAccounts.filter(
    (item) => item.sourceShiftId !== state.activeShift.id
  );
  state.driverCoordinatorAccounts.push(
    ...deepClone(
      state.activeShift.driverCoordinatorConsumption
        .filter(isPendingDriverCoordinatorAccountItem)
        .map((item) => ({
          ...item,
          sourceShiftId: state.activeShift.id,
          serviceLabel: item.serviceLabel || state.activeShift.serviceLabel,
        }))
    )
  );
}

function applyDriverCoordinatorCourtesyRebalance() {
  try {
    if (localStorage.getItem(DRIVER_COORDINATOR_REBALANCE_MARKER_KEY) === "done") {
      return;
    }
  } catch (error) {
    console.error("No se pudo leer la marca de reequilibrio para choferes/coordinadores.", error);
  }

  const memberIds = Array.from(
    new Set(
      (state.activeShift.driverCoordinatorConsumption || [])
        .map((item) => String(item.driverCoordinatorMemberId || "").trim())
        .filter(Boolean)
    )
  );

  if (memberIds.length) {
    memberIds.forEach((memberId) => rebalanceDriverCoordinatorMemberItems(memberId));
    persistState("Recalcular bonificación choferes/coordinadores", {
      snapshot: false,
      toast: false,
    });
  }

  try {
    localStorage.setItem(DRIVER_COORDINATOR_REBALANCE_MARKER_KEY, "done");
  } catch (error) {
    console.error(
      "No se pudo guardar la marca de reequilibrio para choferes/coordinadores.",
      error
    );
  }
}

function rebalanceDriverCoordinatorMemberItems(memberId) {
  const remainingItems = [];
  const memberItems = [];
  const settledMemberItems = [];

  state.activeShift.driverCoordinatorConsumption.forEach((item) => {
    if (String(item.driverCoordinatorMemberId || "") === String(memberId || "")) {
      if (item.accountClosedAt) {
        settledMemberItems.push(item);
      } else {
        memberItems.push(item);
      }
    } else {
      remainingItems.push(item);
    }
  });

  if (!memberItems.length) {
    state.activeShift.driverCoordinatorConsumption = remainingItems.concat(settledMemberItems);
    syncDriverCoordinatorAccountsForActiveShift();
    return;
  }

  const groupedItems = new Map();
  memberItems.forEach((item) => {
    const key = item.productId || item.name;
    const existing =
      groupedItems.get(key) ||
      {
        productId: item.productId,
        name: item.name,
        category: item.category,
        productKind: item.productKind,
        quantity: 0,
        unitCost: typeof item.unitCost === "number" ? item.unitCost : 0,
        originalUnitPrice: fallbackValue(item.originalUnitPrice, item.unitPrice),
        stockRequirements: normalizeStockRequirements(item.stockRequirements),
      };
    existing.quantity += item.quantity;
    if (!existing.stockRequirements && item.stockRequirements) {
      existing.stockRequirements = normalizeStockRequirements(item.stockRequirements);
    }
    if (
      (!existing.originalUnitPrice || existing.originalUnitPrice === 0) &&
      fallbackValue(item.originalUnitPrice, item.unitPrice) > 0
    ) {
      existing.originalUnitPrice = fallbackValue(item.originalUnitPrice, item.unitPrice);
    }
    groupedItems.set(key, existing);
  });

  const eligibleFreeProductId = Array.from(groupedItems.values())
    .filter((entry) => {
      const product = getProductById(entry.productId);
      return isDriverCoordinatorFreeEligibleItem(product || entry) && entry.quantity > 0;
    })
    .sort((a, b) => {
      const priceDiff = fallbackValue(b.originalUnitPrice, 0) - fallbackValue(a.originalUnitPrice, 0);
      if (priceDiff !== 0) return priceDiff;
      return a.name.localeCompare(b.name, "es");
    })[0]?.productId;

  const rebuiltItems = Array.from(groupedItems.values())
    .sort((a, b) => a.name.localeCompare(b.name, "es"))
    .flatMap((entry) => {
      const product =
        getProductById(entry.productId) ||
        {
          id: entry.productId,
          name: entry.name,
          category: entry.category,
          productKind: entry.productKind,
          price: fallbackValue(entry.originalUnitPrice, 0),
        };
      const baseOptions = {
        unitCost: entry.unitCost,
        originalUnitPrice: fallbackValue(entry.originalUnitPrice, 0),
        driverCoordinatorMemberId: memberId,
        driverCoordinatorMemberName: getDriverCoordinatorMemberLabel(memberId),
        driverCoordinatorGroupId:
          memberItems[0].driverCoordinatorGroupId ||
          (getDriverCoordinatorMemberById(memberId)
            ? getDriverCoordinatorMemberById(memberId).groupId || null
            : null),
        driverCoordinatorGroupName:
          memberItems[0].driverCoordinatorGroupName ||
          (getDriverCoordinatorMemberById(memberId)
            ? getDriverCoordinatorMemberById(memberId).groupName || ""
            : ""),
        sourceShiftId: state.activeShift.id,
        serviceLabel: state.activeShift.serviceLabel,
      };
      const freeQuantity = entry.productId === eligibleFreeProductId ? 1 : 0;
      const discountedQuantity = Math.max(0, entry.quantity - freeQuantity);
      const rows = [];

      if (freeQuantity > 0) {
        rows.push(
          buildSaleItem(product, freeQuantity, entry.stockRequirements, {
            ...baseOptions,
            unitPrice: 0,
            pricingRule: "driver-free",
          })
        );
      }

      if (discountedQuantity > 0) {
        rows.push(
          buildSaleItem(product, discountedQuantity, entry.stockRequirements, {
            ...baseOptions,
            unitPrice: getDriverCoordinatorDiscountedUnitPrice(
              fallbackValue(entry.originalUnitPrice, product.price)
            ),
            pricingRule: "driver-discount",
          })
        );
      }

      return rows;
    });

  state.activeShift.driverCoordinatorConsumption = remainingItems
    .concat(settledMemberItems)
    .concat(rebuiltItems);
  syncDriverCoordinatorAccountsForActiveShift();
}

function applyMovementCleanupPreservingStock() {
  try {
    if (localStorage.getItem(MOVEMENT_CLEANUP_MARKER_KEY) === "done") {
      return;
    }
  } catch (error) {
    console.error("No se pudo leer la marca de limpieza de consumos.", error);
  }

  state.activeShift = createFreshShift();
  state.driverCoordinatorGroups = [];
  state.driverCoordinatorMembers = [];
  state.driverCoordinatorAccounts = [];
  state.driverCoordinatorGroupHistory = [];
  state.shiftHistory = [];
  state.safety = {
    snapshots: [],
    lastSavedAt: new Date().toISOString(),
  };
  ui.selectedRoomId = "room-1";
  ui.pendingPaymentRequest = null;
  ui.driverCoordinatorGroupEditor = null;
  ui.driverCoordinatorGroupId = "";

  try {
    localStorage.setItem(MOVEMENT_CLEANUP_MARKER_KEY, "done");
  } catch (error) {
    console.error("No se pudo guardar la marca de limpieza de consumos.", error);
  }

  persistState("Limpiar consumos y cierres", { snapshot: false, toast: false });
}

function getCategoryOptions(scope = "catalog") {
  const sourceProducts = scope === "catalog" ? getActiveCatalog(true) : getSellableCatalog(false);
  const categoryPool = Array.from(
    new Set(STANDARD_CATEGORIES.concat(sourceProducts.map((product) => product.category)))
  ).filter((category) => {
    if (scope === "catalog") return true;
    return category !== "Insumos";
  });

  return ["all"].concat(categoryPool.sort((a, b) => a.localeCompare(b, "es")));
}

function normalizeScopeCategory(scope, selectedCategory) {
  const options = getCategoryOptions(scope);
  return options.includes(selectedCategory) ? selectedCategory : "all";
}

function filterProducts(products, query, category) {
  const normalizedQuery = query.trim().toLowerCase();
  return products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesQuery =
      !normalizedQuery || product.name.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}

function closeRoom(roomId) {
  const room = getRoomById(roomId);
  if (!room || room.items.length === 0) {
    alert("La habitación no tiene ítems para cerrar.");
    return;
  }

  if (!room.printedAt) {
    openPaymentMethodModal({
      kind: "room-close-unprinted-warning",
      roomId,
    });
    return;
  }

  openPaymentMethodModal({
    kind: "room-close",
    roomId,
  });
}

function restoreInventoryFromSaleItem(item) {
  if (!item || !item.productId || !item.quantity) return;

  const requirementsResult = item.stockRequirements
    ? { ok: true, requirements: scaleRequirements(item.stockRequirements, item.quantity) }
    : buildConsumptionRequirements(item.productId, item.quantity, {}, [], {
        root: false,
      });

  if (requirementsResult.ok) {
    applyRequirements(requirementsResult.requirements, 1);
  }
}

function cancelRoom(roomId) {
  const room = getRoomById(roomId);
  if (!room) return;

  const hasRoomMovement = room.items.length > 0 || Boolean(room.printedAt);
  if (!hasRoomMovement) {
    alert("La habitación ya está libre.");
    return;
  }

  const confirmationMessage =
    room.items.length > 0
      ? `Se va a cancelar ${room.label}. Los productos cargados se quitarán y el stock volverá a quedar como antes.`
      : `Se va a cancelar ${room.label} y se quitara la marca de ticket impreso.`;

  if (!window.confirm(`${confirmationMessage}\n\nEsta acción no registra cobro ni cierre.`)) {
    return;
  }

  room.items.forEach((item) => restoreInventoryFromSaleItem(item));
  room.items = [];
  room.printedAt = null;
  room.deferredTicketPrintedAt = null;
  room.updatedAt = new Date().toISOString();
  ui.pendingPaymentRequest = null;

  persistState(`Cancelar ${room.label}`);
  render({ preserveScroll: true });
}

function finalizeRoomClose(roomId, paymentMethod) {
  const room = getRoomById(roomId);
  if (!room || room.items.length === 0) {
    ui.pendingPaymentRequest = null;
    alert("La habitación ya no tiene ítems para cerrar.");
    return;
  }

  const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);
  if (normalizedPaymentMethod === "unknown") {
    alert("Selecciona una forma de pago valida.");
    return;
  }

  const roomNumber = roomNumberFromLabel(room.label);
  const checkinOccupant = getRoomCheckinOccupant(roomNumber);
  let deferredTicketHtml = "";
  if (normalizedPaymentMethod === "stay") {
    const printedAt = new Date().toISOString();
    room.printedAt = room.printedAt || printedAt;
    room.deferredTicketPrintedAt = printedAt;
    deferredTicketHtml = buildDeferredRoomTicketDocument(
      room,
      checkinOccupant,
      "Comprobante para firma"
    );
  }

  state.activeShift.closedRooms.unshift({
    id: uid("room-close"),
    roomId: room.id,
    roomLabel: room.label,
    paymentMethod: normalizedPaymentMethod,
    printedAt: room.printedAt,
    deferredTicketPrintedAt: room.deferredTicketPrintedAt,
    guestName: checkinOccupant ? checkinOccupant.guestName : "",
    checkinReservationId: checkinOccupant ? checkinOccupant.reservationId : "",
    checkinGroupId: checkinOccupant ? checkinOccupant.groupId : "",
    checkinGroupName: checkinOccupant ? checkinOccupant.groupName : "",
    checkinRegime: checkinOccupant ? checkinOccupant.regime : "",
    checkinCheckOutDate: checkinOccupant ? checkinOccupant.checkOutDate : "",
    checkinCompRoomType: checkinOccupant ? checkinOccupant.compRoomType : "",
    checkinCompRoomLabel: checkinOccupant ? checkinOccupant.compRoomLabel : "",
    checkinCompGuestCount: checkinOccupant ? checkinOccupant.compRoomGuestCount : 0,
    closedAt: new Date().toISOString(),
    items: deepClone(room.items),
    total: getRoomTotal(room),
  });

  room.items = [];
  room.note = "";
  room.printedAt = null;
  room.deferredTicketPrintedAt = null;
  room.updatedAt = new Date().toISOString();
  ui.pendingPaymentRequest = null;

  persistState(`Cerrar ${room.label} | ${getPaymentMethodLabel(normalizedPaymentMethod)}`);
  if (deferredTicketHtml) {
    openPrintWindow(deferredTicketHtml, {
      frameId: `${PRINT_FRAME_ID}-saldo-firma-${Date.now()}-${room.id}`,
      removeAfterMs: 12000,
    });
  }
  render({ preserveScroll: true });
}

function finalizeCashierAdd(productId, paymentMethod) {
  const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);
  if (normalizedPaymentMethod === "unknown") {
    alert("Selecciona una forma de pago valida.");
    return;
  }

  const items = getScopeItems("cashier");
  if (!items) return;

  const result = addProductToItems(items, productId, 1, {
    paymentMethod: normalizedPaymentMethod,
  });
  if (!result.ok) {
    ui.pendingPaymentRequest = null;
    alert(result.message);
    render({ preserveScroll: true });
    return;
  }

  const product = getProductById(productId);
  ui.pendingPaymentRequest = null;
  persistState(
    `Caja directa ${product ? product.name : ""} | ${getPaymentMethodLabel(normalizedPaymentMethod)}`
  );
  render({ preserveScroll: true });
}

function finalizeStaffAdd(productId, staffMemberId) {
  const staffMember = getStaffMemberById(staffMemberId);
  if (!staffMember || staffMember.archived) {
    alert("Selecciona un integrante válido.");
    return;
  }

  const product = getProductById(productId);
  if (!product) {
    ui.pendingPaymentRequest = null;
    alert("Producto no encontrado.");
    render({ preserveScroll: true });
    return;
  }

  if (getEstimatedUnitCost(product) === null) {
    alert("Define el costo del producto antes de cargarlo al personal.");
    return;
  }

  const items = getScopeItems("staff");
  if (!items) return;

  const result = addProductToItems(items, productId, 1, {
    priceMode: "cost",
    staffMemberId: staffMember.id,
    staffMemberName: staffMember.name,
  });
  if (!result.ok) {
    ui.pendingPaymentRequest = null;
    alert(result.message);
    render({ preserveScroll: true });
    return;
  }

  ui.pendingPaymentRequest = null;
  persistState(
    `Personal ${staffMember.name} | ${product ? product.name : ""}`
  );
  render({ preserveScroll: true });
}

function finalizeDriverCoordinatorAdd(productId, memberId) {
  const member = getDriverCoordinatorMemberById(memberId);
  if (!member || member.archived) {
    alert("Selecciona una persona valida.");
    return;
  }
  const group =
    member.groupId && getDriverCoordinatorGroupById(member.groupId)
      ? getDriverCoordinatorGroupById(member.groupId)
      : null;
  if (!group) {
    ui.pendingPaymentRequest = null;
    alert("La persona elegida ya no tiene un grupo activo.");
    render({ preserveScroll: true });
    return;
  }

  const product = getProductById(productId);
  if (!product) {
    ui.pendingPaymentRequest = null;
    alert("Producto no encontrado.");
    render({ preserveScroll: true });
    return;
  }

  const result = addProductToItems(
    state.activeShift.driverCoordinatorConsumption,
    productId,
    1,
    {
      unitPrice: getDriverCoordinatorDiscountedUnitPrice(product.price),
      originalUnitPrice: product.price,
      pricingRule: "driver-discount",
      driverCoordinatorMemberId: member.id,
      driverCoordinatorMemberName: member.name,
      driverCoordinatorGroupId: group.id,
      driverCoordinatorGroupName: group.name,
      sourceShiftId: state.activeShift.id,
      serviceLabel: state.activeShift.serviceLabel,
    }
  );
  if (!result.ok) {
    ui.pendingPaymentRequest = null;
    alert(result.message);
    render({ preserveScroll: true });
    return;
  }

  rebalanceDriverCoordinatorMemberItems(member.id);
  ui.pendingPaymentRequest = null;
  persistState(`Choferes/coordinadores ${member.name} | ${product ? product.name : ""}`);
  render({ preserveScroll: true });
}

function changeDriverCoordinatorItemQuantity(productId, memberId, pricingRule, delta) {
  const product = getProductById(productId);
  if (!product) {
    return { ok: false, message: "Producto no encontrado." };
  }

  if (delta > 0) {
    const member = getDriverCoordinatorMemberById(memberId);
    if (!member || member.archived) {
      return { ok: false, message: "La persona asignada ya no está disponible." };
    }
    const group =
      member.groupId && getDriverCoordinatorGroupById(member.groupId)
        ? getDriverCoordinatorGroupById(member.groupId)
        : null;
    if (!group) {
      return { ok: false, message: "La persona asignada ya no tiene un grupo activo." };
    }

    const result = addProductToItems(
      state.activeShift.driverCoordinatorConsumption,
      productId,
      delta,
      {
        unitPrice: getDriverCoordinatorDiscountedUnitPrice(product.price),
        originalUnitPrice: product.price,
        pricingRule: "driver-discount",
        driverCoordinatorMemberId: member.id,
        driverCoordinatorMemberName: member.name,
        driverCoordinatorGroupId: group.id,
        driverCoordinatorGroupName: group.name,
        sourceShiftId: state.activeShift.id,
        serviceLabel: state.activeShift.serviceLabel,
      }
    );
    if (!result.ok) {
      return result;
    }

    rebalanceDriverCoordinatorMemberItems(member.id);
    return { ok: true };
  }

  const result = changeItemQuantity(
    state.activeShift.driverCoordinatorConsumption,
    productId,
    delta,
    {
      driverCoordinatorMemberId: memberId,
      pricingRule,
    }
  );
  if (!result.ok) {
    return result;
  }

  rebalanceDriverCoordinatorMemberItems(memberId);
  return { ok: true };
}

function removeDriverCoordinatorItem(productId, memberId, pricingRule) {
  removeItem(state.activeShift.driverCoordinatorConsumption, productId, {
    driverCoordinatorMemberId: memberId,
    pricingRule,
  });
  rebalanceDriverCoordinatorMemberItems(memberId);
}

function reopenClosedRoom(closedRoomId) {
  const closedRoomIndex = state.activeShift.closedRooms.findIndex((room) => room.id === closedRoomId);
  if (closedRoomIndex === -1) return;

  const closedRoom = state.activeShift.closedRooms[closedRoomIndex];
  const room = getRoomById(closedRoom.roomId);
  if (!room) {
    alert("No se encontró la habitación original para reabrir.");
    return;
  }

  const roomAlreadyInUse = room.items.length > 0 || Boolean(room.printedAt);
  if (roomAlreadyInUse) {
    alert(
      `${room.label} ya tiene un consumo activo. Para evitar mezclar datos, no se puede reabrir este cierre.`
    );
    return;
  }

  if (
    !window.confirm(
      `Se va a reabrir ${room.label} para corregir el consumo. El cobro registrado volverá a quedar pendiente y el ticket volverá a quedar sin imprimir hasta que la cierres otra vez.`
    )
  ) {
    return;
  }

  room.items = deepClone(closedRoom.items);
  room.printedAt = null;
  room.deferredTicketPrintedAt = null;
  room.updatedAt = new Date().toISOString();
  ui.selectedRoomId = room.id;

  state.activeShift.closedRooms.splice(closedRoomIndex, 1);

  persistState(`Reabrir ${room.label}`);
  render({ preserveScroll: true });
}

function closeShift() {
  const driverCoordinatorItems = getDriverCoordinatorOperationalItems();
  if (!canRunShiftClosingAction("cerrar el turno global")) {
    return;
  }

  if (
    state.activeShift.closedRooms.length === 0 &&
    state.activeShift.cashierSales.length === 0 &&
    state.activeShift.staffConsumption.length === 0 &&
    driverCoordinatorItems.length === 0
  ) {
    alert("Todavía no hay movimiento para cerrar el turno.");
    return;
  }

  if (!window.confirm("Se va a generar un cierre global y abrir un turno nuevo.")) {
    return;
  }

  const closedRoomsRevenue = getRoomsRevenueTotal(state.activeShift.closedRooms);
  const closedRoomsCost = getRoomsCostTotal(state.activeShift.closedRooms);
  const cashierRevenue = getCollectionTotal(state.activeShift.cashierSales);
  const cashierCost = getCollectionCostTotal(state.activeShift.cashierSales);
  const soldTotal = closedRoomsRevenue + cashierRevenue;
  const estimatedCost = closedRoomsCost + cashierCost;
  const estimatedProfit = soldTotal - estimatedCost;
  const roomCourtesyValue = getClosedRoomsCourtesyValue(state.activeShift.closedRooms);

  const shiftSummary = {
    id: state.activeShift.id,
    sourceShiftId: state.activeShift.id,
    openedAt: state.activeShift.openedAt,
    closedAt: new Date().toISOString(),
    serviceLabel: state.activeShift.serviceLabel,
    closedRooms: deepClone(state.activeShift.closedRooms),
    cashierSales: deepClone(state.activeShift.cashierSales),
    staffConsumption: deepClone(state.activeShift.staffConsumption),
    driverCoordinatorConsumption: deepClone(driverCoordinatorItems),
    totals: {
      rooms: closedRoomsRevenue,
      cashier: cashierRevenue,
      sold: soldTotal,
      cost: estimatedCost,
      profit: estimatedProfit,
      marginPercent: soldTotal > 0 ? (estimatedProfit / soldTotal) * 100 : 0,
      roomCourtesyValue,
      staffValue: getCollectionTotal(state.activeShift.staffConsumption),
      driverCoordinatorValue: getCollectionTotal(driverCoordinatorItems),
      driverCoordinatorCourtesyValue: getDriverCoordinatorCourtesyValue(driverCoordinatorItems),
    },
    ranking: buildRanking([
      state.activeShift.closedRooms.flatMap((room) => room.items),
      state.activeShift.cashierSales,
      state.activeShift.driverCoordinatorConsumption,
    ]),
  };

  state.shiftHistory.unshift(shiftSummary);
  state.activeShift = createFreshShift();
  ui.selectedRoomId = "room-1";
  persistState("Cierre global de turno");
  render();
  requestAnimationFrame(() => {
    scrollToHeroSection();
  });
}

function getDriverCoordinatorGroupSnapshot(groupId) {
  const group = getDriverCoordinatorGroupById(groupId);
  if (!group) return null;

  const items = deepClone(getDriverCoordinatorAccountItemsForGroup(groupId));
  const breakdown = buildDriverCoordinatorBreakdown(items);
  const serviceBreakdown = buildDriverCoordinatorServiceBreakdown(items);
  const groupedProducts = buildDriverCoordinatorGroupedProductTotals(items);
  const memberServiceBreakdown = buildDriverCoordinatorMemberServiceBreakdown(items);

  return {
    generatedAt: new Date().toISOString(),
    groupId: group.id,
    groupName: group.name,
    items,
    breakdown,
    serviceBreakdown,
    groupedProducts,
    memberServiceBreakdown,
    total: getCollectionTotal(items),
    courtesyValue: getDriverCoordinatorCourtesyValue(items),
    quantity: getItemsUnits(items),
    memberCount: breakdown.length,
    serviceCount: serviceBreakdown.length,
  };
}

function getDriverCoordinatorCurrentTurnSnapshot(groupId) {
  const group = getDriverCoordinatorGroupById(groupId);
  if (!group) return null;

  const items = deepClone(
    getDriverCoordinatorItemsForGroup(state.activeShift.driverCoordinatorConsumption, groupId)
  );
  const breakdown = buildDriverCoordinatorBreakdown(items);

  return {
    generatedAt: new Date().toISOString(),
    groupId: group.id,
    groupName: group.name,
    serviceLabel: state.activeShift.serviceLabel,
    openedAt: state.activeShift.openedAt,
    items,
    breakdown,
    total: getCollectionTotal(items),
    courtesyValue: getDriverCoordinatorCourtesyValue(items),
    quantity: getItemsUnits(items),
    memberCount: breakdown.length,
  };
}

function buildDriverCoordinatorGroupTicketDocument(snapshot) {
  const memberSections = snapshot.breakdown.length
    ? snapshot.breakdown
        .map(
          (entry) => `
            <div class="member-block">
              <div class="member-head">
                <strong>${escapeHtml(entry.name)}</strong>
                <span>${formatMoney(entry.total)}</span>
              </div>
              <div class="member-lines">
                ${entry.products
                  .map((product) => {
                    const detailParts = [];
                    if (product.courtesyQuantity > 0) {
                      detailParts.push(`${product.courtesyQuantity} bonif.`);
                    }
                    if (product.discountedQuantity > 0) {
                      detailParts.push(`${product.discountedQuantity} c/30%`);
                    }
                    return `
                      <div class="member-line">
                        <span>${escapeHtml(product.name)} x${product.quantity}</span>
                        <span>${detailParts.join(" + ") || formatMoney(product.total)}</span>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          `
        )
        .join("")
    : `<div class="empty-copy">No hay consumos pendientes para este grupo.</div>`;

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(`${state.hotelName} - Ticket grupo ${snapshot.groupName}`)}</title>
        <style>
          @page { size: 72mm auto; margin: 0; }
          body {
            margin: 0;
            padding: 10px 10px 14px;
            width: 268px;
            font-family: "Segoe UI", Arial, sans-serif;
            color: #111;
            background: #fff;
          }
          .ticket { display: grid; gap: 10px; }
          .brand { text-align: center; }
          .brand img { max-width: 120px; height: auto; display: block; margin: 0 auto 6px; }
          .brand h1 {
            margin: 0;
            font-size: 24px;
            line-height: 1;
            font-weight: 700;
          }
          .brand p {
            margin: 4px 0 0;
            font-size: 11px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }
          .summary-box,
          .totals-box {
            border: 1px solid #111;
            padding: 10px;
            display: grid;
            gap: 4px;
          }
          .summary-line,
          .member-head,
          .member-line,
          .total-line {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            align-items: baseline;
          }
          .summary-line,
          .member-line {
            font-size: 11px;
          }
          .member-block {
            border-top: 1px dashed #777;
            padding-top: 8px;
            display: grid;
            gap: 6px;
          }
          .member-head {
            font-size: 12px;
          }
          .member-lines {
            display: grid;
            gap: 4px;
          }
          .totals-box strong {
            font-size: 14px;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            line-height: 1.4;
          }
          .empty-copy {
            font-size: 11px;
            text-align: center;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="brand">
            <img src="${LOGO_URL}" alt="Solanas" />
            <h1>${escapeHtml(state.hotelName)}</h1>
            <p>Cuenta de grupo</p>
          </div>
          <div class="summary-box">
            <div class="summary-line"><span>Grupo</span><strong>${escapeHtml(snapshot.groupName)}</strong></div>
            <div class="summary-line"><span>Emitido</span><span>${escapeHtml(formatDateTime(snapshot.generatedAt))}</span></div>
            <div class="summary-line"><span>Integrantes</span><span>${snapshot.memberCount}</span></div>
          </div>
          ${memberSections}
          <div class="totals-box">
            <div class="total-line"><span>Bonificado</span><strong>${formatMoney(snapshot.courtesyValue)}</strong></div>
            <div class="total-line"><span>Total a cobrar</span><strong>${formatMoney(snapshot.total)}</strong></div>
          </div>
          <div class="footer">
            <div>No válido como factura</div>
            <div>Cuenta final del grupo</div>
          </div>
        </div>
        <script>
          window.onload = () => {
            window.print();
          };
        </script>
      </body>
    </html>
  `;
}

function buildDriverCoordinatorTurnTicketDocument(snapshot) {
  const rows = snapshot.breakdown.length
    ? snapshot.breakdown
        .map(
          (entry) => `
            <div class="member-block">
              <div class="member-head">
                <strong>${escapeHtml(entry.name)}</strong>
                <span>${formatMoney(entry.total)}</span>
              </div>
              <div class="member-lines">
                ${entry.products
                  .map((product) => {
                    const detailParts = [];
                    if (product.courtesyQuantity > 0) {
                      detailParts.push(`${product.courtesyQuantity} bonif.`);
                    }
                    if (product.discountedQuantity > 0) {
                      detailParts.push(`${product.discountedQuantity} c/30%`);
                    }
                    return `
                      <div class="member-line">
                        <span>${escapeHtml(product.name)} x${product.quantity}</span>
                        <span>${detailParts.join(" + ") || formatMoney(product.total)}</span>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          `
        )
        .join("")
    : `<div class="empty-copy">No hubo consumos de este grupo en el turno actual.</div>`;

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(`${state.hotelName} - Ticket turno ${snapshot.groupName}`)}</title>
        <style>
          @page { size: 72mm auto; margin: 0; }
          body {
            margin: 0;
            padding: 10px 10px 14px;
            width: 268px;
            font-family: "Segoe UI", Arial, sans-serif;
            color: #111;
            background: #fff;
          }
          .ticket { display: grid; gap: 10px; }
          .brand { text-align: center; }
          .brand img { max-width: 120px; height: auto; display: block; margin: 0 auto 6px; }
          .brand h1 {
            margin: 0;
            font-size: 24px;
            line-height: 1;
            font-weight: 700;
          }
          .brand p {
            margin: 4px 0 0;
            font-size: 11px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }
          .summary-box,
          .totals-box,
          .signature-box {
            border: 1px solid #111;
            padding: 10px;
            display: grid;
            gap: 4px;
          }
          .summary-line,
          .member-head,
          .member-line,
          .total-line {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            align-items: baseline;
          }
          .summary-line,
          .member-line {
            font-size: 11px;
          }
          .member-block {
            border-top: 1px dashed #777;
            padding-top: 8px;
            display: grid;
            gap: 6px;
          }
          .member-head {
            font-size: 12px;
          }
          .member-lines {
            display: grid;
            gap: 4px;
          }
          .totals-box strong {
            font-size: 14px;
          }
          .signature-box {
            gap: 8px;
          }
          .signature-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .signature-copy {
            font-size: 10px;
            line-height: 1.4;
          }
          .signature-line {
            margin-top: 8px;
            border-bottom: 1px solid #111;
            height: 28px;
          }
          .signature-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            line-height: 1.4;
          }
          .empty-copy {
            font-size: 11px;
            text-align: center;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="brand">
            <img src="${LOGO_URL}" alt="Solanas" />
            <h1>${escapeHtml(state.hotelName)}</h1>
            <p>Choferes y coordinadores</p>
          </div>
          <div class="summary-box">
            <div class="summary-line"><span>Grupo</span><strong>${escapeHtml(snapshot.groupName)}</strong></div>
            <div class="summary-line"><span>Turno</span><span>${escapeHtml(snapshot.serviceLabel)}</span></div>
            <div class="summary-line"><span>Emitido</span><span>${escapeHtml(formatDateTime(snapshot.generatedAt))}</span></div>
            <div class="summary-line"><span>Integrantes</span><span>${snapshot.memberCount}</span></div>
          </div>
          ${rows}
          <div class="totals-box">
            <div class="total-line"><span>Bonificado</span><strong>${formatMoney(snapshot.courtesyValue)}</strong></div>
            <div class="total-line"><span>Total del turno</span><strong>${formatMoney(snapshot.total)}</strong></div>
          </div>
          <div class="signature-box">
            <div class="signature-title">Conformidad del grupo</div>
            <div class="signature-copy">
              El representante del grupo declara que lo detallado en este ticket corresponde al consumo efectivo de este turno.
            </div>
            <div class="signature-line"></div>
            <div class="signature-label">Firma representante</div>
            <div class="signature-line"></div>
            <div class="signature-label">Aclaración</div>
          </div>
          <div class="footer">
            <div>No válido como factura</div>
            <div>Control del turno</div>
          </div>
        </div>
        <script>
          window.onload = () => {
            setTimeout(() => {
              window.focus();
              window.print();
            }, 180);
          };
        </script>
      </body>
    </html>
  `;
}

function printDriverCoordinatorGroupTicket(groupId, snapshotOverride = null) {
  const snapshot = snapshotOverride || getDriverCoordinatorGroupSnapshot(groupId);
  if (!snapshot) {
    alert("Primero selecciona un grupo válido.");
    return;
  }
  if (!snapshot.items.length) {
    alert("Este grupo todavía no tiene cuenta pendiente para imprimir.");
    return;
  }

  openPrintWindow(buildDriverCoordinatorGroupTicketDocument(snapshot));
}

function printDriverCoordinatorTurnTicket(groupId, snapshotOverride = null) {
  const snapshot = snapshotOverride || getDriverCoordinatorCurrentTurnSnapshot(groupId);
  if (!snapshot) {
    alert("Primero selecciona un grupo válido.");
    return;
  }
  if (!snapshot.items.length) {
    alert("Este grupo no tiene consumos en el turno actual para imprimir.");
    return;
  }

  openPrintWindow(buildDriverCoordinatorTurnTicketDocument(snapshot));
}

async function openDriverCoordinatorGroupReport(groupId, snapshotOverride = null) {
  const snapshot = snapshotOverride || getDriverCoordinatorGroupSnapshot(groupId);
  if (!snapshot) {
    alert("Primero selecciona un grupo válido.");
    return;
  }

  const [embeddedLogoUrl, embeddedTitleFontUrl] = await Promise.all([
    ensureManagerReportLogoDataUrl(),
    ensureManagerReportTitleFontDataUrl(),
  ]);
  const reportHtmlFileName = `${state.hotelName} - Cierre de grupo ${snapshot.groupName} - ${formatFileSafeDate(
    snapshot.generatedAt
  )}.html`;
  const reportLogoHtml = embeddedLogoUrl
    ? `<img src="${embeddedLogoUrl}" alt="Solanas" />`
    : "";
  const fontFace = embeddedTitleFontUrl
    ? `
      @font-face {
        font-family: "SolanasReportTitle";
        src: url("${embeddedTitleFontUrl}") format("truetype");
        font-weight: 700;
        font-style: normal;
      }
    `
    : "";
  const groupedProducts = snapshot.groupedProducts || buildDriverCoordinatorGroupedProductTotals(snapshot.items);
  const memberServiceBreakdown =
    snapshot.memberServiceBreakdown || buildDriverCoordinatorMemberServiceBreakdown(snapshot.items);
  const serviceCards = snapshot.serviceBreakdown.length
    ? snapshot.serviceBreakdown
        .map(
          (entry) => `
            <article class="mini-card">
              <div class="mini-card-head">
                <div>
                  <h3>${escapeHtml(entry.label)}</h3>
                  <p>${entry.quantity} unidades | ${entry.courtesyQuantity} bonificadas</p>
                </div>
                <strong>${formatMoney(entry.total)}</strong>
              </div>
              <div class="mini-card-list">
                ${entry.products
                  .map((product) => {
                    const detailParts = [];
                    if (product.courtesyQuantity > 0) {
                      detailParts.push(`${product.courtesyQuantity} bonif.`);
                    }
                    if (product.discountedQuantity > 0) {
                      detailParts.push(`${product.discountedQuantity} c/30%`);
                    }
                    return `
                      <div class="mini-line">
                        <span>${escapeHtml(product.memberName)} · ${escapeHtml(product.name)}</span>
                        <span>x${product.quantity}${detailParts.length ? ` | ${detailParts.join(" + ")}` : ""}</span>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </article>
          `
        )
        .join("")
    : `<div class="empty-box">No hubo movimientos acumulados para este grupo.</div>`;
  const groupedProductCards = groupedProducts.length
    ? groupedProducts
        .map((product) => {
          const detailParts = [];
          if (product.courtesyQuantity > 0) {
            detailParts.push(`${product.courtesyQuantity} bonif.`);
          }
          if (product.discountedQuantity > 0) {
            detailParts.push(`${product.discountedQuantity} c/30%`);
          }
          return `
            <article class="mini-card">
              <div class="mini-card-head">
                <div>
                  <h3>${escapeHtml(product.name)}</h3>
                  <p>${product.quantity} unidades${
                    detailParts.length ? ` | ${detailParts.join(" + ")}` : ""
                  }</p>
                </div>
                <strong>${formatMoney(product.total)}</strong>
              </div>
              ${
                product.courtesyValue > 0
                  ? `<div class="mini-card-foot">Bonificado ${formatMoney(product.courtesyValue)}</div>`
                  : ""
              }
            </article>
          `;
        })
        .join("")
    : `<div class="empty-box">No hay productos acumulados para resumir en este grupo.</div>`;
  const memberCards = memberServiceBreakdown.length
    ? memberServiceBreakdown
        .map(
          (entry) => `
            <article class="mini-card">
              <div class="mini-card-head">
                <div>
                  <h3>${escapeHtml(entry.name)}</h3>
                  <p>${entry.quantity} unidades | ${entry.courtesyQuantity} bonificadas</p>
                </div>
                <strong>${formatMoney(entry.total)}</strong>
              </div>
              <div class="mini-card-list">
                ${entry.services
                  .map((service) => {
                    return `
                      <div class="member-service-block">
                        <div class="member-service-head">
                          <strong>${escapeHtml(service.label)}</strong>
                          <span>${formatMoney(service.total)}</span>
                        </div>
                        <div class="member-service-list">
                          ${service.products
                            .map((product) => {
                              const detailParts = [];
                              if (product.courtesyQuantity > 0) {
                                detailParts.push(`${product.courtesyQuantity} bonif.`);
                              }
                              if (product.discountedQuantity > 0) {
                                detailParts.push(`${product.discountedQuantity} c/30%`);
                              }
                              return `
                                <div class="mini-line">
                                  <span>${escapeHtml(product.name)}</span>
                                  <span>x${product.quantity}${
                                    detailParts.length ? ` | ${detailParts.join(" + ")}` : ""
                                  }</span>
                                </div>
                              `;
                            })
                            .join("")}
                        </div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
              ${
                entry.courtesyValue > 0
                  ? `<div class="mini-card-foot">Bonificado ${formatMoney(entry.courtesyValue)}</div>`
                  : ""
              }
            </article>
          `
        )
        .join("")
    : `<div class="empty-box">No hay integrantes con consumos cargados.</div>`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(`${state.hotelName} - Cierre de grupo ${snapshot.groupName}`)}</title>
        <style>
          ${fontFace}
          :root {
            --ink: #233238;
            --muted: #5f6f75;
            --line: #d9ddd3;
            --accent: #4d8f8e;
            --accent-soft: #edf6f5;
            --paper: #fbf8f2;
          }
          * { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body {
            margin: 0;
            font-family: "Segoe UI", Arial, sans-serif;
            color: var(--ink);
            background:
              radial-gradient(circle at top right, rgba(77, 143, 142, 0.14), transparent 28%),
              linear-gradient(180deg, #fffdf8 0%, var(--paper) 100%);
          }
          .report-shell {
            width: min(1120px, calc(100vw - 40px));
            margin: 0 auto;
            padding: 24px 0 40px;
          }
          .report-bar {
            position: sticky;
            top: 14px;
            z-index: 20;
            display: flex;
            justify-content: space-between;
            gap: 14px;
            align-items: center;
            margin-bottom: 18px;
            padding: 12px 14px;
            border: 1px solid rgba(77, 143, 142, 0.18);
            border-radius: 18px;
            background: rgba(255,255,255,0.9);
            backdrop-filter: blur(10px);
          }
          .report-actions { display: flex; gap: 10px; align-items: center; }
          .report-button {
            border: 1px solid rgba(77, 143, 142, 0.24);
            border-radius: 999px;
            padding: 10px 16px;
            background: white;
            color: var(--ink);
            font-weight: 700;
            cursor: pointer;
          }
          .report-button.is-primary {
            background: linear-gradient(135deg, #4f9190, #3f7f7e);
            color: white;
            border-color: transparent;
          }
          .hero {
            display: grid;
            gap: 18px;
            padding: 28px;
            border: 1px solid rgba(77, 143, 142, 0.18);
            border-radius: 28px;
            background: rgba(255,255,255,0.82);
            box-shadow: 0 18px 40px rgba(25, 44, 45, 0.08);
          }
          .hero-brand {
            display: flex;
            gap: 18px;
            align-items: center;
          }
          .hero-brand img {
            width: 76px;
            height: 76px;
            border-radius: 24px;
            background: #eef7f6;
            object-fit: contain;
            padding: 10px;
          }
          .hero-kicker {
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.22em;
            color: var(--muted);
            font-size: 12px;
          }
          .hero h1,
          .section h2 {
            margin: 6px 0 0;
            font-family: "SolanasReportTitle", Georgia, serif;
          }
          .hero h1 { font-size: clamp(32px, 5vw, 52px); }
          .hero-copy { margin: 0; color: var(--muted); font-size: 17px; line-height: 1.6; }
          .hero-pills,
          .hero-kpis,
          .card-grid { display: flex; flex-wrap: wrap; gap: 12px; }
          .hero-pill,
          .hero-kpi,
          .mini-card {
            border: 1px solid rgba(77, 143, 142, 0.16);
            border-radius: 22px;
            background: rgba(255,255,255,0.92);
          }
          .hero-pill {
            padding: 10px 14px;
            color: var(--muted);
            font-weight: 700;
          }
          .hero-kpi {
            min-width: 180px;
            padding: 16px 18px;
          }
          .hero-kpi strong {
            display: block;
            font-size: 26px;
            margin-top: 6px;
          }
          .section {
            margin-top: 18px;
            padding: 24px 28px;
            border: 1px solid rgba(77, 143, 142, 0.14);
            border-radius: 26px;
            background: rgba(255,255,255,0.82);
          }
          .section p { color: var(--muted); }
          .mini-card { padding: 18px; width: min(100%, 520px); }
          .mini-card-head,
          .mini-line {
            display: flex;
            justify-content: space-between;
            gap: 14px;
            align-items: baseline;
          }
          .mini-card-head h3 {
            margin: 0;
            font-size: 20px;
            font-family: "SolanasReportTitle", Georgia, serif;
          }
          .mini-card-head p,
          .mini-card-foot,
          .mini-line { margin: 6px 0 0; color: var(--muted); }
          .mini-card-list {
            display: grid;
            gap: 8px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid var(--line);
          }
          .member-service-block {
            display: grid;
            gap: 8px;
            padding: 12px 0 0;
            margin-top: 4px;
            border-top: 1px dashed rgba(95, 111, 117, 0.28);
          }
          .member-service-block:first-child {
            border-top: 0;
            padding-top: 0;
          }
          .member-service-head {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: baseline;
            color: var(--ink);
            font-size: 0.95rem;
          }
          .member-service-list {
            display: grid;
            gap: 8px;
          }
          .empty-box {
            padding: 18px;
            border-radius: 18px;
            background: var(--accent-soft);
            color: var(--muted);
          }
          @media (max-width: 720px) {
            .report-shell { width: calc(100vw - 20px); padding-top: 14px; }
            .report-bar { flex-direction: column; align-items: stretch; }
            .report-actions { justify-content: stretch; }
            .report-button { width: 100%; }
            .hero, .section { padding: 20px; }
            .hero-brand { align-items: flex-start; }
          }
        </style>
      </head>
      <body>
        <div class="report-shell">
          <div class="report-bar">
            <div>
              <strong>${escapeHtml(snapshot.groupName)}</strong>
              <div style="color: var(--muted); margin-top: 4px;">Informe final del grupo</div>
            </div>
            <div class="report-actions">
              <button class="report-button" type="button" onclick="window.location.href = '#top';">Inicio</button>
              <button class="report-button is-primary" type="button" onclick="saveCurrentReport();">Guardar informe</button>
            </div>
          </div>
          <section class="hero" id="top">
            <div class="hero-brand">
              ${reportLogoHtml}
              <div>
                <p class="hero-kicker">Cierre de grupo</p>
                <h1>${escapeHtml(snapshot.groupName)}</h1>
              </div>
            </div>
            <p class="hero-copy">
              Informe acumulado del viaje para choferes y coordinadores, listo para entregar o guardar.
            </p>
            <div class="hero-pills">
              <span class="hero-pill">Emitido ${escapeHtml(formatDateTime(snapshot.generatedAt))}</span>
              <span class="hero-pill">${snapshot.memberCount} integrantes</span>
              <span class="hero-pill">${snapshot.serviceCount} comidas registradas</span>
            </div>
            <div class="hero-kpis">
              <div class="hero-kpi"><span>Total a cobrar</span><strong>${formatMoney(snapshot.total)}</strong></div>
              <div class="hero-kpi"><span>Bonificado</span><strong>${formatMoney(snapshot.courtesyValue)}</strong></div>
              <div class="hero-kpi"><span>Unidades</span><strong>${snapshot.quantity}</strong></div>
            </div>
          </section>
          <section class="section">
            <h2>Resumen del grupo completo</h2>
            <p>Todo lo consumido por el grupo, agrupado por producto a lo largo del viaje.</p>
            <div class="card-grid">
              ${groupedProductCards}
            </div>
          </section>
          <section class="section">
            <h2>Consumo por integrante</h2>
            <p>Detalle final de lo consumido por cada chofer o coordinador, separado por fecha y servicio.</p>
            <div class="card-grid">
              ${memberCards}
            </div>
          </section>
          <section class="section">
            <h2>Consumo por comida</h2>
            <p>Resumen cruzado por almuerzo o cena, útil para reconstruir el viaje completo.</p>
            <div class="card-grid">
              ${serviceCards}
            </div>
          </section>
        </div>
        <script>
          const REPORT_FILE_NAME = ${JSON.stringify(reportHtmlFileName)};
          function saveCurrentReport() {
            const blob = new Blob([document.documentElement.outerHTML], { type: "text/html;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = REPORT_FILE_NAME;
            link.click();
            URL.revokeObjectURL(url);
          }
        </script>
      </body>
    </html>
  `;

  openDocumentWindow(
    html,
    `${state.hotelName} - Cierre de grupo ${snapshot.groupName} - ${formatShortDate(
      snapshot.generatedAt
    )}`
  );
}

function closeDriverCoordinatorGroup(groupId) {
  const group = getDriverCoordinatorGroupById(groupId);
  if (!group) return;

  const snapshot = getDriverCoordinatorGroupSnapshot(groupId) || {
    generatedAt: new Date().toISOString(),
    groupId: group.id,
    groupName: group.name,
    items: [],
    breakdown: [],
    serviceBreakdown: [],
    total: 0,
    courtesyValue: 0,
    quantity: 0,
    memberCount: 0,
    serviceCount: 0,
  };
  const linkedMembersCount = getDriverCoordinatorMembersForGroup(groupId, {
    showArchived: true,
  }).length;
  const confirmMessage =
    snapshot.total > 0
      ? `Se va a cerrar el grupo ${group.name}. La cuenta pendiente de ${formatMoney(
          snapshot.total
        )} quedará en cero y se quitarán ${linkedMembersCount} nombres del módulo.`
      : `Se va a cerrar el grupo ${group.name}. Se quitarán ${linkedMembersCount} nombres del módulo y la cuenta quedará en cero.`;
  if (!window.confirm(confirmMessage)) {
    return;
  }

  const closureId = uid("driver-group-closure");
  const closedAt = new Date().toISOString();

  state.activeShift.driverCoordinatorConsumption = state.activeShift.driverCoordinatorConsumption.map(
    (item) =>
      String(getDriverCoordinatorGroupIdForItem(item) || "") === String(groupId || "")
        ? {
            ...item,
            accountClosedAt: closedAt,
            accountClosureId: closureId,
          }
        : item
  );
  state.driverCoordinatorAccounts = state.driverCoordinatorAccounts.filter(
    (item) => String(getDriverCoordinatorGroupIdForItem(item) || "") !== String(groupId || "")
  );
  state.driverCoordinatorGroupHistory.unshift({
    id: closureId,
    groupId: group.id,
    groupName: group.name,
    groupCreatedAt: group.createdAt || null,
    closedAt,
    snapshot: deepClone(snapshot),
  });
  state.driverCoordinatorMembers = state.driverCoordinatorMembers.filter(
    (member) => String(member.groupId || "") !== String(groupId || "")
  );
  state.driverCoordinatorGroups = state.driverCoordinatorGroups.filter(
    (entry) => entry.id !== groupId
  );

  if (
    ui.pendingPaymentRequest &&
    ui.pendingPaymentRequest.kind === "driver-coordinator-add"
  ) {
    ui.pendingPaymentRequest = null;
  }
  if (ui.driverCoordinatorGroupId === groupId) {
    ui.driverCoordinatorGroupId = "";
  }

  syncDriverCoordinatorAccountsForActiveShift();
  persistState(`Cerrar grupo ${group.name}`);
  render({ preserveScroll: true });

  if (snapshot.items.length > 0) {
    openDriverCoordinatorGroupReport(groupId, {
      ...snapshot,
      closedAt,
      closureId,
    });
  }
}

function restoreSnapshot(snapshotId) {
  const snapshot = state.safety.snapshots.find((entry) => entry.id === snapshotId);
  if (!snapshot) return;
  if (!window.confirm("Se va a restaurar este respaldo automático.")) return;

  const snapshots = deepClone(state.safety.snapshots);
  const restored = sanitizeState(snapshot.payload);
  state = {
    ...restored,
    safety: {
      snapshots,
      lastSavedAt: new Date().toISOString(),
    },
  };
  resetCatalogEditor();
  persistState(`Restaurar respaldo: ${snapshot.label}`, { snapshot: false });
  render();
}

function exportBackup() {
  const payload = {
    exportedAt: new Date().toISOString(),
    data: state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  downloadFile(
    blob,
    `solanas-respaldo-${new Date().toISOString().replace(/:/g, "-")}.json`
  );
}

function importBackup(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const nextState = sanitizeState(parsed.data || parsed);
      if (
        !window.confirm("Se va a reemplazar el estado actual por el respaldo importado.")
      ) {
        return;
      }
      state = nextState;
      resetCatalogEditor();
      persistState("Importar respaldo", { snapshot: false });
      render();
    } catch (error) {
      console.error(error);
      alert("No se pudo importar el respaldo.");
    }
  };
  reader.readAsText(file);
}

function getStockPdfRows(products) {
  return products.map((product) => {
    const stockLabel =
      product.productKind === "manufactured"
        ? "Por receta"
        : product.trackStock
          ? formatRecipeQuantity(fallbackValue(product.stock, 0))
          : "Sin control";
    const costLabel =
      typeof product.costPrice === "number" ? formatMoney(product.costPrice).replace(/\u00a0/g, " ") : "-";
    const saleLabel =
      product.sellable !== false && typeof product.price === "number"
        ? formatMoney(product.price).replace(/\u00a0/g, " ")
        : "-";
    const statusLabel =
      product.productKind === "manufactured"
        ? "Receta"
        : !product.trackStock
          ? "Sin ctrl"
          : fallbackValue(product.stock, 0) <= 0
            ? "Sin stock"
            : fallbackValue(product.stock, 0) <= getLowStockThreshold(product)
              ? "Bajo"
              : "OK";

    return [
      fitPdfColumn(product.name, 46),
      fitPdfColumn(product.category, 14),
      fitPdfColumn(stockLabel, 12, "right"),
      fitPdfColumn(costLabel, 12, "right"),
      fitPdfColumn(saleLabel, 12, "right"),
      fitPdfColumn(statusLabel, 12),
    ].join("  ");
  });
}

function buildStockPdfReport() {
  const activeProducts = getActiveCatalog()
    .slice()
    .sort((a, b) => {
      const categoryOrder = a.category.localeCompare(b.category, "es");
      if (categoryOrder !== 0) return categoryOrder;
      return a.name.localeCompare(b.name, "es");
    });
  const generatedAt = new Date().toISOString();
  const lowStockCount = getLowStockProducts().filter((product) => !product.archived).length;
  const tableHeader = [
    fitPdfColumn("Producto", 46),
    fitPdfColumn("Categoría", 14),
    fitPdfColumn("Stock", 12, "right"),
    fitPdfColumn("Costo", 12, "right"),
    fitPdfColumn("Venta", 12, "right"),
    fitPdfColumn("Estado", 12),
  ].join("  ");
  const separator = "-".repeat(tableHeader.length);
  const rows = activeProducts.length
    ? getStockPdfRows(activeProducts)
    : ["No hay productos activos en el catálogo."];

  const pageWidth = 842;
  const pageHeight = 595;
  const left = 38;
  const titleY = 556;
  const metaStartY = 536;
  const tableStartY = 486;
  const lineHeight = 12;
  const pageBottom = 44;
  const dataLinesPerPage = Math.max(1, Math.floor((tableStartY - pageBottom) / lineHeight) - 1);
  const totalPages = Math.max(1, Math.ceil(rows.length / dataLinesPerPage));
  const pagesContent = [];

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    const pageRows = rows.slice(pageIndex * dataLinesPerPage, (pageIndex + 1) * dataLinesPerPage);
    const contentLines = [
      "0 g",
      `BT /F2 18 Tf 1 0 0 1 ${left} ${titleY} Tm (${escapePdfText(
        `${state.hotelName} | Stock actual`
      )}) Tj ET`,
      `BT /F1 10 Tf 1 0 0 1 ${left} ${metaStartY} Tm (${escapePdfText(
        `Generado: ${formatDateTime(generatedAt)}`
      )}) Tj ET`,
      `BT /F1 10 Tf 1 0 0 1 ${left} ${metaStartY - 14} Tm (${escapePdfText(
        `Productos activos: ${activeProducts.length} | Alertas de stock: ${lowStockCount}`
      )}) Tj ET`,
      `BT /F1 10 Tf 1 0 0 1 ${left} ${metaStartY - 28} Tm (${escapePdfText(
        "Incluye los productos activos del catálogo con stock, costo y precio vigentes."
      )}) Tj ET`,
      `BT /F2 10 Tf 1 0 0 1 ${left} ${tableStartY} Tm (${escapePdfText(tableHeader)}) Tj ET`,
      `BT /F1 10 Tf 1 0 0 1 ${left} ${tableStartY - lineHeight} Tm (${escapePdfText(separator)}) Tj ET`,
    ];

    pageRows.forEach((line, rowIndex) => {
      const y = tableStartY - lineHeight * (rowIndex + 2);
      contentLines.push(
        `BT /F1 10 Tf 1 0 0 1 ${left} ${y} Tm (${escapePdfText(line)}) Tj ET`
      );
    });

    contentLines.push(
      `BT /F1 9 Tf 1 0 0 1 ${pageWidth - 118} 24 Tm (${escapePdfText(
        `Página ${pageIndex + 1} de ${totalPages}`
      )}) Tj ET`
    );

    pagesContent.push(contentLines.join("\n"));
  }

  const objects = {
    1: "<< /Type /Catalog /Pages 2 0 R >>",
    3: "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>",
    4: "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  };

  const pageIds = [];
  let nextObjectId = 5;
  pagesContent.forEach((content) => {
    const contentId = nextObjectId;
    const pageId = nextObjectId + 1;
    nextObjectId += 2;
    pageIds.push(pageId);
    objects[contentId] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
    objects[pageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
  });

  objects[2] = `<< /Type /Pages /Kids [${pageIds
    .map((pageId) => `${pageId} 0 R`)
    .join(" ")}] /Count ${pageIds.length} >>`;

  return {
    bytes: buildPdfDocument(objects),
    fileName: `${state.hotelName} - Stock actual - ${formatFileSafeDate(generatedAt)}.pdf`,
  };
}

function downloadStockPdf() {
  const report = buildStockPdfReport();
  const blob = new Blob([report.bytes], { type: "application/pdf" });
  downloadFile(blob, report.fileName);
}

function resetCatalogEditor() {
  ui.editingProductId = null;
  ui.recipeDraftIngredients = [];
  ui.catalogDraft = createCatalogDraft();
}

function startEditingProduct(productId) {
  const product = getProductById(productId);
  if (!product) return;
  ui.editingProductId = productId;
  ui.recipeDraftIngredients = deepClone(product.recipe || []);
  ui.catalogDraft = createCatalogDraft(product);
}

function getEligibleRecipeIngredients() {
  return state.catalog.filter(
    (product) =>
      !product.archived &&
      product.productKind !== "manufactured" &&
      product.id !== ui.editingProductId
  );
}

function addRecipeDraftIngredient(ingredientProductId, quantity) {
  if (!ui.catalogDraft || ui.catalogDraft.productKind !== "manufactured") {
    alert("La receta solo se habilita para bebidas elaboradas.");
    return;
  }
  const ingredient = getProductById(ingredientProductId);
  const quantityNumber = Number(quantity);
  if (!ingredient) {
    alert("Selecciona un insumo válido.");
    return;
  }
  if (ingredient.productKind === "manufactured") {
    alert("Por ahora las recetas usan insumos fijos, no otras bebidas elaboradas.");
    return;
  }
  if (Number.isNaN(quantityNumber) || quantityNumber <= 0) {
    alert("La cantidad del insumo debe ser mayor a cero.");
    return;
  }
  const existing = ui.recipeDraftIngredients.find(
    (entry) => entry.ingredientProductId === ingredientProductId
  );
  if (existing) {
    existing.quantity += quantityNumber;
  } else {
    ui.recipeDraftIngredients.push({
      ingredientProductId,
      quantity: quantityNumber,
    });
  }
  render();
}

function removeRecipeDraftIngredient(ingredientProductId) {
  ui.recipeDraftIngredients = ui.recipeDraftIngredients.filter(
    (entry) => entry.ingredientProductId !== ingredientProductId
  );
  render();
}

function upsertCatalogProduct(payload) {
  const name = payload.name.trim();
  if (!name) {
    alert("El nombre del producto es obligatorio.");
    return;
  }

  const productKind = payload.productKind === "manufactured" ? "manufactured" : "fixed";
  const sellable = payload.sellable;
  const price = payload.price === "" ? 0 : Number(payload.price);
  const costPrice = payload.costPrice === "" ? 0 : Number(payload.costPrice);
  const lowStockThreshold = normalizeLowStockThreshold(payload.lowStockThreshold);
  const trackStock = productKind === "manufactured" ? false : payload.trackStock;
  const stockValue = productKind === "manufactured" || payload.stock === "" ? null : Number(payload.stock);

  if (sellable && (Number.isNaN(price) || price <= 0)) {
    alert("El precio de venta debe ser mayor a cero para productos vendibles.");
    return;
  }

  if (Number.isNaN(costPrice) || costPrice < 0) {
    alert("El precio de costo debe ser cero o mayor.");
    return;
  }

  if (trackStock && (Number.isNaN(stockValue) || stockValue < 0)) {
    alert("Si el stock está activo, la cantidad debe ser válida.");
    return;
  }

  if (productKind === "manufactured" && ui.recipeDraftIngredients.length === 0) {
    alert("Las bebidas elaboradas necesitan al menos un ingrediente en su receta.");
    return;
  }

  const nextProduct = normalizeCatalogProduct({
    id: ui.editingProductId || `product-${slugify(name)}-${Date.now()}`,
    name,
    category: payload.category,
    productKind,
    sellable,
    price: sellable ? price : 0,
    costPrice: productKind === "manufactured" ? 0 : costPrice,
    stock: trackStock ? stockValue : null,
    trackStock,
    archived: false,
    lowStockThreshold,
    recipe: productKind === "manufactured" ? ui.recipeDraftIngredients : [],
    createdAt: ui.editingProductId
      ? (getProductById(ui.editingProductId)?.createdAt || new Date().toISOString())
      : new Date().toISOString(),
  });

  if (ui.editingProductId) {
    const productIndex = state.catalog.findIndex((product) => product.id === ui.editingProductId);
    if (productIndex === -1) return;
    state.catalog[productIndex] = {
      ...state.catalog[productIndex],
      ...nextProduct,
    };
    persistState(`Actualizar producto ${nextProduct.name}`);
  } else {
    state.catalog.unshift(nextProduct);
    persistState(`Crear producto ${name}`);
  }

  resetCatalogEditor();
  render();
}

function archiveProduct(productId) {
  const product = getProductById(productId);
  if (!product) return;
  if (!window.confirm(`Se va a archivar ${product.name}.`)) return;
  product.archived = true;
  persistState(`Archivar producto ${product.name}`);
  render();
}

function unarchiveProduct(productId) {
  const product = getProductById(productId);
  if (!product) return;
  product.archived = false;
  persistState(`Reactivar producto ${product.name}`);
  render();
}

function getProductDeletionBlockers(productId) {
  const blockers = [];
  const roomsUsingProduct = state.activeShift.rooms.filter((room) =>
    (room.items || []).some((item) => item.productId === productId)
  );
  if (roomsUsingProduct.length) {
    blockers.push(
      `está cargado en ${roomsUsingProduct
        .slice(0, 3)
        .map((room) => room.label)
        .join(", ")}${roomsUsingProduct.length > 3 ? " y otras habitaciones" : ""}`
    );
  }
  if (
    state.activeShift.closedRooms.some((room) =>
      (room.items || []).some((item) => item.productId === productId)
    )
  ) {
    blockers.push("aparece en habitaciones cerradas del turno actual");
  }
  if (state.activeShift.cashierSales.some((item) => item.productId === productId)) {
    blockers.push("aparece en caja directa del turno actual");
  }
  if (state.activeShift.staffConsumption.some((item) => item.productId === productId)) {
    blockers.push("aparece en consumos del personal del turno actual");
  }
  if (state.activeShift.driverCoordinatorConsumption.some((item) => item.productId === productId)) {
    blockers.push("aparece en choferes/coordinadores del turno actual");
  }
  if (state.driverCoordinatorAccounts.some((item) => item.productId === productId)) {
    blockers.push("tiene cuenta pendiente en choferes/coordinadores");
  }

  const recipeUsers = state.catalog.filter(
    (product) =>
      product.id !== productId &&
      Array.isArray(product.recipe) &&
      product.recipe.some((ingredient) => ingredient.ingredientProductId === productId)
  );
  if (recipeUsers.length) {
    blockers.push(
      `se usa en la receta de ${recipeUsers
        .slice(0, 3)
        .map((product) => product.name)
        .join(", ")}${recipeUsers.length > 3 ? " y otros productos" : ""}`
    );
  }

  if (ui.recipeDraftIngredients.some((ingredient) => ingredient.ingredientProductId === productId)) {
    blockers.push("está cargado en el recetario que estás editando");
  }

  return blockers;
}

function deleteProduct(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const blockers = getProductDeletionBlockers(productId);
  if (blockers.length) {
    alert(
      `No se puede borrar ${product.name} porque ${blockers.join("; ")}. Si quieres ocultarlo sin perderlo, usa Archivar.`
    );
    return;
  }

  if (
    !window.confirm(
      `Se va a borrar ${product.name} del catálogo.\n\nEsta acción conviene solo para productos cargados por error.`
    )
  ) {
    return;
  }

  state.catalog = state.catalog.filter((entry) => entry.id !== productId);
  if (ui.editingProductId === productId) {
    resetCatalogEditor();
  } else if (ui.recipeDraftIngredients.some((ingredient) => ingredient.ingredientProductId === productId)) {
    ui.recipeDraftIngredients = ui.recipeDraftIngredients.filter(
      (ingredient) => ingredient.ingredientProductId !== productId
    );
  }

  persistState(`Borrar producto ${product.name}`);
  render({ preserveScroll: true });
}

function addStaffMember(name) {
  const normalizedName = String(name || "").trim();
  if (!normalizedName) {
    alert("El nombre del integrante es obligatorio.");
    return;
  }

  const duplicate = state.staffMembers.find(
    (member) => member.name.toLowerCase() === normalizedName.toLowerCase()
  );
  if (duplicate) {
    alert("Ese integrante ya está cargado.");
    return;
  }

  state.staffMembers.unshift(
    normalizeStaffMember({
      id: `staff-${slugify(normalizedName)}-${Date.now()}`,
      name: normalizedName,
      archived: false,
    })
  );
  persistState(`Agregar integrante ${normalizedName}`);
  render({ preserveScroll: true });
}

function archiveStaffMember(staffMemberId) {
  const member = getStaffMemberById(staffMemberId);
  if (!member) return;
  if (!window.confirm(`Se va a archivar a ${member.name}.`)) return;
  member.archived = true;
  persistState(`Archivar integrante ${member.name}`);
  render({ preserveScroll: true });
}

function unarchiveStaffMember(staffMemberId) {
  const member = getStaffMemberById(staffMemberId);
  if (!member) return;
  member.archived = false;
  persistState(`Reactivar integrante ${member.name}`);
  render({ preserveScroll: true });
}

function parseDriverCoordinatorBulkNames(value) {
  return Array.from(
    new Set(
      String(value || "")
        .split(/[\n,;]+/)
        .map((entry) => entry.trim())
        .filter(Boolean)
    )
  );
}

function addDriverCoordinatorGroup(name, membersInput = "", options = {}) {
  const { closeEditor = false } = options;
  const normalizedName = String(name || "").trim();
  if (!normalizedName) {
    alert("El nombre del grupo es obligatorio.");
    return false;
  }

  const duplicate = state.driverCoordinatorGroups.find(
    (group) => group.name.toLowerCase() === normalizedName.toLowerCase()
  );
  if (duplicate) {
    alert("Ese grupo ya está cargado.");
    return false;
  }

  const nextGroup = normalizeDriverCoordinatorGroup({
    id: `driver-group-${slugify(normalizedName)}-${Date.now()}`,
    name: normalizedName,
    archived: false,
  });
  if (!nextGroup) {
    alert("No se pudo crear el grupo.");
    return false;
  }

  state.driverCoordinatorGroups.unshift(nextGroup);
  ui.driverCoordinatorGroupId = nextGroup.id;

  parseDriverCoordinatorBulkNames(membersInput).forEach((memberName) => {
    const duplicateMember = state.driverCoordinatorMembers.find(
      (member) =>
        String(member.groupId || "") === nextGroup.id &&
        member.name.toLowerCase() === memberName.toLowerCase()
    );
    if (!duplicateMember) {
      state.driverCoordinatorMembers.unshift(
        normalizeDriverCoordinatorMember(
          {
            id: `driver-${slugify(memberName)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: memberName,
            archived: false,
          },
          { defaultGroup: nextGroup }
        )
      );
    }
  });

  if (closeEditor) {
    ui.driverCoordinatorGroupEditor = null;
  }
  persistState(`Cargar grupo ${normalizedName}`);
  render({ preserveScroll: true });
  return true;
}

function updateDriverCoordinatorGroupMembers(groupId, membersInput = "", options = {}) {
  const { closeEditor = false } = options;
  const group = getDriverCoordinatorGroupById(groupId);
  if (!group) {
    alert("No se encontró el grupo para editar.");
    return false;
  }

  const desiredNames = parseDriverCoordinatorBulkNames(membersInput);
  const desiredByKey = new Map(
    desiredNames.map((memberName) => [memberName.toLowerCase(), memberName])
  );

  state.driverCoordinatorMembers
    .filter((member) => String(member.groupId || "") === String(group.id))
    .forEach((member) => {
      const key = member.name.toLowerCase();
      if (desiredByKey.has(key)) {
        member.name = desiredByKey.get(key);
        member.archived = false;
        desiredByKey.delete(key);
        return;
      }

      member.archived = true;
    });

  desiredByKey.forEach((memberName) => {
    state.driverCoordinatorMembers.unshift(
      normalizeDriverCoordinatorMember(
        {
          id: `driver-${slugify(memberName)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: memberName,
          archived: false,
        },
        { defaultGroup: group }
      )
    );
  });

  if (closeEditor) {
    ui.driverCoordinatorGroupEditor = null;
  }
  persistState(`Editar grupo ${group.name}`);
  render({ preserveScroll: true });
  return true;
}

function addDriverCoordinatorMember(name) {
  const normalizedName = String(name || "").trim();
  if (!normalizedName) {
    alert("El nombre es obligatorio.");
    return;
  }

  const selectedGroup = getSelectedDriverCoordinatorGroup();
  if (!selectedGroup) {
    alert("Primero carga o selecciona un grupo.");
    return;
  }

  const duplicate = state.driverCoordinatorMembers.find(
    (member) =>
      String(member.groupId || "") === String(selectedGroup.id) &&
      member.name.toLowerCase() === normalizedName.toLowerCase()
  );
  if (duplicate) {
    alert("Esa persona ya está cargada en este grupo.");
    return;
  }

  state.driverCoordinatorMembers.unshift(
    normalizeDriverCoordinatorMember(
      {
        id: `driver-${slugify(normalizedName)}-${Date.now()}`,
        name: normalizedName,
        archived: false,
      },
      { defaultGroup: selectedGroup }
    )
  );
  persistState(`Agregar chofer o coordinador ${normalizedName} en ${selectedGroup.name}`);
  render({ preserveScroll: true });
}

function archiveDriverCoordinatorMember(memberId) {
  const member = getDriverCoordinatorMemberById(memberId);
  if (!member) return;
  if (!window.confirm(`Se va a archivar a ${member.name}.`)) return;
  member.archived = true;
  persistState(`Archivar chofer o coordinador ${member.name}`);
  render({ preserveScroll: true });
}

function unarchiveDriverCoordinatorMember(memberId) {
  const member = getDriverCoordinatorMemberById(memberId);
  if (!member) return;
  member.archived = false;
  persistState(`Reactivar chofer o coordinador ${member.name}`);
  render({ preserveScroll: true });
}

function getScopeItems(scope) {
  if (scope === "cashier") return state.activeShift.cashierSales;
  if (scope === "staff") return state.activeShift.staffConsumption;
  if (scope === "driver-coordinator") return state.activeShift.driverCoordinatorConsumption;
  if (scope.startsWith("room:")) {
    const room = getRoomById(scope.split(":")[1]);
    return room ? room.items : null;
  }
  return null;
}

function buildTicketDocument(title, subtitle, headerLine, items, total, footerHtml = "") {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td class="qty">${item.quantity}</td>
          <td class="product-cell">
            <div class="product-name">${escapeHtml(item.name)}</div>
            <div class="product-detail">${
              isRoomCourtesyItem(item)
                ? `Bonificada | Valor lista ${formatMoney(
                    fallbackValue(item.originalUnitPrice, item.unitPrice)
                  )}`
                : isDriverCoordinatorPricingItem(item)
                  ? `${escapeHtml(getDriverCoordinatorPricingLabel(item.pricingRule))} | Lista ${formatMoney(
                      fallbackValue(item.originalUnitPrice, item.unitPrice)
                    )}`
                : `${formatMoney(item.unitPrice)} c/u`
            }</div>
          </td>
          <td class="line-total">${formatMoney(item.quantity * item.unitPrice)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: 72mm auto; margin: 0; }
          body {
            margin: 0;
            padding: 10px 10px 14px;
            width: 268px;
            font-family: "Segoe UI", Arial, sans-serif;
            color: #111;
            background: #fff;
          }
          .ticket {
            padding: 10px 10px 12px;
          }
          .logo {
            display: block;
            max-width: 110px;
            max-height: 64px;
            margin: 0 auto 8px;
          }
          .kicker {
            margin: 0 0 6px;
            text-align: center;
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
          }
          h1, h2, p {
            margin: 0;
          }
          h1 {
            font-size: 18px;
            text-align: center;
            line-height: 1.1;
          }
          h2 {
            margin-top: 3px;
            font-size: 12px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.14em;
          }
          .meta-box {
            margin-top: 10px;
            padding: 7px 8px;
            border: 1px solid #111;
            font-size: 11px;
            line-height: 1.45;
          }
          .hr {
            border-top: 1px dashed #111;
            margin: 10px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 4px 0;
            vertical-align: top;
          }
          th {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            text-align: left;
            border-bottom: 1px solid #111;
          }
          .qty {
            width: 28px;
            font-weight: 700;
            font-size: 13px;
          }
          .product-cell {
            padding-left: 6px;
            padding-right: 8px;
          }
          .product-name {
            font-size: 13px;
            line-height: 1.2;
          }
          .product-detail {
            margin-top: 2px;
            font-size: 10px;
            color: #444;
          }
          .line-total {
            width: 74px;
            text-align: right;
            font-family: Consolas, "Courier New", monospace;
            font-size: 12px;
            font-weight: 700;
          }
          .totals-box {
            margin-top: 10px;
            border: 2px solid #111;
            padding: 8px;
          }
          .totals-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
          }
          .total {
            margin-top: 4px;
            text-align: right;
            font-family: Consolas, "Courier New", monospace;
            font-size: 18px;
            font-weight: 700;
          }
          .footer {
            margin-top: 10px;
            text-align: center;
            font-size: 11px;
            line-height: 1.5;
          }
          .footer strong {
            display: block;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <img class="logo" src="${LOGO_URL}" alt="Solanas" />
          <p class="kicker">Ticket de consumo</p>
          <h1>${escapeHtml(title)}</h1>
          <h2>${escapeHtml(subtitle)}</h2>
          <div class="meta-box">${escapeHtml(headerLine).replace(/\|/g, "<br />")}</div>
          <div class="hr"></div>
          <table>
            <thead>
              <tr>
                <th>Cant</th>
                <th>Detalle</th>
                <th style="text-align:right;">Importe</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="totals-box">
            <div class="totals-label">Total a cobrar</div>
            <div class="total">${formatMoney(total)}</div>
          </div>
          <div class="footer">
            NO VÁLIDO COMO FACTURA<br />
            <strong>${footerHtml}</strong>
          </div>
        </div>
        <script>
          window.onload = function () {
            setTimeout(function () {
              window.focus();
              window.print();
            }, 180);
          };
        </script>
      </body>
    </html>
  `;
}

function buildDeferredRoomTicketDocument(room, occupant = null, copyLabel = "Copia establecimiento") {
  const total = getRoomTotal(room);
  const headerLine = [
    formatDateTime(new Date().toISOString()),
    room.label,
    occupant ? `Titular: ${occupant.guestName}` : "Titular: sin enlace de Check-in",
  ].join(" | ");
  const rows = room.items
    .map(
      (item) => `
        <tr>
          <td class="qty">${item.quantity}</td>
          <td class="product-cell">
            <div class="product-name">${escapeHtml(item.name)}</div>
            <div class="product-detail">${
              isRoomCourtesyItem(item)
                ? `Bonificada | Valor lista ${formatMoney(
                    fallbackValue(item.originalUnitPrice, item.unitPrice)
                  )}`
                : `${formatMoney(item.unitPrice)} c/u`
            }</div>
          </td>
          <td class="line-total">${formatMoney(item.quantity * item.unitPrice)}</td>
        </tr>
      `
    )
    .join("");
  const copy = (label) => `
    <section class="ticket-copy">
      <p class="copy-label">${escapeHtml(label)}</p>
      <img class="logo" src="${LOGO_URL}" alt="Solanas" />
      <p class="kicker">Ticket de saldo</p>
      <h1>${escapeHtml(state.hotelName)}</h1>
      <h2>${escapeHtml(state.stationName)}</h2>
      <div class="meta-box">${escapeHtml(headerLine).replace(/\|/g, "<br />")}</div>
      <table>
        <thead>
          <tr>
            <th>Cant</th>
            <th>Detalle</th>
            <th style="text-align:right;">Importe</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="totals-box">
        <div class="totals-label">Saldo a abonar al final de la estadía</div>
        <div class="total">${formatMoney(total)}</div>
      </div>
      <p class="commitment">
        Declaro haber recibido este consumo y me comprometo a abonarlo junto con el cierre de mi estadía.
      </p>
      <div class="signature-box">
        <span>Firma y aclaración</span>
      </div>
      <div class="footer">NO VÁLIDO COMO FACTURA</div>
    </section>
  `;

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Ticket de saldo ${escapeHtml(room.label)} - ${escapeHtml(copyLabel)}</title>
        <style>
          @page { size: 72mm auto; margin: 0; }
          body {
            margin: 0;
            padding: 8px 10px 14px;
            width: 268px;
            font-family: "Segoe UI", Arial, sans-serif;
            color: #111;
            background: #fff;
          }
          .ticket-copy {
            padding: 10px 10px 12px;
            border-bottom: 1px dashed #111;
          }
          .ticket-copy + .ticket-copy {
            margin-top: 10px;
          }
          .copy-label,
          .kicker {
            margin: 0 0 6px;
            text-align: center;
            font-size: 10px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }
          .copy-label {
            font-weight: 800;
          }
          .logo {
            display: block;
            max-width: 110px;
            max-height: 64px;
            margin: 0 auto 8px;
          }
          h1, h2, p { margin: 0; }
          h1 { font-size: 18px; text-align: center; line-height: 1.1; }
          h2 {
            margin-top: 3px;
            font-size: 12px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.14em;
          }
          .meta-box {
            margin-top: 10px;
            padding: 7px 8px;
            border: 1px solid #111;
            font-size: 11px;
            line-height: 1.45;
          }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { padding: 4px 0; vertical-align: top; }
          th {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            text-align: left;
            border-bottom: 1px solid #111;
          }
          .qty { width: 28px; font-weight: 700; font-size: 13px; }
          .product-cell { padding-left: 6px; padding-right: 8px; }
          .product-name { font-size: 13px; line-height: 1.2; }
          .product-detail { margin-top: 2px; font-size: 10px; color: #444; }
          .line-total {
            width: 74px;
            text-align: right;
            font-family: Consolas, "Courier New", monospace;
            font-size: 12px;
            font-weight: 700;
          }
          .totals-box { margin-top: 10px; border: 2px solid #111; padding: 8px; }
          .totals-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; }
          .total {
            margin-top: 4px;
            text-align: right;
            font-family: Consolas, "Courier New", monospace;
            font-size: 18px;
            font-weight: 700;
          }
          .commitment { margin-top: 10px; font-size: 11px; line-height: 1.45; text-align: left; }
          .signature-box {
            margin-top: 26px;
            padding-top: 6px;
            border-top: 1px solid #111;
            font-size: 10px;
            text-align: center;
          }
          .footer { margin-top: 8px; text-align: center; font-size: 10px; }
        </style>
      </head>
      <body>
        ${copy(copyLabel)}
        <script>
          window.onload = function () {
            setTimeout(function () {
              window.focus();
              window.print();
            }, 180);
          };
        </script>
      </body>
    </html>
  `;
}

function buildSummaryDocument(title, subtitle, headerLine, ranking, total, footerHtml = "") {
  const rows = ranking
    .map(
      (item) => `
        <tr>
          <td class="product-cell">
            <div class="product-name">${escapeHtml(item.name)}</div>
          </td>
          <td class="line-total">${item.quantity}</td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: 72mm auto; margin: 0; }
          body {
            margin: 0;
            padding: 10px 10px 14px;
            width: 268px;
            font-family: "Segoe UI", Arial, sans-serif;
            color: #111;
            background: #fff;
          }
          .ticket {
            padding: 10px 10px 12px;
          }
          .logo {
            display: block;
            max-width: 110px;
            max-height: 64px;
            margin: 0 auto 8px;
          }
          .kicker {
            margin: 0 0 6px;
            text-align: center;
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
          }
          h1, h2, p { margin: 0; }
          h1 { font-size: 18px; text-align: center; line-height: 1.1; }
          h2 {
            margin-top: 3px;
            font-size: 12px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.14em;
          }
          .meta-box {
            margin-top: 10px;
            padding: 7px 8px;
            border: 1px solid #111;
            font-size: 11px;
            line-height: 1.45;
          }
          .hr { border-top: 1px dashed #111; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 4px 0; vertical-align: top; }
          th {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            text-align: left;
            border-bottom: 1px solid #111;
          }
          .product-cell { padding-right: 10px; }
          .product-name { font-size: 13px; line-height: 1.2; }
          .line-total {
            width: 50px;
            text-align: right;
            font-family: Consolas, "Courier New", monospace;
            font-size: 13px;
            font-weight: 700;
          }
          .totals-box {
            margin-top: 10px;
            border: 2px solid #111;
            padding: 8px;
          }
          .totals-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
          }
          .total {
            margin-top: 4px;
            text-align: right;
            font-family: Consolas, "Courier New", monospace;
            font-size: 18px;
            font-weight: 700;
          }
          .footer {
            margin-top: 10px;
            font-size: 11px;
            line-height: 1.5;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <img class="logo" src="${LOGO_URL}" alt="Solanas" />
          <p class="kicker">Resumen de turno</p>
          <h1>${escapeHtml(title)}</h1>
          <h2>${escapeHtml(subtitle)}</h2>
          <div class="meta-box">${escapeHtml(headerLine).replace(/\|/g, "<br />")}</div>
          <div class="hr"></div>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th style="text-align:right;">Cant</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="totals-box">
            <div class="totals-label">Total vendido</div>
            <div class="total">${formatMoney(total)}</div>
          </div>
          <div class="footer">${footerHtml}</div>
        </div>
        <script>
          window.onload = function () {
            setTimeout(function () {
              window.focus();
              window.print();
            }, 180);
          };
        </script>
      </body>
    </html>
  `;
}

function ensurePrintFrame(frameId = PRINT_FRAME_ID) {
  let frame = document.getElementById(frameId);
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = frameId;
    frame.setAttribute("title", "Impresión Solanas");
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "1px";
    frame.style.height = "1px";
    frame.style.opacity = "0";
    frame.style.pointerEvents = "none";
    frame.style.border = "0";
    document.body.appendChild(frame);
  }
  return frame;
}

function openPrintWindow(html, options = {}) {
  const frame = ensurePrintFrame(options.frameId || PRINT_FRAME_ID);
  const frameDocument = frame.contentWindow.document;
  frameDocument.open();
  frameDocument.write(html);
  frameDocument.close();
  if (options.removeAfterMs) {
    window.setTimeout(() => {
      frame.remove();
    }, options.removeAfterMs);
  }
}

function openDocumentWindow(html, title = "Solanas") {
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    alert("No se pudo abrir la ventana nueva. Revisa si el navegador bloqueo la ventana emergente.");
    return false;
  }

  reportWindow.document.open();
  reportWindow.document.write(html);
  reportWindow.document.title = title;
  reportWindow.document.close();
  reportWindow.focus();
  return true;
}

function loadLogoAsDataUrl(sourceUrl, maxWidth = 220) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      try {
        const scale = image.naturalWidth > maxWidth ? maxWidth / image.naturalWidth : 1;
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          resolve("");
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        console.warn("No se pudo embeber el logo para el informe gerencial.", error);
        resolve("");
      }
    };
    image.onerror = () => resolve("");
    image.src = sourceUrl;
  });
}

function loadFileAsDataUrl(sourceUrl) {
  return fetch(sourceUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`No se pudo cargar ${sourceUrl}`);
      }
      return response.blob();
    })
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
          reader.onerror = () => resolve("");
          reader.readAsDataURL(blob);
        })
    )
    .catch((error) => {
      console.warn("No se pudo embeber la tipografía del informe gerencial.", error);
      return "";
    });
}

async function ensureManagerReportLogoDataUrl() {
  if (typeof managerReportLogoDataUrl === "string") {
    return managerReportLogoDataUrl;
  }
  if (managerReportLogoPromise) {
    return managerReportLogoPromise;
  }

  managerReportLogoPromise = loadLogoAsDataUrl(LOGO_URL).then((dataUrl) => {
    managerReportLogoDataUrl = dataUrl || "";
    managerReportLogoPromise = null;
    return managerReportLogoDataUrl;
  });

  return managerReportLogoPromise;
}

async function ensureManagerReportTitleFontDataUrl() {
  if (typeof managerReportTitleFontDataUrl === "string") {
    return managerReportTitleFontDataUrl;
  }
  if (managerReportTitleFontPromise) {
    return managerReportTitleFontPromise;
  }

  managerReportTitleFontPromise = loadFileAsDataUrl(TITLE_FONT_URL).then((dataUrl) => {
    managerReportTitleFontDataUrl = dataUrl || "";
    managerReportTitleFontPromise = null;
    return managerReportTitleFontDataUrl;
  });

  return managerReportTitleFontPromise;
}

function getActiveShiftClosingSnapshot() {
  const driverCoordinatorItems = getDriverCoordinatorOperationalItems();
  const ranking = buildRanking([
    state.activeShift.closedRooms.flatMap((room) => room.items),
    state.activeShift.cashierSales,
    state.activeShift.driverCoordinatorConsumption,
    getDriverCoordinatorItemsFromOpenRooms(),
  ]);
  const paymentBreakdown = getShiftPaymentBreakdown(
    state.activeShift.closedRooms,
    state.activeShift.cashierSales
  );
  const closedRoomsRevenue = getRoomsRevenueTotal(state.activeShift.closedRooms);
  const closedRoomsCost = getRoomsCostTotal(state.activeShift.closedRooms);
  const cashierRevenue = getCollectionTotal(state.activeShift.cashierSales);
  const cashierCost = getCollectionCostTotal(state.activeShift.cashierSales);
  const soldTotal = closedRoomsRevenue + cashierRevenue;
  const estimatedCost = closedRoomsCost + cashierCost;
  const estimatedProfit = soldTotal - estimatedCost;
  const estimatedMargin = soldTotal > 0 ? (estimatedProfit / soldTotal) * 100 : null;
  const roomCourtesyValue = getClosedRoomsCourtesyValue(state.activeShift.closedRooms);
  const roomCourtesyBreakdown = buildRoomCourtesyBreakdown(state.activeShift.closedRooms);
  const staffTotal = getCollectionTotal(state.activeShift.staffConsumption);
  const staffBreakdown = buildStaffConsumptionBreakdown(state.activeShift.staffConsumption);
  const driverCoordinatorTotal = getCollectionTotal(driverCoordinatorItems);
  const driverCoordinatorCourtesyValue = getDriverCoordinatorCourtesyValue(driverCoordinatorItems);
  const driverCoordinatorBreakdown = buildDriverCoordinatorBreakdown(driverCoordinatorItems);
  const driverCoordinatorAccountTotal = getCollectionTotal(state.driverCoordinatorAccounts);
  const driverCoordinatorAccountCourtesyValue = getDriverCoordinatorCourtesyValue(
    state.driverCoordinatorAccounts
  );
  const driverCoordinatorAccountBreakdown = buildDriverCoordinatorBreakdown(
    state.driverCoordinatorAccounts
  );
  const driverCoordinatorGroupStories = buildCurrentShiftDriverCoordinatorGroupStories(
    driverCoordinatorItems,
    state.activeShift.openedAt,
    state.driverCoordinatorGroups,
    state.driverCoordinatorGroupHistory
  );
  const driverCoordinatorGroupsCreatedCount = driverCoordinatorGroupStories.filter(
    (entry) => entry.createdThisShift
  ).length;
  const driverCoordinatorGroupsClosedCount = driverCoordinatorGroupStories.filter(
    (entry) => entry.closedThisShift
  ).length;
  const driverCoordinatorGroupsContinuingCount = driverCoordinatorGroupStories.filter(
    (entry) => !entry.createdThisShift && !entry.closedThisShift
  ).length;

  return {
    generatedAt: new Date().toISOString(),
    serviceLabel: state.activeShift.serviceLabel,
    ranking,
    paymentBreakdown,
    closedRoomsRevenue,
    closedRoomsCost,
    cashierRevenue,
    cashierCost,
    soldTotal,
    estimatedCost,
    estimatedProfit,
    estimatedMargin,
    roomCourtesyValue,
    roomCourtesyBreakdown,
    staffTotal,
    staffBreakdown,
    driverCoordinatorTotal,
    driverCoordinatorCourtesyValue,
    driverCoordinatorBreakdown,
    driverCoordinatorAccountTotal,
    driverCoordinatorAccountCourtesyValue,
    driverCoordinatorAccountBreakdown,
    driverCoordinatorGroupStories,
    driverCoordinatorGroupsCreatedCount,
    driverCoordinatorGroupsClosedCount,
    driverCoordinatorGroupsContinuingCount,
    closedRooms: deepClone(state.activeShift.closedRooms),
    cashierSales: deepClone(state.activeShift.cashierSales),
    staffConsumption: deepClone(state.activeShift.staffConsumption),
    driverCoordinatorConsumption: deepClone(driverCoordinatorItems),
    driverCoordinatorAccounts: deepClone(state.driverCoordinatorAccounts),
    lowStock: getLowStockProducts().map((product) => ({
      id: product.id,
      name: product.name,
      stock: fallbackValue(product.stock, 0),
      threshold: getLowStockThreshold(product),
    })),
    roomCount: state.activeShift.closedRooms.length,
    cashierUnits: getItemsUnits(state.activeShift.cashierSales),
    staffUnits: getItemsUnits(state.activeShift.staffConsumption),
    driverCoordinatorUnits: getItemsUnits(driverCoordinatorItems),
    hasMovement:
      ranking.length > 0 ||
      state.activeShift.staffConsumption.length > 0 ||
      driverCoordinatorItems.length > 0 ||
      state.activeShift.closedRooms.length > 0 ||
      state.activeShift.cashierSales.length > 0,
  };
}

function sanitizePhoneNumber(phoneLabel) {
  return String(phoneLabel || "").replace(/\D/g, "");
}

function buildManagerWhatsappMessage(managerName, snapshot) {
  const rankingPreview = snapshot.ranking.length
    ? snapshot.ranking
        .slice(0, 3)
        .map((entry) => `${entry.name} x${entry.quantity}`)
        .join(", ")
    : "Sin ventas registradas";
  const groupStoryParts = [];
  if ((snapshot.driverCoordinatorGroupStories || []).length > 0) {
    groupStoryParts.push(`${snapshot.driverCoordinatorGroupStories.length} con movimiento`);
    if (snapshot.driverCoordinatorGroupsCreatedCount > 0) {
      groupStoryParts.push(`${snapshot.driverCoordinatorGroupsCreatedCount} creados`);
    }
    if (snapshot.driverCoordinatorGroupsClosedCount > 0) {
      groupStoryParts.push(`${snapshot.driverCoordinatorGroupsClosedCount} cerrados`);
    }
  }
  const lines = [
    `Hola ${managerName},`,
    `Comparto el cierre de ${state.hotelName} - ${state.stationName}.`,
    `Turno: ${snapshot.serviceLabel}`,
    `Generado: ${formatDateTime(snapshot.generatedAt)}`,
    `Vendido: ${formatMoney(snapshot.soldTotal)}`,
    `Costo estimado: ${formatMoney(snapshot.estimatedCost)}`,
    `Utilidad estimada: ${formatMoney(snapshot.estimatedProfit)}`,
    `Margen: ${
      snapshot.estimatedMargin === null ? "Pendiente" : formatPercent(snapshot.estimatedMargin)
    }`,
    `Efectivo: ${formatMoney(snapshot.paymentBreakdown.cash.total)}`,
    `Transferencia: ${formatMoney(snapshot.paymentBreakdown.transfer.total)}`,
    snapshot.paymentBreakdown.stay.total > 0
      ? `Saldo estadía: ${formatMoney(snapshot.paymentBreakdown.stay.total)}`
      : "",
    snapshot.paymentBreakdown.unknown.total > 0
      ? `Sin definir: ${formatMoney(snapshot.paymentBreakdown.unknown.total)}`
      : "",
    `Habitaciones cerradas: ${snapshot.roomCount}`,
    `Caja directa: ${formatMoney(snapshot.cashierRevenue)} (${snapshot.cashierUnits} unidades)`,
    snapshot.roomCourtesyValue > 0
      ? `Regalos en habitaciones: ${formatMoney(snapshot.roomCourtesyValue)}`
      : "",
    `Consumos del personal a costo: ${formatMoney(snapshot.staffTotal)}`,
    `Choferes/coordinadores por cobrar: ${formatMoney(snapshot.driverCoordinatorTotal)}`,
    snapshot.driverCoordinatorCourtesyValue > 0
      ? `Bonificado choferes/coordinadores: ${formatMoney(snapshot.driverCoordinatorCourtesyValue)}`
      : "",
    groupStoryParts.length ? `Grupos del turno: ${groupStoryParts.join(" | ")}` : "",
    `Ranking principal: ${rankingPreview}`,
    "Adjunto el informe gerencial del cierre.",
  ].filter(Boolean);

  return lines.join("\n");
}

function buildManagerWhatsappUrl(contact, snapshot) {
  const phone = sanitizePhoneNumber(contact.phoneLabel);
  const message = buildManagerWhatsappMessage(contact.name, snapshot);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function buildManagerReportDocument(snapshot, embeddedLogoUrl = "", embeddedTitleFontUrl = "") {
  const reportTitle = `${state.hotelName} - Informe gerencial ${snapshot.serviceLabel} - ${formatShortDate(
    snapshot.generatedAt
  )}`;
  const titleFontFaceCss = embeddedTitleFontUrl
    ? `
          @font-face {
            font-family: "Libre Baskerville Solanas";
            src: url("${embeddedTitleFontUrl}") format("truetype");
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
    `
    : "";
  const paymentCards = [
    {
      label: "Efectivo",
      total: snapshot.paymentBreakdown.cash.total,
      count: snapshot.paymentBreakdown.cash.count,
      tone: "cash",
    },
    {
      label: "Transferencia",
      total: snapshot.paymentBreakdown.transfer.total,
      count: snapshot.paymentBreakdown.transfer.count,
      tone: "transfer",
    },
  ];
  if (snapshot.paymentBreakdown.stay.total > 0) {
    paymentCards.push({
      label: "Saldo estadía",
      total: snapshot.paymentBreakdown.stay.total,
      count: snapshot.paymentBreakdown.stay.count,
      tone: "stay",
    });
  }
  if (snapshot.paymentBreakdown.unknown.total > 0) {
    paymentCards.push({
      label: "Sin definir",
      total: snapshot.paymentBreakdown.unknown.total,
      count: snapshot.paymentBreakdown.unknown.count,
      tone: "unknown",
    });
  }

  const managerLinks = MANAGER_CONTACTS.map((contact) => ({
    ...contact,
    whatsappUrl: buildManagerWhatsappUrl(contact, snapshot),
  }));
  const reportSections = [
    { id: "summary", label: "Resumen" },
    { id: "payments", label: "Cobros" },
    { id: "rooms", label: "Habitaciones" },
    { id: "courtesies", label: "Bonificaciones" },
    { id: "cashier", label: "Caja" },
    { id: "drivers", label: "Grupos" },
    { id: "staff", label: "Personal" },
    { id: "stock", label: "Stock" },
  ];
  const reportHtmlFileName = `${state.hotelName} - Informe gerencial ${snapshot.serviceLabel} - ${formatFileSafeDate(
    snapshot.generatedAt
  )}.html`;
  const reportLogoHtml = embeddedLogoUrl
    ? `<img src="${embeddedLogoUrl}" alt="Solanas" />`
    : "";

  const rankingRows = snapshot.ranking.length
    ? snapshot.ranking
        .slice(0, 15)
        .map(
          (entry, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(entry.name)}</td>
              <td style="text-align:right;">${entry.quantity}</td>
            </tr>
          `
        )
        .join("")
    : `
      <tr>
        <td colspan="3" class="empty-row">Todavía no hay productos vendidos para este cierre.</td>
      </tr>
    `;

  const closedRoomsRows = snapshot.closedRooms.length
    ? snapshot.closedRooms
        .map(
          (room) => {
            const courtesyQuantity = getRoomCourtesyQuantity(room.items || []);
            const courtesyValue = getRoomCourtesyValue(room.items || []);
            return `
            <tr>
              <td>${escapeHtml(room.roomLabel)}</td>
              <td>${escapeHtml(getPaymentMethodLabel(room.paymentMethod))}</td>
              <td class="rooms-col-items">${getItemsUnits(room.items)}</td>
              <td class="rooms-col-bonif">${courtesyQuantity || "-"}</td>
              <td class="rooms-col-gift">${
                courtesyValue > 0 ? formatMoney(courtesyValue) : "-"
              }</td>
              <td class="rooms-col-time">${formatDateTime(room.closedAt)}</td>
              <td class="rooms-col-total">${formatMoney(room.total)}</td>
            </tr>
          `;
          }
        )
        .join("")
    : `
      <tr>
        <td colspan="7" class="empty-row">No hay habitaciones cerradas en este turno.</td>
      </tr>
    `;

  const roomCourtesyCards = snapshot.roomCourtesyBreakdown.length
    ? snapshot.roomCourtesyBreakdown
        .map(
          (entry) => `
            <article class="mini-card">
              <div class="mini-card-head">
                <div>
                  <h3>${escapeHtml(entry.roomLabel)}</h3>
                  <p>${entry.courtesyQuantity} unidades bonificadas</p>
                </div>
                <strong>${formatMoney(entry.courtesyValue)}</strong>
              </div>
              <div class="mini-card-list">
                ${entry.products
                  .map(
                    (product) => `
                      <div class="mini-line">
                        <span>${escapeHtml(product.name)}</span>
                        <span>x${product.quantity}</span>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </article>
          `
        )
        .join("")
    : `<div class="empty-box">No hubo regalos ni bonificaciones en habitaciones durante este turno.</div>`;

  const cashierRows = snapshot.cashierSales.length
    ? snapshot.cashierSales
        .map(
          (item) => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td>${escapeHtml(getPaymentMethodLabel(item.paymentMethod))}</td>
              <td style="text-align:right;">${item.quantity}</td>
              <td style="text-align:right;">${formatMoney(item.unitPrice)}</td>
              <td style="text-align:right;">${formatMoney(item.quantity * item.unitPrice)}</td>
            </tr>
          `
        )
        .join("")
    : `
      <tr>
        <td colspan="5" class="empty-row">No hubo movimientos en caja directa.</td>
      </tr>
    `;

  const staffCards = snapshot.staffBreakdown.length
    ? snapshot.staffBreakdown
        .map(
          (entry) => `
            <article class="mini-card">
              <div class="mini-card-head">
                <div>
                  <h3>${escapeHtml(entry.name)}</h3>
                  <p>${entry.quantity} unidades a costo</p>
                </div>
                <strong>${formatMoney(entry.total)}</strong>
              </div>
              <div class="mini-card-list">
                ${entry.products
                  .map(
                    (product) => `
                      <div class="mini-line">
                        <span>${escapeHtml(product.name)}</span>
                        <span>x${product.quantity}</span>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </article>
          `
        )
        .join("")
    : `<div class="empty-box">No hubo consumos del personal en este turno.</div>`;

  const driverCoordinatorCards = snapshot.driverCoordinatorBreakdown.length
    ? snapshot.driverCoordinatorBreakdown
        .map(
          (entry) => `
            <article class="mini-card">
              <div class="mini-card-head">
                <div>
                  <h3>${escapeHtml(entry.name)}</h3>
                  <p>${entry.quantity} unidades | ${entry.courtesyQuantity} bonificadas</p>
                </div>
                <strong>${formatMoney(entry.total)}</strong>
              </div>
              <div class="mini-card-list">
                ${entry.products
                  .map((product) => {
                    const detailParts = [];
                    if (product.courtesyQuantity > 0) {
                      detailParts.push(`${product.courtesyQuantity} bonif.`);
                    }
                    if (product.discountedQuantity > 0) {
                      detailParts.push(`${product.discountedQuantity} c/30%`);
                    }
                    return `
                      <div class="mini-line">
                        <span>${escapeHtml(product.name)}</span>
                        <span>x${product.quantity}${detailParts.length ? ` | ${detailParts.join(" + ")}` : ""}</span>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
              ${
                entry.courtesyValue > 0
                  ? `<div class="mini-card-foot">Bonificado ${formatMoney(entry.courtesyValue)}</div>`
                  : ""
              }
            </article>
          `
        )
        .join("")
    : `<div class="empty-box">No hubo consumos de choferes/coordinadores en este turno.</div>`;

  const driverCoordinatorGroupStorySummary = [];
  if ((snapshot.driverCoordinatorGroupStories || []).length > 0) {
    driverCoordinatorGroupStorySummary.push(
      `${snapshot.driverCoordinatorGroupStories.length} grupo${
        snapshot.driverCoordinatorGroupStories.length === 1 ? "" : "s"
      } con registro en este turno`
    );
  }
  if (snapshot.driverCoordinatorGroupsCreatedCount > 0) {
    driverCoordinatorGroupStorySummary.push(
      `${snapshot.driverCoordinatorGroupsCreatedCount} creado${
        snapshot.driverCoordinatorGroupsCreatedCount === 1 ? "" : "s"
      }`
    );
  }
  if (snapshot.driverCoordinatorGroupsClosedCount > 0) {
    driverCoordinatorGroupStorySummary.push(
      `${snapshot.driverCoordinatorGroupsClosedCount} cerrado${
        snapshot.driverCoordinatorGroupsClosedCount === 1 ? "" : "s"
      }`
    );
  }
  if (snapshot.driverCoordinatorGroupsContinuingCount > 0) {
    driverCoordinatorGroupStorySummary.push(
      `${snapshot.driverCoordinatorGroupsContinuingCount} en continuidad`
    );
  }

  const driverCoordinatorGroupStoryCards = (snapshot.driverCoordinatorGroupStories || []).length
    ? snapshot.driverCoordinatorGroupStories
        .map((entry) => {
          const metaPills = [
            entry.createdThisShift && entry.createdAt
              ? `<span class="group-story-pill">Creado ${escapeHtml(
                  formatDateTime(entry.createdAt)
                )}</span>`
              : "",
            entry.closedThisShift && entry.closedAt
              ? `<span class="group-story-pill">Cerrado ${escapeHtml(
                  formatDateTime(entry.closedAt)
                )}</span>`
              : "",
            `<span class="group-story-pill">${entry.memberCount} integrantes</span>`,
            `<span class="group-story-pill">${entry.shiftQuantity} unidades del turno</span>`,
          ]
            .filter(Boolean)
            .join("");
          const detailRows = entry.shiftBreakdown.length
            ? entry.shiftBreakdown
                .map((member) => {
                  const memberPreview = member.products
                    .map((product) => {
                      const detailParts = [`x${product.quantity}`];
                      if (product.courtesyQuantity > 0) {
                        detailParts.push(`${product.courtesyQuantity} bonif.`);
                      }
                      if (product.discountedQuantity > 0) {
                        detailParts.push(`${product.discountedQuantity} c/30%`);
                      }
                      return `${escapeHtml(product.name)} ${detailParts.join(" · ")}`;
                    })
                    .join(" | ");
                  return `
                    <div class="group-story-line">
                      <div class="group-story-line-copy">
                        <strong>${escapeHtml(member.name)}</strong>
                        <span>${memberPreview}</span>
                      </div>
                      <strong>${formatMoney(member.total)}</strong>
                    </div>
                  `;
                })
                .join("")
            : `<div class="group-story-empty">${
                entry.closedThisShift
                  ? "Este turno no sumó nuevos consumos; aquí quedó reflejado el cierre final del grupo."
                  : entry.createdThisShift
                    ? "Grupo cargado y listo para próximos servicios."
                    : "Este turno no registró consumos nuevos para este grupo."
              }</div>`;
          const lifecycleLabel = entry.closedThisShift
            ? "Cierre final del viaje"
            : "Pendiente acumulado";
          const lifecycleTotal = entry.closedThisShift
            ? fallbackValue(entry.finalTotal, entry.shiftTotal)
            : fallbackValue(entry.pendingTotal, entry.shiftTotal);
          return `
            <article class="group-story-card tone-${escapeHtml(entry.tone)}">
              <div class="group-story-head">
                <div>
                  <div class="group-story-title-row">
                    <h3>${escapeHtml(entry.name)}</h3>
                    <span class="status-pill tone-${escapeHtml(entry.tone)}">${escapeHtml(
                      entry.label
                    )}</span>
                  </div>
                  <p>${escapeHtml(entry.copy)}</p>
                </div>
                <div class="group-story-total">
                  <span>Total del turno</span>
                  <strong>${formatMoney(entry.shiftTotal)}</strong>
                </div>
              </div>
              <div class="group-story-meta">${metaPills}</div>
              <div class="group-story-list">${detailRows}</div>
              <div class="group-story-foot">
                <span>Bonificado del turno ${formatMoney(entry.shiftCourtesyValue)}</span>
                <span>${lifecycleLabel} ${formatMoney(lifecycleTotal)}</span>
              </div>
            </article>
          `;
        })
        .join("")
    : `<div class="empty-box">No hubo creación, continuidad con consumo ni cierre de grupos en este turno.</div>`;

  const lowStockList = snapshot.lowStock.length
    ? `
      <div class="stock-alert-list">
        ${snapshot.lowStock
          .map(
            (product) => `
              <div class="stock-alert">
                <strong>${escapeHtml(product.name)}</strong>
                <span>Stock ${formatRecipeQuantity(product.stock)} / umbral ${formatRecipeQuantity(
                  product.threshold
                )}</span>
              </div>
            `
          )
          .join("")}
      </div>
    `
    : `<div class="empty-box">No hay alertas de stock bajo en este momento.</div>`;

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(reportTitle)}</title>
        <style>
          @page { margin: 10mm; }
          html { scroll-behavior: smooth; }
          ${titleFontFaceCss}
          :root {
            --bg: #f4ede1;
            --bg-2: #e9dfcf;
            --ink: #1e2c2f;
            --muted: #596b6f;
            --line: rgba(29, 57, 64, 0.14);
            --accent: #0d7c79;
            --accent-soft: rgba(13, 124, 121, 0.12);
            --accent-2: #ef8354;
            --panel: rgba(255, 248, 239, 0.9);
            --cash: #e6f5ef;
            --transfer: #edf6fb;
            --stay: #fff0dc;
            --unknown: #f2edf8;
            --shadow: 0 18px 44px rgba(38, 40, 41, 0.1);
            --radius-xl: 28px;
            --radius-lg: 20px;
            --radius-md: 14px;
            --report-anchor-offset: 112px;
            --title-font: "Libre Baskerville Solanas", Georgia, "Palatino Linotype", serif;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            min-height: 100vh;
            color: var(--ink);
            background:
              radial-gradient(circle at top left, rgba(13, 124, 121, 0.18), transparent 34%),
              radial-gradient(circle at top right, rgba(239, 131, 84, 0.2), transparent 28%),
              linear-gradient(180deg, #f8f1e8 0%, #efe5d7 55%, #e7dccd 100%);
            font-family: "Trebuchet MS", "Gill Sans", sans-serif;
          }
          section[id] {
            scroll-margin-top: var(--report-anchor-offset);
          }
          .report-shell {
            width: min(1280px, calc(100vw - 24px));
            margin: 20px auto 28px;
            display: grid;
            gap: 18px;
          }
          .toolbar {
            position: sticky;
            top: 10px;
            z-index: 12;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 14px;
            border-radius: 24px;
            background: rgba(255, 252, 247, 0.84);
            border: 1px solid rgba(255, 255, 255, 0.78);
            backdrop-filter: blur(12px);
            box-shadow: var(--shadow);
          }
          .toolbar button,
          .toolbar a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-height: 44px;
            padding: 10px 14px;
            border-radius: var(--radius-md);
            text-decoration: none;
            border: 1px solid transparent;
            font: inherit;
            cursor: pointer;
            transition: transform 120ms ease, opacity 120ms ease;
          }
          .toolbar button:hover,
          .toolbar a:hover,
          .toolbar button:focus-visible,
          .toolbar a:focus-visible {
            transform: translateY(-1px);
          }
          .toolbar button {
            color: #fff;
            background: linear-gradient(135deg, var(--accent), #0f8d88);
            box-shadow: 0 10px 22px rgba(13, 124, 121, 0.24);
          }
          .toolbar button.is-secondary {
            color: var(--ink);
            background: rgba(255, 255, 255, 0.78);
            border-color: var(--line);
            box-shadow: none;
          }
          .toolbar a {
            color: var(--ink);
            background: rgba(255, 255, 255, 0.78);
            border-color: var(--line);
          }
          .toolbar a.section-link {
            color: var(--accent);
            background: rgba(13, 124, 121, 0.08);
            border-color: rgba(13, 124, 121, 0.16);
          }
          .share-note {
            padding: 14px 16px;
            border-radius: var(--radius-lg);
            background: rgba(255, 248, 240, 0.88);
            border: 1px solid rgba(239, 131, 84, 0.16);
            color: #89523f;
            font-size: 0.95rem;
            line-height: 1.45;
          }
          .hero {
            position: relative;
            overflow: hidden;
            padding: 28px;
            border-radius: 34px;
            color: #f7f1e9;
            background:
              linear-gradient(135deg, rgba(9, 77, 79, 0.96), rgba(23, 108, 103, 0.9)),
              linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
            box-shadow: var(--shadow);
          }
          .hero::after {
            content: "";
            position: absolute;
            inset: auto -10% -30% auto;
            width: 320px;
            height: 320px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.18), transparent 65%);
            pointer-events: none;
          }
          .hero-grid {
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.9fr);
            gap: 18px;
            align-items: start;
          }
          .brand {
            display: flex;
            gap: 16px;
            align-items: center;
          }
          .brand img {
            width: 88px;
            height: 88px;
            object-fit: contain;
            border-radius: 22px;
            background: rgba(255, 255, 255, 0.12);
            padding: 10px;
          }
          .eyebrow {
            margin: 0 0 6px;
            font-size: 0.78rem;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            opacity: 0.74;
          }
          h1, h2, h3, p {
            margin: 0;
          }
          h1, h2, h3 {
            font-family: var(--title-font);
            font-weight: 700;
          }
          .hero h1 {
            font-size: clamp(2rem, 3vw, 3rem);
            line-height: 1;
          }
          .hero p {
            margin-top: 10px;
            color: rgba(247, 241, 233, 0.84);
            line-height: 1.5;
          }
          .hero-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 18px;
          }
          .hero-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 12px;
            border-radius: 999px;
            font-size: 0.92rem;
            border: 1px solid rgba(255, 255, 255, 0.18);
            background: rgba(255, 255, 255, 0.1);
            color: #f7f1e9;
          }
          .hero-kpi-grid {
            display: grid;
            gap: 10px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            margin-top: 18px;
          }
          .hero-kpi {
            padding: 14px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.14);
          }
          .hero-kpi-label {
            color: rgba(247, 241, 233, 0.72);
            font-size: 0.78rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }
          .hero-kpi-value {
            display: block;
            margin-top: 8px;
            font-size: 1.35rem;
            font-weight: 700;
          }
          .manager-stack {
            display: grid;
            gap: 10px;
          }
          .manager-card {
            padding: 14px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.16);
          }
          .manager-card strong {
            display: block;
            font-size: 1rem;
          }
          .manager-card span {
            display: block;
            margin-top: 6px;
            color: rgba(247, 241, 233, 0.78);
            font-size: 0.92rem;
          }
          .stat-grid {
            display: grid;
            gap: 14px;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .panel,
          .stat-card {
            padding: 22px;
            border-radius: var(--radius-xl);
            background: var(--panel);
            border: 1px solid rgba(255, 255, 255, 0.78);
            box-shadow: var(--shadow);
            backdrop-filter: blur(12px);
          }
          .stat-card {
            background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.82));
          }
          .stat-label {
            color: var(--muted);
            font-size: 0.84rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .stat-value {
            display: block;
            margin-top: 10px;
            font-size: 1.85rem;
            font-weight: 700;
          }
          .stat-foot {
            display: block;
            margin-top: 8px;
            color: var(--muted);
          }
          .two-col {
            display: grid;
            gap: 18px;
            grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          }
          .panel-head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
          }
          .panel-head p {
            margin-top: 6px;
            color: var(--muted);
            line-height: 1.45;
          }
          .payment-grid {
            display: grid;
            gap: 12px;
          }
          .payment-card {
            padding: 16px;
            border-radius: 18px;
            border: 1px solid var(--line);
          }
          .payment-card.cash { background: var(--cash); }
          .payment-card.transfer { background: var(--transfer); }
          .payment-card.stay { background: var(--stay); }
          .payment-card.unknown { background: var(--unknown); }
          .payment-card strong {
            display: block;
            font-size: 1.2rem;
            margin-top: 6px;
          }
          .payment-card span {
            color: var(--muted);
            font-size: 0.92rem;
          }
          .table-wrap {
            overflow-x: auto;
          }
          table {
            width: 100%;
            min-width: 640px;
            border-collapse: collapse;
          }
          th, td {
            padding: 10px 0;
            border-bottom: 1px solid var(--line);
            vertical-align: top;
            text-align: left;
          }
          th {
            color: var(--muted);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .rooms-report-table {
            min-width: 780px;
          }
          .rooms-report-table th,
          .rooms-report-table td {
            padding-right: 14px;
          }
          .rooms-report-table th:last-child,
          .rooms-report-table td:last-child {
            padding-right: 0;
          }
          .rooms-col-items,
          .rooms-col-bonif,
          .rooms-col-gift,
          .rooms-col-total {
            text-align: right;
            white-space: nowrap;
          }
          .rooms-col-items,
          .rooms-col-bonif {
            width: 72px;
          }
          .rooms-col-gift {
            min-width: 108px;
          }
          .rooms-col-time {
            min-width: 156px;
            white-space: nowrap;
          }
          .rooms-col-total {
            min-width: 108px;
          }
          .empty-row {
            color: var(--muted);
            padding: 18px 0;
          }
          .mini-card-grid {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .group-story-grid {
            display: grid;
            gap: 14px;
          }
          .group-story-card {
            padding: 18px;
            border-radius: 22px;
            background: rgba(255, 255, 255, 0.78);
            border: 1px solid var(--line);
          }
          .group-story-card.tone-created {
            background: rgba(13, 124, 121, 0.08);
            border-color: rgba(13, 124, 121, 0.16);
          }
          .group-story-card.tone-active {
            background: rgba(255, 255, 255, 0.82);
          }
          .group-story-card.tone-closed {
            background: rgba(239, 131, 84, 0.1);
            border-color: rgba(239, 131, 84, 0.18);
          }
          .group-story-head,
          .group-story-line,
          .group-story-foot {
            display: flex;
            justify-content: space-between;
            gap: 14px;
            align-items: flex-start;
          }
          .group-story-title-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
          }
          .group-story-head p {
            margin-top: 8px;
            color: var(--muted);
            line-height: 1.45;
            max-width: 70ch;
          }
          .group-story-total {
            min-width: 168px;
            text-align: right;
          }
          .group-story-total span,
          .group-story-line-copy span,
          .group-story-foot {
            color: var(--muted);
          }
          .group-story-total strong {
            display: block;
            margin-top: 6px;
            font-size: 1.2rem;
          }
          .group-story-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 14px;
          }
          .group-story-pill,
          .status-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 7px 10px;
            border-radius: 999px;
            font-size: 0.82rem;
            font-weight: 700;
            border: 1px solid var(--line);
            background: rgba(255, 255, 255, 0.82);
          }
          .status-pill.tone-created {
            color: var(--accent);
            border-color: rgba(13, 124, 121, 0.18);
            background: rgba(13, 124, 121, 0.1);
          }
          .status-pill.tone-active {
            color: #2d5f68;
            border-color: rgba(45, 95, 104, 0.16);
            background: rgba(45, 95, 104, 0.08);
          }
          .status-pill.tone-closed {
            color: #a35d42;
            border-color: rgba(163, 93, 66, 0.18);
            background: rgba(239, 131, 84, 0.14);
          }
          .group-story-list {
            display: grid;
            gap: 10px;
            margin-top: 14px;
            padding-top: 14px;
            border-top: 1px solid var(--line);
          }
          .group-story-line-copy {
            display: grid;
            gap: 4px;
          }
          .group-story-line-copy strong {
            color: var(--ink);
          }
          .group-story-line-copy span {
            font-size: 0.92rem;
            line-height: 1.45;
          }
          .group-story-empty {
            padding: 12px 14px;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.56);
            color: var(--muted);
          }
          .group-story-foot {
            margin-top: 14px;
            padding-top: 14px;
            border-top: 1px solid var(--line);
            font-size: 0.94rem;
          }
          .mini-card {
            padding: 16px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.74);
            border: 1px solid var(--line);
          }
          .mini-card-head {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: flex-start;
          }
          .mini-card-head p {
            margin-top: 4px;
            color: var(--muted);
            font-size: 0.92rem;
          }
          .mini-card-list {
            display: grid;
            gap: 8px;
            margin-top: 12px;
          }
          .mini-card-foot {
            margin-top: 12px;
            color: var(--muted);
            font-size: 0.92rem;
          }
          .mini-line {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            color: var(--ink);
          }
          .empty-box {
            padding: 18px;
            border-radius: 18px;
            border: 1px dashed rgba(24, 50, 53, 0.18);
            color: var(--muted);
            background: rgba(255, 255, 255, 0.5);
          }
          .stock-alert-list {
            display: grid;
            gap: 10px;
          }
          .stock-alert {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 14px 16px;
            border-radius: 16px;
            color: #8f4337;
            background: rgba(231, 111, 81, 0.12);
            border: 1px solid rgba(231, 111, 81, 0.18);
          }
          .stock-alert span {
            color: #a05b50;
          }
          .footer-note {
            padding: 18px 20px;
            border-radius: var(--radius-lg);
            background: rgba(255,255,255,0.84);
            border: 1px solid rgba(255,255,255,0.75);
            color: var(--muted);
            box-shadow: var(--shadow);
          }
          .footer-note strong {
            display: block;
            margin-bottom: 6px;
            color: var(--ink);
          }
          @media (max-width: 920px) {
            .report-shell {
              width: min(100vw - 14px, 100%);
              margin: 8px auto 22px;
            }
            .hero,
            .panel,
            .stat-card,
            .footer-note {
              padding: 18px;
              border-radius: 24px;
            }
            .hero-grid,
            .two-col,
            .stat-grid,
            .mini-card-grid,
            .hero-kpi-grid {
              grid-template-columns: 1fr;
            }
            .group-story-head,
            .group-story-line,
            .group-story-foot {
              flex-direction: column;
            }
            .group-story-total {
              min-width: 0;
              text-align: left;
            }
          }
          @media print {
            * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .toolbar {
              position: static;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-shell">
          <div class="toolbar">
            <button type="button" onclick="downloadReportHtml()">Guardar informe</button>
            ${reportSections
              .map(
                (section) => `
                  <a class="section-link" href="#${section.id}">
                    ${escapeHtml(section.label)}
                  </a>
                `
              )
              .join("")}
          </div>

          <div class="share-note">
            Esta vista es larga, adaptable y pensada para tablet. El botón principal la guarda tal
            cual se ve, sin pasar por la impresión. Si en algún momento necesitas PDF, puedes usar
            la opción secundaria del navegador.
          </div>

          <section id="summary" class="hero">
            <div class="hero-grid">
              <div>
                <div class="brand">
                  ${reportLogoHtml}
                  <div>
                    <p class="eyebrow">Informe gerencial</p>
                    <h1>${escapeHtml(state.hotelName)}</h1>
                  </div>
                </div>
                <p>
                  Vista ampliada del cierre operativo, con la misma linea visual del sistema y
                  ordenada para revisarse en pantalla.
                </p>
                <div class="hero-pills">
                  <span class="hero-pill">${escapeHtml(state.stationName)}</span>
                  <span class="hero-pill">${escapeHtml(snapshot.serviceLabel)}</span>
                  <span class="hero-pill">${formatDateTime(snapshot.generatedAt)}</span>
                </div>
                <div class="hero-kpi-grid">
                  <article class="hero-kpi">
                    <span class="hero-kpi-label">Vendido</span>
                    <strong class="hero-kpi-value">${formatMoney(snapshot.soldTotal)}</strong>
                  </article>
                  <article class="hero-kpi">
                    <span class="hero-kpi-label">Utilidad</span>
                    <strong class="hero-kpi-value">${formatMoney(snapshot.estimatedProfit)}</strong>
                  </article>
                  <article class="hero-kpi">
                    <span class="hero-kpi-label">Efectivo</span>
                    <strong class="hero-kpi-value">${formatMoney(snapshot.paymentBreakdown.cash.total)}</strong>
                  </article>
                  <article class="hero-kpi">
                    <span class="hero-kpi-label">Transferencia</span>
                    <strong class="hero-kpi-value">${formatMoney(
                      snapshot.paymentBreakdown.transfer.total
                    )}</strong>
                  </article>
                  <article class="hero-kpi">
                    <span class="hero-kpi-label">Choferes/coordinadores</span>
                    <strong class="hero-kpi-value">${formatMoney(snapshot.driverCoordinatorTotal)}</strong>
                  </article>
                  <article class="hero-kpi">
                    <span class="hero-kpi-label">Regalos en habitaciones</span>
                    <strong class="hero-kpi-value">${formatMoney(snapshot.roomCourtesyValue)}</strong>
                  </article>
                </div>
              </div>
              <div class="manager-stack">
                ${managerLinks
                  .map(
                    (contact) => `
                      <div class="manager-card">
                        <strong>${escapeHtml(contact.name)}</strong>
                        <span>WhatsApp: ${escapeHtml(contact.phoneLabel)}</span>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </div>
          </section>

          <section class="stat-grid">
            <article class="stat-card">
              <span class="stat-label">Vendido</span>
              <strong class="stat-value">${formatMoney(snapshot.soldTotal)}</strong>
              <span class="stat-foot">${snapshot.roomCount} habitaciones cerradas</span>
            </article>
            <article class="stat-card">
              <span class="stat-label">Costo estimado</span>
              <strong class="stat-value">${formatMoney(snapshot.estimatedCost)}</strong>
              <span class="stat-foot">Caja directa ${formatMoney(snapshot.cashierRevenue)}</span>
            </article>
            <article class="stat-card">
              <span class="stat-label">Utilidad estimada</span>
              <strong class="stat-value">${formatMoney(snapshot.estimatedProfit)}</strong>
              <span class="stat-foot">${
                snapshot.estimatedMargin === null
                  ? "Margen pendiente"
                  : `Margen ${formatPercent(snapshot.estimatedMargin)}`
              }</span>
            </article>
            <article class="stat-card">
              <span class="stat-label">Caja directa</span>
              <strong class="stat-value">${formatMoney(snapshot.cashierRevenue)}</strong>
              <span class="stat-foot">${snapshot.cashierUnits} unidades</span>
            </article>
            <article class="stat-card">
              <span class="stat-label">Personal a costo</span>
              <strong class="stat-value">${formatMoney(snapshot.staffTotal)}</strong>
              <span class="stat-foot">${snapshot.staffUnits} unidades internas</span>
            </article>
            <article class="stat-card">
              <span class="stat-label">Choferes/coordinadores</span>
              <strong class="stat-value">${formatMoney(snapshot.driverCoordinatorTotal)}</strong>
              <span class="stat-foot">Bonificado ${formatMoney(
                snapshot.driverCoordinatorCourtesyValue
              )}</span>
            </article>
            <article class="stat-card">
              <span class="stat-label">Regalos en habitaciones</span>
              <strong class="stat-value">${formatMoney(snapshot.roomCourtesyValue)}</strong>
              <span class="stat-foot">${
                snapshot.roomCourtesyBreakdown.length
                  ? `${snapshot.roomCourtesyBreakdown.length} habitaciones con regalo`
                  : "Sin regalos registrados"
              }</span>
            </article>
            <article class="stat-card">
              <span class="stat-label">Alertas de stock</span>
              <strong class="stat-value">${snapshot.lowStock.length}</strong>
              <span class="stat-foot">Productos en nivel bajo</span>
            </article>
          </section>

          <section id="payments" class="two-col">
            <article class="panel">
              <div class="panel-head">
                <div>
                  <h2>Cobros del turno</h2>
                  <p>Separados por caja física, caja virtual y movimientos pendientes de definir.</p>
                </div>
              </div>
              <div class="payment-grid">
                ${paymentCards
                  .map(
                    (entry) => `
                      <div class="payment-card ${entry.tone}">
                        <div>${escapeHtml(entry.label)}</div>
                        <strong>${formatMoney(entry.total)}</strong>
                        <span>${entry.count} movimientos registrados</span>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </article>

            <article class="panel">
              <div class="panel-head">
                <div>
                  <h2>Ranking de ventas</h2>
                  <p>Top del turno considerando habitaciones cerradas, caja directa y choferes/coordinadores.</p>
                </div>
              </div>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Producto</th>
                      <th style="text-align:right;">Cant.</th>
                    </tr>
                  </thead>
                  <tbody>${rankingRows}</tbody>
                </table>
              </div>
            </article>
          </section>

          <section id="rooms" class="panel">
            <div class="panel-head">
              <div>
                <h2>Habitaciones cerradas</h2>
                <p>Detalle de cada cierre individual del turno.</p>
              </div>
            </div>
            <div class="table-wrap">
              <table class="rooms-report-table">
                <thead>
                  <tr>
                    <th>Habitación</th>
                    <th>Pago</th>
                    <th class="rooms-col-items">Items</th>
                    <th class="rooms-col-bonif">Bonif.</th>
                    <th class="rooms-col-gift">Regalo</th>
                    <th class="rooms-col-time">Hora</th>
                    <th class="rooms-col-total">Total</th>
                  </tr>
                </thead>
                <tbody>${closedRoomsRows}</tbody>
              </table>
            </div>
          </section>

          <section id="courtesies" class="panel">
            <div class="panel-head">
              <div>
                <h2>Bonificaciones en habitaciones</h2>
                <p>Productos regalados por cortesía, resarcimiento o ajuste operativo.</p>
              </div>
              <div class="hero-pills">
                <span class="hero-pill">Bonificado ${formatMoney(snapshot.roomCourtesyValue)}</span>
              </div>
            </div>
            <div class="mini-card-grid">
              ${roomCourtesyCards}
            </div>
          </section>

          <section id="cashier" class="panel">
            <div class="panel-head">
              <div>
                <h2>Caja directa</h2>
                <p>Ventas cobradas al instante, ya separadas por medio de pago.</p>
              </div>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Pago</th>
                    <th style="text-align:right;">Cant.</th>
                    <th style="text-align:right;">Unitario</th>
                    <th style="text-align:right;">Total</th>
                  </tr>
                </thead>
                <tbody>${cashierRows}</tbody>
              </table>
            </div>
          </section>

          <section id="drivers" class="panel">
            <div class="panel-head">
              <div>
                <h2>Grupos de choferes y coordinadores</h2>
                <p>El informe deja registro de cuándo nació cada grupo, qué consumió en este turno, si continúa abierto y si aquí mismo quedó cerrado.</p>
              </div>
              ${
                driverCoordinatorGroupStorySummary.length
                  ? `<div class="hero-pills">${driverCoordinatorGroupStorySummary
                      .map((label) => `<span class="hero-pill">${escapeHtml(label)}</span>`)
                      .join("")}</div>`
                  : ""
              }
            </div>
            <div class="group-story-grid">
              ${driverCoordinatorGroupStoryCards}
            </div>
          </section>

          <section id="staff" class="panel">
            <div class="panel-head">
              <div>
                <h2>Consumos del personal</h2>
                <p>Detalle por integrante, cobrado a costo.</p>
              </div>
            </div>
            <div class="mini-card-grid">
              ${staffCards}
            </div>
          </section>

          <section id="stock" class="panel">
            <div class="panel-head">
              <div>
                <h2>Alertas de stock</h2>
                <p>Productos que llegaron al umbral bajo o quedaron por debajo.</p>
              </div>
            </div>
            ${lowStockList}
          </section>

          <section class="footer-note">
            <strong>Cierre gerencial listo para compartir</strong>
            Esta versión prioriza lectura en pantalla, navegación rápida y guardado directo del
            informe, sin forzar un formato de hoja fija.
          </section>
        </div>
        <script>
          function downloadReportHtml() {
            const html = document.documentElement.outerHTML;
            const blob = new Blob([html], { type: "text/html;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = ${JSON.stringify(reportHtmlFileName)};
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(function () {
              URL.revokeObjectURL(url);
            }, 500);
          }
        </script>
      </body>
    </html>
  `;
}

async function openManagerReport() {
  if (!canRunShiftClosingAction("emitir el informe gerencial")) {
    return;
  }

  const snapshot = getActiveShiftClosingSnapshot();
  if (!snapshot.hasMovement) {
    alert("Todavía no hay movimiento para generar el informe gerencial.");
    return;
  }

  const embeddedLogoUrl = await ensureManagerReportLogoDataUrl();
  const embeddedTitleFontUrl = await ensureManagerReportTitleFontDataUrl();
  const html = buildManagerReportDocument(snapshot, embeddedLogoUrl, embeddedTitleFontUrl);
  openDocumentWindow(
    html,
    `${state.hotelName} - Informe gerencial ${snapshot.serviceLabel} - ${formatShortDate(
      snapshot.generatedAt
    )}`
  );
}

function printRoomTicket(roomId) {
  const room = getRoomById(roomId);
  if (!room || room.items.length === 0) {
    alert("La habitación no tiene ítems para imprimir.");
    return;
  }

  const roomNumber = roomNumberFromLabel(room.label);
  const checkinOccupant = getRoomCheckinOccupant(roomNumber);
  const headerLine = [
    formatDateTime(new Date().toISOString()),
    room.label,
    checkinOccupant ? `Titular: ${checkinOccupant.guestName}` : "",
  ]
    .filter(Boolean)
    .join(" | ");
  const html = buildTicketDocument(
    state.hotelName,
    state.stationName,
    headerLine,
    room.items,
    getRoomTotal(room),
    "Gracias por su compra."
  );
  room.printedAt = new Date().toISOString();
  persistState(`Imprimir ticket ${room.label}`);
  openPrintWindow(html);
  render();
}

function printShiftSummary() {
  if (!canRunShiftClosingAction("emitir el ticket de turno")) {
    return;
  }

  const snapshot = getActiveShiftClosingSnapshot();
  if (!snapshot.hasMovement) {
    alert("Todavía no hay movimiento para imprimir el cierre.");
    return;
  }

  const paymentLines = [
    `Efectivo: ${formatMoney(snapshot.paymentBreakdown.cash.total)}`,
    `Transferencia: ${formatMoney(snapshot.paymentBreakdown.transfer.total)}`,
  ];
  if (snapshot.paymentBreakdown.stay.count > 0) {
    paymentLines.push(`Saldo estadía: ${formatMoney(snapshot.paymentBreakdown.stay.total)}`);
  }
  if (snapshot.paymentBreakdown.unknown.count > 0) {
    paymentLines.push(`Sin definir: ${formatMoney(snapshot.paymentBreakdown.unknown.total)}`);
  }

  const footerParts = [
    `Cobros registrados:<br />${paymentLines.join("<br />")}`,
    snapshot.roomCourtesyBreakdown.length
      ? `Bonificaciones en habitaciones (${formatMoney(snapshot.roomCourtesyValue)}):<br />${snapshot.roomCourtesyBreakdown
          .map(
            (entry) =>
              `${escapeHtml(entry.roomLabel)}: ${entry.products
                .map((product) => `${escapeHtml(product.name)} x${product.quantity}`)
                .join(", ")}`
          )
          .join("<br />")}`
      : "Sin bonificaciones en habitaciones.",
    snapshot.staffConsumption.length
      ? `Consumos del personal a costo (${formatMoney(snapshot.staffTotal)}):<br />${snapshot.staffBreakdown
          .map(
            (entry) =>
              `${escapeHtml(entry.name)} (${formatMoney(entry.total)}): ${entry.products
                .map((product) => `${escapeHtml(product.name)} x${product.quantity}`)
                .join(", ")}`
          )
          .join("<br />")}`
      : "Sin consumos del personal.",
    snapshot.driverCoordinatorConsumption.length
      ? `Choferes/coordinadores por cobrar (${formatMoney(snapshot.driverCoordinatorTotal)}):<br />${snapshot.driverCoordinatorBreakdown
          .map(
            (entry) =>
              `${escapeHtml(entry.name)}${
                entry.groupName ? ` [${escapeHtml(entry.groupName)}]` : ""
              } (${formatMoney(entry.total)}): ${entry.products
                .map((product) => {
                  const detailParts = [];
                  if (product.courtesyQuantity > 0) {
                    detailParts.push(`${product.courtesyQuantity} bonif.`);
                  }
                  if (product.discountedQuantity > 0) {
                    detailParts.push(`${product.discountedQuantity} c/30%`);
                  }
                  return `${escapeHtml(product.name)} x${product.quantity}${
                    detailParts.length ? ` (${detailParts.join(" + ")})` : ""
                  }`;
                })
                .join(", ")}`
          )
          .join("<br />")}<br />Bonificado: ${formatMoney(snapshot.driverCoordinatorCourtesyValue)}`
      : "Sin consumos de choferes/coordinadores.",
  ];
  const footer = footerParts.join("<br /><br />");

  const html = buildSummaryDocument(
    state.hotelName,
    "Cierre global de turno",
    `${formatDateTime(snapshot.generatedAt)} | ${snapshot.serviceLabel}`,
    snapshot.ranking,
    snapshot.soldTotal,
    footer
  );
  openPrintWindow(html);
}

function renderSummaryCards() {
  const pendingRooms = state.activeShift.rooms.filter((room) => room.items.length > 0);
  const pendingTotal = pendingRooms.reduce((sum, room) => sum + getRoomTotal(room), 0);
  const closedTotal = state.activeShift.closedRooms.reduce(
    (sum, room) => sum + room.total,
    0
  );
  const cashierTotal = getCollectionTotal(state.activeShift.cashierSales);
  const lowStockCount = getLowStockProducts().length;

  return `
    <section class="summary-grid">
      <article class="stat-card">
        <span class="stat-label">Habitaciones activas</span>
        <strong class="stat-value">${pendingRooms.length}</strong>
        <span class="stat-foot">${formatMoney(pendingTotal)} en consumo</span>
      </article>
      <article class="stat-card">
        <span class="stat-label">Cierres del turno</span>
        <strong class="stat-value">${state.activeShift.closedRooms.length}</strong>
        <span class="stat-foot">${formatMoney(closedTotal)} facturados</span>
      </article>
      <article class="stat-card">
        <span class="stat-label">Caja directa</span>
        <strong class="stat-value">${formatMoney(cashierTotal)}</strong>
        <span class="stat-foot">${getItemsUnits(state.activeShift.cashierSales)} unidades</span>
      </article>
      <article class="stat-card">
        <span class="stat-label">Stock bajo</span>
        <strong class="stat-value">${lowStockCount}</strong>
        <span class="stat-foot">productos en alerta</span>
      </article>
    </section>
  `;
}

function renderMemberGrid(members, options) {
  const {
    emptyText,
    action,
    dataAttribute,
    buttonLabel,
    metaText,
  } = options;

  if (!members.length) {
    return `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="member-grid">
      ${members
        .map(
          (member) => `
            <div class="member-card">
              <div class="member-copy">
                <strong>${escapeHtml(member.name)}</strong>
                ${metaText ? `<span>${escapeHtml(metaText)}</span>` : ""}
              </div>
              ${
                action && dataAttribute && buttonLabel
                  ? `
                    <button
                      class="ghost-button is-compact"
                      type="button"
                      data-action="${action}"
                      ${dataAttribute}="${member.id}"
                    >
                      ${buttonLabel}
                    </button>
                  `
                  : ""
              }
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderRoomGrid() {
  return state.activeShift.rooms
    .map((room) => {
      const total = getRoomTotal(room);
      const units = getItemsUnits(room.items);
      const isActiveRoom = room.items.length > 0;
      const roomNumberMatch = String(room.label || "").match(/\d+/);
      const roomNumber = roomNumberMatch ? roomNumberMatch[0] : String(room.label || "").trim();
      const checkinOccupant = getRoomCheckinOccupant(roomNumber);
      const isDriverCoordinatorRoom = Boolean(checkinOccupant && checkinOccupant.compRoomType);
      const roomGroupColor = checkinOccupant ? checkinOccupant.groupColor : "";
      const roomGroupStyle = roomGroupColor
        ? ` style="--room-group-soft: ${escapeHtml(
            getSoftHslColor(getLighterHslColor(roomGroupColor, 12), 0.2)
          )}; --room-group-border: ${escapeHtml(
            getSoftHslColor(roomGroupColor, 0.36)
          )}; --room-group-accent: ${escapeHtml(roomGroupColor)}; --room-group-number: ${escapeHtml(
            getDarkerHslColor(roomGroupColor)
          )};"`
        : "";
      const classes = [
        "room-card",
        ui.selectedRoomId === room.id ? "is-selected" : "",
        isActiveRoom ? "is-active" : "",
        room.printedAt ? "is-printed" : "",
        checkinOccupant ? "is-checkin-active" : "",
        roomGroupColor ? "has-group-color" : "",
        isDriverCoordinatorRoom ? "is-driver-coordinator-room" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `
        <button class="${classes}"${roomGroupStyle} data-action="select-room" data-room-id="${room.id}">
          <span class="room-card-header">
            <span class="room-card-copy">
              <span class="room-card-kicker">${
                isDriverCoordinatorRoom
                  ? checkinOccupant.compRoomLabel
                  : checkinOccupant
                    ? "Huésped activo"
                    : "Habitación"
              }</span>
              ${
                checkinOccupant && checkinOccupant.groupName
                  ? `<span class="room-group-name">${escapeHtml(checkinOccupant.groupName)}</span>`
                  : ""
              }
              ${
                checkinOccupant
                  ? `<span class="room-guest-name">${escapeHtml(checkinOccupant.guestName)}</span>`
                  : ""
              }
            </span>
            <span class="room-card-side">
              <span class="room-card-number">${escapeHtml(roomNumber)}</span>
              <span class="room-card-badges">
                ${units > 0 ? `<span class="badge">${units}</span>` : ""}
                ${
                  isDriverCoordinatorRoom
                    ? `<span class="badge room-driver-badge">${
                        checkinOccupant.compRoomType === "drivers" ? "Choferes" : "Coord."
                      }</span>`
                    : ""
                }
                ${room.printedAt ? `<span class="badge room-status-badge">Ticket</span>` : ""}
              </span>
            </span>
          </span>
          <span class="room-total-row">
            <strong>${formatMoney(total)}</strong>
            ${isActiveRoom && !room.printedAt ? `<span class="room-flag">Pendiente</span>` : ""}
          </span>
        </button>
      `;
    })
    .join("");
}

function renderCategoryChips(scope, selectedCategory) {
  const normalizedCategory = normalizeScopeCategory(scope, selectedCategory);
  return getCategoryOptions(scope)
    .map((category) => {
      const label = category === "all" ? "Todas" : category;
      const className = category === normalizedCategory ? "chip active" : "chip";
      return `
        <button class="${className}" data-action="set-category" data-scope="${scope}" data-category="${escapeHtml(
          category
        )}">
          ${escapeHtml(label)}
        </button>
      `;
    })
    .join("");
}

function renderProductPicker(scope, query, category) {
  const normalizedCategory = normalizeScopeCategory(scope, category);
  const products = filterProducts(getSellableCatalog(false), query, normalizedCategory);
  if (!products.length) {
    return `<div class="empty-state">No hay productos para este filtro.</div>`;
  }

  return `
    <div class="product-picker-grid">
      ${products
        .map((product) => {
          const margin = getProductMarginData(product);
          const availability = getProductAvailability(product.id);
          const canAddProduct = availability.ok;
          const isStaffScope = scope === "staff";
          const isDriverCoordinatorScope = scope === "driver-coordinator";
          const isOutOfStock =
            product.trackStock &&
            typeof product.stock === "number" &&
            product.stock <= 0;
          const isLowStock =
            !isOutOfStock &&
            product.trackStock &&
            typeof product.stock === "number" &&
            product.stock <= getLowStockThreshold(product);
          const displayUnitValue = isStaffScope
            ? margin.unitCost
            : isDriverCoordinatorScope
              ? getDriverCoordinatorDiscountedUnitPrice(product.price)
              : product.price;
          const stockText = product.trackStock ? `${fallbackValue(product.stock, 0)} stock` : "Libre";
          const stockBadgeClass = isOutOfStock
            ? "badge stock-badge zero"
            : isLowStock
              ? "badge stock-badge warn"
              : "badge stock-badge";
          const descriptorParts = [product.category];
          if (isManufacturedProduct(product)) {
            descriptorParts.push("Elaborada");
          }
          const descriptorText = descriptorParts.join(" | ");
          const mainValueLabel =
            displayUnitValue === null ? "Costo pendiente" : formatMoney(displayUnitValue);
          const secondaryValueLabel = isStaffScope
            ? product.price > 0
              ? `Venta ${formatMoney(product.price)}`
              : "Venta pendiente"
            : isDriverCoordinatorScope
              ? isDriverCoordinatorFreeEligibleItem(product)
                ? "1 bonif. 500/600ml"
                : `Venta ${formatMoney(product.price)}`
              : margin.unitCost === null
                ? "Costo pendiente"
                : `Costo ${formatMoney(margin.unitCost)}`;
          const contextBadgeLabel = isStaffScope
            ? "A costo"
            : isDriverCoordinatorScope
              ? isDriverCoordinatorFreeEligibleItem(product)
                ? "Bonif. / 30%"
                : "30% off"
              : margin.marginPercent === null
                ? "Sin margen"
                : formatPercent(margin.marginPercent);

          return `
            <article class="product-card ${isOutOfStock ? "is-out-of-stock" : ""} ${isLowStock ? "is-low-stock" : ""} ${!canAddProduct ? "is-unavailable" : ""}">
              <div class="product-card-head">
                <div class="product-copy">
                  <h4>${escapeHtml(product.name)}</h4>
                  <span class="product-subline">${escapeHtml(descriptorText)}</span>
                </div>
                <span class="${stockBadgeClass}">${escapeHtml(stockText)}</span>
              </div>
              <div class="product-price-row">
                <strong class="product-price-main">${mainValueLabel}</strong>
                <span class="product-price-side">${secondaryValueLabel}</span>
              </div>
              <div class="product-foot">
                <span class="product-context-badge">${escapeHtml(contextBadgeLabel)}</span>
                <button
                  class="button is-compact"
                  data-action="add-product"
                  data-scope="${scope}"
                  data-product-id="${product.id}"
                  title="${escapeHtml(
                    canAddProduct ? `Agregar ${product.name}` : availability.message || "Sin stock"
                  )}"
                  ${canAddProduct ? "" : "disabled"}
                >
                  ${canAddProduct ? "Agregar" : "Sin stock"}
                </button>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderItemsTable(items, scope) {
  if (!items.length) {
    return `<div class="empty-state">Todavía no hay ítems cargados.</div>`;
  }

  const roomId = scope.startsWith("room:") ? scope.slice(5) : "";
  const room = roomId ? getRoomById(roomId) : null;
  const driverCoordinatorRoomContext = getDriverCoordinatorRoomContext(room);
  const showRoomCourtesyActions = Boolean(roomId) && !driverCoordinatorRoomContext;
  const showPaymentMethod = scope === "cashier";
  const showStaffMember = scope === "staff";
  const showDriverCoordinatorMember = scope === "driver-coordinator";
  const showDriverCoordinatorPricing =
    scope === "driver-coordinator" || Boolean(driverCoordinatorRoomContext);

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            ${showPaymentMethod ? "<th>Pago</th>" : ""}
            ${showStaffMember ? "<th>Personal</th>" : ""}
            ${showDriverCoordinatorMember ? "<th>Persona</th>" : ""}
            ${showDriverCoordinatorPricing ? "<th>Condicion</th>" : ""}
            <th>Cantidad</th>
            <th>Unitario</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => {
                const isRoomCourtesy = isRoomCourtesyItem(item);
                const roomCourtesyLabel = isRoomCourtesy
                  ? `<div class="muted line-note">Bonificada | Valor de lista ${formatMoney(
                      fallbackValue(item.originalUnitPrice, item.unitPrice)
                    )}</div>`
                  : "";
                const driverCoordinatorLabel =
                  showDriverCoordinatorPricing && isDriverCoordinatorPricingItem(item)
                    ? `<div class="muted line-note">Choferes/coordinadores | ${escapeHtml(
                        getDriverCoordinatorPricingLabel(item.pricingRule)
                      )}</div>`
                    : "";
                const roomCourtesyAction = showRoomCourtesyActions
                  ? `<button
                      class="mini-button mini-button-text ${
                        isRoomCourtesy ? "is-secondary" : "is-warning"
                      }"
                      data-action="${
                        isRoomCourtesy ? "restore-room-item-charge" : "mark-room-item-courtesy"
                      }"
                      data-room-id="${escapeHtml(roomId)}"
                      data-product-id="${item.productId}"
                    >${isRoomCourtesy ? "Cobrar" : "Bonif."}</button>`
                  : "";
                return `
              <tr>
                <td>
                  <div class="line-item-copy">
                    <div>${escapeHtml(item.name)}</div>
                    ${roomCourtesyLabel}
                    ${driverCoordinatorLabel}
                  </div>
                </td>
                ${
                  showPaymentMethod
                    ? `<td>
                        <span class="${getPaymentMethodChipClass(item.paymentMethod)}">
                          ${getPaymentMethodLabel(item.paymentMethod)}
                        </span>
                      </td>`
                    : ""
                }
                ${
                  showStaffMember
                    ? `<td>${escapeHtml(
                        getStaffMemberLabel(item.staffMemberId, item.staffMemberName)
                      )}</td>`
                    : ""
                }
                ${
                  showDriverCoordinatorMember
                    ? `<td>${escapeHtml(
                        getDriverCoordinatorMemberLabel(
                          item.driverCoordinatorMemberId,
                          item.driverCoordinatorMemberName
                        )
                      )}</td>`
                    : ""
                }
                ${
                  showDriverCoordinatorPricing
                    ? `<td>${escapeHtml(getDriverCoordinatorPricingLabel(item.pricingRule))}</td>`
                    : ""
                }
                <td>${item.quantity}</td>
                <td>${formatMoney(item.unitPrice)}</td>
                <td>${formatMoney(item.quantity * item.unitPrice)}</td>
                <td>
                  <div class="line-actions">
                    <button class="mini-button" data-action="change-item" data-scope="${scope}" data-product-id="${item.productId}" data-payment-method="${normalizePaymentMethod(
                      item.paymentMethod
                    )}" data-staff-member-id="${escapeHtml(item.staffMemberId || "")}" data-driver-coordinator-member-id="${escapeHtml(
                      item.driverCoordinatorMemberId || ""
                    )}" data-pricing-rule="${escapeHtml(item.pricingRule || "")}" data-delta="-1">-</button>
                    <button class="mini-button" data-action="change-item" data-scope="${scope}" data-product-id="${item.productId}" data-payment-method="${normalizePaymentMethod(
                      item.paymentMethod
                    )}" data-staff-member-id="${escapeHtml(item.staffMemberId || "")}" data-driver-coordinator-member-id="${escapeHtml(
                      item.driverCoordinatorMemberId || ""
                    )}" data-pricing-rule="${escapeHtml(item.pricingRule || "")}" data-delta="1">+</button>
                    <button class="mini-button is-danger" data-action="remove-item" data-scope="${scope}" data-product-id="${item.productId}" data-payment-method="${normalizePaymentMethod(
                      item.paymentMethod
                    )}" data-staff-member-id="${escapeHtml(item.staffMemberId || "")}" data-driver-coordinator-member-id="${escapeHtml(
                      item.driverCoordinatorMemberId || ""
                    )}" data-pricing-rule="${escapeHtml(item.pricingRule || "")}">x</button>
                    ${roomCourtesyAction}
                  </div>
                </td>
              </tr>
            `;
              }
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderStaffConsumptionBreakdown(items, emptyText) {
  const breakdown = buildStaffConsumptionBreakdown(items);
  if (!breakdown.length) {
    return `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="list-stack">
      ${breakdown
        .map(
          (entry) => `
            <div class="history-card">
              <div class="between">
                <div>
                  <h4>${escapeHtml(entry.name)}</h4>
                  <div class="muted">${entry.quantity} unidades</div>
                </div>
                <strong>${formatMoney(entry.total)}</strong>
              </div>
              <div class="muted">
                ${entry.products
                  .map((product) => `${escapeHtml(product.name)} x${product.quantity}`)
                  .join(" | ")}
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderDriverCoordinatorBreakdown(items, emptyText) {
  const breakdown = buildDriverCoordinatorBreakdown(items);
  if (!breakdown.length) {
    return `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="list-stack">
      ${breakdown
        .map(
          (entry) => `
            <div class="history-card">
              <div class="between">
                <div>
                  <h4>${escapeHtml(entry.name)}</h4>
                  <div class="muted">
                    ${
                      entry.groupName
                        ? `${escapeHtml(entry.groupName)} | `
                        : ""
                    }${entry.quantity} unidades | ${entry.courtesyQuantity} bonificadas
                  </div>
                </div>
                <strong>${formatMoney(entry.total)}</strong>
              </div>
              <div class="muted">
                ${entry.products
                  .map((product) => {
                    const detailParts = [];
                    if (product.courtesyQuantity > 0) {
                      detailParts.push(`${product.courtesyQuantity} bonif.`);
                    }
                    if (product.discountedQuantity > 0) {
                      detailParts.push(`${product.discountedQuantity} c/30%`);
                    }
                    const detailLabel = detailParts.length ? ` (${detailParts.join(" + ")})` : "";
                    return `${escapeHtml(product.name)} x${product.quantity}${detailLabel}`;
                  })
                  .join(" | ")}
              </div>
              ${
                entry.courtesyValue > 0
                  ? `<div class="muted">Bonificado ${formatMoney(entry.courtesyValue)}</div>`
                  : ""
              }
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderDriverCoordinatorClosureCards() {
  const activeGroups = getActiveDriverCoordinatorGroups();
  if (!activeGroups.length) {
    return `<div class="empty-state">No hay grupos activos para gestionar en este momento.</div>`;
  }

  return `
    <div class="list-stack">
      ${activeGroups
        .map((group) => {
          const shiftItems = getDriverCoordinatorItemsForGroup(
            state.activeShift.driverCoordinatorConsumption,
            group.id
          );
          const accountItems = getDriverCoordinatorAccountItemsForGroup(group.id);
          const shiftBreakdown = buildDriverCoordinatorBreakdown(shiftItems);
          const accountBreakdown = buildDriverCoordinatorBreakdown(accountItems);
          const shiftTotal = getCollectionTotal(shiftItems);
          const accountTotal = getCollectionTotal(accountItems);
          const shiftCourtesyValue = getDriverCoordinatorCourtesyValue(shiftItems);
          const accountCourtesyValue = getDriverCoordinatorCourtesyValue(accountItems);
          const activeMembers = getDriverCoordinatorMembersForGroup(group.id);

          return `
            <article class="history-card group-closure-card">
              <div class="history-head">
                <div>
                  <h4>${escapeHtml(group.name)}</h4>
                  <div class="muted">${activeMembers.length} personas cargadas</div>
                </div>
                <strong>${formatMoney(accountTotal)}</strong>
              </div>
              <div class="chip-row" style="margin-top: 10px;">
                <span class="chip">${state.activeShift.serviceLabel}</span>
                <span class="chip">Turno ${formatMoney(shiftTotal)}</span>
                <span class="chip">Pendiente ${formatMoney(accountTotal)}</span>
                ${
                  accountCourtesyValue > 0
                    ? `<span class="chip is-courtesy">Bonificado ${formatMoney(accountCourtesyValue)}</span>`
                    : ""
                }
              </div>
              <div class="group-closure-summary">
                <div class="muted">
                  ${
                    shiftItems.length
                      ? `Este turno: ${escapeHtml(buildCompactBreakdownPreview(shiftBreakdown) || "Consumos cargados")}`
                      : "Este turno: sin consumos cargados."
                  }
                </div>
                <div class="muted">
                  ${
                    accountItems.length
                      ? `Acumulado: ${escapeHtml(buildCompactBreakdownPreview(accountBreakdown) || "Cuenta pendiente cargada")}`
                      : "Acumulado: sin cuenta pendiente."
                  }
                </div>
                ${
                  shiftCourtesyValue > 0
                    ? `<div class="muted">Bonificado en este turno ${formatMoney(shiftCourtesyValue)}</div>`
                    : ""
                }
              </div>
              <div class="actions-row" style="margin-top: 14px;">
                <button
                  class="ghost-button"
                  data-action="print-driver-coordinator-turn-ticket"
                  data-driver-coordinator-group-id="${group.id}"
                  ${shiftItems.length ? "" : "disabled"}
                >
                  Ticket del turno
                </button>
                <button
                  class="ghost-button"
                  data-action="print-driver-coordinator-group-ticket"
                  data-driver-coordinator-group-id="${group.id}"
                  ${accountItems.length ? "" : "disabled"}
                >
                  Ticket final
                </button>
                <button
                  class="ghost-button"
                  data-action="open-driver-coordinator-group-report"
                  data-driver-coordinator-group-id="${group.id}"
                  ${accountItems.length ? "" : "disabled"}
                >
                  Informe de grupo
                </button>
                <button
                  class="button"
                  data-action="close-driver-coordinator-group"
                  data-driver-coordinator-group-id="${group.id}"
                >
                  Cerrar grupo
                </button>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderModuleLinks(linkClass = "hero-nav-link") {
  return MODULE_NAV_ITEMS
    .map(
      (module) => `
        <a class="${linkClass}" href="${module.href}">
          ${escapeHtml(module.label)}
        </a>
      `
    )
    .join("");
}

function renderFloatingModuleNav() {
  if (SYSTEM_CHROME) {
    return "";
  }
  return `
    <div id="floating-module-nav" class="floating-module-nav" aria-hidden="true">
      <div class="floating-module-nav-inner">
        <div class="floating-module-links">
          ${renderModuleLinks("floating-nav-link")}
        </div>
        <div class="floating-nav-utilities">
          <a class="floating-top-link is-icon-only" href="#hero-section" aria-label="Subir al inicio">
            <span class="floating-top-icon">&uarr;</span>
          </a>
          <button class="floating-brand-link" type="button" data-action="open-unified-system-menu" aria-label="Abrir menu de sistemas">
            <img class="floating-brand-logo" src="${LOGO_URL}" alt="Solanas" />
          </button>
        </div>
      </div>
    </div>
  `;
}

function openUnifiedSystemMenuFromEmbeddedApp(event) {
  if (event) {
    event.preventDefault();
  }
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "solanas:toggle-system-menu" }, "*");
    return;
  }
  window.location.hash = "hero-section";
}

function returnToUnifiedMenuFromEmbeddedApp(event) {
  if (event) {
    event.preventDefault();
  }
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "solanas:return-unified-menu" }, "*");
    return;
  }
  window.location.hash = "hero-section";
}

function updateFloatingModuleNavVisibility(isVisible) {
  const floatingNav = document.getElementById("floating-module-nav");
  if (!floatingNav) return;

  floatingNav.classList.toggle("is-visible", isVisible);
  floatingNav.setAttribute("aria-hidden", isVisible ? "false" : "true");
}

function setupFloatingModuleNav() {
  if (heroVisibilityObserver) {
    heroVisibilityObserver.disconnect();
    heroVisibilityObserver = null;
  }

  const heroSection = document.getElementById("hero-section");
  if (!heroSection) return;

  const syncVisibility = () => {
    updateFloatingModuleNavVisibility(heroSection.getBoundingClientRect().bottom <= 88);
  };

  if ("IntersectionObserver" in window) {
    heroVisibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const heroBottom = entry ? entry.boundingClientRect.bottom : heroSection.getBoundingClientRect().bottom;
        updateFloatingModuleNavVisibility(heroBottom <= 88);
      },
      {
        threshold: [0, 0.02, 0.2, 1],
        rootMargin: "-88px 0px 0px 0px",
      }
    );

    heroVisibilityObserver.observe(heroSection);
  }

  syncVisibility();
}

function scrollToRoomDetail() {
  const roomDetail = document.getElementById("room-detail-panel");
  if (!roomDetail) return;
  roomDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function shouldWarnAboutVacantRoom(room) {
  if (!room || (Array.isArray(room.items) && room.items.length > 0)) {
    return false;
  }
  const roomNumber = roomNumberFromLabel(room.label);
  return !getRoomCheckinOccupant(roomNumber);
}

function selectRoom(roomId, options = {}) {
  const room = getRoomById(roomId);
  if (!room) return;
  if (!options.force && shouldWarnAboutVacantRoom(room)) {
    ui.pendingEmptyRoomWarningId = room.id;
    render({ preserveScroll: true });
    return;
  }
  ui.pendingEmptyRoomWarningId = "";
  ui.selectedRoomId = room.id;
  render({ preserveScroll: true, skipModuleMainScrollRestore: true });
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      scrollToRoomDetail();
    });
  });
}

function scrollToHeroSection() {
  const heroSection = document.getElementById("hero-section");
  if (!heroSection) return;
  heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderRoomDetail() {
  const room = getRoomById(ui.selectedRoomId) || state.activeShift.rooms[0];
  if (!room) return "";
  const roomTotal = getRoomTotal(room);
  const roomCourtesyValue = getRoomCourtesyValue(room.items);
  const roomUnits = getItemsUnits(room.items);
  const hasItems = room.items.length > 0;
  const canCancelRoom = hasItems || Boolean(room.printedAt);
  const roomNumberMatch = String(room.label || "").match(/\d+/);
  const roomNumber = roomNumberMatch ? roomNumberMatch[0] : String(room.label || "").trim();
  const checkinOccupant = getRoomCheckinOccupant(roomNumber);
  const driverCoordinatorRoomContext = getDriverCoordinatorRoomContext(room);

  return `
    <section id="room-detail-panel" class="panel panel-strong">
      <div class="panel-title-row">
        <div class="room-detail-heading">
          <h2 class="room-detail-title">
            <span>Habitación</span>
            <span class="room-detail-number">${escapeHtml(roomNumber)}</span>
          </h2>
          <p>${
            driverCoordinatorRoomContext
              ? `Habitaci&oacute;n de ${escapeHtml(
                  driverCoordinatorRoomContext.compRoomLabel
                )}${driverCoordinatorRoomContext.groupName ? ` del grupo ${escapeHtml(driverCoordinatorRoomContext.groupName)}` : ""}: bonificaci&oacute;n y 30% autom&aacute;tico.`
              : checkinOccupant
              ? `Activa en Check-in: ${escapeHtml(checkinOccupant.guestName)}.`
              : "Consumo en curso con ticket e historial separados."
          }</p>
        </div>
        <div class="chip-row">
          <span class="chip">${roomUnits} items</span>
          <span class="chip">${formatMoney(roomTotal)}</span>
          ${roomCourtesyValue > 0 ? `<span class="chip is-courtesy">Regalo ${formatMoney(roomCourtesyValue)}</span>` : ""}
          ${
            driverCoordinatorRoomContext
              ? `<span class="chip is-driver-coordinator">${escapeHtml(
                  driverCoordinatorRoomContext.compRoomLabel
                )}</span>`
              : ""
          }
          <span class="chip">${room.printedAt ? "Ticket listo" : "Ticket pendiente"}</span>
        </div>
      </div>

      <div class="actions-row" style="margin-top: 14px;">
        <button class="button" data-action="print-room-ticket" data-room-id="${room.id}" ${hasItems ? "" : "disabled"}>Imprimir ticket</button>
        <button class="button is-blue" data-action="close-room" data-room-id="${room.id}" ${hasItems ? "" : "disabled"}>Cerrar habitación</button>
        ${
          canCancelRoom
            ? `<button class="danger-button room-cancel-button" data-action="cancel-room" data-room-id="${room.id}">Cancelar habitación</button>`
            : ""
        }
      </div>

      <div style="margin-top: 18px;">
        <div class="panel-title-row">
          <div>
            <h3>Consumo actual</h3>
            <p>Los cambios actualizan stock cuando corresponde.</p>
          </div>
        </div>
        ${renderItemsTable(room.items, `room:${room.id}`)}
      </div>

      <div style="margin-top: 18px;">
        <div class="panel-title-row">
          <div>
            <h3>Agregar productos</h3>
            <p>Busca y agrega desde el catálogo.</p>
          </div>
        </div>
        <div class="picker-toolbar">
          <input type="search" id="room-product-search" placeholder="Buscar bebida..." value="${escapeHtml(
            ui.roomQuery
          )}" />
          <div class="chip-row">${renderCategoryChips("room", ui.roomCategory)}</div>
        </div>
        ${renderProductPicker(`room:${room.id}`, ui.roomQuery, ui.roomCategory)}
      </div>
    </section>
  `;
}

function renderSidePanel() {
  const lowStock = getLowStockProducts();
  const soldRevenue =
    getRoomsRevenueTotal(state.activeShift.closedRooms) +
    getCollectionTotal(state.activeShift.cashierSales);
  const soldCost =
    getRoomsCostTotal(state.activeShift.closedRooms) +
    getCollectionCostTotal(state.activeShift.cashierSales);
  const soldProfit = soldRevenue - soldCost;
  const soldMargin = soldRevenue > 0 ? (soldProfit / soldRevenue) * 100 : 0;
  const staffBreakdown = buildStaffConsumptionBreakdown(state.activeShift.staffConsumption);
  const staffPreview = buildCompactBreakdownPreview(staffBreakdown);

  return `
    <section class="panel">
      <div class="panel-title-row">
        <div>
          <h2>Turno activo</h2>
          <p>Apertura ${formatDateTime(state.activeShift.openedAt)}</p>
        </div>
        <div class="chip-row">
          <span class="chip">${escapeHtml(state.activeShift.serviceLabel)}</span>
          <span class="chip">${state.layoutLocked ? "Layout fijo" : "Layout libre"}</span>
        </div>
      </div>

      <div class="list-stack">
        <div class="history-card">
          <div class="between">
            <div>
              <h4>Vendible del turno</h4>
              <div class="muted">Cerrado + caja directa</div>
            </div>
            <strong>${formatMoney(soldRevenue)}</strong>
          </div>
        </div>
        <div class="history-card">
          <div class="between">
            <div>
              <h4>Rentabilidad estimada</h4>
              <div class="muted">Solo sobre lo ya cobrado</div>
            </div>
            <strong>${formatMoney(soldProfit)}</strong>
          </div>
          <div class="muted" style="margin-top: 6px;">
            Costo ${formatMoney(soldCost)} | Margen ${formatPercent(soldMargin)}
          </div>
        </div>
        <div class="history-card">
          <div class="between">
            <div>
              <h4>Consumos del personal</h4>
              <div class="muted">A costo, fuera del total vendido</div>
            </div>
            <strong>${formatMoney(getCollectionTotal(state.activeShift.staffConsumption))}</strong>
          </div>
          <div class="muted" style="margin-top: 6px;">
            ${getItemsUnits(state.activeShift.staffConsumption)} unidades
          </div>
          ${staffPreview ? `<div class="muted" style="margin-top: 8px;">${escapeHtml(staffPreview)}</div>` : ""}
        </div>
        <div class="history-card ${lowStock.length ? "is-stock-alert" : ""}">
          <h4>Alertas de stock</h4>
          ${
            lowStock.length
              ? `<ol class="rank-list">${lowStock
                  .map(
                    (product) =>
                      `<li>${escapeHtml(product.name)} (${fallbackValue(product.stock, 0)})</li>`
                  )
                  .join("")}</ol>`
              : `<div class="muted">No hay alertas por debajo del umbral.</div>`
          }
        </div>
      </div>
    </section>
  `;
}

function renderCashierSection() {
  const cashierPaymentBreakdown = getCollectionPaymentBreakdown(state.activeShift.cashierSales);

  return `
    <section id="cashier-section" class="panel">
      <div class="panel-title-row">
        <div>
          <h2>Caja directa</h2>
          <p>Venta cobrada al instante, sin habitación.</p>
        </div>
        <div class="chip-row">
          <span class="chip">${formatMoney(getCollectionTotal(state.activeShift.cashierSales))}</span>
          <span class="${getPaymentMethodChipClass("cash")}">
            Efectivo ${formatMoney(cashierPaymentBreakdown.cash.total)}
          </span>
          <span class="${getPaymentMethodChipClass("transfer")}">
            Transferencia ${formatMoney(cashierPaymentBreakdown.transfer.total)}
          </span>
        </div>
      </div>
      ${renderItemsTable(state.activeShift.cashierSales, "cashier")}
      <div style="margin-top: 18px;">
        <div class="picker-toolbar">
          <input type="search" id="cashier-product-search" placeholder="Buscar producto para caja..." value="${escapeHtml(
            ui.cashierQuery
          )}" />
          <div class="chip-row">${renderCategoryChips("cashier", ui.cashierCategory)}</div>
        </div>
        ${renderProductPicker("cashier", ui.cashierQuery, ui.cashierCategory)}
      </div>
    </section>
  `;
}

function renderStaffSection() {
  const staffTotal = getCollectionTotal(state.activeShift.staffConsumption);
  const activeStaffMembers = getActiveStaffMembers();
  return `
    <section id="staff-section" class="panel">
      <div class="panel-title-row">
        <div>
          <h2>Consumos del personal</h2>
          <p>Descuenta stock y se cobra a costo. La nomina se administra desde Empleados.</p>
        </div>
        <div class="chip-row">
          <span class="chip">${getItemsUnits(state.activeShift.staffConsumption)} unidades</span>
          <span class="chip">A costo ${formatMoney(staffTotal)}</span>
        </div>
      </div>
      ${renderItemsTable(state.activeShift.staffConsumption, "staff")}
      <div style="margin-top: 18px;">
        <div class="picker-toolbar">
          <input type="search" id="staff-product-search" placeholder="Buscar producto para personal..." value="${escapeHtml(
            ui.staffQuery
          )}" />
          <div class="chip-row">${renderCategoryChips("staff", ui.staffCategory)}</div>
        </div>
        ${renderProductPicker("staff", ui.staffQuery, ui.staffCategory)}
      </div>
      <div style="margin-top: 18px;">
        <div class="panel-title-row">
          <div>
            <h3>Personal disponible</h3>
            <p>Lista replicada desde Empleados; aca solo se asignan consumos.</p>
          </div>
          <div class="chip-row">
            <span class="chip">${activeStaffMembers.length} activos</span>
            <a class="ghost-button is-compact" href="../../index.html#empleados" target="_parent">Abrir Empleados</a>
          </div>
        </div>
        <div style="margin-top: 14px;">
          ${renderMemberGrid(activeStaffMembers, {
            emptyText: "Aun no hay empleados cargados. Cargalos desde el modulo Empleados.",
            metaText: "Disponible para asignar",
          })}
        </div>
      </div>
      <div style="margin-top: 18px;">
        <div class="panel-title-row">
          <div>
            <h3>Balance por integrante</h3>
            <p>Resumen actual por persona.</p>
          </div>
        </div>
        ${renderStaffConsumptionBreakdown(
          state.activeShift.staffConsumption,
          "Todavía no hay consumos del personal cargados."
        )}
      </div>
    </section>
  `;
}

function renderHero() {
  const suggestedServiceLabel = inferServiceLabel(new Date(state.activeShift.openedAt || Date.now()));
  const serviceWasAdjusted = state.activeShift.serviceLabel !== suggestedServiceLabel;
  return `
    <section id="hero-section" class="hero ${SYSTEM_CHROME ? "is-shell-layout" : "has-unified-return"}">
      ${
        SYSTEM_CHROME
          ? ""
          : `
            <button class="unified-return-button" type="button" data-action="return-unified-menu">
              Volver al men&uacute;
            </button>
          `
      }
      <div class="hero-grid">
        <div>
          <div class="brand-row">
            ${
              SYSTEM_CHROME
                ? `<img class="brand-logo brand-logo--shell" src="${SHELL_HERO_ICON_URL}" alt="" />`
                : `<img class="brand-logo" src="${LOGO_URL}" alt="Solanas" />`
            }
            <div>
              <p class="eyebrow">${escapeHtml(SYSTEM_CHROME ? "Blue Coast · Sistema hotelero" : "Hotel restaurante")}</p>
              <h1>${escapeHtml(SYSTEM_CHROME ? "Estación de bebidas" : state.hotelName)}</h1>
            </div>
          </div>
          <p>
            Comandero local de bebidas con stock, cierres y resguardos para operar sin planillas fragiles.
          </p>
          <div class="hero-actions" style="margin-top: 18px;">
            ${renderModuleLinks()}
          </div>
        </div>
        <div class="hero-meta">
          <div class="hero-service-control">
            <label class="hero-service-label" for="hero-service-select">Servicio del turno</label>
            <select id="hero-service-select" class="hero-service-select">
              ${SERVICE_LABEL_OPTIONS.map(
                (label) =>
                  `<option value="${label}" ${
                    state.activeShift.serviceLabel === label ? "selected" : ""
                  }>${label}</option>`
              ).join("")}
            </select>
            <div class="hero-service-hint">
              Sugerido por horario: ${escapeHtml(suggestedServiceLabel)}${
                serviceWasAdjusted ? " | Ajustado manualmente" : ""
              }
              <br />${escapeHtml(getServiceWindowHint(state.activeShift.serviceLabel))}
            </div>
          </div>
          <div class="hero-meta-pills">
            <span class="status-pill">Abierto ${formatDateTime(state.activeShift.openedAt)}</span>
            <span class="status-pill">Guardado ${formatDateTime(state.safety.lastSavedAt)}</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderShellSidebar() {
  return `
    <aside class="module-sidebar">
      <div class="module-sidebar__header">
        <button
          class="module-sidebar__toggle"
          type="button"
          data-action="toggle-sidebar"
          aria-label="${ui.sidebarCollapsed ? "Expandir menu lateral" : "Retraer menu lateral"}"
          aria-pressed="${ui.sidebarCollapsed ? "true" : "false"}"
        >
          <span class="module-sidebar__toggle-bars" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
        <a class="module-sidebar__brand" href="${new URL("../../index.html#menu", window.location.href).href}" target="_parent" aria-label="Ir al dashboard">
          <img class="module-sidebar__brand-logo-full" src="${BLUE_COAST_LOGO_URL}" alt="Blue Coast Sistema Hotelero" />
        </a>
      </div>
      <nav class="module-sidebar__nav" aria-label="Navegaci\u00f3n principal">
        ${SHELL_SIDEBAR_ITEMS
          .map((item) => {
            const iconUrl = getSidebarIconUrl(item.key);
            const iconMarkup = iconUrl
              ? `<img src="${iconUrl}" data-sidebar-icon-key="${escapeHtml(item.key)}" alt="" />`
              : escapeHtml(item.fallback || "*");
            return `
              <a
                class="module-sidebar__link ${item.key === "bebidas" ? "is-active" : ""}"
                href="${new URL(`../../index.html#${item.key}`, window.location.href).href}"
                target="_parent"
              >
                <span class="module-sidebar__icon" aria-hidden="true">${iconMarkup}</span>
                <span class="module-sidebar__label">${escapeHtml(item.label)}</span>
              </a>
            `;
          })
          .join("")}
      </nav>
    </aside>
  `;
}

function getSidebarIconUrl(key) {
  const icons = ui.theme === "light" ? SIDEBAR_ICON_LIGHT_URLS : SIDEBAR_ICON_URLS;
  return icons[key] || SIDEBAR_ICON_URLS[key] || "";
}

function renderThemeToggleButton(extraClass = "") {
  const isLight = ui.theme === "light";
  return `
    <button
      class="theme-toggle ${extraClass}"
      type="button"
      data-action="toggle-theme"
      aria-label="${isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}"
      aria-pressed="${isLight ? "true" : "false"}"
      title="${isLight ? "Tema claro activo" : "Tema oscuro activo"}"
    >
      ${renderThemeToggleContent(isLight)}
    </button>
  `;
}

function renderThemeToggleContent(isLight) {
  return `
    <span class="theme-toggle__icon ${isLight ? "is-light" : "is-dark"}" aria-hidden="true"></span>
    <span class="theme-toggle__copy">
      <span class="theme-toggle__label">${isLight ? "Tema claro" : "Tema oscuro"}</span>
      <span class="theme-toggle__hint">${isLight ? "Cambiar a oscuro" : "Cambiar a claro"}</span>
    </span>
  `;
}

function updateThemeToggleControls() {
  const isLight = ui.theme === "light";
  document.querySelectorAll('[data-action="toggle-theme"]').forEach((button) => {
    button.setAttribute("aria-label", isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro");
    button.setAttribute("aria-pressed", isLight ? "true" : "false");
    button.setAttribute("title", isLight ? "Tema claro activo" : "Tema oscuro activo");
    button.innerHTML = renderThemeToggleContent(isLight);
  });
  updateSidebarIconTheme();
}

function updateSidebarIconTheme() {
  document.querySelectorAll("[data-sidebar-icon-key]").forEach((image) => {
    const key = image.dataset.sidebarIconKey;
    const iconUrl = getSidebarIconUrl(key);
    if (iconUrl && image.getAttribute("src") !== iconUrl) {
      image.setAttribute("src", iconUrl);
    }
  });
}

function renderCatalogSection() {
  const filteredProducts = filterProducts(
    getActiveCatalog(true),
    ui.catalogQuery,
    ui.catalogCategory
  );
  const draft = ui.catalogDraft || createCatalogDraft();
  const eligibleRecipeIngredients = getEligibleRecipeIngredients();
  const isDraftManufactured = draft.productKind === "manufactured";
  const recipeCostPreview =
    isDraftManufactured && ui.recipeDraftIngredients.length
      ? (() => {
          let total = 0;
          for (const ingredient of ui.recipeDraftIngredients) {
            const ingredientCost = getRecipeIngredientCost(ingredient, []);
            if (ingredientCost === null) return null;
            total += ingredientCost;
          }
          return total;
        })()
      : null;

  return `
    <section id="catalog-section" class="panel panel-strong">
      <div class="panel-title-row">
        <div>
          <h2>Catálogo y stock</h2>
          <p>Productos, insumos y bebidas elaboradas en un solo lugar.</p>
        </div>
        <span class="chip">${state.catalog.length} productos</span>
      </div>

      <div class="catalog-guide">
        <article class="history-card compact-card">
          <strong>Productos fijos</strong>
          <div class="muted">Botellas, latas o unidades compradas. Cargas stock, costo y venta.</div>
        </article>
        <article class="history-card compact-card">
          <strong>Bebidas elaboradas</strong>
          <div class="muted">Tragos armados. El stock y el costo salen de la receta.</div>
        </article>
        <article class="history-card compact-card">
          <strong>Modo actual</strong>
          <div class="chip-row" style="margin-top: 10px;">
            <span class="chip">${isDraftManufactured ? "Elaborada" : "Fija"}</span>
            <span class="chip">
              ${
                isDraftManufactured
                  ? `${ui.recipeDraftIngredients.length} ingredientes cargados`
                  : "Costo y stock manuales"
              }
            </span>
            <span class="chip">
              ${
                isDraftManufactured
                  ? recipeCostPreview === null
                    ? "Costo por receta pendiente"
                    : `Costo estimado ${formatMoney(recipeCostPreview)}`
                  : "Ideal para botellas, latas o insumos"
              }
            </span>
          </div>
        </article>
      </div>

      <form id="catalog-form">
        <div class="field-grid">
          <label class="field">
            <span>Nombre</span>
            <input type="text" name="name" value="${escapeHtml(draft.name)}" required />
          </label>
          <label class="field">
            <span>Categoria</span>
            <select name="category">
              ${["Sin alcohol", "Cervezas", "Vinos", "Tragos", "Insumos"]
                .map(
                  (category) => `
                    <option value="${escapeHtml(category)}" ${
                      draft.category === category ? "selected" : ""
                    }>${escapeHtml(category)}</option>
                  `
                )
                .join("")}
            </select>
          </label>
          <label class="field">
            <span>Tipo</span>
            <select name="productKind">
              <option value="fixed" ${draft.productKind === "fixed" ? "selected" : ""}>Fija</option>
              <option value="manufactured" ${draft.productKind === "manufactured" ? "selected" : ""}>Elaborada</option>
            </select>
          </label>
          <label class="field">
            <span>Precio de venta</span>
            <input type="number" name="price" min="0" step="1" value="${escapeHtml(draft.price)}" />
          </label>
          <label class="field">
            <span>${isDraftManufactured ? "Costo de referencia" : "Precio de costo"}</span>
            <input
              type="number"
              name="costPrice"
              min="0"
              step="0.01"
              value="${escapeHtml(isDraftManufactured ? "" : draft.costPrice)}"
              placeholder="${
                isDraftManufactured ? "Se calcula automáticamente con la receta" : "0"
              }"
              ${isDraftManufactured ? "disabled" : ""}
            />
          </label>
          <label class="field">
            <span>Stock</span>
            <input
              type="number"
              name="stock"
              min="0"
              step="0.001"
              value="${escapeHtml(isDraftManufactured ? "" : draft.stock)}"
              placeholder="${isDraftManufactured ? "La receta descuenta insumos" : "0"}"
              ${isDraftManufactured ? "disabled" : ""}
            />
          </label>
          <label class="field">
            <span>Umbral de alerta</span>
            <input
              type="number"
              name="lowStockThreshold"
              min="0"
              step="0.001"
              value="${escapeHtml(draft.lowStockThreshold)}"
              placeholder="${
                isDraftManufactured
                  ? "Se controla desde los insumos"
                  : String(MIN_LOW_STOCK_THRESHOLD)
              }"
              ${isDraftManufactured ? "disabled" : ""}
            />
          </label>
        </div>

        <div class="catalog-option-grid">
          <label
            class="catalog-option-card ${draft.trackStock || isDraftManufactured ? "is-on" : "is-off"} ${
              isDraftManufactured ? "is-disabled" : ""
            }"
          >
            <input
              class="catalog-option-checkbox"
              type="checkbox"
              name="trackStock"
              ${draft.trackStock ? "checked" : ""}
              ${isDraftManufactured ? "disabled" : ""}
            />
            <span class="catalog-option-copy">
              <span class="catalog-option-title">${
                isDraftManufactured ? "Descuenta stock por receta" : "Controlar stock"
              }</span>
              <span class="catalog-option-description">${
                isDraftManufactured
                  ? "La bebida elaborada no guarda stock propio: descuenta sus insumos automáticamente."
                  : "Cada venta o consumo descuenta unidades y frena la carga si no hay stock suficiente."
              }</span>
            </span>
            <span class="catalog-option-state">${
              isDraftManufactured ? "Por receta" : draft.trackStock ? "Activo" : "Sin control"
            }</span>
          </label>

          <label class="catalog-option-card ${draft.sellable ? "is-on" : "is-off"}">
            <input
              class="catalog-option-checkbox"
              type="checkbox"
              name="sellable"
              ${draft.sellable ? "checked" : ""}
            />
            <span class="catalog-option-copy">
              <span class="catalog-option-title">Se vende al cliente</span>
              <span class="catalog-option-description">${
                draft.sellable
                  ? "El producto aparece en habitaciones, caja directa y demás flujos de venta."
                  : "Queda como solo insumo: sirve para recetas o control interno, pero no se ofrece al cliente."
              }</span>
            </span>
            <span class="catalog-option-state">${draft.sellable ? "En venta" : "Solo insumo"}</span>
          </label>
        </div>

        <div class="history-card" style="margin-top: 16px;">
          <div class="panel-title-row" style="margin-bottom: 12px;">
            <div>
              <h3>Recetario</h3>
              <p>Solo para bebidas elaboradas. Usa cantidades como <code>0.080</code> o <code>0.250</code>.</p>
            </div>
          </div>
          <div class="field-grid">
            <label class="field">
              <span>Insumo</span>
              <select id="recipe-ingredient-product" ${!isDraftManufactured ? "disabled" : ""}>
                ${eligibleRecipeIngredients
                  .map(
                    (product) => `
                      <option value="${product.id}">
                        ${escapeHtml(product.name)} (${getProductKindLabel(product)})
                      </option>
                    `
                  )
                  .join("")}
              </select>
            </label>
            <label class="field">
              <span>Cantidad por bebida</span>
              <input
                id="recipe-ingredient-quantity"
                type="number"
                min="0.001"
                step="0.001"
                value="0.100"
                ${!isDraftManufactured ? "disabled" : ""}
              />
            </label>
            <div class="field">
              <span>Acción</span>
              <button
                class="ghost-button"
                type="button"
                data-action="add-recipe-ingredient"
                ${!isDraftManufactured || !eligibleRecipeIngredients.length ? "disabled" : ""}
              >
                Agregar ingrediente
              </button>
            </div>
          </div>
          ${
            !isDraftManufactured
              ? `<div class="empty-state" style="margin-top: 14px;">Pasa el producto a tipo elaborada para habilitar la receta.</div>`
              : !eligibleRecipeIngredients.length
                ? `<div class="empty-state" style="margin-top: 14px;">Primero crea al menos un insumo fijo para poder armar recetas.</div>`
                : ui.recipeDraftIngredients.length
              ? `
                <div class="table-wrap" style="margin-top: 14px;">
                  <table>
                    <thead>
                      <tr>
                        <th>Insumo</th>
                        <th>Cantidad</th>
                        <th>Costo estimado</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      ${ui.recipeDraftIngredients
                        .map((ingredient) => {
                          const ingredientProduct = getProductById(ingredient.ingredientProductId);
                          const ingredientCost = getRecipeIngredientCost(ingredient, []);
                          return `
                            <tr>
                              <td>${ingredientProduct ? escapeHtml(ingredientProduct.name) : "Insumo faltante"}</td>
                              <td>${formatRecipeQuantity(ingredient.quantity)}</td>
                              <td>${ingredientCost === null ? "Pendiente" : formatMoney(ingredientCost)}</td>
                              <td>
                                <button
                                  class="ghost-button"
                                  type="button"
                                  data-action="remove-recipe-ingredient"
                                  data-ingredient-product-id="${ingredient.ingredientProductId}"
                                >
                                  Quitar
                                </button>
                              </td>
                            </tr>
                          `;
                        })
                        .join("")}
                    </tbody>
                  </table>
                </div>
              `
              : `<div class="empty-state" style="margin-top: 14px;">Aún no hay ingredientes cargados para esta receta.</div>`
          }
        </div>

        <div class="actions-row" style="margin-top: 14px;">
          <button class="button" type="submit">${
            ui.editingProductId ? "Guardar cambios" : "Crear producto"
          }</button>
          ${
            ui.editingProductId
              ? `<button class="ghost-button" type="button" data-action="cancel-edit-product">Cancelar edicion</button>`
              : ""
          }
        </div>
      </form>

      <div style="margin-top: 24px;">
        <div class="picker-toolbar">
          <input type="search" id="catalog-search" placeholder="Buscar en el catálogo..." value="${escapeHtml(
            ui.catalogQuery
          )}" />
          <div class="chip-row">${renderCategoryChips("catalog", ui.catalogCategory)}</div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Venta</th>
                <th>Costo</th>
                <th>Ganancia</th>
                <th>Margen</th>
                <th>Stock</th>
                <th>Uso</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${filteredProducts
                .map((product) => {
                  const margin = getProductMarginData(product);
                  const isOutOfStock =
                    !product.archived &&
                    product.trackStock &&
                    typeof product.stock === "number" &&
                    product.stock <= 0;
                  const isLowStock =
                    !isOutOfStock &&
                    !product.archived &&
                    product.trackStock &&
                    typeof product.stock === "number" &&
                    product.stock <= getLowStockThreshold(product);
                  const rowClass = [
                    "catalog-row",
                    product.archived ? "is-archived" : "",
                    isOutOfStock ? "is-out-of-stock" : "",
                    isLowStock ? "is-low-stock" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  const stockClass = isOutOfStock
                    ? "stock-value is-zero"
                    : isLowStock
                      ? "stock-value is-low"
                      : "stock-value";
                  const stockText = product.trackStock
                    ? formatRecipeQuantity(fallbackValue(product.stock, 0))
                    : isManufacturedProduct(product)
                      ? "Se descuenta por receta"
                      : "Sin control";
                  const costText =
                    margin.unitCost === null
                      ? isManufacturedProduct(product)
                        ? "Receta pendiente"
                        : formatMoney(product.costPrice)
                      : formatMoney(margin.unitCost);
                  return `
                    <tr class="${rowClass}">
                      <td>
                        ${escapeHtml(product.name)}
                        ${
                          isManufacturedProduct(product)
                            ? `<div class="muted">${product.recipe.length} ingredientes en receta</div>`
                            : ""
                        }
                      </td>
                      <td>${getProductKindLabel(product)}</td>
                      <td>${escapeHtml(product.category)}</td>
                      <td>${product.sellable !== false ? formatMoney(product.price) : "No vendible"}</td>
                      <td>${costText}</td>
                      <td>${margin.unitProfit === null ? "-" : formatMoney(margin.unitProfit)}</td>
                      <td>${margin.marginPercent === null ? "-" : formatPercent(margin.marginPercent)}</td>
                      <td><span class="${stockClass}">${escapeHtml(stockText)}</span></td>
                      <td>${product.sellable !== false ? "Venta" : "Solo insumo"}</td>
                      <td>${product.archived ? "Archivado" : "Activo"}</td>
                      <td>
                        <div class="actions-row">
                          <button class="ghost-button" data-action="edit-product" data-product-id="${product.id}">Editar</button>
                          ${
                            product.archived
                              ? `<button class="ghost-button" data-action="unarchive-product" data-product-id="${product.id}">Reactivar</button>`
                              : `<button class="ghost-button" data-action="archive-product" data-product-id="${product.id}">Archivar</button>`
                          }
                          <button
                            class="ghost-button is-compact is-icon-danger"
                            data-action="delete-product"
                            data-product-id="${product.id}"
                            title="Borrar producto"
                            aria-label="Borrar producto"
                          >
                            &#128465;
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderClosuresSection() {
  const activeDriverCoordinatorGroups = getActiveDriverCoordinatorGroups();
  const driverCoordinatorItems = getDriverCoordinatorOperationalItems();
  const openRooms = getOpenShiftRooms();
  const hasOpenRooms = openRooms.length > 0;
  const closingBlockWarning = buildOpenShiftRoomsWarning("emitir cierres de turno", openRooms);
  const activeRanking = buildRanking([
    state.activeShift.closedRooms.flatMap((room) => room.items),
    state.activeShift.cashierSales,
  ]);
  const paymentBreakdown = getShiftPaymentBreakdown(
    state.activeShift.closedRooms,
    state.activeShift.cashierSales
  );
  const closedRoomsRevenue = getRoomsRevenueTotal(state.activeShift.closedRooms);
  const closedRoomsCost = getRoomsCostTotal(state.activeShift.closedRooms);
  const cashierRevenue = getCollectionTotal(state.activeShift.cashierSales);
  const cashierCost = getCollectionCostTotal(state.activeShift.cashierSales);
  const soldTotal = closedRoomsRevenue + cashierRevenue;
  const estimatedCost = closedRoomsCost + cashierCost;
  const estimatedProfit = soldTotal - estimatedCost;
  const estimatedMargin = soldTotal > 0 ? (estimatedProfit / soldTotal) * 100 : null;

  return `
    <section id="closures-section" class="three-grid">
      <article class="panel">
        <div class="panel-title-row">
          <div>
            <h2>Habitaciones cerradas</h2>
            <p>Quedan registradas en este turno antes del cierre global y se pueden reabrir para corregir errores.</p>
          </div>
        </div>
        <div class="list-stack">
          ${
            state.activeShift.closedRooms.length
              ? state.activeShift.closedRooms
                  .map(
                    (room) => {
                      const courtesyValue = getRoomCourtesyValue(room.items || []);
                      const courtesyItems = (room.items || []).filter((item) => isRoomCourtesyItem(item));
                      return `
                      <div class="history-card">
                        <div class="history-head">
                          <div>
                            <h4>${escapeHtml(room.roomLabel)}</h4>
                            <div class="muted">${formatDateTime(room.closedAt)}</div>
                          </div>
                          <strong>${formatMoney(room.total)}</strong>
                        </div>
                        <div class="chip-row" style="margin-top: 10px;">
                          <span class="${getPaymentMethodChipClass(room.paymentMethod)}">
                            ${getPaymentMethodLabel(room.paymentMethod)}
                          </span>
                          ${
                            courtesyValue > 0
                              ? `<span class="chip is-courtesy">
                                  Regalo ${formatMoney(courtesyValue)}
                                </span>`
                              : ""
                          }
                        </div>
                        ${
                          courtesyItems.length
                            ? `<div class="muted" style="margin-top: 10px;">
                                ${courtesyItems
                                  .map((item) => `${escapeHtml(item.name)} x${item.quantity} bonif.`)
                                  .join(" | ")}
                              </div>`
                            : ""
                        }
                        <div class="actions-row" style="margin-top: 14px;">
                          <button
                            class="ghost-button"
                            data-action="reopen-closed-room"
                            data-closed-room-id="${room.id}"
                          >
                            Reabrir para corregir
                          </button>
                        </div>
                      </div>
                    `;
                    }
                  )
                  .join("")
              : `<div class="empty-state">Todavía no hay habitaciones cerradas.</div>`
          }
        </div>
      </article>

      <article class="panel">
        <div class="panel-title-row">
          <div>
            <h2>Resumen para cierre</h2>
            <p>Equivale al ranking y resumen del PDF histórico.</p>
          </div>
        </div>
        <div class="chip-row" style="margin-bottom: 14px;">
          <span class="chip">Vendido ${formatMoney(soldTotal)}</span>
          <span class="chip">Costo ${formatMoney(estimatedCost)}</span>
          <span class="chip">Utilidad ${formatMoney(estimatedProfit)}</span>
          <span class="chip">
            ${estimatedMargin === null ? "Margen pendiente" : `Margen ${formatPercent(estimatedMargin)}`}
          </span>
          <span class="${getPaymentMethodChipClass("cash")}">
            Efectivo ${formatMoney(paymentBreakdown.cash.total)}
          </span>
          <span class="${getPaymentMethodChipClass("transfer")}">
            Transferencia ${formatMoney(paymentBreakdown.transfer.total)}
          </span>
          ${
            paymentBreakdown.stay.total > 0
              ? `<span class="${getPaymentMethodChipClass("stay")}">
                  Saldo estadía ${formatMoney(paymentBreakdown.stay.total)}
                </span>`
              : ""
          }
          ${
            paymentBreakdown.unknown.total > 0
              ? `<span class="${getPaymentMethodChipClass("unknown")}">
                  Sin definir ${formatMoney(paymentBreakdown.unknown.total)}
                </span>`
              : ""
          }
          <span class="chip">
            Choferes/coordinadores ${formatMoney(getCollectionTotal(driverCoordinatorItems))}
          </span>
          <span class="chip">
            Bonificado ${formatMoney(
              getDriverCoordinatorCourtesyValue(driverCoordinatorItems)
            )}
          </span>
          <span class="chip is-courtesy">
            Regalos habitaciones ${formatMoney(getClosedRoomsCourtesyValue(state.activeShift.closedRooms))}
          </span>
        </div>
        ${
          hasOpenRooms
            ? `
              <div class="warning-note">
                <strong>Cierre bloqueado</strong><br />
                ${escapeHtml(closingBlockWarning)}
              </div>
            `
            : ""
        }
        ${
          activeRanking.length
            ? `<ol class="rank-list">${activeRanking
                .slice(0, 10)
                .map(
                  (entry) =>
                    `<li>${escapeHtml(entry.name)}: ${escapeHtml(String(entry.quantity))}</li>`
                )
                .join("")}</ol>`
            : `<div class="empty-state">Todavía no hay productos vendidos en este turno.</div>`
        }
        <div style="margin-top: 18px;">
          <div class="panel-title-row" style="margin-bottom: 12px;">
            <div>
              <h3>Choferes y coordinadores</h3>
              <p>Detalle por persona. Lo bonificado no entra en caja y el resto queda pendiente de cobro.</p>
            </div>
          </div>
          ${renderDriverCoordinatorBreakdown(
            driverCoordinatorItems,
          "Todavía no hay consumos cargados para choferes o coordinadores en este turno."
          )}
        </div>
        <div style="margin-top: 18px;">
          <div class="panel-title-row" style="margin-bottom: 12px;">
            <div>
              <h3>Consumos del personal</h3>
              <p>Detalle por integrante, cobrado a costo.</p>
            </div>
          </div>
          ${renderStaffConsumptionBreakdown(
            state.activeShift.staffConsumption,
          "Todavía no hay consumos del personal en este turno."
          )}
        </div>
        <div class="actions-row" style="margin-top: 18px;">
          <button
            class="button"
            data-action="print-shift-summary"
            ${hasOpenRooms ? "disabled" : ""}
            title="${hasOpenRooms ? escapeHtml(closingBlockWarning) : "Emitir ticket de turno"}"
          >
            Emitir ticket de turno
          </button>
          <button
            class="ghost-button"
            data-action="open-manager-report"
            ${hasOpenRooms ? "disabled" : ""}
            title="${hasOpenRooms ? escapeHtml(closingBlockWarning) : "Emitir informe gerencial"}"
          >
            Informe gerencial
          </button>
          <button
            class="ghost-button"
            data-action="close-shift"
            ${hasOpenRooms ? "disabled" : ""}
            title="${hasOpenRooms ? escapeHtml(closingBlockWarning) : "Cerrar turno global"}"
          >
            Cerrar turno global
          </button>
        </div>
      </article>

      <article class="panel">
        <div class="panel-title-row">
          <div>
            <h2>Grupos pendientes de cierre</h2>
            <p>Desde aquí se imprimen tickets, se revisa el acumulado y se cierra cada grupo cuando termina su viaje.</p>
          </div>
          <span class="chip">${activeDriverCoordinatorGroups.length} activos</span>
        </div>
        ${renderDriverCoordinatorClosureCards()}
      </article>
    </section>
  `;
}

function renderShiftHistory() {
  return `
    <section class="panel">
      <div class="panel-title-row">
        <div>
          <h2>Histórico de turnos</h2>
          <p>Cada cierre global crea un registro nuevo. No se sobreescribe.</p>
        </div>
        <span class="chip">${state.shiftHistory.length} cierres</span>
      </div>
      <div class="list-stack">
        ${
          state.shiftHistory.length
            ? state.shiftHistory
                .slice(0, 8)
                .map((shift) => {
                  const paymentBreakdown = getShiftPaymentBreakdown(
                    shift.closedRooms,
                    shift.cashierSales
                  );
                  return `
                    <article class="history-card">
                      <div class="history-head">
                        <div>
                          <h4>${escapeHtml(shift.serviceLabel)}</h4>
                          <div class="muted">${formatDateTime(shift.closedAt)}</div>
                        </div>
                        <strong>${formatMoney(shift.totals.sold)}</strong>
                      </div>
                      <div class="chip-row" style="margin-top: 10px;">
                        <span class="chip">${shift.closedRooms.length} habitaciones</span>
                        <span class="chip">${getItemsUnits(shift.cashierSales)} caja directa</span>
                        <span class="chip">${getItemsUnits(shift.staffConsumption)} personal</span>
                        <span class="chip">${getItemsUnits(shift.driverCoordinatorConsumption || [])} choferes/coordinadores</span>
                        <span class="chip">
                          Personal a costo ${formatMoney(fallbackValue(shift.totals.staffValue, 0))}
                        </span>
                        <span class="chip">
                          Choferes/coordinadores ${formatMoney(
                            fallbackValue(shift.totals.driverCoordinatorValue, 0)
                          )}
                        </span>
                        <span class="chip is-courtesy">
                          Regalos habitaciones ${formatMoney(
                            fallbackValue(shift.totals.roomCourtesyValue, 0)
                          )}
                        </span>
                        <span class="chip">
                          Bonificado ${formatMoney(
                            fallbackValue(shift.totals.driverCoordinatorCourtesyValue, 0)
                          )}
                        </span>
                        <span class="chip">
                          Utilidad ${formatMoney(fallbackValue(shift.totals.profit, 0))}
                        </span>
                        <span class="chip">
                          Margen ${formatPercent(fallbackValue(shift.totals.marginPercent, 0))}
                        </span>
                        <span class="${getPaymentMethodChipClass("cash")}">
                          Efectivo ${formatMoney(paymentBreakdown.cash.total)}
                        </span>
                        <span class="${getPaymentMethodChipClass("transfer")}">
                          Transferencia ${formatMoney(paymentBreakdown.transfer.total)}
                        </span>
                        ${
                          paymentBreakdown.stay.total > 0
                            ? `<span class="${getPaymentMethodChipClass("stay")}">
                                Saldo estadía ${formatMoney(paymentBreakdown.stay.total)}
                              </span>`
                            : ""
                        }
                        ${
                          paymentBreakdown.unknown.total > 0
                            ? `<span class="${getPaymentMethodChipClass("unknown")}">
                                Sin definir ${formatMoney(paymentBreakdown.unknown.total)}
                              </span>`
                            : ""
                        }
                      </div>
                      ${
                        shift.staffConsumption.length
                          ? `<div class="muted" style="margin-top: 10px;">
                              ${buildStaffConsumptionBreakdown(shift.staffConsumption)
                                .map(
                                  (entry) =>
                                    `${escapeHtml(entry.name)}: ${entry.products
                                      .map((product) => `${escapeHtml(product.name)} x${product.quantity}`)
                                      .join(", ")}`
                                )
                                .join(" | ")}
                            </div>`
                          : ""
                      }
                      ${
                        shift.driverCoordinatorConsumption &&
                        shift.driverCoordinatorConsumption.length
                          ? `<div class="muted" style="margin-top: 10px;">
                              ${buildDriverCoordinatorBreakdown(shift.driverCoordinatorConsumption)
                                .map(
                                  (entry) =>
                                    `${escapeHtml(entry.name)}: ${entry.products
                                      .map((product) => {
                                        const detailParts = [];
                                        if (product.courtesyQuantity > 0) {
                                          detailParts.push(`${product.courtesyQuantity} bonif.`);
                                        }
                                        if (product.discountedQuantity > 0) {
                                          detailParts.push(`${product.discountedQuantity} c/30%`);
                                        }
                                        return `${escapeHtml(product.name)} x${product.quantity}${
                                          detailParts.length ? ` (${detailParts.join(" + ")})` : ""
                                        }`;
                                      })
                                      .join(", ")}`
                                )
                                .join(" | ")}
                            </div>`
                          : ""
                      }
                    </article>
                  `;
                })
                .join("")
            : `<div class="empty-state">Aún no se cerró ningún turno global desde esta app.</div>`
        }
      </div>
    </section>
  `;
}

function renderPaymentMethodModal() {
  const request = ui.pendingPaymentRequest;
  if (!request) {
    return "";
  }

  if (request.kind === "room-close-unprinted-warning") {
    const room = getRoomById(request.roomId);
    if (!room || room.items.length === 0) {
      return "";
    }

    return `
      <div class="modal-backdrop">
        <button
          class="modal-dismiss-layer"
          type="button"
          aria-label="Cerrar advertencia"
          data-action="cancel-payment-method"
        ></button>
        <div class="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
          <div class="panel-title-row" style="margin-bottom: 14px;">
            <div>
              <h2 id="payment-modal-title">Ticket pendiente</h2>
              <p>
                ${escapeHtml(room.label)} todavía no tiene ticket impreso. Puedes cerrar igual,
                pero conviene imprimirlo antes para evitar confusiones operativas.
              </p>
            </div>
          </div>
          <div class="history-card compact-card">
            <div class="between">
              <div>
                <strong>${escapeHtml(room.label)}</strong>
              </div>
              <strong>${formatMoney(getRoomTotal(room))}</strong>
            </div>
            <div class="muted" style="margin-top: 10px;">
              ${getItemsUnits(room.items)} items cargados
            </div>
          </div>
          <div class="warning-note" style="margin-top: 16px;">
            Si continúas, igualmente podrás elegir la forma de pago y cerrar la habitación.
          </div>
          <div class="actions-row" style="margin-top: 18px;">
            <button class="ghost-button" data-action="cancel-payment-method">
              Volver
            </button>
            <button class="button" data-action="continue-room-close-without-ticket" data-room-id="${room.id}">
              Continuar igual
            </button>
          </div>
        </div>
      </div>
    `;
  }

  let title = "";
  let copy = "";
  let summaryHtml = "";
  let choicesHtml = "";

  if (request.kind === "room-close") {
    const room = getRoomById(request.roomId);
    if (!room || room.items.length === 0) {
      return "";
    }

    title = `Cerrar ${room.label}`;
    copy = "Selecciona cómo abonó el cliente para registrar el cierre.";
    summaryHtml = `
      <div class="history-card compact-card">
        <div class="between">
          <div>
            <strong>${escapeHtml(room.label)}</strong>
          </div>
          <strong>${formatMoney(getRoomTotal(room))}</strong>
        </div>
        <div class="muted" style="margin-top: 10px;">
          ${getItemsUnits(room.items)} items cargados
        </div>
      </div>
    `;
    choicesHtml = `
      <button
        class="payment-choice is-cash"
        data-action="select-payment-method"
        data-payment-method="cash"
      >
        <span class="payment-choice-title">Efectivo</span>
        <span class="payment-choice-copy">Va a caja física</span>
      </button>
      <button
        class="payment-choice is-transfer"
        data-action="select-payment-method"
        data-payment-method="transfer"
      >
        <span class="payment-choice-title">Transferencia</span>
        <span class="payment-choice-copy">Va a caja virtual</span>
      </button>
      <button
        class="payment-choice is-stay"
        data-action="select-payment-method"
        data-payment-method="stay"
      >
        <span class="payment-choice-title">Abona al final</span>
        <span class="payment-choice-copy">Queda como saldo de estadía para Check-out</span>
      </button>
    `;
  }

  if (request.kind === "cashier-add") {
    const product = getProductById(request.productId);
    if (!product) {
      return "";
    }

    title = "Caja directa";
    copy = "Selecciona cómo abonó el cliente para registrar esta venta inmediata.";
    summaryHtml = `
      <div class="history-card compact-card">
        <div class="between">
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <div class="muted">${escapeHtml(product.category)}</div>
          </div>
          <strong>${formatMoney(product.price)}</strong>
        </div>
        <div class="muted" style="margin-top: 10px;">
          Se agregará 1 unidad a caja directa
        </div>
      </div>
    `;
    choicesHtml = `
      <button
        class="payment-choice is-cash"
        data-action="select-payment-method"
        data-payment-method="cash"
      >
        <span class="payment-choice-title">Efectivo</span>
        <span class="payment-choice-copy">Va a caja física</span>
      </button>
      <button
        class="payment-choice is-transfer"
        data-action="select-payment-method"
        data-payment-method="transfer"
      >
        <span class="payment-choice-title">Transferencia</span>
        <span class="payment-choice-copy">Va a caja virtual</span>
      </button>
    `;
  }

  if (request.kind === "staff-add") {
    const product = getProductById(request.productId);
    const activeStaffMembers = getActiveStaffMembers();
    if (!product || !activeStaffMembers.length) {
      return "";
    }

    const unitCost = getEstimatedUnitCost(product);
    title = "Consumo del personal";
    copy = "Selecciona quién está consumiendo este producto para asignarlo al integrante correcto.";
    summaryHtml = `
      <div class="history-card compact-card">
        <div class="between">
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <div class="muted">${escapeHtml(product.category)}</div>
          </div>
          <strong>${unitCost === null ? "Costo pendiente" : formatMoney(unitCost)}</strong>
        </div>
        <div class="muted" style="margin-top: 10px;">
          Se agregara 1 unidad al consumo del personal
        </div>
      </div>
    `;
    choicesHtml = activeStaffMembers
      .map(
        (member) => `
          <button
            class="payment-choice is-staff-member"
            data-action="select-staff-member"
            data-staff-member-id="${member.id}"
          >
            <span class="payment-choice-title">${escapeHtml(member.name)}</span>
            <span class="payment-choice-copy">Se cargara a su cuenta interna</span>
          </button>
        `
      )
      .join("");
  }

  if (request.kind === "driver-coordinator-add") {
    const product = getProductById(request.productId);
    const selectedGroup = getSelectedDriverCoordinatorGroup();
    const activeMembers = selectedGroup
      ? getDriverCoordinatorMembersForGroup(selectedGroup.id)
      : [];
    if (!product || !selectedGroup || !activeMembers.length) {
      return "";
    }

    title = "Choferes y coordinadores";
    copy = `Selecciona quién está consumiendo este producto para cargarlo en la cuenta diferida de ${selectedGroup.name}.`;
    summaryHtml = `
      <div class="history-card compact-card">
        <div class="between">
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <div class="muted">${escapeHtml(product.category)}</div>
          </div>
          <strong>${formatMoney(getDriverCoordinatorDiscountedUnitPrice(product.price))}</strong>
        </div>
        <div class="muted" style="margin-top: 10px;">
          ${
            isDriverCoordinatorFreeEligibleItem(product)
              ? "Si todavía no usó su bebida bonificada en esta comida, la app la tomará automáticamente."
              : "Se agregará 1 unidad con 30% de descuento y quedará pendiente de cobro."
          }
        </div>
        <div class="muted" style="margin-top: 6px;">
          Grupo activo: ${escapeHtml(selectedGroup.name)}
        </div>
      </div>
    `;
    choicesHtml = activeMembers
      .map(
        (member) => `
          <button
            class="payment-choice is-staff-member"
            data-action="select-driver-coordinator-member"
            data-driver-coordinator-member-id="${member.id}"
          >
            <span class="payment-choice-title">${escapeHtml(member.name)}</span>
            <span class="payment-choice-copy">Se cargará a ${escapeHtml(selectedGroup.name)}</span>
          </button>
        `
      )
      .join("");
  }

  if (!title || !choicesHtml) {
    return "";
  }

  if (request.kind === "staff-add" || request.kind === "driver-coordinator-add") {
    return `
      <div class="modal-backdrop">
        <button
          class="modal-dismiss-layer"
          type="button"
          aria-label="Cerrar seleccion"
          data-action="cancel-payment-method"
        ></button>
        <div class="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
          <div class="panel-title-row" style="margin-bottom: 14px;">
            <div>
              <h2 id="payment-modal-title">${escapeHtml(title)}</h2>
              <p>${escapeHtml(copy)}</p>
            </div>
          </div>
          ${summaryHtml}
          <div class="payment-choice-grid">
            ${choicesHtml}
          </div>
          <div class="actions-row" style="margin-top: 18px;">
            <button class="ghost-button" data-action="cancel-payment-method">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="modal-backdrop">
      <button
        class="modal-dismiss-layer"
        type="button"
        aria-label="Cerrar seleccion"
        data-action="cancel-payment-method"
      ></button>
      <div class="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
        <div class="panel-title-row" style="margin-bottom: 14px;">
          <div>
            <h2 id="payment-modal-title">${escapeHtml(title)}</h2>
            <p>${escapeHtml(copy)}</p>
          </div>
        </div>
        ${summaryHtml}
        <div class="payment-choice-grid">
          ${choicesHtml}
        </div>
        <div class="actions-row" style="margin-top: 18px;">
          <button class="ghost-button" data-action="cancel-payment-method">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderEmptyRoomWarningModal() {
  const room = getRoomById(ui.pendingEmptyRoomWarningId);
  if (!room) return "";
  const roomNumber = roomNumberFromLabel(room.label);
  return `
    <div class="modal-backdrop">
      <button
        class="modal-dismiss-layer"
        type="button"
        data-action="cancel-empty-room-selection"
        aria-label="Cancelar selecci&oacute;n"
      ></button>
      <div class="payment-modal empty-room-modal" role="dialog" aria-modal="true" aria-labelledby="empty-room-modal-title">
        <div class="panel-title-row" style="margin-bottom: 14px;">
          <div>
            <p class="stat-label">Habitaci&oacute;n ${escapeHtml(roomNumber)}</p>
            <h2 id="empty-room-modal-title">Habitaci&oacute;n vac&iacute;a</h2>
            <p class="muted">Est&aacute;s seleccionando una habitaci&oacute;n vac&iacute;a. &iquest;Quer&eacute;s continuar?</p>
          </div>
        </div>
        <div class="warning-note">
          No figura activa hoy en Check-in. Pod&eacute;s seguir comandando igual, pero el consumo no quedar&aacute; asociado a un hu&eacute;sped detectado.
        </div>
        <div class="actions-row">
          <button class="ghost-button" type="button" data-action="cancel-empty-room-selection">Cancelar</button>
          <button class="button is-orange" type="button" data-action="confirm-empty-room-selection" data-room-id="${room.id}">Continuar</button>
        </div>
      </div>
    </div>
  `;
}

function renderDriverCoordinatorGroupEditorModal() {
  const editor = ui.driverCoordinatorGroupEditor;
  if (!editor) {
    return "";
  }

  const isEdit = editor.mode === "edit";
  const group = isEdit ? getDriverCoordinatorGroupById(editor.groupId) : null;
  if (isEdit && !group) {
    return "";
  }

  const activeMembers = group ? getDriverCoordinatorMembersForGroup(group.id) : [];
  const initialMembers = activeMembers.map((member) => member.name).join("\n");

  return `
    <div class="modal-backdrop">
      <button
        class="modal-dismiss-layer"
        type="button"
        aria-label="Cerrar editor de grupo"
        data-action="cancel-driver-coordinator-group-editor"
      ></button>
      <div class="payment-modal group-editor-modal" role="dialog" aria-modal="true" aria-labelledby="group-editor-modal-title">
        <form id="driver-coordinator-group-editor-form">
          <input type="hidden" name="mode" value="${isEdit ? "edit" : "create"}" />
          <input type="hidden" name="groupId" value="${group ? group.id : ""}" />
          <div class="panel-title-row" style="margin-bottom: 14px;">
            <div>
              <h2 id="group-editor-modal-title">${isEdit ? "Editar grupo" : "Cargar grupo"}</h2>
              <p>${
                isEdit
                  ? "Aquí puedes agregar, corregir o quitar integrantes. El nombre del grupo queda fijo para no mezclar turnos futuros."
                  : "Carga el nombre del grupo y sus choferes/coordinadores. Puedes dejar integrantes vacíos y completarlos después."
              }</p>
            </div>
          </div>
          <div class="field-grid group-editor-form-grid">
            <label class="field">
              <span>${isEdit ? "Grupo" : "Nombre del grupo"}</span>
              <input
                type="text"
                name="driverCoordinatorGroupName"
                value="${group ? escapeHtml(group.name) : ""}"
                placeholder="Ejemplo: Grupo Córdoba"
                autocomplete="off"
                ${isEdit ? "readonly" : "required"}
              />
            </label>
            <label class="field field-span-2">
              <span>Choferes y coordinadores</span>
              <textarea
                name="driverCoordinatorGroupMembers"
                rows="8"
                placeholder="Uno por línea. Ejemplo:&#10;Abi&#10;Franco&#10;Coordinadora Marta"
              >${escapeHtml(initialMembers)}</textarea>
            </label>
          </div>
          ${
            isEdit
              ? `
                <div class="group-editor-note">
                  Quitar un nombre lo saca del selector del grupo. Si luego lo vuelves a escribir, la app lo reactiva.
                </div>
              `
              : ""
          }
          <div class="actions-row" style="margin-top: 18px;">
            <button class="ghost-button" type="button" data-action="cancel-driver-coordinator-group-editor">
              Cancelar
            </button>
            <button class="button" type="submit">
              ${isEdit ? "Guardar cambios" : "Guardar grupo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function postCatalogFrameHeight() {
  if (!CATALOG_ONLY_VIEW || !window.parent || window.parent === window) {
    return;
  }

  const shell = document.querySelector(".catalog-only-shell");
  const height = Math.max(
    document.documentElement ? document.documentElement.scrollHeight : 0,
    document.body ? document.body.scrollHeight : 0,
    shell ? shell.scrollHeight : 0
  );

  try {
    window.parent.postMessage(
      {
        type: "solanas:beverage-catalog-height",
        height,
        emittedAt: new Date().toISOString(),
      },
      "*"
    );
  } catch (error) {
    console.error("No se pudo ajustar la altura del catálogo embebido.", error);
  }
}

function postSystemEmbeddedHeight() {
  if (!SYSTEM_EMBEDDED || !window.parent || window.parent === window) {
    return;
  }

  window.requestAnimationFrame(() => {
    const appRoot = document.getElementById("app");
    const height = Math.max(
      document.documentElement ? document.documentElement.scrollHeight : 0,
      document.body ? document.body.scrollHeight : 0,
      appRoot ? appRoot.scrollHeight : 0
    );
    window.parent.postMessage(
      {
        type: "solanas:embedded-module-height",
        module: "bebidas",
        height,
        emittedAt: new Date().toISOString(),
      },
      "*"
    );
  });
}

function render(options = {}) {
  const {
    preserveScroll = false,
    focusId = null,
    selectionStart = null,
    selectionEnd = null,
    skipModuleMainScrollRestore = false,
  } = options;
  const root = document.querySelector("#app");
  const scrollX = preserveScroll ? window.scrollX : 0;
  const scrollY = preserveScroll ? window.scrollY : 0;
  const moduleMainScrollTop = preserveScroll
    ? document.querySelector(".module-main-scroll")?.scrollTop || 0
    : 0;
  applyThemePreference(ui.theme);
  const catalogOnlyMarkup = `
    <main class="app-shell catalog-only-shell">
      ${renderCatalogSection()}
      <div class="footer-note">
        <div class="footer-note-copy">
          Este cat&aacute;logo est&aacute; embebido en Stock e Inventario y modifica el mismo stock real de la Estaci&oacute;n de bebidas.
          <div class="footer-note-actions">
            <button class="ghost-button is-compact" data-action="download-stock-pdf">
              Descargar stock actual (PDF)
            </button>
          </div>
        </div>
      </div>
    </main>
  `;
  const mainMarkup = `
    <main class="app-shell">
      ${renderHero()}
      ${renderSummaryCards()}
      <section id="rooms-section" class="content-grid">
        <div class="panel">
          <div class="panel-title-row">
            <div>
              <h2>Habitaciones</h2>
              <p>El layout queda fijo para reducir errores operativos.</p>
            </div>
          </div>
          <div class="room-grid">${renderRoomGrid()}</div>
        </div>
        ${renderSidePanel()}
      </section>
      ${renderRoomDetail()}
      ${renderCashierSection()}
      ${renderStaffSection()}
      ${renderClosuresSection()}
      ${renderShiftHistory()}
      <div class="footer-note">
        <div class="footer-note-copy">
          La app registra comandas, caja directa y cierres de turno. El stock se administra desde Stock e Inventario.
          <div class="footer-note-actions">
            <a class="ghost-button is-compact" href="../../index.html#inventario" target="_parent">
              Abrir Stock e Inventario
            </a>
          </div>
        </div>
        <div class="footer-note-signature">
          <span class="footer-note-kicker">Diseño y desarrollo del sistema</span>
          <strong>Germán F. Gamón Lozano</strong>
          <span>Contacto: german.lozano45@gmail.com</span>
          <span>WhatsApp: 3516692361</span>
        </div>
      </div>
    </main>
  `;

  root.innerHTML = CATALOG_ONLY_VIEW
    ? `
      ${catalogOnlyMarkup}
      ${renderPaymentMethodModal()}
      ${renderEmptyRoomWarningModal()}
      ${renderDriverCoordinatorGroupEditorModal()}
    `
    : `
      ${renderFloatingModuleNav()}
      ${
        SHELL_LAYOUT
          ? `
            <div class="module-layout ${ui.sidebarCollapsed ? "is-sidebar-collapsed" : ""}">
              ${renderShellSidebar()}
              <div class="module-main">
                <div class="module-main-scroll">
                  ${mainMarkup}
                </div>
              </div>
            </div>
          `
          : mainMarkup
      }
      ${renderPaymentMethodModal()}
      ${renderEmptyRoomWarningModal()}
      ${renderDriverCoordinatorGroupEditorModal()}
      ${!SYSTEM_EMBEDDED && !CATALOG_ONLY_VIEW ? renderThemeToggleButton("theme-toggle-floating") : ""}
    `;

  document.body.classList.toggle("has-shell-layout", SYSTEM_CHROME || CATALOG_ONLY_VIEW);
  document.body.classList.toggle("is-system-embedded", SYSTEM_EMBEDDED);
  document.body.classList.toggle("is-catalog-only-view", CATALOG_ONLY_VIEW);

  if (focusId) {
    const nextFocused = document.getElementById(focusId);
    if (nextFocused) {
      try {
        nextFocused.focus({ preventScroll: true });
      } catch (error) {
        nextFocused.focus();
      }

      if (
        typeof selectionStart === "number" &&
        typeof nextFocused.setSelectionRange === "function"
      ) {
        const nextSelectionEnd =
          typeof selectionEnd === "number" ? selectionEnd : selectionStart;
        nextFocused.setSelectionRange(selectionStart, nextSelectionEnd);
      }
    }
  }

  if (preserveScroll) {
    window.scrollTo(scrollX, scrollY);
    const nextModuleMain = document.querySelector(".module-main-scroll");
    if (nextModuleMain && !skipModuleMainScrollRestore) {
      nextModuleMain.scrollTop = moduleMainScrollTop;
      window.requestAnimationFrame(() => {
        nextModuleMain.scrollTop = moduleMainScrollTop;
      });
    }
  }

  if (!CATALOG_ONLY_VIEW) {
    setupFloatingModuleNav();
  }
  if (CATALOG_ONLY_VIEW) {
    postCatalogFrameHeight();
    window.requestAnimationFrame(postCatalogFrameHeight);
    window.setTimeout(postCatalogFrameHeight, 120);
  }
  postSystemEmbeddedHeight();
  window.requestAnimationFrame(postSystemEmbeddedHeight);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const { action } = target.dataset;

  if (action === "toggle-sidebar") {
    ui.sidebarCollapsed = !ui.sidebarCollapsed;
    persistSidebarPreference();
    render({ preserveScroll: true });
    return;
  }

  if (action === "toggle-theme") {
    ui.theme = ui.theme === "light" ? "dark" : "light";
    persistThemePreference();
    applyThemePreference(ui.theme);
    updateThemeToggleControls();
    return;
  }

  if (action === "open-unified-system-menu") {
    openUnifiedSystemMenuFromEmbeddedApp(event);
    return;
  }

  if (action === "return-unified-menu") {
    returnToUnifiedMenuFromEmbeddedApp(event);
    return;
  }

  if (action === "select-room") {
    selectRoom(target.dataset.roomId);
    return;
  }

  if (action === "confirm-empty-room-selection") {
    selectRoom(target.dataset.roomId, { force: true });
    return;
  }

  if (action === "cancel-empty-room-selection") {
    ui.pendingEmptyRoomWarningId = "";
    render({ preserveScroll: true });
    return;
  }

  if (action === "set-category") {
    const { scope, category } = target.dataset;
    if (scope === "room") ui.roomCategory = category;
    if (scope === "cashier") ui.cashierCategory = category;
    if (scope === "staff") ui.staffCategory = category;
    if (scope === "driver-coordinator") ui.driverCoordinatorCategory = category;
    if (scope === "catalog") ui.catalogCategory = category;
    render({ preserveScroll: true });
    return;
  }

  if (action === "add-product") {
    const { scope, productId } = target.dataset;
    if (scope === "cashier") {
      openPaymentMethodModal({
        kind: "cashier-add",
        productId,
      });
      return;
    }
    if (scope === "staff") {
      if (!getActiveStaffMembers().length) {
        alert("Primero carga al menos una persona del equipo.");
        return;
      }
      const product = getProductById(productId);
      if (!product || getEstimatedUnitCost(product) === null) {
        alert("Define el costo del producto antes de cargarlo al personal.");
        return;
      }
      openPaymentMethodModal({
        kind: "staff-add",
        productId,
      });
      return;
    }
    if (scope === "driver-coordinator") {
      const selectedGroup = getSelectedDriverCoordinatorGroup();
      if (!selectedGroup) {
        alert("Primero carga o selecciona un grupo.");
        return;
      }
      if (!getDriverCoordinatorMembersForGroup(selectedGroup.id).length) {
        alert("Primero carga al menos una persona dentro de ese grupo.");
        return;
      }
      openPaymentMethodModal({
        kind: "driver-coordinator-add",
        productId,
      });
      return;
    }
    const items = getScopeItems(scope);
    if (!items) return;
    const addOptions = {
      priceMode: scope === "staff" ? "cost" : "sale",
    };
    const product = getProductById(productId);
    const scopedRoom = scope.startsWith("room:") ? getRoomById(scope.slice(5)) : null;
    const driverCoordinatorRoomOptions = scopedRoom
      ? getDriverCoordinatorRoomAddOptions(scopedRoom, product)
      : null;
    if (scope.startsWith("room:")) {
      if (driverCoordinatorRoomOptions) {
        Object.assign(addOptions, driverCoordinatorRoomOptions);
      } else {
        addOptions.pricingRule = "sale";
      }
    }
    const result = addProductToItems(items, productId, 1, addOptions);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    if (scopedRoom && driverCoordinatorRoomOptions) {
      rebalanceDriverCoordinatorRoomItems(scopedRoom.id);
    }
    persistState(
      driverCoordinatorRoomOptions
        ? `Agregar choferes/coordinadores ${product ? product.name : ""}`
        : `Agregar producto ${product ? product.name : ""}`
    );
    render({ preserveScroll: true });
    return;
  }

  if (action === "change-item") {
    const {
      scope,
      productId,
      delta,
      paymentMethod,
      staffMemberId,
      driverCoordinatorMemberId,
      pricingRule,
    } = target.dataset;
    if (scope === "driver-coordinator") {
      const result = changeDriverCoordinatorItemQuantity(
        productId,
        driverCoordinatorMemberId,
        pricingRule,
        Number(delta)
      );
      if (!result.ok) {
        alert(result.message);
        return;
      }
      const product = getProductById(productId);
      persistState(`Ajustar choferes/coordinadores ${product ? product.name : ""}`);
      render({ preserveScroll: true });
      return;
    }
    const items = getScopeItems(scope);
    if (!items) return;
    const scopedRoom = scope.startsWith("room:") ? getRoomById(scope.slice(5)) : null;
    const isDriverCoordinatorRoom = Boolean(getDriverCoordinatorRoomContext(scopedRoom));
    const result = changeItemQuantity(items, productId, Number(delta), {
      paymentMethod,
      staffMemberId,
      driverCoordinatorMemberId,
      pricingRule,
    });
    if (!result.ok) {
      alert(result.message);
      return;
    }
    if (isDriverCoordinatorRoom && scopedRoom) {
      rebalanceDriverCoordinatorRoomItems(scopedRoom.id);
    }
    const product = getProductById(productId);
    persistState(
      isDriverCoordinatorRoom
        ? `Ajustar choferes/coordinadores ${product ? product.name : ""}`
        : `Ajustar item ${product ? product.name : ""}`
    );
    render({ preserveScroll: true });
    return;
  }

  if (action === "remove-item") {
    const { scope, productId, paymentMethod, staffMemberId, driverCoordinatorMemberId, pricingRule } =
      target.dataset;
    if (scope === "driver-coordinator") {
      removeDriverCoordinatorItem(productId, driverCoordinatorMemberId, pricingRule);
      const product = getProductById(productId);
      persistState(`Quitar choferes/coordinadores ${product ? product.name : ""}`);
      render({ preserveScroll: true });
      return;
    }
    const items = getScopeItems(scope);
    if (!items) return;
    const scopedRoom = scope.startsWith("room:") ? getRoomById(scope.slice(5)) : null;
    const isDriverCoordinatorRoom = Boolean(getDriverCoordinatorRoomContext(scopedRoom));
    removeItem(items, productId, {
      paymentMethod,
      staffMemberId,
      driverCoordinatorMemberId,
      pricingRule,
    });
    if (isDriverCoordinatorRoom && scopedRoom) {
      rebalanceDriverCoordinatorRoomItems(scopedRoom.id);
    }
    const product = getProductById(productId);
    persistState(
      isDriverCoordinatorRoom
        ? `Quitar choferes/coordinadores ${product ? product.name : ""}`
        : `Quitar item ${product ? product.name : ""}`
    );
    render({ preserveScroll: true });
    return;
  }

  if (action === "mark-room-item-courtesy") {
    const { roomId, productId } = target.dataset;
    const result = moveRoomItemPricing(roomId, productId, "sale", "room-courtesy");
    if (!result.ok) {
      alert(result.message);
      return;
    }
    const room = getRoomById(roomId);
    const product = getProductById(productId);
    persistState(`Bonificar ${product ? product.name : "ítem"} en ${room ? room.label : "habitación"}`);
    render({ preserveScroll: true });
    return;
  }

  if (action === "restore-room-item-charge") {
    const { roomId, productId } = target.dataset;
    const result = moveRoomItemPricing(roomId, productId, "room-courtesy", "sale");
    if (!result.ok) {
      alert(result.message);
      return;
    }
    const room = getRoomById(roomId);
    const product = getProductById(productId);
    persistState(`Volver a cobrar ${product ? product.name : "ítem"} en ${room ? room.label : "habitación"}`);
    render({ preserveScroll: true });
    return;
  }

  if (action === "print-room-ticket") {
    printRoomTicket(target.dataset.roomId);
    return;
  }

  if (action === "close-room") {
    closeRoom(target.dataset.roomId);
    return;
  }

  if (action === "continue-room-close-without-ticket") {
    openPaymentMethodModal({
      kind: "room-close",
      roomId: target.dataset.roomId,
    });
    return;
  }

  if (action === "cancel-room") {
    cancelRoom(target.dataset.roomId);
    return;
  }

  if (action === "reopen-closed-room") {
    reopenClosedRoom(target.dataset.closedRoomId);
    return;
  }

  if (action === "select-payment-method") {
    const request = ui.pendingPaymentRequest;
    if (!request) return;
    if (request.kind === "room-close") {
      finalizeRoomClose(request.roomId, target.dataset.paymentMethod);
      return;
    }
    if (request.kind === "cashier-add") {
      finalizeCashierAdd(request.productId, target.dataset.paymentMethod);
    }
    return;
  }

  if (action === "select-staff-member") {
    const request = ui.pendingPaymentRequest;
    if (!request || request.kind !== "staff-add") return;
    finalizeStaffAdd(request.productId, target.dataset.staffMemberId);
    return;
  }

  if (action === "select-driver-coordinator-member") {
    const request = ui.pendingPaymentRequest;
    if (!request || request.kind !== "driver-coordinator-add") return;
    finalizeDriverCoordinatorAdd(request.productId, target.dataset.driverCoordinatorMemberId);
    return;
  }

  if (action === "cancel-payment-method") {
    closePaymentMethodModal();
    return;
  }

  if (action === "open-driver-coordinator-group-create") {
    openDriverCoordinatorGroupEditor("create");
    return;
  }

  if (action === "open-driver-coordinator-group-edit") {
    openDriverCoordinatorGroupEditor("edit", target.dataset.driverCoordinatorGroupId);
    return;
  }

  if (action === "cancel-driver-coordinator-group-editor") {
    closeDriverCoordinatorGroupEditor();
    return;
  }

  if (action === "close-shift") {
    closeShift();
    return;
  }

  if (action === "print-shift-summary") {
    printShiftSummary();
    return;
  }

  if (action === "open-driver-coordinator-group-report") {
    openDriverCoordinatorGroupReport(target.dataset.driverCoordinatorGroupId);
    return;
  }

  if (action === "print-driver-coordinator-turn-ticket") {
    printDriverCoordinatorTurnTicket(target.dataset.driverCoordinatorGroupId);
    return;
  }

  if (action === "print-driver-coordinator-group-ticket") {
    printDriverCoordinatorGroupTicket(target.dataset.driverCoordinatorGroupId);
    return;
  }

  if (action === "close-driver-coordinator-group") {
    closeDriverCoordinatorGroup(target.dataset.driverCoordinatorGroupId);
    return;
  }

  if (action === "open-manager-report") {
    openManagerReport();
    return;
  }

  if (action === "export-backup") {
    exportBackup();
    return;
  }

  if (action === "download-stock-pdf") {
    downloadStockPdf();
    return;
  }

  if (action === "trigger-import") {
    const input = document.querySelector("#backup-input");
    if (input) input.click();
    return;
  }

  if (action === "restore-snapshot") {
    restoreSnapshot(target.dataset.snapshotId);
    return;
  }

  if (action === "add-recipe-ingredient") {
    const ingredientSelect = document.querySelector("#recipe-ingredient-product");
    const ingredientQuantity = document.querySelector("#recipe-ingredient-quantity");
    addRecipeDraftIngredient(
      ingredientSelect ? ingredientSelect.value : "",
      ingredientQuantity ? ingredientQuantity.value : ""
    );
    return;
  }

  if (action === "remove-recipe-ingredient") {
    removeRecipeDraftIngredient(target.dataset.ingredientProductId);
    return;
  }

  if (action === "edit-product") {
    startEditingProduct(target.dataset.productId);
    render();
    const form = document.querySelector("#catalog-form");
    if (form) form.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (action === "cancel-edit-product") {
    resetCatalogEditor();
    render();
    return;
  }

  if (action === "archive-product") {
    archiveProduct(target.dataset.productId);
    return;
  }

  if (action === "unarchive-product") {
    unarchiveProduct(target.dataset.productId);
    return;
  }

  if (action === "delete-product") {
    deleteProduct(target.dataset.productId);
    return;
  }

  if (action === "archive-staff-member") {
    archiveStaffMember(target.dataset.staffMemberId);
    return;
  }

  if (action === "unarchive-staff-member") {
    unarchiveStaffMember(target.dataset.staffMemberId);
    return;
  }

  if (action === "archive-driver-coordinator-member") {
    archiveDriverCoordinatorMember(target.dataset.driverCoordinatorMemberId);
    return;
  }

  if (action === "unarchive-driver-coordinator-member") {
    unarchiveDriverCoordinatorMember(target.dataset.driverCoordinatorMemberId);
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (target.matches("#room-product-search")) {
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    ui.roomQuery = target.value;
    render({
      preserveScroll: true,
      focusId: "room-product-search",
      selectionStart,
      selectionEnd,
    });
    return;
  }
  if (target.matches("#cashier-product-search")) {
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    ui.cashierQuery = target.value;
    render({
      preserveScroll: true,
      focusId: "cashier-product-search",
      selectionStart,
      selectionEnd,
    });
    return;
  }
  if (target.matches("#staff-product-search")) {
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    ui.staffQuery = target.value;
    render({
      preserveScroll: true,
      focusId: "staff-product-search",
      selectionStart,
      selectionEnd,
    });
    return;
  }
  if (target.matches("#driver-coordinator-product-search")) {
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    ui.driverCoordinatorQuery = target.value;
    render({
      preserveScroll: true,
      focusId: "driver-coordinator-product-search",
      selectionStart,
      selectionEnd,
    });
    return;
  }
  if (target.matches("#catalog-search")) {
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    ui.catalogQuery = target.value;
    render({
      preserveScroll: true,
      focusId: "catalog-search",
      selectionStart,
      selectionEnd,
    });
    return;
  }
  if (target.closest("#catalog-form") && target.name) {
    if (target.type === "checkbox") {
      ui.catalogDraft[target.name] = target.checked;
    } else {
      ui.catalogDraft[target.name] = target.value;
    }
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;

  if (target.matches("#backup-input")) {
    importBackup(target.files && target.files[0]);
    target.value = "";
    return;
  }

  if (target.matches("#driver-coordinator-group-select")) {
    ui.driverCoordinatorGroupId = target.value || "";
    render({ preserveScroll: true });
    return;
  }

  if (target.matches("#hero-service-select")) {
    updateActiveShiftServiceLabel(target.value);
    return;
  }

  if (target.closest("#catalog-form") && target.name) {
    if (target.type === "checkbox") {
      ui.catalogDraft[target.name] = target.checked;
    } else {
      ui.catalogDraft[target.name] = target.value;
    }

    if (target.name === "productKind") {
      if (target.value === "manufactured") {
        ui.catalogDraft.trackStock = false;
      }
      render({ preserveScroll: true });
      return;
    }

    if (target.type === "checkbox") {
      render({ preserveScroll: true });
    }
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "catalog-form") {
    event.preventDefault();
    upsertCatalogProduct({
      name: ui.catalogDraft.name || "",
      category: ui.catalogDraft.category || "Sin alcohol",
      productKind: ui.catalogDraft.productKind || "fixed",
      sellable: ui.catalogDraft.sellable !== false,
      price: ui.catalogDraft.price || "",
      costPrice: ui.catalogDraft.costPrice || "",
      stock: ui.catalogDraft.stock || "",
      lowStockThreshold: ui.catalogDraft.lowStockThreshold || String(MIN_LOW_STOCK_THRESHOLD),
      trackStock: ui.catalogDraft.trackStock === true,
    });
    return;
  }

  if (event.target.id === "staff-member-form") {
    event.preventDefault();
    const formData = new FormData(event.target);
    addStaffMember(formData.get("staffMemberName"));
    return;
  }

  if (event.target.id === "driver-coordinator-group-editor-form") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const mode = String(formData.get("mode") || "create");
    if (mode === "edit") {
      updateDriverCoordinatorGroupMembers(
        formData.get("groupId"),
        formData.get("driverCoordinatorGroupMembers"),
        { closeEditor: true }
      );
      return;
    }
    addDriverCoordinatorGroup(
      formData.get("driverCoordinatorGroupName"),
      formData.get("driverCoordinatorGroupMembers"),
      { closeEditor: true }
    );
  }
});

function requestCheckinStateFromParent() {
  if (!window.parent || window.parent === window) return;
  try {
    window.parent.postMessage({ type: "solanas:request-checkin-state" }, "*");
  } catch (error) {
    console.error("No se pudo pedir el estado de Check-in al sistema.", error);
  }
}

window.addEventListener("message", (event) => {
  if (!event || !event.data) {
    return;
  }

  if (event.data.type === "solanas:employees-state") {
    applyStaffMembersFromEmployees(event.data.staffMembers);
    return;
  }

  if (event.data.type === "solanas:checkin-state") {
    if (!isValidCheckinState(event.data.payload)) {
      return;
    }
    bridgedCheckinState = event.data.payload;
    render({ preserveScroll: true });
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === THEME_PREF_KEY) {
    ui.theme = event.newValue === "light" ? "light" : "dark";
    applyThemePreference(ui.theme);
    updateThemeToggleControls();
    return;
  }

  if (event.key !== CHECKIN_STORAGE_KEY) return;
  bridgedCheckinState = null;
  render({ preserveScroll: true });
});

window.addEventListener("resize", postSystemEmbeddedHeight);
requestCheckinStateFromParent();
render();
postBeverageStateToParent();
