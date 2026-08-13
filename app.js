const UNIFIED_STORAGE_KEY = "solanas-unificado-state-v2";
const LEGACY_UNIFIED_STORAGE_KEYS = ["solanas-unificado-state-v1"];
const CHECKIN_STORAGE_KEY = "solanas-checkin-state-v2";
const BEVERAGE_STORAGE_KEY = "solanas-comandero-state-v5";
const UNIFIED_BACKUP_FORMAT = "solanas-unified-backup-v1";
const CENTRAL_STATE_WRITE_DELAY_MS = 500;
const REMOTE_STATE_CONFIG = window.BLUE_COAST_REMOTE_STATE || {};
const REMOTE_STATE_PROVIDER = String(REMOTE_STATE_CONFIG.provider || "")
  .trim()
  .toLowerCase();
const FIRESTORE_STATE_CONFIG = REMOTE_STATE_CONFIG.firestore || {};
const FIRESTORE_STATE_COLLECTION = String(
  FIRESTORE_STATE_CONFIG.collection || "blue_coast_state"
).trim();
const FIRESTORE_STATE_DOCUMENT = String(
  FIRESTORE_STATE_CONFIG.document || "operational"
).trim();
const FIRESTORE_STATE_CHUNK_SIZE = Math.min(
  700000,
  Math.max(100000, Number(FIRESTORE_STATE_CONFIG.chunkSize) || 600000)
);
const FIRESTORE_STATE_FORMAT = "blue-coast-unified-json-v1";
const FIRESTORE_MAX_CHUNKS = 450;
const FIRESTORE_SDK_URL = "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
const LOGO_URL = new URL("../logo-solanas.png", window.location.href).href;
const BLUE_COAST_LOGO_URL = new URL("./assets/blue-coast-logo.svg", window.location.href).href;
const TIMELINE_ICON_URL = new URL("./assets/module-icons/linea-de-tiempo.svg?v=20260811-2", window.location.href).href;
const RESERVATIONS_APP_URL = new URL("./modulos/checkin/index.html?mode=reservas&embed=system&build=20260813-2", window.location.href).href;
const CHECKIN_APP_URL = new URL("./modulos/checkin/index.html?mode=checkin&embed=system&build=20260813-2", window.location.href).href;
const BEVERAGE_APP_URL = new URL("./modulos/bebidas/index.html?embed=system&build=20260811-10", window.location.href).href;
const BEVERAGE_CATALOG_APP_URL = new URL("./modulos/bebidas/index.html?view=catalog&build=20260811-10", window.location.href).href;
const SIDEBAR_PREF_KEY = "bluecoast-sidebar-collapsed-v1";
const THEME_PREF_KEY = "bluecoast-theme-v1";
const SIDEBAR_ICON_URLS = Object.freeze({
  menu: new URL("./assets/sidebar-icons/dashboard.svg", window.location.href).href,
  reservas: new URL("./assets/sidebar-icons/reservas.svg", window.location.href).href,
  checkin: new URL("./assets/sidebar-icons/check-in.svg", window.location.href).href,
  bebidas: new URL("./assets/sidebar-icons/bebidas.svg", window.location.href).href,
  checkout: new URL("./assets/sidebar-icons/check-out.svg", window.location.href).href,
  cajas: new URL("./assets/sidebar-icons/cajas.svg", window.location.href).href,
  registro: new URL("./assets/sidebar-icons/book.svg", window.location.href).href,
  inventario: new URL("./assets/sidebar-icons/package.svg", window.location.href).href,
  empleados: new URL("./assets/sidebar-icons/empleados.svg", window.location.href).href,
});
const SIDEBAR_ICON_LIGHT_URLS = Object.freeze({
  menu: new URL("./assets/sidebar-icons/light/dashboard.svg", window.location.href).href,
  reservas: new URL("./assets/sidebar-icons/light/reservas.svg", window.location.href).href,
  checkin: new URL("./assets/sidebar-icons/light/check-in.svg", window.location.href).href,
  bebidas: new URL("./assets/sidebar-icons/light/bebidas.svg", window.location.href).href,
  checkout: new URL("./assets/sidebar-icons/light/check-out.svg", window.location.href).href,
  cajas: new URL("./assets/sidebar-icons/light/cajas.svg", window.location.href).href,
  registro: new URL("./assets/sidebar-icons/light/book.svg", window.location.href).href,
  inventario: new URL("./assets/sidebar-icons/light/package.svg", window.location.href).href,
  empleados: new URL("./assets/sidebar-icons/light/empleados.svg", window.location.href).href,
});
const ROOM_OPTIONS = Array.from({ length: 32 }, (_, index) => String(index + 1));
const MAX_TRAVEL_ORIGIN_LENGTH = 50;
const TIMELINE_INDIVIDUAL_COLOR = "hsl(354 70% 38%)";
const TIMELINE_INDIVIDUAL_INK = "#ffffff";
const ROOM_CATALOG = Object.freeze({
  "1": { label: "Matrimonial" },
  "2": { label: "Matrimonial" },
  "3": { label: "Doble twin/mat" },
  "4": { label: "Matrimonial" },
  "5": { label: "Doble twin/mat" },
  "6": { label: "Doble twin/mat" },
  "7": { label: "Doble o triple twin" },
  "8": { label: "Triple twin o mat" },
  "9": { label: "Triple twin o mat" },
  "10": { label: "Triple o cuádruple twin o mat" },
  "11": { label: "Doble twin/mat" },
  "12": { label: "Doble twin/mat" },
  "13": { label: "Matrimonial" },
  "14": { label: "Matrimonial" },
  "15": { label: "Doble twin/mat" },
  "16": { label: "Matrimonial" },
  "17": { label: "Triple twin" },
  "18": { label: "Cuádruple twin" },
  "19": { label: "2 hab con 3 camas twin" },
  "20": { label: "Triple twin" },
  "21": { label: "Triple twin" },
  "22": { label: "Doble twin/mat" },
  "23": { label: "Doble twin/mat" },
  "24": { label: "Single" },
  "25": { label: "Doble twin/mat" },
  "26": { label: "Doble twin/mat" },
  "27": { label: "Triple twin" },
  "28": { label: "Triple twin" },
  "29": { label: "Triple mat" },
  "30": { label: "Triple twin" },
  "31": { label: "Triple twin" },
  "32": { label: "Doble twin/mat" },
});

const MODULES = {
  menu: {
    label: "Menú",
    title: "Dashboard",
    subtitle: "Resumen operativo general del hotel, con alertas, movimientos y accesos del sistema.",
    icon: "DB",
  },
  reservas: {
    label: "Reservas",
    title: "Reservas",
    subtitle: "Carga reservas particulares y grupales, se\u00f1as, tarifas y disponibilidad.",
    src: RESERVATIONS_APP_URL,
  },
  checkin: {
    label: "Check-in",
    title: "Check-in",
    subtitle: "Carga legajos, salda estad\u00edas e imprime formularios de ingreso.",
    src: CHECKIN_APP_URL,
  },
  bebidas: {
    label: "Estación de bebidas",
    title: "Estación de bebidas",
    subtitle: "Carga el comandero de bebidas dentro del paquete principal.",
    src: BEVERAGE_APP_URL,
  },
  checkout: {
    label: "Check-out",
    title: "Check-out",
  },
  cajas: {
    label: "Cajas",
    title: "Cajas",
  },
  registro: {
    label: "Libro de hu\u00e9spedes",
    title: "Libro de Registro de Hu\u00e9spedes",
  },
  inventario: {
    label: "Stock e Inventario",
    title: "Stock e Inventario",
  },
  empleados: {
    label: "Empleados",
    title: "Empleados",
  },
};

MODULES.menu.label = "Dashboard";
MODULES.reservas.icon = "RV";
MODULES.checkin.icon = "CI";
MODULES.bebidas.label = "Bebidas";
MODULES.bebidas.title = "Estación de bebidas";
MODULES.bebidas.icon = "BE";
MODULES.checkout.subtitle = "Revisión de salidas, consumos pendientes y cierres operativos del día.";
MODULES.checkout.icon = "CO";
MODULES.cajas.subtitle = "Movimiento, arqueo y control de las cajas activas del hotel y de bebidas.";
MODULES.cajas.icon = "CJ";
MODULES.registro.label = "Libro de huéspedes";
MODULES.registro.title = "Libro de Registro de Huéspedes";
MODULES.registro.subtitle = "Salida legal e imprimible del libro consolidado de huéspedes cargados.";
MODULES.registro.icon = "LR";
MODULES.inventario.subtitle = "Control central de bebidas, alimentos y extras operativos.";
MODULES.inventario.icon = "ST";
MODULES.empleados.subtitle = "Próximo módulo para legajos, roles, turnos y consumos internos.";
MODULES.empleados.icon = "EM";

MODULES.bebidas.title = "Estaci\u00f3n de bebidas";
MODULES.checkout.subtitle = "Revisi\u00f3n de salidas, consumos pendientes y cierres operativos del d\u00eda.";
MODULES.registro.label = "Libro de hu\u00e9spedes";
MODULES.registro.title = "Libro de Registro de Hu\u00e9spedes";
MODULES.registro.subtitle = "Salida legal e imprimible del libro consolidado de hu\u00e9spedes cargados.";
MODULES.inventario.subtitle = "Control central de bebidas, alimentos y extras operativos.";
MODULES.empleados.subtitle = "Pr\u00f3ximo m\u00f3dulo para legajos, roles, turnos y consumos internos.";

const SOURCE_LABELS = {
  checkin: "Check-in y reservas",
  beverages: "Estación de bebidas",
};

const INVENTORY_GROUPS = Object.freeze([
  {
    key: "beverages",
    title: "Bebidas",
    copy: "Cat\u00e1logo vivo tomado de la Estaci\u00f3n de bebidas: unidades, costos, venta y alertas.",
    tone: "teal",
    areas: [],
  },
  {
    key: "food",
    title: "Alimentos",
    copy: "Compras y consumo de cocina, desayuno, comedor y proveedores de alimentos.",
    tone: "gold",
    areas: [
      {
        title: "Panificaci\u00f3n",
        copy: "Pan, facturas, criollos, medialunas y reposiciones de panader\u00eda.",
      },
      {
        title: "Desayuno",
        copy: "Insumos propios del servicio de desayuno y buffet.",
      },
      {
        title: "Verduler\u00eda",
        copy: "Frutas, verduras, hortalizas y compras frescas del d\u00eda.",
      },
      {
        title: "Carnicer\u00eda",
        copy: "Cortes de carne vacuna y derivados.",
      },
      {
        title: "Poller\u00eda",
        copy: "Pollo, huevos y productos asociados al proveedor.",
      },
      {
        title: "Cerdo",
        copy: "Cerdo separado para controlar compras y costos sin mezclarlo con carnicer\u00eda.",
      },
      {
        title: "Almac\u00e9n",
        copy: "\u00cdtem abierto para secos, conservas, condimentos y productos generales.",
        isOpen: true,
      },
      {
        title: "Helader\u00eda",
        copy: "Helados, postres congelados y reposici\u00f3n de freezer.",
      },
    ],
  },
  {
    key: "extras",
    title: "Extras operativos",
    copy: "Elementos no alimentarios: ba\u00f1o, limpieza, lavander\u00eda, mantenimiento y compras chicas.",
    tone: "violet",
    areas: [
      {
        title: "Productos de limpieza",
        copy: "Lavandina, desinfectantes, detergentes, aromatizadores y descartables de limpieza.",
      },
      {
        title: "Productos de lavander\u00eda",
        copy: "Jab\u00f3n en polvo, suavizante, quitamanchas y control de ropa blanca.",
      },
      {
        title: "Ferreter\u00eda",
        copy: "Focos, tornillos, herramientas, arreglos menores y mantenimiento operativo.",
      },
      {
        title: "Extras",
        copy: "Amenities, elementos de ba\u00f1o, compras eventuales y gastos que no entren en otra familia.",
        isOpen: true,
      },
    ],
  },
]);

const REPORT_TYPES = {
  general: {
    label: "Reporte general",
    copy: "Cruza reservas, grupos, habitaciones, bebidas y saldos del mes seleccionado.",
  },
  group: {
    label: "Uno de los grupos",
    copy: "Permite elegir un grupo cargado y ya salido para triangular habitaciones, bebidas y choferes/coordinadores.",
  },
  individuals: {
    label: "Reservas individuales",
    copy: "Agrupa todas las reservas particulares del mes, sin separar por grupo.",
  },
};

function getInitialSidebarCollapsed() {
  if (window.matchMedia("(max-width: 820px)").matches) {
    return true;
  }
  try {
    const stored = window.localStorage.getItem(SIDEBAR_PREF_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
  } catch (error) {
    // Ignore storage access errors and fall back to viewport heuristic.
  }
  return window.matchMedia("(max-width: 1480px)").matches;
}

function persistSidebarPreference() {
  try {
    window.localStorage.setItem(SIDEBAR_PREF_KEY, ui.sidebarCollapsed ? "1" : "0");
  } catch (error) {
    // Ignore storage access errors to avoid blocking the UI.
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
    // Ignore storage access errors to avoid blocking the UI.
  }
}

const ui = {
  importSource: "",
  reportModalOpen: false,
  reportType: "general",
  reportGroupKey: "",
  systemMenuOpen: false,
  settlementModal: null,
  cashWithdrawalModal: null,
  cashAudit: {
    hotel: "",
    beverages: "",
  },
  menuTimelineDate: getTodayInputDate(),
  menuTimelineScrollByKey: {},
  sidebarCollapsed: getInitialSidebarCollapsed(),
  theme: getInitialThemePreference(),
};

let state = loadUnifiedState();
let centralStateWriteTimer = null;
let centralStateWriteInFlight = null;
let centralStateWriteQueued = false;
let firestoreApiPromise = null;
let firestoreDb = null;
let isApplyingCentralState = false;

function createUnifiedState() {
  return {
    version: 2,
    sources: {
      checkin: null,
      beverages: null,
    },
    sourceMeta: {
      checkin: null,
      beverages: null,
    },
    settlements: {},
    cashTransfers: [],
    cashWithdrawals: [],
    employees: [],
    employeeDirectoryManagedAt: "",
    selectedMonth: getCurrentMonthKey(),
    lastSavedAt: new Date().toISOString(),
  };
}

function loadUnifiedState() {
  try {
    clearLegacyUnifiedState();
    const raw = localStorage.getItem(UNIFIED_STORAGE_KEY);
    if (!raw) return createUnifiedState();
    const parsed = JSON.parse(raw);
    return {
      ...createUnifiedState(),
      ...parsed,
      sources: {
        checkin: parsed.sources ? parsed.sources.checkin || null : null,
        beverages: parsed.sources ? parsed.sources.beverages || null : null,
      },
      sourceMeta: {
        checkin: parsed.sourceMeta ? parsed.sourceMeta.checkin || null : null,
        beverages: parsed.sourceMeta ? parsed.sourceMeta.beverages || null : null,
      },
      settlements: parsed.settlements && typeof parsed.settlements === "object"
        ? parsed.settlements
        : {},
      cashTransfers: normalizeCashTransfers(parsed.cashTransfers),
      cashWithdrawals: normalizeCashWithdrawals(parsed.cashWithdrawals),
      employees: normalizeEmployees(
        parsed.employees,
        parsed.employeeDirectoryManagedAt ? null : parsed.sources && parsed.sources.beverages
      ),
      employeeDirectoryManagedAt: parsed.employeeDirectoryManagedAt || "",
      selectedMonth: parsed.selectedMonth || getCurrentMonthKey(),
    };
  } catch (error) {
    console.error("No se pudo cargar el sistema.", error);
    return createUnifiedState();
  }
}

function normalizeUnifiedStatePayload(payload) {
  const candidate = payload && payload.sources ? payload : null;
  if (!candidate) return null;
  return {
    ...createUnifiedState(),
    ...candidate,
    sources: {
      checkin: candidate.sources ? candidate.sources.checkin || null : null,
      beverages: candidate.sources ? candidate.sources.beverages || null : null,
    },
    sourceMeta: {
      checkin: candidate.sourceMeta ? candidate.sourceMeta.checkin || null : null,
      beverages: candidate.sourceMeta ? candidate.sourceMeta.beverages || null : null,
    },
    settlements: candidate.settlements && typeof candidate.settlements === "object"
      ? candidate.settlements
      : {},
    cashTransfers: normalizeCashTransfers(candidate.cashTransfers),
    cashWithdrawals: normalizeCashWithdrawals(candidate.cashWithdrawals),
    employees: normalizeEmployees(
      candidate.employees,
      candidate.employeeDirectoryManagedAt ? null : candidate.sources && candidate.sources.beverages
    ),
    employeeDirectoryManagedAt: candidate.employeeDirectoryManagedAt || "",
    selectedMonth: candidate.selectedMonth || getCurrentMonthKey(),
  };
}

function clearLegacyUnifiedState() {
  LEGACY_UNIFIED_STORAGE_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("No se pudo limpiar el estado anterior del sistema.", error);
    }
  });
}

function writeLocalStateMirrors() {
  syncEmployeesToBeverageSource();
  try {
    localStorage.setItem(UNIFIED_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("No se pudo guardar el estado local del sistema.", error);
  }

  try {
    if (sourceLooksValid("checkin", state.sources.checkin)) {
      localStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(state.sources.checkin));
    }
  } catch (error) {
    console.error("No se pudo espejar Check-in en el almacenamiento local.", error);
  }

  try {
    if (sourceLooksValid("beverages", state.sources.beverages)) {
      localStorage.setItem(BEVERAGE_STORAGE_KEY, JSON.stringify(state.sources.beverages));
    }
  } catch (error) {
    console.error("No se pudo espejar Bebidas en el almacenamiento local.", error);
  }
}

function persistState(message = "") {
  state.lastSavedAt = new Date().toISOString();
  writeLocalStateMirrors();
  if (!isApplyingCentralState) {
    scheduleCentralStateWrite();
  }
  if (message) {
    showToast(message);
  }
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value || null));
}

function readLocalJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`No se pudo leer ${key}.`, error);
    return null;
  }
}

function getStateSavedAtMs(payload) {
  if (!payload || typeof payload !== "object") {
    return 0;
  }

  const candidates = [
    payload.lastSavedAt,
    payload.clientSavedAt,
    payload.exportedAt,
    payload.updatedAt,
  ];
  if (Array.isArray(payload.reservations)) {
    payload.reservations.forEach((reservation) => {
      if (!reservation || typeof reservation !== "object") return;
      candidates.push(
        reservation.updatedAt,
        reservation.legalUpdatedAt,
        reservation.confirmedAt,
        reservation.createdAt
      );
    });
  }

  return candidates.reduce((latest, value) => {
    const parsed = Date.parse(value || "");
    return Number.isFinite(parsed) ? Math.max(latest, parsed) : latest;
  }, 0);
}

function selectFreshestPayload(localPayload, remotePayload, isValid) {
  const localValid = Boolean(localPayload && isValid(localPayload));
  const remoteValid = Boolean(remotePayload && isValid(remotePayload));

  if (!localValid) {
    return { payload: remoteValid ? remotePayload : null, usedLocal: false };
  }
  if (!remoteValid) {
    return { payload: localPayload, usedLocal: true };
  }

  const localSavedAt = getStateSavedAtMs(localPayload);
  const remoteSavedAt = getStateSavedAtMs(remotePayload);
  if (localSavedAt > remoteSavedAt) {
    return { payload: localPayload, usedLocal: true };
  }
  return { payload: remotePayload, usedLocal: false };
}

function canUseCentralStateApi() {
  const isWebPage = window.location.protocol === "http:" || window.location.protocol === "https:";
  return (
    isWebPage &&
    REMOTE_STATE_PROVIDER === "firestore" &&
    Boolean(FIRESTORE_STATE_COLLECTION) &&
    Boolean(FIRESTORE_STATE_DOCUMENT) &&
    Boolean(window.BLUE_COAST_FIREBASE_APP) &&
    Boolean(window.BLUE_COAST_AUTH_SESSION)
  );
}

async function getFirestoreContext() {
  if (!canUseCentralStateApi()) {
    return null;
  }
  if (!firestoreApiPromise) {
    firestoreApiPromise = import(FIRESTORE_SDK_URL);
  }
  const api = await firestoreApiPromise;
  if (!firestoreDb) {
    firestoreDb = api.getFirestore(window.BLUE_COAST_FIREBASE_APP);
  }
  return { api, db: firestoreDb };
}

function encodeUtf8Base64(value) {
  const bytes = new TextEncoder().encode(String(value || ""));
  let binary = "";
  const blockSize = 0x8000;
  for (let index = 0; index < bytes.length; index += blockSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + blockSize));
  }
  return window.btoa(binary);
}

function decodeUtf8Base64(value) {
  const binary = window.atob(String(value || ""));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new TextDecoder().decode(bytes);
}

function getFirestoreChunkId(generation, index) {
  return `${FIRESTORE_STATE_DOCUMENT}__${generation}__${String(index).padStart(4, "0")}`;
}

function splitCentralStatePayload(payload) {
  const json = JSON.stringify(payload);
  const encoded = encodeUtf8Base64(json);
  const chunks = [];
  for (let index = 0; index < encoded.length; index += FIRESTORE_STATE_CHUNK_SIZE) {
    chunks.push(encoded.slice(index, index + FIRESTORE_STATE_CHUNK_SIZE));
  }
  if (!chunks.length) {
    chunks.push(encodeUtf8Base64("{}"));
  }
  if (chunks.length > FIRESTORE_MAX_CHUNKS) {
    throw new Error("El estado central supera el tamano permitido para una escritura segura.");
  }
  return {
    chunks,
    byteLength: new TextEncoder().encode(json).length,
  };
}

async function readCentralStateFromFirestore() {
  const context = await getFirestoreContext();
  if (!context) {
    return { exists: false, payload: null };
  }
  const { api, db } = context;
  const metadataRef = api.doc(
    db,
    FIRESTORE_STATE_COLLECTION,
    FIRESTORE_STATE_DOCUMENT
  );
  const metadataSnapshot = await api.getDoc(metadataRef);
  if (!metadataSnapshot.exists()) {
    return { exists: false, payload: null };
  }

  const metadata = metadataSnapshot.data() || {};
  const generation = String(metadata.generation || "");
  const chunkCount = Number(metadata.chunkCount);
  if (
    metadata.format !== FIRESTORE_STATE_FORMAT ||
    !generation ||
    !Number.isInteger(chunkCount) ||
    chunkCount < 1 ||
    chunkCount > FIRESTORE_MAX_CHUNKS
  ) {
    throw new Error("El estado de Firestore tiene un formato invalido.");
  }

  const snapshots = await Promise.all(
    Array.from({ length: chunkCount }, (_, index) =>
      api.getDoc(
        api.doc(
          db,
          FIRESTORE_STATE_COLLECTION,
          getFirestoreChunkId(generation, index)
        )
      )
    )
  );
  const encoded = snapshots
    .map((snapshot, index) => {
      if (!snapshot.exists()) {
        throw new Error(`Falta el fragmento ${index + 1} del estado central.`);
      }
      const chunk = snapshot.data() || {};
      if (chunk.generation !== generation || Number(chunk.index) !== index) {
        throw new Error(`El fragmento ${index + 1} del estado central no coincide.`);
      }
      return String(chunk.data || "");
    })
    .join("");

  return {
    exists: true,
    payload: JSON.parse(decodeUtf8Base64(encoded)),
  };
}

async function deleteFirestoreGeneration(context, generation, chunkCount) {
  if (!generation || !Number.isInteger(chunkCount) || chunkCount < 1) {
    return;
  }
  const { api, db } = context;
  for (let start = 0; start < chunkCount; start += FIRESTORE_MAX_CHUNKS) {
    const batch = api.writeBatch(db);
    const end = Math.min(chunkCount, start + FIRESTORE_MAX_CHUNKS);
    for (let index = start; index < end; index += 1) {
      batch.delete(
        api.doc(
          db,
          FIRESTORE_STATE_COLLECTION,
          getFirestoreChunkId(generation, index)
        )
      );
    }
    await batch.commit();
  }
}

async function writeCentralStateToFirestore(payload) {
  const context = await getFirestoreContext();
  if (!context) {
    return false;
  }
  const { api, db } = context;
  const metadataRef = api.doc(
    db,
    FIRESTORE_STATE_COLLECTION,
    FIRESTORE_STATE_DOCUMENT
  );
  const previousSnapshot = await api.getDoc(metadataRef);
  const previousMetadata = previousSnapshot.exists() ? previousSnapshot.data() || {} : {};
  const randomGenerationPart =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().replace(/-/g, "")
      : `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
  const generation = `${Date.now()}_${randomGenerationPart}`;
  const { chunks, byteLength } = splitCentralStatePayload(payload);
  const batch = api.writeBatch(db);

  chunks.forEach((data, index) => {
    batch.set(
      api.doc(
        db,
        FIRESTORE_STATE_COLLECTION,
        getFirestoreChunkId(generation, index)
      ),
      {
        format: FIRESTORE_STATE_FORMAT,
        generation,
        index,
        data,
      }
    );
  });

  const session = window.BLUE_COAST_AUTH_SESSION || {};
  batch.set(metadataRef, {
    format: FIRESTORE_STATE_FORMAT,
    generation,
    chunkCount: chunks.length,
    byteLength,
    clientSavedAt: new Date().toISOString(),
    serverSavedAt: api.serverTimestamp(),
    savedByUid: String(session.uid || ""),
    savedByEmail: String(session.email || ""),
  });
  await batch.commit();

  const previousGeneration = String(previousMetadata.generation || "");
  const previousChunkCount = Number(previousMetadata.chunkCount);
  if (previousGeneration && previousGeneration !== generation) {
    deleteFirestoreGeneration(context, previousGeneration, previousChunkCount).catch((error) => {
      console.warn("No se pudieron limpiar fragmentos anteriores de Firestore.", error);
    });
  }
  return true;
}

function applyUnifiedPayloadLocally(payload, meta = {}) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const unifiedPayload =
    getUnifiedBackupSystem(payload, "unified") ||
    payload.unifiedState ||
    payload.state ||
    payload;
  const remoteState = normalizeUnifiedStatePayload(unifiedPayload);
  const unifiedSelection = selectFreshestPayload(
    state,
    remoteState,
    (candidate) => Boolean(normalizeUnifiedStatePayload(candidate))
  );
  const nextState = normalizeUnifiedStatePayload(unifiedSelection.payload);
  const remoteCheckinPayload =
    getUnifiedBackupSystem(payload, "checkin") ||
    (nextState && nextState.sources ? nextState.sources.checkin : null);
  const checkinSelection = selectFreshestPayload(
    readLocalJson(CHECKIN_STORAGE_KEY),
    remoteCheckinPayload,
    (candidate) => sourceLooksValid("checkin", candidate)
  );
  const remoteBeveragePayload =
    getUnifiedBackupSystem(payload, "beverages") ||
    (nextState && nextState.sources ? nextState.sources.beverages : null);
  const beverageSelection = selectFreshestPayload(
    readLocalJson(BEVERAGE_STORAGE_KEY),
    remoteBeveragePayload,
    (candidate) => sourceLooksValid("beverages", candidate)
  );
  const normalizedCheckin = sourceLooksValid("checkin", checkinSelection.payload)
    ? checkinSelection.payload
    : null;
  const beverageNormalization = sourceLooksValid("beverages", beverageSelection.payload)
    ? normalizeBeveragePayloadForDashboard(beverageSelection.payload)
    : { payload: null, changed: false };
  const normalizedBeverages = beverageNormalization.payload;
  const preservedNewerLocalState =
    unifiedSelection.usedLocal || checkinSelection.usedLocal || beverageSelection.usedLocal;

  if (!nextState && !normalizedCheckin && !normalizedBeverages) {
    return false;
  }

  isApplyingCentralState = true;
  state = normalizeUnifiedStatePayload(nextState) || createUnifiedState();
  if (normalizedCheckin) {
    state.sources.checkin = normalizedCheckin;
    state.sourceMeta.checkin = {
      importedAt: new Date().toISOString(),
      sourceName: meta.sourceName || "JSON central",
      mode: meta.mode || "central-json",
    };
  }
  if (normalizedBeverages) {
    state.sources.beverages = normalizedBeverages;
    state.sourceMeta.beverages = {
      importedAt: new Date().toISOString(),
      sourceName: meta.sourceName || "JSON central",
      mode: meta.mode || "central-json",
    };
    hydrateEmployeesFromBeverageSource();
  }
  writeLocalStateMirrors();
  isApplyingCentralState = false;
  if (beverageNormalization.changed || preservedNewerLocalState) {
    scheduleCentralStateWrite();
  }
  return true;
}

async function loadCentralState() {
  if (!canUseCentralStateApi()) {
    return false;
  }

  try {
    const result = await readCentralStateFromFirestore();
    if (result.exists && result.payload) {
      return applyUnifiedPayloadLocally(result.payload, {
        sourceName: "Firestore seguro",
        mode: "firestore-authenticated",
      });
    }
    scheduleCentralStateWrite();
    return false;
  } catch (error) {
    console.error("No se pudo cargar el estado seguro de Firestore.", error);
    return false;
  }
}

function scheduleCentralStateWrite() {
  if (!canUseCentralStateApi()) {
    return;
  }
  window.clearTimeout(centralStateWriteTimer);
  centralStateWriteTimer = window.setTimeout(() => {
    centralStateWriteTimer = null;
    saveCentralStateNow();
  }, CENTRAL_STATE_WRITE_DELAY_MS);
}

async function saveCentralStateNow() {
  if (!canUseCentralStateApi()) {
    return false;
  }

  if (centralStateWriteInFlight) {
    centralStateWriteQueued = true;
    return centralStateWriteInFlight;
  }

  centralStateWriteInFlight = (async () => {
    try {
      return await writeCentralStateToFirestore(buildUnifiedBackupPayload());
    } catch (error) {
      console.error("No se pudo guardar el estado seguro de Firestore.", error);
      return false;
    }
  })();

  try {
    return await centralStateWriteInFlight;
  } finally {
    centralStateWriteInFlight = null;
    if (centralStateWriteQueued) {
      centralStateWriteQueued = false;
      scheduleCentralStateWrite();
    }
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function sanitizeTravelOrigin(value) {
  return String(value || "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/ {2,}/g, " ")
    .trim()
    .slice(0, MAX_TRAVEL_ORIGIN_LENGTH);
}

function getReservationTravelOrigin(reservation) {
  if (!reservation) return "";
  return sanitizeTravelOrigin(
    reservation.travelOrigin || reservation.origin || reservation.destination
  );
}

function normalizeName(value) {
  return slugify(value || "sin-nombre");
}

function normalizeCashboxKey(value) {
  const key = String(value || "").trim().toLowerCase();
  return key === "hotel" || key === "beverages" ? key : "";
}

function normalizeCashTransfers(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((transfer, index) => ({
      id: transfer && transfer.id ? String(transfer.id) : `cash-transfer-${index + 1}`,
      from: normalizeCashboxKey(transfer && transfer.from),
      to: normalizeCashboxKey(transfer && transfer.to),
      amount: parseAmount(transfer && transfer.amount),
      createdAt: transfer && transfer.createdAt ? transfer.createdAt : "",
      note: String((transfer && transfer.note) || "").trim(),
    }))
    .filter((transfer) => transfer.from && transfer.to && transfer.from !== transfer.to && transfer.amount > 0);
}

function normalizeCashWithdrawals(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((withdrawal, index) => ({
      id: withdrawal && withdrawal.id ? String(withdrawal.id) : `cash-withdrawal-${index + 1}`,
      box: normalizeCashboxKey(withdrawal && withdrawal.box),
      amount: parseAmount(withdrawal && withdrawal.amount),
      createdAt: withdrawal && withdrawal.createdAt ? withdrawal.createdAt : "",
      note: String((withdrawal && withdrawal.note) || "").trim(),
    }))
    .filter((withdrawal) => withdrawal.box && withdrawal.amount > 0);
}

function normalizeEmployeeAdvance(advance, index = 0) {
  const amount = parseAmount(advance && advance.amount);
  if (amount <= 0) return null;
  return {
    id: advance && advance.id ? String(advance.id) : `advance-${Date.now()}-${index}`,
    amount,
    createdAt: advance && advance.createdAt ? advance.createdAt : new Date().toISOString(),
    note: String((advance && advance.note) || "").trim(),
  };
}

function normalizeEmployeeAttendance(entry, index = 0) {
  const date = normalizeDate(entry && entry.date) || getTodayInputDate();
  return {
    id: entry && entry.id ? String(entry.id) : `attendance-${date}-${index}`,
    date,
    scheduledIn: String((entry && entry.scheduledIn) || "09:00").trim() || "09:00",
    scheduledOut: String((entry && entry.scheduledOut) || "18:00").trim() || "18:00",
    checkedInAt: entry && entry.checkedInAt ? entry.checkedInAt : null,
    checkedOutAt: entry && entry.checkedOutAt ? entry.checkedOutAt : null,
  };
}

function normalizeEmployee(employee, index = 0) {
  const name = String((employee && employee.name) || "").trim();
  if (!name) return null;
  return {
    id: employee && employee.id ? String(employee.id) : `staff-${slugify(name)}-${Date.now()}-${index}`,
    name,
    monthlySalary: parseAmount(employee && employee.monthlySalary),
    scheduledIn: String((employee && employee.scheduledIn) || "09:00").trim() || "09:00",
    scheduledOut: String((employee && employee.scheduledOut) || "18:00").trim() || "18:00",
    advances: Array.isArray(employee && employee.advances)
      ? employee.advances.map(normalizeEmployeeAdvance).filter(Boolean)
      : [],
    attendance: Array.isArray(employee && employee.attendance)
      ? employee.attendance.map(normalizeEmployeeAttendance).filter(Boolean)
      : [],
    createdAt: (employee && employee.createdAt) || new Date().toISOString(),
  };
}

function normalizeEmployees(value, beverageSource = null) {
  const normalized = Array.isArray(value)
    ? value.map(normalizeEmployee).filter(Boolean)
    : [];
  if (normalized.length) {
    return dedupeEmployees(normalized);
  }
  return buildEmployeesFromBeverageSource(beverageSource);
}

function dedupeEmployees(employees) {
  const seen = new Set();
  return employees.filter((employee) => {
    const key = slugify(employee.name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildEmployeesFromBeverageSource(beverageSource) {
  const beverage = unwrapBeveragePayload(beverageSource);
  const members = beverage && Array.isArray(beverage.staffMembers) ? beverage.staffMembers : [];
  return dedupeEmployees(
    members
      .filter((member) => member && member.archived !== true)
      .map((member, index) =>
        normalizeEmployee(
          {
            id: member.id,
            name: member.name,
            monthlySalary: 0,
            createdAt: member.createdAt,
          },
          index
        )
      )
      .filter(Boolean)
  );
}

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getTodayInputDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

function getMonthRange(monthKey = state.selectedMonth) {
  const [year, month] = String(monthKey || getCurrentMonthKey()).split("-").map(Number);
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0);
  const currentMonth = getCurrentMonthKey();
  const end =
    monthKey === currentMonth
      ? getTodayInputDate()
      : `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(
          endDate.getDate()
        ).padStart(2, "0")}`;
  return { start, end };
}

function isDateInRange(value, range) {
  const date = normalizeDate(value);
  return Boolean(date && date >= range.start && date <= range.end);
}

function rangesOverlap(startValue, endValue, range) {
  const start = normalizeDate(startValue);
  const end = normalizeDate(endValue) || start;
  if (!start && !end) return false;
  return (start || end) <= range.end && (end || start) >= range.start;
}

function normalizeDate(value) {
  if (!value) return "";
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return "";
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(
    parsed.getDate()
  ).padStart(2, "0")}`;
}

function formatDate(value) {
  const normalized = normalizeDate(value);
  if (!normalized) return "Sin fecha";
  const [year, month, day] = normalized.split("-");
  return `${day}/${month}/${year}`;
}

function addDaysToInputDate(value, days) {
  const inputDate = normalizeDate(value);
  if (!inputDate) return "";
  const date = new Date(`${inputDate}T12:00:00`);
  date.setDate(date.getDate() + Number(days || 0));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function getMonthKeyFromDate(value = getTodayInputDate()) {
  const inputDate = normalizeDate(value);
  return inputDate ? inputDate.slice(0, 7) : getTodayInputDate().slice(0, 7);
}

function getDaysInMonth(value = getTodayInputDate()) {
  const [year, month] = getMonthKeyFromDate(value).split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function shiftInputDateByMonths(value, months) {
  const inputDate = normalizeDate(value) || getTodayInputDate();
  const [year, month, day] = inputDate.split("-").map(Number);
  const targetMonthDate = new Date(year, month - 1 + Number(months || 0), 1, 12);
  const daysInTargetMonth = new Date(
    targetMonthDate.getFullYear(),
    targetMonthDate.getMonth() + 1,
    0
  ).getDate();
  targetMonthDate.setDate(Math.min(day, daysInTargetMonth));
  return `${targetMonthDate.getFullYear()}-${String(targetMonthDate.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(targetMonthDate.getDate()).padStart(2, "0")}`;
}

function formatMonthYearLabel(value = getTodayInputDate()) {
  const monthKey = getMonthKeyFromDate(value);
  try {
    const label = new Intl.DateTimeFormat("es-AR", {
      month: "long",
      year: "numeric",
    }).format(new Date(`${monthKey}-01T12:00:00`));
    return label.charAt(0).toUpperCase() + label.slice(1);
  } catch (error) {
    return monthKey;
  }
}

function formatDateLong(value) {
  const inputDate = normalizeDate(value);
  if (!inputDate) return "Sin fecha";
  try {
    return new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(`${inputDate}T12:00:00`));
  } catch (error) {
    return formatDate(inputDate);
  }
}

function formatWeekdayShortLabel(value) {
  const inputDate = normalizeDate(value);
  if (!inputDate) return "";
  try {
    return new Intl.DateTimeFormat("es-AR", { weekday: "short" })
      .format(new Date(`${inputDate}T12:00:00`))
      .replace(".", "")
      .slice(0, 3);
  } catch (error) {
    return "";
  }
}

function formatDateTime(value) {
  if (!value) return "Sin fecha";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return formatDate(value);
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsed);
}

function parseAmount(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const text = String(value || "")
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (!text) return 0;
  const amount = Number(text);
  return Number.isFinite(amount) ? amount : 0;
}

function formatMoney(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function getCollectionTotal(items = []) {
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
}

function getItemUnits(items = []) {
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

function normalizePaymentMethod(value) {
  const text = String(value || "").trim().toLowerCase();
  if (["cash", "efectivo"].includes(text)) return "cash";
  if (["transfer", "transferencia", "transferencia bancaria"].includes(text)) return "transfer";
  if (["stay", "estadia", "estad\u00eda", "saldo", "saldo estadia", "saldo estad\u00eda", "abonar al final"].includes(text)) {
    return "stay";
  }
  return text || "unknown";
}

function isDeferredStayPayment(value) {
  return normalizePaymentMethod(value) === "stay";
}

function getPaymentMethodLabel(value) {
  const normalized = normalizePaymentMethod(value);
  if (normalized === "cash") return "Efectivo";
  if (normalized === "transfer") return "Transferencia bancaria";
  if (normalized === "stay") return "Saldo estad\u00eda";
  return "Sin definir";
}

function unwrapBeveragePayload(payload) {
  if (payload && payload.data && payload.data.activeShift) return payload.data;
  return payload;
}

function getLocalDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function isBeverageShiftOperationallyEmpty(shift) {
  if (!shift || typeof shift !== "object") return true;
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

function normalizeBeveragePayloadForDashboard(payload) {
  const candidate = unwrapBeveragePayload(payload);
  if (!candidate || !candidate.activeShift) {
    return { payload: candidate || null, changed: false };
  }
  const openedDateKey = getLocalDateKey(candidate.activeShift.openedAt);
  const isStaleEmptyShift =
    openedDateKey &&
    openedDateKey !== getLocalDateKey(new Date()) &&
    isBeverageShiftOperationallyEmpty(candidate.activeShift);
  if (!isStaleEmptyShift) {
    return { payload: candidate, changed: false };
  }

  const refreshed = deepClone(candidate);
  const nowIso = new Date().toISOString();
  refreshed.activeShift = {
    ...refreshed.activeShift,
    openedAt: nowIso,
    rooms: Array.isArray(refreshed.activeShift.rooms)
      ? refreshed.activeShift.rooms.map((room) => ({
          ...room,
          items: Array.isArray(room.items) ? room.items : [],
          updatedAt: nowIso,
        }))
      : refreshed.activeShift.rooms,
  };
  return { payload: refreshed, changed: true };
}

function detectSource(payload, requestedSource = "") {
  const candidate = unwrapBeveragePayload(payload);
  if (requestedSource === "checkin") return "checkin";
  if (requestedSource === "beverages") return "beverages";
  if (candidate && Array.isArray(candidate.reservations)) return "checkin";
  if (candidate && candidate.activeShift && Array.isArray(candidate.catalog)) return "beverages";
  return "";
}

function sourceLooksValid(source, payload) {
  const candidate = source === "beverages" ? unwrapBeveragePayload(payload) : payload;
  if (source === "checkin") return Boolean(candidate && Array.isArray(candidate.reservations));
  if (source === "beverages") return Boolean(candidate && candidate.activeShift);
  return false;
}

function getEmployeeStaffMembersForBeverages() {
  return normalizeEmployees(state.employees).map((employee) => ({
    id: employee.id,
    name: employee.name,
    archived: false,
    createdAt: employee.createdAt || new Date().toISOString(),
  }));
}

function syncEmployeesToBeverageSource() {
  if (!state || !sourceLooksValid("beverages", state.sources && state.sources.beverages)) {
    return false;
  }
  const beverage = unwrapBeveragePayload(state.sources.beverages);
  const nextStaffMembers = getEmployeeStaffMembersForBeverages();
  const current = Array.isArray(beverage.staffMembers) ? beverage.staffMembers : [];
  const currentSignature = JSON.stringify(
    current.map((member) => ({
      id: member && member.id,
      name: member && member.name,
      archived: member && member.archived === true,
    }))
  );
  const nextSignature = JSON.stringify(
    nextStaffMembers.map((member) => ({
      id: member.id,
      name: member.name,
      archived: false,
    }))
  );
  if (currentSignature === nextSignature) {
    return false;
  }
  beverage.staffMembers = nextStaffMembers;
  return true;
}

function hydrateEmployeesFromBeverageSource() {
  const employees = normalizeEmployees(state.employees);
  if (employees.length) {
    state.employees = employees;
    return false;
  }
  if (state.employeeDirectoryManagedAt) {
    state.employees = [];
    return false;
  }
  const fromBeverages = buildEmployeesFromBeverageSource(state.sources && state.sources.beverages);
  if (!fromBeverages.length) {
    state.employees = [];
    return false;
  }
  state.employees = fromBeverages;
  return true;
}

function markEmployeeDirectoryManaged() {
  state.employeeDirectoryManagedAt = new Date().toISOString();
}

function postEmployeesToBeverageFrame() {
  if (getActiveModule() !== "bebidas") {
    return false;
  }
  const frame = document.querySelector(".original-system-frame");
  if (!frame || !frame.contentWindow) {
    return false;
  }
  try {
    frame.contentWindow.postMessage(
      {
        type: "solanas:employees-state",
        staffMembers: getEmployeeStaffMembersForBeverages(),
        emittedAt: new Date().toISOString(),
      },
      "*"
    );
    return true;
  } catch (error) {
    console.error("No se pudo enviar la nomina a Bebidas.", error);
    return false;
  }
}

function setSourceState(source, payload, meta = {}) {
  const normalizedPayload =
    source === "beverages" ? normalizeBeveragePayloadForDashboard(payload).payload : payload;
  if (!sourceLooksValid(source, normalizedPayload)) {
    return false;
  }

  state.sources[source] = normalizedPayload;
  state.sourceMeta[source] = {
    importedAt: new Date().toISOString(),
    sourceName: meta.sourceName || "Estado local",
    mode: meta.mode || "local",
  };
  if (source === "beverages") {
    hydrateEmployeesFromBeverageSource();
    syncEmployeesToBeverageSource();
  }
  return true;
}

function importSourceState(source, payload, meta = {}) {
  if (!setSourceState(source, payload, meta)) {
    alert("El archivo no parece corresponder al sistema seleccionado.");
    return false;
  }

  persistState(`${SOURCE_LABELS[source]} importado en el sistema.`);
  return true;
}

function syncFromLocalStorage(options = {}) {
  const { silent = false, renderAfter = true } = options;
  const results = [];
  try {
    const rawCheckin = localStorage.getItem(CHECKIN_STORAGE_KEY);
    if (rawCheckin) {
      const parsed = JSON.parse(rawCheckin);
      if (sourceLooksValid("checkin", parsed)) {
        setSourceState("checkin", parsed, {
          sourceName: CHECKIN_STORAGE_KEY,
          mode: "localStorage",
        });
        results.push("check-in");
      }
    }
  } catch (error) {
    console.error("No se pudo leer check-in desde localStorage.", error);
  }

  try {
    const rawBeverages = localStorage.getItem(BEVERAGE_STORAGE_KEY);
    if (rawBeverages) {
      const parsed = JSON.parse(rawBeverages);
      if (sourceLooksValid("beverages", parsed)) {
        setSourceState("beverages", parsed, {
          sourceName: BEVERAGE_STORAGE_KEY,
          mode: "localStorage",
        });
        results.push("bebidas");
      }
    }
  } catch (error) {
    console.error("No se pudo leer bebidas desde localStorage.", error);
  }

  if (!results.length) {
    if (!silent) {
      alert(
      "Aun no hay estados locales visibles desde esta ventana. Abri Check-in o Bebidas desde este menu para empezar a cargar datos internos."
      );
    }
  } else {
    persistState(silent ? "" : `Datos actualizados desde ${results.join(" y ")}.`);
  }
  if (renderAfter) {
    render();
  }
  return results;
}

function receiveEmbeddedSourceState(source, payload) {
  if (!setSourceState(source, payload, {
    sourceName: source === "checkin" ? "Check-in interno" : "Bebidas interno",
    mode: "modulo-interno",
  })) {
    return false;
  }
  persistState();
  if (source === "beverages") {
    postEmployeesToBeverageFrame();
  }
  const activeModule = getActiveModule();
  if (activeModule === "inventario") {
    refreshInventoryBeverageSummary();
    return true;
  }
  if (
    activeModule !== source &&
    activeModule !== "reservas" &&
    activeModule !== "checkin" &&
    activeModule !== "bebidas"
  ) {
    render();
  }
  return true;
}

function getReservations() {
  const reservations = state.sources.checkin && Array.isArray(state.sources.checkin.reservations)
    ? state.sources.checkin.reservations
    : [];
  return reservations
    .filter((reservation) => reservation && reservation.archived !== true)
    .map(normalizeReservationForCheckout)
    .filter(isOperationalReservation)
    .sort((left, right) => {
      const dateCompare = String(left.checkOutDate || "").localeCompare(String(right.checkOutDate || ""));
      if (dateCompare !== 0) return dateCompare;
      return Number(left.roomNumber || 0) - Number(right.roomNumber || 0);
    });
}

function normalizeReservationForCheckout(reservation) {
  const total = parseAmount(reservation.total || reservation.groupRoomSubtotal);
  const cash = parseAmount(reservation.cash);
  const transfer = parseAmount(reservation.transfer);
  const depositMethod = normalizePaymentMethod(reservation.depositPaymentMethod);
  const depositAmount =
    depositMethod === "cash" || depositMethod === "transfer"
      ? parseAmount(reservation.depositAmount)
      : 0;
  const lodgingPaid = cash + transfer + depositAmount;
  const lodgingPending = 0;
  const mainGuest = Array.isArray(reservation.guests) ? reservation.guests[0] || {} : {};
  const responsible = reservation.responsible || {};
  const guestName = [
    mainGuest.lastName || responsible.lastName,
    mainGuest.firstName || responsible.firstName,
  ]
    .filter(Boolean)
    .join(", ");
  const groupName = String(reservation.groupCompany || "").trim();

  return {
    id: reservation.id,
    roomNumber: String(reservation.roomNumber || "").trim(),
    checkInDate: normalizeDate(reservation.checkInDate),
    checkOutDate: normalizeDate(reservation.checkOutDate),
    nights: reservation.nights || "",
    regime: reservation.regime || "",
    groupId: String(reservation.groupId || "").trim(),
    groupName,
    groupKey: groupName ? normalizeName(groupName || reservation.groupId) : "",
    groupRoomIndex: Number(reservation.groupRoomIndex) || 0,
    groupRoomCount: Number(reservation.groupRoomCount) || 0,
    groupCompRoomType: reservation.groupCompRoomType || "",
    groupCompRoomLabel: reservation.groupCompRoomLabel || "",
    guestName: guestName || "Reserva sin pasajero",
    phone: reservation.phone || "",
    email: reservation.email || "",
    total,
    paid: lodgingPaid,
    lodgingPending,
    raw: reservation,
  };
}

function hasRawGuestIdentity(reservation) {
  const raw = reservation && reservation.raw ? reservation.raw : {};
  const responsible = raw.responsible || {};
  const guests = Array.isArray(raw.guests) ? raw.guests : [];
  return Boolean(
    responsible.firstName ||
      responsible.lastName ||
      responsible.document ||
      guests.some(
        (guest) => guest && (guest.firstName || guest.lastName || guest.document || guest.birthDate)
      )
  );
}

function isRawOperationalReservation(reservation) {
  return isOperationalReservation(normalizeReservationForCheckout(reservation));
}

function isOperationalReservation(reservation) {
  if (!reservation || !reservation.roomNumber || !reservation.checkInDate || !reservation.checkOutDate) {
    return false;
  }
  if (reservation.groupName) return true;
  if (reservation.guestName && reservation.guestName !== "Reserva sin pasajero") return true;
  if (hasRawGuestIdentity(reservation)) return true;
  return reservation.total > 0 || reservation.paid > 0 || reservation.lodgingPending > 0;
}

function getIndividualReservations() {
  return getReservations().filter((reservation) => !reservation.groupName);
}

function getGroupedReservations() {
  const groups = new Map();
  getReservations()
    .filter((reservation) => reservation.groupName)
    .forEach((reservation) => {
      const key = reservation.groupKey || normalizeName(reservation.groupName);
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          name: reservation.groupName,
          groupId: reservation.groupId,
          rooms: [],
          checkInDate: reservation.checkInDate,
          checkOutDate: reservation.checkOutDate,
          lodgingTotal: 0,
          lodgingPaid: 0,
          lodgingPending: 0,
        });
      }
      const group = groups.get(key);
      group.rooms.push(reservation);
      group.checkInDate = minDate(group.checkInDate, reservation.checkInDate);
      group.checkOutDate = maxDate(group.checkOutDate, reservation.checkOutDate);
      group.lodgingTotal += reservation.total;
      group.lodgingPaid += reservation.paid;
      group.lodgingPending += reservation.lodgingPending;
    });
  return Array.from(groups.values()).sort((left, right) => left.name.localeCompare(right.name, "es"));
}

function minDate(left, right) {
  if (!left) return right || "";
  if (!right) return left || "";
  return left < right ? left : right;
}

function maxDate(left, right) {
  if (!left) return right || "";
  if (!right) return left || "";
  return left > right ? left : right;
}

function getBeverageState() {
  return state.sources.beverages ? unwrapBeveragePayload(state.sources.beverages) : null;
}

function getActiveShift() {
  const beverages = getBeverageState();
  return beverages && beverages.activeShift ? beverages.activeShift : null;
}

function roomNumberFromRoom(room) {
  const text = String((room && (room.roomLabel || room.label || room.roomId || room.id)) || "");
  const match = text.match(/(\d+)/);
  return match ? match[1] : "";
}

function getRoomBeverageMap() {
  const map = new Map();
  const ensure = (roomNumber) => {
    const key = String(roomNumber || "").trim();
    if (!key) return null;
    if (!map.has(key)) {
      map.set(key, {
        roomNumber: key,
        pendingItems: [],
        pendingTotal: 0,
        deferredItems: [],
        deferredTotal: 0,
        deferredRows: [],
        closedItems: [],
        closedTotal: 0,
        closedRows: [],
      });
    }
    return map.get(key);
  };

  const shift = getActiveShift();
  if (shift && Array.isArray(shift.rooms)) {
    shift.rooms.forEach((room) => {
      const entry = ensure(roomNumberFromRoom(room));
      if (!entry) return;
      const items = Array.isArray(room.items) ? room.items : [];
      entry.pendingItems.push(...items.map((item) => ({ ...item, sourceLabel: room.label || entry.roomNumber })));
      entry.pendingTotal += getCollectionTotal(items);
    });
  }

  const addClosedRoom = (room) => {
    const entry = ensure(roomNumberFromRoom(room));
    if (!entry) return;
    const items = Array.isArray(room.items) ? room.items : [];
    const sourceLabel = room.roomLabel || room.label || entry.roomNumber;
    const total = Number(room.total) || getCollectionTotal(items);
    const itemsWithSource = items.map((item) => ({ ...item, sourceLabel }));
    entry.closedItems.push(...itemsWithSource);
    entry.closedRows.push(room);
    entry.closedTotal += total;
    if (isDeferredStayPayment(room.paymentMethod)) {
      const deferredItems = items.map((item) => ({ ...item, sourceLabel, paymentMethod: "stay" }));
      entry.deferredItems.push(...deferredItems);
      entry.deferredRows.push(room);
      entry.deferredTotal += total;
      entry.pendingItems.push(...deferredItems);
      entry.pendingTotal += total;
    }
  };

  if (shift && Array.isArray(shift.closedRooms)) {
    shift.closedRooms.forEach(addClosedRoom);
  }

  const history = getBeverageState() && Array.isArray(getBeverageState().shiftHistory)
    ? getBeverageState().shiftHistory
    : [];
  history.forEach((historicalShift) => {
    (historicalShift.closedRooms || []).forEach(addClosedRoom);
  });

  return map;
}

function getRoomBeverage(roomNumber) {
  return getRoomBeverageMap().get(String(roomNumber || "").trim()) || {
    roomNumber: String(roomNumber || "").trim(),
    pendingItems: [],
    pendingTotal: 0,
    deferredItems: [],
    deferredTotal: 0,
    deferredRows: [],
    closedItems: [],
    closedTotal: 0,
    closedRows: [],
  };
}

function getDriverCoordinatorGroups() {
  const beverages = getBeverageState();
  if (!beverages || !Array.isArray(beverages.driverCoordinatorGroups)) return [];
  return beverages.driverCoordinatorGroups.filter((group) => group && group.archived !== true);
}

function getDriverCoordinatorItems() {
  const beverages = getBeverageState();
  if (!beverages) return [];
  const accounts = Array.isArray(beverages.driverCoordinatorAccounts)
    ? beverages.driverCoordinatorAccounts
    : [];
  return accounts.filter((item) => item && item.quantity > 0);
}

function getDriverItemGroupName(item) {
  return String((item && (item.driverCoordinatorGroupName || item.groupName)) || "").trim();
}

function getDriverItemGroupId(item) {
  return String((item && (item.driverCoordinatorGroupId || item.groupId)) || "").trim();
}

function getDriverItemMemberName(item) {
  return String(
    (item && (item.driverCoordinatorMemberName || item.memberName || item.staffMemberName)) || ""
  ).trim();
}

function getDriverCoordinatorHistory() {
  const beverages = getBeverageState();
  return beverages && Array.isArray(beverages.driverCoordinatorGroupHistory)
    ? beverages.driverCoordinatorGroupHistory
    : [];
}

function getGroupBeverageByKey(groupKey) {
  const groups = getDriverCoordinatorGroups();
  const matchedGroups = groups.filter((group) => normalizeName(group.name) === groupKey);
  const matchedIds = new Set(matchedGroups.map((group) => group.id));
  const pendingItems = getDriverCoordinatorItems().filter((item) => {
    const itemGroupKey = normalizeName(getDriverItemGroupName(item));
    return itemGroupKey === groupKey || matchedIds.has(getDriverItemGroupId(item));
  });
  const historyRows = getDriverCoordinatorHistory().filter((entry) => {
    const entryGroupKey = normalizeName(entry.groupName || "");
    return entryGroupKey === groupKey || matchedIds.has(entry.groupId);
  });
  return {
    groups: matchedGroups,
    pendingItems,
    pendingTotal: getCollectionTotal(pendingItems),
    historyRows,
    historyTotal: historyRows.reduce((sum, row) => sum + (Number(row.total) || getCollectionTotal(row.items || [])), 0),
  };
}

function getBeverageGroupsFromAllSources() {
  const checkinGroups = getGroupedReservations().map((group) => ({
    key: group.key,
    name: group.name,
    source: "checkin",
  }));
  const beverageGroups = getDriverCoordinatorGroups().map((group) => ({
    key: normalizeName(group.name),
    name: group.name,
    source: "beverages",
  }));
  const map = new Map();
  checkinGroups.concat(beverageGroups).forEach((group) => {
    if (!map.has(group.key)) {
      map.set(group.key, group);
      return;
    }
    const current = map.get(group.key);
    current.source = current.source === group.source ? current.source : "ambos";
  });
  return Array.from(map.values()).sort((left, right) => left.name.localeCompare(right.name, "es"));
}

function getReportableGroups() {
  const today = getTodayInputDate();
  const departedCheckinGroups = getGroupedReservations()
    .filter((group) => group.checkOutDate && group.checkOutDate <= today)
    .map((group) => ({
      key: group.key,
      name: group.name,
      source: "checkin",
    }));
  const beverageGroups = getDriverCoordinatorGroups().map((group) => ({
    key: normalizeName(group.name),
    name: group.name,
    source: "beverages",
  }));
  const map = new Map();
  departedCheckinGroups.concat(beverageGroups).forEach((group) => {
    if (!map.has(group.key)) {
      map.set(group.key, group);
      return;
    }
    const current = map.get(group.key);
    current.source = current.source === group.source ? current.source : "ambos";
  });
  return Array.from(map.values()).sort((left, right) => left.name.localeCompare(right.name, "es"));
}

function getCheckoutRows() {
  const roomMap = getRoomBeverageMap();
  return getReservations().map((reservation) => {
    const beverage = roomMap.get(reservation.roomNumber) || getRoomBeverage(reservation.roomNumber);
    const key = `reservation:${reservation.id}`;
    const settlement = state.settlements[key] || null;
    const rawDueTotal = reservation.lodgingPending + beverage.pendingTotal;
    const dueTotal = settlement ? 0 : rawDueTotal;
    return {
      key,
      reservation,
      beverage,
      dueTotal,
      rawDueTotal,
      settlement,
    };
  });
}

function getVisibleCheckoutRows() {
  const oldestVisibleDate = addDaysToInputDate(getTodayInputDate(), -1);
  return getCheckoutRows().filter((row) => {
    const checkOutDate = normalizeDate(row.reservation.checkOutDate);
    return !checkOutDate || checkOutDate >= oldestVisibleDate;
  });
}

function getGroupCheckoutRows() {
  const roomMap = getRoomBeverageMap();
  return getGroupedReservations().map((group) => {
    const roomBeverageTotal = group.rooms.reduce((sum, reservation) => {
      const beverage = roomMap.get(reservation.roomNumber);
      return sum + (beverage ? beverage.pendingTotal : 0);
    }, 0);
    const driverCoordinator = getGroupBeverageByKey(group.key);
    const key = `group:${group.key}`;
    const settlement = state.settlements[key] || null;
    const rawDueTotal = group.lodgingPending + roomBeverageTotal + driverCoordinator.pendingTotal;
    return {
      key,
      group,
      roomBeverageTotal,
      driverCoordinator,
      dueTotal: settlement ? 0 : rawDueTotal,
      rawDueTotal,
      settlement,
    };
  });
}

function getDashboardSummary() {
  const reservations = getReservations();
  const groups = getGroupedReservations();
  const roomMap = getRoomBeverageMap();
  const checkoutRows = getCheckoutRows();
  const groupRows = getGroupCheckoutRows();
  const settledGroupKeys = new Set(
    groupRows.filter((row) => row.settlement).map((row) => row.group.key).filter(Boolean)
  );
  const settledRoomNumbers = new Set(
    [
      ...checkoutRows
        .filter((row) => row.settlement || settledGroupKeys.has(row.reservation.groupKey))
        .map((row) => row.reservation.roomNumber),
      ...groupRows
        .filter((row) => row.settlement)
        .flatMap((row) => row.group.rooms.map((reservation) => reservation.roomNumber)),
    ].filter(Boolean)
  );
  const pendingBeverages = Array.from(roomMap.values()).reduce(
    (sum, entry) => sum + (settledRoomNumbers.has(entry.roomNumber) ? 0 : entry.pendingTotal),
    0
  );
  const lodgingPending = checkoutRows.reduce(
    (sum, row) =>
      sum + (settledGroupKeys.has(row.reservation.groupKey) ? 0 : getCheckoutLodgingPending(row)),
    0
  );
  const groupDriverPending = groupRows
    .filter((row) => !row.settlement)
    .reduce((sum, row) => sum + row.driverCoordinator.pendingTotal, 0);
  const dueTotal = lodgingPending + pendingBeverages + groupDriverPending;
  return {
    reservations: reservations.length,
    groups: groups.length,
    lodgingPending,
    pendingBeverages,
    groupDriverPending,
    dueTotal,
  };
}

function createCashboxTotals() {
  return {
    hotel: { cash: 0, transfer: 0, adjustedCash: 0 },
    beverages: { cash: 0, transfer: 0, adjustedCash: 0 },
    transfers: normalizeCashTransfers(state.cashTransfers),
    withdrawals: normalizeCashWithdrawals(state.cashWithdrawals),
  };
}

function addCashboxAmount(totals, box, method, amount) {
  const targetBox = normalizeCashboxKey(box);
  const paymentMethod = normalizePaymentMethod(method);
  const value = Number(amount) || 0;
  if (!targetBox || value <= 0) return;
  if (paymentMethod !== "cash" && paymentMethod !== "transfer") return;
  totals[targetBox][paymentMethod] += value;
}

function addReservationPaymentsToCashboxes(totals) {
  getReservations().forEach((reservation) => {
    const raw = reservation.raw || {};
    addCashboxAmount(totals, "hotel", "cash", parseAmount(raw.cash));
    addCashboxAmount(totals, "hotel", "transfer", parseAmount(raw.transfer));
    addCashboxAmount(
      totals,
      "hotel",
      raw.depositPaymentMethod,
      parseAmount(raw.depositAmount)
    );
  });
}

function getClosedRoomTotal(room) {
  return Number(room && room.total) || getCollectionTotal((room && room.items) || []);
}

function addBeverageShiftPaymentsToCashboxes(totals, shift) {
  if (!shift) return;
  (Array.isArray(shift.closedRooms) ? shift.closedRooms : []).forEach((room) => {
    addCashboxAmount(totals, "beverages", room.paymentMethod, getClosedRoomTotal(room));
  });
  (Array.isArray(shift.cashierSales) ? shift.cashierSales : []).forEach((item) => {
    addCashboxAmount(totals, "beverages", item.paymentMethod, getCollectionTotal([item]));
  });
}

function addBeveragePaymentsToCashboxes(totals) {
  const beverages = getBeverageState();
  if (!beverages) return;
  addBeverageShiftPaymentsToCashboxes(totals, beverages.activeShift);
  (Array.isArray(beverages.shiftHistory) ? beverages.shiftHistory : []).forEach((shift) => {
    addBeverageShiftPaymentsToCashboxes(totals, shift);
  });
  (Array.isArray(beverages.driverCoordinatorGroupHistory)
    ? beverages.driverCoordinatorGroupHistory
    : []
  ).forEach((entry) => {
    addCashboxAmount(
      totals,
      "beverages",
      entry.paymentMethod,
      Number(entry.total) || getCollectionTotal(entry.items || [])
    );
  });
}

function addCheckoutSettlementsToCashboxes(totals) {
  Object.values(state.settlements || {}).forEach((settlement) => {
    const method = normalizePaymentMethod(settlement.paymentMethod || settlement.method);
    addCashboxAmount(totals, "hotel", method, Number(settlement.lodgingAmount) || 0);
    addCashboxAmount(totals, "beverages", method, Number(settlement.beverageAmount) || 0);
  });
}

function applyCashTransfers(totals) {
  totals.hotel.adjustedCash = totals.hotel.cash;
  totals.beverages.adjustedCash = totals.beverages.cash;
  totals.transfers.forEach((transfer) => {
    totals[transfer.from].adjustedCash -= transfer.amount;
    totals[transfer.to].adjustedCash += transfer.amount;
  });
  totals.withdrawals.forEach((withdrawal) => {
    totals[withdrawal.box].adjustedCash -= withdrawal.amount;
  });
}

function getCashboxTotals() {
  const totals = createCashboxTotals();
  addReservationPaymentsToCashboxes(totals);
  addBeveragePaymentsToCashboxes(totals);
  addCheckoutSettlementsToCashboxes(totals);
  applyCashTransfers(totals);
  return totals;
}

function getCashboxLabel(box) {
  return box === "hotel" ? "Hotel" : "Estaci\u00f3n de bebidas";
}

function hasOpenModal() {
  return ui.reportModalOpen || Boolean(ui.settlementModal) || Boolean(ui.cashWithdrawalModal);
}

function recordCashTransfer(from, to) {
  const source = normalizeCashboxKey(from);
  const target = normalizeCashboxKey(to);
  if (!source || !target || source === target) return;
  const amount = parseAmount(
    window.prompt(
      `Monto de efectivo que presta ${getCashboxLabel(source)} a ${getCashboxLabel(target)}:`,
      ""
    )
  );
  if (amount <= 0) return;
  state.cashTransfers = normalizeCashTransfers(state.cashTransfers);
  state.cashTransfers.unshift({
    id: `cash-transfer-${Date.now()}`,
    from: source,
    to: target,
    amount,
    createdAt: new Date().toISOString(),
    note: "Prestamo interno de efectivo",
  });
  persistState(`Pr\u00e9stamo registrado: ${getCashboxLabel(source)} a ${getCashboxLabel(target)}.`);
  render();
}

function openCashWithdrawalModal(box) {
  const source = normalizeCashboxKey(box);
  if (!source) return;
  const cashboxes = getCashboxTotals();
  ui.cashWithdrawalModal = {
    box: source,
    amount: "",
    available: cashboxes[source].adjustedCash,
    error: "",
  };
  render();
}

function closeCashWithdrawalModal() {
  ui.cashWithdrawalModal = null;
  render();
}

function confirmCashWithdrawal() {
  const modal = ui.cashWithdrawalModal;
  if (!modal) return;
  const source = normalizeCashboxKey(modal.box);
  if (!source) return;
  const input = document.querySelector("[data-action-input='cash-withdrawal-amount']");
  const typedAmount = input ? input.value : modal.amount;
  const amount = parseAmount(typedAmount);
  const cashboxes = getCashboxTotals();
  const available = cashboxes[source].adjustedCash;
  ui.cashWithdrawalModal = {
    ...modal,
    box: source,
    amount: typedAmount,
    available,
    error: "",
  };
  if (amount <= 0) {
    ui.cashWithdrawalModal.error = "Carga un monto mayor a cero para retirar efectivo.";
    render();
    return;
  }
  if (amount > available) {
    ui.cashWithdrawalModal.error = `No se puede retirar ${formatMoney(amount)}. Disponible: ${formatMoney(available)}.`;
    render();
    return;
  }
  state.cashWithdrawals = normalizeCashWithdrawals(state.cashWithdrawals);
  state.cashWithdrawals.unshift({
    id: `cash-withdrawal-${Date.now()}`,
    box: source,
    amount,
    createdAt: new Date().toISOString(),
    note: "Retiro de efectivo",
  });
  ui.cashWithdrawalModal = null;
  persistState(`Retiro registrado en ${getCashboxLabel(source)}.`);
  render();
}

function isAfterCheckoutAlertStart(date = new Date()) {
  return date.getHours() >= 7;
}

function isAfterCheckoutDeadline(date = new Date()) {
  return date.getHours() >= 20;
}

function isCheckoutRowPastDeadline(row, date = new Date()) {
  const today = getTodayInputDate();
  const checkOutDate = row && row.reservation
    ? row.reservation.checkOutDate
    : row && row.group
      ? row.group.checkOutDate
      : "";
  return Boolean(
    row &&
      !row.settlement &&
      row.rawDueTotal > 0 &&
      checkOutDate &&
      checkOutDate <= today &&
      isAfterCheckoutDeadline(date)
  );
}

function createAutomaticCheckoutSettlement(row) {
  return {
    paidAt: new Date().toISOString(),
    amount: 0,
    method: "Autoarchivado sin saldo",
    paymentMethod: "none",
    lodgingAmount: 0,
    beverageAmount: 0,
    automatic: true,
  };
}

function autoArchiveClearCheckouts() {
  if (!isAfterCheckoutDeadline()) return false;
  const today = getTodayInputDate();
  const rows = [...getCheckoutRows(), ...getGroupCheckoutRows()];
  let changed = false;
  rows.forEach((row) => {
    const checkOutDate = row.reservation ? row.reservation.checkOutDate : row.group && row.group.checkOutDate;
    if (!row.settlement && row.rawDueTotal <= 0 && checkOutDate && checkOutDate <= today) {
      state.settlements[row.key] = createAutomaticCheckoutSettlement(row);
      changed = true;
    }
  });
  if (changed) {
    persistState();
  }
  return changed;
}

function getTodayDepartures() {
  const today = getTodayInputDate();
  return getCheckoutRows()
    .filter((row) => row.reservation.checkOutDate === today)
    .sort((left, right) => Number(left.reservation.roomNumber || 0) - Number(right.reservation.roomNumber || 0));
}

function getTodayArrivals() {
  const today = getTodayInputDate();
  return getReservations()
    .filter((reservation) => reservation.checkInDate === today)
    .sort((left, right) => Number(left.roomNumber || 0) - Number(right.roomNumber || 0));
}

function getDashboardMealGuestCount(reservation) {
  const guests = Array.isArray(reservation && reservation.guests) ? reservation.guests : [];
  const filledGuests = guests.filter((guest) => guest && hasGuestIdentity(guest)).length;
  return Math.max(1, guests.length, filledGuests);
}

function getDashboardMealSummary(date = getTodayInputDate()) {
  const targetDate = normalizeDate(date) || getTodayInputDate();
  const reservations =
    state.sources.checkin && Array.isArray(state.sources.checkin.reservations)
      ? state.sources.checkin.reservations
      : [];

  return reservations.reduce(
    (summary, reservation) => {
      const checkInDate = normalizeDate(reservation && reservation.checkInDate);
      const checkOutDate = normalizeDate(reservation && reservation.checkOutDate);
      if (
        !reservation ||
        reservation.archived === true ||
        !reservation.confirmedAt ||
        !checkInDate ||
        !checkOutDate ||
        targetDate < checkInDate ||
        targetDate >= checkOutDate
      ) {
        return summary;
      }

      const guestCount = getDashboardMealGuestCount(reservation);
      const regime = slugify(reservation.regime);
      if (regime === "pension-completa") {
        summary.lunch += guestCount;
        summary.dinner += guestCount;
      } else if (regime === "media-pension") {
        summary.dinner += guestCount;
      }
      return summary;
    },
    { lunch: 0, dinner: 0 }
  );
}

function getDashboardOccupancySummary(date = getTodayInputDate()) {
  const targetDate = normalizeDate(date) || getTodayInputDate();
  const summary = ROOM_OPTIONS.reduce(
    (result, roomNumber) => {
      const descriptor = getRoomTimelineDescriptor(roomNumber, targetDate);
      if (descriptor.status === "maintenance") {
        result.maintenance += 1;
      } else if (descriptor.status === "occupied") {
        result.occupied += 1;
      } else {
        result.available += 1;
      }
      return result;
    },
    { occupied: 0, available: 0, maintenance: 0 }
  );
  const operational = summary.occupied + summary.available;
  return {
    ...summary,
    total: ROOM_OPTIONS.length,
    operational,
    percentage: operational ? Math.round((summary.occupied / operational) * 100) : 0,
  };
}

function getMenuTimelineDate() {
  return normalizeDate(ui.menuTimelineDate) || getTodayInputDate();
}

function normalizeRoomNumber(value) {
  const match = String(value || "").trim().match(/\d+/);
  return match ? String(Number(match[0])) : "";
}

function getRoomProfile(roomNumber) {
  return ROOM_CATALOG[normalizeRoomNumber(roomNumber)] || null;
}

function isRoomUnderMaintenance(roomNumber) {
  const source = state.sources.checkin || {};
  const maintenance = source.roomMaintenance && typeof source.roomMaintenance === "object"
    ? source.roomMaintenance
    : {};
  return Boolean(maintenance[normalizeRoomNumber(roomNumber)]);
}

function hasValidTimelineStay(startDate, endDate) {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);
  return Boolean(start && end && start < end);
}

function dateRangesOverlap(startA, endA, startB, endB) {
  const normalizedStartA = normalizeDate(startA);
  const normalizedEndA = normalizeDate(endA);
  const normalizedStartB = normalizeDate(startB);
  const normalizedEndB = normalizeDate(endB);
  if (
    !hasValidTimelineStay(normalizedStartA, normalizedEndA) ||
    !hasValidTimelineStay(normalizedStartB, normalizedEndB)
  ) {
    return false;
  }
  return normalizedStartA < normalizedEndB && normalizedEndA > normalizedStartB;
}

function getTimelineReservations() {
  const reservations =
    state.sources.checkin && Array.isArray(state.sources.checkin.reservations)
      ? state.sources.checkin.reservations
      : [];

  return reservations
    .filter((reservation) => reservation && reservation.archived !== true)
    .map(normalizeReservationForCheckout)
    .filter(
      (reservation) =>
        normalizeRoomNumber(reservation.roomNumber) &&
        hasValidTimelineStay(reservation.checkInDate, reservation.checkOutDate)
    )
    .sort((left, right) => {
      const dateCompare = String(left.checkInDate || "").localeCompare(
        String(right.checkInDate || "")
      );
      if (dateCompare !== 0) return dateCompare;
      return Number(left.roomNumber || 0) - Number(right.roomNumber || 0);
    });
}

function getRoomOccupantForTimeline(roomNumber, date) {
  const room = normalizeRoomNumber(roomNumber);
  const targetDate = normalizeDate(date);
  const nextDate = addDaysToInputDate(targetDate, 1);
  if (!room || !targetDate || !nextDate) return null;
  return (
    getTimelineReservations()
      .filter(
        (reservation) =>
          normalizeRoomNumber(reservation.roomNumber) === room &&
          dateRangesOverlap(targetDate, nextDate, reservation.checkInDate, reservation.checkOutDate)
      )
      .sort((left, right) => String(left.checkInDate).localeCompare(String(right.checkInDate)))[0] ||
    null
  );
}

function getRoomReservationByBoundary(roomNumber, boundaryField, date) {
  const room = normalizeRoomNumber(roomNumber);
  const targetDate = normalizeDate(date);
  if (!room || !targetDate) return null;
  return (
    getTimelineReservations()
      .filter(
        (reservation) =>
          normalizeRoomNumber(reservation.roomNumber) === room &&
          normalizeDate(reservation[boundaryField]) === targetDate
      )
      .sort((left, right) => String(left.id || "").localeCompare(String(right.id || "")))[0] ||
    null
  );
}

function getRoomTimelineDescriptor(roomNumber, referenceDate = getMenuTimelineDate()) {
  const targetDate = normalizeDate(referenceDate) || getTodayInputDate();
  const maintenance = isRoomUnderMaintenance(roomNumber);
  const conflictReservation = getRoomOccupantForTimeline(roomNumber, targetDate);
  const arrivalReservation = getRoomReservationByBoundary(roomNumber, "checkInDate", targetDate);
  const departureReservation = getRoomReservationByBoundary(roomNumber, "checkOutDate", targetDate);

  let status = "available";
  if (maintenance) {
    status = "maintenance";
  } else if (conflictReservation) {
    status = "occupied";
  }

  return {
    roomNumber,
    roomProfile: getRoomProfile(roomNumber),
    referenceDate: targetDate,
    maintenance,
    conflictReservation,
    arrivalReservation,
    departureReservation,
    status,
  };
}

function isHslColor(value) {
  return /^hsl\(\s*[\d.]+\s+[\d.]+%\s+[\d.]+%\s*\)$/i.test(String(value || "").trim());
}

function hashText(value) {
  return String(value || "").split("").reduce((hash, char) => {
    return (hash * 31 + char.charCodeAt(0)) >>> 0;
  }, 17);
}

function getDefaultGroupColor(seed = "") {
  const index = hashText(seed || "Solanas") % 200;
  const hue = Math.round((index * 137.508) % 360);
  const saturation = [62, 72, 68, 78, 58][index % 5];
  const lightness = [46, 54, 42, 60, 50][Math.floor(index / 5) % 5];
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function getDefaultReservationColor(seed = "") {
  const index = (hashText(seed || "Reserva particular") + 73) % 200;
  const hue = Math.round((index * 137.508) % 360);
  const saturation = [62, 72, 68, 78, 58][index % 5];
  const lightness = [46, 54, 42, 60, 50][Math.floor(index / 5) % 5];
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function getReservationColorSeed(reservation) {
  if (!reservation) return "Reserva particular";
  return (
    [reservation.id, reservation.checkInDate, reservation.checkOutDate, reservation.roomNumber]
      .filter(Boolean)
      .join("|") || "Reserva particular"
  );
}

function getRgbChannelsFromColor(color) {
  const value = String(color || "").trim();
  const hexMatch = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    const normalized = hex.length === 3 ? hex.split("").map((part) => part + part).join("") : hex;
    return [
      Number.parseInt(normalized.slice(0, 2), 16),
      Number.parseInt(normalized.slice(2, 4), 16),
      Number.parseInt(normalized.slice(4, 6), 16),
    ];
  }

  const rgbMatch = value.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)$/i
  );
  if (rgbMatch) {
    return rgbMatch.slice(1, 4).map((channel) => Math.max(0, Math.min(255, Number(channel))));
  }

  const hslMatch = value.match(
    /^hsla?\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%(?:\s*\/\s*[\d.]+)?\s*\)$/i
  );
  if (!hslMatch) {
    return null;
  }

  const hue = ((Number(hslMatch[1]) % 360) + 360) % 360;
  const saturation = Math.max(0, Math.min(100, Number(hslMatch[2]))) / 100;
  const lightness = Math.max(0, Math.min(100, Number(hslMatch[3]))) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = hue / 60;
  const secondComponent = chroma * (1 - Math.abs((segment % 2) - 1));
  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment >= 0 && segment < 1) {
    red = chroma;
    green = secondComponent;
  } else if (segment < 2) {
    red = secondComponent;
    green = chroma;
  } else if (segment < 3) {
    green = chroma;
    blue = secondComponent;
  } else if (segment < 4) {
    green = secondComponent;
    blue = chroma;
  } else if (segment < 5) {
    red = secondComponent;
    blue = chroma;
  } else {
    red = chroma;
    blue = secondComponent;
  }

  const match = lightness - chroma / 2;
  return [red, green, blue].map((channel) => Math.round((channel + match) * 255));
}

function getRelativeLuminance([red, green, blue]) {
  const normalizeChannel = (channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * normalizeChannel(red) +
    0.7152 * normalizeChannel(green) +
    0.0722 * normalizeChannel(blue)
  );
}

function getReadableInkForGroupColor(color) {
  const rgbChannels = getRgbChannelsFromColor(color);
  if (!rgbChannels) {
    return "#ffffff";
  }
  return getRelativeLuminance(rgbChannels) >= 0.42 ? "#111111" : "#ffffff";
}

function getReservationCompanyLabel(reservation) {
  return String((reservation && reservation.groupName) || "").trim();
}

function getReservationGroupColor(reservation) {
  const company = getReservationCompanyLabel(reservation);
  if (!company) return "";
  const rawColor = String((reservation && reservation.raw && reservation.raw.groupColor) || "").trim();
  return isHslColor(rawColor) ? rawColor : getDefaultGroupColor(company);
}

function getReservationGroupInitial(reservation) {
  const company = getReservationCompanyLabel(reservation);
  if (!company) return "";
  const rawInitial = String((reservation && reservation.raw && reservation.raw.groupInitial) || "").trim();
  const fallback = company
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2);
  return (rawInitial || fallback || "G").toUpperCase();
}

function getReservationIndividualColor(reservation) {
  const rawColor = String((reservation && reservation.raw && reservation.raw.reservationColor) || "").trim();
  return isHslColor(rawColor)
    ? rawColor
    : getDefaultReservationColor(getReservationColorSeed(reservation));
}

function getTimelineReservationPaint(reservation) {
  const company = getReservationCompanyLabel(reservation);
  if (company) {
    const color = getReservationGroupColor(reservation);
    return {
      color,
      ink: getReadableInkForGroupColor(color),
      initial: getReservationGroupInitial(reservation),
      isGroup: true,
    };
  }
  const color = getReservationIndividualColor(reservation);
  return {
    color,
    ink: getReadableInkForGroupColor(color) || TIMELINE_INDIVIDUAL_INK,
    initial: "",
    isGroup: false,
  };
}

function formatStayRange(checkInDate, checkOutDate) {
  const start = normalizeDate(checkInDate);
  const end = normalizeDate(checkOutDate);
  if (!start || !end) return "Fechas pendientes";
  return `${formatDate(start)} al ${formatDate(end)}`;
}

function buildTimelineReservationTitle(reservation) {
  if (!reservation) return "";
  const guestLabel = reservation.guestName === "Reserva sin pasajero" ? "" : reservation.guestName;
  const groupLabel = getReservationCompanyLabel(reservation);
  const label = groupLabel ? `Grupo ${groupLabel}` : guestLabel;
  return [`Hab. ${reservation.roomNumber || "-"}`, label].filter(Boolean).join(" · ");
}

function renderDashboardGuestLine(reservation) {
  const guestLabel = reservation.guestName === "Reserva sin pasajero" ? "" : reservation.guestName;
  return [
    guestLabel,
    reservation.groupName ? `Grupo ${reservation.groupName}` : "",
    reservation.regime || "",
  ]
    .filter(Boolean)
    .join(" · ");
}

function getRowStateLabel(row) {
  if (row.settlement) return { label: "Check-out registrado", className: "is-paid" };
  if (isCheckoutRowPastDeadline(row)) return { label: "Deuda vencida", className: "is-danger" };
  if (row.dueTotal > 0) return { label: "Debe revisar cobro", className: "is-due" };
  return { label: "Sin saldo detectado", className: "is-ok" };
}

function getCheckoutPaidAmount(row) {
  if (!row || !row.reservation) return 0;
  const checkinPaid = Number(row.reservation.paid) || 0;
  const checkoutPaid = row.settlement ? Number(row.settlement.lodgingAmount) || 0 : 0;
  return checkinPaid + checkoutPaid;
}

function getCheckoutLodgingPending(row) {
  if (!row || !row.reservation) return 0;
  const pending = Number(row.reservation.lodgingPending) || 0;
  const checkoutPaid = row.settlement ? Number(row.settlement.lodgingAmount) || 0 : 0;
  return Math.max(pending - checkoutPaid, 0);
}

function getCheckoutRowForReservation(reservation) {
  if (!reservation) return null;
  return getCheckoutRows().find((row) => row.reservation.id === reservation.id) || null;
}

function getReportReservationPaid(reservation) {
  const checkoutRow = getCheckoutRowForReservation(reservation);
  return checkoutRow ? getCheckoutPaidAmount(checkoutRow) : Number(reservation && reservation.paid) || 0;
}

function getReportReservationPending(reservation) {
  const checkoutRow = getCheckoutRowForReservation(reservation);
  return checkoutRow
    ? getCheckoutLodgingPending(checkoutRow)
    : Number(reservation && reservation.lodgingPending) || 0;
}

function getCheckoutHistoryRows() {
  return getCheckoutRows()
    .filter((row) => row.settlement)
    .sort((left, right) =>
      String(right.settlement.paidAt || "").localeCompare(String(left.settlement.paidAt || ""))
    );
}

function findCheckoutRowByKey(key) {
  return (
    getCheckoutRows().find((row) => row.key === key) ||
    getGroupCheckoutRows().find((row) => row.key === key) ||
    null
  );
}

function getSettlementBreakdown(row) {
  if (!row) {
    return { lodgingAmount: 0, beverageAmount: 0 };
  }
  if (row.reservation) {
    return {
      lodgingAmount: Number(row.reservation.lodgingPending) || 0,
      beverageAmount: Number(row.beverage && row.beverage.pendingTotal) || 0,
    };
  }
  return {
    lodgingAmount: Number(row.group && row.group.lodgingPending) || 0,
    beverageAmount:
      (Number(row.roomBeverageTotal) || 0) +
      (Number(row.driverCoordinator && row.driverCoordinator.pendingTotal) || 0),
  };
}

function openSettlementModal(key) {
  const row = findCheckoutRowByKey(key);
  if (!row || row.settlement) return;
  if ((Number(row.dueTotal) || 0) <= 0) return;
  const breakdown = getSettlementBreakdown(row);
  ui.settlementModal = {
    key,
    amount: Number(row.dueTotal) || 0,
    lodgingAmount: breakdown.lodgingAmount,
    beverageAmount: breakdown.beverageAmount,
    title: row.reservation
      ? `Hab ${row.reservation.roomNumber || "-"} - ${row.reservation.guestName}`
      : `Grupo ${row.group.name}`,
  };
  render();
}

function closeSettlementModal() {
  ui.settlementModal = null;
  render();
}

function markSettlement(key, method) {
  const row = findCheckoutRowByKey(key);
  const amount = row ? Number(row.rawDueTotal ?? row.dueTotal) || 0 : 0;
  const breakdown = getSettlementBreakdown(row);
  const paymentMethod = normalizePaymentMethod(method);
  state.settlements[key] = {
    paidAt: new Date().toISOString(),
    amount,
    method: getPaymentMethodLabel(paymentMethod),
    paymentMethod,
    lodgingAmount: breakdown.lodgingAmount,
    beverageAmount: breakdown.beverageAmount,
  };
  ui.settlementModal = null;
  persistState("Check-out registrado en el sistema.");
  render();
}

function clearSettlement(key) {
  delete state.settlements[key];
  persistState("Se quitó la marca de check-out.");
  render();
}

function sourceStatus(source) {
  const payload = state.sources[source];
  const meta = state.sourceMeta[source];
  if (!payload) {
    return {
      ready: false,
      title: "Sin conectar",
      detail: "Importá un respaldo JSON o intentá leer el estado local visible para esta ventana.",
    };
  }
  if (source === "checkin") {
    const count = Array.isArray(payload.reservations) ? payload.reservations.length : 0;
    return {
      ready: true,
      title: `${count} reservas cargadas`,
      detail: `Última toma: ${meta ? formatDateTime(meta.importedAt) : "sin marca"}.`,
    };
  }
  const shift = payload.activeShift || {};
  const roomCount = Array.isArray(shift.rooms)
    ? shift.rooms.filter((room) => Array.isArray(room.items) && room.items.length).length
    : 0;
  return {
    ready: true,
    title: `${roomCount} habitaciones con consumo abierto`,
    detail: `Última toma: ${meta ? formatDateTime(meta.importedAt) : "sin marca"}.`,
  };
}

function getSessionAllowedModuleKeys() {
  const configuredModules = window.BLUE_COAST_AUTH_SESSION?.allowedModules;
  if (!Array.isArray(configuredModules)) return [];
  const allowedSet = new Set(configuredModules.map((key) => String(key || "").trim()));
  return Object.keys(MODULES).filter((key) => allowedSet.has(key));
}

function getAllowedModuleEntries() {
  const allowedKeys = new Set(getSessionAllowedModuleKeys());
  return Object.entries(MODULES).filter(([key]) => allowedKeys.has(key));
}

function canAccessModule(moduleKey) {
  return getSessionAllowedModuleKeys().includes(moduleKey);
}

function getDefaultAllowedModule() {
  const allowedModules = getSessionAllowedModuleKeys();
  const configuredDefault = String(
    window.BLUE_COAST_AUTH_SESSION?.defaultModule || ""
  ).trim();
  return allowedModules.includes(configuredDefault)
    ? configuredDefault
    : allowedModules[0] || "menu";
}

function resolveModuleFromHash() {
  const key = String(window.location.hash || "")
    .replace(/^#/, "")
    .split(/[/?&]/)[0];
  const checkoutSectionHashes = new Set([
    "checkout-section",
    "groups-section",
    "beverages-section",
    "reports-section",
  ]);
  if (key === "guest-register-section") return "registro";
  if (checkoutSectionHashes.has(key)) return "checkout";
  return Object.prototype.hasOwnProperty.call(MODULES, key) ? key : "menu";
}

function getActiveModule() {
  const requestedModule = resolveModuleFromHash();
  return canAccessModule(requestedModule) ? requestedModule : getDefaultAllowedModule();
}

function enforceModuleAccess(activeModule) {
  const requestedModule = resolveModuleFromHash();
  if (requestedModule === activeModule) return;
  const nextUrl = `${window.location.pathname}${window.location.search}#${activeModule}`;
  window.history.replaceState(null, "", nextUrl);
}

function getTimelineViewportAnchor(timelineWrap) {
  if (!timelineWrap) {
    return null;
  }

  return (
    timelineWrap.querySelector(".timeline-day-button.is-selected") ||
    timelineWrap.querySelector(".timeline-day-button.is-today") ||
    timelineWrap.querySelector(".timeline-day-button")
  );
}

function getDefaultTimelineScrollLeft(timelineWrap, anchorButton) {
  if (!timelineWrap || !anchorButton) {
    return 0;
  }

  const maxScrollLeft = Math.max(0, timelineWrap.scrollWidth - timelineWrap.clientWidth);
  if (maxScrollLeft <= 0) {
    return 0;
  }

  const wrapRect = timelineWrap.getBoundingClientRect();
  const anchorRect = anchorButton.getBoundingClientRect();
  const anchorCenter =
    anchorRect.left -
    wrapRect.left +
    timelineWrap.scrollLeft +
    anchorRect.width / 2;
  const visibleStart = timelineWrap.scrollLeft;
  const visibleEnd = visibleStart + timelineWrap.clientWidth;
  const comfortStart = visibleStart + timelineWrap.clientWidth * 0.18;
  const comfortEnd = visibleEnd - timelineWrap.clientWidth * 0.18;

  if (anchorCenter >= comfortStart && anchorCenter <= comfortEnd) {
    return timelineWrap.scrollLeft;
  }

  const centeredScrollLeft = anchorCenter - timelineWrap.clientWidth / 2;
  const clampedScrollLeft = Math.max(0, Math.min(maxScrollLeft, centeredScrollLeft));
  return clampedScrollLeft < 24 ? 0 : clampedScrollLeft;
}

function getMenuTimelineViewportKey(referenceDate = getMenuTimelineDate()) {
  return normalizeDate(referenceDate) || getTodayInputDate();
}

function setMenuTimelineScrollForKey(referenceDate, scrollLeft) {
  ui.menuTimelineScrollByKey[getMenuTimelineViewportKey(referenceDate)] = Math.max(
    0,
    Number(scrollLeft) || 0
  );
}

function applyMenuTimelineViewport() {
  const timelineWrap = document.querySelector("[data-menu-timeline-wrap]");
  if (!timelineWrap) {
    return;
  }

  const applyScroll = () => {
    const currentKey = getMenuTimelineViewportKey();
    const savedScrollLeft = ui.menuTimelineScrollByKey[currentKey];
    const nextScrollLeft =
      typeof savedScrollLeft === "number" && Number.isFinite(savedScrollLeft)
        ? savedScrollLeft
        : getDefaultTimelineScrollLeft(
            timelineWrap,
            getTimelineViewportAnchor(timelineWrap)
          );
    timelineWrap.scrollLeft = nextScrollLeft;
  };

  applyScroll();
  window.requestAnimationFrame(applyScroll);
}

function render(options = {}) {
  const { preserveScroll = false } = options;
  const windowScrollX = preserveScroll ? window.scrollX : 0;
  const windowScrollY = preserveScroll ? window.scrollY : 0;
  const currentMainScrollTop = preserveScroll
    ? document.querySelector(".app-main")?.scrollTop || 0
    : 0;
  const root = document.getElementById("app");
  const activeModule = getActiveModule();
  enforceModuleAccess(activeModule);
  const isOriginalSystem =
    activeModule === "reservas" || activeModule === "checkin" || activeModule === "bebidas";
  applyThemePreference(ui.theme);
  if (!isOriginalSystem) {
    syncFromLocalStorage({ silent: true, renderAfter: false });
  }
  const content = isOriginalSystem
    ? renderOriginalSystemModule(activeModule)
    : activeModule === "checkout"
      ? `${renderBlueCoastShellHeader(activeModule)}${renderCheckoutDashboard()}${renderSystemFooter(
          "Blue Coast concentra Check-in, Bebidas, Check-out, Cajas, Reportes y Libro de hu&eacute;spedes dentro de un mismo sistema."
        )}`
      : activeModule === "cajas"
        ? `${renderBlueCoastShellHeader(activeModule)}${renderCashboxPage()}${renderSystemFooter(
            "Control&aacute; ingresos, arqueos y retiros desde una sola vista operativa."
          )}`
        : activeModule === "registro"
          ? `${renderBlueCoastShellHeader(activeModule)}${renderGuestRegisterDashboard()}${renderSystemFooter(
              "El libro de hu&eacute;spedes se consolida desde las cargas del sistema sin cambiar el flujo de trabajo."
            )}`
          : activeModule === "inventario"
            ? `${renderBlueCoastShellHeader(activeModule)}${renderInventoryPage()}${renderSystemFooter(
                "Stock e Inventario concentra Bebidas, Alimentos y Extras sin duplicar el cat&aacute;logo operativo."
              )}`
            : activeModule === "empleados"
              ? `${renderBlueCoastShellHeader(activeModule)}${renderEmployeesPage()}${renderSystemFooter(
                  "Empleados es ahora la n&oacute;mina central: Bebidas solo replica esta lista para asignar consumos."
                )}`
              : `${renderBlueCoastShellHeader(activeModule)}${renderUnifiedMenu()}${renderSystemFooter(
                  "Blue Coast concentra Check-in, Bebidas, Check-out, Cajas, Reportes y Libro de hu&eacute;spedes dentro de un mismo sistema."
                )}`;

  root.innerHTML = `
    <div class="app-layout ${isOriginalSystem ? "is-module-view" : ""} ${ui.sidebarCollapsed ? "is-sidebar-collapsed" : ""}">
      ${renderBlueCoastSidebar(activeModule)}
      <div class="app-main">
        ${renderTopbar(activeModule)}
        <main class="app-shell ${isOriginalSystem ? "is-module-view" : ""}">
          ${content}
        </main>
      </div>
    </div>
    ${renderThemeToggleButton("theme-toggle-floating")}
    <input id="backup-input" class="hidden" type="file" accept=".json,application/json" />
    ${ui.reportModalOpen ? renderReportModal() : ""}
    ${ui.settlementModal ? renderSettlementModal() : ""}
    ${ui.cashWithdrawalModal ? renderCashWithdrawalModal() : ""}
  `;
  document.body.classList.toggle("has-modal", hasOpenModal());
  document.body.classList.toggle("is-original-system", false);
  applyMenuTimelineViewport();

  if (preserveScroll) {
    const restoreScroll = () => {
      window.scrollTo(windowScrollX, windowScrollY);
      const nextMain = document.querySelector(".app-main");
      if (nextMain) {
        nextMain.scrollTop = currentMainScrollTop;
      }
    };
    restoreScroll();
    window.requestAnimationFrame(restoreScroll);
  }
}

function renderSystemFooter(copy = "") {
  return `
    <div class="footer-note">
      <div class="footer-note-copy">${copy}</div>
      <div class="footer-note-signature">
        <span class="footer-note-kicker">Dise&ntilde;o y desarrollo del sistema</span>
        <strong>Germ&aacute;n F. Gam&oacute;n Lozano</strong>
        <span>Contacto: german.lozano45@gmail.com</span>
        <span>WhatsApp: 3516692361</span>
      </div>
    </div>
  `;
}

function renderSidebar(activeModule) {
  return `
    <aside class="app-sidebar">
      <div class="app-sidebar__header">
        <a class="app-sidebar__brand" href="#${getDefaultAllowedModule()}" aria-label="Ir al inicio permitido">
          <img class="app-sidebar__brand-logo-full" src="${BLUE_COAST_LOGO_URL}" alt="Blue Coast Sistema Hotelero" />
        </a>
        <button
          class="app-sidebar__toggle"
          type="button"
          data-action="toggle-sidebar"
          aria-label="${ui.sidebarCollapsed ? "Expandir menú lateral" : "Retraer menú lateral"}"
          aria-pressed="${ui.sidebarCollapsed ? "true" : "false"}"
        >
          <span aria-hidden="true">${ui.sidebarCollapsed ? "»" : "«"}</span>
        </button>
      </div>
      <nav class="app-sidebar__nav" aria-label="Navegaci&oacute;n principal">
        ${getAllowedModuleEntries()
          .map(
            ([key, module]) => `
              <a
                class="app-sidebar__link ${activeModule === key ? "is-active" : ""}"
                href="#${key}"
                ${ui.sidebarCollapsed ? `aria-label="${escapeHtml(module.label)}" title="${escapeHtml(module.label)}"` : ""}
              >
                <span class="app-sidebar__icon" aria-hidden="true">${escapeHtml(module.icon || "•")}</span>
                <span class="app-sidebar__label">${escapeHtml(module.label)}</span>
              </a>
            `
          )
          .join("")}
      </nav>
    </aside>
  `;
}

function renderBlueCoastSidebar(activeModule) {
  return `
    <aside class="app-sidebar">
      <div class="app-sidebar__header">
        <a class="app-sidebar__brand" href="#${getDefaultAllowedModule()}" aria-label="Ir al inicio permitido">
          <img class="app-sidebar__brand-logo-full" src="${BLUE_COAST_LOGO_URL}" alt="Blue Coast Sistema Hotelero" />
        </a>
        <button
          class="app-sidebar__toggle"
          type="button"
          data-action="toggle-sidebar"
          aria-label="${ui.sidebarCollapsed ? "Expandir menu lateral" : "Retraer menu lateral"}"
          aria-pressed="${ui.sidebarCollapsed ? "true" : "false"}"
        >
          <span class="app-sidebar__toggle-bars" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
      </div>
      <nav class="app-sidebar__nav" aria-label="Navegacion principal">
        ${getAllowedModuleEntries()
          .map(([key, module]) => {
            const iconUrl = getSidebarIconUrl(key);
            const iconMarkup = iconUrl
              ? `<img src="${iconUrl}" data-sidebar-icon-key="${escapeHtml(key)}" alt="" />`
              : escapeHtml(module.icon || "*");
            const collapsedAttrs = ui.sidebarCollapsed
              ? `aria-label="${escapeHtml(module.label)}" title="${escapeHtml(module.label)}"`
              : "";
            return `
              <a
                class="app-sidebar__link ${activeModule === key ? "is-active" : ""}"
                href="#${key}"
                ${collapsedAttrs}
              >
                <span class="app-sidebar__icon" aria-hidden="true">${iconMarkup}</span>
                <span class="app-sidebar__label">${escapeHtml(module.label)}</span>
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

function renderTopbar(activeModule) {
  void activeModule;
  return "";
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

function renderModuleHeroMark(activeModule) {
  const module = MODULES[activeModule] || MODULES.menu;
  const iconUrl = getSidebarIconUrl(activeModule);
  const fallback = escapeHtml((module.icon || module.label || "?").slice(0, 2).toUpperCase());
  return `
    <div class="module-hero-mark" aria-hidden="true">
      ${
        iconUrl
          ? `<img src="${iconUrl}" data-sidebar-icon-key="${escapeHtml(activeModule)}" alt="" />`
          : `<span class="module-hero-mark__fallback">${fallback}</span>`
      }
    </div>
  `;
}

function renderBlueCoastShellHeader(activeModule) {
  const module = MODULES[activeModule];
  return `
    <section id="hero-section" class="hero unified-shell-hero bluecoast-shell-hero">
      <div class="hero-grid">
        <div>
          <div class="brand-row brand-row--module-hero">
            ${renderModuleHeroMark(activeModule)}
            <div class="hero-copy">
              <div class="eyebrow">Blue Coast &middot; Sistema hotelero</div>
              <h1>${escapeHtml(module.title)}</h1>
              <p>${escapeHtml(module.subtitle || "Un sistema hotelero moderno, ordenado y operativo para trabajar desde una sola interfaz.")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderOriginalSystemModule(moduleKey) {
  const module = MODULES[moduleKey];
  return `
    <section class="embedded-module-shell">
      <div class="original-system-stage">
        <iframe class="original-system-frame" src="${module.src}" title="${escapeHtml(module.title)}"></iframe>
      </div>
    </section>
  `;
}

function renderShellHeader(activeModule) {
  return `
    <section id="hero-section" class="hero unified-shell-hero">
      <div class="hero-grid">
        <div>
          <div class="brand-row">
            ${renderLogoSwitcher(activeModule, "is-in-hero")}
            <div>
              <div class="eyebrow">Solanas · sistema</div>
              <h1>${escapeHtml(MODULES[activeModule].title)}</h1>
              <p>Un solo menú para entrar a Check-in, Estación de bebidas, Check-out, Cajas y reportes.</p>
            </div>
          </div>
        </div>
        <div class="hero-status">
          <nav class="hero-nav unified-main-nav" aria-label="Menú principal">
            ${getAllowedModuleEntries()
              .map(
                ([key, module]) => `
                  <a class="${activeModule === key ? "is-active" : ""}" href="#${key}">
                    ${escapeHtml(module.label)}
                  </a>
                `
              )
              .join("")}
          </nav>
        </div>
      </div>
    </section>
  `;
}

function renderLogoSwitcher(activeModule, extraClass = "") {
  return `
    <div class="logo-switcher ${extraClass} ${ui.systemMenuOpen ? "is-open" : ""}">
      <button class="logo-switcher-button brand-logo" type="button" data-action="toggle-system-menu" aria-label="Abrir menú de sistemas">
        <img src="${LOGO_URL}" alt="Solanas" />
      </button>
      <nav class="logo-switcher-menu" aria-label="Cambiar de sistema">
        ${getAllowedModuleEntries()
          .map(
            ([key, module]) => `
              <a class="${activeModule === key ? "is-active" : ""}" href="#${key}">
                ${escapeHtml(module.label)}
              </a>
            `
          )
          .join("")}
      </nav>
    </div>
  `;
}

function renderSystemMenuPopover(activeModule) {
  return `
    <nav class="system-menu-popover" aria-label="Cambiar de sistema">
      ${getAllowedModuleEntries()
        .map(
          ([key, module]) => `
            <a class="${activeModule === key ? "is-active" : ""}" href="#${key}">
              ${escapeHtml(module.label)}
            </a>
          `
        )
        .join("")}
    </nav>
  `;
}

function syncOriginalSystemMenuPopover(activeModule) {
  const stage = document.querySelector(".original-system-stage");
  if (!stage) {
    render();
    return;
  }

  const existing = stage.querySelector(".system-menu-popover");
  if (!ui.systemMenuOpen) {
    if (existing) existing.remove();
    return;
  }

  const nextMenu = renderSystemMenuPopover(activeModule);
  if (existing) {
    existing.outerHTML = nextMenu;
    return;
  }
  stage.insertAdjacentHTML("beforeend", nextMenu);
}

function renderUnifiedMenu() {
  const summary = getDashboardSummary();
  return `
    ${renderGeneralDashboard(summary)}
    ${renderMenuTimelinePanel()}
  `;
  return `
    ${renderGeneralDashboard(summary)}
    <section class="module-menu-grid">
      ${renderMenuCard({
        key: "checkin",
        kicker: "Copia interna",
        title: "Check-in y reservas",
        copy: "Abrir exactamente el sistema de reservas, grupos, habitaciones y ficha legal que ya construimos.",
        action: "Entrar al Check-in",
      })}
      ${renderMenuCard({
        key: "bebidas",
        kicker: "Copia interna",
        title: "Estación de bebidas",
        copy: "Abrir exactamente el comandero de bebidas, caja directa, catálogo y choferes/coordinadores.",
        action: "Entrar a bebidas",
      })}
      ${renderMenuCard({
        key: "checkout",
        kicker: "Módulo nuevo",
        title: "Check-out",
        copy: `Cruzar ambos sistemas para revisar saldos. Pendiente detectado: ${formatMoney(summary.dueTotal)}.`,
        action: "Entrar a Check-out",
      })}
      ${renderMenuCard({
        key: "registro",
        kicker: "M\u00f3dulo legal",
        title: "Libro de Registro de Hu\u00e9spedes",
        copy: "Registro imprimible/PDF de habitaciones, pasajeros, documentos, procedencia, destino e ingreso/egreso.",
        action: "Abrir libro",
      })}
      ${renderMenuCard({
        key: "inventario",
        kicker: "Próximo módulo",
        title: "Stock e Inventario",
        copy: "Página reservada para stock, reposición, movimientos y control operativo.",
        action: "Ver Stock e Inventario",
      })}
      ${renderMenuCard({
        key: "empleados",
        kicker: "Próximo módulo",
        title: "Empleados",
        copy: "Página reservada para legajos, roles, turnos y consumos internos.",
        action: "Ver Empleados",
      })}
    </section>
    <section class="panel">
      <div class="panel-title-row">
        <div>
          <h2>Cómo queda armado</h2>
          <p>Check-in y Bebidas viven dentro de esta misma carpeta. El Check-out lee esos estados locales para hacer el cierre final.</p>
        </div>
      </div>
      ${renderSummary(summary)}
    </section>
  `;
}

function renderTimelineHalf(side, reservation) {
  const classes = [
    "timeline-half",
    side === "left" ? "is-left" : "is-right",
    reservation ? "has-reservation" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (!reservation) {
    return `<span class="${classes}" aria-hidden="true"></span>`;
  }

  const paint = getTimelineReservationPaint(reservation);
  return `
    <span
      class="${classes}"
      style="--half-color: ${escapeHtml(paint.color)}; --half-ink: ${escapeHtml(paint.ink)};"
    >${escapeHtml(paint.initial)}</span>
  `;
}

function addTimelineReservationTitle(titleParts, label, reservation) {
  if (!reservation) return;
  const company = getReservationCompanyLabel(reservation);
  titleParts.push(`${label}: ${buildTimelineReservationTitle(reservation)}`);
  if (company) {
    titleParts.push(`Grupo ${company}`);
  }
  titleParts.push(formatStayRange(reservation.checkInDate, reservation.checkOutDate));
}

function renderMenuTimelineCell(descriptor, date, selectedDate = getMenuTimelineDate()) {
  const isSelectedDay = date === selectedDate;
  const today = getTodayInputDate();
  const isToday = date === today;
  const isPast = date < today;
  const cellClasses = [
    "timeline-cell",
    isSelectedDay ? "is-selected-day" : "",
    isToday ? "is-today" : "",
    isPast ? "is-past" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const hasHalfDayMovement = Boolean(
    !descriptor.maintenance && (descriptor.departureReservation || descriptor.arrivalReservation)
  );

  if (hasHalfDayMovement) {
    const classes = [
      "timeline-status",
      "is-half-day",
      isSelectedDay ? "is-selected-day" : "",
      isToday ? "is-today" : "",
      isPast ? "is-past" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const titleParts = [
      `Hab. ${descriptor.roomNumber}`,
      formatDate(date),
      "Movimiento de medio día",
    ];

    addTimelineReservationTitle(titleParts, "Egreso", descriptor.departureReservation);
    addTimelineReservationTitle(titleParts, "Ingreso", descriptor.arrivalReservation);

    return `
      <td class="${cellClasses}">
        <span class="${classes}" title="${escapeHtml(titleParts.join(" · "))}">
          ${renderTimelineHalf("left", descriptor.departureReservation)}
          ${renderTimelineHalf("right", descriptor.arrivalReservation)}
        </span>
      </td>
    `;
  }

  const occupiedReservation = descriptor.conflictReservation;
  const occupiedPaint =
    occupiedReservation && descriptor.status === "occupied"
      ? getTimelineReservationPaint(occupiedReservation)
      : null;
  const classes = [
    "timeline-status",
    descriptor.status === "available" ? "is-available" : "",
    descriptor.status === "occupied" ? "is-occupied" : "",
    occupiedPaint ? "is-color-coded" : "",
    occupiedPaint && occupiedPaint.isGroup ? "is-group" : "",
    descriptor.status === "maintenance" ? "is-maintenance" : "",
    isSelectedDay ? "is-selected-day" : "",
    isToday ? "is-today" : "",
    isPast ? "is-past" : "",
  ]
    .filter(Boolean)
    .join(" ");

  let label = "Disponible";
  if (descriptor.status === "maintenance") {
    label = "Mantenimiento";
  } else if (descriptor.status === "occupied") {
    label = descriptor.referenceDate === getTodayInputDate() ? "En uso" : "Reservada";
  }

  const titleParts = [`Hab. ${descriptor.roomNumber}`, formatDate(date), label];
  addTimelineReservationTitle(titleParts, "Reserva", occupiedReservation);

  const style =
    occupiedPaint
      ? ` style="--timeline-color: ${escapeHtml(occupiedPaint.color)}; --timeline-ink: ${escapeHtml(
          occupiedPaint.ink
        )};"`
      : "";
  const groupInitial = occupiedPaint && occupiedPaint.isGroup ? occupiedPaint.initial : "";

  return `
    <td class="${cellClasses}">
      <span class="${classes}"${style} title="${escapeHtml(titleParts.join(" · "))}">${escapeHtml(
        groupInitial
      )}</span>
    </td>
  `;
}

function renderMenuTimelinePanel(referenceDate = getMenuTimelineDate()) {
  const selectedDate = normalizeDate(referenceDate) || getTodayInputDate();
  const monthKey = getMonthKeyFromDate(selectedDate);
  const daysInMonth = getDaysInMonth(selectedDate);
  const dates = Array.from({ length: daysInMonth }, (_, index) => {
    return `${monthKey}-${String(index + 1).padStart(2, "0")}`;
  });
  const occupiedToday = ROOM_OPTIONS.filter(
    (roomNumber) => getRoomTimelineDescriptor(roomNumber, selectedDate).status === "occupied"
  ).length;
  const maintenanceToday = ROOM_OPTIONS.filter((roomNumber) => isRoomUnderMaintenance(roomNumber)).length;
  const availableToday = ROOM_OPTIONS.length - occupiedToday - maintenanceToday;

  return `
    <section id="menu-timeline-section" class="panel panel-strong timeline-panel menu-timeline-panel">
      <div class="panel-title-row">
        <div>
          <span class="source-tag">Planificaci&oacute;n</span>
          <div class="timeline-title-heading">
            <span class="timeline-title-icon" aria-hidden="true"><img src="${TIMELINE_ICON_URL}" alt="" /></span>
            <h2>L&iacute;nea del tiempo</h2>
          </div>
          <p>
            Espejo autom&aacute;tico del Check-in: ocupaci&oacute;n por habitaci&oacute;n y por d&iacute;a, con colores de grupos y reservas particulares.
          </p>
        </div>
        <div class="availability-toolbar">
          <div class="chip-row">
            <span class="chip">${escapeHtml(formatMonthYearLabel(selectedDate))}</span>
            <span class="chip">Fecha elegida ${escapeHtml(formatDate(selectedDate))}</span>
          </div>
          <div class="timeline-actions">
            <button class="ghost-button is-compact" type="button" data-action="shift-menu-timeline-month" data-shift="-1">
              Mes anterior
            </button>
            <button class="ghost-button is-compact" type="button" data-action="set-menu-timeline-today">
              Volver a hoy
            </button>
            <button class="ghost-button is-compact" type="button" data-action="shift-menu-timeline-month" data-shift="1">
              Mes siguiente
            </button>
            <label class="timeline-date-field" for="menu-timeline-date">
              <span>Ver fecha</span>
              <input
                id="menu-timeline-date"
                type="date"
                value="${selectedDate}"
                data-menu-timeline-date
              />
            </label>
          </div>
        </div>
      </div>

      <div class="timeline-stats">
        <span class="status-badge is-ready">${availableToday} disponibles</span>
        <span class="status-badge is-blocked">${occupiedToday} ocupadas</span>
        <span class="chip is-slate">${maintenanceToday} mantenimiento</span>
      </div>

      <div class="timeline-wrap" data-menu-timeline-wrap>
        <table class="timeline-table">
          <thead>
            <tr>
              <th class="timeline-room-col" scope="col">Habitaci&oacute;n</th>
              ${dates
                .map((date) => {
                  const isSelectedDay = date === selectedDate;
                  const isToday = date === getTodayInputDate();
                  const isPast = date < getTodayInputDate();
                  return `
                    <th class="timeline-day-col ${[
                      isSelectedDay ? "is-selected-day" : "",
                      isToday ? "is-today" : "",
                      isPast ? "is-past" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}" scope="col">
                      <button
                        class="timeline-day-button ${[
                          isSelectedDay ? "is-selected" : "",
                          isToday ? "is-today" : "",
                          isPast ? "is-past" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}"
                        type="button"
                        data-action="select-menu-timeline-date"
                        data-date="${date}"
                      >
                        <span>${escapeHtml(formatWeekdayShortLabel(date))}</span>
                        <strong>${escapeHtml(date.slice(-2))}</strong>
                      </button>
                    </th>
                  `;
                })
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${ROOM_OPTIONS.map((roomNumber) => {
              const roomProfile = getRoomProfile(roomNumber);
              return `
                <tr>
                  <th class="timeline-room-col" scope="row">
                    <div class="timeline-room-copy">
                      <strong>Hab. ${escapeHtml(roomNumber)}</strong>
                      <span title="${escapeHtml(
                        roomProfile ? roomProfile.label : "Habitación"
                      )}">${escapeHtml(roomProfile ? roomProfile.label : "Habitación")}</span>
                    </div>
                  </th>
                  ${dates
                    .map((date) =>
                      renderMenuTimelineCell(
                        getRoomTimelineDescriptor(roomNumber, date),
                        date,
                        selectedDate
                      )
                    )
                    .join("")}
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>

      <p class="timeline-legend">
        Verde: disponible. Rojo/color sin inicial: reserva particular. Color con inicial: grupo o empresa.
        Medio cuadrado derecho: ingreso. Medio cuadrado izquierdo: egreso. Gris: mantenimiento.
      </p>
    </section>
  `;
}

function renderGeneralDashboard(summary) {
  const departures = getTodayDepartures();
  const arrivals = getTodayArrivals();
  const meals = getDashboardMealSummary();
  const occupancy = getDashboardOccupancySummary();
  const showDepartureAlert = isAfterCheckoutAlertStart();
  const departureTotal = departures.reduce((sum, row) => sum + row.dueTotal, 0);
  const arrivalTotal = arrivals.reduce((sum, reservation) => sum + reservation.lodgingPending, 0);
  const occupiedShare = occupancy.total ? (occupancy.occupied / occupancy.total) * 100 : 0;
  const availableShare = occupancy.total
    ? ((occupancy.occupied + occupancy.available) / occupancy.total) * 100
    : 0;
  const checkinIconUrl = getSidebarIconUrl("checkin");
  const checkoutIconUrl = getSidebarIconUrl("checkout");

  return `
    <section class="panel dashboard-panel">
      <div class="panel-title-row">
        <div>
          <span class="source-tag">Dashboard operativo</span>
          <h2>Hoy en Solanas · Check-in y Check-out</h2>
          <p>Alertas autom&aacute;ticas desde Check-in, Bebidas y Check-out para coordinar el d&iacute;a.</p>
        </div>
        <div class="chip-row dashboard-time-pills">
          <span class="chip is-rust">Egresos 10:00</span>
          <span class="chip is-blue">Ingresos 14:00</span>
          <span class="chip dashboard-meal-pill is-lunch ${meals.lunch ? "" : "is-empty"}">
            <strong>Almuerzo</strong>
            <span>${meals.lunch ? `${meals.lunch} comensal${meals.lunch === 1 ? "" : "es"}` : "Sin servicio"}</span>
          </span>
          <span class="chip dashboard-meal-pill is-dinner ${meals.dinner ? "" : "is-empty"}">
            <strong>Cena</strong>
            <span>${meals.dinner ? `${meals.dinner} comensal${meals.dinner === 1 ? "" : "es"}` : "Sin servicio"}</span>
          </span>
        </div>
      </div>
      <div class="dashboard-grid">
        <article class="dashboard-alert ${showDepartureAlert && departures.length ? "is-urgent" : ""}">
          <div class="dashboard-alert-head">
            <div class="dashboard-alert-title">
              <span class="dashboard-alert-icon" aria-hidden="true">
                <img src="${checkoutIconUrl}" data-sidebar-icon-key="checkout" alt="" />
              </span>
              <div>
                <span class="kicker">Desde las 7:00</span>
                <h3>Check-out de hoy</h3>
              </div>
            </div>
            <strong>${departures.length}</strong>
          </div>
          ${
            showDepartureAlert
              ? renderDepartureAlertList(departures, departureTotal)
              : `<div class="empty-state">La alerta de egresos se activa autom&aacute;ticamente a las 7:00.</div>`
          }
        </article>
        <article class="dashboard-alert">
          <div class="dashboard-alert-head">
            <div class="dashboard-alert-title">
              <span class="dashboard-alert-icon" aria-hidden="true">
                <img src="${checkinIconUrl}" data-sidebar-icon-key="checkin" alt="" />
              </span>
              <div>
                <span class="kicker">Check-in 14:00</span>
                <h3>Check-in de hoy</h3>
              </div>
            </div>
            <strong>${arrivals.length}</strong>
          </div>
          ${renderArrivalAlertList(arrivals, arrivalTotal)}
        </article>
        <article class="dashboard-alert dashboard-occupancy">
          <div class="dashboard-occupancy-heading">
            <span class="kicker">Estado del hotel</span>
            <h3>Ocupaci&oacute;n y estad&iacute;sticas</h3>
          </div>
          <div class="dashboard-occupancy-body">
            <div
              class="dashboard-occupancy-ring"
              style="--occupied-share: ${occupiedShare.toFixed(2)}%; --available-share: ${availableShare.toFixed(2)}%;"
              role="img"
              aria-label="Ocupaci&oacute;n actual: ${occupancy.percentage} por ciento"
            >
              <div class="dashboard-occupancy-center">
                <strong>${occupancy.percentage}%</strong>
                <span>Ocupaci&oacute;n<br />actual</span>
              </div>
            </div>
            <dl class="dashboard-occupancy-legend">
              <div class="is-occupied"><dt>Ocupadas</dt><dd>${occupancy.occupied}</dd></div>
              <div class="is-available"><dt>Disponibles</dt><dd>${occupancy.available}</dd></div>
              <div class="is-maintenance"><dt>Mantenimiento</dt><dd>${occupancy.maintenance}</dd></div>
            </dl>
          </div>
          <div class="dashboard-occupancy-foot">
            <strong>${occupancy.occupied} ocupadas</strong>
            <span>${occupancy.operational} operativas</span>
          </div>
        </article>
      </div>
      <div class="dashboard-footnote">
        <strong>Control de habitaci&oacute;n:</strong> antes de cerrar un egreso, revisar llaves, roturas, faltantes, limpieza, consumos de bebidas y cualquier saldo pendiente.
        <a class="ghost-button is-compact" href="#cajas">Abrir Cajas</a>
      </div>
    </section>
  `;
}

function renderCashboxPage() {
  const cashboxes = getCashboxTotals();
  const cashTotal = cashboxes.hotel.adjustedCash + cashboxes.beverages.adjustedCash;
  const transferTotal = cashboxes.hotel.transfer + cashboxes.beverages.transfer;
  return `
    <section class="panel checkout-toolbar cashbox-page-hero">
      <div class="checkout-toolbar-grid">
        <div>
          <span class="source-tag">Cajas operativas</span>
          <h2>Arqueo y movimientos</h2>
          <p class="muted">
            Hotel y Estaci&oacute;n de bebidas quedan separados por origen y por medio de pago. Los pr&eacute;stamos internos solo mueven efectivo entre cajas.
          </p>
        </div>
        <div class="checkout-toolbar-status">
          <div class="status-panel">
            <strong>${formatMoney(cashTotal)}</strong>
            <span>Efectivo total esperado, con pr&eacute;stamos aplicados.</span>
          </div>
          <div class="status-panel">
            <strong>${formatMoney(transferTotal)}</strong>
            <span>Transferencias registradas sin mezclar conceptos.</span>
          </div>
        </div>
      </div>
    </section>
    <section class="panel cashbox-page-panel">
      ${renderCashboxDashboard(cashboxes)}
      ${renderCashAuditPanel(cashboxes)}
    </section>
  `;
}

function renderCashboxDashboard(cashboxes) {
  return `
    <div class="cashbox-panel">
      <div class="cashbox-head">
        <div>
          <span class="kicker">Cajas separadas</span>
          <h3>Ingresos operativos</h3>
        </div>
        <div class="actions-row">
          <button class="ghost-button is-compact" data-action="record-cash-transfer" data-from="hotel" data-to="beverages">Hotel &rarr; Bebidas</button>
          <button class="ghost-button is-compact" data-action="record-cash-transfer" data-from="beverages" data-to="hotel">Bebidas &rarr; Hotel</button>
        </div>
      </div>
      <div class="cashbox-grid">
        ${renderCashboxCard("Hotel efectivo", cashboxes.hotel.adjustedCash, "Pago de pasajeros", cashboxes.hotel.cash)}
        ${renderCashboxCard("Hotel transferencia", cashboxes.hotel.transfer, "Pago de pasajeros")}
        ${renderCashboxCard("Bebidas efectivo", cashboxes.beverages.adjustedCash, "Compras de estaci&oacute;n", cashboxes.beverages.cash)}
        ${renderCashboxCard("Bebidas transferencia", cashboxes.beverages.transfer, "Compras de estaci&oacute;n")}
      </div>
      ${renderCashTransferList(cashboxes.transfers, cashboxes.withdrawals)}
    </div>
  `;
}

function renderCashAuditPanel(cashboxes) {
  const hotelCount = String(ui.cashAudit.hotel || "").trim() ? parseAmount(ui.cashAudit.hotel) : null;
  const beveragesCount = String(ui.cashAudit.beverages || "").trim()
    ? parseAmount(ui.cashAudit.beverages)
    : null;
  const hotelDiff = hotelCount === null ? null : hotelCount - cashboxes.hotel.adjustedCash;
  const beveragesDiff =
    beveragesCount === null ? null : beveragesCount - cashboxes.beverages.adjustedCash;
  return `
    <div class="cash-audit-panel">
      <div class="cashbox-head">
        <div>
          <span class="kicker">Arqueo de efectivo</span>
          <h3>Conteo manual</h3>
        </div>
        <button class="ghost-button is-compact" data-action="clear-cash-audit">Limpiar conteo</button>
      </div>
      <div class="field-grid">
        ${renderCashAuditField(
          "Hotel efectivo",
          "hotel",
          ui.cashAudit.hotel,
          cashboxes.hotel.adjustedCash,
          hotelDiff
        )}
        ${renderCashAuditField(
          "Bebidas efectivo",
          "beverages",
          ui.cashAudit.beverages,
          cashboxes.beverages.adjustedCash,
          beveragesDiff
        )}
      </div>
      <div class="cash-withdrawal-actions">
        <div class="cash-withdrawal-copy">
          <strong>Retiro de efectivo</strong>
          <p>Registra salidas reales de dinero sin mezclar las cajas de Hotel y Bebidas.</p>
        </div>
        <div class="cash-withdrawal-buttons">
          <button class="ghost-button is-compact" data-action="record-cash-withdrawal" data-box="hotel">Retirar Efectivo Hotel</button>
          <button class="ghost-button is-compact" data-action="record-cash-withdrawal" data-box="beverages">Retirar Efectivo Bebidas</button>
        </div>
      </div>
    </div>
  `;
}

function renderCashAuditField(label, key, value, expected, difference) {
  const normalizedExpected = Number(expected) || 0;
  let differenceText = "";
  let differenceClass = "is-muted";
  if (difference === null) {
    differenceText =
      normalizedExpected > 0
        ? "Carga el conteo real para comparar."
        : "Sin efectivo esperado para comparar.";
  } else if (difference === 0) {
    differenceText = normalizedExpected > 0 ? "Arqueo exacto." : "Sin diferencia.";
    differenceClass = "is-ok";
  } else if (difference > 0) {
    differenceText = `Sobra ${formatMoney(difference)}.`;
    differenceClass = "is-over";
  } else {
    differenceText = `Falta ${formatMoney(Math.abs(difference))}.`;
    differenceClass = "is-short";
  }
  return `
    <label class="field cash-audit-field">
      <span>${escapeHtml(label)}</span>
      <div class="money-field-shell">
        <span class="money-prefix">$</span>
        <input
          type="text"
          inputmode="numeric"
          value="${escapeHtml(value)}"
          data-action-input="cash-audit"
          data-cash-audit="${escapeHtml(key)}"
          placeholder="0"
          autocomplete="off"
        />
      </div>
      <small class="cash-audit-result ${differenceClass}">Esperado ${formatMoney(expected)} &middot; ${escapeHtml(differenceText)}</small>
    </label>
  `;
}

function renderCashboxCard(title, amount, copy, originalCash = null) {
  const adjustedCopy =
    originalCash !== null && originalCash !== amount
      ? `Base ${formatMoney(originalCash)} con pr&eacute;stamos aplicados`
      : copy;
  return `
    <article class="cashbox-card">
      <span>${escapeHtml(title)}</span>
      <strong>${formatMoney(amount)}</strong>
      <small>${adjustedCopy}</small>
    </article>
  `;
}

function renderCashTransferList(transfers, withdrawals = []) {
  const movements = [
    ...transfers.map((transfer) => ({
      createdAt: transfer.createdAt,
      html: `
        <span>
          ${escapeHtml(getCashboxLabel(transfer.from))} &rarr; ${escapeHtml(getCashboxLabel(transfer.to))}
          <strong>${formatMoney(transfer.amount)}</strong>
          <small>${escapeHtml(formatDateTime(transfer.createdAt))}</small>
        </span>
      `,
    })),
    ...withdrawals.map((withdrawal) => ({
      createdAt: withdrawal.createdAt,
      html: `
        <span>
          Retiro ${escapeHtml(getCashboxLabel(withdrawal.box))}
          <strong>${formatMoney(withdrawal.amount)}</strong>
          <small>${escapeHtml(formatDateTime(withdrawal.createdAt))}</small>
        </span>
      `,
    })),
  ].sort((left, right) => (Date.parse(right.createdAt) || 0) - (Date.parse(left.createdAt) || 0));
  if (!movements.length) {
    return `<div class="cashbox-note">Los pr&eacute;stamos internos y retiros de efectivo quedan registrados sin mezclar ingresos ni modificar transferencias.</div>`;
  }
  return `
    <div class="cashbox-transfer-list">
      ${movements
        .slice(0, 6)
        .map((movement) => movement.html)
        .join("")}
    </div>
  `;
}

function renderDepartureAlertList(rows, departureTotal) {
  if (!rows.length) {
    return `<div class="empty-state">No hay egresos cargados para hoy.</div>`;
  }

  return `
    <div class="dashboard-alert-summary">
      <span class="chip ${departureTotal > 0 ? "is-rust" : "is-green"}">
        ${departureTotal > 0 ? `Pendiente ${formatMoney(departureTotal)}` : "Sin saldo detectado"}
      </span>
    </div>
    <div class="dashboard-list">
      ${rows
        .map(
          (row) => `
            <div class="dashboard-list-item">
              <div>
                <strong>Hab. ${escapeHtml(row.reservation.roomNumber || "-")}</strong>
                <span>${escapeHtml(renderDashboardGuestLine(row.reservation))}</span>
              </div>
              <div class="dashboard-list-money ${row.dueTotal > 0 ? "is-danger" : "is-ok"}">
                ${formatMoney(row.dueTotal)}
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderArrivalAlertList(rows, arrivalTotal) {
  if (!rows.length) {
    return `<div class="empty-state">No hay ingresos cargados para hoy.</div>`;
  }

  return `
    <div class="dashboard-alert-summary">
      <span class="chip is-blue">A revisar ${rows.length} reserva${rows.length === 1 ? "" : "s"}</span>
      <span class="chip ${arrivalTotal > 0 ? "is-rust" : "is-green"}">
        Saldo alojamiento ${formatMoney(arrivalTotal)}
      </span>
    </div>
    <div class="dashboard-list">
      ${rows
        .map(
          (reservation) => `
            <div class="dashboard-list-item">
              <div>
                <strong>Hab. ${escapeHtml(reservation.roomNumber || "-")}</strong>
                <span>${escapeHtml(renderDashboardGuestLine(reservation))}</span>
              </div>
              <div class="dashboard-list-time">14:00</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderMenuCard({ key, kicker, title, copy, action }) {
  return `
    <a class="module-menu-card" href="#${key}">
      <span class="source-tag">${escapeHtml(kicker)}</span>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(copy)}</p>
      <span class="button is-compact">${escapeHtml(action)}</span>
    </a>
  `;
}

function renderConstructionPage(title, copy) {
  return `
    <section class="panel construction-page">
      <div class="construction-mark">En construcci&oacute;n</div>
      <h2>${escapeHtml(title)}</h2>
      <p>${copy}</p>
      <a class="ghost-button" href="#${getDefaultAllowedModule()}">Volver al inicio</a>
    </section>
  `;
}

function getEmployees() {
  state.employees = normalizeEmployees(state.employees, state.sources && state.sources.beverages);
  return state.employees;
}

function getEmployeeById(employeeId) {
  return getEmployees().find((employee) => employee.id === employeeId) || null;
}

function getEmployeeAdvanceTotal(employee) {
  return (employee && Array.isArray(employee.advances) ? employee.advances : []).reduce(
    (sum, advance) => sum + (Number(advance.amount) || 0),
    0
  );
}

function getEmployeeTodayAttendance(employee) {
  const today = getTodayInputDate();
  return employee && Array.isArray(employee.attendance)
    ? employee.attendance.find((entry) => entry.date === today) || null
    : null;
}

function getItemDateForEmployeeConsumption(sourceDate, item) {
  return normalizeDate((item && (item.createdAt || item.updatedAt || item.closedAt)) || sourceDate);
}

function employeeMatchesStaffItem(employee, item) {
  if (!employee || !item) return false;
  if (item.staffMemberId && item.staffMemberId === employee.id) return true;
  return slugify(item.staffMemberName || "") === slugify(employee.name);
}

function getEmployeeBeverageConsumption(employee, monthKey = state.selectedMonth) {
  const beverage = getBeverageState();
  const range = getMonthRange(monthKey);
  const rows = [];
  const pushItems = (items, source) => {
    (Array.isArray(items) ? items : []).forEach((item) => {
      if (!employeeMatchesStaffItem(employee, item)) return;
      const date = getItemDateForEmployeeConsumption(source.date, item);
      if (!isDateInRange(date, range)) return;
      rows.push({
        date,
        sourceLabel: source.label,
        serviceLabel: source.serviceLabel || "",
        productName: item.productName || item.name || "Producto",
        quantity: Number(item.quantity) || 0,
        total: getCollectionTotal([item]),
      });
    });
  };

  if (beverage && beverage.activeShift) {
    pushItems(beverage.activeShift.staffConsumption, {
      label: "Turno activo",
      date: beverage.activeShift.openedAt,
      serviceLabel: beverage.activeShift.serviceLabel,
    });
  }
  (beverage && Array.isArray(beverage.shiftHistory) ? beverage.shiftHistory : []).forEach((shift) => {
    pushItems(shift.staffConsumption, {
      label: "Hist&oacute;rico",
      date: shift.closedAt || shift.openedAt,
      serviceLabel: shift.serviceLabel,
    });
  });

  return {
    rows,
    total: rows.reduce((sum, row) => sum + row.total, 0),
    units: rows.reduce((sum, row) => sum + row.quantity, 0),
  };
}

function addEmployeeFromForm(form) {
  const formData = new FormData(form);
  const name = String(formData.get("employeeName") || "").trim();
  if (!name) return;
  const duplicate = getEmployees().find((employee) => slugify(employee.name) === slugify(name));
  if (duplicate) {
    alert("Ese empleado ya esta cargado.");
    return;
  }
  state.employees.unshift(
    normalizeEmployee({
      id: `staff-${slugify(name)}-${Date.now()}`,
      name,
      monthlySalary: formData.get("employeeSalary"),
    })
  );
  markEmployeeDirectoryManaged();
  syncEmployeesToBeverageSource();
  persistState(`Empleado ${name} cargado.`);
  render();
}

function deleteEmployee(employeeId) {
  const employee = getEmployeeById(employeeId);
  if (!employee) return;
  if (!window.confirm(`Eliminar a ${employee.name} de Empleados y de Bebidas?`)) {
    return;
  }
  state.employees = getEmployees().filter((item) => item.id !== employee.id);
  markEmployeeDirectoryManaged();
  syncEmployeesToBeverageSource();
  persistState(`Empleado ${employee.name} eliminado.`);
  render();
}

function updateEmployeeSalary(employeeId, rawSalary) {
  const employee = getEmployeeById(employeeId);
  if (!employee) return;
  employee.monthlySalary = parseAmount(rawSalary);
  markEmployeeDirectoryManaged();
  syncEmployeesToBeverageSource();
  persistState();
  render();
}

function addEmployeeAdvance(employeeId, amount, note = "") {
  const employee = getEmployeeById(employeeId);
  if (!employee) return;
  const parsedAmount = parseAmount(amount);
  if (parsedAmount <= 0) {
    alert("Carga una seña mayor a cero.");
    return;
  }
  employee.advances.unshift(
    normalizeEmployeeAdvance({
      id: `advance-${employee.id}-${Date.now()}`,
      amount: parsedAmount,
      note,
      createdAt: new Date().toISOString(),
    })
  );
  markEmployeeDirectoryManaged();
  persistState(`Se&ntilde;a registrada para ${employee.name}.`);
  render();
}

function removeEmployeeAdvance(employeeId, advanceId) {
  const employee = getEmployeeById(employeeId);
  if (!employee) return;
  employee.advances = employee.advances.filter((advance) => advance.id !== advanceId);
  markEmployeeDirectoryManaged();
  persistState(`Se&ntilde;a quitada de ${employee.name}.`);
  render();
}

function markEmployeeClockIn(employeeId) {
  const employee = getEmployeeById(employeeId);
  if (!employee) return;
  const today = getTodayInputDate();
  const existing = getEmployeeTodayAttendance(employee);
  if (existing) {
    existing.checkedInAt = existing.checkedInAt || new Date().toISOString();
  } else {
    employee.attendance.unshift(
      normalizeEmployeeAttendance({
        id: `attendance-${employee.id}-${today}`,
        date: today,
        scheduledIn: employee.scheduledIn || "09:00",
        scheduledOut: employee.scheduledOut || "18:00",
        checkedInAt: new Date().toISOString(),
      })
    );
  }
  markEmployeeDirectoryManaged();
  persistState(`${employee.name} marcado como ingresado.`);
  render();
}

function renderEmployeesPage() {
  const employees = getEmployees();
  const payroll = employees.map((employee) => {
    const advances = getEmployeeAdvanceTotal(employee);
    const beverage = getEmployeeBeverageConsumption(employee);
    return {
      employee,
      advances,
      beverage,
      net: Math.max(0, (Number(employee.monthlySalary) || 0) - advances - beverage.total),
    };
  });
  const totalSalary = payroll.reduce((sum, row) => sum + (Number(row.employee.monthlySalary) || 0), 0);
  const totalAdvances = payroll.reduce((sum, row) => sum + row.advances, 0);
  const totalBeverages = payroll.reduce((sum, row) => sum + row.beverage.total, 0);
  const totalNet = payroll.reduce((sum, row) => sum + row.net, 0);

  return `
    <section class="panel employees-overview-panel">
      <div class="panel-title-row">
        <div>
          <span class="source-tag">N&oacute;mina central</span>
          <h2>Empleados</h2>
          <p>Desde ac&aacute; se cargan empleados, sueldos, fichaje simple y se&ntilde;as. La Estaci&oacute;n de bebidas replica esta lista para asignar consumos.</p>
        </div>
        <div class="actions-row">
          <span class="chip">${employees.length} empleado${employees.length === 1 ? "" : "s"}</span>
          <span class="chip">Mes ${escapeHtml(state.selectedMonth)}</span>
        </div>
      </div>
      <form id="employee-form" class="employee-form">
        <label class="field">
          <span>Nombre del empleado</span>
          <input name="employeeName" type="text" placeholder="Ejemplo: Valeria" autocomplete="off" required />
        </label>
        <label class="field">
          <span>Sueldo mensual</span>
          <input name="employeeSalary" type="text" inputmode="decimal" placeholder="$ 0" />
        </label>
        <div class="field">
          <span>Acci&oacute;n</span>
          <button class="button is-compact" type="submit">Cargar empleado</button>
        </div>
      </form>
      <div class="inventory-value-strip employee-totals">
        <div><span>Sueldos pactados</span><strong>${formatMoney(totalSalary)}</strong></div>
        <div><span>Se&ntilde;as dadas</span><strong>${formatMoney(totalAdvances)}</strong></div>
        <div><span>Bebidas personal</span><strong>${formatMoney(totalBeverages)}</strong></div>
        <div><span>A pagar estimado</span><strong>${formatMoney(totalNet)}</strong></div>
      </div>
    </section>
    <section class="panel employee-clock-panel">
      <div class="panel-title-row">
        <div>
          <span class="source-tag">Fichaje</span>
          <h2>Fichaje de hoy</h2>
          <p>Horario base por ahora: ingreso 09:00 y salida 18:00. Con marcar ingreso alcanza para esta etapa.</p>
        </div>
      </div>
      ${renderEmployeeClockGrid(employees)}
    </section>
    <section class="panel employee-payroll-panel">
      <div class="panel-title-row">
        <div>
          <span class="source-tag">Liquidaci&oacute;n mensual</span>
          <h2>Sueldos, se&ntilde;as y consumos</h2>
          <p>La tabla descuenta se&ntilde;as y consumos de bebidas cargados al personal durante el mes seleccionado.</p>
        </div>
        <input type="month" value="${escapeHtml(state.selectedMonth)}" data-action-input="selected-month" />
      </div>
      ${renderEmployeePayrollTable(payroll)}
    </section>
  `;
}

function renderEmployeeClockGrid(employees) {
  if (!employees.length) {
    return `<div class="empty-state">Carg&aacute; empleados para habilitar el fichaje.</div>`;
  }
  return `
    <div class="employee-clock-grid">
      ${employees
        .map((employee) => {
          const attendance = getEmployeeTodayAttendance(employee);
          return `
            <article class="employee-clock-card">
              <div>
                <strong>${escapeHtml(employee.name)}</strong>
                <span>${escapeHtml(employee.scheduledIn)} a ${escapeHtml(employee.scheduledOut)}</span>
              </div>
              ${
                attendance && attendance.checkedInAt
                  ? `<span class="status-badge is-ok">Ingres&oacute; ${escapeHtml(formatDateTime(attendance.checkedInAt))}</span>`
                  : `<button class="button is-compact" type="button" data-action="employee-clock-in" data-employee-id="${escapeHtml(employee.id)}">Ingres&oacute;</button>`
              }
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderEmployeePayrollTable(rows) {
  if (!rows.length) {
    return `<div class="empty-state">Todav&iacute;a no hay empleados cargados.</div>`;
  }
  return `
    <div class="table-wrap employee-payroll-wrap">
      <table class="employee-payroll-table">
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Sueldo mensual</th>
            <th>Se&ntilde;as</th>
            <th>Bebidas</th>
            <th>A pagar</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(renderEmployeePayrollRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderEmployeePayrollRow(row) {
  const { employee, advances, beverage, net } = row;
  return `
    <tr data-employee-row="${escapeHtml(employee.id)}">
      <td>
        <strong>${escapeHtml(employee.name)}</strong>
        <div class="muted">Fichaje base ${escapeHtml(employee.scheduledIn)} a ${escapeHtml(employee.scheduledOut)}</div>
      </td>
      <td>
        <input class="payroll-input" type="text" inputmode="decimal" value="${escapeHtml(employee.monthlySalary || "")}" data-employee-salary="${escapeHtml(employee.id)}" />
      </td>
      <td>
        <strong>${formatMoney(advances)}</strong>
        <div class="employee-advance-list">
          ${renderEmployeeAdvanceList(employee)}
        </div>
        <div class="employee-advance-form">
          <input type="text" inputmode="decimal" placeholder="$ se&ntilde;a" data-employee-advance-amount />
          <input type="text" placeholder="Detalle opcional" data-employee-advance-note />
          <button class="ghost-button is-compact" type="button" data-action="add-employee-advance" data-employee-id="${escapeHtml(employee.id)}">Sumar</button>
        </div>
      </td>
      <td>
        <strong>${formatMoney(beverage.total)}</strong>
        <div class="muted">${beverage.units} unidad${beverage.units === 1 ? "" : "es"} en el mes</div>
        ${renderEmployeeBeverageDetails(beverage)}
      </td>
      <td><strong class="money">${formatMoney(net)}</strong></td>
      <td>
        <button class="danger-button is-compact" type="button" data-action="delete-employee" data-employee-id="${escapeHtml(employee.id)}">Eliminar</button>
      </td>
    </tr>
  `;
}

function renderEmployeeAdvanceList(employee) {
  if (!employee.advances.length) {
    return `<span class="muted">Sin se&ntilde;as cargadas.</span>`;
  }
  return employee.advances
    .map(
      (advance) => `
        <span class="employee-advance-chip">
          ${formatMoney(advance.amount)} &middot; ${escapeHtml(formatDate(advance.createdAt))}
          <button type="button" data-action="remove-employee-advance" data-employee-id="${escapeHtml(employee.id)}" data-advance-id="${escapeHtml(advance.id)}" aria-label="Quitar se&ntilde;a">x</button>
        </span>
      `
    )
    .join("");
}

function renderEmployeeBeverageDetails(beverage) {
  if (!beverage.rows.length) {
    return `<div class="muted">Sin consumos de bebidas asignados.</div>`;
  }
  return `
    <details class="employee-consumption-details">
      <summary>Ver consumos</summary>
      <div class="employee-consumption-list">
        ${beverage.rows
          .map(
            (row) => `
              <span>
                ${escapeHtml(formatDate(row.date))} &middot; ${escapeHtml(row.productName)} x${row.quantity}
                <strong>${formatMoney(row.total)}</strong>
              </span>
            `
          )
          .join("")}
      </div>
    </details>
  `;
}

function formatInventoryQuantity(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "Sin dato";
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: number % 1 === 0 ? 0 : 2,
  }).format(number);
}

function getInventoryBeverageState() {
  const source = state.sources.beverages;
  if (!sourceLooksValid("beverages", source)) return null;
  return unwrapBeveragePayload(source);
}

function getInventoryBeverageProducts() {
  const beverageState = getInventoryBeverageState();
  return Array.isArray(beverageState && beverageState.catalog)
    ? beverageState.catalog
        .slice()
        .sort((first, second) => {
          if (Boolean(first.archived) !== Boolean(second.archived)) {
            return first.archived ? 1 : -1;
          }
          return String(first.category || "").localeCompare(String(second.category || ""), "es") ||
            String(first.name || "").localeCompare(String(second.name || ""), "es");
        })
    : [];
}

function getInventoryProductStatus(product) {
  if (!product || product.archived === true) {
    return { label: "Archivado", className: "is-muted" };
  }
  if (product.productKind === "manufactured") {
    return { label: "Por receta", className: "is-blue" };
  }
  if (product.trackStock === false) {
    return { label: "Sin control", className: "is-muted" };
  }
  const stock = Number(product.stock);
  const threshold = Number(product.lowStockThreshold) || 0;
  if (!Number.isFinite(stock)) {
    return { label: "Sin dato", className: "is-muted" };
  }
  if (stock <= 0) {
    return { label: "Sin stock", className: "is-danger" };
  }
  if (threshold > 0 && stock <= threshold) {
    return { label: "Stock bajo", className: "is-warning" };
  }
  return { label: "Stock OK", className: "is-ready" };
}

function getInventoryProductStockLabel(product) {
  if (!product) return "Sin dato";
  if (product.archived === true) return "Archivado";
  if (product.productKind === "manufactured") return "Descuenta receta";
  if (product.trackStock === false) return "Sin control";
  return formatInventoryQuantity(product.stock);
}

function getInventoryProductKindLabel(product) {
  return product && product.productKind === "manufactured" ? "Elaborada" : "Fija";
}

function getBeverageInventorySummary(products) {
  const activeProducts = products.filter((product) => product.archived !== true);
  const stockControlledProducts = activeProducts.filter(
    (product) =>
      product.productKind !== "manufactured" &&
      product.trackStock !== false &&
      typeof product.stock === "number"
  );
  const lowStockProducts = stockControlledProducts.filter((product) => {
    const threshold = Number(product.lowStockThreshold) || 0;
    return threshold > 0 && Number(product.stock) > 0 && Number(product.stock) <= threshold;
  });
  const outOfStockProducts = stockControlledProducts.filter((product) => Number(product.stock) <= 0);
  const estimatedCostValue = stockControlledProducts.reduce(
    (total, product) => total + (Number(product.stock) || 0) * (Number(product.costPrice) || 0),
    0
  );
  const estimatedSaleValue = activeProducts.reduce((total, product) => {
    if (product.productKind === "manufactured" || product.trackStock === false) return total;
    return total + (Number(product.stock) || 0) * (Number(product.price) || 0);
  }, 0);

  return {
    total: products.length,
    active: activeProducts.length,
    archived: products.length - activeProducts.length,
    stockControlled: stockControlledProducts.length,
    lowStock: lowStockProducts.length,
    outOfStock: outOfStockProducts.length,
    estimatedCostValue,
    estimatedSaleValue,
  };
}

function renderInventoryPage() {
  const beverageProducts = getInventoryBeverageProducts();
  const beverageSummary = getBeverageInventorySummary(beverageProducts);
  const foodGroup = INVENTORY_GROUPS.find((group) => group.key === "food");
  const extrasGroup = INVENTORY_GROUPS.find((group) => group.key === "extras");

  return `
    <section class="panel inventory-overview-panel">
      <div class="panel-title-row">
        <div>
          <span class="source-tag">Inventario operativo</span>
          <h2>Stock e Inventario</h2>
          <p>Bebidas queda sincronizado con la Estaci&oacute;n de bebidas. Alimentos y Extras ya quedan separados para cargar compras, consumos y reposiciones en la siguiente etapa.</p>
        </div>
      </div>
      <div class="inventory-group-grid">
        ${renderInventoryGroupCard({
          title: "Bebidas",
          copy: "Cat&aacute;logo vivo: no se duplica stock, se lee lo mismo que usa el comandero.",
          value: beverageSummary.active,
          foot: `${beverageSummary.lowStock + beverageSummary.outOfStock} alertas · ${beverageSummary.archived} archivados`,
          tone: "teal",
        })}
        ${renderInventoryGroupCard({
          title: "Alimentos",
          copy: "Panificaci&oacute;n, desayuno, frescos, carnes, almac&eacute;n y helader&iacute;a.",
          value: foodGroup ? foodGroup.areas.length : 0,
          foot: "Familias listas para cargar stock",
          tone: "gold",
        })}
        ${renderInventoryGroupCard({
          title: "Extras operativos",
          copy: "Limpieza, lavander&iacute;a, ferreter&iacute;a, ba&ntilde;o y compras eventuales.",
          value: extrasGroup ? extrasGroup.areas.length : 0,
          foot: "Separado de alimentos y bebidas",
          tone: "violet",
        })}
      </div>
    </section>
    ${renderBeverageInventorySection(beverageProducts, beverageSummary)}
    <div class="inventory-two-column">
      ${renderInventoryAreaSection(foodGroup)}
      ${renderInventoryAreaSection(extrasGroup)}
    </div>
  `;
}

function renderInventoryGroupCard({ title, copy, value, foot, tone }) {
  return `
    <article class="inventory-group-card is-${escapeHtml(tone)}">
      <span>${escapeHtml(title)}</span>
      <strong>${escapeHtml(value)}</strong>
      <p>${copy}</p>
      <small>${escapeHtml(foot)}</small>
    </article>
  `;
}

function refreshInventoryBeverageSummary() {
  const container = document.querySelector("[data-inventory-beverage-summary]");
  if (!container) {
    return;
  }
  const products = getInventoryBeverageProducts();
  const summary = getBeverageInventorySummary(products);
  container.innerHTML = renderInventoryBeverageSummaryMarkup(summary);
}

function renderInventoryBeverageSummaryMarkup(summary) {
  return `
    <div class="inventory-kpi-row">
      <span><strong>${summary.stockControlled}</strong> con control</span>
      <span><strong>${summary.lowStock}</strong> bajo</span>
      <span><strong>${summary.outOfStock}</strong> sin stock</span>
    </div>
    <div class="inventory-value-strip">
      <div>
        <span>Valor estimado a costo</span>
        <strong>${formatMoney(summary.estimatedCostValue)}</strong>
      </div>
      <div>
        <span>Valor estimado a venta</span>
        <strong>${formatMoney(summary.estimatedSaleValue)}</strong>
      </div>
      <div>
        <span>Productos activos</span>
        <strong>${summary.active}</strong>
      </div>
    </div>
  `;
}

function renderBeverageInventorySection(products, summary) {
  const hasProducts = products.length > 0;
  return `
    <section id="inventory-beverages" class="panel inventory-section">
      <div class="panel-title-row">
        <div>
          <span class="source-tag">Bebidas</span>
          <h2>Stock de bebidas</h2>
          <p>Este listado toma el cat&aacute;logo real de la Estaci&oacute;n de bebidas: stock, umbral, costo, venta y estado.</p>
        </div>
      </div>
      <div data-inventory-beverage-summary>${renderInventoryBeverageSummaryMarkup(summary)}</div>
      ${
        hasProducts
          ? `<div class="table-wrap inventory-table-wrap">
              <table class="inventory-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categor&iacute;a</th>
                    <th>Tipo</th>
                    <th>Stock</th>
                    <th>Umbral</th>
                    <th>Costo</th>
                    <th>Venta</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  ${products.map(renderInventoryProductRow).join("")}
                </tbody>
              </table>
            </div>`
          : `<div class="empty-state">
              <strong>Sin cat&aacute;logo de bebidas visible.</strong>
              <p>El cat&aacute;logo aparecer&aacute; autom&aacute;ticamente cuando el JSON central tenga stock operativo.</p>
            </div>`
      }
    </section>
    <section class="panel inventory-catalog-panel">
      <div class="panel-title-row">
        <div>
          <span class="source-tag">Cat&aacute;logo operativo</span>
          <h2>Cat&aacute;logo y stock</h2>
          <p>Crear, editar, archivar y controlar recetas desde el mismo m&oacute;dulo que usa la Estaci&oacute;n de bebidas.</p>
        </div>
      </div>
      <iframe
        class="inventory-catalog-frame"
        data-beverage-catalog-frame
        src="${BEVERAGE_CATALOG_APP_URL}"
        title="Cat&aacute;logo y stock de bebidas"
        scrolling="no"
      ></iframe>
    </section>
  `;
}

function renderInventoryProductRow(product) {
  const status = getInventoryProductStatus(product);
  const threshold =
    product && product.productKind !== "manufactured" && product.trackStock !== false
      ? formatInventoryQuantity(product.lowStockThreshold)
      : "-";
  return `
    <tr class="${product.archived ? "is-archived" : ""}">
      <td>
        <strong class="inventory-product-name">${escapeHtml(product.name || "Producto")}</strong>
        <span class="inventory-product-subline">${product.sellable === false ? "Solo insumo" : "En venta"}</span>
      </td>
      <td>${escapeHtml(product.category || "Sin categoría")}</td>
      <td>${escapeHtml(getInventoryProductKindLabel(product))}</td>
      <td>${escapeHtml(getInventoryProductStockLabel(product))}</td>
      <td>${escapeHtml(threshold)}</td>
      <td>${formatMoney(product.costPrice)}</td>
      <td>${product.sellable === false ? "No vendible" : formatMoney(product.price)}</td>
      <td><span class="stock-status ${status.className}">${escapeHtml(status.label)}</span></td>
    </tr>
  `;
}

function renderInventoryAreaSection(group) {
  if (!group) return "";
  return `
    <section id="inventory-${escapeHtml(group.key)}" class="panel inventory-section inventory-area-section is-${escapeHtml(group.tone)}">
      <div class="panel-title-row">
        <div>
          <span class="source-tag">${escapeHtml(group.title)}</span>
          <h2>${escapeHtml(group.title)}</h2>
          <p>${escapeHtml(group.copy)}</p>
        </div>
        <span class="stock-status is-blue">Estructura lista</span>
      </div>
      <div class="inventory-area-grid">
        ${group.areas.map(renderInventoryAreaCard).join("")}
      </div>
    </section>
  `;
}

function renderInventoryAreaCard(area) {
  return `
    <article class="inventory-area-card ${area.isOpen ? "is-open" : ""}">
      <div>
        <strong>${escapeHtml(area.title)}</strong>
        <p>${escapeHtml(area.copy)}</p>
      </div>
      <span>${area.isOpen ? "Abierto" : "Familia"}</span>
    </article>
  `;
}

function renderModuleFrame(moduleKey) {
  const module = MODULES[moduleKey];
  return `
    <section class="panel module-frame-panel">
      <div class="panel-title-row">
        <div>
          <h2>${escapeHtml(module.title)}</h2>
          <p>${escapeHtml(module.subtitle)}</p>
        </div>
        <div class="actions-row">
          <a class="ghost-button is-compact" href="#${getDefaultAllowedModule()}">Volver al inicio</a>
          <a class="button is-compact" href="${module.src}" target="_blank" rel="noopener">Abrir en pestaña nueva</a>
        </div>
      </div>
      ${
        moduleKey === "checkin"
          ? `<div class="warning-note">
              Si el Check-in no carga dentro de esta pantalla, abrí el sistema con <strong>abrir-solanas.cmd</strong>.
              Ese acceso inicia el servidor local propio del paquete.
            </div>`
          : ""
      }
      <iframe class="module-frame" src="${module.src}" title="${escapeHtml(module.title)}"></iframe>
    </section>
  `;
}

function renderCheckoutDashboard() {
  const summary = getDashboardSummary();
  return `
    ${renderCheckoutToolbar(summary)}
    ${renderSummary(summary)}
    ${renderCheckoutSection()}
    ${renderGroupsSection()}
    ${renderBeveragesSection()}
    ${renderReportsSection()}
  `;
}

function renderCheckoutToolbar(summary) {
  const hasCheckin = Boolean(state.sources.checkin);
  const hasBeverages = Boolean(state.sources.beverages);
  const bridgeStatus = hasCheckin && hasBeverages
    ? "Listo para revisar saldos"
    : "Falta conectar una fuente";
  const bridgeCopy = hasCheckin && hasBeverages
    ? "Las reservas y consumos ya pueden cruzarse por habitación y por grupo."
    : "El sistema todavía no recibió datos operativos completos desde el JSON central.";

  return `
    <section class="panel checkout-toolbar">
      <div class="checkout-toolbar-grid">
        <div>
          <h2>Panel de cierre</h2>
          <p class="muted">${escapeHtml(bridgeCopy)}</p>
          <div class="hero-actions">
            <button class="button is-blue" data-action="open-report-modal">Emitir informe</button>
          </div>
        </div>
        <div class="checkout-toolbar-status">
          <nav class="hero-nav" aria-label="Secciones">
            <a href="#checkout-section">Check-out</a>
            <a href="#groups-section">Grupos</a>
            <a href="#reports-section">Informes</a>
          </nav>
          <div class="status-panel">
            <strong>${escapeHtml(bridgeStatus)}</strong>
            <span>${escapeHtml(bridgeCopy)}</span>
          </div>
          <div class="status-panel">
            <strong>${formatMoney(summary.dueTotal)}</strong>
            <span>Total pendiente detectado entre alojamiento y bebidas pendientes.</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSummary(summary) {
  return `
    <section class="summary-grid">
      <article class="stat-card">
        <span class="stat-label">Reservas activas</span>
        <strong class="stat-value">${summary.reservations}</strong>
        <span class="stat-foot">${summary.groups} grupos detectados</span>
      </article>
      <article class="stat-card">
        <span class="stat-label">Saldo alojamiento</span>
        <strong class="stat-value">${formatMoney(summary.lodgingPending)}</strong>
        <span class="stat-foot">Según total menos pagos del check-in</span>
      </article>
      <article class="stat-card">
        <span class="stat-label">Bebidas habitaciones</span>
        <strong class="stat-value">${formatMoney(summary.pendingBeverages)}</strong>
        <span class="stat-foot">Abiertos y saldos de estadía</span>
      </article>
      <article class="stat-card">
        <span class="stat-label">Choferes/coordinadores</span>
        <strong class="stat-value">${formatMoney(summary.groupDriverPending)}</strong>
        <span class="stat-foot">Cuenta acumulada pendiente</span>
      </article>
    </section>
  `;
}

function renderSourceCard(source) {
  const status = sourceStatus(source);
  return `
    <article class="source-card ${status.ready ? "is-ready" : ""}">
      <span class="source-tag">${escapeHtml(SOURCE_LABELS[source])}</span>
      <div class="source-copy">
        <strong>${escapeHtml(status.title)}</strong>
        <p>${escapeHtml(status.detail)}</p>
      </div>
      <div class="source-actions">
        <button class="button is-compact" data-action="trigger-import" data-source="${source}">
          Importar respaldo JSON
        </button>
        ${
          status.ready
            ? `<button class="ghost-button is-compact" data-action="clear-source" data-source="${source}">Desconectar</button>`
            : ""
        }
      </div>
    </article>
  `;
}

function renderCheckoutSection() {
  autoArchiveClearCheckouts();
  const rows = getVisibleCheckoutRows();
  const activeRows = rows.filter((row) => !row.settlement);
  const settledRows = rows.filter((row) => row.settlement);
  return `
    <section id="checkout-section" class="panel">
      <div class="panel-title-row">
        <div>
          <h2>Check-out</h2>
          <p>Reservas individuales y habitaciones de grupo con cruce directo contra bebidas abiertas y saldos de estadía.</p>
        </div>
        <div class="chip-row">
          <span class="chip is-green">${settledRows.length} registradas</span>
        </div>
      </div>
      ${
        activeRows.length
          ? `
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Reserva</th>
                    <th>Salida</th>
                    <th>Alojamiento</th>
                    <th>Bebidas pendientes</th>
                    <th>Total a revisar</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  ${activeRows.map(renderCheckoutRow).join("")}
                </tbody>
              </table>
            </div>
          `
          : `<div class="empty-state">No hay habitaciones pendientes de Check-out dentro de la ventana operativa.</div>`
      }
    </section>
  `;
}

function renderCheckoutRow(row) {
  const reservation = row.reservation;
  const stateLabel = getRowStateLabel(row);
  const lodgingPending = getCheckoutLodgingPending(row);
  const lodgingPaid = getCheckoutPaidAmount(row);
  const roomLabel = reservation.roomNumber ? `Hab ${reservation.roomNumber}` : "Sin habitación";
  const groupLine = reservation.groupName ? `Grupo: ${reservation.groupName}` : "Reserva individual";
  const beverageDetail = [
    `${getItemUnits(row.beverage.pendingItems)} unidades pendientes`,
    row.beverage.deferredTotal > 0 ? `Saldo estad\u00eda ${formatMoney(row.beverage.deferredTotal)}` : "",
    `${formatMoney(row.beverage.closedTotal)} ya cerrado`,
  ]
    .filter(Boolean)
    .join(" · ");
  return `
    <tr>
      <td>
        <div class="row-title">
          <strong>${escapeHtml(roomLabel)} · ${escapeHtml(reservation.guestName)}</strong>
          <span class="muted">${escapeHtml(groupLine)}</span>
        </div>
      </td>
      <td>${formatDate(reservation.checkOutDate)}</td>
      <td>
        <div class="money ${lodgingPending > 0 ? "is-danger" : "is-ok"}">${formatMoney(lodgingPending)}</div>
        <span class="muted">Total ${formatMoney(reservation.total)} · Pagado ${formatMoney(lodgingPaid)}</span>
      </td>
      <td>
        <div class="money ${row.beverage.pendingTotal > 0 ? "is-danger" : "is-ok"}">${formatMoney(row.beverage.pendingTotal)}</div>
        <span class="muted">${escapeHtml(beverageDetail)}</span>
      </td>
      <td><span class="money ${row.dueTotal > 0 ? "is-danger" : "is-ok"}">${formatMoney(row.dueTotal)}</span></td>
      <td>
        ${renderSettlementStateControl(row, stateLabel)}
        ${row.settlement ? `<div class="muted">${formatDateTime(row.settlement.paidAt)} &middot; ${escapeHtml(row.settlement.method || "-")}</div>` : ""}
      </td>
      <td>
        ${
          row.settlement
            ? `<button class="ghost-button is-compact" data-action="clear-settlement" data-key="${escapeHtml(row.key)}">Reabrir</button>`
            : row.dueTotal > 0
              ? `<button class="button is-compact" data-action="open-settlement-modal" data-key="${escapeHtml(row.key)}">Registrar cobro</button>`
              : `<span class="checkout-state is-ok">Sin cobro</span>`
        }
      </td>
    </tr>
  `;
}

function renderSettlementStateControl(row, stateLabel) {
  if (!row.settlement && row.dueTotal > 0) {
    return `
      <button
        class="checkout-state checkout-state-button ${stateLabel.className}"
        data-action="open-settlement-modal"
        data-key="${escapeHtml(row.key)}"
        type="button"
      >
        ${escapeHtml(stateLabel.label)}
      </button>
    `;
  }
  return `<span class="checkout-state ${stateLabel.className}">${escapeHtml(stateLabel.label)}</span>`;
}

function renderCheckoutHistorySection() {
  const rows = getCheckoutHistoryRows();
  return `
    <section id="checkout-history-section" class="panel checkout-history-panel">
      <div class="panel-title-row">
        <div>
          <h2>Hist&oacute;rico de Check-out</h2>
          <p>Habitaciones con cobro registrado y salida ordenada. Quedan separadas para que la lista principal no crezca sin fin.</p>
        </div>
        <span class="chip is-green">${rows.length} registradas</span>
      </div>
      ${
        rows.length
          ? `
            <div class="table-wrap checkout-history-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Habitaci&oacute;n</th>
                    <th>Salida</th>
                    <th>Alojamiento pagado</th>
                    <th>Bebidas pagadas</th>
                    <th>Forma de pago</th>
                    <th>Registrado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map(renderCheckoutHistoryRow).join("")}
                </tbody>
              </table>
            </div>
          `
          : `<div class="empty-state">Todav&iacute;a no hay check-outs registrados.</div>`
      }
    </section>
  `;
}

function renderCheckoutHistoryRow(row) {
  const reservation = row.reservation;
  const settlement = row.settlement || {};
  return `
    <tr>
      <td>
        <div class="row-title">
          <strong>Hab ${escapeHtml(reservation.roomNumber || "-")} · ${escapeHtml(reservation.guestName)}</strong>
          <span class="muted">${escapeHtml(reservation.groupName ? `Grupo: ${reservation.groupName}` : "Reserva individual")}</span>
        </div>
      </td>
      <td>${formatDate(reservation.checkOutDate)}</td>
      <td class="money">${formatMoney(settlement.lodgingAmount)}</td>
      <td class="money">${formatMoney(settlement.beverageAmount)}</td>
      <td>${escapeHtml(settlement.method || "-")}</td>
      <td>${formatDateTime(settlement.paidAt)}</td>
      <td><button class="ghost-button is-compact" data-action="clear-settlement" data-key="${escapeHtml(row.key)}">Reabrir</button></td>
    </tr>
  `;
}

function renderGroupsSection() {
  const rows = getGroupCheckoutRows();
  return `
    <section id="groups-section" class="panel is-soft">
      <div class="panel-title-row">
        <div>
          <h2>Grupos, choferes y coordinadores</h2>
          <p>Vista agregada para cerrar una reserva grupal completa, incluyendo habitaciones y cuenta de choferes/coordinadores.</p>
        </div>
      </div>
      ${
        rows.length
          ? `<div class="three-grid">${rows.map(renderGroupCard).join("")}</div>`
          : `<div class="empty-state">Cuando haya grupos importados desde check-in, van a aparecer acá.</div>`
      }
    </section>
  `;
}

function renderGroupCard(row) {
  const group = row.group;
  const stateLabel = getRowStateLabel(row);
  const roomNumbers = group.rooms.map((reservation) => reservation.roomNumber).filter(Boolean).join(", ");
  return `
    <article class="data-card">
      <div class="data-card-head">
        <div>
          <span class="kicker">Grupo</span>
          <h3>${escapeHtml(group.name)}</h3>
        </div>
        ${renderSettlementStateControl(row, stateLabel)}
      </div>
      <p>Habitaciones: ${escapeHtml(roomNumbers || "sin habitaciones")} · Estadía ${formatDate(group.checkInDate)} al ${formatDate(group.checkOutDate)}</p>
      <div class="chip-row">
        <span class="chip">Alojamiento ${formatMoney(group.lodgingPending)}</span>
        <span class="chip is-blue">Bebidas hab. ${formatMoney(row.roomBeverageTotal)}</span>
        <span class="chip is-rust">Choferes/coordinadores ${formatMoney(row.driverCoordinator.pendingTotal)}</span>
      </div>
      <div class="between" style="margin-top: 12px;">
        <strong class="money ${row.dueTotal > 0 ? "is-danger" : "is-ok"}">${formatMoney(row.dueTotal)}</strong>
        ${
          row.settlement
            ? `<button class="ghost-button is-compact" data-action="clear-settlement" data-key="${escapeHtml(row.key)}">Reabrir</button>`
            : row.dueTotal > 0
              ? `<button class="button is-compact" data-action="open-settlement-modal" data-key="${escapeHtml(row.key)}">Registrar grupo</button>`
              : `<span class="checkout-state is-ok">Sin cobro</span>`
        }
      </div>
    </article>
  `;
}

function renderBeveragesSection() {
  const roomEntries = Array.from(getRoomBeverageMap().values())
    .filter((entry) => entry.pendingTotal > 0 || entry.closedTotal > 0)
    .sort((left, right) => Number(left.roomNumber) - Number(right.roomNumber));
  const driverItems = getDriverCoordinatorItems();
  return `
    <section id="beverages-section" class="panel">
      <div class="panel-title-row">
        <div>
          <h2>Estación de bebidas</h2>
          <p>Lectura consolidada de habitaciones, cierres y cuentas pendientes de choferes/coordinadores.</p>
        </div>
      </div>
      <div class="two-grid">
        <div>
          <h3>Habitaciones</h3>
          ${
            roomEntries.length
              ? `<div class="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Habitación</th>
                        <th>Pendiente</th>
                        <th>Saldo estad\u00eda</th>
                        <th>Cerrado</th>
                        <th>Unidades pendientes</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${roomEntries
                        .map(
                          (entry) => `
                            <tr>
                              <td><strong>Hab ${escapeHtml(entry.roomNumber)}</strong></td>
                              <td class="money ${entry.pendingTotal > 0 ? "is-danger" : "is-ok"}">${formatMoney(entry.pendingTotal)}</td>
                              <td class="money">${formatMoney(entry.deferredTotal)}</td>
                              <td class="money">${formatMoney(entry.closedTotal)}</td>
                              <td>${getItemUnits(entry.pendingItems)}</td>
                            </tr>
                          `
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>`
              : `<div class="empty-state">Sin movimientos de habitaciones importados.</div>`
          }
        </div>
        <div>
          <h3>Choferes/coordinadores</h3>
          ${
            driverItems.length
              ? `<div class="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Grupo/persona</th>
                        <th>Producto</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${driverItems
                        .map(
                          (item) => `
                            <tr>
                              <td>
                                <strong>${escapeHtml(getDriverItemGroupName(item) || "Grupo sin nombre")}</strong>
                                <div class="muted">${escapeHtml(getDriverItemMemberName(item) || "Integrante")}</div>
                              </td>
                              <td>${escapeHtml(item.productName || item.name || "Producto")} x${Number(item.quantity) || 0}</td>
                              <td class="money">${formatMoney(getCollectionTotal([item]))}</td>
                            </tr>
                          `
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>`
              : `<div class="empty-state">Sin cuenta pendiente de choferes/coordinadores.</div>`
          }
        </div>
      </div>
    </section>
  `;
}

function renderReportsSection() {
  const range = getMonthRange();
  return `
    <section id="reports-section" class="panel">
      <div class="panel-title-row">
        <div>
          <h2>Informes HTML</h2>
          <p>El botón abre una ventana emergente y permite elegir entre reporte general, grupo puntual o reservas individuales.</p>
        </div>
        <button class="button is-blue" data-action="open-report-modal">Emitir informe</button>
      </div>
      <div class="field-grid">
        <label class="field">
          <span>Mes de trabajo</span>
          <input type="month" value="${escapeHtml(state.selectedMonth)}" data-action-input="selected-month" />
          <small>Para el mes actual se toma desde el día 1 hasta hoy.</small>
        </label>
        <div class="data-card">
          <span class="kicker">Periodo activo</span>
          <strong>${formatDate(range.start)} al ${formatDate(range.end)}</strong>
          <p>Los informes usan este rango.</p>
        </div>
      </div>
    </section>
  `;
}

function valueOrPending(value) {
  const text = String(value || "").trim();
  return text || "Sin cargar";
}

function getGuestDisplayName(guest = {}) {
  const lastFirst = [guest.lastName, guest.firstName].filter(Boolean).join(", ").trim();
  if (lastFirst) return lastFirst;
  return [guest.firstName, guest.lastName].filter(Boolean).join(" ").trim() || "Sin cargar";
}

function hasGuestIdentity(guest = {}) {
  return Boolean(
    guest.firstName ||
      guest.lastName ||
      guest.document ||
      guest.birthDate ||
      guest.gender ||
      guest.nationality
  );
}

function getRawCheckinReservations() {
  const reservations =
    state.sources.checkin && Array.isArray(state.sources.checkin.reservations)
      ? state.sources.checkin.reservations
      : [];
  return reservations
    .filter((reservation) => reservation && reservation.archived !== true && isRawOperationalReservation(reservation))
    .sort((left, right) => {
      const dateCompare = String(left.checkInDate || "").localeCompare(String(right.checkInDate || ""));
      if (dateCompare !== 0) return dateCompare;
      return Number(left.roomNumber || 0) - Number(right.roomNumber || 0);
    });
}

function getGuestRegisterRows() {
  const rows = [];
  getRawCheckinReservations().forEach((reservation) => {
    const responsible = reservation.responsible || {};
    const legalTravelOrigin = getReservationTravelOrigin(reservation);
    const responsibleName =
      [responsible.lastName, responsible.firstName].filter(Boolean).join(", ").trim() ||
      [responsible.firstName, responsible.lastName].filter(Boolean).join(" ").trim() ||
      "Sin cargar";
    const guests = Array.isArray(reservation.guests)
      ? reservation.guests.filter(hasGuestIdentity)
      : [];
    const sourceGuests = guests.length ? guests : [responsible];
    sourceGuests.forEach((guest, index) => {
      const rowTravelOrigin =
        legalTravelOrigin || sanitizeTravelOrigin(guest.origin || guest.destination);
      rows.push({
        number: rows.length + 1,
        roomNumber: String(reservation.roomNumber || "").trim(),
        checkInDate: normalizeDate(reservation.checkInDate),
        checkOutDate: normalizeDate(reservation.checkOutDate),
        entryTime: reservation.confirmedAt || reservation.createdAt || "",
        exitTime: "",
        guestName: getGuestDisplayName(guest),
        document: guest.document || "",
        nationality: guest.nationality || responsible.nationality || "Argentina",
        birthDate: guest.birthDate || "",
        gender: guest.gender || "",
        address: guest.address || responsible.address || reservation.address || "",
        origin: rowTravelOrigin,
        destination: rowTravelOrigin,
        phone: index === 0 ? reservation.phone || responsible.phone || "" : "",
        email: index === 0 ? reservation.email || responsible.email || "" : "",
        groupName: String(reservation.groupCompany || "").trim(),
        responsibleName,
        registeredAt: reservation.confirmedAt || reservation.updatedAt || reservation.createdAt || "",
      });
    });
  });
  return rows;
}

function getGuestRegisterMissingCount(rows) {
  return rows.filter((row) => !row.guestName || row.guestName === "Sin cargar" || !row.document).length;
}

function getOperationalGuestRegisterRows(rows) {
  const oldestVisibleCheckOut = addDaysToInputDate(getTodayInputDate(), -4);
  return rows.filter((row) => {
    const checkOutDate = normalizeDate(row.checkOutDate);
    return !checkOutDate || checkOutDate >= oldestVisibleCheckOut;
  });
}

function renderGuestRegisterDashboard() {
  const rows = getGuestRegisterRows();
  const operationalRows = getOperationalGuestRegisterRows(rows);
  const missingCount = getGuestRegisterMissingCount(rows);
  const operationalRooms = new Set(operationalRows.map((row) => row.roomNumber).filter(Boolean));
  return `
    <section id="guest-register-section" class="panel checkout-toolbar register-toolbar">
      <div class="checkout-toolbar-grid">
        <div>
          <h2>Libro de Registro de Hu&eacute;spedes</h2>
          <p class="muted">
            Registro consolidado de las reservas cargadas en Check-in, con una fila por hu&eacute;sped y una salida preparada para imprimir o guardar como PDF.
          </p>
          <div class="hero-actions">
            <button class="button is-blue" data-action="print-guest-register" ${rows.length ? "" : "disabled"}>Descargar PDF</button>
            <span class="chip is-green">Actualizaci&oacute;n autom&aacute;tica</span>
          </div>
        </div>
        <div class="checkout-toolbar-status">
          <div class="status-panel">
            <strong>${operationalRows.length} registros en vista</strong>
            <span>${operationalRooms.size} habitaciones. Se muestran hasta cuatro d&iacute;as despu&eacute;s del egreso.</span>
          </div>
          <div class="status-panel">
            <strong>${rows.length} registros hist&oacute;ricos</strong>
            <span>Todos permanecen en el PDF descargable. ${missingCount} tienen nombre o documento pendiente.</span>
          </div>
        </div>
      </div>
    </section>
    <section class="panel">
      <div class="panel-title-row">
        <div>
          <h2>Registro legal operativo</h2>
          <p>La tabla conserva en vista a cada hu&eacute;sped hasta cuatro d&iacute;as posteriores a su egreso. El PDF mantiene el historial completo.</p>
        </div>
      </div>
      ${operationalRows.length ? renderGuestRegisterTable(operationalRows) : `<div class="empty-state">No hay hu&eacute;spedes dentro del per&iacute;odo operativo visible. Los registros anteriores contin&uacute;an disponibles en el PDF.</div>`}
      <div class="legal-note">
        Formato de trabajo basado en los campos habituales de registro: apellido y nombre, documento, nacionalidad, procedencia, domicilio y fechas/horas de ingreso y egreso. Conviene validar la plantilla final con la normativa municipal/provincial que aplique al establecimiento.
      </div>
    </section>
  `;
}

function renderGuestRegisterTable(rows) {
  return `
    <div class="table-wrap register-table-wrap">
      <table class="register-table">
        <thead>
          <tr>
            <th>N&deg;</th>
            <th>Hab.</th>
            <th>Ingreso / egreso</th>
            <th>Apellido y nombre</th>
            <th>Documento</th>
            <th>Nacionalidad</th>
            <th>Nac. / sexo</th>
            <th>Domicilio</th>
            <th>Procedencia</th>
            <th>Destino</th>
            <th>Contacto</th>
            <th>Grupo / responsable</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(renderGuestRegisterRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderGuestRegisterRow(row) {
  return `
    <tr class="${!row.document || row.guestName === "Sin cargar" ? "is-incomplete" : ""}">
      <td>${row.number}</td>
      <td><strong>${escapeHtml(row.roomNumber || "-")}</strong></td>
      <td>
        ${formatDate(row.checkInDate)} al ${formatDate(row.checkOutDate)}
        <div class="muted">Ing. ${escapeHtml(row.entryTime ? formatDateTime(row.entryTime) : "sin hora")} &middot; Eg. ${escapeHtml(row.exitTime || "sin registrar")}</div>
      </td>
      <td><strong>${escapeHtml(row.guestName)}</strong></td>
      <td>${escapeHtml(valueOrPending(row.document))}</td>
      <td>${escapeHtml(valueOrPending(row.nationality))}</td>
      <td>${escapeHtml(valueOrPending(row.birthDate))}<div class="muted">${escapeHtml(valueOrPending(row.gender))}</div></td>
      <td>${escapeHtml(valueOrPending(row.address))}</td>
      <td>${escapeHtml(valueOrPending(row.origin))}</td>
      <td>${escapeHtml(valueOrPending(row.destination))}</td>
      <td>
        ${escapeHtml(valueOrPending(row.phone))}
        <div class="muted">${escapeHtml(row.email || "")}</div>
      </td>
      <td>
        ${escapeHtml(row.groupName || "Individual")}
        <div class="muted">Resp. ${escapeHtml(row.responsibleName)}</div>
      </td>
    </tr>
  `;
}

function openGuestRegisterPrint() {
  const rows = getGuestRegisterRows();
  if (!rows.length) {
    alert("Todav\u00eda no hay registros para imprimir.");
    return;
  }
  openDocumentWindow(buildGuestRegisterPrintHtml(rows), "Libro de Registro de Hu\u00e9spedes");
}

function buildGuestRegisterPrintHtml(rows) {
  const generatedAt = new Date().toISOString();
  const fileName = `solanas-libro-registro-huespedes-${getTodayInputDate()}.html`;
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Libro de Registro de Hu&eacute;spedes</title>
    <style>
      @page { size: A4 landscape; margin: 7mm; }
      body { margin: 0; color: #000; background: #fff; font-family: "Segoe UI", Arial, sans-serif; }
      .page { width: min(1280px, calc(100vw - 24px)); margin: 10px auto; display: grid; gap: 8px; }
      header, section { border: 1px solid #000; border-radius: 10px; background: #fff; padding: 8px; }
      header { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: #000; }
      header img { width: 54px; height: 54px; object-fit: contain; padding: 6px; border-radius: 10px; border: 1px solid #000; }
      h1, p { margin: 0; }
      p { margin-top: 4px; color: #000; line-height: 1.3; }
      header p { color: #000; }
      button { min-height: 38px; padding: 8px 12px; border: 0; border-radius: 10px; color: #fff; background: #35629c; font: inherit; font-weight: 800; cursor: pointer; }
      table { width: 100%; border-collapse: collapse; font-size: 10.5px; background: #fff; color: #000; }
      th, td { padding: 5px 4px; border: 1px solid #000; text-align: left; vertical-align: top; color: #000; }
      th { color: #000; background: #f1f1f1; font-size: 9.5px; letter-spacing: .04em; text-transform: uppercase; }
      .muted { color: #000; }
      .note { font-size: 12px; }
      @media print {
        body { background: #fff; }
        button { display: none; }
        .page { width: auto; margin: 0; }
        header, section { border-radius: 0; box-shadow: none; }
        section { padding: 0; border: 0; }
        .note { display: none; }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <header>
        <div style="display:flex; gap:14px; align-items:center;">
          <img src="${LOGO_URL}" alt="Solanas" />
          <div>
            <h1>Libro de Registro de Hu&eacute;spedes</h1>
            <p>Hotel Termal Solanas &middot; Generado: ${formatDateTime(generatedAt)} &middot; ${rows.length} registros</p>
          </div>
        </div>
        <button onclick="window.print()">Descargar PDF / imprimir</button>
      </header>
      <section>
        ${renderGuestRegisterPrintTable(rows)}
      </section>
      <section class="note">
        <strong>Observaci&oacute;n normativa.</strong>
        Este formato digital consolida los datos disponibles del Check-in y marca como "Sin cargar" los campos pendientes de la ficha. Antes de usarlo como libro definitivo, validar exigencias municipales/provinciales aplicables.
      </section>
    </div>
    <script>
      function downloadRegisterHtml() {
        const html = document.documentElement.outerHTML;
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = ${JSON.stringify(fileName)};
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 500);
      }
    </script>
  </body>
</html>`;
}

function renderGuestRegisterPrintTable(rows) {
  return `
    <table>
      <thead>
        <tr>
          <th>N&deg;</th>
          <th>Hab.</th>
          <th>Ingreso</th>
          <th>Egreso</th>
          <th>Apellido y nombre</th>
          <th>Documento</th>
          <th>Nacionalidad</th>
          <th>Nacimiento</th>
          <th>Sexo</th>
          <th>Domicilio</th>
          <th>Procedencia</th>
          <th>Destino</th>
          <th>Tel./correo</th>
          <th>Grupo/responsable</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                <td>${row.number}</td>
                <td>${escapeHtml(row.roomNumber || "-")}</td>
                <td>${formatDate(row.checkInDate)}<div class="muted">${escapeHtml(row.entryTime ? formatDateTime(row.entryTime) : "sin hora")}</div></td>
                <td>${formatDate(row.checkOutDate)}<div class="muted">${escapeHtml(row.exitTime || "sin registrar")}</div></td>
                <td>${escapeHtml(row.guestName)}</td>
                <td>${escapeHtml(valueOrPending(row.document))}</td>
                <td>${escapeHtml(valueOrPending(row.nationality))}</td>
                <td>${escapeHtml(valueOrPending(row.birthDate))}</td>
                <td>${escapeHtml(valueOrPending(row.gender))}</td>
                <td>${escapeHtml(valueOrPending(row.address))}</td>
                <td>${escapeHtml(valueOrPending(row.origin))}</td>
                <td>${escapeHtml(valueOrPending(row.destination))}</td>
                <td>${escapeHtml([row.phone, row.email].filter(Boolean).join(" / ") || "Sin cargar")}</td>
                <td>${escapeHtml(row.groupName || "Individual")}<div class="muted">${escapeHtml(row.responsibleName)}</div></td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderSettlementModal() {
  const modal = ui.settlementModal;
  if (!modal) return "";
  return `
    <div class="modal-backdrop">
      <div class="modal settlement-modal" role="dialog" aria-modal="true" aria-labelledby="settlement-modal-title">
        <div class="panel-title-row">
          <div>
            <span class="source-tag">Check-out</span>
            <h2 id="settlement-modal-title">Registrar cobro pendiente</h2>
            <p>Eleg&iacute; la caja correcta para cerrar ${escapeHtml(modal.title)}.</p>
          </div>
          <button class="ghost-button is-compact" data-action="close-settlement-modal">Cancelar</button>
        </div>
        <div class="settlement-summary">
          <span>Alojamiento <strong>${formatMoney(modal.lodgingAmount)}</strong></span>
          <span>Bebidas <strong>${formatMoney(modal.beverageAmount)}</strong></span>
          <span>Total <strong>${formatMoney(modal.amount)}</strong></span>
        </div>
        <div class="settlement-choice-grid">
          <button class="settlement-choice" data-action="confirm-settlement-method" data-key="${escapeHtml(modal.key)}" data-method="cash">
            <strong>Efectivo</strong>
            <span>Hotel efectivo y/o Bebidas efectivo, separado por concepto.</span>
          </button>
          <button class="settlement-choice" data-action="confirm-settlement-method" data-key="${escapeHtml(modal.key)}" data-method="transfer">
            <strong>Transferencia bancaria</strong>
            <span>Hotel transferencia y/o Bebidas transferencia, separado por concepto.</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderCashWithdrawalModal() {
  const modal = ui.cashWithdrawalModal;
  if (!modal) return "";
  const box = normalizeCashboxKey(modal.box);
  const cashboxes = getCashboxTotals();
  const available = box ? cashboxes[box].adjustedCash : 0;
  const amount = String(modal.amount || "");
  const parsedAmount = parseAmount(amount);
  const remaining = parsedAmount > 0 ? available - parsedAmount : available;
  const hasError = Boolean(modal.error);
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cash-withdrawal-modal-title">
      <div class="modal cash-withdrawal-modal">
        <div class="panel-title-row">
          <div>
            <span class="source-tag">Cajas</span>
            <h2 id="cash-withdrawal-modal-title">Retirar efectivo</h2>
            <p>Registr&aacute; una salida de ${escapeHtml(getCashboxLabel(box))} sin permitir que la caja quede en negativo.</p>
          </div>
          <button class="ghost-button is-compact" data-action="close-cash-withdrawal-modal">Cancelar</button>
        </div>
        <div class="cash-withdrawal-summary">
          <span>
            <small>Caja</small>
            <strong>${escapeHtml(getCashboxLabel(box))}</strong>
          </span>
          <span>
            <small>Disponible</small>
            <strong>${formatMoney(available)}</strong>
          </span>
          <span>
            <small>Luego del retiro</small>
            <strong class="${remaining < 0 ? "is-danger" : ""}">${formatMoney(remaining)}</strong>
          </span>
        </div>
        <label class="field cash-withdrawal-field">
          <span>Monto a retirar</span>
          <div class="money-field-shell">
            <span class="money-prefix">$</span>
            <input
              type="text"
              inputmode="numeric"
              value="${escapeHtml(amount)}"
              data-action-input="cash-withdrawal-amount"
              placeholder="0"
              autocomplete="off"
              autofocus
            />
          </div>
          <small class="${hasError ? "cash-withdrawal-error" : ""}">
            ${hasError ? escapeHtml(modal.error) : "El retiro quedar&aacute; guardado como movimiento de caja."}
          </small>
        </label>
        <div class="actions-row cash-withdrawal-modal-actions">
          <button class="button" data-action="confirm-cash-withdrawal">Registrar retiro</button>
          <button class="ghost-button" data-action="close-cash-withdrawal-modal">Cancelar</button>
        </div>
      </div>
    </div>
  `;
}

function renderReportModal() {
  const groups = getReportableGroups();
  if (ui.reportType === "group" && !ui.reportGroupKey && groups.length) {
    ui.reportGroupKey = groups[0].key;
  }
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="report-modal-title">
      <div class="modal">
        <div class="panel-title-row">
          <div>
            <h2 id="report-modal-title">Emitir informe</h2>
            <p>Elegí el alcance del reporte HTML. Se abrirá en una ventana nueva.</p>
          </div>
          <button class="ghost-button is-compact" data-action="close-report-modal">Cerrar</button>
        </div>
        <div class="report-option-grid">
          ${Object.entries(REPORT_TYPES)
            .map(
              ([key, option]) => `
                <button class="report-option ${ui.reportType === key ? "is-selected" : ""}" data-action="set-report-type" data-report-type="${key}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <span class="muted">${escapeHtml(option.copy)}</span>
                </button>
              `
            )
            .join("")}
        </div>
        <div class="field-grid" style="margin-top: 16px;">
          <label class="field">
            <span>Mes</span>
            <input type="month" value="${escapeHtml(state.selectedMonth)}" data-action-input="selected-month" />
          </label>
          ${
            ui.reportType === "group"
              ? `<label class="field">
                  <span>Grupo</span>
                  <select data-action-input="report-group">
                    ${groups
                      .map(
                        (group) => `<option value="${escapeHtml(group.key)}" ${group.key === ui.reportGroupKey ? "selected" : ""}>${escapeHtml(group.name)}</option>`
                      )
                      .join("")}
                  </select>
                </label>`
              : ""
          }
        </div>
        <div class="actions-row" style="margin-top: 18px;">
          <button class="button is-blue" data-action="generate-report">Generar HTML</button>
          <button class="ghost-button" data-action="close-report-modal">Cancelar</button>
        </div>
      </div>
    </div>
  `;
}

function getReservationsForMonth({ includeGroups = true, groupKey = "" } = {}) {
  const range = getMonthRange();
  return getReservations().filter((reservation) => {
    if (!rangesOverlap(reservation.checkInDate, reservation.checkOutDate, range)) return false;
    if (!includeGroups && reservation.groupName) return false;
    if (groupKey && reservation.groupKey !== groupKey) return false;
    return true;
  });
}

function getClosedRoomsForMonth({ roomNumbers = null } = {}) {
  const range = getMonthRange();
  const roomSet = roomNumbers ? new Set(roomNumbers.map(String)) : null;
  const rows = [];
  const pushRoom = (room, shift = {}) => {
    const date = room.closedAt || shift.closedAt || shift.openedAt;
    if (!isDateInRange(date, range)) return;
    const roomNumber = roomNumberFromRoom(room);
    if (roomSet && !roomSet.has(roomNumber)) return;
    rows.push({ ...room, shiftService: shift.serviceLabel || "" });
  };
  const shift = getActiveShift();
  if (shift) {
    (shift.closedRooms || []).forEach((room) => pushRoom(room, shift));
  }
  const history = getBeverageState() && Array.isArray(getBeverageState().shiftHistory)
    ? getBeverageState().shiftHistory
    : [];
  history.forEach((historicalShift) => {
    (historicalShift.closedRooms || []).forEach((room) => pushRoom(room, historicalShift));
  });
  return rows;
}

function getOpenRoomsForReport({ roomNumbers = null } = {}) {
  const roomSet = roomNumbers ? new Set(roomNumbers.map(String)) : null;
  const shift = getActiveShift();
  if (!shift || !Array.isArray(shift.rooms)) return [];
  return shift.rooms
    .filter((room) => Array.isArray(room.items) && room.items.length)
    .filter((room) => {
      const roomNumber = roomNumberFromRoom(room);
      return !roomSet || roomSet.has(roomNumber);
    });
}

function getCashierSalesForMonth() {
  const range = getMonthRange();
  const rows = [];
  const pushShiftSales = (shift = {}) => {
    const shiftDate = shift.closedAt || shift.openedAt;
    if (!isDateInRange(shiftDate, range)) return;
    (shift.cashierSales || []).forEach((item) => {
      rows.push({
        ...item,
        shiftService: shift.serviceLabel || "",
        shiftDate,
      });
    });
  };
  const shift = getActiveShift();
  if (shift) pushShiftSales(shift);
  const history = getBeverageState() && Array.isArray(getBeverageState().shiftHistory)
    ? getBeverageState().shiftHistory
    : [];
  history.forEach(pushShiftSales);
  return rows;
}

function getReportDataset() {
  const range = getMonthRange();
  const type = ui.reportType;
  const groupKey = type === "group" ? ui.reportGroupKey : "";
  const includeGroups = type !== "individuals";
  const reservations = getReservationsForMonth({ includeGroups, groupKey });
  const roomNumbers = reservations.map((reservation) => reservation.roomNumber).filter(Boolean);
  const scopedRoomNumbers = type === "general" ? null : roomNumbers;
  const closedRooms = getClosedRoomsForMonth({ roomNumbers: scopedRoomNumbers });
  const openRooms = getOpenRoomsForReport({ roomNumbers: scopedRoomNumbers });
  const groupRows = groupKey
    ? getGroupCheckoutRows().filter((row) => row.group.key === groupKey)
    : getGroupCheckoutRows();
  const driverRows = groupKey
    ? getGroupBeverageByKey(groupKey).pendingItems
    : getDriverCoordinatorItems();
  const cashierRows = type === "general" ? getCashierSalesForMonth() : [];
  return {
    type,
    range,
    groupKey,
    reservations,
    closedRooms,
    openRooms,
    groupRows,
    driverRows,
    cashierRows,
  };
}

function buildReportHtml(dataset) {
  const title = getReportTitle(dataset);
  const lodgingTotal = dataset.reservations.reduce((sum, reservation) => sum + reservation.total, 0);
  const lodgingPending = dataset.reservations.reduce(
    (sum, reservation) => sum + getReportReservationPending(reservation),
    0
  );
  const closedBeverages = dataset.closedRooms.reduce((sum, room) => sum + (Number(room.total) || getCollectionTotal(room.items || [])), 0);
  const deferredBeverages = dataset.closedRooms
    .filter((room) => isDeferredStayPayment(room.paymentMethod))
    .reduce((sum, room) => sum + (Number(room.total) || getCollectionTotal(room.items || [])), 0);
  const openBeverages = dataset.openRooms.reduce((sum, room) => sum + getCollectionTotal(room.items || []), 0);
  const cashierTotal = getCollectionTotal(dataset.cashierRows);
  const driverPending = getCollectionTotal(dataset.driverRows);
  const generatedAt = new Date().toISOString();
  const fileName = `solanas-informe-${slugify(title)}-${state.selectedMonth}.html`;

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { margin: 0; color: #1e2c2f; background: #f7f0e6; font-family: Trebuchet MS, Gill Sans, sans-serif; }
      .page { width: min(1180px, calc(100vw - 28px)); margin: 24px auto; display: grid; gap: 18px; }
      header, section { border: 1px solid rgba(30,44,47,.12); border-radius: 18px; background: rgba(255,252,247,.96); padding: 18px; box-shadow: 0 12px 28px rgba(31,40,42,.08); }
      header { display: flex; gap: 16px; align-items: center; justify-content: space-between; background: #075d60; color: #fff8ee; }
      header img { width: 72px; height: 72px; object-fit: contain; padding: 8px; border-radius: 16px; background: rgba(255,255,255,.14); }
      h1, h2, h3 { margin: 0; }
      p { margin: 6px 0 0; color: #5c6d70; line-height: 1.45; }
      header p { color: rgba(255,248,238,.78); }
      .summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
      .card { padding: 14px; border-radius: 14px; border: 1px solid rgba(30,44,47,.1); background: rgba(255,255,255,.72); }
      .label { display:block; color:#5c6d70; font-size:.78rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; }
      .value { display:block; margin-top:8px; font-size:1.45rem; font-weight:900; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 10px 9px; border-bottom: 1px solid rgba(30,44,47,.08); text-align: left; vertical-align: top; }
      th { color: #5c6d70; font-size: .78rem; letter-spacing:.07em; text-transform: uppercase; }
      .money { white-space: nowrap; font-weight: 900; }
      .muted { color: #5c6d70; }
      .toolbar { display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
      button { min-height: 38px; padding: 8px 12px; border: 0; border-radius: 10px; color: #fff; background: #35629c; font: inherit; font-weight: 800; cursor: pointer; }
      @media (max-width: 760px) { header, .summary { grid-template-columns: 1fr; } header { display:grid; } }
      @media print { body { background: #fff; } button { display:none; } .page { width: auto; margin: 0; } header, section { box-shadow:none; } }
    </style>
  </head>
  <body>
    <div class="page">
      <header>
        <div style="display:flex; gap:16px; align-items:center;">
          <img src="${LOGO_URL}" alt="Solanas" />
          <div>
            <h1>${escapeHtml(title)}</h1>
            <p>Periodo: ${formatDate(dataset.range.start)} al ${formatDate(dataset.range.end)} · Generado: ${formatDateTime(generatedAt)}</p>
          </div>
        </div>
        <div class="toolbar">
          <button onclick="window.print()">Imprimir</button>
          <button onclick="downloadReportHtml()">Guardar HTML</button>
        </div>
      </header>
      <section class="summary">
        <div class="card"><span class="label">Reservas</span><strong class="value">${dataset.reservations.length}</strong></div>
        <div class="card"><span class="label">Alojamiento total</span><strong class="value">${formatMoney(lodgingTotal)}</strong></div>
        <div class="card"><span class="label">Saldo alojamiento</span><strong class="value">${formatMoney(lodgingPending)}</strong></div>
        <div class="card"><span class="label">Bebidas cerradas</span><strong class="value">${formatMoney(closedBeverages)}</strong></div>
        <div class="card"><span class="label">Saldo estad\u00eda</span><strong class="value">${formatMoney(deferredBeverages)}</strong></div>
        <div class="card"><span class="label">Bebidas abiertas</span><strong class="value">${formatMoney(openBeverages)}</strong></div>
        <div class="card"><span class="label">Caja directa</span><strong class="value">${formatMoney(cashierTotal)}</strong></div>
      </section>
      <section>
        <h2>Reservas trianguladas</h2>
        ${renderReportReservationsTable(dataset.reservations)}
      </section>
      <section>
        <h2>Bebidas abiertas al momento</h2>
        ${renderReportOpenRoomsTable(dataset.openRooms)}
      </section>
      <section>
        <h2>Bebidas por habitaciones del informe</h2>
        ${renderReportClosedRoomsTable(dataset.closedRooms)}
      </section>
      ${
        dataset.type === "general"
          ? `<section>
              <h2>Caja directa del mes</h2>
              ${renderReportCashierTable(dataset.cashierRows)}
            </section>`
          : ""
      }
      <section>
        <h2>Choferes y coordinadores</h2>
        <p>Total pendiente detectado: <strong>${formatMoney(driverPending)}</strong></p>
        ${renderReportDriverTable(dataset.driverRows)}
      </section>
      <section>
        <h2>Marcas de check-out del sistema</h2>
        ${renderReportSettlementsTable()}
      </section>
    </div>
    <script>
      function downloadReportHtml() {
        const html = document.documentElement.outerHTML;
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = ${JSON.stringify(fileName)};
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 500);
      }
    </script>
  </body>
</html>`;
}

function getReportTitle(dataset) {
  if (dataset.type === "individuals") return `Solanas - reservas individuales ${state.selectedMonth}`;
  if (dataset.type === "group") {
    const group = getReportableGroups().find((entry) => entry.key === dataset.groupKey);
    return `Solanas - grupo ${group ? group.name : dataset.groupKey} ${state.selectedMonth}`;
  }
  return `Solanas - reporte general ${state.selectedMonth}`;
}

function renderReportReservationsTable(reservations) {
  if (!reservations.length) return `<p class="muted">Sin reservas para este alcance.</p>`;
  return `
    <table>
      <thead>
        <tr>
          <th>Habitación</th>
          <th>Reserva</th>
          <th>Estadía</th>
          <th>Grupo</th>
          <th>Total</th>
          <th>Pagado</th>
          <th>Saldo</th>
        </tr>
      </thead>
      <tbody>
        ${reservations
          .map(
            (reservation) => `
              <tr>
                <td>Hab ${escapeHtml(reservation.roomNumber || "-")}</td>
                <td>${escapeHtml(reservation.guestName)}</td>
                <td>${formatDate(reservation.checkInDate)} al ${formatDate(reservation.checkOutDate)}</td>
                <td>${escapeHtml(reservation.groupName || "Individual")}</td>
                <td class="money">${formatMoney(reservation.total)}</td>
                <td class="money">${formatMoney(getReportReservationPaid(reservation))}</td>
                <td class="money">${formatMoney(getReportReservationPending(reservation))}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderReportOpenRoomsTable(rooms) {
  if (!rooms.length) return `<p class="muted">Sin consumos abiertos de habitación para este alcance.</p>`;
  return `
    <table>
      <thead>
        <tr>
          <th>Habitación</th>
          <th>Última actualización</th>
          <th>Ítems abiertos</th>
          <th>Total abierto</th>
        </tr>
      </thead>
      <tbody>
        ${rooms
          .map(
            (room) => `
              <tr>
                <td>${escapeHtml(room.label || room.id || "-")}</td>
                <td>${formatDateTime(room.updatedAt)}</td>
                <td>${getItemUnits(room.items || [])}</td>
                <td class="money">${formatMoney(getCollectionTotal(room.items || []))}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderReportClosedRoomsTable(rooms) {
  if (!rooms.length) return `<p class="muted">Sin cierres de bebidas para estas habitaciones en el periodo.</p>`;
  return `
    <table>
      <thead>
        <tr>
          <th>Habitación</th>
          <th>Fecha</th>
          <th>Servicio</th>
          <th>Forma</th>
          <th>Ítems</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${rooms
          .map(
            (room) => `
              <tr>
                <td>${escapeHtml(room.roomLabel || room.label || room.roomId || "-")}</td>
                <td>${formatDateTime(room.closedAt)}</td>
                <td>${escapeHtml(room.shiftService || "-")}</td>
                <td>${escapeHtml(getPaymentMethodLabel(room.paymentMethod))}</td>
                <td>${getItemUnits(room.items || [])}</td>
                <td class="money">${formatMoney(Number(room.total) || getCollectionTotal(room.items || []))}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderReportCashierTable(items) {
  if (!items.length) return `<p class="muted">Sin ventas de caja directa para el periodo.</p>`;
  return `
    <table>
      <thead>
        <tr>
          <th>Fecha/turno</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Forma</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
              <tr>
                <td>${formatDateTime(item.shiftDate)}<div class="muted">${escapeHtml(item.shiftService || "-")}</div></td>
                <td>${escapeHtml(item.name || item.productName || "Producto")}</td>
                <td>${Number(item.quantity) || 0}</td>
                <td>${escapeHtml(item.paymentMethod || "sin definir")}</td>
                <td class="money">${formatMoney(getCollectionTotal([item]))}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderReportDriverTable(items) {
  if (!items.length) return `<p class="muted">Sin cuenta pendiente de choferes/coordinadores para este alcance.</p>`;
  return `
    <table>
      <thead>
        <tr>
          <th>Grupo</th>
          <th>Integrante</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
              <tr>
                <td>${escapeHtml(getDriverItemGroupName(item) || "Grupo sin nombre")}</td>
                <td>${escapeHtml(getDriverItemMemberName(item) || "-")}</td>
                <td>${escapeHtml(item.productName || item.name || "Producto")}</td>
                <td>${Number(item.quantity) || 0}</td>
                <td class="money">${formatMoney(getCollectionTotal([item]))}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderReportSettlementsTable() {
  const entries = Object.entries(state.settlements || {});
  if (!entries.length) return `<p class="muted">Todavía no hay check-outs registrados desde el sistema.</p>`;
  return `
    <table>
      <thead>
        <tr>
          <th>Clave</th>
          <th>Fecha</th>
          <th>Monto</th>
          <th>Método</th>
        </tr>
      </thead>
      <tbody>
        ${entries
          .map(
            ([key, settlement]) => `
              <tr>
                <td>${escapeHtml(key)}</td>
                <td>${formatDateTime(settlement.paidAt)}</td>
                <td class="money">${formatMoney(settlement.amount)}</td>
                <td>${escapeHtml(settlement.method || "-")}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function openReport() {
  const groups = getReportableGroups();
  if (ui.reportType === "group" && !groups.length) {
    alert("Todavía no hay grupos cargados para emitir un informe de grupo.");
    return;
  }
  if (ui.reportType === "group" && !ui.reportGroupKey && groups.length) {
    ui.reportGroupKey = groups[0].key;
  }
  const html = buildReportHtml(getReportDataset());
  openDocumentWindow(html, "Informe Solanas");
}

function openDocumentWindow(html, title) {
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    alert("El navegador bloqueó la ventana emergente. Permití pop-ups para emitir el informe.");
    return;
  }
  reportWindow.document.open();
  reportWindow.document.write(html);
  reportWindow.document.close();
  reportWindow.document.title = title;
}

function showToast(message) {
  let toast = document.getElementById("success-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "success-toast";
    toast.className = "data-card";
    toast.style.position = "fixed";
    toast.style.right = "18px";
    toast.style.bottom = "18px";
    toast.style.zIndex = "90";
    toast.style.width = "min(340px, calc(100vw - 24px))";
    toast.style.background = "rgba(255, 251, 245, 0.98)";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<strong>Listo</strong><p>${escapeHtml(message)}</p>`;
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.remove();
  }, 2800);
}

function getLiveSourceState(source) {
  const key = source === "checkin" ? CHECKIN_STORAGE_KEY : BEVERAGE_STORAGE_KEY;
  const localPayload = readLocalJson(key);
  if (sourceLooksValid(source, localPayload)) {
    const payload =
      source === "beverages" ? normalizeBeveragePayloadForDashboard(localPayload).payload : localPayload;
    return {
      payload,
      origin: key,
    };
  }
  const fallbackPayload = state.sources[source] || null;
  if (sourceLooksValid(source, fallbackPayload)) {
    const payload =
      source === "beverages" ? normalizeBeveragePayloadForDashboard(fallbackPayload).payload : fallbackPayload;
    return {
      payload,
      origin: "snapshot-unificado",
    };
  }
  return {
    payload: null,
    origin: "sin-datos",
  };
}

function buildUnifiedBackupPayload() {
  const exportedAt = new Date().toISOString();
  const checkinSource = getLiveSourceState("checkin");
  const beverageSource = getLiveSourceState("beverages");
  const unifiedSnapshot = normalizeUnifiedStatePayload(deepClone(state)) || createUnifiedState();

  unifiedSnapshot.sources = {
    checkin: checkinSource.payload,
    beverages: beverageSource.payload,
  };
  unifiedSnapshot.sourceMeta = {
    checkin: checkinSource.payload
      ? { importedAt: exportedAt, sourceName: checkinSource.origin, mode: "unified-backup-export" }
      : null,
    beverages: beverageSource.payload
      ? { importedAt: exportedAt, sourceName: beverageSource.origin, mode: "unified-backup-export" }
      : null,
  };
  unifiedSnapshot.lastSavedAt = exportedAt;

  return {
    format: UNIFIED_BACKUP_FORMAT,
    exportedAt,
    version: 1,
    storageKeys: {
      unified: UNIFIED_STORAGE_KEY,
      checkin: CHECKIN_STORAGE_KEY,
      beverages: BEVERAGE_STORAGE_KEY,
    },
    systems: {
      unified: unifiedSnapshot,
      checkin: checkinSource.payload,
      beverages: beverageSource.payload,
    },
    meta: {
      checkin: {
        origin: checkinSource.origin,
        ready: Boolean(checkinSource.payload),
        reservations: checkinSource.payload && Array.isArray(checkinSource.payload.reservations)
          ? checkinSource.payload.reservations.length
          : 0,
      },
      beverages: {
        origin: beverageSource.origin,
        ready: Boolean(beverageSource.payload),
        activeRooms:
          beverageSource.payload &&
          beverageSource.payload.activeShift &&
          Array.isArray(beverageSource.payload.activeShift.rooms)
            ? beverageSource.payload.activeShift.rooms.filter((room) => Array.isArray(room.items) && room.items.length).length
            : 0,
      },
    },
  };
}

function isUnifiedBackupPayload(payload) {
  return Boolean(
    payload &&
      (payload.format === UNIFIED_BACKUP_FORMAT ||
        (payload.systems &&
          (payload.systems.unified || payload.systems.checkin || payload.systems.beverages)))
  );
}

function getUnifiedBackupSystem(payload, key) {
  if (!payload || typeof payload !== "object") return null;
  if (payload.systems && Object.prototype.hasOwnProperty.call(payload.systems, key)) {
    return payload.systems[key];
  }
  return payload[key] || null;
}

function importUnifiedBackupPayload(payload, sourceName = "respaldo central") {
  if (!isUnifiedBackupPayload(payload)) {
    alert("Ese JSON no parece ser un respaldo central de Solanas.");
    return false;
  }

  const unifiedPayload =
    getUnifiedBackupSystem(payload, "unified") ||
    payload.unifiedState ||
    payload.state ||
    null;
  const nextState = normalizeUnifiedStatePayload(unifiedPayload) || createUnifiedState();
  const checkinPayload =
    getUnifiedBackupSystem(payload, "checkin") ||
    (nextState.sources ? nextState.sources.checkin : null);
  const beveragePayload =
    getUnifiedBackupSystem(payload, "beverages") ||
    (nextState.sources ? nextState.sources.beverages : null);
  const normalizedCheckin = sourceLooksValid("checkin", checkinPayload) ? checkinPayload : null;
  const beverageNormalization = sourceLooksValid("beverages", beveragePayload)
    ? normalizeBeveragePayloadForDashboard(beveragePayload)
    : { payload: null, changed: false };
  const normalizedBeverages = beverageNormalization.payload;

  if (!normalizeUnifiedStatePayload(unifiedPayload) && !normalizedCheckin && !normalizedBeverages) {
    alert("El respaldo central no trae datos reconocibles para restaurar.");
    return false;
  }

  const affectedSystems = [
    "Sistema",
    normalizedCheckin ? "Check-in" : "",
    normalizedBeverages ? "Estaci\u00f3n de bebidas" : "",
  ].filter(Boolean);
  if (
    !window.confirm(
      `Se va a importar ${sourceName} y reemplazar en este navegador: ${affectedSystems.join(", ")}. Las copias internas quedan dentro de este paquete.`
    )
  ) {
    return false;
  }

  const importedAt = new Date().toISOString();
  if (normalizedCheckin) {
    localStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(normalizedCheckin));
    nextState.sources.checkin = normalizedCheckin;
    nextState.sourceMeta.checkin = {
      importedAt,
      sourceName,
      mode: "unified-json",
    };
  }
  if (normalizedBeverages) {
    localStorage.setItem(BEVERAGE_STORAGE_KEY, JSON.stringify(normalizedBeverages));
    nextState.sources.beverages = normalizedBeverages;
    nextState.sourceMeta.beverages = {
      importedAt,
      sourceName,
      mode: "unified-json",
    };
  }

  state = normalizeUnifiedStatePayload(nextState) || createUnifiedState();
  persistState("Respaldo central importado sin cruzar fuentes.");
  render();
  return true;
}

function exportUnifiedBackup() {
  const payload = buildUnifiedBackupPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `solanas-respaldo-central-${payload.exportedAt.replace(/:/g, "-")}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Se export\u00f3 un JSON central con Check-in, Bebidas y Sistema.");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action } = target.dataset;

  if (action === "toggle-sidebar") {
    const currentMainScrollTop = document.querySelector(".app-main")?.scrollTop || 0;
    ui.sidebarCollapsed = !ui.sidebarCollapsed;
    persistSidebarPreference();
    render();
    const nextMain = document.querySelector(".app-main");
    if (nextMain) {
      nextMain.scrollTop = currentMainScrollTop;
      window.requestAnimationFrame(() => {
        nextMain.scrollTop = currentMainScrollTop;
      });
    }
    return;
  }

  if (action === "toggle-theme") {
    ui.theme = ui.theme === "light" ? "dark" : "light";
    persistThemePreference();
    applyThemePreference(ui.theme);
    updateThemeToggleControls();
    return;
  }

  if (action === "toggle-system-menu") {
    ui.systemMenuOpen = !ui.systemMenuOpen;
    render();
    return;
  }

  if (action === "trigger-import") {
    ui.importSource = target.dataset.source || "";
    const input = document.getElementById("backup-input");
    if (input) input.click();
    return;
  }

  if (action === "trigger-unified-import") {
    ui.importSource = "unified";
    const input = document.getElementById("backup-input");
    if (input) input.click();
    return;
  }

  if (action === "clear-source") {
    const source = target.dataset.source;
    if (!source || !state.sources[source]) return;
    if (!window.confirm(`Se desconectará ${SOURCE_LABELS[source]} del sistema. Las copias internas no se borran.`)) {
      return;
    }
    state.sources[source] = null;
    state.sourceMeta[source] = null;
    persistState(`${SOURCE_LABELS[source]} desconectado.`);
    render();
    return;
  }

  if (action === "set-menu-timeline-today") {
    ui.menuTimelineDate = getTodayInputDate();
    render({ preserveScroll: true });
    return;
  }

  if (action === "shift-menu-timeline-month") {
    ui.menuTimelineDate = shiftInputDateByMonths(
      getMenuTimelineDate(),
      Number(target.dataset.shift) || 0
    );
    render({ preserveScroll: true });
    return;
  }

  if (action === "select-menu-timeline-date") {
    const nextDate = normalizeDate(target.dataset.date);
    if (!nextDate) return;
    ui.menuTimelineDate = nextDate;
    render({ preserveScroll: true });
    return;
  }

  if (action === "open-settlement-modal") {
    openSettlementModal(target.dataset.key);
    return;
  }

  if (action === "close-settlement-modal") {
    closeSettlementModal();
    return;
  }

  if (action === "confirm-settlement-method") {
    markSettlement(target.dataset.key, target.dataset.method);
    return;
  }

  if (action === "clear-settlement") {
    clearSettlement(target.dataset.key);
    return;
  }

  if (action === "open-report-modal") {
    ui.reportModalOpen = true;
    render();
    return;
  }

  if (action === "close-report-modal") {
    ui.reportModalOpen = false;
    render();
    return;
  }

  if (action === "set-report-type") {
    ui.reportType = target.dataset.reportType || "general";
    const groups = getBeverageGroupsFromAllSources();
    if (ui.reportType === "group" && !ui.reportGroupKey && groups.length) {
      ui.reportGroupKey = groups[0].key;
    }
    render();
    return;
  }

  if (action === "generate-report") {
    openReport();
    return;
  }

  if (action === "print-guest-register") {
    openGuestRegisterPrint();
    return;
  }

  if (action === "record-cash-transfer") {
    recordCashTransfer(target.dataset.from, target.dataset.to);
    return;
  }

  if (action === "record-cash-withdrawal") {
    openCashWithdrawalModal(target.dataset.box);
    return;
  }

  if (action === "close-cash-withdrawal-modal") {
    closeCashWithdrawalModal();
    return;
  }

  if (action === "confirm-cash-withdrawal") {
    confirmCashWithdrawal();
    return;
  }

  if (action === "clear-cash-audit") {
    ui.cashAudit.hotel = "";
    ui.cashAudit.beverages = "";
    render();
    return;
  }

  if (action === "employee-clock-in") {
    markEmployeeClockIn(target.dataset.employeeId);
    return;
  }

  if (action === "delete-employee") {
    deleteEmployee(target.dataset.employeeId);
    return;
  }

  if (action === "add-employee-advance") {
    const row = target.closest("[data-employee-row]");
    const amountInput = row ? row.querySelector("[data-employee-advance-amount]") : null;
    const noteInput = row ? row.querySelector("[data-employee-advance-note]") : null;
    addEmployeeAdvance(
      target.dataset.employeeId,
      amountInput ? amountInput.value : "",
      noteInput ? noteInput.value : ""
    );
    return;
  }

  if (action === "remove-employee-advance") {
    removeEmployeeAdvance(target.dataset.employeeId, target.dataset.advanceId);
    return;
  }

  if (action === "export-unified") {
    exportUnifiedBackup();
    return;
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;

  if (target.id === "backup-input") {
    const file = target.files && target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (ui.importSource === "unified" || isUnifiedBackupPayload(parsed)) {
          importUnifiedBackupPayload(parsed, file.name);
          return;
        }
        const detectedSource = detectSource(parsed, ui.importSource);
        if (!detectedSource) {
          alert("No pude detectar si este respaldo es de check-in, bebidas o central.");
          return;
        }
        if (importSourceState(detectedSource, parsed, { sourceName: file.name, mode: "manual" })) {
          render();
        }
      } catch (error) {
        console.error("No se pudo importar el respaldo.", error);
        alert("No se pudo leer el JSON seleccionado.");
      } finally {
        target.value = "";
        ui.importSource = "";
      }
    };
    reader.readAsText(file);
    return;
  }

  if (target.matches("[data-action-input='selected-month']")) {
    state.selectedMonth = target.value || getCurrentMonthKey();
    persistState();
    render();
    return;
  }

  if (target.matches("[data-action-input='cash-audit']")) {
    const key = target.dataset.cashAudit;
    if (key === "hotel" || key === "beverages") {
      ui.cashAudit[key] = target.value;
      render();
    }
    return;
  }

  if (target.matches("[data-employee-salary]")) {
    updateEmployeeSalary(target.dataset.employeeSalary, target.value);
    return;
  }

  if (target.matches("[data-menu-timeline-date]")) {
    ui.menuTimelineDate = normalizeDate(target.value) || getMenuTimelineDate();
    render({ preserveScroll: true });
    return;
  }

  if (target.matches("[data-action-input='report-group']")) {
    ui.reportGroupKey = target.value || "";
    render();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target && event.target.id === "employee-form") {
    event.preventDefault();
    addEmployeeFromForm(event.target);
  }
});

document.addEventListener(
  "scroll",
  (event) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.matches("[data-menu-timeline-wrap]")) {
      return;
    }

    setMenuTimelineScrollForKey(getMenuTimelineDate(), target.scrollLeft);
  },
  true
);

window.addEventListener("hashchange", () => {
  ui.systemMenuOpen = false;
  if (window.matchMedia("(max-width: 820px)").matches) {
    ui.sidebarCollapsed = true;
  }
  render();
});

function getFrameForMessageSource(source) {
  if (!source) return null;
  return Array.from(document.querySelectorAll("iframe")).find((frame) => {
    try {
      return frame.contentWindow === source;
    } catch (error) {
      return false;
    }
  }) || null;
}

function scrollAppMainToElement(element, offset = 18) {
  if (!element) return;
  const main = document.querySelector(".app-main");
  if (!main) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const mainRect = main.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const targetTop = Math.max(0, main.scrollTop + elementRect.top - mainRect.top - offset);
  main.scrollTo({ top: targetTop, behavior: "smooth" });
}

function scrollAppMainToEmbeddedOffset(frame, offsetTop, offset = 18) {
  if (!frame) return;
  const resolvedOffsetTop = Math.max(0, Number(offsetTop) || 0);
  const main = document.querySelector(".app-main");
  if (!main) {
    frame.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const mainRect = main.getBoundingClientRect();
  const frameRect = frame.getBoundingClientRect();
  const targetTop = Math.max(
    0,
    main.scrollTop + frameRect.top - mainRect.top + resolvedOffsetTop - offset
  );
  main.scrollTo({ top: targetTop, behavior: "smooth" });
}

window.addEventListener("message", (event) => {
  if (!event || !event.data) {
    return;
  }

  if (event.data.type === "solanas:navigate-module") {
    const moduleKey = String(event.data.module || "").trim();
    if (
      !Object.prototype.hasOwnProperty.call(MODULES, moduleKey) ||
      !canAccessModule(moduleKey)
    ) {
      return;
    }
    syncFromLocalStorage({ silent: true, renderAfter: false });
    ui.systemMenuOpen = false;
    const nextHash = `#${moduleKey}`;
    if (window.location.hash === nextHash) {
      render();
    } else {
      window.location.hash = nextHash;
    }
    return;
  }

  if (event.data.type === "solanas:focus-embedded-module") {
    const frame =
      getFrameForMessageSource(event.source) ||
      document.querySelector(".original-system-frame") ||
      document.querySelector(".module-frame");
    if (frame && event.data.reason === "target") {
      scrollAppMainToEmbeddedOffset(frame, event.data.offsetTop, 18);
      return;
    }
    const target = frame
      ? frame.closest(".embedded-module-shell, .module-frame-panel, .original-system-stage") || frame
      : null;
    scrollAppMainToElement(target, event.data.reason === "modal" ? 8 : 18);
    return;
  }

  if (event.data.type === "solanas:checkin-state") {
    receiveEmbeddedSourceState("checkin", event.data.payload);
    return;
  }

  if (event.data.type === "solanas:beverage-state") {
    receiveEmbeddedSourceState("beverages", event.data.payload);
    return;
  }

  if (event.data.type === "solanas:beverage-catalog-height") {
    const frame = document.querySelector("[data-beverage-catalog-frame]");
    const nextHeight = Math.ceil(Number(event.data.height) || 0);
    if (frame && nextHeight > 0) {
      const targetHeight = Math.max(nextHeight + 24, 980);
      const currentHeight =
        Number.parseFloat(frame.style.height) || frame.getBoundingClientRect().height || 0;
      if (Math.abs(targetHeight - currentHeight) > 24) {
        frame.style.height = `${targetHeight}px`;
      }
    }
    return;
  }

  if (event.data.type === "solanas:embedded-module-height") {
    const frame = document.querySelector(".original-system-frame");
    const nextHeight = Math.ceil(Number(event.data.height) || 0);
    if (frame && nextHeight > 0) {
      const targetHeight = Math.max(nextHeight + 8, 760);
      const currentHeight =
        Number.parseFloat(frame.style.height) || frame.getBoundingClientRect().height || 0;
      if (Math.abs(targetHeight - currentHeight) > 16) {
        frame.style.height = `${targetHeight}px`;
      }
    }
    return;
  }

  if (event.data.type === "solanas:request-checkin-state") {
    syncFromLocalStorage({ silent: true, renderAfter: false });
    const frame = document.querySelector(".original-system-frame");
    if (frame && frame.contentWindow && state.sources.checkin) {
      frame.contentWindow.postMessage(
        {
          type: "solanas:checkin-state",
          payload: state.sources.checkin,
          emittedAt: new Date().toISOString(),
        },
        "*"
      );
    }
    return;
  }

  if (event.data.type === "solanas:return-unified-menu") {
    ui.systemMenuOpen = false;
    syncFromLocalStorage({ silent: true, renderAfter: false });
    window.location.hash = getDefaultAllowedModule();
    render();
    return;
  }

  if (event.data.type !== "solanas:toggle-system-menu") {
    return;
  }

  ui.systemMenuOpen = !ui.systemMenuOpen;
  const activeModule = getActiveModule();
  if (activeModule === "reservas" || activeModule === "checkin" || activeModule === "bebidas") {
    syncOriginalSystemMenuPopover(activeModule);
    return;
  }
  render();
});

window.addEventListener("storage", (event) => {
  if (event.key === THEME_PREF_KEY) {
    ui.theme = event.newValue === "light" ? "light" : "dark";
    applyThemePreference(ui.theme);
    updateThemeToggleControls();
    return;
  }

  if (![CHECKIN_STORAGE_KEY, BEVERAGE_STORAGE_KEY].includes(event.key)) {
    return;
  }
  const activeModule = getActiveModule();
  syncFromLocalStorage({
    silent: true,
    renderAfter:
      activeModule !== "reservas" && activeModule !== "checkin" && activeModule !== "bebidas",
  });
});

async function bootApplication() {
  await loadCentralState();
  render();
}

bootApplication();
