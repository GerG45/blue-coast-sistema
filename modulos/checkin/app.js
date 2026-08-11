const STORAGE_KEY = "solanas-checkin-state-v2";
const LEGACY_STORAGE_KEYS = ["solanas-checkin-state-v1"];
const CLEAN_SLATE_RESET_KEY = "solanas-checkin-clean-slate-2026-05-15-v3";
const APP_VERSION = 4;
const APP_TIME_ZONE = "America/Buenos_Aires";
const DEFAULT_NATIONALITY = "Argentina";
const MAX_GUESTS = 7;
const MAX_RESERVATION_NOTES_LENGTH = 50;
const MAX_TRAVEL_ORIGIN_LENGTH = 50;
const MAX_GROUP_COMPANY_LENGTH = 80;
const LEGAL_PRINT_GRACE_MS = 5 * 60 * 1000;
const MONEY_FIELDS = new Set(["total", "cash", "transfer", "depositAmount"]);
const DEFERRED_RESERVATION_FIELDS = new Set([
  ...MONEY_FIELDS,
  "nights",
  "licensePlate",
  "guestCount",
  "phone",
  "email",
  "notes",
  "discountNote",
  "travelOrigin",
  "depositPaymentMethod",
  "depositDeferredReason",
]);
const DEFERRED_GROUP_DRAFT_FIELDS = new Set([
  "company",
  "travelOrigin",
  "groupPassengerRate",
  "groupInitial",
]);
const GROUP_MODAL_RERENDER_DELAY_MS = 220;
const RESERVATION_DATE_FIELDS = new Set(["checkInDate", "checkOutDate"]);
const GUEST_DATE_TYPING_FIELDS = new Set(["birthDate"]);
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

function getAuthorizedShellSidebarItems() {
  const allowedModules = window.BLUE_COAST_AUTH_SESSION?.allowedModules;
  if (!Array.isArray(allowedModules)) return [];
  const allowedSet = new Set(allowedModules);
  return SHELL_SIDEBAR_ITEMS.filter((item) => allowedSet.has(item.key));
}

function getAuthorizedDefaultModule() {
  const items = getAuthorizedShellSidebarItems();
  const configuredDefault = String(
    window.BLUE_COAST_AUTH_SESSION?.defaultModule || ""
  ).trim();
  return items.some((item) => item.key === configuredDefault)
    ? configuredDefault
    : items[0]?.key || "checkin";
}

function isAuthorizedShellModule(moduleKey) {
  return getAuthorizedShellSidebarItems().some((item) => item.key === moduleKey);
}
const BLUE_COAST_LOGO_URL = new URL("../../assets/blue-coast-logo.svg", window.location.href).href;
const SIDEBAR_PREF_KEY = "bluecoast-sidebar-collapsed-v1";
const THEME_PREF_KEY = "bluecoast-theme-v1";
const TITLE_FONT_URL = new URL("./fonts/libre-baskerville-bold.ttf", window.location.href).href;
const ROOM_ICON_SINGLE_URL = new URL("./assets/cama-single.svg", window.location.href).href;
const ROOM_ICON_DOUBLE_URL = new URL("./assets/cama-doble.svg", window.location.href).href;
const SUMMARY_ICON_URLS = Object.freeze({
  openReservations: new URL("./assets/resumen/reservas-abiertas.svg", window.location.href).href,
  confirmedReservations: new URL("./assets/resumen/reservas-confirmadas.svg", window.location.href).href,
  occupiedRooms: new URL("./assets/resumen/habitaciones-en-uso.svg", window.location.href).href,
  meals: new URL("./assets/resumen/comidas-de-hoy.svg", window.location.href).href,
});
const APP_QUERY = new URLSearchParams(window.location.search);
const APP_MODE = normalizeAppMode(APP_QUERY.get("mode"));
const SHELL_LAYOUT = APP_QUERY.get("layout") === "shell";
const SYSTEM_EMBEDDED = APP_QUERY.get("embed") === "system";
const SYSTEM_CHROME = SHELL_LAYOUT || SYSTEM_EMBEDDED;
const APP_MODE_META = Object.freeze({
  reservas: {
    title: "Reservas",
    eyebrow: "Recepci\u00f3n \u00b7 Reservas",
    copy:
      "Agenda reservas particulares o grupales, pacta importes, registra se\u00f1as y revisa disponibilidad sin cargar el legajo legal completo.",
  },
  checkin: {
    title: "Check-in",
    eyebrow: "Recepci\u00f3n \u00b7 Check-in",
    copy:
      "Carga el legajo completo, salda la estad\u00eda y reci\u00e9n entonces imprime el formulario legal de ingreso.",
  },
});
const SHELL_HERO_ICON_KEY = APP_MODE === "reservas" ? "reservas" : "checkin";

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

const REGIME_OPTIONS = ["", "Desayuno", "Media Pensi\u00f3n", "Pensi\u00f3n Completa"];
const LEGACY_REGIME_ALIASES = Object.freeze({
  D: "Desayuno",
  DESAYUNO: "Desayuno",
  MP: "Media Pensi\u00f3n",
  "MEDIA PENSION": "Media Pensi\u00f3n",
  PC: "Pensi\u00f3n Completa",
  "PENSION COMPLETA": "Pensi\u00f3n Completa",
});
const ALLOWED_REGIMES = new Set(REGIME_OPTIONS.filter(Boolean));
const SPECIAL_REGIME_OPTIONS = [
  "",
  "Celiaquía",
  "Diabetes",
  "Hipertensión",
  "Sin lactosa",
  "Vegetariano",
  "Vegano",
  "Alergia alimentaria",
  "Otro / consultar",
];
const ALLOWED_SPECIAL_REGIMES = new Set(SPECIAL_REGIME_OPTIONS.filter(Boolean));
const ROOM_OPTIONS = Array.from({ length: 32 }, (_, index) => String(index + 1));
const CALENDAR_WEEKDAY_LABELS = ["Lun", "Mar", "Mi\u00e9", "Jue", "Vie", "S\u00e1b", "Dom"];
const DEFAULT_TARIFFS = Object.freeze({
  single: "40000",
  double: "30000",
  triple: "27000",
  quadruple: "25000",
  halfBoardSupplement: "0",
  fullBoardSupplement: "0",
});
const TARIFF_META = Object.freeze({
  single: { label: "Base Single con desayuno", guestCount: 1 },
  double: { label: "Base doble con desayuno", guestCount: 2 },
  triple: { label: "Base triple con desayuno", guestCount: 3 },
  quadruple: { label: "Base cu\u00e1druple con desayuno", guestCount: 4 },
});
const TARIFF_SUPPLEMENT_META = Object.freeze({
  halfBoardSupplement: { label: "Adicional Media Pensi\u00f3n", regime: "Media Pensi\u00f3n" },
  fullBoardSupplement: { label: "Adicional Pensi\u00f3n Completa", regime: "Pensi\u00f3n Completa" },
});
const GROUP_COMP_ROOM_TYPES = Object.freeze({
  drivers: {
    label: "Choferes",
    singularLabel: "Chofer",
    maxGuests: 2,
    helper: "Hasta 2 choferes compartiendo habitaci\u00f3n.",
  },
  coordinators: {
    label: "Coordinadores",
    singularLabel: "Coordinador",
    maxGuests: 3,
    helper: "Hasta 3 coordinadores compartiendo habitaci\u00f3n.",
  },
});
const GROUP_COLOR_PALETTE = Object.freeze(
  Array.from({ length: 200 }, (_, index) => {
    const hue = Math.round((index * 137.508) % 360);
    const saturation = [62, 72, 68, 78, 58][index % 5];
    const lightness = [46, 54, 42, 60, 50][Math.floor(index / 5) % 5];
    return `hsl(${hue} ${saturation}% ${lightness}%)`;
  })
);
const TIMELINE_INDIVIDUAL_COLOR = "hsl(354 70% 38%)";
const TIMELINE_INDIVIDUAL_INK = "#ffffff";
const BOOK_HEADERS = [
  "NRO HAB",
  "FECHA INGRESO",
  "FECHA EGRESO",
  "R\u00c9GIMEN",
  "CANTIDAD HU\u00c9SPEDES",
  "PATENTE",
  "TOTAL",
  "EFECTIVO",
  "TRANSFERENCIA",
  "SALDO PENDIENTE",
  "CORREO",
  "TEL\u00c9FONO",
  "PROCEDENCIA",
  "DESTINO",
  "OBSERVACIONES",
  "LECTOR",
  "NOMBRE",
  "APELLIDO",
  "DNI",
  "FECHA DE NAC",
  "G\u00c9NERO",
  "NACIONALIDAD",
  "REG. ESPECIAL",
];
const BOOK_HEADERS_VIEW = [
  "NRO HAB",
  "FECHA INGRESO",
  "FECHA EGRESO",
  "NOCHES",
  "R\u00c9GIMEN",
  "CANTIDAD HU\u00c9SPEDES",
  "PATENTE",
  "TOTAL",
  "EFECTIVO",
  "TRANSFERENCIA",
  "SALDO PENDIENTE",
  "CORREO",
  "TEL\u00c9FONO",
  "PROCEDENCIA",
  "DESTINO",
  "OBSERVACIONES",
  "LECTOR",
  "NOMBRE",
  "APELLIDO",
  "DNI",
  "FECHA DE NAC",
  "G\u00c9NERO",
  "NACIONALIDAD",
  "REG. ESPECIAL",
];
const ROOM_CATALOG = {
  "1": { label: "Matrimonial", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "2": { label: "Matrimonial", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "3": { label: "Doble twin/mat", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "4": { label: "Matrimonial", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "5": { label: "Doble twin/mat", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "6": { label: "Doble twin/mat", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "7": { label: "Doble o triple twin", baseCapacity: 3, maxCapacity: 4, supportsExtraBed: true },
  "8": { label: "Triple twin o mat", baseCapacity: 3, maxCapacity: 4, supportsExtraBed: true },
  "9": { label: "Triple twin o mat", baseCapacity: 3, maxCapacity: 4, supportsExtraBed: true },
  "10": { label: "Triple o cuádruple twin o mat", baseCapacity: 4, maxCapacity: 5, supportsExtraBed: true },
  "11": { label: "Doble twin/mat", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "12": { label: "Doble twin/mat", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "13": { label: "Matrimonial", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "14": { label: "Matrimonial", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "15": { label: "Doble twin/mat", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "16": { label: "Matrimonial", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "17": { label: "Triple twin", baseCapacity: 3, maxCapacity: 4, supportsExtraBed: true },
  "18": { label: "Cuádruple twin", baseCapacity: 4, maxCapacity: 5, supportsExtraBed: true },
  "19": { label: "2 hab con 3 camas twin", baseCapacity: 3, maxCapacity: 4, supportsExtraBed: true },
  "20": { label: "Triple twin", baseCapacity: 3, maxCapacity: 4, supportsExtraBed: true },
  "21": { label: "Triple twin", baseCapacity: 3, maxCapacity: 4, supportsExtraBed: true },
  "22": { label: "Doble twin/mat", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "23": { label: "Doble twin/mat", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "24": { label: "Single", baseCapacity: 1, maxCapacity: 2, supportsExtraBed: true },
  "25": { label: "Doble twin/mat", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "26": { label: "Doble twin/mat", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
  "27": { label: "Triple twin", baseCapacity: 3, maxCapacity: 4, supportsExtraBed: true },
  "28": { label: "Triple twin", baseCapacity: 3, maxCapacity: 4, supportsExtraBed: true },
  "29": { label: "Triple mat", baseCapacity: 3, maxCapacity: 4, supportsExtraBed: true },
  "30": { label: "Triple twin", baseCapacity: 3, maxCapacity: 4, supportsExtraBed: true },
  "31": { label: "Triple twin", baseCapacity: 3, maxCapacity: 4, supportsExtraBed: true },
  "32": { label: "Doble twin/mat", baseCapacity: 2, maxCapacity: 3, supportsExtraBed: true },
};

const HOTEL_INFO = Object.freeze({
  name: "Hotel Termal Solanas",
  phone: "3541 393805",
  address: "Juan Bautista Alberdi 165, Termas de Río Hondo",
  hours: "Lunes a domingo, las 24 horas",
});

const LEGAL_RULES_SECTIONS = Object.freeze([
  {
    title: "Normas generales de convivencia y cuidado",
    items: [
      "Al firmar este documento, el huésped declara haber leído, comprendido y aceptado las normas del hotel, y se compromete a cumplirlas durante toda su estadía.",
      "Está estrictamente prohibido fumar dentro de las habitaciones y en cualquier espacio cerrado del hotel, incluyendo pasillos, recepción y restaurante.",
      "Se deben cuidar todos los elementos de la habitación, incluyendo control remoto, caloventores, tapón de la bañera, toallas, frazadas y demás equipamiento.",
      "En caso de daño o pérdida de elementos, el huésped deberá abonar el costo de reposición correspondiente al momento de su egreso.",
      "No se permite derramar líquidos sobre alfombras, ropa de cama o mobiliario.",
      "No dejar artefactos eléctricos encendidos ni conectados a los tomacorrientes al salir de la habitación.",
      "No se permite el consumo de comestibles dentro de la habitación. Si necesita vajilla, puede solicitarla en recepción.",
      "No limpiar el mate en el baño, ni en lavamanos ni en la ducha.",
      "No está permitido llevar toallas o toallones de la habitación a la piscina.",
      "Dejar la llave en recepción cada vez que se retire del hotel. Su extravío implica un costo de reposición a cargo del huésped ocupante.",
    ],
  },
  {
    title: "Seguridad y funcionamiento del hotel",
    items: [
      "No dejar menores sin supervisión de un adulto responsable, tanto en la piscina como en la bañera.",
      "El horario de check-out es a las 10:00 a.m. y debe respetarse para facilitar la limpieza y la preparación de las habitaciones.",
      "La disponibilidad está sujeta a la admisión y organización del hotel.",
      "Por razones operativas, la llave del vehículo debe permanecer en recepción para permitir su eventual movimiento ante ingresos o salidas de servicio y otras necesidades de logística interna.",
      "Si nota la falta de algún elemento habitual o detecta algún desperfecto, informe al personal. El equipo del hotel está disponible para asistirlo.",
    ],
  },
  {
    title: "Piscina y bañera termal",
    items: [
      "Si tiene dudas sobre cómo realizar un baño termal, puede solicitar la guía correspondiente en recepción.",
      "Se recomienda comenzar con sesiones cortas, desde 5 minutos, e ir aumentando progresivamente según cómo reaccione el cuerpo.",
      "Evitar los baños termales al menos 2 horas antes o después de cada comida.",
      "Se sugiere salir, tomar aire fresco y luego volver a ingresar para un disfrute más completo y seguro.",
      "Escuchar y respetar las señales del propio cuerpo es parte del cuidado y del bienestar.",
    ],
  },
  {
    title: "Sugerencias ecológicas y solidarias",
    items: [
      "Si desea recambio de toallas y toallones, déjelos sobre la bañera. Si desea reutilizarlos, déjelos colgados. Esto ayuda a reducir el consumo de agua y jabón.",
      "Encontrará cestos de separación de residuos en planta baja, frente al baño de mujeres. Se agradece clasificar los residuos para colaborar con el reciclado.",
    ],
  },
  {
    title: "Valor legal",
    items: [
      "Este documento tiene valor legal. El huésped se compromete a cumplir todas las normas aquí establecidas.",
      "En caso de daños, pérdidas o incumplimientos, el huésped acepta abonar el valor correspondiente al momento de su egreso.",
    ],
  },
]);

const KNOWN_NATIONALITIES = new Map([
  ["ARGENTINA", "Argentina"],
  ["ARGENTINO", "Argentina"],
  ["ARGENTINA.", "Argentina"],
  ["URUGUAY", "Uruguay"],
  ["URUGUAYA", "Uruguay"],
  ["BRASIL", "Brasil"],
  ["BOLIVIA", "Bolivia"],
  ["PARAGUAY", "Paraguay"],
  ["CHILE", "Chile"],
  ["PERU", "Per\u00fa"],
]);

const GENERAL_MODULE_NAV_ITEMS = Object.freeze([
  { href: "#history-section", label: "Historial" },
  { href: "#rooms-section", label: "Habitaciones" },
  { href: "#timeline-section", label: "L\u00ednea del tiempo" },
]);
const WORKSPACE_MODULE_NAV_ITEMS = Object.freeze([
  { href: "#reservation-active-panel", label: "Carga" },
  { href: "#rooms-section", label: "Habitaciones" },
  { href: "#history-section", label: "Historial" },
  { href: "#book-section", label: "Vista del registro" },
]);

const ui = {
  activeGuestId: null,
  historyQuery: "",
  scannerDraft: "",
  parseResult: null,
  scannerTargetKind: "guest",
  scannerTargetGuestId: null,
  isScannerModalOpen: false,
  isTariffModalOpen: false,
  isGroupLoadModalOpen: false,
  isGroupPickerModalOpen: false,
  isReservationConfirmModalOpen: false,
  confirmReservationId: null,
  isPrivateReservationModalOpen: false,
  isStayPaymentModalOpen: false,
  stayPaymentReservationId: null,
  isCombinedStayPaymentModalOpen: false,
  combinedStayPaymentDraft: null,
  isRoomPickerModalOpen: false,
  roomPickerDraftNumber: "",
  roomPickerConfirmNumber: "",
  roomPickerConfirmPosition: null,
  tariffDraft: null,
  groupDraft: null,
  bulkScannerSession: null,
  isReservationWorkspaceOpen: false,
  roomAvailabilityMode: "request",
  roomOverviewDate: getTodayInputDate(),
  roomTimelineScrollByKey: {},
  pendingRoomShortcutNumber: "",
  pendingRoomShortcutDate: "",
  pendingManagedModalFocusId: "",
  showMaintenanceEditor: false,
  sidebarCollapsed: SHELL_LAYOUT ? getInitialSidebarCollapsed() : false,
  theme: getInitialThemePreference(),
};

let successToastHideTimeoutId = null;
let successToastRemoveTimeoutId = null;
let scannerAutoApplyTimeoutId = null;
let groupModalRerenderTimeoutId = null;
let appDayWatcherId = null;
let lastOperationalDate = "";
let heroVisibilityObserver = null;

function nowIso() {
  return new Date().toISOString();
}

function uid(prefix) {
  if (window.crypto && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeText(value) {
  return String(value || "").trim();
}

function normalizeAppMode(value) {
  return value === "reservas" ? "reservas" : "checkin";
}

function isReservationsMode() {
  return APP_MODE === "reservas";
}

function isCheckinMode() {
  return APP_MODE === "checkin";
}

function buildClassName(...tokens) {
  return tokens.filter(Boolean).join(" ");
}

function getRequiredFieldStateClass(isFilled) {
  return isFilled ? "required-filled" : "required-empty";
}

function sanitizeReservationNotes(value, options = {}) {
  const { trim = true } = options;
  const compacted = String(value || "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/ {2,}/g, " ");
  return (trim ? compacted.trim() : compacted.replace(/^ +/, "")).slice(
    0,
    MAX_RESERVATION_NOTES_LENGTH
  );
}

function sanitizeTravelOrigin(value, options = {}) {
  const { trim = true } = options;
  const compacted = String(value || "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/ {2,}/g, " ");
  return (trim ? compacted.trim() : compacted.replace(/^ +/, "")).slice(
    0,
    MAX_TRAVEL_ORIGIN_LENGTH
  );
}

function getReservationTravelOrigin(reservation) {
  if (!reservation) return "";
  return sanitizeTravelOrigin(
    reservation.travelOrigin || reservation.origin || reservation.destination
  );
}

function sanitizeGroupCompany(value, options = {}) {
  const { trim = true } = options;
  const compacted = String(value || "").replace(/\s+/g, " ");
  return (trim ? compacted.trim() : compacted.replace(/^ +/, "")).slice(
    0,
    MAX_GROUP_COMPANY_LENGTH
  );
}

function sanitizeGroupCompRoomType(value) {
  const key = String(value || "").trim();
  return Object.prototype.hasOwnProperty.call(GROUP_COMP_ROOM_TYPES, key) ? key : "";
}

function getGroupCompRoomMeta(type) {
  return GROUP_COMP_ROOM_TYPES[sanitizeGroupCompRoomType(type)] || null;
}

function normalizeGroupCompRooms(rawRooms = {}) {
  const source = rawRooms && typeof rawRooms === "object" ? rawRooms : {};
  return Object.entries(source).reduce((accumulator, [roomNumber, type]) => {
    const normalizedRoom = sanitizeRoomNumber(roomNumber);
    const normalizedType = sanitizeGroupCompRoomType(type);
    if (normalizedRoom && normalizedType) {
      accumulator[normalizedRoom] = normalizedType;
    }
    return accumulator;
  }, {});
}

function getGroupMemoryKey(company) {
  return slugify(sanitizeGroupCompany(company));
}

function normalizeGroupMemoryPerson(rawPerson) {
  const person = rawPerson && typeof rawPerson === "object" ? rawPerson : {};
  return {
    id: person.id || uid("guest"),
    role: safeText(person.role) || "huesped",
    firstName: safeText(person.firstName),
    lastName: safeText(person.lastName),
    document: normalizeDocument(person.document),
    birthDate: safeText(person.birthDate),
    gender: normalizeGender(person.gender),
    nationality: safeText(person.nationality) || DEFAULT_NATIONALITY,
    specialRegime: sanitizeSpecialRegime(person.specialRegime),
    rawScan: normalizeScannerInput(person.rawScan),
    parseMeta:
      person.parseMeta && typeof person.parseMeta === "object"
        ? {
            format: safeText(person.parseMeta.format),
            confidence: safeText(person.parseMeta.confidence),
            warnings: Array.isArray(person.parseMeta.warnings)
              ? person.parseMeta.warnings.map((warning) => safeText(warning)).filter(Boolean)
              : [],
            parsedAt: person.parseMeta.parsedAt || null,
          }
        : null,
  };
}

function normalizeGroupMemoryPeople(rawPeople) {
  const people = rawPeople && typeof rawPeople === "object" ? rawPeople : {};
  const responsible = normalizeResponsible(people.responsible);
  const guests = Array.isArray(people.guests)
    ? people.guests.map((guest, index) => normalizeGuest(guest, index === 0)).filter(Boolean)
    : [];
  return {
    responsible,
    guests,
  };
}

function normalizeGroupMemoryEntry(rawEntry, fallbackKey = "") {
  const entry = rawEntry && typeof rawEntry === "object" ? rawEntry : {};
  const company = sanitizeGroupCompany(entry.company);
  const key = getGroupMemoryKey(company) || safeText(entry.key) || safeText(fallbackKey);
  if (!key) return null;
  const compPeopleSource =
    entry.compPeople && typeof entry.compPeople === "object" ? entry.compPeople : {};
  const compPeople = Object.keys(GROUP_COMP_ROOM_TYPES).reduce((accumulator, type) => {
    const normalizedType = sanitizeGroupCompRoomType(type);
    const people = normalizeGroupMemoryPeople(compPeopleSource[normalizedType]);
    if (
      hasResponsibleSnapshotData(people.responsible) ||
      people.guests.some((guest) => hasGuestData(guest))
    ) {
      accumulator[normalizedType] = people;
    }
    return accumulator;
  }, {});
  const compRoomTypes = Array.isArray(entry.compRoomTypes)
    ? entry.compRoomTypes.map(sanitizeGroupCompRoomType).filter(Boolean)
    : [];
  Object.keys(compPeople).forEach((type) => {
    if (!compRoomTypes.includes(type)) {
      compRoomTypes.push(type);
    }
  });

  return {
    key,
    company,
    travelOrigin: sanitizeTravelOrigin(entry.travelOrigin),
    groupPassengerRate:
      parseAmount(entry.groupPassengerRate) > 0
        ? sanitizeMoneyInput(entry.groupPassengerRate)
        : "",
    compRoomTypes: compRoomTypes.filter(
      (type, index, collection) => collection.indexOf(type) === index
    ),
    compPeople,
    updatedAt: entry.updatedAt || "",
  };
}

function normalizeGroupMemory(rawMemory) {
  const source = rawMemory && typeof rawMemory === "object" ? rawMemory : {};
  return Object.entries(source).reduce((accumulator, [key, entry]) => {
    const normalized = normalizeGroupMemoryEntry(entry, key);
    if (normalized) {
      accumulator[normalized.key] = normalized;
    }
    return accumulator;
  }, {});
}

function hashText(value) {
  return String(value || "").split("").reduce((hash, char) => {
    return (hash * 31 + char.charCodeAt(0)) >>> 0;
  }, 17);
}

function getDefaultGroupColor(seed = "") {
  const index = hashText(seed || "Solanas") % GROUP_COLOR_PALETTE.length;
  return GROUP_COLOR_PALETTE[index];
}

function sanitizeGroupColor(value, fallbackSeed = "") {
  const color = String(value || "").trim();
  if (GROUP_COLOR_PALETTE.includes(color)) {
    return color;
  }
  return getDefaultGroupColor(fallbackSeed);
}

function getDefaultReservationColor(seed = "") {
  const index = (hashText(seed || "Reserva particular") + 73) % GROUP_COLOR_PALETTE.length;
  return GROUP_COLOR_PALETTE[index];
}

function getReservationColorSeed(reservation) {
  if (!reservation) {
    return "Reserva particular";
  }
  return (
    [
      reservation.id,
      reservation.checkInDate,
      reservation.checkOutDate,
      reservation.roomNumber,
    ]
      .filter(Boolean)
      .join("|") || "Reserva particular"
  );
}

function sanitizeReservationColor(value, fallbackSeed = "") {
  const color = String(value || "").trim();
  if (GROUP_COLOR_PALETTE.includes(color)) {
    return color;
  }
  return getDefaultReservationColor(fallbackSeed);
}

function getGroupInitial(value) {
  const text = sanitizeGroupCompany(value);
  if (!text) return "G";
  const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return (normalized.match(/[A-Z0-9]/i) || ["G"])[0].toUpperCase();
}

function sanitizeGroupInitial(value, fallbackCompany = "") {
  const normalized = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const match = normalized.match(/[A-Z0-9]/i);
  return (match ? match[0] : getGroupInitial(fallbackCompany)).toUpperCase();
}

function sanitizeEditableGroupInitial(value) {
  const normalized = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const match = normalized.match(/[A-Z0-9]/i);
  return match ? match[0].toUpperCase() : "";
}

function getSoftHslColor(color, alpha = 0.16) {
  const match = String(color || "").match(
    /hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)/i
  );
  if (!match) {
    return `rgba(13, 124, 121, ${alpha})`;
  }
  return `hsl(${match[1]} ${match[2]}% ${match[3]}% / ${alpha})`;
}

function getDarkGroupTextColor(color) {
  const match = String(color || "").match(
    /hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)/i
  );
  if (!match) {
    return "#bfefff";
  }

  const saturation = Math.max(58, Math.min(92, Number(match[2]) * 0.96));
  const lightness = Math.max(58, Math.min(76, 72 - Number(match[3]) * 0.08));
  return `hsl(${match[1]} ${Math.round(saturation)}% ${Math.round(lightness)}%)`;
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

function cleanExportValue(value) {
  return String(value || "")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeInputDate(value) {
  if (!value) return "";
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }
  const human = normalizeHumanDate(text);
  if (!human) return "";
  const [day, month, year] = human.split("/");
  return `${year}-${month}-${day}`;
}

function getDatePartsInTimeZone(date = new Date(), timeZone = APP_TIME_ZONE) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const lookup = {};
  formatter.formatToParts(new Date(date)).forEach((part) => {
    if (part.type !== "literal") {
      lookup[part.type] = part.value;
    }
  });
  return {
    year: lookup.year || "",
    month: lookup.month || "",
    day: lookup.day || "",
  };
}

function formatInputDate(date) {
  const { year, month, day } = getDatePartsInTimeZone(date);
  if (!year || !month || !day) return "";
  return `${year}-${month}-${day}`;
}

function formatDateTypingInput(value) {
  const digits = String(value || "")
    .replace(/\D/g, "")
    .slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function addDaysToInputDate(value, days) {
  const inputDate = normalizeInputDate(value);
  if (!inputDate) return "";
  const date = new Date(`${inputDate}T12:00:00`);
  date.setDate(date.getDate() + days);
  return formatInputDate(date);
}

function getTodayInputDate() {
  return formatInputDate(new Date());
}

function getRoomOverviewDate() {
  return normalizeInputDate(ui.roomOverviewDate) || getTodayInputDate();
}

function getMonthKeyFromDate(value = getTodayInputDate()) {
  const inputDate = normalizeInputDate(value);
  return inputDate ? inputDate.slice(0, 7) : getTodayInputDate().slice(0, 7);
}

function getDaysInMonth(value = getTodayInputDate()) {
  const monthKey = getMonthKeyFromDate(value);
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function shiftInputDateByMonths(value, months) {
  const inputDate = normalizeInputDate(value) || getTodayInputDate();
  const [year, month, day] = inputDate.split("-").map(Number);
  const targetMonthDate = new Date(year, month - 1 + months, 1, 12);
  const targetYear = targetMonthDate.getFullYear();
  const targetMonth = targetMonthDate.getMonth();
  const maxDay = new Date(targetYear, targetMonth + 1, 0).getDate();
  return formatInputDate(new Date(targetYear, targetMonth, Math.min(day, maxDay), 12));
}

function formatMonthYearLabel(value = getTodayInputDate()) {
  const monthKey = getMonthKeyFromDate(value);
  try {
    const label = new Intl.DateTimeFormat("es-AR", {
      month: "long",
      year: "numeric",
    }).format(new Date(`${monthKey}-01T12:00:00`));
    return label ? `${label.charAt(0).toUpperCase()}${label.slice(1)}` : monthKey;
  } catch (error) {
    return monthKey;
  }
}

function formatWeekdayShortLabel(value) {
  const inputDate = normalizeInputDate(value);
  if (!inputDate) return "";
  try {
    const label = new Intl.DateTimeFormat("es-AR", {
      weekday: "short",
    })
      .format(new Date(`${inputDate}T12:00:00`))
      .replace(/\.$/, "");
    return label ? `${label.charAt(0).toUpperCase()}${label.slice(1)}` : formatDisplayDate(inputDate);
  } catch (error) {
    return formatDisplayDate(inputDate);
  }
}

function getCalendarWeekdayIndex(value) {
  const inputDate = normalizeInputDate(value);
  if (!inputDate) return 0;
  const weekday = new Date(`${inputDate}T12:00:00`).getDay();
  return (weekday + 6) % 7;
}

function getMinimumCheckOutDate(checkInDate) {
  return addDaysToInputDate(checkInDate || getTodayInputDate(), 1);
}

function getNightCountBetween(checkInDate, checkOutDate) {
  const start = normalizeInputDate(checkInDate);
  const end = normalizeInputDate(checkOutDate);
  if (!start || !end) return null;
  const startDate = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);
  const diffMs = endDate.getTime() - startDate.getTime();
  const nights = Math.round(diffMs / 86400000);
  if (nights < 1) return null;
  return nights;
}

function buildCheckOutDate(checkInDate, nights) {
  const start = normalizeInputDate(checkInDate);
  const nightCount = Number(sanitizeIntegerInput(nights) || "1");
  if (!start) return "";
  return addDaysToInputDate(start, Math.max(1, nightCount));
}

function hasValidStayDates(checkInDate, checkOutDate) {
  return getNightCountBetween(checkInDate, checkOutDate) !== null;
}

function rangesOverlap(startA, endA, startB, endB) {
  const normalizedStartA = normalizeInputDate(startA);
  const normalizedEndA = normalizeInputDate(endA);
  const normalizedStartB = normalizeInputDate(startB);
  const normalizedEndB = normalizeInputDate(endB);
  if (
    !hasValidStayDates(normalizedStartA, normalizedEndA) ||
    !hasValidStayDates(normalizedStartB, normalizedEndB)
  ) {
    return false;
  }
  return normalizedStartA < normalizedEndB && normalizedEndA > normalizedStartB;
}

function reservationOccupiesDate(reservation, date) {
  const targetDate = normalizeInputDate(date);
  if (!targetDate) return false;
  return rangesOverlap(
    reservation.checkInDate,
    reservation.checkOutDate,
    targetDate,
    addDaysToInputDate(targetDate, 1)
  );
}

function normalizeHumanDate(value) {
  const text = String(value || "").trim();
  if (!text) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const [year, month, day] = text.split("-");
    return `${day}/${month}/${year}`;
  }

  const match = text.match(/^(\d{1,4})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (!match) return "";

  let first = match[1];
  let second = match[2];
  let third = match[3];

  if (first.length === 4) {
    return `${third.padStart(2, "0")}/${second.padStart(2, "0")}/${first}`;
  }

  if (third.length === 2) {
    third = Number(third) > 30 ? `19${third}` : `20${third}`;
  }

  return `${first.padStart(2, "0")}/${second.padStart(2, "0")}/${third}`;
}

function formatDisplayDate(value) {
  const inputDate = normalizeInputDate(value);
  if (!inputDate) return "Sin fecha";
  const [year, month, day] = inputDate.split("-");
  return `${day}/${month}/${year}`;
}

function formatLocalDateTime(value) {
  if (!value) return "Nunca";
  try {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

function formatDateLong(value) {
  const inputDate = normalizeInputDate(value);
  if (!inputDate) return "Sin fecha";
  try {
    return new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(`${inputDate}T12:00:00`));
  } catch (error) {
    return formatDisplayDate(inputDate);
  }
}

function formatStayRange(checkInDate, checkOutDate) {
  const start = normalizeInputDate(checkInDate);
  const end = normalizeInputDate(checkOutDate);
  if (!start || !end) return "Fechas pendientes";
  return `${formatDisplayDate(start)} \u2192 ${formatDisplayDate(end)}`;
}

function getReservationOperationalInfo(reservation, referenceDate = getTodayInputDate()) {
  const today = normalizeInputDate(referenceDate) || getTodayInputDate();
  const checkInDate = normalizeInputDate(reservation && reservation.checkInDate);
  const checkOutDate = normalizeInputDate(reservation && reservation.checkOutDate);

  if (!checkInDate) {
    return {
      key: "pending",
      label: "Sin fecha de ingreso",
      shortLabel: "Sin fecha",
      workspaceLabel: "Reserva en preparación",
      heroEyebrow: "Recepción · Reservas",
      summaryLabel: "Reserva en carga",
      helperText: "Completa la fecha de ingreso para ubicar esta reserva dentro de la jornada.",
      printActionLabel: "Preparar formulario de ingreso",
      printHelper:
        "Cuando la reserva tenga fecha, est\u00e9 confirmada y el legajo est\u00e9 completo, podr\u00e1s abrir el formulario legal prellenado.",
    };
  }

  if (checkInDate > today) {
    return {
      key: "future",
      label: "Reserva futura",
      shortLabel: "Reserva",
      workspaceLabel: "Reserva futura en carga",
      heroEyebrow: "Recepción · Reservas",
      summaryLabel: "Reserva futura en carga",
      helperText: `Ingreso previsto para el ${formatDisplayDate(checkInDate)}.`,
      printActionLabel: "Preparar formulario de ingreso",
      printHelper:
        "Deja listo el documento legal en una sola hoja para el d\u00eda de llegada.",
    };
  }

  if (checkInDate === today) {
    return {
      key: "today",
      label: "Ingreso de hoy",
      shortLabel: "Ingreso de hoy",
      workspaceLabel: "Ingreso de hoy en carga",
      heroEyebrow: "Recepción · Reservas e ingresos",
      summaryLabel: "Ingreso de hoy en carga",
      helperText: `El huésped ingresa hoy, ${formatDisplayDate(checkInDate)}.`,
      printActionLabel: "Imprimir formulario y reglamento",
      printHelper:
        "Abre el documento legal en una sola hoja con los datos de la reserva ya cargados.",
    };
  }

  if (checkOutDate && today < checkOutDate) {
    return {
      key: "in-house",
      label: "En estadía",
      shortLabel: "En estadía",
      workspaceLabel: "Estadía en curso",
      heroEyebrow: "Recepción · Huéspedes alojados",
      summaryLabel: "Estadía en curso",
      helperText: `El huésped ingresó el ${formatDisplayDate(checkInDate)} y todavía sigue alojado.`,
      printActionLabel: "Reimprimir formulario y reglamento",
      printHelper:
        "Permite volver a imprimir el documento legal completo si recepci\u00f3n lo necesita.",
    };
  }

  return {
    key: "past",
    label: "Reserva ya cumplida",
    shortLabel: "Histórica",
    workspaceLabel: "Reserva ya cumplida",
    heroEyebrow: "Recepción · Historial",
    summaryLabel: "Reserva histórica",
    helperText: `Esta reserva corresponde al ingreso del ${formatDisplayDate(checkInDate)}.`,
    printActionLabel: "Reimprimir formulario y reglamento",
    printHelper: "Permite recuperar el legajo legal de una reserva anterior.",
  };
}

function canPrintLegalPacket(reservation) {
  return Boolean(
    reservation &&
      !reservation.archived &&
      reservation.confirmedAt &&
      normalizeInputDate(reservation.checkInDate) &&
      isRoomAccessReady(reservation) &&
      isHotelStaySettled(reservation)
  );
}

function shouldPrintWalkInLegalPacket(reservation) {
  return Boolean(
    isCheckinMode() &&
      reservation &&
      reservation.walkInToday === true &&
      !isGroupReservation(reservation) &&
      canPrintLegalPacket(reservation) &&
      !isLegalPacketPrintedCurrent(reservation)
  );
}

function maybePrintLegalPacketAfterCheckinReady(reservation, options = {}) {
  if (
    !(
      isCheckinMode() &&
      reservation &&
      !isGroupReservation(reservation) &&
      canPrintLegalPacket(reservation) &&
      !isLegalPacketPrintedCurrent(reservation)
    )
  ) {
    return false;
  }

  const forcePrint = options.force === true || reservation.walkInToday === true;
  if (
    forcePrint ||
    window.confirm(
      "La reserva qued\u00f3 confirmada y el legajo ya permite imprimir. \u00bfQuieres imprimir ahora el formulario y reglamento antes de continuar?"
    )
  ) {
    printLegalPacket(reservation.id);
    return true;
  }

  return false;
}

function parseTimestamp(value) {
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function normalizeLegalSignatureGuest(guest) {
  return {
    firstName: safeText(guest && guest.firstName),
    lastName: safeText(guest && guest.lastName),
    document: normalizeDocument(guest && guest.document),
    birthDate: normalizeHumanDate(guest && guest.birthDate) || safeText(guest && guest.birthDate),
    gender: normalizeGender(guest && guest.gender),
    nationality: safeText(guest && guest.nationality) || DEFAULT_NATIONALITY,
    specialRegime: sanitizeSpecialRegime(guest && guest.specialRegime),
  };
}

function buildLegalPacketSignature(reservation) {
  const guests = Array.isArray(reservation && reservation.guests)
    ? reservation.guests.map(normalizeLegalSignatureGuest)
    : [];
  const responsible = reservation && reservation.responsible ? reservation.responsible : {};
  return JSON.stringify({
    roomNumber: sanitizeRoomNumber(reservation && reservation.roomNumber),
    checkInDate: normalizeInputDate(reservation && reservation.checkInDate),
    checkOutDate: normalizeInputDate(reservation && reservation.checkOutDate),
    nights: sanitizeIntegerInput(reservation && reservation.nights),
    regime: sanitizeRegime(reservation && reservation.regime),
    licensePlate: safeText(reservation && reservation.licensePlate),
    travelOrigin: getReservationTravelOrigin(reservation),
    total: sanitizeMoneyInput(reservation && reservation.total),
    email: safeText(reservation && reservation.email),
    phone: safeText(reservation && reservation.phone),
    notes: safeText(reservation && reservation.notes),
    discountNote: safeText(reservation && reservation.discountNote),
    allowExtraBed: Boolean(reservation && reservation.allowExtraBed),
    groupId: safeText(reservation && reservation.groupId),
    groupCompany: sanitizeGroupCompany(reservation && reservation.groupCompany),
    groupCompRoomType: sanitizeGroupCompRoomType(reservation && reservation.groupCompRoomType),
    responsible: normalizeLegalSignatureGuest(responsible),
    guests,
  });
}

function isLegalPacketPrintedCurrent(reservation) {
  if (!reservation || !reservation.lastPrintedAt) {
    return false;
  }
  const printedAt = parseTimestamp(reservation.lastPrintedAt);
  const invalidatedAt = parseTimestamp(reservation.printInvalidatedAt);
  if (invalidatedAt && invalidatedAt > printedAt) {
    return false;
  }
  const currentSignature = buildLegalPacketSignature(reservation);
  if (reservation.lastPrintedSignature) {
    return reservation.lastPrintedSignature === currentSignature;
  }
  const updatedAt = parseTimestamp(
    reservation.legalUpdatedAt || reservation.updatedAt || reservation.createdAt
  );
  if (!printedAt) {
    return false;
  }
  if (!updatedAt || printedAt >= updatedAt) {
    return true;
  }
  return updatedAt - printedAt <= LEGAL_PRINT_GRACE_MS;
}

function isReservationIngressRegistered(reservation, operationalInfo = getReservationOperationalInfo(reservation)) {
  const canMarkAsEntered = ["today", "in-house", "past"].includes(operationalInfo.key);
  return Boolean(
    canMarkAsEntered &&
      reservation &&
      reservation.confirmedAt &&
      isRoomAccessReady(reservation) &&
      isLegalPacketPrintedCurrent(reservation)
  );
}

function getIngressRegisteredLabel(reservation) {
  return getReservationGuestCount(reservation) === 1
    ? "Hu\u00e9sped ingresado"
    : "Hu\u00e9spedes ingresados";
}

function formatNightsLabel(value) {
  const nights = Number(value) || 0;
  if (nights <= 0) return "Sin noches";
  return `${nights} noche${nights === 1 ? "" : "s"}`;
}

function parseAmount(value) {
  const text = String(value || "")
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (!text) return null;
  const number = Number(text);
  if (Number.isNaN(number)) return null;
  return number;
}

function formatCurrency(value) {
  const amount = typeof value === "number" ? value : parseAmount(value);
  if (amount === null || Number.isNaN(amount)) return "Sin monto";
  return amount.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

function formatPercent(value) {
  const amount = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(amount)) return "0%";
  return `${amount.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}%`;
}

function sanitizeMoneyInput(value) {
  const text = String(value || "");
  if (!text.trim()) return "";
  const number = parseAmount(text);
  if (number === null) return "";
  return String(Math.round(number));
}

function formatMoneyInputDisplay(value) {
  const amount = typeof value === "number" ? value : parseAmount(value);
  if (amount === null || Number.isNaN(amount)) return "";
  return amount.toLocaleString("es-AR", {
    maximumFractionDigits: 0,
  });
}

function sanitizeIntegerInput(value) {
  const text = String(value || "").replace(/[^\d]/g, "");
  if (!text) return "";
  return String(Number(text));
}

function sanitizeRoomNumber(value, fallback = "") {
  const text = String(value || "").replace(/[^\d]/g, "");
  if (!text) return "";
  const roomNumber = Number(text);
  if (roomNumber >= 1 && roomNumber <= ROOM_OPTIONS.length) {
    return String(roomNumber);
  }
  return fallback;
}

function sanitizeRegime(value) {
  const regime = safeText(value);
  if (!regime) return "";
  if (ALLOWED_REGIMES.has(regime)) {
    return regime;
  }
  const normalizedKey = regime
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return LEGACY_REGIME_ALIASES[normalizedKey] || "";
}

function sanitizeDepositPaymentMethod(value) {
  const method = safeText(value);
  return ["cash", "transfer", "deferred"].includes(method) ? method : "";
}

function sanitizeSpecialRegime(value) {
  const regime = safeText(value);
  if (!regime) return "";
  return ALLOWED_SPECIAL_REGIMES.has(regime) ? regime : "";
}

function normalizeRoomMaintenance(rawMaintenance) {
  const source =
    rawMaintenance && typeof rawMaintenance === "object" ? rawMaintenance : {};
  return ROOM_OPTIONS.reduce((accumulator, roomNumber) => {
    if (source[roomNumber] === true) {
      accumulator[roomNumber] = true;
    }
    return accumulator;
  }, {});
}

function normalizeTariffs(rawTariffs) {
  const source = rawTariffs && typeof rawTariffs === "object" ? rawTariffs : {};
  return Object.keys(DEFAULT_TARIFFS).reduce((accumulator, key) => {
    accumulator[key] = sanitizeMoneyInput(source[key]) || DEFAULT_TARIFFS[key];
    return accumulator;
  }, {});
}

function capitalizeWords(value) {
  return String(value || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeGender(value) {
  const upper = String(value || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (["F", "FEMENINO", "MUJER"].includes(upper)) return "F";
  if (["M", "MASCULINO", "HOMBRE"].includes(upper)) return "M";
  if (["X", "NO BINARIO", "NO-BINARIO"].includes(upper)) return "X";
  return "";
}

function normalizeDocument(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9]/g, "");
}

function normalizeNationality(value) {
  const upper = String(value || "").trim().toUpperCase();
  if (!upper) return DEFAULT_NATIONALITY;
  return KNOWN_NATIONALITIES.get(upper) || capitalizeWords(upper);
}

function normalizeScannerInput(value) {
  return String(value || "")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u0000/g, "")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanToken(value) {
  return String(value || "")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ")
    .replace(/^[\s,;:|]+|[\s,;:|]+$/g, "")
    .trim();
}

function splitScannerTokens(raw) {
  return normalizeScannerInput(raw)
    .split(/["@]/)
    .map(cleanToken)
    .filter(Boolean);
}

function isDateToken(value) {
  return /^\d{1,4}[/-]\d{1,2}[/-]\d{2,4}$/.test(String(value || "").trim());
}

function isLikelyDocument(value) {
  const text = normalizeDocument(value);
  if (!text) return false;
  if (text.length < 7 || text.length > 12) return false;
  if (!/\d/.test(text)) return false;
  return /^[A-Z]?\d{6,11}$/.test(text);
}

function isLikelyNationality(value) {
  const upper = cleanToken(value).toUpperCase();
  return KNOWN_NATIONALITIES.has(upper);
}

function isLikelyNameToken(value) {
  const text = cleanToken(value);
  if (!text) return false;
  if (text.length < 2 || text.length > 60) return false;
  if (/\d/.test(text)) return false;
  if (isDateToken(text)) return false;
  if (isLikelyNationality(text)) return false;
  if (normalizeGender(text)) return false;
  return /[A-Z\u00c1\u00c9\u00cd\u00d3\u00da\u00d1]/i.test(text);
}

function inferNationalityFromRaw(raw, tokens) {
  const tokenCandidate = (tokens || []).find((token) => isLikelyNationality(token));
  if (tokenCandidate) return normalizeNationality(tokenCandidate);
  if (String(raw || "").toUpperCase().includes("ARGENTINA")) {
    return DEFAULT_NATIONALITY;
  }
  return DEFAULT_NATIONALITY;
}

function scoreToConfidence(score) {
  if (score >= 90) return "alta";
  if (score >= 72) return "media";
  return "baja";
}

function parseClassicQuotedFormat(raw) {
  const parts = splitScannerTokens(raw);
  if (parts.length < 7) return null;

  const lastName = parts[1];
  const firstName = parts[2];
  const gender = normalizeGender(parts[3]);
  const document = normalizeDocument(parts[4]);
  const birthDate = normalizeHumanDate(parts[6]);

  if (
    !isLikelyNameToken(lastName) ||
    !isLikelyNameToken(firstName) ||
    !gender ||
    !isLikelyDocument(document) ||
    !birthDate
  ) {
    return null;
  }

  const warnings = [];
  if (parts.length > 8) {
    warnings.push("Se detectaron campos extra del QR. Conviene revisar visualmente.");
  }

  return {
    score: 99,
    format: "DNI cl\u00e1sico",
    warnings,
    data: {
      firstName: capitalizeWords(firstName),
      lastName: capitalizeWords(lastName),
      document,
      birthDate,
      gender,
      nationality: inferNationalityFromRaw(raw, parts),
      rawScan: raw,
    },
  };
}

function parseVeryOldQuotedFormat(raw) {
  const parts = normalizeScannerInput(raw)
    .split('"')
    .map(cleanToken)
    .filter(Boolean);
  if (parts.length < 8) return null;

  const document = normalizeDocument(parts[0]);
  const lastName = parts[3];
  const firstName = parts[4];
  const nationality = inferNationalityFromRaw(raw, [parts[5]]);
  const birthDate = normalizeHumanDate(parts[6]);
  const gender = normalizeGender(parts[7]);

  if (
    !isLikelyDocument(document) ||
    !isLikelyNameToken(lastName) ||
    !isLikelyNameToken(firstName) ||
    !birthDate ||
    !gender
  ) {
    return null;
  }

  return {
    score: 97,
    format: "DNI muy viejo",
    warnings: [],
    data: {
      firstName: capitalizeWords(firstName),
      lastName: capitalizeWords(lastName),
      document,
      birthDate,
      gender,
      nationality,
      rawScan: raw,
    },
  };
}

function parseLegacyAtDelimitedFormat(raw) {
  const rawParts = normalizeScannerInput(raw).split("@").map(cleanToken);
  const compactParts = rawParts.filter(Boolean);
  const candidates = [rawParts, compactParts].filter(
    (parts, index, collection) =>
      (parts.length === 16 || parts.length === 17) && collection.indexOf(parts) === index
  );

  for (const parts of candidates) {
    const document = normalizeDocument(parts[1]);
    const lastName = parts[4];
    const firstName = parts[5];
    const birthDate = normalizeHumanDate(parts[7]);
    const gender = normalizeGender(parts[8]);

    if (
      !isLikelyDocument(document) ||
      !isLikelyNameToken(lastName) ||
      !isLikelyNameToken(firstName) ||
      !birthDate ||
      !gender
    ) {
      continue;
    }

    return {
      score: 98,
      format: "DNI anterior",
      warnings: [],
      data: {
        firstName: capitalizeWords(firstName),
        lastName: capitalizeWords(lastName),
        document,
        birthDate,
        gender,
        nationality: inferNationalityFromRaw(raw, parts),
        rawScan: raw,
      },
    };
  }

  return null;
}

function parseLooseHeuristicFormat(raw) {
  const parts = splitScannerTokens(raw);
  if (parts.length < 3) return null;

  const genderIndex = parts.findIndex((token) => Boolean(normalizeGender(token)));
  const gender = genderIndex >= 0 ? normalizeGender(parts[genderIndex]) : "";
  const birthDateToken = parts.find((token) => isDateToken(token));
  const birthDate = normalizeHumanDate(birthDateToken);
  const documentCandidates = parts
    .map((token) => normalizeDocument(token))
    .filter((token) => isLikelyDocument(token));
  const document =
    documentCandidates.find((token) => !/^\d{11,}$/.test(token)) || documentCandidates[0] || "";

  const alphaTokens = parts.filter(
    (token) => isLikelyNameToken(token) && !isLikelyNationality(token)
  );
  const leftAlpha =
    genderIndex > 0
      ? parts
          .slice(0, genderIndex)
          .filter((token) => isLikelyNameToken(token) && !isLikelyNationality(token))
      : [];

  let lastName = "";
  let firstName = "";

  if (leftAlpha.length >= 2) {
    lastName = leftAlpha[leftAlpha.length - 2];
    firstName = leftAlpha[leftAlpha.length - 1];
  } else if (leftAlpha.length === 1) {
    firstName = leftAlpha[0];
  } else if (alphaTokens.length >= 2) {
    lastName = alphaTokens[0];
    firstName = alphaTokens[1];
  } else if (alphaTokens.length === 1) {
    firstName = alphaTokens[0];
  }

  if (!firstName && !lastName && !document) {
    return null;
  }

  const warnings = [];
  if (!lastName) warnings.push("No pude recuperar el apellido con seguridad.");
  if (!birthDate) warnings.push("La fecha de nacimiento qued\u00f3 incompleta.");
  if (!document) warnings.push("No encontr\u00e9 un DNI legible.");
  if (!gender) warnings.push("El g\u00e9nero no apareci\u00f3 con claridad.");

  const score =
    62 +
    (document ? 10 : 0) +
    (birthDate ? 8 : 0) +
    (gender ? 6 : 0) +
    (lastName ? 6 : 0) +
    (firstName ? 6 : 0) -
    warnings.length * 6;

  return {
    score,
    format: "Lectura heur\u00edstica",
    warnings,
    data: {
      firstName: capitalizeWords(firstName),
      lastName: capitalizeWords(lastName),
      document,
      birthDate,
      gender,
      nationality: inferNationalityFromRaw(raw, parts),
      rawScan: raw,
    },
  };
}

function parseScannerInput(raw) {
  const normalized = normalizeScannerInput(raw);
  if (!normalized) {
    return {
      ok: false,
      error: "Pega o escanea un QR antes de intentar cargarlo.",
      rawScan: "",
    };
  }

  const attempts = [
    parseVeryOldQuotedFormat(normalized),
    parseLegacyAtDelimitedFormat(normalized),
    parseClassicQuotedFormat(normalized),
    parseLooseHeuristicFormat(normalized),
  ]
    .filter(Boolean)
    .sort((left, right) => right.score - left.score);

  if (!attempts.length) {
    return {
      ok: false,
      error:
        "No pude reconocer el formato del DNI. Conviene revisar el lector o completar los datos a mano.",
      rawScan: normalized,
    };
  }

  const bestAttempt = attempts[0];
  return {
    ok: true,
    format: bestAttempt.format,
    confidence: scoreToConfidence(bestAttempt.score),
    score: bestAttempt.score,
    warnings: bestAttempt.warnings,
    rawScan: normalized,
    data: {
      ...bestAttempt.data,
      nationality: bestAttempt.data.nationality || DEFAULT_NATIONALITY,
    },
  };
}

function createEmptyGuest(isPrimary = false) {
  return {
    id: uid("guest"),
    role: isPrimary ? "principal" : "huesped",
    firstName: "",
    lastName: "",
    document: "",
    birthDate: "",
    gender: "",
    nationality: DEFAULT_NATIONALITY,
    specialRegime: "",
    rawScan: "",
    parseMeta: null,
  };
}

function createEmptyResponsible() {
  return {
    firstName: "",
    lastName: "",
    document: "",
    birthDate: "",
    gender: "",
    nationality: DEFAULT_NATIONALITY,
  };
}

function createEmptyReservation() {
  const checkInDate = getTodayInputDate();
  const id = uid("reservation");
  return {
    id,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    archived: false,
    walkInToday: false,
    roomNumber: "",
    checkInDate,
    checkOutDate: getMinimumCheckOutDate(checkInDate),
    nights: "1",
    regime: "",
    licensePlate: "",
    travelOrigin: "",
    origin: "",
    destination: "",
    total: "",
    depositAmount: "",
    depositPaymentMethod: "",
    depositDeferredReason: "",
    depositRecordedAt: null,
    cash: "",
    transfer: "",
    pending: "",
    stayPaymentMode: "",
    stayPaymentRecordedAt: null,
    email: "",
    phone: "",
    notes: "",
    discountNote: "",
    reservationColor: getDefaultReservationColor(`${id}|${checkInDate}`),
    confirmedAt: null,
    allowExtraBed: false,
    groupId: "",
    groupCompany: "",
    groupColor: "",
    groupInitial: "",
    groupCompRoomType: "",
    groupCompRoomLabel: "",
    groupCompMaxGuests: "",
    groupTotalGuests: "",
    groupRoomIndex: 0,
    groupRoomCount: 0,
    groupAgreedTariffs: null,
    groupAgreedPassengerRate: "",
    groupAgreedPricingMode: "",
    groupAgreedTotal: "",
    groupRoomSubtotal: "",
    responsible: createEmptyResponsible(),
    guests: [createEmptyGuest(true)],
    lastScanAt: null,
    lastExportedAt: null,
    lastPrintedAt: null,
    lastPrintedSignature: "",
    printInvalidatedAt: null,
    legalUpdatedAt: null,
  };
}

function normalizeGuest(rawGuest, isPrimary = false) {
  const guest = rawGuest && typeof rawGuest === "object" ? rawGuest : {};
  return {
    id: guest.id || uid("guest"),
    role: isPrimary ? "principal" : "huesped",
    firstName: safeText(guest.firstName),
    lastName: safeText(guest.lastName),
    document: normalizeDocument(guest.document),
    birthDate: safeText(guest.birthDate),
    gender: normalizeGender(guest.gender),
    nationality: safeText(guest.nationality) || DEFAULT_NATIONALITY,
    specialRegime: sanitizeSpecialRegime(guest.specialRegime),
    rawScan: normalizeScannerInput(guest.rawScan),
    parseMeta:
      guest.parseMeta && typeof guest.parseMeta === "object"
        ? {
            format: safeText(guest.parseMeta.format),
            confidence: safeText(guest.parseMeta.confidence),
            warnings: Array.isArray(guest.parseMeta.warnings)
              ? guest.parseMeta.warnings.map((warning) => safeText(warning)).filter(Boolean)
              : [],
            parsedAt: guest.parseMeta.parsedAt || null,
          }
        : null,
  };
}

function normalizeResponsible(rawResponsible, fallbackGuest = null) {
  const responsible =
    rawResponsible && typeof rawResponsible === "object" ? rawResponsible : {};
  const fallback = fallbackGuest && typeof fallbackGuest === "object" ? fallbackGuest : {};
  return {
    firstName: safeText(responsible.firstName || fallback.firstName),
    lastName: safeText(responsible.lastName || fallback.lastName),
    document: normalizeDocument(responsible.document || fallback.document),
    birthDate: safeText(responsible.birthDate || fallback.birthDate),
    gender: normalizeGender(responsible.gender || fallback.gender),
    nationality:
      safeText(responsible.nationality || fallback.nationality) || DEFAULT_NATIONALITY,
  };
}

function normalizeReservation(rawReservation) {
  const reservation =
    rawReservation && typeof rawReservation === "object" ? rawReservation : {};
  const guests = Array.isArray(reservation.guests)
    ? reservation.guests
        .map((guest, index) => normalizeGuest(guest, index === 0))
        .filter(Boolean)
    : [];

  if (!guests.length) {
    guests.push(createEmptyGuest(true));
  }

  guests[0].role = "principal";
  const checkInDate =
    normalizeInputDate(reservation.checkInDate) || formatInputDate(new Date());
  const normalizedNights = sanitizeIntegerInput(reservation.nights) || "1";
  const normalizedRoomNumber = sanitizeRoomNumber(reservation.roomNumber);
  const roomProfile = ROOM_CATALOG[normalizedRoomNumber] || null;
  const checkOutDate = hasValidStayDates(reservation.checkInDate, reservation.checkOutDate)
    ? normalizeInputDate(reservation.checkOutDate)
    : buildCheckOutDate(checkInDate, normalizedNights);
  const syncedNights = String(getNightCountBetween(checkInDate, checkOutDate) || 1);
  const normalizedReservationId = reservation.id || uid("reservation");
  const normalizedTravelOrigin = getReservationTravelOrigin(reservation);

  const normalizedReservation = {
    id: normalizedReservationId,
    createdAt: reservation.createdAt || nowIso(),
    updatedAt: reservation.updatedAt || nowIso(),
    archived: reservation.archived === true,
    walkInToday: reservation.walkInToday === true,
    roomNumber: normalizedRoomNumber,
    checkInDate,
    checkOutDate,
    nights: syncedNights,
    regime: sanitizeRegime(reservation.regime),
    licensePlate: safeText(reservation.licensePlate),
    travelOrigin: normalizedTravelOrigin,
    origin: normalizedTravelOrigin,
    destination: normalizedTravelOrigin,
    total: sanitizeMoneyInput(reservation.total),
    depositAmount: sanitizeMoneyInput(reservation.depositAmount),
    depositPaymentMethod: sanitizeDepositPaymentMethod(reservation.depositPaymentMethod),
    depositDeferredReason: sanitizeReservationNotes(reservation.depositDeferredReason),
    depositRecordedAt: reservation.depositRecordedAt || null,
    cash: sanitizeMoneyInput(reservation.cash),
    transfer: sanitizeMoneyInput(reservation.transfer),
    pending: sanitizeMoneyInput(reservation.pending),
    stayPaymentMode: safeText(reservation.stayPaymentMode),
    stayPaymentRecordedAt: reservation.stayPaymentRecordedAt || null,
    email: safeText(reservation.email),
    phone: safeText(reservation.phone),
    notes: sanitizeReservationNotes(reservation.notes),
    discountNote: safeText(reservation.discountNote),
    reservationColor: sanitizeReservationColor(
      reservation.reservationColor,
      `${normalizedReservationId}|${checkInDate}|${checkOutDate}|${normalizedRoomNumber}`
    ),
    confirmedAt: reservation.confirmedAt || null,
    allowExtraBed: reservation.allowExtraBed === true && Boolean(roomProfile && roomProfile.supportsExtraBed),
    groupId: safeText(reservation.groupId),
    groupCompany: sanitizeGroupCompany(reservation.groupCompany),
    groupColor: reservation.groupCompany
      ? sanitizeGroupColor(reservation.groupColor, reservation.groupCompany)
      : "",
    groupInitial: reservation.groupCompany
      ? sanitizeGroupInitial(reservation.groupInitial, reservation.groupCompany)
      : "",
    groupCompRoomType: sanitizeGroupCompRoomType(reservation.groupCompRoomType),
    groupCompRoomLabel: safeText(reservation.groupCompRoomLabel),
    groupCompMaxGuests: sanitizeIntegerInput(reservation.groupCompMaxGuests),
    groupTotalGuests: sanitizeIntegerInput(reservation.groupTotalGuests),
    groupRoomIndex: Number(reservation.groupRoomIndex) || 0,
    groupRoomCount: Number(reservation.groupRoomCount) || 0,
    groupAgreedTariffs:
      reservation.groupAgreedTariffs && typeof reservation.groupAgreedTariffs === "object"
        ? normalizeTariffs(reservation.groupAgreedTariffs)
        : null,
    groupAgreedPassengerRate:
      parseAmount(reservation.groupAgreedPassengerRate) > 0
        ? sanitizeMoneyInput(reservation.groupAgreedPassengerRate)
        : "",
    groupAgreedPricingMode: safeText(reservation.groupAgreedPricingMode),
    groupAgreedTotal: sanitizeMoneyInput(reservation.groupAgreedTotal),
    groupRoomSubtotal: sanitizeMoneyInput(reservation.groupRoomSubtotal),
    responsible: normalizeResponsible(reservation.responsible, guests[0]),
    guests,
    lastScanAt: reservation.lastScanAt || null,
    lastExportedAt: reservation.lastExportedAt || null,
    lastPrintedAt: reservation.lastPrintedAt || null,
    lastPrintedSignature: safeText(reservation.lastPrintedSignature),
    printInvalidatedAt: reservation.printInvalidatedAt || null,
    legalUpdatedAt: reservation.legalUpdatedAt || reservation.updatedAt || reservation.createdAt || null,
  };

  syncReservationPaymentFields(normalizedReservation);
  return normalizedReservation;
}

function createInitialState() {
  const reservation = createEmptyReservation();
  return {
    version: APP_VERSION,
    reservations: [reservation],
    tariffs: normalizeTariffs(),
    roomMaintenance: {},
    groupMemory: {},
    activeReservationId: reservation.id,
    lastSavedAt: nowIso(),
  };
}

function hasAppliedCleanSlateReset() {
  try {
    return localStorage.getItem(CLEAN_SLATE_RESET_KEY) === "done";
  } catch (error) {
    console.error("No se pudo leer la marca de limpieza del sistema.", error);
    return true;
  }
}

function markCleanSlateResetApplied() {
  try {
    localStorage.setItem(CLEAN_SLATE_RESET_KEY, "done");
  } catch (error) {
    console.error("No se pudo guardar la marca de limpieza del sistema.", error);
  }
}

function createCleanSlateStatePreservingMaintenance(parsedState = {}) {
  const cleanState = createInitialState();
  cleanState.tariffs = normalizeTariffs(parsedState.tariffs);
  cleanState.roomMaintenance = normalizeRoomMaintenance(parsedState.roomMaintenance);
  cleanState.groupMemory = normalizeGroupMemory(parsedState.groupMemory);
  cleanState.lastSavedAt = nowIso();
  return cleanState;
}

function applyCleanSlateResetIfNeeded(parsedState) {
  if (hasAppliedCleanSlateReset()) {
    return null;
  }

  const cleanState = createCleanSlateStatePreservingMaintenance(parsedState);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanState));
  } catch (error) {
    console.error("No se pudo guardar la limpieza del sistema.", error);
  }
  markCleanSlateResetApplied();
  return cleanState;
}

function clearLegacyStorageState() {
  LEGACY_STORAGE_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("No se pudo limpiar el estado anterior del check in.", error);
    }
  });
}

function createEmptyGroupDraft(referenceDate = getRoomOverviewDate()) {
  const checkInDate = normalizeInputDate(referenceDate) || getTodayInputDate();
  return {
    company: "",
    travelOrigin: "",
    guestCount: "",
    checkInDate,
    checkOutDate: getMinimumCheckOutDate(checkInDate),
    regime: "",
    groupColor: getDefaultGroupColor(checkInDate),
    groupInitial: "",
    groupTariffs: normalizeTariffs(state.tariffs),
    groupPassengerRate: "",
    groupMemoryCompTypes: [],
    appliedGroupMemoryKey: "",
    memoryAppliedFields: {
      travelOrigin: false,
      groupPassengerRate: false,
    },
    showGroupTariffs: false,
    editingGroupId: "",
    groupCompRooms: {},
    selectedRooms: [],
  };
}

function loadState() {
  try {
    clearLegacyStorageState();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      markCleanSlateResetApplied();
      return createInitialState();
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.reservations)) {
      markCleanSlateResetApplied();
      return createInitialState();
    }

    const cleanSlateState = applyCleanSlateResetIfNeeded(parsed);
    if (cleanSlateState) {
      return cleanSlateState;
    }

    const reservations = parsed.reservations.map(normalizeReservation).filter(Boolean);
    if (!reservations.length) {
      return createInitialState();
    }

    const firstOpenReservation =
      reservations.find((reservation) => !reservation.archived) || reservations[0];
    const activeReservationExists = reservations.some(
      (reservation) =>
        reservation.id === parsed.activeReservationId && reservation.archived !== true
    );

    return {
      version: APP_VERSION,
      reservations,
      tariffs: normalizeTariffs(parsed.tariffs),
      roomMaintenance: normalizeRoomMaintenance(parsed.roomMaintenance),
      groupMemory: normalizeGroupMemory(parsed.groupMemory),
      activeReservationId: activeReservationExists
        ? parsed.activeReservationId
        : firstOpenReservation.id,
      lastSavedAt: parsed.lastSavedAt || nowIso(),
    };
  } catch (error) {
    console.error("No se pudo leer el estado guardado del check in.", error);
    return createInitialState();
  }
}

let state = loadState();

function isDemoReservation(reservation) {
  if (!reservation) return false;
  return (
    String(reservation.email || "").trim().toLowerCase() === "grupo.demo@solanas.local" ||
    String(reservation.notes || "").toUpperCase().includes("SIMULACRO VISUAL")
  );
}

function removeDemoReservationsFromState() {
  const originalLength = state.reservations.length;
  state.reservations = state.reservations.filter((reservation) => !isDemoReservation(reservation));
  if (!state.reservations.length) {
    const replacement = createEmptyReservation();
    state.reservations = [replacement];
    state.activeReservationId = replacement.id;
    return;
  }

  const activeStillExists = state.reservations.some(
    (reservation) => reservation.id === state.activeReservationId && !reservation.archived
  );

  if (!activeStillExists) {
    const nextReservation =
      state.reservations.find((reservation) => !reservation.archived) || state.reservations[0];
    state.activeReservationId = nextReservation.id;
  }

  if (state.reservations.length !== originalLength) {
    persistState();
  }
}

function persistState(options = {}) {
  const { toast = "" } = options;
  syncGroupMemoryFromReservations();
  state.lastSavedAt = nowIso();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("No se pudo guardar el estado del check in.", error);
  }
  postCheckinStateToParent();
  if (toast) {
    showSuccessToast(toast);
  }
}

function postCheckinStateToParent() {
  if (!window.parent || window.parent === window) {
    return;
  }
  try {
    window.parent.postMessage(
      {
        type: "solanas:checkin-state",
        payload: state,
        emittedAt: nowIso(),
      },
      "*"
    );
  } catch (error) {
    console.error("No se pudo enviar el estado de Check-in al sistema.", error);
  }
}

removeDemoReservationsFromState();

function ensureActiveReservation() {
  const active = state.reservations.find(
    (reservation) =>
      reservation.id === state.activeReservationId && reservation.archived !== true
  );
  if (active) return active;

  const firstOpenReservation = state.reservations.find((reservation) => !reservation.archived);
  if (firstOpenReservation) {
    state.activeReservationId = firstOpenReservation.id;
    return firstOpenReservation;
  }

  const reservation = createEmptyReservation();
  state.reservations.unshift(reservation);
  state.activeReservationId = reservation.id;
  return reservation;
}

function getActiveReservation() {
  return ensureActiveReservation();
}

function ensureReservationHasGuest(reservation) {
  if (!reservation) return null;
  if (!Array.isArray(reservation.guests)) {
    reservation.guests = [];
  }
  if (!reservation.guests.length) {
    reservation.guests.push(createEmptyGuest(true));
    touchReservation(reservation);
  }
  if (!reservation.guests[0].id) {
    reservation.guests[0].id = uid("guest");
  }
  reservation.guests[0].role = "principal";
  return reservation.guests[0];
}

function ensureActiveGuest() {
  const reservation = getActiveReservation();
  const primaryGuest = ensureReservationHasGuest(reservation);
  const guest = reservation.guests.find((item) => item.id === ui.activeGuestId);
  if (guest) return guest;
  ui.activeGuestId = primaryGuest.id;
  return primaryGuest;
}

function getActiveGuest() {
  return ensureActiveGuest();
}

function clearScannerAutoApplyTimer() {
  if (scannerAutoApplyTimeoutId) {
    window.clearTimeout(scannerAutoApplyTimeoutId);
    scannerAutoApplyTimeoutId = null;
  }
}

function resetScannerUi(closeModal = true) {
  clearScannerAutoApplyTimer();
  ui.parseResult = null;
  ui.scannerDraft = "";
  ui.scannerTargetKind = "guest";
  ui.scannerTargetGuestId = ui.activeGuestId;
  ui.bulkScannerSession = null;
  if (closeModal) {
    ui.isScannerModalOpen = false;
  }
}

function splitBulkScannerInput(raw) {
  return String(raw || "")
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function createBulkScannerSession() {
  return {
    responsibleLoaded: false,
    assigned: [],
    failed: [],
    skipped: [],
    createdGuestCount: 0,
    startedAt: nowIso(),
    lastRawScan: "",
  };
}

function getBulkScannerSession() {
  if (!ui.bulkScannerSession) {
    ui.bulkScannerSession = createBulkScannerSession();
  }
  return ui.bulkScannerSession;
}

function getBulkScannerCapacityState(reservation = getActiveReservation()) {
  const roomNumber = sanitizeRoomNumber(reservation && reservation.roomNumber);
  const roomProfile = getRoomProfile(roomNumber);
  const compMeta = getReservationGroupCompRoomMeta(reservation);
  const physicalBaseCapacity = Number(roomProfile && roomProfile.baseCapacity) || MAX_GUESTS;
  const physicalMaxCapacity = Number(roomProfile && roomProfile.maxCapacity) || physicalBaseCapacity;
  const operationalMaxCapacity = Number(compMeta && compMeta.maxGuests) || MAX_GUESTS;
  const maxCapacity = Math.max(
    1,
    Math.min(MAX_GUESTS, physicalMaxCapacity, operationalMaxCapacity)
  );
  const baseCapacity = Math.max(1, Math.min(maxCapacity, physicalBaseCapacity));
  const loadedGuestCount = Array.isArray(reservation && reservation.guests)
    ? reservation.guests.filter((guest) => hasGuestData(guest)).length
    : 0;

  return {
    roomNumber,
    roomProfile,
    compMeta,
    baseCapacity,
    maxCapacity,
    loadedGuestCount,
    baseCapacityReached: loadedGuestCount >= baseCapacity,
    maxCapacityReached: loadedGuestCount >= maxCapacity,
  };
}

function getGuestRoleLabel(index) {
  return `Huésped ${index + 1}`;
}

function getPrintableGuestRoleLabel(index) {
  return `Huésped ${index + 1}`;
}

function getScannerTarget() {
  if (ui.scannerTargetKind === "bulkGuests") {
    return {
      kind: "bulkGuests",
      reservation: getActiveReservation(),
    };
  }

  if (ui.scannerTargetKind === "responsible") {
    return {
      kind: "responsible",
      reservation: getActiveReservation(),
      responsible: getTitular(getActiveReservation()),
    };
  }

  const reservation = getActiveReservation();
  const guest =
    reservation.guests.find((item) => item.id === ui.scannerTargetGuestId) || getActiveGuest();
  return {
    kind: "guest",
    reservation,
    guest,
  };
}

function getActiveGuestLabel() {
  const target = getScannerTarget();
  if (target.kind === "bulkGuests") {
    return "hu\u00e9spedes de la habitaci\u00f3n";
  }

  if (target.kind === "responsible") {
    const responsible = target.responsible;
    return (
      [responsible.firstName, responsible.lastName].filter(Boolean).join(" ").trim() ||
      "Titular / responsable"
    );
  }

  const guest = target.guest;
  const guestIndex = target.reservation.guests.findIndex((item) => item.id === guest.id);
  return (
    [guest.firstName, guest.lastName].filter(Boolean).join(" ").trim() ||
    getGuestRoleLabel(guestIndex)
  );
}

function openScannerModal(target = null) {
  const reservation = getActiveReservation();
  if (target && typeof target === "object" && target.kind === "bulkGuests") {
    ui.scannerTargetKind = "bulkGuests";
    ui.scannerTargetGuestId = null;
    ui.bulkScannerSession = createBulkScannerSession();
  } else if (target && typeof target === "object" && target.kind === "responsible") {
    ui.scannerTargetKind = "responsible";
    ui.scannerTargetGuestId = null;
    ui.bulkScannerSession = null;
  } else {
    ui.bulkScannerSession = null;
    const guestId = typeof target === "string" ? target : target && target.guestId;
    const targetGuest = guestId
      ? reservation.guests.find((guest) => guest.id === guestId)
      : getActiveGuest();
    if (targetGuest) {
      ui.activeGuestId = targetGuest.id;
      ui.scannerTargetKind = "guest";
      ui.scannerTargetGuestId = targetGuest.id;
    }
  }
  ui.isTariffModalOpen = false;
  ui.tariffDraft = null;
  ui.isScannerModalOpen = true;
  if (!ui.scannerDraft) {
    ui.parseResult = null;
  }
}

function closeScannerModal(options = {}) {
  const { clearDraft = false } = options;
  clearScannerAutoApplyTimer();
  ui.isScannerModalOpen = false;
  ui.bulkScannerSession = null;
  if (clearDraft) {
    ui.scannerDraft = "";
    ui.parseResult = null;
  }
}

function getGroupDraft() {
  if (!ui.groupDraft) {
    ui.groupDraft = createEmptyGroupDraft();
  }
  if (!ui.groupDraft.groupCompRooms || typeof ui.groupDraft.groupCompRooms !== "object") {
    ui.groupDraft.groupCompRooms = {};
  }
  if (!Array.isArray(ui.groupDraft.groupMemoryCompTypes)) {
    ui.groupDraft.groupMemoryCompTypes = [];
  }
  if (!ui.groupDraft.memoryAppliedFields || typeof ui.groupDraft.memoryAppliedFields !== "object") {
    ui.groupDraft.memoryAppliedFields = {
      travelOrigin: false,
      groupPassengerRate: false,
    };
  }
  return ui.groupDraft;
}

function isGroupReservation(reservation) {
  return Boolean(reservation && sanitizeGroupCompany(reservation.groupCompany));
}

function shouldShowReservationFinancialFields(reservation) {
  return !isGroupReservation(reservation);
}

function syncGroupCompRoomsWithSelectedRooms(draft) {
  if (!draft || !draft.groupCompRooms || typeof draft.groupCompRooms !== "object") {
    return;
  }
  const selectedRooms = new Set(Array.isArray(draft.selectedRooms) ? draft.selectedRooms : []);
  draft.groupCompRooms = Object.entries(normalizeGroupCompRooms(draft.groupCompRooms)).reduce(
    (accumulator, [roomNumber, type]) => {
      if (selectedRooms.has(roomNumber)) {
        accumulator[roomNumber] = type;
      }
      return accumulator;
    },
    {}
  );
}

function syncGroupDraftSelectedRooms(draft) {
  if (!draft || !Array.isArray(draft.selectedRooms)) {
    return;
  }

  draft.selectedRooms = draft.selectedRooms
    .map((roomNumber) => sanitizeRoomNumber(roomNumber))
    .filter(Boolean)
    .filter(
      (roomNumber, index, collection) =>
        collection.indexOf(roomNumber) === index &&
        !isRoomUnderMaintenance(roomNumber) &&
        !getRoomOccupantForRange(
          roomNumber,
          draft.checkInDate,
          draft.checkOutDate,
          null,
          draft.editingGroupId
        )
    )
    .sort((left, right) => Number(left) - Number(right));
  syncGroupCompRoomsWithSelectedRooms(draft);
}

function getGroupMemoryEntry(company) {
  const key = getGroupMemoryKey(company);
  if (!key) return null;
  state.groupMemory = normalizeGroupMemory(state.groupMemory);
  return state.groupMemory[key] || null;
}

function applyGroupMemoryToDraft(draft) {
  if (!draft) return false;
  if (!draft.memoryAppliedFields || typeof draft.memoryAppliedFields !== "object") {
    draft.memoryAppliedFields = {
      travelOrigin: false,
      groupPassengerRate: false,
    };
  }
  const company = sanitizeGroupCompany(draft.company);
  const key = getGroupMemoryKey(company);
  if (!key || draft.appliedGroupMemoryKey === key) {
    return false;
  }
  const memory = getGroupMemoryEntry(company);
  draft.appliedGroupMemoryKey = memory ? key : "";
  if (!memory) {
    draft.groupMemoryCompTypes = [];
    return false;
  }

  if (
    memory.travelOrigin &&
    (!sanitizeTravelOrigin(draft.travelOrigin) || draft.memoryAppliedFields.travelOrigin)
  ) {
    draft.travelOrigin = memory.travelOrigin;
    draft.memoryAppliedFields.travelOrigin = true;
  }
  if (
    memory.groupPassengerRate &&
    (!draft.groupPassengerRate || draft.memoryAppliedFields.groupPassengerRate)
  ) {
    draft.groupPassengerRate = memory.groupPassengerRate;
    draft.memoryAppliedFields.groupPassengerRate = true;
  }
  draft.groupMemoryCompTypes = Array.isArray(memory.compRoomTypes)
    ? memory.compRoomTypes.map(sanitizeGroupCompRoomType).filter(Boolean)
    : [];
  return true;
}

function openGroupLoadModal() {
  resetScannerUi();
  closeTariffModal();
  closeReservationConfirmModal();
  closeGroupPickerModal();
  ui.groupDraft = createEmptyGroupDraft();
  ui.isGroupLoadModalOpen = true;
}

function closeGroupLoadModal(options = {}) {
  const { discardDraft = true } = options;
  ui.isGroupLoadModalOpen = false;
  if (discardDraft) {
    ui.groupDraft = null;
  }
}

function openGroupPickerModal() {
  const groups = getEditableGroupSummaries();
  if (!groups.length) {
    window.alert("Todav\u00eda no hay reservas grupales activas para editar.");
    return false;
  }

  resetScannerUi();
  closeTariffModal();
  closeReservationConfirmModal();
  closeStayPaymentModal();
  closeGroupLoadModal();
  ui.isGroupPickerModalOpen = true;
  return true;
}

function closeGroupPickerModal() {
  ui.isGroupPickerModalOpen = false;
}

function getActiveGroupReservations(groupId) {
  const normalizedGroupId = safeText(groupId);
  if (!normalizedGroupId) {
    return [];
  }
  return state.reservations
    .filter(
      (reservation) =>
        reservation.archived !== true && safeText(reservation.groupId) === normalizedGroupId
    )
    .sort((left, right) => Number(left.roomNumber) - Number(right.roomNumber));
}

function getEditableGroupSummaries() {
  const groups = new Map();

  state.reservations.forEach((reservation) => {
    if (!reservation || reservation.archived === true) {
      return;
    }

    const groupId = safeText(reservation.groupId);
    if (!groupId) {
      return;
    }

    const company = getReservationCompanyLabel(reservation) || "Grupo sin empresa";
    if (!groups.has(groupId)) {
      groups.set(groupId, {
        id: groupId,
        company,
        checkInDate: normalizeInputDate(reservation.checkInDate) || "",
        checkOutDate: normalizeInputDate(reservation.checkOutDate) || "",
        regime: sanitizeRegime(reservation.regime),
        groupColor: getReservationGroupColor(reservation),
        rooms: [],
      });
    }

    const group = groups.get(groupId);
    const checkInDate = normalizeInputDate(reservation.checkInDate);
    const checkOutDate = normalizeInputDate(reservation.checkOutDate);
    const roomNumber = sanitizeRoomNumber(reservation.roomNumber);

    if (checkInDate && (!group.checkInDate || checkInDate < group.checkInDate)) {
      group.checkInDate = checkInDate;
    }
    if (checkOutDate && (!group.checkOutDate || checkOutDate > group.checkOutDate)) {
      group.checkOutDate = checkOutDate;
    }
    if (!group.regime && reservation.regime) {
      group.regime = sanitizeRegime(reservation.regime);
    }
    if (!group.groupColor) {
      group.groupColor = getReservationGroupColor(reservation);
    }
    if (roomNumber && !group.rooms.includes(roomNumber)) {
      group.rooms.push(roomNumber);
    }
  });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      rooms: group.rooms.sort((left, right) => Number(left) - Number(right)),
    }))
    .sort(
      (left, right) =>
        left.company.localeCompare(right.company, "es") ||
        left.checkInDate.localeCompare(right.checkInDate) ||
        left.id.localeCompare(right.id)
    );
}

function createGroupDraftFromReservations(groupId) {
  const groupReservations = getActiveGroupReservations(groupId);
  if (!groupReservations.length) {
    return null;
  }

  const firstReservation = groupReservations[0];
  const groupRegime =
    sanitizeRegime(firstReservation.regime) ||
    sanitizeRegime((groupReservations.find((reservation) => sanitizeRegime(reservation.regime)) || {}).regime);
  const groupTravelOrigin =
    getReservationTravelOrigin(firstReservation) ||
    getReservationTravelOrigin(
      groupReservations.find((reservation) => getReservationTravelOrigin(reservation))
    );
  const totalGuests =
    sanitizeIntegerInput(firstReservation.groupTotalGuests) ||
    String(
      groupReservations.reduce(
        (sum, reservation) => sum + Math.max(1, reservation.guests.length),
        0
      )
    );

  return {
    ...createEmptyGroupDraft(firstReservation.checkInDate),
    company: getReservationCompanyLabel(firstReservation),
    travelOrigin: groupTravelOrigin,
    guestCount: totalGuests,
    checkInDate: normalizeInputDate(firstReservation.checkInDate) || getTodayInputDate(),
    checkOutDate:
      normalizeInputDate(firstReservation.checkOutDate) ||
      getMinimumCheckOutDate(firstReservation.checkInDate),
    regime: groupRegime,
    groupColor: sanitizeGroupColor(firstReservation.groupColor, firstReservation.groupCompany),
    groupInitial: getReservationGroupInitial(firstReservation),
    groupTariffs: normalizeGroupTariffs(firstReservation.groupAgreedTariffs),
    groupPassengerRate:
      parseAmount(firstReservation.groupAgreedPassengerRate) > 0
        ? sanitizeMoneyInput(firstReservation.groupAgreedPassengerRate)
        : "",
    groupMemoryCompTypes: [],
    appliedGroupMemoryKey: getGroupMemoryKey(getReservationCompanyLabel(firstReservation)),
    memoryAppliedFields: {
      travelOrigin: false,
      groupPassengerRate: false,
    },
    showGroupTariffs: false,
    editingGroupId: safeText(groupId),
    groupCompRooms: groupReservations.reduce((accumulator, reservation) => {
      const roomNumber = sanitizeRoomNumber(reservation.roomNumber);
      const type = sanitizeGroupCompRoomType(reservation.groupCompRoomType);
      if (roomNumber && type) {
        accumulator[roomNumber] = type;
      }
      return accumulator;
    }, {}),
    selectedRooms: groupReservations
      .map((reservation) => sanitizeRoomNumber(reservation.roomNumber))
      .filter(Boolean),
  };
}

function openGroupEditModal(groupId) {
  const draft = createGroupDraftFromReservations(groupId);
  if (!draft) {
    window.alert("No encontré una carga grupal activa para editar.");
    return false;
  }

  resetScannerUi();
  closeTariffModal();
  closeReservationConfirmModal();
  closeGroupPickerModal();
  ui.groupDraft = draft;
  ui.isGroupLoadModalOpen = true;
  return true;
}

function updateGroupDraftField(field, value) {
  const draft = getGroupDraft();
  if (field === "company") {
    const previousCompany = draft.company;
    const previousInitial = sanitizeGroupInitial(draft.groupInitial, previousCompany);
    const wasUsingAutomaticInitial =
      !draft.groupInitial || previousInitial === getGroupInitial(previousCompany);
    draft.company = sanitizeGroupCompany(value, { trim: false });
    if (wasUsingAutomaticInitial) {
      draft.groupInitial = getGroupInitial(draft.company);
    }
    applyGroupMemoryToDraft(draft);
    return;
  }

  if (field === "guestCount") {
    draft.guestCount = sanitizeIntegerInput(value);
    return;
  }

  if (field === "groupPassengerRate") {
    const sanitizedAmount = sanitizeMoneyInput(value);
    draft.groupPassengerRate = parseAmount(sanitizedAmount) > 0 ? sanitizedAmount : "";
    draft.memoryAppliedFields.groupPassengerRate = false;
    return;
  }

  if (field === "travelOrigin") {
    draft.travelOrigin = sanitizeTravelOrigin(value, { trim: false });
    draft.memoryAppliedFields.travelOrigin = false;
    return;
  }

  if (field === "checkInDate") {
    draft.checkInDate = normalizeInputDate(value) || getTodayInputDate();
    if (!hasValidStayDates(draft.checkInDate, draft.checkOutDate)) {
      draft.checkOutDate = getMinimumCheckOutDate(draft.checkInDate);
    }
    syncGroupDraftSelectedRooms(draft);
    return;
  }

  if (field === "checkOutDate") {
    const nextCheckOutDate = normalizeInputDate(value);
    draft.checkOutDate = hasValidStayDates(draft.checkInDate, nextCheckOutDate)
      ? nextCheckOutDate
      : getMinimumCheckOutDate(draft.checkInDate);
    syncGroupDraftSelectedRooms(draft);
    return;
  }

  if (field === "regime") {
    draft.regime = sanitizeRegime(value);
    return;
  }

  if (field === "groupColor") {
    draft.groupColor = sanitizeGroupColor(value, draft.company);
    return;
  }

  if (field === "groupInitial") {
    draft.groupInitial = sanitizeEditableGroupInitial(value);
  }
}

function normalizeGroupTariffs(rawTariffs, fallbackTariffs = state.tariffs) {
  const source = rawTariffs && typeof rawTariffs === "object" ? rawTariffs : {};
  const fallback = normalizeTariffs(fallbackTariffs);
  return Object.keys(DEFAULT_TARIFFS).reduce((accumulator, key) => {
    accumulator[key] = sanitizeMoneyInput(source[key]) || fallback[key];
    return accumulator;
  }, {});
}

function getGroupDraftTariffs(draft = getGroupDraft()) {
  return normalizeGroupTariffs(draft && draft.groupTariffs ? draft.groupTariffs : null);
}

function getGroupDraftPassengerRate(draft = getGroupDraft()) {
  const amount = parseAmount(draft && draft.groupPassengerRate);
  return amount && amount > 0 ? amount : null;
}

function updateGroupDraftTariffField(field, value) {
  if (!Object.prototype.hasOwnProperty.call(DEFAULT_TARIFFS, field)) {
    return;
  }

  const draft = getGroupDraft();
  draft.groupTariffs = {
    ...getGroupDraftTariffs(draft),
    [field]: sanitizeMoneyInput(value) || "",
  };
}

function setGroupDraftCompRoomType(roomNumber, type) {
  const draft = getGroupDraft();
  const normalizedRoom = sanitizeRoomNumber(roomNumber);
  const normalizedType = sanitizeGroupCompRoomType(type);
  if (
    !normalizedRoom ||
    !Array.isArray(draft.selectedRooms) ||
    !draft.selectedRooms.includes(normalizedRoom)
  ) {
    return;
  }

  const nextCompRooms = normalizeGroupCompRooms(draft.groupCompRooms);
  Object.entries(nextCompRooms).forEach(([existingRoom, existingType]) => {
    if (existingRoom !== normalizedRoom && existingType === normalizedType) {
      delete nextCompRooms[existingRoom];
    }
  });

  if (!normalizedType || nextCompRooms[normalizedRoom] === normalizedType) {
    delete nextCompRooms[normalizedRoom];
  } else {
    nextCompRooms[normalizedRoom] = normalizedType;
  }
  draft.groupCompRooms = nextCompRooms;
}

function copyCurrentTariffsToGroupDraft() {
  const draft = getGroupDraft();
  draft.groupTariffs = normalizeTariffs(state.tariffs);
}

function openTariffModal() {
  ui.isScannerModalOpen = false;
  ui.isTariffModalOpen = true;
  ui.tariffDraft = {
    ...normalizeTariffs(state.tariffs),
  };
}

function closeTariffModal(options = {}) {
  const { discardDraft = true } = options;
  ui.isTariffModalOpen = false;
  if (discardDraft) {
    ui.tariffDraft = null;
  }
}

function updateTariffDraft(field, value) {
  if (!Object.prototype.hasOwnProperty.call(DEFAULT_TARIFFS, field)) {
    return;
  }

  if (!ui.tariffDraft) {
    ui.tariffDraft = {
      ...normalizeTariffs(state.tariffs),
    };
  }

  ui.tariffDraft[field] = sanitizeMoneyInput(value) || "";
}

function saveTariffDraft() {
  state.tariffs = normalizeTariffs(ui.tariffDraft);
  ui.tariffDraft = null;
  ui.isTariffModalOpen = false;
  persistState({
    toast: "El tarifario qued\u00f3 actualizado.",
  });
}

function applySuggestedTariffToActiveReservation() {
  const reservation = getActiveReservation();
  if (!shouldShowReservationFinancialFields(reservation)) {
    return;
  }
  const tariffInfo = getReservationTariffInfo(reservation);
  if (!tariffInfo) {
    return;
  }

  reservation.total = String(Math.round(tariffInfo.suggestedTotal));
  reservation.discountNote = "";
  syncReservationPaymentFields(reservation);
  touchReservation(reservation);
  persistState({
    toast: `Se aplic\u00f3 la tarifa ${tariffInfo.label.toLowerCase()} a la reserva.`,
  });
}

function touchReservation(reservation, options = {}) {
  const timestamp = nowIso();
  reservation.updatedAt = timestamp;
  if (options.legal !== false) {
    reservation.legalUpdatedAt = timestamp;
    if (reservation.lastPrintedAt) {
      const currentSignature = buildLegalPacketSignature(reservation);
      if (!reservation.lastPrintedSignature || reservation.lastPrintedSignature !== currentSignature) {
        reservation.printInvalidatedAt = timestamp;
      }
    }
  }
}

function getTitular(reservation) {
  return reservation.responsible || createEmptyResponsible();
}

function hasResponsibleData(reservation) {
  const responsible = getTitular(reservation);
  return hasResponsibleSnapshotData(responsible);
}

function hasResponsibleSnapshotData(responsible) {
  return Boolean(
    responsible.firstName ||
      responsible.lastName ||
      responsible.document ||
      responsible.birthDate ||
      responsible.gender
  );
}

function isResponsibleBaseComplete(reservation) {
  const responsible = getTitular(reservation);
  return Boolean(safeText(responsible.firstName) && safeText(responsible.lastName));
}

function isResponsibleLegalComplete(reservation) {
  const responsible = getTitular(reservation);
  return Boolean(
    safeText(responsible.firstName) &&
      safeText(responsible.lastName) &&
      responsible.document &&
      normalizeHumanDate(responsible.birthDate) &&
      responsible.gender &&
      safeText(responsible.nationality) &&
      safeText(reservation.phone)
  );
}

function hasGuestData(guest) {
  return Boolean(
    guest.firstName ||
      guest.lastName ||
      guest.document ||
      guest.birthDate ||
      guest.gender ||
      guest.rawScan
  );
}

function isGuestComplete(guest) {
  return Boolean(
    guest.firstName &&
      guest.lastName &&
      guest.document &&
      normalizeHumanDate(guest.birthDate) &&
      guest.gender &&
      safeText(guest.nationality)
  );
}

function getAgeFromBirthDate(birthDate, referenceDate = getTodayInputDate()) {
  const normalizedBirthDate = normalizeInputDate(birthDate);
  const normalizedReferenceDate = normalizeInputDate(referenceDate);
  if (!normalizedBirthDate || !normalizedReferenceDate) return null;

  const birth = new Date(`${normalizedBirthDate}T12:00:00`);
  const reference = new Date(`${normalizedReferenceDate}T12:00:00`);
  let age = reference.getFullYear() - birth.getFullYear();
  const monthDelta = reference.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && reference.getDate() < birth.getDate())) {
    age -= 1;
  }
  if (age < 0 || Number.isNaN(age)) return null;
  return age;
}

function getLegalAgeInfo(person, referenceDate = getTodayInputDate()) {
  const age = getAgeFromBirthDate(person && person.birthDate, referenceDate);
  if (age === null) {
    return {
      age: null,
      isMinor: null,
      label: "Edad pendiente",
      shortLabel: "Edad pendiente",
    };
  }
  return {
    age,
    isMinor: age < 18,
    label: age < 18 ? `Menor de edad (${age})` : `Mayor de edad (${age})`,
    shortLabel: age < 18 ? `Menor (${age})` : `Mayor (${age})`,
  };
}

function getResponsibleLegalAgeInfo(reservation) {
  const responsible = getTitular(reservation);
  const referenceDate =
    normalizeInputDate(reservation && reservation.checkInDate) || getTodayInputDate();
  return getLegalAgeInfo(responsible, referenceDate);
}

function getResponsibleScannerMinorError(result, reservation) {
  const referenceDate =
    normalizeInputDate(reservation && reservation.checkInDate) || getTodayInputDate();
  const ageInfo = getLegalAgeInfo(
    { birthDate: result && result.data && result.data.birthDate },
    referenceDate
  );
  if (ageInfo.isMinor !== true) return "";
  return `El primer DNI escaneado corresponde a un menor de edad (${ageInfo.age} años). El primer DNI debe ser de un mayor de edad para cargar el titular o responsable de la habitación.`;
}

function buildResponsibleScannerMinorResult(result, reservation) {
  const error = getResponsibleScannerMinorError(result, reservation);
  if (!error) return null;
  return {
    ...result,
    ok: false,
    errorTitle: "El titular debe ser mayor de edad.",
    error,
  };
}

function getFilledGuestCount(reservation) {
  return reservation.guests.filter((guest) => hasGuestData(guest)).length;
}

function isReservationPlaceholder(reservation) {
  if (!reservation || reservation.archived || reservation.confirmedAt) {
    return false;
  }

  const createdBaseDate =
    reservation.createdAt && !Number.isNaN(new Date(reservation.createdAt).getTime())
      ? formatInputDate(new Date(reservation.createdAt))
      : getTodayInputDate();
  const defaultCheckInDate = normalizeInputDate(createdBaseDate) || getTodayInputDate();
  const defaultCheckOutDate = getMinimumCheckOutDate(defaultCheckInDate);
  const hasCustomStay =
    normalizeInputDate(reservation.checkInDate) !== defaultCheckInDate ||
    normalizeInputDate(reservation.checkOutDate) !== defaultCheckOutDate ||
    String(reservation.nights || "1") !== "1";

  return !(
    reservation.roomNumber ||
    reservation.regime ||
    reservation.licensePlate ||
    reservation.total ||
    reservation.depositAmount ||
    reservation.depositPaymentMethod ||
    reservation.depositDeferredReason ||
    reservation.cash ||
    reservation.transfer ||
    reservation.email ||
    reservation.phone ||
    String(reservation.notes || "").trim() ||
    String(reservation.discountNote || "").trim() ||
    reservation.allowExtraBed ||
    reservation.lastScanAt ||
    reservation.lastExportedAt ||
    reservation.lastPrintedAt ||
    hasResponsibleData(reservation) ||
    reservation.guests.length > 1 ||
    getFilledGuestCount(reservation) > 0 ||
    hasCustomStay
  );
}

function getVisibleReservations() {
  return state.reservations.filter((reservation) => !isReservationPlaceholder(reservation));
}

function getReservationGuestCount(reservation) {
  return Math.max(1, Array.isArray(reservation && reservation.guests) ? reservation.guests.length : 0);
}

function getTariffTierKey(guestCount) {
  const normalizedGuestCount = Number(guestCount) || 0;
  if (normalizedGuestCount === 1) return "single";
  if (normalizedGuestCount === 2) return "double";
  if (normalizedGuestCount === 3) return "triple";
  if (normalizedGuestCount >= 4) return "quadruple";
  return "";
}

function getTariffChargeGuestCount(
  reservation,
  roomProfile = getRoomProfile(reservation && reservation.roomNumber)
) {
  const actualGuestCount = getReservationGuestCount(reservation);
  if (!roomProfile) {
    return actualGuestCount;
  }
  return Math.max(actualGuestCount, roomProfile.baseCapacity);
}

function getRegimeSupplementInfo(regime, tariffs = state.tariffs) {
  const normalizedRegime = sanitizeRegime(regime);
  const normalizedTariffs = normalizeTariffs(tariffs);
  if (normalizedRegime === "Media Pensi\u00f3n") {
    return {
      key: "halfBoardSupplement",
      label: TARIFF_SUPPLEMENT_META.halfBoardSupplement.label,
      amount: parseAmount(normalizedTariffs.halfBoardSupplement) || 0,
    };
  }
  if (normalizedRegime === "Pensi\u00f3n Completa") {
    return {
      key: "fullBoardSupplement",
      label: TARIFF_SUPPLEMENT_META.fullBoardSupplement.label,
      amount: parseAmount(normalizedTariffs.fullBoardSupplement) || 0,
    };
  }
  return {
    key: "",
    label: "Sin adicional por r\u00e9gimen",
    amount: 0,
  };
}

function getReservationTariffInfo(reservation) {
  const actualGuestCount = getReservationGuestCount(reservation);
  const roomProfile = getRoomProfile(reservation && reservation.roomNumber);
  const billedGuestCount = getTariffChargeGuestCount(reservation, roomProfile);
  const tariffKey = getTariffTierKey(billedGuestCount);
  const nights = Number(reservation && reservation.nights) || getNightCountBetween(
    reservation && reservation.checkInDate,
    reservation && reservation.checkOutDate
  );
  if (!tariffKey || !nights) {
    return null;
  }

  const rate = parseAmount(state.tariffs && state.tariffs[tariffKey]);
  const supplementInfo = getRegimeSupplementInfo(reservation && reservation.regime, state.tariffs);
  const tariffMeta = TARIFF_META[tariffKey];
  if (!tariffMeta || rate === null) {
    return null;
  }
  const baseNightlyTotal = rate * billedGuestCount;
  const supplementNightlyTotal = supplementInfo.amount * actualGuestCount;

  return {
    key: tariffKey,
    label: tariffMeta.label,
    actualGuestCount,
    billedGuestCount,
    usesRoomBase: Boolean(roomProfile && billedGuestCount > actualGuestCount),
    roomProfile,
    nights,
    rate,
    supplementKey: supplementInfo.key,
    supplementLabel: supplementInfo.label,
    supplementRate: supplementInfo.amount,
    baseNightlyTotal,
    supplementNightlyTotal,
    nightlyTotal: baseNightlyTotal + supplementNightlyTotal,
    suggestedTotal: (baseNightlyTotal + supplementNightlyTotal) * nights,
  };
}

function getPaymentSummary(reservation) {
  const total = parseAmount(reservation && reservation.total);
  const cash = parseAmount(reservation && reservation.cash) || 0;
  const transfer = parseAmount(reservation && reservation.transfer) || 0;
  const depositMethod = sanitizeDepositPaymentMethod(reservation && reservation.depositPaymentMethod);
  const deposit =
    depositMethod === "cash" || depositMethod === "transfer"
      ? parseAmount(reservation && reservation.depositAmount) || 0
      : 0;
  const paid = cash + transfer + deposit;

  if (total === null) {
    return {
      total: null,
      cash,
      transfer,
      deposit,
      paid,
      pending: null,
      overpaid: 0,
    };
  }

  const difference = total - paid;
  return {
    total,
    cash,
    transfer,
    deposit,
    paid,
    pending: difference > 0 ? difference : 0,
    overpaid: difference < 0 ? Math.abs(difference) : 0,
  };
}

function getTariffAdjustmentInfo(reservation) {
  const tariffInfo = getReservationTariffInfo(reservation);
  const appliedTotal = parseAmount(reservation && reservation.total);
  if (!tariffInfo || appliedTotal === null) {
    return null;
  }

  const difference = appliedTotal - tariffInfo.suggestedTotal;
  const absoluteAmount = Math.abs(difference);
  const percent =
    tariffInfo.suggestedTotal > 0 ? (absoluteAmount / tariffInfo.suggestedTotal) * 100 : 0;

  if (difference === 0) {
    return {
      tariffInfo,
      appliedTotal,
      difference,
      absoluteAmount,
      percent,
      kind: "match",
    };
  }

  return {
    tariffInfo,
    appliedTotal,
    difference,
    absoluteAmount,
    percent,
    kind: difference < 0 ? "discount" : "surcharge",
  };
}

function syncReservationPaymentFields(reservation) {
  if (!reservation) return;
  const paymentSummary = getPaymentSummary(reservation);
  reservation.pending =
    paymentSummary.pending === null ? "" : String(Math.round(paymentSummary.pending));
}

function getRoomProfile(roomNumber) {
  const normalizedRoom = sanitizeRoomNumber(roomNumber);
  if (!normalizedRoom) return null;
  const profile = ROOM_CATALOG[normalizedRoom];
  if (!profile) return null;
  return {
    roomNumber: normalizedRoom,
    ...profile,
  };
}

function isRoomUnderMaintenance(roomNumber) {
  const normalizedRoom = sanitizeRoomNumber(roomNumber);
  return Boolean(normalizedRoom && state.roomMaintenance && state.roomMaintenance[normalizedRoom]);
}

function getRoomCapacitySummary(roomProfile) {
  if (!roomProfile) return "";
  return `Capacidad ${roomProfile.baseCapacity} hu\u00e9sped${
    roomProfile.baseCapacity === 1 ? "" : "es"
  }.`;
}

function getRoomCapacityHeadline(roomProfile) {
  if (!roomProfile) {
    return "Capacidad no definida";
  }
  if (roomProfile.supportsExtraBed && roomProfile.maxCapacity > roomProfile.baseCapacity) {
    return `Capacidad base: ${roomProfile.baseCapacity} hu\u00e9spedes \u00b7 M\u00e1ximo ${roomProfile.maxCapacity}`;
  }
  return `Capacidad: ${roomProfile.baseCapacity} hu\u00e9spedes`;
}

function getReservationRoomHeadlineData(reservation, roomNumber = reservation && reservation.roomNumber) {
  const normalizedRoomNumber = sanitizeRoomNumber(roomNumber);
  const roomProfile = getRoomProfile(normalizedRoomNumber);
  if (!normalizedRoomNumber) {
    return {
      title: "Habitaci\u00f3n sin seleccionar",
      detail: "Capacidad no definida",
      roomProfile: null,
    };
  }
  return {
    title: `Habitaci\u00f3n ${normalizedRoomNumber}`,
    detail: roomProfile ? getRoomCapacityHeadline(roomProfile) : "Capacidad no definida",
    roomProfile,
  };
}

function getRoomCategoryLabel(roomProfile) {
  if (!roomProfile) return "Habitación";
  if (roomProfile.baseCapacity <= 1) return "Simple";
  if (roomProfile.baseCapacity === 2) return "Doble";
  if (roomProfile.baseCapacity === 3) return "Triple";
  return "Cuádruple";
}

function getRoomLabelForIconMatch(roomProfile) {
  return String((roomProfile && roomProfile.label) || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function getRoomBedIconTypes(roomProfile) {
  if (!roomProfile) return [];
  const label = getRoomLabelForIconMatch(roomProfile);

  if (label.includes("SINGLE")) {
    return ["single"];
  }

  if (label.includes("CUADRUPLE")) {
    return ["double", "double", "single"];
  }

  if (label.includes("3 CAMAS TWIN") || (label.includes("TRIPLE TWIN") && !label.includes("MAT"))) {
    return ["single", "single", "single"];
  }

  if (label.includes("TRIPLE")) {
    return ["double", "single"];
  }

  return ["double"];
}

function renderRoomBedIcon(type) {
  const src = type === "single" ? ROOM_ICON_SINGLE_URL : ROOM_ICON_DOUBLE_URL;
  return `<img class="bed-icon is-${escapeHtml(type)}" src="${escapeHtml(src)}" alt="" loading="lazy" />`;
}

function renderRoomBedIcons(roomProfile, variant = "", maintenance = false) {
  const variantClass = variant ? ` is-${variant}` : "";
  if (maintenance) {
    return `
      <span class="maintenance-room-icon-row${variantClass}" aria-hidden="true">
        <span class="maintenance-room-icon"></span>
      </span>
    `;
  }
  const iconTypes = getRoomBedIconTypes(roomProfile);
  if (!iconTypes.length) return "";
  return `
    <span class="bed-icon-row${variantClass}" aria-hidden="true">
      ${iconTypes.map((type) => renderRoomBedIcon(type)).join("")}
    </span>
  `;
}

function getReservationCompanyLabel(reservation) {
  return sanitizeGroupCompany(reservation && reservation.groupCompany);
}

function getReservationGroupColor(reservation) {
  const company = getReservationCompanyLabel(reservation);
  if (!company) {
    return "";
  }
  return sanitizeGroupColor(reservation.groupColor, company);
}

function getReservationGroupInitial(reservation) {
  const company = getReservationCompanyLabel(reservation);
  if (!company) {
    return "";
  }
  return sanitizeGroupInitial(reservation.groupInitial, company);
}

function getReservationGroupCompRoomType(reservation) {
  return sanitizeGroupCompRoomType(reservation && reservation.groupCompRoomType);
}

function getReservationGroupCompRoomMeta(reservation) {
  return getGroupCompRoomMeta(getReservationGroupCompRoomType(reservation));
}

function getReservationIndividualColor(reservation) {
  if (!reservation) {
    return TIMELINE_INDIVIDUAL_COLOR;
  }
  return sanitizeReservationColor(reservation.reservationColor, getReservationColorSeed(reservation));
}

function getReservationDisplayResponsibleName(reservation) {
  const responsible = getTitular(reservation);
  const names = [responsible.firstName, responsible.lastName].filter(Boolean).join(" ").trim();
  if (names) {
    return names;
  }
  const company = getReservationCompanyLabel(reservation);
  if (company) {
    return company;
  }
  return "Responsable sin cargar";
}

function getGroupReservationSummary(reservation, options = {}) {
  const { includeFinancials = true } = options;
  const company = getReservationCompanyLabel(reservation);
  if (!company) {
    return "";
  }

  const pieces = [`Empresa ${company}`];
  const compMeta = getReservationGroupCompRoomMeta(reservation);
  if (compMeta) {
    pieces.push(`${compMeta.label} sin cargo`);
  }
  if (Number(reservation.groupRoomCount) > 0 && Number(reservation.groupRoomIndex) > 0) {
    pieces.push(`Habitaci\u00f3n ${reservation.groupRoomIndex} de ${reservation.groupRoomCount}`);
  }
  if (Number(reservation.groupTotalGuests) > 0) {
    pieces.push(`${reservation.groupTotalGuests} personas tarifadas`);
  }
  if (includeFinancials && reservation.groupAgreedPassengerRate) {
    pieces.push(`Pax acordado ${formatCurrency(reservation.groupAgreedPassengerRate)}`);
  }
  if (includeFinancials && reservation.groupAgreedTotal) {
    pieces.push(`Total pactado ${formatCurrency(reservation.groupAgreedTotal)}`);
  }
  return pieces.join(" \u00b7 ");
}

function canRoomUseExtraBed(roomProfile, guestCount) {
  return Boolean(
    roomProfile &&
      roomProfile.supportsExtraBed &&
      guestCount > roomProfile.baseCapacity &&
      guestCount <= roomProfile.maxCapacity
  );
}

function getEffectiveRoomCapacity(reservation, roomProfile = getRoomProfile(reservation && reservation.roomNumber)) {
  if (!roomProfile) return 0;
  return reservation && reservation.allowExtraBed && roomProfile.supportsExtraBed
    ? roomProfile.maxCapacity
    : roomProfile.baseCapacity;
}

function syncReservationRoomFlags(reservation) {
  if (!reservation) return;
  const roomProfile = getRoomProfile(reservation.roomNumber);
  if (!roomProfile || !roomProfile.supportsExtraBed) {
    reservation.allowExtraBed = false;
  }
}

function getRoomMaintenanceIssue(reservation) {
  if (!reservation || !reservation.roomNumber) return null;
  if (!isRoomUnderMaintenance(reservation.roomNumber)) return null;
  return {
    label: "Mantenimiento",
      message: `La habitación ${reservation.roomNumber} está deshabilitada por mantenimiento.`,
  };
}

function getRoomCapacityIssue(reservation) {
  if (!reservation || !reservation.roomNumber) return null;
  const roomProfile = getRoomProfile(reservation.roomNumber);
  if (!roomProfile) return null;

  const guestCount = getReservationGuestCount(reservation);
  const compMeta = getReservationGroupCompRoomMeta(reservation);
  if (compMeta && guestCount > compMeta.maxGuests) {
    return {
      label: "Cortes\u00eda",
      message: `La habitaci\u00f3n sin cargo para ${compMeta.label.toLowerCase()} admite hasta ${compMeta.maxGuests} ocupante${
        compMeta.maxGuests === 1 ? "" : "s"
      }.`,
    };
  }
  const effectiveCapacity = getEffectiveRoomCapacity(reservation, roomProfile);
  if (guestCount <= effectiveCapacity) {
    return null;
  }

  if (canRoomUseExtraBed(roomProfile, guestCount) && !reservation.allowExtraBed) {
    return {
      label: "Capacidad",
      message: `La habitación ${reservation.roomNumber} (${roomProfile.label}) admite ${roomProfile.baseCapacity} huéspedes. Puedes habilitar cama extra excepcional para llegar a ${roomProfile.maxCapacity}.`,
    };
  }

  const maxCapacity = roomProfile.supportsExtraBed
    ? roomProfile.maxCapacity
    : roomProfile.baseCapacity;
  return {
    label: "Capacidad",
      message: `La habitación ${reservation.roomNumber} (${roomProfile.label}) admite hasta ${maxCapacity} huéspedes y esta reserva tiene ${guestCount}.`,
  };
}

function getSuggestedPending(reservation) {
  const total = parseAmount(reservation.total);
  const cash = parseAmount(reservation.cash) || 0;
  const transfer = parseAmount(reservation.transfer) || 0;
  if (total === null) return null;
  return total - cash - transfer;
}

function isHotelStaySettled(reservation) {
  if (!shouldShowReservationFinancialFields(reservation)) {
    return true;
  }
  const summary = getPaymentSummary(reservation);
  return Boolean(summary.total !== null && summary.total > 0 && summary.pending === 0);
}

function getHotelSettlementIssues(reservation) {
  if (isHotelStaySettled(reservation)) {
    return [];
  }
  const summary = getPaymentSummary(reservation);
  if (summary.total === null || summary.total <= 0) {
    return ["Falta cargar el total pactado de la estad\u00eda."];
  }
  return [`Falta saldar la estad\u00eda antes del ingreso (${formatCurrency(summary.pending)} pendiente).`];
}

function hasReservationBookingName(reservation) {
  const responsible = getTitular(reservation);
  return Boolean(safeText(responsible.firstName) || safeText(responsible.lastName));
}

function getReservationDepositIssues(reservation) {
  if (!reservation || isGroupReservation(reservation)) {
    return [];
  }

  const issues = [];
  const method = sanitizeDepositPaymentMethod(reservation.depositPaymentMethod);
  if (!method) {
    issues.push("Falta elegir como queda registrada la se\u00f1a.");
    return issues;
  }

  if (method === "cash" || method === "transfer") {
    const depositAmount = parseAmount(reservation.depositAmount);
    if (depositAmount === null || depositAmount <= 0) {
      issues.push("Falta cargar el monto de la se\u00f1a.");
    }
  }

  if (method === "deferred" && !safeText(reservation.depositDeferredReason)) {
    issues.push("Para saldar la se\u00f1a a futuro, hay que especificar el motivo.");
  }

  return issues;
}

function getReservationBookingHardIssues(reservation) {
  if (!reservation) {
    return ["La reserva activa no est\u00e1 disponible."];
  }

  const issues = [];
  if (!reservation.roomNumber) {
    issues.push("Falta elegir una habitaci\u00f3n.");
  }
  if (
    !reservation.checkInDate ||
    !reservation.checkOutDate ||
    !hasValidStayDates(reservation.checkInDate, reservation.checkOutDate)
  ) {
    issues.push("Revisa check-in y check-out antes de confirmar.");
  }
  if (!sanitizeRegime(reservation.regime)) {
    issues.push("Falta elegir el r\u00e9gimen de la reserva.");
  }

  const blockingIssue = getReservationBlockingIssue(reservation);
  if (blockingIssue && !issues.includes(blockingIssue.message)) {
    issues.push(blockingIssue.message);
  }

  if (!hasReservationBookingName(reservation)) {
    issues.push("Falta cargar el nombre o referencia de la reserva.");
  }

  if (shouldShowReservationFinancialFields(reservation)) {
    const totalAmount = parseAmount(reservation.total);
    if (totalAmount === null || totalAmount <= 0) {
      issues.push("Falta cargar el precio pactado de la reserva.");
    }
  }

  issues.push(...getReservationDepositIssues(reservation));
  return Array.from(new Set(issues));
}

function getLegalPrintIssues(reservation) {
  const issues = [];
  if (!reservation || reservation.archived) {
    return ["La reserva no est\u00e1 disponible para imprimir."];
  }
  if (!reservation.confirmedAt) {
    issues.push("Falta confirmar la reserva.");
  }
  issues.push(...getRoomAccessIssues(reservation));
  issues.push(...getHotelSettlementIssues(reservation));
  return Array.from(new Set(issues));
}

function getIncompleteGuestLabels(reservation) {
  return reservation.guests
    .map((guest, index) => ({
      guest,
      index,
    }))
    .filter(({ guest }) => !isGuestComplete(guest))
    .map(({ index }) => getGuestRoleLabel(index));
}

function getRoomAccessIssues(reservation) {
  if (!reservation) {
    return ["La reserva activa no está disponible."];
  }

  const issues = [];
  const responsibleAgeInfo = getResponsibleLegalAgeInfo(reservation);
  const responsible = getTitular(reservation);
  if (!isResponsibleLegalComplete(reservation)) {
    if (!safeText(responsible.firstName) || !safeText(responsible.lastName)) {
      issues.push("Falta nombre y apellido del titular o responsable.");
    }
    if (!responsible.document) {
      issues.push("Falta el DNI del titular o responsable.");
    }
    if (!normalizeHumanDate(responsible.birthDate)) {
      issues.push("Falta la fecha de nacimiento del titular o responsable.");
    }
    if (!responsible.gender) {
      issues.push("Falta el género del titular o responsable.");
    }
    if (!safeText(responsible.nationality)) {
      issues.push("Falta la nacionalidad del titular o responsable.");
    }
    if (!safeText(reservation.phone)) {
      issues.push("Falta el teléfono del titular o responsable.");
    }
  }

  if (responsibleAgeInfo.isMinor === true) {
    issues.push("El titular o responsable debe ser mayor de edad al momento del ingreso.");
  }

  const incompleteGuests = getIncompleteGuestLabels(reservation);
  if (incompleteGuests.length) {
    issues.push(
      incompleteGuests.length === 1
        ? `Falta completar todos los datos de ${incompleteGuests[0]}.`
        : `Falta completar todos los datos de ${incompleteGuests.join(", ")}.`
    );
  }

  return issues;
}

function isRoomAccessReady(reservation) {
  return getRoomAccessIssues(reservation).length === 0;
}

function canReservationAttemptConfirmation(reservation) {
  return Boolean(reservation && !reservation.archived && reservation.roomNumber);
}

function getReservationConfirmationHardIssues(reservation) {
  if (isReservationsMode() && !isGroupReservation(reservation)) {
    return getReservationBookingHardIssues(reservation);
  }

  if (!reservation) {
    return ["La reserva activa no está disponible."];
  }

  const issues = [];
  const responsibleAgeInfo = getResponsibleLegalAgeInfo(reservation);
  if (!reservation.roomNumber) {
    issues.push("Falta elegir una habitación.");
  }

  if (
    !reservation.checkInDate ||
    !reservation.checkOutDate ||
    !hasValidStayDates(reservation.checkInDate, reservation.checkOutDate)
  ) {
    issues.push("Revisa ingreso y egreso antes de confirmar.");
  }

  if (!sanitizeRegime(reservation.regime)) {
    issues.push("Falta elegir el r\u00e9gimen de la reserva.");
  }

  const blockingIssue = getReservationBlockingIssue(reservation);
  if (blockingIssue && !issues.includes(blockingIssue.message)) {
    issues.push(blockingIssue.message);
  }

  if (!isResponsibleBaseComplete(reservation)) {
    issues.push("Falta nombre y apellido del titular o responsable.");
  }

  if (responsibleAgeInfo.isMinor === true) {
    issues.push("El titular o responsable debe ser mayor de edad al momento del ingreso.");
  }

  if (shouldShowReservationFinancialFields(reservation)) {
    const totalAmount = parseAmount(reservation.total);
    if (totalAmount === null || totalAmount <= 0) {
      issues.push("Falta cargar un total válido para la reserva.");
    }
  }

  return issues;
}

function getReservationConfirmationSoftWarnings(reservation) {
  if (!reservation) return [];

  if (isReservationsMode() && !isGroupReservation(reservation)) {
    const warnings = [];
    if (!reservation.phone) {
      warnings.push("Conviene cargar un tel\u00e9fono de contacto para la reserva.");
    }
    if (!getReservationTravelOrigin(reservation)) {
      warnings.push("La procedencia queda pendiente para completar el registro legal al ingreso.");
    }
    return warnings;
  }

  const warnings = [];
  const responsible = getTitular(reservation);
  if (
    safeText(responsible.firstName) &&
    safeText(responsible.lastName) &&
    !responsible.document
  ) {
    warnings.push("El titular o responsable todavía no tiene DNI completo.");
  }
  if (hasResponsibleData(reservation) && !isResponsibleLegalComplete(reservation)) {
    warnings.push("Al legajo del titular o responsable todavía le faltan datos para habilitar el ingreso.");
  }

  const incompleteGuests = reservation.guests.filter(
    (guest) => hasGuestData(guest) && !isGuestComplete(guest)
  ).length;
  if (incompleteGuests > 0) {
    warnings.push(
      `Hay ${incompleteGuests} huésped${incompleteGuests === 1 ? "" : "es"} con datos a revisar.`
    );
  }

  const emptyGuests = reservation.guests.filter((guest) => !hasGuestData(guest)).length;
  if (emptyGuests > 0) {
    warnings.push(
      `Hay ${emptyGuests} ficha${emptyGuests === 1 ? "" : "s"} de huésped todavía vacía${emptyGuests === 1 ? "" : "s"}.`
    );
  }

  if (!reservation.phone) {
    warnings.push("Conviene cargar el teléfono del titular o responsable.");
  } else if (!reservation.email) {
    warnings.push("Todavía no hay correo del titular o responsable.");
  }

  if (!getReservationTravelOrigin(reservation)) {
    warnings.push("Conviene cargar la procedencia declarada para el libro legal.");
  }

  return warnings;
}

function openReservationConfirmModal(reservationId = state.activeReservationId) {
  ui.isScannerModalOpen = false;
  ui.isTariffModalOpen = false;
  ui.confirmReservationId = reservationId;
  ui.isReservationConfirmModalOpen = true;
}

function closeReservationConfirmModal() {
  ui.confirmReservationId = null;
  ui.isReservationConfirmModalOpen = false;
}

function canShowStayPaymentAction(reservation) {
  if (
    !isCheckinMode() ||
    !reservation ||
    reservation.archived ||
    !shouldShowReservationFinancialFields(reservation)
  ) {
    return false;
  }
  const checkInDate = normalizeInputDate(reservation.checkInDate);
  const checkOutDate = normalizeInputDate(reservation.checkOutDate);
  const today = getTodayInputDate();
  if (!checkInDate) {
    return false;
  }
  if (checkInDate > today) {
    return false;
  }
  return !checkOutDate || today <= checkOutDate;
}

function getStayPaymentStatus(reservation) {
  const summary = getPaymentSummary(reservation);
  if (summary.total === null || summary.total <= 0) {
    return { label: "Abonar estadía", className: "is-blue", helper: "Primero cargá el total." };
  }
  if (summary.pending === 0 && summary.paid > 0) {
    return { label: "Estadía abonada", className: "is-green", helper: "Cobro registrado." };
  }
  if (reservation.stayPaymentMode === "deferred") {
    return { label: "Abonar estad\u00eda", className: "is-blue", helper: "Elegir caja de ingreso." };
  }
  return { label: "Abonar estadía", className: "is-blue", helper: "Elegir caja de ingreso." };
}

function getReservationForStayPayment() {
  const reservationId = ui.stayPaymentReservationId || "";
  return state.reservations.find((reservation) => reservation.id === reservationId) || null;
}

function openStayPaymentModal(reservationId) {
  const reservation = state.reservations.find((item) => item.id === reservationId) || null;
  if (!reservation) return;
  ui.isScannerModalOpen = false;
  ui.isTariffModalOpen = false;
  ui.isReservationConfirmModalOpen = false;
  ui.isCombinedStayPaymentModalOpen = false;
  ui.combinedStayPaymentDraft = null;
  ui.stayPaymentReservationId = reservation.id;
  ui.isStayPaymentModalOpen = true;
}

function closeCombinedStayPaymentModal() {
  ui.isCombinedStayPaymentModalOpen = false;
  ui.combinedStayPaymentDraft = null;
}

function closeStayPaymentModal() {
  closeCombinedStayPaymentModal();
  ui.stayPaymentReservationId = null;
  ui.isStayPaymentModalOpen = false;
}

function getPendingStayPaymentAmount(reservation = getReservationForStayPayment()) {
  if (!reservation) return 0;
  const summary = getPaymentSummary(reservation);
  return summary.pending === null ? 0 : Math.max(0, Math.round(summary.pending));
}

function openCombinedStayPaymentModal() {
  const reservation = getReservationForStayPayment();
  if (!reservation) return false;

  const total = parseAmount(reservation.total);
  if (total === null || total <= 0) {
    window.alert("Primero carg\u00e1 el total de la estad\u00eda para poder registrar el cobro.");
    return false;
  }

  const pending = getPendingStayPaymentAmount(reservation);
  if (pending <= 0) {
    window.alert("La estad\u00eda ya figura saldada.");
    return false;
  }

  ui.combinedStayPaymentDraft = {
    cash: "0",
    transfer: String(pending),
  };
  ui.isCombinedStayPaymentModalOpen = true;
  return true;
}

function updateCombinedStayPaymentDraft(field, rawValue) {
  const pending = getPendingStayPaymentAmount();
  const normalizedField = field === "transfer" ? "transfer" : "cash";
  const complementaryField = normalizedField === "cash" ? "transfer" : "cash";
  const parsedValue = parseAmount(rawValue);
  const amount = Math.min(pending, Math.max(0, Math.round(parsedValue || 0)));

  if (!ui.combinedStayPaymentDraft) {
    ui.combinedStayPaymentDraft = { cash: "0", transfer: String(pending) };
  }

  ui.combinedStayPaymentDraft[normalizedField] = String(amount);
  ui.combinedStayPaymentDraft[complementaryField] = String(Math.max(0, pending - amount));

  return {
    pending,
    cash: Number(ui.combinedStayPaymentDraft.cash) || 0,
    transfer: Number(ui.combinedStayPaymentDraft.transfer) || 0,
  };
}

function openRoomPickerModal() {
  const reservation = getActiveReservation();
  if (!reservation) return;
  ui.isScannerModalOpen = false;
  ui.isTariffModalOpen = false;
  ui.isReservationConfirmModalOpen = false;
  ui.isStayPaymentModalOpen = false;
  ui.isRoomPickerModalOpen = true;
  ui.roomPickerDraftNumber = sanitizeRoomNumber(reservation.roomNumber);
  ui.roomPickerConfirmNumber = "";
}

function closeRoomPickerModal() {
  ui.isRoomPickerModalOpen = false;
  ui.roomPickerDraftNumber = "";
  ui.roomPickerConfirmNumber = "";
  ui.roomPickerConfirmPosition = null;
}

function getContextualModalPosition(anchorElement) {
  const rect =
    anchorElement && typeof anchorElement.getBoundingClientRect === "function"
      ? anchorElement.getBoundingClientRect()
      : null;
  const doc = document.documentElement;
  const body = document.body;
  const docWidth = Math.max(
    doc ? doc.scrollWidth : 0,
    body ? body.scrollWidth : 0,
    window.innerWidth || 0
  );
  const docHeight = Math.max(
    doc ? doc.scrollHeight : 0,
    body ? body.scrollHeight : 0,
    window.innerHeight || 0
  );
  const fallbackLeft = (window.scrollX || 0) + (window.innerWidth || docWidth) / 2;
  const fallbackTop = (window.scrollY || 0) + (window.innerHeight || 520) / 2;
  const rawLeft = fallbackLeft;
  const rawTop = rect ? rect.top + rect.height / 2 + (window.scrollY || 0) : fallbackTop;
  const horizontalMargin = 320;
  const verticalMargin = 190;

  return {
    left: Math.round(
      Math.min(Math.max(rawLeft, Math.min(horizontalMargin, docWidth / 2)), Math.max(docWidth - horizontalMargin, horizontalMargin))
    ),
    top: Math.round(
      Math.min(Math.max(rawTop, verticalMargin), Math.max(docHeight - verticalMargin, verticalMargin))
    ),
  };
}

function openRoomPickerConfirmation(roomNumber, anchorElement = null) {
  const normalizedRoomNumber = sanitizeRoomNumber(roomNumber);
  if (!normalizedRoomNumber) return;
  ui.roomPickerDraftNumber = normalizedRoomNumber;
  ui.roomPickerConfirmNumber = normalizedRoomNumber;
  ui.roomPickerConfirmPosition = getContextualModalPosition(anchorElement);
}

function closeRoomPickerConfirmation() {
  ui.roomPickerConfirmNumber = "";
  ui.roomPickerConfirmPosition = null;
}

function confirmRoomPickerSelection() {
  const reservation = getActiveReservation();
  if (!reservation) {
    closeRoomPickerModal();
    render({ preserveScroll: true });
    return;
  }

  const scope = getAvailabilityScope(reservation, "request");
  const roomNumber = sanitizeRoomNumber(ui.roomPickerConfirmNumber || ui.roomPickerDraftNumber);
  const descriptor = roomNumber
    ? getRoomAvailabilityDescriptor(reservation, roomNumber, scope)
    : null;

  if (!descriptor || !descriptor.selectable) {
    window.alert(getRoomAvailabilitySelectionWarning(reservation, descriptor, scope));
    return;
  }

  updateReservationField("roomNumber", roomNumber);
  closeRoomPickerModal();
  render({
    preserveScroll: true,
    focusModal: ui.isPrivateReservationModalOpen,
    focusTop: !ui.isPrivateReservationModalOpen,
  });
}

function completeStayPayment(reservation, cashAmount, transferAmount, paymentMode) {
  const roundedCash = Math.max(0, Math.round(Number(cashAmount) || 0));
  const roundedTransfer = Math.max(0, Math.round(Number(transferAmount) || 0));
  const currentCash = parseAmount(reservation.cash) || 0;
  const currentTransfer = parseAmount(reservation.transfer) || 0;

  reservation.cash = String(Math.round(currentCash + roundedCash));
  reservation.transfer = String(Math.round(currentTransfer + roundedTransfer));
  reservation.stayPaymentMode = paymentMode;
  syncReservationPaymentFields(reservation);
  reservation.stayPaymentRecordedAt = nowIso();
  touchReservation(reservation, { legal: false });
  closeStayPaymentModal();
  persistState({
    toast: "El saldo de la estad\u00eda qued\u00f3 registrado en la caja correspondiente.",
  });
  if (shouldPrintWalkInLegalPacket(reservation)) {
    printLegalPacket(reservation.id);
    return;
  }
  render({ preserveScroll: true });
}

function applyStayPayment(method) {
  method = method === "transfer" ? "transfer" : "cash";
  const reservation = getReservationForStayPayment();
  if (!reservation) {
    closeStayPaymentModal();
    render({ preserveScroll: true });
    return;
  }

  const total = parseAmount(reservation.total);
  if (total === null || total <= 0) {
    window.alert("Primero carg\u00e1 el total de la estad\u00eda para poder registrar el cobro.");
    return;
  }

  const pending = getPendingStayPaymentAmount(reservation);
  if (pending <= 0) {
    window.alert("La estad\u00eda ya figura saldada.");
    closeStayPaymentModal();
    render({ preserveScroll: true });
    return;
  }

  completeStayPayment(
    reservation,
    method === "cash" ? pending : 0,
    method === "transfer" ? pending : 0,
    method
  );
}

function applyCombinedStayPayment() {
  const reservation = getReservationForStayPayment();
  if (!reservation) {
    closeStayPaymentModal();
    render({ preserveScroll: true });
    return;
  }

  const pending = getPendingStayPaymentAmount(reservation);
  const draft = ui.combinedStayPaymentDraft || { cash: "0", transfer: String(pending) };
  const cash = Math.max(0, Math.round(parseAmount(draft.cash) || 0));
  const transfer = Math.max(0, Math.round(parseAmount(draft.transfer) || 0));

  if (pending <= 0) {
    window.alert("La estad\u00eda ya figura saldada.");
    closeStayPaymentModal();
    render({ preserveScroll: true });
    return;
  }

  if (cash <= 0 || transfer <= 0) {
    window.alert(
      "Para registrar un pago combinado, carg\u00e1 una parte en efectivo y otra por transferencia."
    );
    return;
  }

  if (cash + transfer !== pending) {
    window.alert("La suma de efectivo y transferencia debe coincidir con el saldo pendiente.");
    return;
  }

  completeStayPayment(reservation, cash, transfer, "combined");
}

function scrollToReservationPanel() {
  scrollToModuleTargetAfterRender("reservation-active-panel");
}

function returnToCheckinHeaderAfterCompletion() {
  scrollToModuleTargetAfterRender("hero-section");
  window.setTimeout(() => {
    scrollToModuleTargetAfterRender("hero-section");
  }, 180);
}

function getReservationForConfirmation() {
  const reservationId = ui.confirmReservationId || state.activeReservationId;
  return state.reservations.find((reservation) => reservation.id === reservationId) || null;
}

function confirmReservation(reservationId = state.activeReservationId) {
  const reservation =
    state.reservations.find((item) => item.id === reservationId) || getActiveReservation();
  if (!reservation) return false;

  const hardIssues = getReservationConfirmationHardIssues(reservation);
  if (hardIssues.length) {
    return false;
  }

  if (isReservationsMode() && !isGroupReservation(reservation)) {
    reservation.depositRecordedAt = nowIso();
  }
  reservation.confirmedAt = nowIso();
  touchReservation(reservation);
  closeReservationConfirmModal();
  ui.isReservationWorkspaceOpen = false;
  ui.isPrivateReservationModalOpen = false;
  ui.roomAvailabilityMode = "today";
  persistState({
    toast: "La reserva qued\u00f3 confirmada.",
  });
  maybePrintLegalPacketAfterCheckinReady(reservation);
  return true;
}

function getReservationStatus(reservation) {
  if (reservation.archived) {
    return {
      label: "Archivada",
      className: "is-archived",
    };
  }

  const filledGuests = getFilledGuestCount(reservation);
  const blockingIssue = getReservationBlockingIssue(reservation);
  const operationalInfo = getReservationOperationalInfo(reservation);
  const hasConfirmableBase = Boolean(
    reservation.roomNumber &&
      reservation.checkInDate &&
      reservation.checkOutDate &&
      hasValidStayDates(reservation.checkInDate, reservation.checkOutDate)
  );
  const hasCoreData = Boolean(
    reservation.roomNumber ||
      reservation.checkInDate ||
      reservation.checkOutDate ||
      reservation.regime ||
      reservation.licensePlate ||
      getReservationTravelOrigin(reservation) ||
      hasResponsibleData(reservation) ||
      reservation.email ||
      reservation.phone ||
      reservation.notes ||
      filledGuests > 0
  );

  if (blockingIssue) {
    return {
      label: blockingIssue.label,
      className: "is-blocked",
    };
  }

  if (reservation.confirmedAt && hasConfirmableBase) {
    if (isReservationIngressRegistered(reservation, operationalInfo)) {
      return {
        label: getIngressRegisteredLabel(reservation),
        className: "is-checked-in",
      };
    }
    return {
      label: "Reserva Confirmada",
      className: "is-ready",
    };
  }

  if (hasConfirmableBase) {
    return {
      label: isReservationsMode() ? "No confirmada" : "Por confirmar",
      className: "is-awaiting",
    };
  }

  if (hasCoreData) {
    return {
      label: isReservationsMode() ? "Incompleta" : "En carga",
      className: "is-progress",
    };
  }

  return {
    label: "Borrador",
    className: "is-draft",
  };
}

function needsHistoryLegajoBadge(reservation) {
  if (!reservation || reservation.archived === true) {
    return false;
  }

  const responsible = getTitular(reservation);
  const hasAnyGuestData = Array.isArray(reservation.guests)
    ? reservation.guests.some((guest) => hasGuestData(guest))
    : false;
  const hasAnyGuestDocument = Array.isArray(reservation.guests)
    ? reservation.guests.some((guest) => safeText(guest.document))
    : false;
  const hasAnyDocument = Boolean(safeText(responsible.document) || hasAnyGuestDocument);
  return !hasResponsibleData(reservation) || !hasAnyGuestData || !hasAnyDocument;
}

function getGuestStatus(guest) {
  if (isGuestComplete(guest)) {
    return {
      label: "Completo",
      className: "is-ready",
    };
  }

  if (hasGuestData(guest)) {
    return {
      label: "Revisar",
      className: "is-progress",
    };
  }

  return {
    label: "Vac\u00edo",
    className: "is-draft",
  };
}

function getRoomConflict(
  reservation,
  roomNumber = reservation && reservation.roomNumber,
  checkInDate = reservation && reservation.checkInDate,
  checkOutDate = reservation && reservation.checkOutDate
) {
  if (!reservation) return null;
  const normalizedRoom = sanitizeRoomNumber(roomNumber);
  if (!normalizedRoom || !hasValidStayDates(checkInDate, checkOutDate)) return null;
  return (
    state.reservations.find(
      (item) =>
        item.id !== reservation.id &&
        item.archived !== true &&
        sanitizeRoomNumber(item.roomNumber) === normalizedRoom &&
        rangesOverlap(checkInDate, checkOutDate, item.checkInDate, item.checkOutDate)
    ) || null
  );
}

function getRoomConflictMessage(
  reservation,
  roomNumber = reservation && reservation.roomNumber,
  checkInDate = reservation && reservation.checkInDate,
  checkOutDate = reservation && reservation.checkOutDate
) {
  const conflictReservation = getRoomConflict(
    reservation,
    roomNumber,
    checkInDate,
    checkOutDate
  );
  const normalizedRoom = sanitizeRoomNumber(roomNumber);
  if (!conflictReservation || !normalizedRoom) return "";
  return `La habitaci\u00f3n ${normalizedRoom} ya est\u00e1 ocupada del ${formatDisplayDate(
    conflictReservation.checkInDate
  )} al ${formatDisplayDate(conflictReservation.checkOutDate)} en ${buildReservationTitle(conflictReservation)}.`;
}

function getReservationBlockingIssue(reservation) {
  if (!reservation) return null;
  if (
    reservation.checkInDate &&
    reservation.checkOutDate &&
    !hasValidStayDates(reservation.checkInDate, reservation.checkOutDate)
  ) {
    return {
      label: "Fechas",
      message: "La fecha de egreso debe ser posterior al ingreso.",
    };
  }

  const roomMaintenanceIssue = getRoomMaintenanceIssue(reservation);
  if (roomMaintenanceIssue) {
    return roomMaintenanceIssue;
  }

  const roomConflictMessage = getRoomConflictMessage(reservation);
  if (roomConflictMessage) {
    return {
      label: "Hab. ocupada",
      message: roomConflictMessage,
    };
  }

  const roomCapacityIssue = getRoomCapacityIssue(reservation);
  if (roomCapacityIssue) {
    return roomCapacityIssue;
  }

  return null;
}

function getOccupiedRoomNumbers(excludedReservationId = null) {
  return state.reservations
    .filter(
      (reservation) => reservation.archived !== true && reservation.id !== excludedReservationId
    )
    .map((reservation) => sanitizeRoomNumber(reservation.roomNumber))
    .filter(Boolean)
    .sort((left, right) => Number(left) - Number(right));
}

function summarizeOccupiedRooms(roomNumbers) {
  if (!roomNumbers.length) {
    return "Ahora no hay otras habitaciones activas.";
  }
  if (roomNumbers.length <= 8) {
    return `Activas ahora: ${roomNumbers.join(", ")}.`;
  }
  return `Activas ahora: ${roomNumbers.slice(0, 8).join(", ")} y ${roomNumbers.length - 8} m\u00e1s.`;
}

function getRoomOccupantForRange(
  roomNumber,
  startDate,
  endDate,
  excludedReservationId = null,
  excludedGroupId = ""
) {
  const normalizedRoom = sanitizeRoomNumber(roomNumber);
  const normalizedExcludedGroupId = safeText(excludedGroupId);
  if (!normalizedRoom || !hasValidStayDates(startDate, endDate)) {
    return null;
  }

  return (
    state.reservations
      .filter(
        (reservation) =>
          reservation.archived !== true &&
          reservation.id !== excludedReservationId &&
          (!normalizedExcludedGroupId || reservation.groupId !== normalizedExcludedGroupId) &&
          sanitizeRoomNumber(reservation.roomNumber) === normalizedRoom &&
          rangesOverlap(startDate, endDate, reservation.checkInDate, reservation.checkOutDate)
      )
      .sort((left, right) => new Date(left.checkInDate) - new Date(right.checkInDate))[0] || null
  );
}

function getRoomReservationByBoundary(
  roomNumber,
  boundaryField,
  date,
  excludedReservationId = null
) {
  const normalizedRoom = sanitizeRoomNumber(roomNumber);
  const targetDate = normalizeInputDate(date);
  if (!normalizedRoom || !targetDate) {
    return null;
  }

  return (
    state.reservations
      .filter(
        (reservation) =>
          reservation.archived !== true &&
          reservation.id !== excludedReservationId &&
          sanitizeRoomNumber(reservation.roomNumber) === normalizedRoom &&
          normalizeInputDate(reservation[boundaryField]) === targetDate
      )
      .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt))[0] || null
  );
}

function getRoomReservationStartingOnDate(roomNumber, date, excludedReservationId = null) {
  return getRoomReservationByBoundary(roomNumber, "checkInDate", date, excludedReservationId);
}

function getRoomReservationEndingOnDate(roomNumber, date, excludedReservationId = null) {
  return getRoomReservationByBoundary(roomNumber, "checkOutDate", date, excludedReservationId);
}

function getOccupiedRoomNumbersForRange(startDate, endDate, excludedReservationId = null) {
  if (!hasValidStayDates(startDate, endDate)) {
    return [];
  }

  return ROOM_OPTIONS.filter((roomNumber) =>
    Boolean(getRoomOccupantForRange(roomNumber, startDate, endDate, excludedReservationId))
  );
}

function getGroupRoomDescriptor(roomNumber, draft = getGroupDraft()) {
  const roomProfile = getRoomProfile(roomNumber);
  const normalizedRoom = sanitizeRoomNumber(roomNumber);
  const checkInDate = normalizeInputDate(draft && draft.checkInDate);
  const checkOutDate = normalizeInputDate(draft && draft.checkOutDate);
  const compRoomType = sanitizeGroupCompRoomType(
    draft && draft.groupCompRooms && draft.groupCompRooms[normalizedRoom]
  );
  const maintenance = isRoomUnderMaintenance(normalizedRoom);
  const conflictReservation = hasValidStayDates(checkInDate, checkOutDate)
    ? getRoomOccupantForRange(
        normalizedRoom,
        checkInDate,
        checkOutDate,
        null,
        draft && draft.editingGroupId
      )
    : null;
  const selectable = Boolean(
    normalizedRoom &&
      roomProfile &&
      hasValidStayDates(checkInDate, checkOutDate) &&
      !maintenance &&
      !conflictReservation
  );
  return {
    roomNumber: normalizedRoom,
    roomProfile,
    maintenance,
    conflictReservation,
    selectable,
    compRoomType,
    compRoomMeta: getGroupCompRoomMeta(compRoomType),
    isSelected: Boolean(draft && Array.isArray(draft.selectedRooms) && draft.selectedRooms.includes(normalizedRoom)),
  };
}

function getGroupSelectionCapacitySummary(draft = getGroupDraft()) {
  const selectedRoomNumbers = Array.isArray(draft.selectedRooms) ? draft.selectedRooms : [];
  const descriptors = selectedRoomNumbers
    .map((roomNumber) => getGroupRoomDescriptor(roomNumber, draft))
    .filter((descriptor) => descriptor.roomProfile);
  const billableDescriptors = descriptors.filter((descriptor) => !descriptor.compRoomType);
  const complimentaryDescriptors = descriptors.filter((descriptor) => descriptor.compRoomType);
  const guestCount = Number(draft.guestCount) || 0;
  const baseCapacity = billableDescriptors.reduce(
    (total, descriptor) => total + descriptor.roomProfile.baseCapacity,
    0
  );
  const maxCapacity = billableDescriptors.reduce(
    (total, descriptor) => total + descriptor.roomProfile.maxCapacity,
    0
  );
  const excessBaseCapacity = guestCount > 0 ? Math.max(0, baseCapacity - guestCount) : 0;
  return {
    guestCount,
    roomCount: descriptors.length,
    billableRoomCount: billableDescriptors.length,
    complimentaryRoomCount: complimentaryDescriptors.length,
    descriptors,
    billableDescriptors,
    complimentaryDescriptors,
    baseCapacity,
    maxCapacity,
    excessBaseCapacity,
    fitsBase: guestCount > 0 && baseCapacity >= guestCount,
    fitsMax: guestCount > 0 && maxCapacity >= guestCount,
    hasExcessBillableCapacity: excessBaseCapacity > 0,
    hasTooManyRooms: guestCount > 0 && billableDescriptors.length > guestCount,
  };
}

function getGroupAssignmentBillingLine(assignment, tariffs, nights, regime = "") {
  const roomProfile = getRoomProfile(assignment.roomNumber);
  if (!roomProfile || !nights) {
    return null;
  }

  const compMeta = getGroupCompRoomMeta(assignment.compRoomType);
  if (compMeta) {
    return {
      roomNumber: assignment.roomNumber,
      roomLabel: roomProfile.label,
      actualGuestCount: Number(assignment.guestCount) || 1,
      billedGuestCount: 0,
      tariffKey: "complimentary",
      tariffLabel: `${compMeta.label} sin cargo`,
      rate: 0,
      nights,
      subtotal: 0,
      allowExtraBed: false,
      isComplimentary: true,
      compRoomType: assignment.compRoomType,
    };
  }

  const actualGuestCount = Number(assignment.guestCount) || 1;
  const billedGuestCount = Math.max(actualGuestCount, roomProfile.baseCapacity);
  const tariffKey = getTariffTierKey(billedGuestCount);
  const tariffMeta = TARIFF_META[tariffKey];
  const rate = parseAmount(tariffs && tariffs[tariffKey]);
  const supplementInfo = getRegimeSupplementInfo(regime, tariffs);
  if (!tariffKey || !tariffMeta || rate === null) {
    return null;
  }
  const baseSubtotal = rate * billedGuestCount * nights;
  const supplementSubtotal = supplementInfo.amount * actualGuestCount * nights;

  return {
    roomNumber: assignment.roomNumber,
    roomLabel: roomProfile.label,
    actualGuestCount,
    billedGuestCount,
    tariffKey,
    tariffLabel: tariffMeta.label,
    rate,
    supplementKey: supplementInfo.key,
    supplementLabel: supplementInfo.label,
    supplementRate: supplementInfo.amount,
    nights,
    baseSubtotal,
    supplementSubtotal,
    subtotal: baseSubtotal + supplementSubtotal,
    allowExtraBed: assignment.allowExtraBed,
  };
}

function getGroupPassengerAgreementLine(assignment, passengerRate, nights) {
  const roomProfile = getRoomProfile(assignment.roomNumber);
  if (!roomProfile || !nights) {
    return null;
  }

  const compMeta = getGroupCompRoomMeta(assignment.compRoomType);
  const actualGuestCount = Number(assignment.guestCount) || 1;
  if (compMeta) {
    return {
      roomNumber: assignment.roomNumber,
      roomLabel: roomProfile.label,
      actualGuestCount,
      billedGuestCount: 0,
      tariffKey: "complimentary",
      tariffLabel: `${compMeta.label} sin cargo`,
      rate: 0,
      nights,
      subtotal: 0,
      allowExtraBed: false,
      isComplimentary: true,
      compRoomType: assignment.compRoomType,
      pricingMode: "passenger",
    };
  }

  return {
    roomNumber: assignment.roomNumber,
    roomLabel: roomProfile.label,
    actualGuestCount,
    billedGuestCount: actualGuestCount,
    tariffKey: "passengerAgreement",
    tariffLabel: "Monto acordado por pasajero",
    rate: passengerRate,
    nights,
    subtotal: passengerRate * actualGuestCount,
    allowExtraBed: assignment.allowExtraBed,
    pricingMode: "passenger",
  };
}

function getGroupQuoteSummary(draft = getGroupDraft(), summary = getGroupSelectionCapacitySummary(draft)) {
  const nights = getNightCountBetween(draft.checkInDate, draft.checkOutDate) || 0;
  const tariffs = getGroupDraftTariffs(draft);
  const passengerRate = getGroupDraftPassengerRate(draft);
  if (
    !summary.guestCount ||
    !summary.roomCount ||
    summary.hasTooManyRooms ||
    !summary.fitsMax ||
    !nights
  ) {
    return {
      ready: false,
      total: null,
      nights,
      tariffs,
      passengerRate,
      pricingMode: passengerRate ? "passenger" : "roomTariffs",
      lines: [],
    };
  }

  const assignments = [
    ...distributeGroupGuestsAcrossRooms(
      summary.billableDescriptors.map((descriptor) => descriptor.roomNumber),
      summary.guestCount
    ),
    ...summary.complimentaryDescriptors.map((descriptor) => ({
      roomNumber: descriptor.roomNumber,
      guestCount: 1,
      allowExtraBed: false,
      compRoomType: descriptor.compRoomType,
    })),
  ].sort((left, right) => Number(left.roomNumber) - Number(right.roomNumber));
  const lines = assignments
    .map((assignment) =>
      passengerRate
        ? getGroupPassengerAgreementLine(assignment, passengerRate, nights)
        : getGroupAssignmentBillingLine(assignment, tariffs, nights, draft.regime)
    )
    .filter(Boolean);
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);

  return {
    ready: Boolean(lines.length),
    total,
    nights,
    tariffs,
    passengerRate,
    pricingMode: passengerRate ? "passenger" : "roomTariffs",
    lines,
  };
}

function createGroupMemoryPeopleFromReservation(reservation) {
  const responsible = normalizeResponsible(reservation && reservation.responsible);
  const guests = Array.isArray(reservation && reservation.guests)
    ? reservation.guests.map((guest, index) => normalizeGuest(guest, index === 0)).filter(Boolean)
    : [];
  if (!hasResponsibleSnapshotData(responsible) && !guests.some((guest) => hasGuestData(guest))) {
    return null;
  }
  return {
    responsible,
    guests,
  };
}

function applyGroupMemoryPeopleToReservation(reservation, memory, compRoomType) {
  const type = sanitizeGroupCompRoomType(compRoomType);
  if (!reservation || !memory || !type || !memory.compPeople || !memory.compPeople[type]) {
    return;
  }
  const people = normalizeGroupMemoryPeople(memory.compPeople[type]);
  if (hasResponsibleSnapshotData(people.responsible)) {
    reservation.responsible = people.responsible;
  }
  if (people.guests.length) {
    const compMeta = getGroupCompRoomMeta(type);
    const maxGuests = compMeta ? compMeta.maxGuests : people.guests.length;
    reservation.guests = people.guests
      .slice(0, maxGuests)
      .map((guest, index) => ({
        ...normalizeGuest(guest, index === 0),
        role: index === 0 ? "principal" : "huesped",
      }));
  }
}

function getIsoTimestampWeight(value) {
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getReservationMemoryTimestamp(reservation) {
  return reservation.updatedAt || reservation.legalUpdatedAt || reservation.createdAt || "";
}

function syncGroupMemoryFromReservations() {
  state.groupMemory = normalizeGroupMemory(state.groupMemory);
  const groupedReservations = new Map();

  state.reservations.forEach((reservation) => {
    if (!reservation || !sanitizeGroupCompany(reservation.groupCompany)) {
      return;
    }
    const groupId = safeText(reservation.groupId);
    const company = sanitizeGroupCompany(reservation.groupCompany);
    const fallbackKey = [
      getGroupMemoryKey(company),
      normalizeInputDate(reservation.checkInDate),
      normalizeInputDate(reservation.checkOutDate),
    ]
      .filter(Boolean)
      .join("|");
    const bucketKey = groupId || fallbackKey;
    if (!bucketKey) {
      return;
    }
    if (!groupedReservations.has(bucketKey)) {
      groupedReservations.set(bucketKey, []);
    }
    groupedReservations.get(bucketKey).push(reservation);
  });

  groupedReservations.forEach((reservations) => {
    const sortedReservations = [...reservations].sort(
      (left, right) =>
        getIsoTimestampWeight(getReservationMemoryTimestamp(right)) -
        getIsoTimestampWeight(getReservationMemoryTimestamp(left))
    );
    const firstReservation = sortedReservations[0];
    const company = sanitizeGroupCompany(firstReservation && firstReservation.groupCompany);
    const memoryKey = getGroupMemoryKey(company);
    if (!memoryKey) {
      return;
    }

    const existing = state.groupMemory[memoryKey] || null;
    const groupUpdatedAt =
      sortedReservations
        .map(getReservationMemoryTimestamp)
        .sort((left, right) => getIsoTimestampWeight(right) - getIsoTimestampWeight(left))[0] ||
      nowIso();
    if (
      existing &&
      existing.updatedAt &&
      getIsoTimestampWeight(groupUpdatedAt) < getIsoTimestampWeight(existing.updatedAt)
    ) {
      return;
    }

    const travelOrigin =
      sortedReservations.map(getReservationTravelOrigin).find((value) => sanitizeTravelOrigin(value)) ||
      "";
    const passengerRate =
      sortedReservations
        .map((reservation) => sanitizeMoneyInput(reservation.groupAgreedPassengerRate))
        .find((value) => parseAmount(value) > 0) || "";
    const compRoomTypes = [];
    const compPeople = {};
    sortedReservations.forEach((reservation) => {
      const type = sanitizeGroupCompRoomType(reservation.groupCompRoomType);
      if (!type) {
        return;
      }
      if (!compRoomTypes.includes(type)) {
        compRoomTypes.push(type);
      }
      const people = createGroupMemoryPeopleFromReservation(reservation);
      if (people && !compPeople[type]) {
        compPeople[type] = people;
      }
    });

    state.groupMemory[memoryKey] = {
      key: memoryKey,
      company,
      travelOrigin,
      groupPassengerRate: passengerRate,
      compRoomTypes,
      compPeople,
      updatedAt: groupUpdatedAt,
    };
  });
}

function isBetterGroupRoomSelection(candidate, current, targetGuestCount) {
  if (!current) {
    return true;
  }

  const candidateOverage = candidate.capacity - targetGuestCount;
  const currentOverage = current.capacity - targetGuestCount;
  if (candidate.rooms.length !== current.rooms.length) {
    return candidate.rooms.length < current.rooms.length;
  }
  if (candidateOverage !== currentOverage) {
    return candidateOverage < currentOverage;
  }

  const candidateRoomScore = candidate.rooms.reduce((total, roomNumber) => total + Number(roomNumber), 0);
  const currentRoomScore = current.rooms.reduce((total, roomNumber) => total + Number(roomNumber), 0);
  return candidateRoomScore < currentRoomScore;
}

function findBestGroupRoomCombination(roomEntries, targetGuestCount, capacityField = "baseCapacity") {
  if (!Array.isArray(roomEntries) || !roomEntries.length || targetGuestCount <= 0) {
    return null;
  }

  let states = new Map([[0, { rooms: [], capacity: 0 }]]);
  roomEntries.forEach((entry) => {
    const nextStates = new Map(states);
    states.forEach((stateEntry, sum) => {
      const nextCapacity = sum + Number(entry[capacityField] || 0);
      const candidate = {
        rooms: [...stateEntry.rooms, entry.roomNumber],
        capacity: nextCapacity,
      };
      const existing = nextStates.get(nextCapacity);
      if (isBetterGroupRoomSelection(candidate, existing, targetGuestCount)) {
        nextStates.set(nextCapacity, candidate);
      }
    });
    states = nextStates;
  });

  let best = null;
  states.forEach((candidate, capacity) => {
    if (capacity < targetGuestCount) {
      return;
    }
    if (isBetterGroupRoomSelection(candidate, best, targetGuestCount)) {
      best = candidate;
    }
  });

  return best;
}

function getSuggestedGroupRoomSelection(draft = getGroupDraft()) {
  const guestCount = Number(draft.guestCount) || 0;
  const checkInDate = normalizeInputDate(draft.checkInDate);
  const checkOutDate = normalizeInputDate(draft.checkOutDate);
  if (!guestCount || !hasValidStayDates(checkInDate, checkOutDate)) {
    return null;
  }

  const complimentaryRooms = new Set(Object.keys(normalizeGroupCompRooms(draft.groupCompRooms)));
  const roomEntries = ROOM_OPTIONS.map((roomNumber) => getGroupRoomDescriptor(roomNumber, draft))
    .filter(
      (descriptor) => descriptor.selectable && !complimentaryRooms.has(descriptor.roomNumber)
    )
    .map((descriptor) => ({
      roomNumber: descriptor.roomNumber,
      baseCapacity: descriptor.roomProfile.baseCapacity,
      maxCapacity: descriptor.roomProfile.maxCapacity,
    }));

  const baseSuggestion = findBestGroupRoomCombination(roomEntries, guestCount, "baseCapacity");
  if (baseSuggestion) {
    return {
      roomNumbers: [...baseSuggestion.rooms].sort((left, right) => Number(left) - Number(right)),
      requiresExtraBed: false,
    };
  }

  const maxSuggestion = findBestGroupRoomCombination(roomEntries, guestCount, "maxCapacity");
  if (maxSuggestion) {
    return {
      roomNumbers: [...maxSuggestion.rooms].sort((left, right) => Number(left) - Number(right)),
      requiresExtraBed: true,
    };
  }

  return null;
}

function getRememberedGroupCompTypes(draft = getGroupDraft()) {
  return Array.isArray(draft.groupMemoryCompTypes)
    ? draft.groupMemoryCompTypes
        .map(sanitizeGroupCompRoomType)
        .filter(Boolean)
        .filter((type, index, collection) => collection.indexOf(type) === index)
    : [];
}

function findSuggestedComplimentaryRoom(draft, selectedRooms, compType) {
  const type = sanitizeGroupCompRoomType(compType);
  const meta = getGroupCompRoomMeta(type);
  if (!meta) {
    return "";
  }
  const selectedSet = selectedRooms instanceof Set ? selectedRooms : new Set(selectedRooms || []);
  const candidates = ROOM_OPTIONS.map((roomNumber) => getGroupRoomDescriptor(roomNumber, draft))
    .filter(
      (descriptor) =>
        descriptor.selectable &&
        !selectedSet.has(descriptor.roomNumber) &&
        descriptor.roomProfile &&
        descriptor.roomProfile.maxCapacity >= meta.maxGuests
    )
    .sort((left, right) => {
      const capacityCompare = left.roomProfile.maxCapacity - right.roomProfile.maxCapacity;
      if (capacityCompare !== 0) return capacityCompare;
      return Number(left.roomNumber) - Number(right.roomNumber);
    });
  return candidates[0] ? candidates[0].roomNumber : "";
}

function suggestGroupRoomsFromDraft() {
  const draft = getGroupDraft();
  const suggestion = getSuggestedGroupRoomSelection(draft);
  if (!suggestion) {
    window.alert("No hay una combinaci\u00f3n disponible que alcance esa cantidad de personas para las fechas elegidas.");
    return false;
  }

  const complimentaryRooms = Object.keys(normalizeGroupCompRooms(draft.groupCompRooms));
  const selectedRooms = new Set([...complimentaryRooms, ...suggestion.roomNumbers]);
  const nextCompRooms = normalizeGroupCompRooms(draft.groupCompRooms);
  getRememberedGroupCompTypes(draft).forEach((type) => {
    if (Object.values(nextCompRooms).includes(type)) {
      return;
    }
    const roomNumber = findSuggestedComplimentaryRoom(draft, selectedRooms, type);
    if (roomNumber) {
      nextCompRooms[roomNumber] = type;
      selectedRooms.add(roomNumber);
    }
  });
  draft.groupCompRooms = nextCompRooms;
  draft.selectedRooms = [...selectedRooms].sort(
    (left, right) => Number(left) - Number(right)
  );
  syncGroupCompRoomsWithSelectedRooms(draft);
  return suggestion;
}

function getAvailabilityScope(reservation, mode = ui.roomAvailabilityMode) {
  const today = getTodayInputDate();
  const todayEnd = addDaysToInputDate(today, 1);

  if (mode === "today") {
    return {
      mode: "today",
      startDate: today,
      endDate: todayEnd,
      fallback: false,
      summaryLabel: `hoy ${formatDisplayDate(today)}`,
      headline: `Hoy ${formatDisplayDate(today)}`,
      description: `Se muestran las habitaciones realmente tomadas hoy (${formatDisplayDate(
        today
      )}).`,
    };
  }

  const checkInDate = normalizeInputDate(reservation && reservation.checkInDate);
  const checkOutDate = normalizeInputDate(reservation && reservation.checkOutDate);
  if (hasValidStayDates(checkInDate, checkOutDate)) {
    const nights = getNightCountBetween(checkInDate, checkOutDate) || 1;
    return {
      mode: "request",
      startDate: checkInDate,
      endDate: checkOutDate,
      fallback: false,
      summaryLabel: `la estadía ${formatStayRange(checkInDate, checkOutDate)}`,
      headline: formatStayRange(checkInDate, checkOutDate),
      description: `Bloqueo para la estadía solicitada (${formatNightsLabel(nights)}).`,
    };
  }

  return {
    mode: "request",
    startDate: today,
    endDate: todayEnd,
    fallback: true,
    summaryLabel: `hoy ${formatDisplayDate(today)}`,
    headline: "Fechas a revisar",
    description: `Completa ingreso y egreso para ver la ocupación real de esa estadía. Mientras tanto se muestra hoy ${formatDisplayDate(
      today
    )}.`,
  };
}

function summarizeOccupiedRoomsForScope(roomNumbers, scope) {
  const label =
    scope && scope.summaryLabel ? scope.summaryLabel : `hoy ${formatDisplayDate(getTodayInputDate())}`;
  if (!roomNumbers.length) {
    return `No hay habitaciones tomadas para ${label}.`;
  }
  if (roomNumbers.length <= 8) {
    return `No disponibles para ${label}: ${roomNumbers.join(", ")}.`;
  }
  return `No disponibles para ${label}: ${roomNumbers
    .slice(0, 8)
    .join(", ")} y ${roomNumbers.length - 8} más.`;
}

function buildReservationTitle(reservation) {
  const label = getReservationDisplayResponsibleName(reservation);
  const room = reservation && reservation.roomNumber ? `Hab. ${reservation.roomNumber}` : "Reserva nueva";
  return label && label !== "Responsable sin cargar" ? `${room} \u00b7 ${label}` : room;
}

function getReservationsSorted() {
  const query = ui.historyQuery.trim().toLowerCase();
  const today = getTodayInputDate();

  function getCheckInSortDate(reservation) {
    return normalizeInputDate(reservation && reservation.checkInDate) || "9999-12-31";
  }

  function getHistoryTimeBucket(reservation) {
    const checkInDate = getCheckInSortDate(reservation);
    if (checkInDate === today) return 0;
    if (checkInDate > today) return 1;
    return 2;
  }

  return [...getVisibleReservations()]
    .filter((reservation) => {
      if (!query) return true;
      const titular = getTitular(reservation);
      const haystack = [
        reservation.roomNumber,
        reservation.groupCompany,
        titular.firstName,
        titular.lastName,
        titular.document,
        getReservationTravelOrigin(reservation),
        reservation.notes,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    })
    .sort((left, right) => {
      if (left.archived !== right.archived) {
        return left.archived ? 1 : -1;
      }

      const leftBucket = getHistoryTimeBucket(left);
      const rightBucket = getHistoryTimeBucket(right);
      if (leftBucket !== rightBucket) {
        return leftBucket - rightBucket;
      }

      const leftCheckIn = getCheckInSortDate(left);
      const rightCheckIn = getCheckInSortDate(right);
      if (leftBucket <= 1) {
        if (leftCheckIn !== rightCheckIn) {
          return leftCheckIn.localeCompare(rightCheckIn);
        }
      } else if (leftCheckIn !== rightCheckIn) {
        return rightCheckIn.localeCompare(leftCheckIn);
      }

      return new Date(right.updatedAt) - new Date(left.updatedAt);
    });
}

function isReservationReadyForCheckinHistory(reservation) {
  if (!reservation || reservation.archived || !isReservationIngressRegistered(reservation)) {
    return false;
  }

  if (!shouldShowReservationFinancialFields(reservation)) {
    return true;
  }

  return getStayPaymentStatus(reservation).className === "is-green";
}

function isReservationVisibleInCompletedCheckinHistory(
  reservation,
  referenceDate = getTodayInputDate()
) {
  if (!isReservationReadyForCheckinHistory(reservation)) {
    return false;
  }

  const today = normalizeInputDate(referenceDate) || getTodayInputDate();
  const checkOutDate = normalizeInputDate(reservation.checkOutDate);
  return !checkOutDate || today <= checkOutDate;
}

function getReadyReservationsCount() {
  return getVisibleReservations().filter(
    (reservation) => !reservation.archived && Boolean(reservation.confirmedAt)
  ).length;
}

function getArchivedReservationsCount() {
  return getVisibleReservations().filter((reservation) => reservation.archived).length;
}

function getOpenVisibleReservationsCount() {
  return getVisibleReservations().filter((reservation) => !reservation.archived).length;
}

function getOccupiedRoomNumbersForDate(date = getTodayInputDate()) {
  const targetDate = normalizeInputDate(date);
  if (!targetDate) return [];
  return Array.from(
    new Set(
      state.reservations
        .filter(
          (reservation) =>
            !reservation.archived &&
            reservation.roomNumber &&
            reservationOccupiesDate(reservation, targetDate)
        )
        .map((reservation) => sanitizeRoomNumber(reservation.roomNumber))
        .filter(Boolean)
    )
  );
}

function getTodayOccupiedRoomNumbers() {
  return getOccupiedRoomNumbersForDate(getTodayInputDate());
}

function getRoomMaintenanceCount() {
  return ROOM_OPTIONS.filter((roomNumber) => isRoomUnderMaintenance(roomNumber)).length;
}

function getMealGuestCount(reservation) {
  const filledGuests = getFilledGuestCount(reservation);
  return Math.max(filledGuests, getReservationGuestCount(reservation));
}

function getMealCoverageSummary(date = getTodayInputDate()) {
  const targetDate = normalizeInputDate(date);
  return state.reservations.reduce(
    (summary, reservation) => {
      if (
        reservation.archived ||
        !reservation.confirmedAt ||
        !reservationOccupiesDate(reservation, targetDate)
      ) {
        return summary;
      }

      const guestCount = getMealGuestCount(reservation);
      const regime = sanitizeRegime(reservation.regime);
      if (regime === "Pensi\u00f3n Completa") {
        summary.lunch += guestCount;
        summary.dinner += guestCount;
      } else if (regime === "Media Pensi\u00f3n") {
        summary.dinner += guestCount;
      }

      return summary;
    },
    { lunch: 0, dinner: 0, date: targetDate }
  );
}

function syncReservationStayDates(reservation, changedField) {
  if (!reservation) return;

  const checkInDate =
    reservation.walkInToday === true
      ? getTodayInputDate()
      : normalizeInputDate(reservation.checkInDate) || getTodayInputDate();
  reservation.checkInDate = checkInDate;

  if (changedField === "checkOutDate") {
    const nextCheckOutDate = hasValidStayDates(checkInDate, reservation.checkOutDate)
      ? normalizeInputDate(reservation.checkOutDate)
      : getMinimumCheckOutDate(checkInDate);
    reservation.checkOutDate = nextCheckOutDate;
    reservation.nights = String(getNightCountBetween(checkInDate, nextCheckOutDate) || 1);
    return;
  }

  const nextNightCount = sanitizeIntegerInput(reservation.nights) || "1";
  reservation.nights = nextNightCount;
  reservation.checkOutDate = buildCheckOutDate(checkInDate, nextNightCount);
}

function closeReservationWorkspace(options = {}) {
  const { preserveScroll = true } = options;
  ui.isReservationWorkspaceOpen = false;
  ui.isPrivateReservationModalOpen = false;
  resetScannerUi();
  closeTariffModal();
  closeReservationConfirmModal();
  render({ preserveScroll });
}

function closePrivateReservationModal(options = {}) {
  const { preserveScroll = true } = options;
  ui.isPrivateReservationModalOpen = false;
  resetScannerUi();
  closeReservationConfirmModal();
  closeRoomPickerModal();
  render({ preserveScroll });
}

function openPrivateReservationModal(reservationId = state.activeReservationId) {
  const reservation = state.reservations.find(
    (item) => item.id === reservationId && item.archived !== true
  );
  if (!reservation) return false;
  const primaryGuest = ensureReservationHasGuest(reservation);
  state.activeReservationId = reservation.id;
  ui.activeGuestId = primaryGuest.id;
  ui.isPrivateReservationModalOpen = true;
  ui.isReservationWorkspaceOpen = false;
  ui.roomAvailabilityMode = "request";
  ui.showMaintenanceEditor = false;
  resetScannerUi();
  closeTariffModal();
  closeReservationConfirmModal();
  persistState();
  return true;
}

function setActiveReservation(reservationId) {
  const reservation = state.reservations.find(
    (item) => item.id === reservationId && item.archived !== true
  );
  if (!reservation) return;
  if (isReservationsMode()) {
    openPrivateReservationModal(reservation.id);
    render({ preserveScroll: true, focusId: "responsible-firstName", focusModal: true });
    return;
  }
  const shouldStartAtResponsible =
    isCheckinMode() && needsHistoryLegajoBadge(reservation);
  const primaryGuest = ensureReservationHasGuest(reservation);
  state.activeReservationId = reservation.id;
  ui.activeGuestId = primaryGuest.id;
  ui.isReservationWorkspaceOpen = true;
  ui.roomAvailabilityMode = "request";
  ui.showMaintenanceEditor = false;
  resetScannerUi();
  closeTariffModal();
  closeReservationConfirmModal();
  persistState();
  render({
    focusId: shouldStartAtResponsible ? "responsible-firstName" : null,
    scrollToId: shouldStartAtResponsible ? "responsible-panel" : null,
  });
  if (!shouldStartAtResponsible) {
    scrollToReservationPanel();
  }
}

function createNewReservation(options = {}) {
  const shortcutRoomNumber = sanitizeRoomNumber(options.roomNumber);
  const shortcutCheckInDate = normalizeInputDate(options.checkInDate);
  const existingPlaceholder =
    state.reservations.find((reservation) => isReservationPlaceholder(reservation)) || null;
  const reservation = existingPlaceholder || createEmptyReservation();
  if (!existingPlaceholder) {
    state.reservations.unshift(reservation);
  }
  if (shortcutCheckInDate) {
    reservation.checkInDate = shortcutCheckInDate;
    reservation.nights = sanitizeIntegerInput(reservation.nights) || "1";
    syncReservationStayDates(reservation, "checkInDate");
    touchReservation(reservation);
  }
  if (options.walkInToday === true) {
    reservation.walkInToday = true;
    reservation.checkInDate = getTodayInputDate();
    reservation.nights = sanitizeIntegerInput(reservation.nights) || "1";
    syncReservationStayDates(reservation, "checkInDate");
    touchReservation(reservation);
  }
  if (shortcutRoomNumber) {
    reservation.roomNumber = shortcutRoomNumber;
    syncReservationRoomFlags(reservation);
    touchReservation(reservation);
  }
  const primaryGuest = ensureReservationHasGuest(reservation);
  state.activeReservationId = reservation.id;
  ui.activeGuestId = primaryGuest.id;
  ui.isPrivateReservationModalOpen = isReservationsMode();
  ui.isReservationWorkspaceOpen = !isReservationsMode();
  ui.roomAvailabilityMode = "request";
  ui.showMaintenanceEditor = false;
  ui.pendingRoomShortcutNumber = "";
  ui.pendingRoomShortcutDate = "";
  resetScannerUi();
  closeTariffModal();
  closeReservationConfirmModal();
  persistState();
  render({
    preserveScroll: isReservationsMode(),
    focusId: isReservationsMode() ? "responsible-firstName" : null,
    focusModal: isReservationsMode(),
    scrollToId: !isReservationsMode() ? "reservation-active-panel" : null,
  });
  showSuccessToast(
    shortcutRoomNumber
      ? `Se abri\u00f3 una nueva reserva para la habitaci\u00f3n ${shortcutRoomNumber}.`
      : "Se abri\u00f3 una nueva reserva."
  );
}

function openRoomShortcutModal(roomNumber) {
  const normalizedRoomNumber = sanitizeRoomNumber(roomNumber);
  if (!normalizedRoomNumber) return;
  ui.pendingRoomShortcutNumber = normalizedRoomNumber;
  ui.pendingRoomShortcutDate = "";
  render({ preserveScroll: true });
}

function openTimelineRoomShortcutModal(roomNumber, checkInDate) {
  const normalizedRoomNumber = sanitizeRoomNumber(roomNumber);
  const normalizedCheckInDate = normalizeInputDate(checkInDate);
  if (!normalizedRoomNumber || !normalizedCheckInDate || normalizedCheckInDate < getTodayInputDate()) {
    return;
  }
  ui.pendingRoomShortcutNumber = normalizedRoomNumber;
  ui.pendingRoomShortcutDate = normalizedCheckInDate;
  render({ preserveScroll: true });
}

function closeRoomShortcutModal() {
  ui.pendingRoomShortcutNumber = "";
  ui.pendingRoomShortcutDate = "";
  render({ preserveScroll: true });
}

function confirmRoomShortcutReservation() {
  const roomNumber = ui.pendingRoomShortcutNumber;
  const checkInDate = ui.pendingRoomShortcutDate;
  ui.pendingRoomShortcutNumber = "";
  ui.pendingRoomShortcutDate = "";
  createNewReservation({ roomNumber, checkInDate });
}

function distributeGroupGuestsAcrossRooms(roomNumbers, totalGuests) {
  const orderedRooms = [...roomNumbers].sort((left, right) => {
    const leftProfile = getRoomProfile(left);
    const rightProfile = getRoomProfile(right);
    return (
      (Number(rightProfile && rightProfile.baseCapacity) || 0) -
        (Number(leftProfile && leftProfile.baseCapacity) || 0) ||
      Number(left) - Number(right)
    );
  });
  const assignments = orderedRooms.map((roomNumber) => ({
    roomNumber,
    guestCount: 0,
    allowExtraBed: false,
  }));

  let remainingGuests = Number(totalGuests) || 0;
  assignments.forEach((assignment, index) => {
    const roomProfile = getRoomProfile(assignment.roomNumber);
    const remainingRooms = assignments.length - index - 1;
    const minimumForRest = remainingGuests > 0 ? remainingRooms : 0;
    const baseCapacity = Number(roomProfile && roomProfile.baseCapacity) || 1;
    const assignable = Math.max(1, Math.min(baseCapacity, remainingGuests - minimumForRest));
    assignment.guestCount = remainingGuests > 0 ? assignable : 1;
    remainingGuests -= assignment.guestCount;
  });

  if (remainingGuests > 0) {
    assignments.forEach((assignment) => {
      if (remainingGuests <= 0) {
        return;
      }
      const roomProfile = getRoomProfile(assignment.roomNumber);
      if (!roomProfile || assignment.guestCount >= roomProfile.maxCapacity) {
        return;
      }
      assignment.guestCount += 1;
      assignment.allowExtraBed = assignment.guestCount > roomProfile.baseCapacity;
      remainingGuests -= 1;
    });
  }

  assignments.forEach((assignment) => {
    const roomProfile = getRoomProfile(assignment.roomNumber);
    assignment.allowExtraBed = Boolean(
      roomProfile && assignment.guestCount > roomProfile.baseCapacity
    );
  });

  return assignments.sort((left, right) => Number(left.roomNumber) - Number(right.roomNumber));
}

function buildGroupReservationDrafts(draft) {
  const summary = getGroupSelectionCapacitySummary(draft);
  if (!summary.guestCount) {
    return { error: "Indica cu\u00e1ntas personas tarifadas tendr\u00e1 el grupo." };
  }
  if (!sanitizeGroupCompany(draft.company)) {
    return { error: "Falta el nombre de la empresa o grupo." };
  }
  if (!sanitizeRegime(draft.regime)) {
    return { error: "Eleg\u00ed el r\u00e9gimen general del grupo antes de crear la reserva grupal." };
  }
  if (
    !draft.checkInDate ||
    !draft.checkOutDate ||
    !hasValidStayDates(draft.checkInDate, draft.checkOutDate)
  ) {
    return { error: "Revisa ingreso y egreso del grupo." };
  }
  if (!summary.roomCount) {
    return { error: "Elige al menos una habitaci\u00f3n para el grupo." };
  }
  if (summary.hasTooManyRooms) {
    return { error: "Hay m\u00e1s habitaciones tarifadas que personas tarifadas en la reserva grupal." };
  }
  if (!summary.fitsMax) {
    return {
      error:
        "La selecci\u00f3n actual no alcanza la capacidad necesaria ni siquiera usando cama extra.",
    };
  }

  const unavailableRoom = summary.descriptors.find((descriptor) => !descriptor.selectable);
  if (unavailableRoom) {
    return {
      error: `La habitaci\u00f3n ${unavailableRoom.roomNumber} ya no est\u00e1 disponible para esas fechas.`,
    };
  }

  const assignments = [
    ...distributeGroupGuestsAcrossRooms(
      summary.billableDescriptors.map((descriptor) => descriptor.roomNumber),
      summary.guestCount
    ),
    ...summary.complimentaryDescriptors.map((descriptor) => ({
      roomNumber: descriptor.roomNumber,
      guestCount: 1,
      allowExtraBed: false,
      compRoomType: descriptor.compRoomType,
    })),
  ].sort((left, right) => Number(left.roomNumber) - Number(right.roomNumber));
  const quote = getGroupQuoteSummary(draft, summary);
  const groupId = safeText(draft.editingGroupId) || uid("group");
  const groupCompany = sanitizeGroupCompany(draft.company);
  const groupMemory = getGroupMemoryEntry(groupCompany);
  const travelOrigin = sanitizeTravelOrigin(draft.travelOrigin);
  const groupInitial = sanitizeGroupInitial(draft.groupInitial, groupCompany);
  const confirmedAt = nowIso();
  const roomCount = assignments.length;
  const reservations = assignments.map((assignment, index) => {
    const quoteLine = quote.lines.find((line) => line.roomNumber === assignment.roomNumber);
    const reservation = createEmptyReservation();
    reservation.checkInDate = draft.checkInDate;
    reservation.checkOutDate = draft.checkOutDate;
    reservation.nights = String(getNightCountBetween(draft.checkInDate, draft.checkOutDate) || 1);
    reservation.roomNumber = assignment.roomNumber;
    reservation.regime = sanitizeRegime(draft.regime);
    reservation.travelOrigin = travelOrigin;
    reservation.origin = travelOrigin;
    reservation.destination = travelOrigin;
    reservation.groupId = groupId;
    reservation.groupCompany = groupCompany;
    reservation.groupColor = sanitizeGroupColor(draft.groupColor, groupCompany);
    reservation.groupInitial = groupInitial;
    reservation.groupCompRoomType = sanitizeGroupCompRoomType(assignment.compRoomType);
    const compMeta = getGroupCompRoomMeta(reservation.groupCompRoomType);
    reservation.groupCompRoomLabel = compMeta ? compMeta.label : "";
    reservation.groupCompMaxGuests = compMeta ? String(compMeta.maxGuests) : "";
    reservation.groupTotalGuests = String(summary.guestCount);
    reservation.groupRoomIndex = index + 1;
    reservation.groupRoomCount = roomCount;
    reservation.groupAgreedTariffs = { ...quote.tariffs };
    reservation.groupAgreedPassengerRate = quote.passengerRate
      ? String(Math.round(quote.passengerRate))
      : "";
    reservation.groupAgreedPricingMode = quote.pricingMode || "";
    reservation.groupAgreedTotal =
      quote.total === null || Number.isNaN(quote.total) ? "" : String(Math.round(quote.total));
    reservation.groupRoomSubtotal = quoteLine ? String(Math.round(quoteLine.subtotal)) : "";
    reservation.total = reservation.groupRoomSubtotal;
    reservation.allowExtraBed = assignment.allowExtraBed;
    reservation.confirmedAt = confirmedAt;
    reservation.guests = Array.from({ length: assignment.guestCount }, (_, guestIndex) =>
      createEmptyGuest(guestIndex === 0)
    );
    applyGroupMemoryPeopleToReservation(
      reservation,
      groupMemory,
      reservation.groupCompRoomType
    );
    return normalizeReservation(reservation);
  });

  return {
    reservations,
    summary,
  };
}

function resizeGuestsForGroupAssignment(existingGuests, targetGuestCount) {
  const normalizedGuests = Array.isArray(existingGuests)
    ? existingGuests.map((guest, index) => normalizeGuest(guest, index === 0))
    : [];
  const targetCount = Math.max(1, Number(targetGuestCount) || 1);
  const resizedGuests = normalizedGuests.slice(0, targetCount);
  while (resizedGuests.length < targetCount) {
    resizedGuests.push(createEmptyGuest(resizedGuests.length === 0));
  }
  resizedGuests[0].role = "principal";
  return resizedGuests.map((guest, index) => ({
    ...guest,
    role: index === 0 ? "principal" : "huesped",
  }));
}

function hasGroupReservationDataToProtect(reservation) {
  if (!reservation) {
    return false;
  }
  const responsible = getTitular(reservation);
  return Boolean(
    responsible.firstName ||
      responsible.lastName ||
      responsible.document ||
      reservation.phone ||
      reservation.email ||
      getReservationTravelOrigin(reservation) ||
      reservation.licensePlate ||
      reservation.total ||
      reservation.cash ||
      reservation.transfer ||
      reservation.notes ||
      reservation.discountNote ||
      reservation.guests.some((guest) => hasGuestData(guest))
  );
}

function mergeExistingGroupReservation(existingReservation, nextReservation) {
  const targetGuestCount = nextReservation.groupCompRoomType
    ? Math.max(1, existingReservation.guests.length, nextReservation.guests.length)
    : Math.max(1, nextReservation.guests.length);
  return normalizeReservation({
    ...nextReservation,
    id: existingReservation.id,
    createdAt: existingReservation.createdAt,
    updatedAt: nowIso(),
    archived: false,
    licensePlate: existingReservation.licensePlate,
    travelOrigin: getReservationTravelOrigin(nextReservation),
    origin: getReservationTravelOrigin(nextReservation),
    destination: getReservationTravelOrigin(nextReservation),
    total: nextReservation.total,
    cash: existingReservation.cash,
    transfer: existingReservation.transfer,
    pending: existingReservation.pending,
    email: existingReservation.email,
    phone: existingReservation.phone,
    notes: existingReservation.notes,
    discountNote: existingReservation.discountNote,
    reservationColor: existingReservation.reservationColor,
    confirmedAt: existingReservation.confirmedAt || nextReservation.confirmedAt,
    responsible: existingReservation.responsible,
    guests: resizeGuestsForGroupAssignment(existingReservation.guests, targetGuestCount),
    lastScanAt: existingReservation.lastScanAt,
    lastExportedAt: existingReservation.lastExportedAt,
    lastPrintedAt: existingReservation.lastPrintedAt,
    regime: sanitizeRegime(nextReservation.regime),
  });
}

function getGroupEditProtectionWarning(existingReservations, nextReservations) {
  const nextRooms = new Set(
    nextReservations.map((reservation) => sanitizeRoomNumber(reservation.roomNumber)).filter(Boolean)
  );
  const nextReservationByRoom = new Map(
    nextReservations.map((reservation) => [sanitizeRoomNumber(reservation.roomNumber), reservation])
  );
  const removedRooms = existingReservations
    .filter(
      (reservation) =>
        !nextRooms.has(sanitizeRoomNumber(reservation.roomNumber)) &&
        hasGroupReservationDataToProtect(reservation)
    )
    .map((reservation) => reservation.roomNumber);
  const reducedRooms = existingReservations
    .filter((reservation) => {
      const roomNumber = sanitizeRoomNumber(reservation.roomNumber);
      const nextReservation = nextReservationByRoom.get(roomNumber);
      if (
        !nextReservation ||
        nextReservation.groupCompRoomType ||
        reservation.guests.length <= nextReservation.guests.length
      ) {
        return false;
      }
      return reservation.guests.slice(nextReservation.guests.length).some((guest) => hasGuestData(guest));
    })
    .map((reservation) => reservation.roomNumber);

  const warnings = [];
  if (removedRooms.length) {
    warnings.push(`se quitarán las habitaciones ${removedRooms.join(", ")} con datos cargados`);
  }
  if (reducedRooms.length) {
    warnings.push(`se reducirá la cantidad de huéspedes en las habitaciones ${reducedRooms.join(", ")}`);
  }
  if (!warnings.length) {
    return "";
  }
  return `Vas a editar el grupo y ${warnings.join("; ")}. Esta información puede perderse. ¿Confirmas guardar igual?`;
}

function createGroupReservationsFromDraft() {
  const draft = getGroupDraft();
  const built = buildGroupReservationDrafts(draft);
  if (built.error) {
    window.alert(built.error);
    return false;
  }

  if (draft.editingGroupId) {
    const existingGroupReservations = getActiveGroupReservations(draft.editingGroupId);
    const protectionWarning = getGroupEditProtectionWarning(
      existingGroupReservations,
      built.reservations
    );
    if (protectionWarning && !window.confirm(protectionWarning)) {
      return false;
    }

    const existingByRoom = new Map(
      existingGroupReservations.map((reservation) => [
        sanitizeRoomNumber(reservation.roomNumber),
        reservation,
      ])
    );
    const nextReservations = built.reservations.map((reservation) => {
      const existingReservation = existingByRoom.get(sanitizeRoomNumber(reservation.roomNumber));
      return existingReservation
        ? mergeExistingGroupReservation(existingReservation, reservation)
        : reservation;
    });

    state.reservations = [
      ...nextReservations,
      ...state.reservations.filter(
        (reservation) =>
          reservation.archived === true || safeText(reservation.groupId) !== draft.editingGroupId
      ),
    ];
    state.activeReservationId = nextReservations[0].id;
    ui.activeGuestId = nextReservations[0].guests[0].id;
    ui.isReservationWorkspaceOpen = false;
    ui.roomAvailabilityMode = "today";
    ui.showMaintenanceEditor = false;
    closeGroupLoadModal();
    resetScannerUi();
    persistState({
      toast: `Se actualizó el grupo ${sanitizeGroupCompany(draft.company)} con ${nextReservations.length} habitación${
        nextReservations.length === 1 ? "" : "es"
      }.`,
    });
    return true;
  }

  const existingPlaceholderIndex = state.reservations.findIndex((reservation) =>
    isReservationPlaceholder(reservation)
  );
  if (existingPlaceholderIndex >= 0) {
    state.reservations.splice(existingPlaceholderIndex, 1);
  }

  built.reservations
    .slice()
    .reverse()
    .forEach((reservation) => {
      state.reservations.unshift(reservation);
    });

  state.activeReservationId = built.reservations[0].id;
  ui.activeGuestId = built.reservations[0].guests[0].id;
  ui.isReservationWorkspaceOpen = false;
  ui.roomAvailabilityMode = "today";
  ui.showMaintenanceEditor = false;
  closeGroupLoadModal();
  resetScannerUi();
  persistState({
    toast: `Se carg\u00f3 el grupo ${sanitizeGroupCompany(draft.company)} con ${built.reservations.length} habitaci\u00f3n${
      built.reservations.length === 1 ? "" : "es"
    }.`,
  });
  return true;
}

function duplicateReservation(reservationId = state.activeReservationId) {
  const original = state.reservations.find((reservation) => reservation.id === reservationId);
  if (!original) return;

  const duplicated = normalizeReservation({
    ...JSON.parse(JSON.stringify(original)),
    id: uid("reservation"),
    createdAt: nowIso(),
    updatedAt: nowIso(),
    archived: false,
    confirmedAt: null,
    lastExportedAt: null,
    lastPrintedAt: null,
    guests: original.guests.map((guest, index) => ({
      ...guest,
      id: uid("guest"),
      role: index === 0 ? "principal" : "huesped",
    })),
  });

  state.reservations.unshift(duplicated);
  state.activeReservationId = duplicated.id;
  ui.activeGuestId = duplicated.guests[0].id;
  resetScannerUi();
  persistState({
    toast: "Se duplic\u00f3 la reserva para seguir trabajando sobre una copia.",
  });
  render({ preserveScroll: true });
}

function archiveActiveReservation() {
  const reservation = getActiveReservation();
  if (!reservation) return;
  const title = buildReservationTitle(reservation);
  if (!window.confirm(`\u00bfArchivar ${title}?`)) {
    return;
  }

  reservation.archived = true;
  touchReservation(reservation);

  const nextOpenReservation = state.reservations.find(
    (item) => item.id !== reservation.id && item.archived !== true
  );

  if (nextOpenReservation) {
    state.activeReservationId = nextOpenReservation.id;
    ui.activeGuestId = nextOpenReservation.guests[0].id;
  } else {
    const replacement = createEmptyReservation();
    state.reservations.unshift(replacement);
    state.activeReservationId = replacement.id;
    ui.activeGuestId = replacement.guests[0].id;
  }

  ui.isReservationWorkspaceOpen = false;
  ui.isPrivateReservationModalOpen = false;
  resetScannerUi();
  persistState({
    toast: "La reserva qued\u00f3 archivada en el historial.",
  });
  render({ preserveScroll: true });
}

function deleteReservation(reservationId) {
  const reservation = state.reservations.find((item) => item.id === reservationId);
  if (!reservation) return;
  const deletedActiveReservation = reservation.id === state.activeReservationId;

  const title = buildReservationTitle(reservation);
  const firstWarning = reservation.archived
    ? `\u00bfEliminar definitivamente ${title} del historial local?`
    : reservation.confirmedAt
      ? `Vas a borrar una reserva confirmada: ${title}. Esta acci\u00f3n no se puede deshacer.`
      : `Vas a borrar la reserva ${title}. Esta acci\u00f3n no se puede deshacer.`;
  if (!window.confirm(firstWarning)) {
    return;
  }

  const secondWarning = reservation.archived
    ? `\u00bfConfirmas eliminar para siempre ${title}?`
    : `\u00bfConfirmas borrar definitivamente ${title}?`;
  if (!window.confirm(secondWarning)) {
    return;
  }

  state.reservations = state.reservations.filter((item) => item.id !== reservationId);
  if (!state.reservations.length) {
    const replacement = createEmptyReservation();
    state.reservations = [replacement];
    state.activeReservationId = replacement.id;
    ui.activeGuestId = replacement.guests[0].id;
  } else {
    ensureActiveReservation();
    ensureActiveGuest();
  }
  if (deletedActiveReservation) {
    ui.isReservationWorkspaceOpen = false;
    ui.isPrivateReservationModalOpen = false;
    resetScannerUi();
    closeTariffModal();
    closeReservationConfirmModal();
  }
  persistState({
    toast: reservation.archived
      ? "La reserva archivada se eliminó del historial local."
      : "La reserva se eliminó definitivamente.",
  });
  render({ preserveScroll: true });
}

function deleteGroupReservation(groupId) {
  const normalizedGroupId = safeText(groupId);
  const groupReservations = getActiveGroupReservations(normalizedGroupId);
  if (!groupReservations.length) {
    window.alert("No encontr\u00e9 habitaciones activas para esa reserva grupal.");
    return;
  }

  const firstReservation = groupReservations[0];
  const company = getReservationCompanyLabel(firstReservation) || "este grupo";
  const roomList = groupReservations
    .map((reservation) => sanitizeRoomNumber(reservation.roomNumber))
    .filter(Boolean)
    .join(", ");
  const title = `reserva grupal ${company}`;
  const firstWarning = `Vas a borrar la ${title} con ${groupReservations.length} habitaci\u00f3n${
    groupReservations.length === 1 ? "" : "es"
  }${roomList ? `: ${roomList}` : ""}. Esta acci\u00f3n no se puede deshacer.`;
  if (!window.confirm(firstWarning)) {
    return;
  }

  if (!window.confirm(`\u00bfConfirmas borrar definitivamente la ${title}?`)) {
    return;
  }

  const deletedIds = new Set(groupReservations.map((reservation) => reservation.id));
  const deletedActiveReservation = deletedIds.has(state.activeReservationId);
  state.reservations = state.reservations.filter(
    (reservation) => !deletedIds.has(reservation.id)
  );

  if (!state.reservations.length) {
    const replacement = createEmptyReservation();
    state.reservations = [replacement];
    state.activeReservationId = replacement.id;
    ui.activeGuestId = replacement.guests[0].id;
  } else if (deletedActiveReservation) {
    const nextOpenReservation =
      state.reservations.find((reservation) => reservation.archived !== true) ||
      state.reservations[0];
    state.activeReservationId = nextOpenReservation.id;
    ui.activeGuestId = nextOpenReservation.guests[0] ? nextOpenReservation.guests[0].id : null;
  } else {
    ensureActiveReservation();
    ensureActiveGuest();
  }

  ui.isReservationWorkspaceOpen = false;
  closeGroupLoadModal();
  closeGroupPickerModal();
  resetScannerUi();
  closeTariffModal();
  closeReservationConfirmModal();
  persistState({
    toast: `Se elimin\u00f3 la reserva grupal ${company}.`,
  });
  render({ preserveScroll: true });
}

function updateReservationField(field, value) {
  const reservation = getActiveReservation();
  if (!reservation) return;
  if (
    isGroupReservation(reservation) &&
    ["checkInDate", "checkOutDate", "nights", "regime", "total"].includes(field)
  ) {
    return;
  }

  if (field === "roomNumber") {
    reservation[field] = sanitizeRoomNumber(value, reservation[field]);
    syncReservationRoomFlags(reservation);
  } else if (field === "checkInDate") {
    reservation[field] =
      reservation.walkInToday === true ? getTodayInputDate() : normalizeInputDate(value);
    syncReservationStayDates(reservation, "checkInDate");
  } else if (field === "checkOutDate") {
    reservation[field] = normalizeInputDate(value);
    syncReservationStayDates(reservation, "checkOutDate");
  } else if (field === "nights") {
    reservation[field] = sanitizeIntegerInput(value) || "";
    syncReservationStayDates(reservation, "nights");
  } else if (field === "guestCount") {
    const nextGuestCount = Math.max(1, Number(sanitizeIntegerInput(value)) || 1);
    reservation.guests = resizeGuestsForGroupAssignment(reservation.guests, nextGuestCount);
    if (!reservation.guests.some((guest) => guest.id === ui.activeGuestId)) {
      ui.activeGuestId = reservation.guests[0].id;
    }
    const roomProfile = getRoomProfile(reservation.roomNumber);
    if (roomProfile && nextGuestCount <= roomProfile.baseCapacity) {
      reservation.allowExtraBed = false;
    }
  } else if (field === "regime") {
    reservation[field] = sanitizeRegime(value);
  } else if (field === "notes") {
    reservation[field] = sanitizeReservationNotes(value, { trim: false });
  } else if (field === "travelOrigin") {
    const travelOrigin = sanitizeTravelOrigin(value, { trim: false });
    reservation.travelOrigin = travelOrigin;
    reservation.origin = travelOrigin;
    reservation.destination = travelOrigin;
  } else if (field === "reservationColor") {
    reservation[field] = sanitizeReservationColor(value, getReservationColorSeed(reservation));
  } else if (field === "depositPaymentMethod") {
    reservation.depositPaymentMethod = sanitizeDepositPaymentMethod(value);
    if (reservation.depositPaymentMethod === "deferred") {
      reservation.depositAmount = "";
    }
    reservation.depositRecordedAt = null;
  } else if (field === "depositDeferredReason") {
    reservation.depositDeferredReason = sanitizeReservationNotes(value, { trim: false });
    reservation.depositRecordedAt = null;
  } else if (["total", "cash", "transfer", "pending", "depositAmount"].includes(field)) {
    reservation[field] = sanitizeMoneyInput(value);
    if (field === "depositAmount") {
      reservation.depositRecordedAt = null;
    }
    if (field !== "pending") {
      syncReservationPaymentFields(reservation);
    }
  } else {
    reservation[field] = value;
  }

  touchReservation(reservation);
  persistState();
}

function updateResponsibleField(field, value) {
  const reservation = getActiveReservation();
  if (!reservation) return;

  if (!reservation.responsible || typeof reservation.responsible !== "object") {
    reservation.responsible = createEmptyResponsible();
  }

  if (field === "document") {
    reservation.responsible[field] = normalizeDocument(value);
  } else if (field === "gender") {
    reservation.responsible[field] = normalizeGender(value);
  } else if (field === "nationality") {
    reservation.responsible[field] = value || DEFAULT_NATIONALITY;
  } else {
    reservation.responsible[field] = value;
  }

  touchReservation(reservation);
  persistState();
}

function toggleExtraBedForActiveReservation() {
  const reservation = getActiveReservation();
  const roomProfile = getRoomProfile(reservation.roomNumber);
  if (!roomProfile || !roomProfile.supportsExtraBed) {
    return;
  }

  reservation.allowExtraBed = !reservation.allowExtraBed;
  touchReservation(reservation);
  persistState({
    toast: reservation.allowExtraBed
      ? "Se habilitó la cama extra excepcional para esta reserva."
      : "Se quitó la excepción de cama extra.",
  });
  render({ preserveScroll: true });
}

function toggleRoomMaintenance(roomNumber) {
  const normalizedRoom = sanitizeRoomNumber(roomNumber);
  if (!normalizedRoom) return;
  if (!state.roomMaintenance || typeof state.roomMaintenance !== "object") {
    state.roomMaintenance = {};
  }

  const wasUnderMaintenance = isRoomUnderMaintenance(normalizedRoom);
  if (wasUnderMaintenance) {
    delete state.roomMaintenance[normalizedRoom];
  } else {
    state.roomMaintenance[normalizedRoom] = true;
    state.reservations.forEach((reservation) => {
      if (reservation.archived || reservation.roomNumber !== normalizedRoom) {
        return;
      }
      if (reservation.id === state.activeReservationId) {
        reservation.roomNumber = "";
        reservation.allowExtraBed = false;
        touchReservation(reservation);
      }
    });
  }

  persistState({
    toast: isRoomUnderMaintenance(normalizedRoom)
      ? `La habitación ${normalizedRoom} quedó en mantenimiento y se deshabilitó.`
      : `La habitación ${normalizedRoom} volvió a quedar habilitada.`,
  });
  render({ preserveScroll: true });
}

function updateGuestField(guestId, field, value) {
  const reservation = getActiveReservation();
  const guest = reservation.guests.find((item) => item.id === guestId);
  if (!guest) return;

  if (field === "document") {
    guest[field] = normalizeDocument(value);
  } else if (field === "gender") {
    guest[field] = normalizeGender(value);
  } else if (field === "nationality") {
    guest[field] = value || DEFAULT_NATIONALITY;
  } else if (field === "specialRegime") {
    guest[field] = sanitizeSpecialRegime(value);
  } else {
    guest[field] = value;
  }

  touchReservation(reservation);
  persistState();
}

function copyResponsibleToGuest(guestId) {
  const reservation = getActiveReservation();
  const guest = reservation.guests.find((item) => item.id === guestId);
  if (!guest) return;

  const responsible = getTitular(reservation);
  guest.firstName = safeText(responsible.firstName);
  guest.lastName = safeText(responsible.lastName);
  guest.document = normalizeDocument(responsible.document);
  guest.birthDate = safeText(responsible.birthDate);
  guest.gender = normalizeGender(responsible.gender);
  guest.nationality = safeText(responsible.nationality) || DEFAULT_NATIONALITY;

  touchReservation(reservation);
  persistState({
    toast: "Se copiaron los datos del titular al huésped 1.",
  });
}

function addGuestToActiveReservation() {
  const reservation = getActiveReservation();
  const compMeta = getReservationGroupCompRoomMeta(reservation);
  if (compMeta && reservation.guests.length >= compMeta.maxGuests) {
    window.alert(
      `Esta habitaci\u00f3n sin cargo para ${compMeta.label.toLowerCase()} admite hasta ${compMeta.maxGuests} ocupante${
        compMeta.maxGuests === 1 ? "" : "s"
      }.`
    );
    return;
  }
  if (reservation.guests.length >= MAX_GUESTS) {
    window.alert(`El libro actual est\u00e1 pensado para un m\u00e1ximo de ${MAX_GUESTS} hu\u00e9spedes.`);
    return;
  }
  const guest = createEmptyGuest(false);
  reservation.guests.push(guest);
  touchReservation(reservation);
  ui.activeGuestId = guest.id;
  resetScannerUi();
  persistState({
    toast: "Se agreg\u00f3 un nuevo hu\u00e9sped a la habitaci\u00f3n.",
  });
  render({ preserveScroll: true });
}

function removeGuestFromActiveReservation(guestId) {
  const reservation = getActiveReservation();
  const guest = reservation.guests.find((item) => item.id === guestId);
  if (!guest) return;

  if (guest.role === "principal") {
    window.alert("El hu\u00e9sped 1 no se elimina. Si necesitas empezar de cero, usa Limpiar.");
    return;
  }

  reservation.guests = reservation.guests.filter((item) => item.id !== guestId);
  if (!reservation.guests.length) {
    reservation.guests = [createEmptyGuest(true)];
  }
  reservation.guests[0].role = "principal";
  touchReservation(reservation);
  ui.activeGuestId = reservation.guests[0].id;
  resetScannerUi();
  persistState({
    toast: "Se quit\u00f3 un hu\u00e9sped de la habitaci\u00f3n.",
  });
  render({ preserveScroll: true });
}

function clearGuest(guestId) {
  const reservation = getActiveReservation();
  const index = reservation.guests.findIndex((item) => item.id === guestId);
  if (index === -1) return;
  const isPrimary = reservation.guests[index].role === "principal";
  reservation.guests[index] = createEmptyGuest(isPrimary);
  reservation.guests[index].role = isPrimary ? "principal" : "huesped";
  touchReservation(reservation);
  ui.activeGuestId = reservation.guests[index].id;
  resetScannerUi();
  persistState({
    toast: isPrimary
      ? "Se limpi\u00f3 la ficha del hu\u00e9sped 1."
      : "Se limpi\u00f3 la ficha del hu\u00e9sped.",
  });
  render({ preserveScroll: true });
}

function findNextGuestAfterScan(reservation, currentGuestId) {
  return (
    reservation.guests.find(
      (guest) => guest.id !== currentGuestId && !hasGuestData(guest)
    ) ||
    reservation.guests.find(
      (guest) => guest.id !== currentGuestId && !isGuestComplete(guest)
    ) ||
    reservation.guests.find((guest) => guest.id === currentGuestId) ||
    reservation.guests[0]
  );
}

function applyParsedScannerDataToGuest(guest, result) {
  guest.firstName = result.data.firstName || guest.firstName;
  guest.lastName = result.data.lastName || guest.lastName;
  guest.document = result.data.document || guest.document;
  guest.birthDate = result.data.birthDate || guest.birthDate;
  guest.gender = result.data.gender || guest.gender;
  guest.nationality = result.data.nationality || guest.nationality || DEFAULT_NATIONALITY;
  guest.rawScan = result.rawScan;
  guest.parseMeta = {
    format: result.format,
    confidence: result.confidence,
    warnings: result.warnings,
    parsedAt: nowIso(),
  };
}

function applyParsedScannerDataToResponsible(reservation, result) {
  if (!reservation.responsible || typeof reservation.responsible !== "object") {
    reservation.responsible = createEmptyResponsible();
  }
  const responsible = reservation.responsible;
  responsible.firstName = result.data.firstName || responsible.firstName;
  responsible.lastName = result.data.lastName || responsible.lastName;
  responsible.document = result.data.document || responsible.document;
  responsible.birthDate = result.data.birthDate || responsible.birthDate;
  responsible.gender = result.data.gender || responsible.gender;
  responsible.nationality =
    result.data.nationality || responsible.nationality || DEFAULT_NATIONALITY;
}

function getNextGuestSlotForBulkScan(reservation) {
  const capacityState = getBulkScannerCapacityState(reservation);
  if (capacityState.maxCapacityReached) {
    return null;
  }

  const emptyGuest = reservation.guests.find((guest) => !hasGuestData(guest));
  if (emptyGuest) {
    return emptyGuest;
  }

  if (reservation.guests.length >= capacityState.maxCapacity) {
    return null;
  }

  const guest = createEmptyGuest(false);
  reservation.guests.push(guest);
  reservation.guests[0].role = "principal";
  return guest;
}

function getBulkNextTargetLabel(session = getBulkScannerSession()) {
  if (!session.responsibleLoaded) {
    return "Titular / responsable";
  }

  const reservation = getActiveReservation();
  const capacityState = getBulkScannerCapacityState(reservation);
  if (capacityState.maxCapacityReached) {
    return "Capacidad m\u00e1xima alcanzada";
  }
  const nextEmptyGuestIndex = reservation.guests.findIndex((guest) => !hasGuestData(guest));
  if (nextEmptyGuestIndex >= 0) {
    return getGuestRoleLabel(nextEmptyGuestIndex);
  }
  if (reservation.guests.length < MAX_GUESTS) {
    return getGuestRoleLabel(reservation.guests.length);
  }
  return "Habitaci\u00f3n completa";
}

function buildBulkScannerParseResult(session = getBulkScannerSession(), error = "") {
  return {
    ok: session.assigned.length > 0 && !error,
    bulk: true,
    continuous: true,
    assigned: session.assigned,
    failed: session.failed,
    skipped: session.skipped,
    createdGuestCount: session.createdGuestCount,
    nextTargetLabel: getBulkNextTargetLabel(session),
    responsibleLoaded: session.responsibleLoaded,
    rawScan: session.lastRawScan,
    error,
  };
}

function applyBulkScannerLine(line, lineIndex = 0) {
  const reservation = getActiveReservation();
  const session = getBulkScannerSession();
  const result = parseScannerInput(line);
  session.lastRawScan = line;

  if (!result.ok) {
    session.failed.push({
      line,
      lineIndex,
      error: result.error,
    });
    return false;
  }

  if (!session.responsibleLoaded) {
    const minorError = getResponsibleScannerMinorError(result, reservation);
    if (minorError) {
      session.failed.push({
        line,
        lineIndex,
        error: minorError,
      });
      return false;
    }
    applyParsedScannerDataToResponsible(reservation, result);
    session.responsibleLoaded = true;
    session.assigned.push({
      kind: "responsible",
      label: "Titular / responsable",
      result,
    });
    reservation.lastScanAt = nowIso();
    touchReservation(reservation);
    return true;
  }

  const guest = getNextGuestSlotForBulkScan(reservation);
  if (!guest) {
    const capacityState = getBulkScannerCapacityState(reservation);
    session.skipped.push({
      line,
      lineIndex,
      reason: capacityState.roomNumber
        ? `La habitaci\u00f3n ${capacityState.roomNumber} alcanz\u00f3 su capacidad m\u00e1xima de ${capacityState.maxCapacity} hu\u00e9spedes.`
        : `La reserva lleg\u00f3 al m\u00e1ximo de ${capacityState.maxCapacity} hu\u00e9spedes.`,
    });
    return false;
  }

  const wasNewGuest = !hasGuestData(guest);
  applyParsedScannerDataToGuest(guest, result);
  if (wasNewGuest && reservation.guests.indexOf(guest) > 0) {
    session.createdGuestCount += 1;
  }
  ui.activeGuestId = guest.id;
  ui.scannerTargetGuestId = guest.id;
  session.assigned.push({
    kind: "guest",
    guestId: guest.id,
    label: getGuestRoleLabel(reservation.guests.indexOf(guest)),
    result,
  });
  const capacityState = getBulkScannerCapacityState(reservation);
  reservation.allowExtraBed = Boolean(
    capacityState.roomProfile && capacityState.loadedGuestCount > capacityState.baseCapacity
  );
  reservation.lastScanAt = nowIso();
  touchReservation(reservation);
  return true;
}

function removeBulkScannerAssignment(assignmentIndex) {
  const session = getBulkScannerSession();
  const index = Number(assignmentIndex);
  const assignment = Number.isInteger(index) ? session.assigned[index] : null;
  if (!assignment) return;

  const reservation = getActiveReservation();
  if (assignment.kind === "responsible") {
    reservation.responsible = createEmptyResponsible();
    session.responsibleLoaded = false;
  } else if (assignment.kind === "guest" && assignment.guestId) {
    const guestIndex = reservation.guests.findIndex((guest) => guest.id === assignment.guestId);
    if (guestIndex >= 0) {
      const previousGuest = reservation.guests[guestIndex];
      const clearedGuest = createEmptyGuest(previousGuest.role === "principal");
      clearedGuest.id = previousGuest.id;
      clearedGuest.role = previousGuest.role === "principal" ? "principal" : "huesped";
      reservation.guests[guestIndex] = clearedGuest;
      ui.activeGuestId = clearedGuest.id;
      ui.scannerTargetGuestId = clearedGuest.id;
      session.createdGuestCount = Math.max(0, session.createdGuestCount - 1);
    }
  }

  session.assigned.splice(index, 1);
  const capacityState = getBulkScannerCapacityState(reservation);
  if (capacityState.loadedGuestCount <= capacityState.baseCapacity) {
    reservation.allowExtraBed = false;
  }
  touchReservation(reservation);
  ui.parseResult = buildBulkScannerParseResult(session);
  ui.scannerDraft = "";
  persistState({ toast: "Se quit\u00f3 la ficha cargada. La plaza vuelve a estar disponible." });
  render({ preserveScroll: true, focusId: "scanner-input" });
}

function applyBulkScannerToGuests() {
  const session = getBulkScannerSession();
  const scanLines = splitBulkScannerInput(ui.scannerDraft);
  if (!scanLines.length) {
    if (session.assigned.length) {
      ui.parseResult = buildBulkScannerParseResult(session);
      ui.isScannerModalOpen = true;
      render({ preserveScroll: true, focusId: "scanner-input" });
      return;
    }
    ui.parseResult = buildBulkScannerParseResult(
      session,
      "Escanea o pega al menos un DNI para continuar la carga de esta habitaci\u00f3n."
    );
    ui.isScannerModalOpen = true;
    render({ preserveScroll: true, focusId: "scanner-input" });
    return;
  }

  const previousAssignedCount = session.assigned.length;
  const previousFailedCount = session.failed.length;
  const previousSkippedCount = session.skipped.length;

  scanLines.forEach((line, lineIndex) => {
    applyBulkScannerLine(line, lineIndex);
  });

  const newAssignedCount = session.assigned.length - previousAssignedCount;
  const newIssueCount =
    session.failed.length - previousFailedCount + session.skipped.length - previousSkippedCount;
  ui.parseResult = buildBulkScannerParseResult(
    session,
    newAssignedCount > 0 ? "" : "No se pudo aplicar ninguna lectura. Revisa el texto escaneado."
  );
  ui.scannerDraft = newAssignedCount > 0 ? "" : scanLines.join("\n");
  if (newAssignedCount > 0) {
    persistState({
      toast:
        newAssignedCount === 1
          ? "Se carg\u00f3 1 DNI en la habitaci\u00f3n."
          : `Se cargaron ${newAssignedCount} DNI en la habitaci\u00f3n.`,
    });
  } else if (newIssueCount > 0) {
    persistState();
  }
  ui.isScannerModalOpen = true;
  render({ preserveScroll: true, focusId: "scanner-input" });
}

function applyScannerToCurrentTarget() {
  const reservation = getActiveReservation();
  const scanTarget = getScannerTarget();
  if (scanTarget.kind === "bulkGuests") {
    applyBulkScannerToGuests();
    return;
  }

  const result = parseScannerInput(ui.scannerDraft);
  ui.parseResult = result;

  if (!result.ok) {
    ui.isScannerModalOpen = true;
    render({ preserveScroll: true, focusId: "scanner-input" });
    return;
  }

  if (scanTarget.kind === "responsible") {
    const minorResult = buildResponsibleScannerMinorResult(result, reservation);
    if (minorResult) {
      ui.parseResult = minorResult;
      ui.isScannerModalOpen = true;
      render({ preserveScroll: true, focusId: "scanner-input" });
      return;
    }
    applyParsedScannerDataToResponsible(reservation, result);
  } else {
    const guest = scanTarget.guest;
    applyParsedScannerDataToGuest(guest, result);

    const nextGuest = findNextGuestAfterScan(reservation, guest.id);
    ui.activeGuestId = nextGuest.id;
    ui.scannerTargetKind = "guest";
    ui.scannerTargetGuestId = nextGuest.id;
  }

  reservation.lastScanAt = nowIso();
  touchReservation(reservation);
  ui.scannerDraft = "";

  persistState({
    toast:
      scanTarget.kind === "responsible"
        ? "Lectura aplicada al titular o responsable."
        : "Lectura aplicada al hu\u00e9sped de la habitaci\u00f3n.",
  });
  closeScannerModal({ clearDraft: true });
  render({ preserveScroll: true });
}

function isScannerResultReadyForAutoApply(result) {
  return Boolean(result && result.ok && Number(result.score) >= 90);
}

function applyBulkScannerAutoScan() {
  const session = getBulkScannerSession();
  const scanLines = splitBulkScannerInput(ui.scannerDraft);
  const rawLine = scanLines[0] || ui.scannerDraft.trim();
  if (!rawLine) {
    return;
  }

  const result = parseScannerInput(rawLine);
  if (!isScannerResultReadyForAutoApply(result)) {
    return;
  }

  const previousAssignedCount = session.assigned.length;
  applyBulkScannerLine(rawLine, session.assigned.length + session.failed.length + session.skipped.length);
  const newAssignedCount = session.assigned.length - previousAssignedCount;
  ui.parseResult = buildBulkScannerParseResult(session);
  ui.scannerDraft = scanLines.slice(1).join("\n");
  if (newAssignedCount > 0) {
    persistState({
      toast: "DNI cargado. El lector queda listo para el siguiente.",
    });
  } else {
    persistState();
  }
  render({ preserveScroll: true, focusId: "scanner-input" });
  if (ui.scannerDraft.trim()) {
    scheduleScannerAutoApply();
  }
}

function scheduleScannerAutoApply() {
  clearScannerAutoApplyTimer();
  if (!ui.isScannerModalOpen || !ui.scannerDraft.trim()) {
    return;
  }

  scannerAutoApplyTimeoutId = window.setTimeout(() => {
    scannerAutoApplyTimeoutId = null;
    if (!ui.isScannerModalOpen) {
      return;
    }
    if (ui.scannerTargetKind === "bulkGuests") {
      applyBulkScannerAutoScan();
      return;
    }
    const result = parseScannerInput(ui.scannerDraft);
    if (!isScannerResultReadyForAutoApply(result)) {
      return;
    }
    applyScannerToCurrentTarget();
  }, 120);
}

function buildLibroRows(reservation) {
  if (!reservation) return [];
  const adjustmentInfo = getTariffAdjustmentInfo(reservation);
  const pricingNote =
    adjustmentInfo && adjustmentInfo.kind !== "match" ? reservation.discountNote : "";
  const travelOrigin = getReservationTravelOrigin(reservation);
  return reservation.guests.map((guest, index) => [
    index === 0 ? cleanExportValue(reservation.roomNumber) : "",
    index === 0 ? formatDisplayDate(reservation.checkInDate) : "",
    index === 0 ? formatDisplayDate(reservation.checkOutDate) : "",
    index === 0 ? cleanExportValue(reservation.nights || reservation.guests.length) : "",
    index === 0 ? cleanExportValue(reservation.regime) : "",
    index === 0 ? String(reservation.guests.length) : "",
    index === 0 ? cleanExportValue(reservation.licensePlate) : "",
    index === 0 ? cleanExportValue(reservation.total) : "",
    index === 0 ? cleanExportValue(reservation.cash) : "",
    index === 0 ? cleanExportValue(reservation.transfer) : "",
    index === 0 ? cleanExportValue(reservation.pending) : "",
    index === 0 ? cleanExportValue(reservation.email) : "",
    index === 0 ? cleanExportValue(reservation.phone) : "",
    index === 0 ? cleanExportValue(travelOrigin) : "",
    index === 0 ? cleanExportValue(travelOrigin) : "",
    index === 0
      ? cleanExportValue(
          [reservation.notes, pricingNote].filter(Boolean).join(" | ")
        )
      : "",
    cleanExportValue(guest.rawScan),
    cleanExportValue(guest.firstName),
    cleanExportValue(guest.lastName),
    cleanExportValue(guest.document),
    cleanExportValue(normalizeHumanDate(guest.birthDate) || guest.birthDate),
    cleanExportValue(guest.gender),
    cleanExportValue(guest.nationality || DEFAULT_NATIONALITY),
    cleanExportValue(guest.specialRegime),
  ]);
}

function buildTsv(rows) {
  return rows.map((row) => row.map(cleanExportValue).join("\t")).join("\n");
}

function escapeCsvCell(value) {
  const text = cleanExportValue(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function buildCsv(rows) {
  const allRows = [BOOK_HEADERS_VIEW, ...rows];
  return allRows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function buildReservationFileName(reservation, extension) {
  const room = reservation.roomNumber ? `hab-${slugify(reservation.roomNumber)}` : "sin-habitacion";
  const responsible = getTitular(reservation);
  const guestSlug = slugify(
    [responsible.firstName, responsible.lastName].filter(Boolean).join("-")
  );
  const date = (reservation.checkInDate || formatInputDate(new Date())).replace(/-/g, "");
  return `solanas-checkin-${room}${guestSlug ? `-${guestSlug}` : ""}-${date}.${extension}`;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

async function copyRowsForSheets() {
  const reservation = getActiveReservation();
  const rows = buildLibroRows(reservation);
  if (!rows.length) {
    window.alert("No hay filas para copiar.");
    return;
  }

  try {
    await copyText(buildTsv(rows));
    reservation.lastExportedAt = nowIso();
    touchReservation(reservation, { legal: false });
    persistState({
      toast: "Las filas se copiaron al portapapeles.",
    });
    render({ preserveScroll: true });
  } catch (error) {
    console.error("No se pudo copiar al portapapeles.", error);
    window.alert("No pude copiar al portapapeles en este navegador.");
  }
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadCsvForSheets() {
  const reservation = getActiveReservation();
  const rows = buildLibroRows(reservation);
  if (!rows.length) {
    window.alert("No hay filas para exportar.");
    return;
  }

  downloadTextFile(
    buildReservationFileName(reservation, "csv"),
    buildCsv(rows),
    "text/csv;charset=utf-8"
  );

  reservation.lastExportedAt = nowIso();
  touchReservation(reservation, { legal: false });
  persistState({
    toast: "Se descarg\u00f3 el CSV del libro de hu\u00e9spedes.",
  });
  render({ preserveScroll: true });
}

function exportBackup() {
  downloadTextFile(
    `solanas-checkin-backup-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(state, null, 2),
    "application/json;charset=utf-8"
  );
  showSuccessToast("Se descarg\u00f3 el respaldo JSON de la app.");
}

function triggerBackupImport() {
  const input = document.getElementById("backup-input");
  if (input) {
    input.click();
  }
}

function loadImportedState(raw) {
  if (!raw || !Array.isArray(raw.reservations)) {
    return null;
  }
  const reservations = raw.reservations.map(normalizeReservation).filter(Boolean);
  if (!reservations.length) return null;
  const activeReservation =
    reservations.find(
      (reservation) => reservation.id === raw.activeReservationId && !reservation.archived
    ) ||
    reservations.find((reservation) => !reservation.archived) ||
    reservations[0];
  return {
    version: APP_VERSION,
    reservations,
    tariffs: normalizeTariffs(raw.tariffs),
    roomMaintenance: normalizeRoomMaintenance(raw.roomMaintenance),
    groupMemory: normalizeGroupMemory(raw.groupMemory),
    activeReservationId: activeReservation.id,
    lastSavedAt: nowIso(),
  };
}

function importBackup(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const normalized = loadImportedState(parsed);
      if (!normalized) {
        window.alert("Ese archivo no parece ser un respaldo v\u00e1lido de esta app.");
        return;
      }
      if (!window.confirm("\u00bfReemplazar el estado actual con este respaldo?")) {
        return;
      }
      state = normalized;
      ensureActiveReservation();
      ensureActiveGuest();
      resetScannerUi();
      persistState({
        toast: "El respaldo se import\u00f3 correctamente.",
      });
      render();
    } catch (error) {
      console.error("No se pudo importar el respaldo.", error);
      window.alert("No pude leer ese JSON. Revisa que sea un respaldo exportado por esta app.");
    }
  };
  reader.readAsText(file, "utf-8");
}

function openPrintableWindow(html) {
  const printWindow = window.open("", "_blank", "width=960,height=960");
  if (!printWindow) {
    window.alert("El navegador bloque\u00f3 la ventana de impresi\u00f3n.");
    return null;
  }

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    printWindow.print();
  }, 150);
  return printWindow;
}

function printReservation() {
  const reservation = getActiveReservation();
  if (!openPrintableWindow(buildPrintableReservationHtml(reservation))) {
    return;
  }

  reservation.lastExportedAt = nowIso();
  touchReservation(reservation, { legal: false });
  persistState({
    toast: "Se abri\u00f3 la ficha imprimible de la reserva.",
  });
  render({ preserveScroll: true });
}

function printLegalPacket(reservationId = state.activeReservationId) {
  const reservation =
    state.reservations.find((item) => item.id === reservationId) || getActiveReservation();
  if (!reservation) return;

  if (!canPrintLegalPacket(reservation)) {
    const issues = getLegalPrintIssues(reservation);
    const details = issues.length ? `\n\n${issues.map((issue) => `- ${issue}`).join("\n")}` : "";
    window.alert(
      `Completa el check-in, el legajo y el saldo de hotel antes de imprimir el paquete legal.${details}`
    );
    return;
  }

  if (!openPrintableWindow(buildPrintableLegalPacketHtml(reservation))) {
    return;
  }

  const operationalInfo = getReservationOperationalInfo(reservation);
  touchReservation(reservation, { legal: false });
  reservation.lastPrintedAt = nowIso();
  reservation.lastPrintedSignature = buildLegalPacketSignature(reservation);
  reservation.printInvalidatedAt = null;
  persistState({
    toast:
      operationalInfo.key === "today"
        ? "Se abri\u00f3 el formulario de ingreso con el reglamento."
        : "Se abri\u00f3 el formulario legal prellenado de la reserva.",
  });
  render({ preserveScroll: true });
}

function buildPrintableReservationHtml(reservation) {
  const responsible = getTitular(reservation);
  const printableGuests = reservation.guests.map((guest) => ({
    ...guest,
    birthDate: normalizeHumanDate(guest.birthDate) || guest.birthDate,
    ageInfo: getLegalAgeInfo(guest),
  }));
  const paymentSummary = [
    reservation.total ? `Total ${formatCurrency(reservation.total)}` : "",
    reservation.cash ? `Efectivo ${formatCurrency(reservation.cash)}` : "",
    reservation.transfer ? `Transferencia ${formatCurrency(reservation.transfer)}` : "",
    reservation.pending ? `Saldo ${formatCurrency(reservation.pending)}` : "",
  ]
    .filter(Boolean)
    .join(" \u00b7 ");
  const travelOrigin = getReservationTravelOrigin(reservation);

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ficha de reserva | Solanas</title>
        <style>
          @font-face {
            font-family: "Libre Baskerville Solanas";
            src: url("${TITLE_FONT_URL}") format("truetype");
            font-weight: 700;
            font-style: normal;
          }
          :root {
            --ink: #1f2e31;
            --muted: #5d6f73;
            --line: #d8ddd8;
            --paper: #fffdf8;
            --accent: #0d7c79;
            --accent-soft: #eef8f7;
            --body-font: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
            --title-font: "Libre Baskerville Solanas", Georgia, "Times New Roman", serif;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: var(--body-font);
            color: var(--ink);
            background: #f2efe8;
          }
          .page {
            width: min(980px, calc(100vw - 32px));
            margin: 24px auto;
            background: var(--paper);
            border: 1px solid #ece7dc;
            box-shadow: 0 18px 60px rgba(0, 0, 0, 0.08);
          }
          .toolbar {
            position: sticky;
            top: 0;
            z-index: 5;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 14px 20px;
            border-bottom: 1px solid var(--line);
            background: rgba(255, 253, 248, 0.96);
          }
          .toolbar button {
            padding: 10px 14px;
            border: 0;
            border-radius: 999px;
            background: var(--accent);
            color: #fff;
            font: inherit;
            cursor: pointer;
          }
          .toolbar .ghost {
            background: #fff;
            color: var(--ink);
            border: 1px solid var(--line);
          }
          .content {
            padding: 42px 56px 56px;
          }
          .cover {
            padding-bottom: 24px;
            border-bottom: 1px solid var(--line);
          }
          .cover-top {
            display: flex;
            align-items: center;
            gap: 24px;
          }
          .logo {
            width: 110px;
            height: 110px;
            object-fit: contain;
            border-radius: 24px;
            background: var(--accent-soft);
            padding: 14px;
          }
          .eyebrow {
            margin: 0 0 8px;
            color: var(--muted);
            font-size: 0.9rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }
          h1, h2 {
            font-family: var(--body-font);
            margin: 0;
            font-weight: 700;
          }
          h1 {
            font-size: 2.4rem;
            line-height: 1;
          }
          h2 {
            margin: 34px 0 12px;
            font-size: 1.42rem;
          }
          p {
            margin: 0;
            line-height: 1.7;
          }
          .lead {
            margin-top: 16px;
            max-width: 62ch;
            color: #344447;
          }
          .grid {
            margin-top: 24px;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
          .card {
            padding: 18px;
            border: 1px solid var(--line);
            background: #fff;
          }
          .card strong {
            display: block;
            margin-bottom: 6px;
            font-family: var(--body-font);
          }
          .guest-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .guest-table th,
          .guest-table td {
            padding: 10px 8px;
            border-bottom: 1px solid var(--line);
            text-align: left;
            vertical-align: top;
          }
          .guest-table th {
            color: var(--muted);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            font-family: var(--body-font);
          }
          .signatures {
            margin-top: 28px;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
          .signature-box {
            padding-top: 34px;
            border-top: 1px solid var(--line);
            color: var(--muted);
          }
          .note {
            margin-top: 22px;
            padding: 16px 18px;
            border-left: 5px solid var(--accent);
            background: var(--accent-soft);
          }
          @page {
            size: A4;
            margin: 14mm;
          }
          @media print {
            body { background: #fff; }
            .page {
              width: 100%;
              margin: 0;
              border: 0;
              box-shadow: none;
            }
            .toolbar { display: none; }
            .content { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="toolbar">
            <button type="button" class="ghost" onclick="window.close()">Cerrar</button>
            <button type="button" onclick="window.print()">Imprimir</button>
          </div>
          <div class="content">
            <section class="cover">
              <div class="cover-top">
                <img class="logo" src="${LOGO_URL}" alt="Solanas" />
                <div>
                  <p class="eyebrow">Reservas y registro de hu&eacute;spedes</p>
                  <h1>Ficha de reserva</h1>
                  <p class="lead">
                    Reserva preparada para recepci&oacute;n. Esta vista resume la informaci&oacute;n del
                    titular o responsable, los ocupantes reales de la habitaci&oacute;n y los datos
                    operativos principales antes de cerrar o revisar la reserva.
                  </p>
                </div>
              </div>
            </section>
            <section>
              <h2>Datos de la reserva</h2>
              <div class="grid">
                <article class="card"><strong>Habitaci&oacute;n</strong><p>${escapeHtml(reservation.roomNumber || "Sin definir")}</p></article>
                <article class="card"><strong>Responsable</strong><p>${escapeHtml(
                  [responsible.firstName, responsible.lastName].filter(Boolean).join(" ").trim() || "Sin cargar"
                )}</p></article>
                <article class="card"><strong>DNI responsable</strong><p>${escapeHtml(responsible.document || "No informado")}</p></article>
                <article class="card"><strong>Fecha de ingreso</strong><p>${escapeHtml(formatDateLong(reservation.checkInDate))}</p></article>
                <article class="card"><strong>Fecha de egreso</strong><p>${escapeHtml(formatDateLong(reservation.checkOutDate))}</p></article>
                <article class="card"><strong>Noches</strong><p>${escapeHtml(reservation.nights || "1")}</p></article>
                <article class="card"><strong>R&eacute;gimen</strong><p>${escapeHtml(reservation.regime || "Sin régimen")}</p></article>
                <article class="card"><strong>Patente</strong><p>${escapeHtml(reservation.licensePlate || "No informada")}</p></article>
                <article class="card"><strong>Tel&eacute;fono</strong><p>${escapeHtml(reservation.phone || "No informado")}</p></article>
                <article class="card"><strong>Correo</strong><p>${escapeHtml(reservation.email || "No informado")}</p></article>
                <article class="card"><strong>Procedencia / destino</strong><p>${escapeHtml(travelOrigin || "No informado")}</p></article>
                <article class="card"><strong>Pagos</strong><p>${escapeHtml(paymentSummary || "Sin movimientos cargados")}</p></article>
              </div>
              ${
                reservation.notes
                  ? `<div class="note"><strong>Observaciones:</strong><div>${escapeHtml(reservation.notes)}</div></div>`
                  : ""
              }
            </section>
            <section>
              <h2>Hu&eacute;spedes que ocupan la habitaci&oacute;n</h2>
              <table class="guest-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>DNI</th>
                    <th>Fecha de nac.</th>
                    <th>G&eacute;nero</th>
                    <th>Nacionalidad</th>
                    <th>Reg. especial</th>
                  </tr>
                </thead>
                <tbody>
                  ${printableGuests
                    .map(
                      (guest, index) => `
                        <tr>
                          <td>${escapeHtml(guest.firstName || "-")}</td>
                          <td>${escapeHtml(guest.lastName || "-")}</td>
                          <td>${escapeHtml(guest.document || "-")}</td>
                          <td>${escapeHtml(guest.birthDate || "-")}${
                            guest.ageInfo.age !== null ? ` &middot; ${escapeHtml(guest.ageInfo.shortLabel)}` : ""
                          }</td>
                          <td>${escapeHtml(guest.gender || "-")}</td>
                          <td>${escapeHtml(guest.nationality || DEFAULT_NATIONALITY)}</td>
                          <td>${escapeHtml(guest.specialRegime || "-")}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>
            </section>
            <section class="signatures">
              <div class="signature-box">Firma del titular / responsable de la reserva</div>
            </section>
            <section class="note" style="margin-top: 24px;">
              <strong>&Uacute;ltima edici&oacute;n:</strong> ${escapeHtml(formatLocalDateTime(reservation.updatedAt))}
              <br />
              <strong>Responsable:</strong> ${escapeHtml(
                [responsible.firstName, responsible.lastName].filter(Boolean).join(" ") || "Sin cargar"
              )}
            </section>
          </div>
        </div>
      </body>
    </html>
  `;
}

function buildLegacyPrintableLegalPacketHtml(reservation) {
  const responsible = getTitular(reservation);
  const responsibleName =
    [responsible.firstName, responsible.lastName].filter(Boolean).join(" ").trim() ||
    "Titular / responsable";
  const responsibleAgeInfo = getResponsibleLegalAgeInfo(reservation);
  const printableGuests = reservation.guests.map((guest) => ({
    ...guest,
    fullName: [guest.firstName, guest.lastName].filter(Boolean).join(" ").trim(),
    birthDate: normalizeHumanDate(guest.birthDate) || guest.birthDate,
    ageInfo: getLegalAgeInfo(guest),
  }));
  const paymentSummary = getPaymentSummary(reservation);
  const showFinancialFields = shouldShowReservationFinancialFields(reservation);
  const reservationNotes = [reservation.notes, reservation.discountNote]
    .filter(Boolean)
    .join(" \u00b7 ");
  const groupCompany = getReservationCompanyLabel(reservation);
  const travelOrigin = getReservationTravelOrigin(reservation);
  const regimeLabel = reservation.regime || "Sin régimen";
  const totalGuests = getReservationGuestCount(reservation);
  const generatedAt = formatLocalDateTime(nowIso());
  const printableValue = (value, fallback = "________________") => escapeHtml(value || fallback);
  const legalRuleItems = LEGAL_RULES_SECTIONS.flatMap((section) => {
    if (section.title === "Valor legal") {
      return [];
    }
    return section.items.filter(
      (item) =>
        !item.startsWith(
          "Al firmar este documento, el hu\u00e9sped declara haber le\u00eddo, comprendido y aceptado las normas del hotel"
        )
    );
  });

  const guestRows = printableGuests
    .map(
      (guest) => `
        <tr>
          <td>${escapeHtml(guest.fullName || "-")}</td>
          <td>${escapeHtml(guest.document || "-")}</td>
          <td>${escapeHtml(guest.birthDate || "-")}${
            guest.ageInfo.age !== null ? ` &middot; ${escapeHtml(guest.ageInfo.shortLabel)}` : ""
          }</td>
          <td>${escapeHtml(
            [guest.gender || "-", guest.nationality || DEFAULT_NATIONALITY].join(" / ")
          )}</td>
          <td>${escapeHtml(guest.specialRegime || "-")}</td>
        </tr>
      `
    )
    .join("");

  const legalListHtml = legalRuleItems
    .map(
      (item, index) => `
        <li>
          <span class="legal-index">${index + 1}.</span>
          <span>${escapeHtml(item)}</span>
        </li>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registro y constancia | Solanas</title>
        <style>
          @font-face {
            font-family: "Libre Baskerville Solanas";
            src: url("${TITLE_FONT_URL}") format("truetype");
            font-weight: 700;
            font-style: normal;
          }
          :root {
            --ink: #1f2e31;
            --muted: #5d6f73;
            --line: #d8ddd8;
            --paper: #fffdf8;
            --accent: #0d7c79;
            --accent-soft: #eef8f7;
            --body-font: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
            --title-font: "Libre Baskerville Solanas", Georgia, "Times New Roman", serif;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: var(--body-font);
            color: var(--ink);
            background: #f2efe8;
          }
          .toolbar {
            position: sticky;
            top: 0;
            z-index: 10;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 12px 18px;
            border-bottom: 1px solid var(--line);
            background: rgba(255, 253, 248, 0.96);
          }
          .toolbar button {
            padding: 10px 14px;
            border: 0;
            border-radius: 999px;
            background: var(--accent);
            color: #fff;
            font: inherit;
            cursor: pointer;
          }
          .toolbar .ghost {
            background: #fff;
            color: var(--ink);
            border: 1px solid var(--line);
          }
          .print-shell {
            padding: 18px 0 24px;
          }
          .sheet {
            width: min(1120px, calc(100vw - 20px));
            margin: 0 auto;
            padding: 18px 20px 20px;
            background: var(--paper);
            border: 1px solid #ece7dc;
            box-shadow: 0 18px 60px rgba(0, 0, 0, 0.08);
          }
          .sheet-header,
          .signature-grid {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
          }
          .brand-row {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .logo {
            width: 76px;
            height: 76px;
            object-fit: contain;
            border-radius: 18px;
            background: var(--accent-soft);
            padding: 10px;
            flex-shrink: 0;
          }
          .eyebrow {
            margin: 0 0 6px;
            color: var(--muted);
            font-size: 0.64rem;
            letter-spacing: 0.16em;
            text-transform: uppercase;
          }
          h1,
          h2 {
            margin: 0;
            font-family: var(--body-font);
            font-weight: 700;
          }
          h1 {
            font-size: 1.24rem;
            line-height: 1.14;
          }
          h2 {
            font-size: 0.78rem;
            margin-bottom: 6px;
          }
          p {
            margin: 0;
            line-height: 1.28;
          }
          .sheet-lead {
            margin-top: 6px;
            max-width: 86ch;
            font-size: 0.68rem;
            line-height: 1.34;
            color: #344447;
          }
          .hotel-card,
          .section-card,
          .signature-card {
            border: 1px solid var(--line);
            background: #fff;
          }
          .hotel-card {
            min-width: 248px;
            padding: 10px 12px;
            display: grid;
            gap: 4px;
            font-size: 0.66rem;
            line-height: 1.3;
          }
          .hotel-card strong {
            font-family: var(--title-font);
            font-size: 0.94rem;
            line-height: 1.1;
          }
          .status-strip {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 8px;
            margin-top: 10px;
          }
          .status-pill {
            padding: 8px 9px;
            border: 1px solid var(--line);
            border-radius: 12px;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 250, 0.92));
          }
          .status-pill span {
            display: block;
            font-size: 0.58rem;
            color: var(--muted);
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .status-pill strong {
            display: block;
            margin-top: 4px;
            font-size: 0.74rem;
            line-height: 1.2;
          }
          .compact-body {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr);
            gap: 10px;
            margin-top: 10px;
          }
          .left-stack,
          .right-stack {
            display: grid;
            gap: 9px;
          }
          .section-card,
          .signature-card {
            padding: 10px 11px;
            border-radius: 14px;
          }
          .section-card.is-compact {
            padding: 7px 9px;
          }
          .section-card.is-legal {
            padding: 8px 9px;
          }
          .section-heading {
            margin: 0 0 7px;
            font-size: 0.6rem;
            color: var(--muted);
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }
          .mini-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px 10px;
          }
          .mini-field span,
          .signature-meta span {
            display: block;
            margin-bottom: 3px;
            color: var(--muted);
            font-size: 0.54rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .mini-field strong,
          .signature-meta strong {
            display: block;
            min-height: 18px;
            font-size: 0.68rem;
            line-height: 1.24;
          }
          .notes-box {
            min-height: 18px;
            white-space: pre-wrap;
            font-size: 0.6rem;
            line-height: 1.2;
          }
          .guest-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          .guest-table th,
          .guest-table td {
            padding: 4px 4px;
            border-bottom: 1px solid var(--line);
            text-align: left;
            vertical-align: top;
            font-size: 0.61rem;
            overflow-wrap: anywhere;
          }
          .guest-table th {
            color: var(--muted);
            font-size: 0.52rem;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          .legal-intro,
          .legal-closing {
            font-size: 0.64rem;
            line-height: 1.34;
            color: #344447;
          }
          .section-card.is-legal .section-heading {
            margin-bottom: 5px;
            font-size: 0.56rem;
          }
          .section-card.is-legal .legal-intro,
          .section-card.is-legal .legal-closing {
            font-size: 0.58rem;
            line-height: 1.2;
          }
          .legal-list {
            list-style: none;
            margin: 8px 0 0;
            padding: 0;
            display: grid;
            gap: 5px;
          }
          .section-card.is-legal .legal-list {
            margin-top: 6px;
            gap: 3px;
          }
          .legal-list li {
            display: grid;
            grid-template-columns: 16px minmax(0, 1fr);
            gap: 6px;
            align-items: start;
            font-size: 0.59rem;
            line-height: 1.24;
          }
          .section-card.is-legal .legal-list li {
            grid-template-columns: 14px minmax(0, 1fr);
            gap: 4px;
            font-size: 0.54rem;
            line-height: 1.12;
          }
          .legal-index {
            color: var(--muted);
            font-weight: 700;
          }
          .signature-card {
            margin-top: 12px;
          }
          .signature-box {
            width: min(720px, 100%);
            min-height: 148px;
            color: var(--muted);
            display: grid;
            gap: 8px;
            align-content: end;
          }
          .signature-line {
            min-height: 88px;
            border-bottom: 1px solid var(--line);
          }
          .signature-box strong {
            display: block;
            margin-bottom: 2px;
            color: var(--ink);
            font-size: 0.74rem;
            line-height: 1.24;
          }
          .signature-caption {
            font-size: 0.64rem;
            line-height: 1.3;
          }
          .signature-meta {
            display: grid;
            gap: 6px;
            align-content: end;
            justify-items: end;
            text-align: right;
          }
          .foot-note {
            margin-top: 8px;
            color: var(--muted);
            font-size: 0.58rem;
            line-height: 1.28;
          }
          @page {
            size: A4;
            margin: 5mm;
          }
          @media print {
            body { background: #fff; }
            .toolbar { display: none; }
            .print-shell { padding: 0; }
            .sheet {
              width: 100%;
              margin: 0;
              border: 0;
              box-shadow: none;
              padding: 5mm 5mm 6mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="toolbar">
          <button type="button" class="ghost" onclick="window.close()">Cerrar</button>
          <button type="button" onclick="window.print()">Imprimir / Guardar PDF</button>
        </div>

        <main class="print-shell">
          <section class="sheet">
            <header class="sheet-header">
              <div class="brand-row">
                <img class="logo" src="${LOGO_URL}" alt="Solanas" />
                <div>
                  <p class="eyebrow">Formulario y reglamento</p>
                  <h1>Registro de hu&eacute;spedes y constancia de reglas del hotel</h1>
                  <p class="sheet-lead">
                    Documento para constancia de ingreso, verificaci&oacute;n de datos declarados y aceptaci&oacute;n de las normas del establecimiento.
                  </p>
                </div>
              </div>
              <aside class="hotel-card">
                <strong>${escapeHtml(HOTEL_INFO.name)}</strong>
                <span>Tel. ${escapeHtml(HOTEL_INFO.phone)}</span>
                <span>${escapeHtml(HOTEL_INFO.address)}</span>
                <span>${escapeHtml(HOTEL_INFO.hours)}</span>
              </aside>
            </header>

            <div class="status-strip">
              <div class="status-pill">
                <span>Hu&eacute;spedes</span>
                <strong>${escapeHtml(String(totalGuests))}</strong>
              </div>
              <div class="status-pill">
                <span>Ingreso</span>
                <strong>${escapeHtml(formatDisplayDate(reservation.checkInDate))}</strong>
              </div>
              <div class="status-pill">
                <span>Egreso</span>
                <strong>${escapeHtml(formatDisplayDate(reservation.checkOutDate))}</strong>
              </div>
              <div class="status-pill">
                <span>Habitaci&oacute;n</span>
                <strong>${printableValue(reservation.roomNumber)}</strong>
              </div>
              <div class="status-pill">
                <span>R&eacute;gimen</span>
                <strong>${escapeHtml(regimeLabel)}</strong>
              </div>
            </div>

            <div class="compact-body">
              <div class="left-stack">
                <section class="section-card">
                  <div class="section-heading">Datos de la reserva</div>
                  <div class="mini-grid">
                    <div class="mini-field">
                      <span>Responsable</span>
                      <strong>${escapeHtml(responsibleName)}</strong>
                    </div>
                    ${
                      groupCompany
                        ? `
                          <div class="mini-field">
                            <span>Empresa / grupo</span>
                            <strong>${escapeHtml(groupCompany)}</strong>
                          </div>
                        `
                        : ""
                    }
                    <div class="mini-field">
                      <span>DNI responsable</span>
                      <strong>${printableValue(responsible.document)}</strong>
                    </div>
                    <div class="mini-field">
                      <span>Tel&eacute;fono</span>
                      <strong>${printableValue(reservation.phone)}</strong>
                    </div>
                    <div class="mini-field">
                      <span>Correo</span>
                      <strong>${printableValue(reservation.email)}</strong>
                    </div>
                    <div class="mini-field">
                      <span>Procedencia / destino</span>
                      <strong>${printableValue(travelOrigin)}</strong>
                    </div>
                    <div class="mini-field">
                      <span>Noches</span>
                      <strong>${printableValue(formatNightsLabel(reservation.nights || 1))}</strong>
                    </div>
                    <div class="mini-field">
                      <span>Patente</span>
                      <strong>${printableValue(reservation.licensePlate)}</strong>
                    </div>
                    ${
                      showFinancialFields
                        ? `
                          <div class="mini-field">
                            <span>Total pactado</span>
                            <strong>${printableValue(
                              paymentSummary.total === null ? "" : formatCurrency(paymentSummary.total)
                            )}</strong>
                          </div>
                          <div class="mini-field">
                            <span>Pagado / saldo</span>
                            <strong>${escapeHtml(formatCurrency(paymentSummary.paid || 0))} / ${printableValue(
                              paymentSummary.pending === null ? "" : formatCurrency(paymentSummary.pending)
                            )}</strong>
                          </div>
                        `
                        : ""
                    }
                    <div class="mini-field">
                      <span>F. nac. responsable</span>
                      <strong>${printableValue(
                        normalizeHumanDate(responsible.birthDate) || responsible.birthDate,
                        "________________"
                      )}${responsibleAgeInfo.age !== null ? ` &middot; ${escapeHtml(responsibleAgeInfo.shortLabel)}` : ""}</strong>
                    </div>
                    <div class="mini-field">
                      <span>G&eacute;n. / nac. resp.</span>
                      <strong>${escapeHtml(
                        [responsible.gender || "-", responsible.nationality || DEFAULT_NATIONALITY].join(" / ")
                      )}</strong>
                    </div>
                  </div>
                </section>

                <section class="section-card">
                  <div class="section-heading">Hu&eacute;spedes que ocupan la habitaci&oacute;n</div>
                  <table class="guest-table">
                    <thead>
                      <tr>
                        <th>Nombre y apellido</th>
                        <th>DNI</th>
                        <th>F. nac.</th>
                        <th>G&eacute;n. / nac.</th>
                        <th>Reg. esp.</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${guestRows}
                    </tbody>
                  </table>
                </section>

                ${
                  reservationNotes
                    ? `
                      <section class="section-card is-compact">
                        <div class="section-heading">Observaciones</div>
                        <div class="notes-box">${escapeHtml(reservationNotes)}</div>
                      </section>
                    `
                    : ""
                }
              </div>

              <div class="right-stack">
                <section class="section-card is-legal">
                  <div class="section-heading">Constancia de reglas del hotel</div>
                  <p class="legal-intro">
                    El titular o responsable declara haber le&iacute;do, comprendido y aceptado las reglas del hotel, y se compromete a cumplirlas durante toda la estad&iacute;a.
                  </p>
                  <ol class="legal-list">
                    ${legalListHtml}
                  </ol>
                  <p class="legal-closing" style="margin-top: 6px;">
                    Este documento tiene valor legal. En caso de da&ntilde;os, p&eacute;rdidas o incumplimientos, el titular o responsable acepta abonar el valor correspondiente al momento del egreso.
                  </p>
                </section>
              </div>
            </div>

            <section class="signature-card">
              <div class="signature-grid">
                <div class="signature-box">
                  <div class="signature-line" aria-hidden="true"></div>
                  <div>
                    <strong>Firma del titular / responsable de la reserva</strong>
                    <div class="signature-caption">
                      ${escapeHtml(responsibleName)} &middot; DNI ${escapeHtml(
                        responsible.document || "________________"
                      )}
                    </div>
                  </div>
                </div>
                <div class="signature-meta">
                  <div>
                    <span>Fecha de impresi&oacute;n</span>
                    <strong>${escapeHtml(formatDisplayDate(getTodayInputDate()))}</strong>
                  </div>
                  <div>
                    <span>Generado</span>
                    <strong>${escapeHtml(generatedAt)}</strong>
                  </div>
                </div>
              </div>
              <p class="foot-note">
                ${escapeHtml(HOTEL_INFO.name)} &middot; ${escapeHtml(HOTEL_INFO.address)} &middot; Tel. ${escapeHtml(
                  HOTEL_INFO.phone
                )}
              </p>
            </section>
          </section>
        </main>
      </body>
    </html>
  `;
}

function buildPrintableLegalPacketHtml(reservation) {
  const responsible = getTitular(reservation);
  const responsibleName =
    [responsible.firstName, responsible.lastName].filter(Boolean).join(" ").trim() ||
    "Titular / responsable";
  const responsibleAgeInfo = getResponsibleLegalAgeInfo(reservation);
  const paymentSummary = getPaymentSummary(reservation);
  const showFinancialFields = shouldShowReservationFinancialFields(reservation);
  const reservationNotes = [reservation.notes, reservation.discountNote]
    .filter(Boolean)
    .join(" \u00b7 ");
  const groupCompany = getReservationCompanyLabel(reservation);
  const travelOrigin = getReservationTravelOrigin(reservation);
  const regimeLabel = reservation.regime || "Sin r\u00e9gimen";
  const totalGuests = getReservationGuestCount(reservation);
  const generatedAt = formatLocalDateTime(nowIso());
  const printableValue = (value, fallback = "________________") => escapeHtml(value || fallback);
  const responsibleBirthDate = normalizeHumanDate(responsible.birthDate) || responsible.birthDate;
  const paymentTotal =
    paymentSummary.total === null ? "" : formatCurrency(paymentSummary.total);
  const paymentPending =
    paymentSummary.pending === null ? "" : formatCurrency(paymentSummary.pending);
  const ruleGroups = [
    {
      title: "Convivencia y cuidado",
      items: [
        "Prohibido fumar en habitaciones y espacios cerrados: pasillos, recepci\u00f3n y restaurante.",
        "Cuidar control remoto, caloventores, tap\u00f3n de ba\u00f1era, toallas, frazadas y dem\u00e1s equipamiento.",
        "Todo da\u00f1o o p\u00e9rdida se abona al egreso seg\u00fan el valor de reposici\u00f3n.",
        "No derramar l\u00edquidos sobre alfombras, ropa de cama ni mobiliario.",
        "Al salir, apagar y desconectar los artefactos el\u00e9ctricos.",
      ],
    },
    {
      title: "Uso de habitaci\u00f3n e instalaciones",
      items: [
        "No consumir comestibles en la habitaci\u00f3n. Solicitar vajilla en recepci\u00f3n.",
        "No limpiar el mate en lavamanos, ducha ni otros sectores del ba\u00f1o.",
        "No llevar toallas ni toallones de la habitaci\u00f3n a la piscina.",
        "Dejar la llave en recepci\u00f3n al retirarse. Su extrav\u00edo tiene costo de reposici\u00f3n.",
        "Los menores deben permanecer supervisados en piscina y ba\u00f1era.",
      ],
    },
    {
      title: "Operaci\u00f3n y recepci\u00f3n",
      items: [
        "Check-out: 10:00 a. m. Respetar el horario para permitir limpieza y preparaci\u00f3n.",
        "La disponibilidad queda sujeta a admisi\u00f3n y organizaci\u00f3n del hotel.",
        "La llave del veh\u00edculo debe quedar en recepci\u00f3n por necesidades de log\u00edstica interna.",
        "Informar al personal cualquier faltante o desperfecto detectado.",
        "Solicitar en recepci\u00f3n la gu\u00eda para realizar correctamente el ba\u00f1o termal.",
      ],
    },
    {
      title: "Ba\u00f1os termales y bienestar",
      items: [
        "Comenzar con sesiones de 5 minutos y aumentar gradualmente seg\u00fan la respuesta corporal.",
        "Evitar ba\u00f1os termales durante las 2 horas anteriores o posteriores a cada comida.",
        "Alternar el ba\u00f1o con pausas al aire fresco para mayor seguridad y disfrute.",
        "Escuchar y respetar las se\u00f1ales del cuerpo.",
      ],
    },
    {
      title: "Sustentabilidad",
      items: [
        "Para recambio, dejar toallas sobre la ba\u00f1era; para reutilizarlas, dejarlas colgadas.",
        "Separar residuos en los cestos de planta baja, frente al ba\u00f1o de mujeres.",
      ],
    },
  ];

  const guestRows = reservation.guests
    .map((guest) => {
      const ageInfo = getLegalAgeInfo(guest);
      const fullName = [guest.firstName, guest.lastName].filter(Boolean).join(" ").trim();
      const birthDate = normalizeHumanDate(guest.birthDate) || guest.birthDate;
      return `
        <tr>
          <td>${escapeHtml(fullName || "-")}</td>
          <td>${escapeHtml(guest.document || "-")}</td>
          <td>${escapeHtml(birthDate || "-")}${
            ageInfo.age !== null ? ` &middot; ${escapeHtml(ageInfo.shortLabel)}` : ""
          }</td>
          <td>${escapeHtml(
            [guest.gender || "-", guest.nationality || DEFAULT_NATIONALITY].join(" / ")
          )}</td>
          <td>${escapeHtml(guest.specialRegime || "-")}</td>
        </tr>
      `;
    })
    .join("");

  let ruleNumber = 0;
  const renderRuleGroup = (group) => `
    <section class="rule-group">
      <div class="rule-heading"><span>${escapeHtml(group.title)}</span></div>
      <ol class="rule-list">
        ${group.items
          .map((item) => {
            ruleNumber += 1;
            return `
              <li>
                <span class="rule-number">${ruleNumber}</span>
                <span>${escapeHtml(item)}</span>
              </li>
            `;
          })
          .join("")}
      </ol>
    </section>
  `;
  const leftRuleGroupsHtml = ruleGroups.slice(0, 2).map(renderRuleGroup).join("");
  const rightRuleGroupsHtml = ruleGroups.slice(2).map(renderRuleGroup).join("");
  const supplementalDetails = [
    groupCompany
      ? `<div><span>Empresa / grupo</span><strong>${escapeHtml(groupCompany)}</strong></div>`
      : "",
    reservationNotes
      ? `<div><span>Observaciones</span><strong>${escapeHtml(reservationNotes)}</strong></div>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registro y constancia | Solanas</title>
        <style>
          :root {
            --ink: #000000;
            --muted: #666666;
            --line: #c9c9c9;
            --line-dark: #1c1c1c;
            --paper: #ffffff;
            --screen: #e7e7e7;
            --body-font: Arial, Helvetica, sans-serif;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: var(--body-font);
            color: var(--ink);
            background: var(--screen);
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .toolbar {
            position: sticky;
            top: 0;
            z-index: 10;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 12px 18px;
            border-bottom: 1px solid #cccccc;
            background: rgba(255, 255, 255, 0.96);
          }
          .toolbar button {
            padding: 10px 14px;
            border: 0;
            border-radius: 6px;
            background: #111111;
            color: #ffffff;
            font: inherit;
            cursor: pointer;
          }
          .toolbar .ghost {
            background: #ffffff;
            color: var(--ink);
            border: 1px solid var(--line);
          }
          .print-shell { padding: 18px 0 24px; overflow-x: auto; }
          .sheet {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 7mm 8mm 6.5mm;
            background: var(--paper);
            box-shadow: 0 10px 36px rgba(0, 0, 0, 0.12);
            display: flex;
            flex-direction: column;
          }
          .sheet-header {
            display: grid;
            grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.25fr);
            align-items: end;
            gap: 8mm;
            padding-bottom: 2.5mm;
            border-bottom: 0.35mm solid var(--line-dark);
          }
          .wordmark {
            font-family: Georgia, "Times New Roman", serif;
            font-size: 25pt;
            line-height: 0.95;
          }
          .wordmark-sub {
            margin-top: 2mm;
            padding-left: 4mm;
            font-size: 6.5pt;
          }
          .wordmark-sub strong {
            margin-left: 1.2mm;
            font-size: 8pt;
            letter-spacing: 0.12em;
          }
          .document-title { text-align: right; }
          .document-title h1 {
            margin: 0;
            font-size: 13pt;
            line-height: 1.05;
            letter-spacing: 0.02em;
            text-transform: uppercase;
          }
          .document-title p {
            margin: 1.4mm 0 0;
            color: var(--muted);
            font-size: 6.8pt;
            line-height: 1.35;
          }
          .hotel-line {
            margin: 2mm 0 2.2mm;
            color: var(--muted);
            font-size: 6.4pt;
          }
          .status-strip {
            display: grid;
            grid-template-columns: 0.82fr 1.08fr 1.08fr 0.84fr 1.42fr;
            gap: 1.6mm;
          }
          .status-box {
            min-height: 13mm;
            padding: 2.5mm 2.2mm;
            border: 0.25mm solid var(--line);
            border-radius: 2.2mm;
          }
          .status-box span,
          .detail-cell span,
          .supplemental-data span {
            display: block;
            color: #777777;
            font-size: 5.4pt;
            font-weight: 700;
            text-transform: uppercase;
          }
          .status-box strong {
            display: block;
            margin-top: 2.2mm;
            font-size: 9.2pt;
            line-height: 1;
          }
          .section-title {
            display: grid;
            grid-template-columns: max-content minmax(0, 1fr);
            gap: 4mm;
            align-items: center;
            margin: 2mm 0 1.3mm;
            font-size: 7.4pt;
            font-weight: 800;
            text-transform: uppercase;
          }
          .section-title::after {
            content: "";
            height: 0.2mm;
            background: var(--line-dark);
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1.05fr 1fr 1.05fr 1.04fr;
            border: 0.25mm solid var(--line);
            border-radius: 2.3mm;
            overflow: hidden;
          }
          .detail-cell {
            min-height: 8.2mm;
            padding: 1.6mm 2.4mm;
            border-right: 0.2mm solid #dddddd;
            border-bottom: 0.2mm solid #dddddd;
          }
          .detail-cell:nth-child(4n) { border-right: 0; }
          .detail-cell:nth-last-child(-n + 4) { border-bottom: 0; }
          .detail-cell strong,
          .supplemental-data strong {
            display: block;
            margin-top: 0.5mm;
            font-size: 7.4pt;
            line-height: 1.1;
            overflow-wrap: anywhere;
          }
          .supplemental-data {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 2mm;
            margin-top: 1.2mm;
          }
          .supplemental-data > div {
            padding: 1.5mm 2.3mm;
            border: 0.25mm solid var(--line);
            border-radius: 1.8mm;
          }
          .guest-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .guest-table th,
          .guest-table td {
            padding: 1.25mm 1.6mm;
            border: 0.2mm solid #dddddd;
            text-align: left;
            vertical-align: top;
            font-size: 6.8pt;
            line-height: 1.1;
            overflow-wrap: anywhere;
          }
          .guest-table th {
            color: #777777;
            font-size: 5.5pt;
            text-transform: uppercase;
            border-bottom-color: var(--line-dark);
          }
          .guest-table td:first-child { font-weight: 700; }
          .rules-intro {
            margin-top: 2.1mm;
            padding: 2mm 2.5mm;
            border: 0.25mm solid var(--line);
            border-radius: 2.1mm;
          }
          .rules-intro strong {
            display: block;
            margin-bottom: 0.7mm;
            font-size: 7.4pt;
            text-transform: uppercase;
          }
          .rules-intro p {
            margin: 0;
            color: var(--muted);
            font-size: 6.4pt;
            line-height: 1.25;
          }
          .rules-columns {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 5mm;
            margin-top: 2mm;
          }
          .rules-column { display: grid; align-content: start; gap: 2.2mm; }
          .rule-heading {
            display: grid;
            grid-template-columns: max-content minmax(0, 1fr);
            gap: 3mm;
            align-items: center;
            margin-bottom: 1.3mm;
            font-size: 7.1pt;
            font-weight: 800;
            text-transform: uppercase;
          }
          .rule-heading::after { content: ""; height: 0.2mm; background: var(--line); }
          .rule-list {
            list-style: none;
            margin: 0;
            padding: 0;
            display: grid;
            gap: 1mm;
          }
          .rule-list li {
            display: grid;
            grid-template-columns: 4.5mm minmax(0, 1fr);
            gap: 1.8mm;
            align-items: start;
            font-size: 7.2pt;
            line-height: 1.16;
          }
          .rule-number {
            width: 4.5mm;
            height: 4.5mm;
            border: 0.25mm solid var(--line-dark);
            border-radius: 50%;
            display: grid;
            place-items: center;
            font-size: 5.5pt;
            font-weight: 700;
            line-height: 1;
          }
          .document-footer { margin-top: auto; padding-top: 2.5mm; }
          .legal-value {
            min-height: 14mm;
            padding: 2.5mm 3mm;
            border: 0.3mm solid var(--line-dark);
            border-left-width: 1mm;
            border-radius: 0 2.2mm 2.2mm 0;
          }
          .legal-value strong {
            display: block;
            margin-bottom: 1.4mm;
            font-size: 7pt;
            text-transform: uppercase;
          }
          .legal-value p { margin: 0; font-size: 6.3pt; line-height: 1.28; }
          .signature-card {
            min-height: 29mm;
            margin-top: 3mm;
            padding: 3mm 4mm 2.5mm;
            border: 0.25mm solid var(--line);
            border-radius: 2.3mm;
            display: flex;
            flex-direction: column;
          }
          .signature-card > strong { font-size: 7.2pt; text-transform: uppercase; }
          .signature-line { margin: auto 2mm 2.8mm; border-bottom: 0.25mm solid var(--line-dark); }
          .signature-meta {
            display: flex;
            justify-content: space-between;
            gap: 6mm;
            color: var(--muted);
            font-size: 5.9pt;
          }
          @page { size: A4; margin: 0; }
          @media print {
            body { background: #ffffff; }
            .toolbar { display: none; }
            .print-shell { padding: 0; }
            .sheet {
              width: 210mm;
              height: 297mm;
              min-height: 297mm;
              margin: 0;
              box-shadow: none;
              overflow: hidden;
            }
          }
        </style>
      </head>
      <body>
        <div class="toolbar">
          <button type="button" class="ghost" onclick="window.close()">Cerrar</button>
          <button type="button" onclick="window.print()">Imprimir / Guardar PDF</button>
        </div>
        <main class="print-shell">
          <section class="sheet">
            <header class="sheet-header">
              <div class="wordmark-block">
                <div class="wordmark">Solanas</div>
                <div class="wordmark-sub">by <strong>BC PARADISE</strong></div>
              </div>
              <div class="document-title">
                <h1>Registro y constancia de ingreso</h1>
                <p>Hu&eacute;spedes, datos declarados y aceptaci&oacute;n del reglamento<br />${escapeHtml(
                  HOTEL_INFO.name
                )} &middot; Atenci&oacute;n las 24 horas</p>
              </div>
            </header>
            <div class="hotel-line">${escapeHtml(HOTEL_INFO.address)} &middot; Tel. ${escapeHtml(
              HOTEL_INFO.phone
            )} &middot; ${escapeHtml(HOTEL_INFO.hours)}</div>

            <div class="status-strip">
              <div class="status-box"><span>Hu&eacute;spedes</span><strong>${escapeHtml(
                String(totalGuests)
              )}</strong></div>
              <div class="status-box"><span>Ingreso</span><strong>${escapeHtml(
                formatDisplayDate(reservation.checkInDate)
              )}</strong></div>
              <div class="status-box"><span>Egreso</span><strong>${escapeHtml(
                formatDisplayDate(reservation.checkOutDate)
              )}</strong></div>
              <div class="status-box"><span>Habitaci&oacute;n</span><strong>${printableValue(
                reservation.roomNumber
              )}</strong></div>
              <div class="status-box"><span>R&eacute;gimen</span><strong>${escapeHtml(
                regimeLabel
              )}</strong></div>
            </div>

            <div class="section-title"><span>Datos de la reserva</span></div>
            <section class="details-grid">
              <div class="detail-cell"><span>Responsable</span><strong>${escapeHtml(responsibleName)}</strong></div>
              <div class="detail-cell"><span>DNI</span><strong>${printableValue(responsible.document)}</strong></div>
              <div class="detail-cell"><span>Tel&eacute;fono</span><strong>${printableValue(reservation.phone)}</strong></div>
              <div class="detail-cell"><span>Correo</span><strong>${printableValue(reservation.email)}</strong></div>
              <div class="detail-cell"><span>Procedencia / destino</span><strong>${printableValue(
                travelOrigin
              )}</strong></div>
              <div class="detail-cell"><span>Noches</span><strong>${printableValue(
                formatNightsLabel(reservation.nights || 1)
              )}</strong></div>
              <div class="detail-cell"><span>Patente</span><strong>${printableValue(
                reservation.licensePlate
              )}</strong></div>
              <div class="detail-cell"><span>R&eacute;gimen</span><strong>${escapeHtml(regimeLabel)}</strong></div>
              <div class="detail-cell"><span>Total pactado</span><strong>${
                showFinancialFields ? printableValue(paymentTotal) : "-"
              }</strong></div>
              <div class="detail-cell"><span>Pagado / saldo</span><strong>${
                showFinancialFields
                  ? `${escapeHtml(formatCurrency(paymentSummary.paid || 0))} / ${printableValue(paymentPending)}`
                  : "-"
              }</strong></div>
              <div class="detail-cell"><span>F. nac. responsable</span><strong>${printableValue(
                responsibleBirthDate
              )}${responsibleAgeInfo.age !== null ? ` &middot; ${escapeHtml(responsibleAgeInfo.shortLabel)}` : ""}</strong></div>
              <div class="detail-cell"><span>G&eacute;n. / nac.</span><strong>${escapeHtml(
                [responsible.gender || "-", responsible.nationality || DEFAULT_NATIONALITY].join(" / ")
              )}</strong></div>
            </section>
            ${supplementalDetails ? `<section class="supplemental-data">${supplementalDetails}</section>` : ""}

            <div class="section-title"><span>Hu&eacute;spedes que ocupan la habitaci&oacute;n</span></div>
            <table class="guest-table">
              <colgroup>
                <col style="width: 28%;" /><col style="width: 13%;" /><col style="width: 23%;" />
                <col style="width: 23%;" /><col style="width: 13%;" />
              </colgroup>
              <thead>
                <tr>
                  <th>Nombre y apellido</th><th>DNI</th><th>F. nac. / edad</th>
                  <th>G&eacute;n. / nac.</th><th>Reg. esp.</th>
                </tr>
              </thead>
              <tbody>${guestRows}</tbody>
            </table>

            <section class="rules-intro">
              <strong>Constancia de reglas del hotel</strong>
              <p>El titular o responsable declara haber le&iacute;do, comprendido y aceptado las normas detalladas a continuaci&oacute;n.</p>
            </section>
            <section class="rules-columns">
              <div class="rules-column">${leftRuleGroupsHtml}</div>
              <div class="rules-column">${rightRuleGroupsHtml}</div>
            </section>

            <footer class="document-footer">
              <section class="legal-value">
                <strong>Declaraci&oacute;n y valor legal</strong>
                <p>El titular o responsable declara haber le&iacute;do, comprendido y aceptado las reglas durante toda la estad&iacute;a. En caso de da&ntilde;os, p&eacute;rdidas o incumplimientos, acepta abonar el valor correspondiente al momento del egreso.</p>
              </section>
              <section class="signature-card">
                <strong>Firma del titular / responsable de la reserva</strong>
                <div class="signature-line" aria-hidden="true"></div>
                <div class="signature-meta">
                  <span>${escapeHtml(responsibleName)} &middot; DNI ${escapeHtml(
                    responsible.document || "________________"
                  )}</span>
                  <span>Impresi&oacute;n: ${escapeHtml(
                    formatDisplayDate(getTodayInputDate())
                  )} &middot; Generado: ${escapeHtml(generatedAt)}</span>
                </div>
              </section>
            </footer>
          </section>
        </main>
      </body>
    </html>
  `;
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
    <div class="success-toast-kicker">Operaci&oacute;n lista</div>
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

function getModuleNavItems(isWorkspaceOpen = false) {
  return isWorkspaceOpen ? WORKSPACE_MODULE_NAV_ITEMS : GENERAL_MODULE_NAV_ITEMS;
}

function renderModuleLinks(isWorkspaceOpen = false, linkClass = "floating-nav-link") {
  return getModuleNavItems(isWorkspaceOpen)
    .map(
      (module) => `
        <a class="${linkClass}" href="${module.href}">
          ${escapeHtml(module.label)}
        </a>
      `
    )
    .join("");
}

function renderFloatingModuleNav(isWorkspaceOpen = false) {
  if (SYSTEM_CHROME) {
    return "";
  }
  return `
    <div id="floating-module-nav" class="floating-module-nav" aria-hidden="true">
      <div class="floating-module-nav-inner">
        <div class="floating-module-links">
          ${renderModuleLinks(isWorkspaceOpen, "floating-nav-link")}
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
        const heroBottom = entry
          ? entry.boundingClientRect.bottom
          : heroSection.getBoundingClientRect().bottom;
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

function emitSystemEmbeddedHeight() {
  if (!SYSTEM_EMBEDDED || !window.parent || window.parent === window) {
    return;
  }

  window.requestAnimationFrame(() => {
    const appRoot = document.getElementById("app");
    const height = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
      appRoot ? appRoot.scrollHeight : 0
    );
    window.parent.postMessage(
      {
        type: "solanas:embedded-module-height",
        module: APP_MODE,
        height,
      },
      "*"
    );
  });
}

let embeddedCheckinModalViewportTrackingStarted = false;

function getEmbeddedCheckinModalViewport() {
  if (!SYSTEM_EMBEDDED || !window.parent || window.parent === window) {
    return null;
  }

  try {
    const parentDocument = window.parent.document;
    const frame = Array.from(parentDocument.querySelectorAll("iframe")).find(
      (candidate) => candidate.contentWindow === window
    );
    if (!frame) return null;

    const frameRect = frame.getBoundingClientRect();
    const scrollContainer = frame.closest(".app-main");
    const scrollRect = scrollContainer
      ? scrollContainer.getBoundingClientRect()
      : { top: 0, bottom: window.parent.innerHeight };
    const visualViewport = window.parent.visualViewport;
    const viewportTop = visualViewport ? visualViewport.offsetTop : 0;
    const viewportHeight = visualViewport
      ? visualViewport.height
      : window.parent.innerHeight || parentDocument.documentElement.clientHeight;
    const viewportBottom = viewportTop + viewportHeight;
    const visibleTop = Math.max(frameRect.top, scrollRect.top, viewportTop);
    const visibleBottom = Math.min(frameRect.bottom, scrollRect.bottom, viewportBottom);

    if (visibleBottom <= visibleTop) return null;

    return {
      top: Math.max(0, visibleTop - frameRect.top + window.scrollY),
      height: Math.max(1, visibleBottom - visibleTop),
    };
  } catch (error) {
    return null;
  }
}

function syncEmbeddedCheckinModalViewport() {
  if (!SYSTEM_EMBEDDED) return;

  const modalLayers = document.querySelectorAll(
    ".scanner-modal-backdrop, .scanner-modal-shell:not(.room-picker-confirm-shell)"
  );
  if (!modalLayers.length) return;

  const viewport = getEmbeddedCheckinModalViewport();
  if (!viewport) return;

  modalLayers.forEach((layer) => {
    layer.classList.add("is-parent-viewport-bound");
    layer.style.setProperty(
      "--embedded-checkin-modal-top",
      `${viewport.top}px`
    );
    layer.style.setProperty(
      "--embedded-checkin-modal-height",
      `${viewport.height}px`
    );
  });
}

function setupEmbeddedCheckinModalViewportTracking() {
  if (
    embeddedCheckinModalViewportTrackingStarted ||
    !SYSTEM_EMBEDDED ||
    !window.parent ||
    window.parent === window
  ) {
    return;
  }

  try {
    embeddedCheckinModalViewportTrackingStarted = true;
    window.parent.document.addEventListener(
      "scroll",
      syncEmbeddedCheckinModalViewport,
      true
    );
    window.parent.addEventListener("resize", syncEmbeddedCheckinModalViewport);
    window.parent.visualViewport?.addEventListener(
      "resize",
      syncEmbeddedCheckinModalViewport
    );
    window.parent.visualViewport?.addEventListener(
      "scroll",
      syncEmbeddedCheckinModalViewport
    );
  } catch (error) {
    embeddedCheckinModalViewportTrackingStarted = false;
  }
}

function requestEmbeddedModuleFocus(reason = "top", offsetTop = 0) {
  if (!SYSTEM_EMBEDDED || !window.parent || window.parent === window) {
    return;
  }

  window.parent.postMessage(
    {
      type: "solanas:focus-embedded-module",
      module: APP_MODE,
      reason,
      offsetTop: Number.isFinite(Number(offsetTop)) ? Number(offsetTop) : 0,
    },
    "*"
  );
}

function scrollToModuleTargetAfterRender(targetId) {
  window.requestAnimationFrame(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    if (SYSTEM_EMBEDDED) {
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      requestEmbeddedModuleFocus("target", targetTop);
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function focusModuleStartAfterRender() {
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestEmbeddedModuleFocus("top");
  });
}

function focusActiveModalAfterRender() {
  window.requestAnimationFrame(() => {
    if (SYSTEM_EMBEDDED) {
      syncEmbeddedCheckinModalViewport();
      return;
    }

    const activeModal = getManagedModalRoots()[0] || null;
    const modalTarget =
      activeModal && activeModal.closest(".scanner-modal-shell, .private-reservation-modal-shell")
        ? activeModal.closest(".scanner-modal-shell, .private-reservation-modal-shell")
        : activeModal ||
          document.querySelector(".room-picker-confirm-shell") ||
          document.querySelector(".scanner-modal-shell") ||
          document.querySelector(".private-reservation-modal-shell");
    if (modalTarget) {
      modalTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function renderHero(reservation, isWorkspaceOpen = false) {
  const modeMeta = APP_MODE_META[APP_MODE];
  const visibleReservations = getVisibleReservations();
  const todayOccupiedCount = getTodayOccupiedRoomNumbers().length;
  const workspaceReservation = isWorkspaceOpen ? reservation : null;
  const operationalInfo = workspaceReservation
    ? getReservationOperationalInfo(workspaceReservation)
    : null;
  const status = workspaceReservation ? getReservationStatus(workspaceReservation) : null;
  const filledGuests = workspaceReservation ? getFilledGuestCount(workspaceReservation) : 0;
  const stayRange = workspaceReservation
    ? formatStayRange(workspaceReservation.checkInDate, workspaceReservation.checkOutDate)
    : "";
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
                ? `<img class="brand-logo brand-logo--shell" src="${getSidebarIconUrl(
                    SHELL_HERO_ICON_KEY
                  )}" data-sidebar-icon-key="${SHELL_HERO_ICON_KEY}" alt="" />`
                : `<img class="brand-logo" src="${LOGO_URL}" alt="Solanas" />`
            }
            <div>
              <p class="eyebrow">${escapeHtml(
                SYSTEM_CHROME
                  ? "Blue Coast · Sistema hotelero"
                  : workspaceReservation
                  ? operationalInfo.heroEyebrow
                  : modeMeta.eyebrow
              )}</p>
              <h1>${escapeHtml(modeMeta.title)}</h1>
              <p>${escapeHtml(modeMeta.copy)}</p>
            </div>
          </div>
          <div class="hero-actions" style="margin-top: 18px;">
            ${
              isReservationsMode()
                ? `
                  <button class="button hero-action-button is-private-reservation" type="button" data-action="new-reservation">
                    <span class="reservation-action-icon is-private" aria-hidden="true"></span>
                    <span>Nueva reserva particular</span>
                  </button>
                  <button class="button hero-action-button is-group-reservation" type="button" data-action="open-group-load-modal">
                    <span class="reservation-action-icon is-group" aria-hidden="true"></span>
                    <span>Nueva reserva grupal</span>
                  </button>
                  <button class="ghost-button reservation-tariff-button" type="button" data-action="open-tariff-modal">
                    <span class="reservation-action-icon is-tariff" aria-hidden="true"></span>
                    <span>Tarifario particulares</span>
                  </button>
                `
                : !workspaceReservation
                  ? `
                    <button class="button hero-action-button is-private-reservation" type="button" data-action="new-walkin-checkin">
                      Cargar ingreso de mostrador
                    </button>
                  `
                  : ""
            }
            ${
              workspaceReservation
                ? `
                  <button class="ghost-button" type="button" data-action="close-reservation-workspace">
                    Volver al panel general
                  </button>
                  ${
                    isReservationPlaceholder(workspaceReservation)
                      ? ""
                      : `
                        <button class="ghost-button" type="button" data-action="archive-reservation">
                          Archivar reserva
                        </button>
                      `
                  }
                `
                : ""
            }
          </div>
        </div>
        <div class="hero-meta">
          <div class="chip-row">
            ${
              workspaceReservation
                ? `
                    <span class="status-badge ${status.className}">${escapeHtml(status.label)}</span>
                    <span class="pill">${escapeHtml(operationalInfo.label)}</span>
                  `
                : `<span class="pill">Panel general</span>`
            }
            <span class="pill">Registro local</span>
            <span class="pill">Hasta ${MAX_GUESTS} hu&eacute;spedes</span>
          </div>
          <div class="summary-card" style="width: 100%;">
            <div class="summary-label">
              ${workspaceReservation ? escapeHtml(operationalInfo.summaryLabel) : "Inicio de jornada"}
            </div>
            <span class="summary-value">
              ${
                workspaceReservation
                  ? escapeHtml(buildReservationTitle(workspaceReservation))
                  : visibleReservations.length
                    ? `${visibleReservations.length} reserva${
                        visibleReservations.length === 1 ? "" : "s"
                      } visible${visibleReservations.length === 1 ? "" : "s"}`
                    : "Sin reserva en carga"
              }
            </span>
            <span class="summary-foot">
              ${
                workspaceReservation
                  ? `${escapeHtml(operationalInfo.helperText)} &middot; ${filledGuests}/${
                      workspaceReservation.guests.length
                    } fichas con datos &middot; ${escapeHtml(
                      stayRange
                    )} &middot; &Uacute;ltima edici&oacute;n ${escapeHtml(
                      formatLocalDateTime(workspaceReservation.updatedAt)
                    )}`
                  : `Abre una reserva del historial o toca Cargar nueva reserva. Hoy hay ${todayOccupiedCount} habitaci&oacute;n${
                      todayOccupiedCount === 1 ? "" : "es"
                    } en uso.`
              }
            </span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderShellSidebar() {
  const activeKey = APP_MODE === "reservas" ? "reservas" : "checkin";

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
        <a class="module-sidebar__brand" href="${new URL(`../../#${getAuthorizedDefaultModule()}`, window.location.href).href}" data-shell-module-link="${getAuthorizedDefaultModule()}" target="_parent" aria-label="Ir al inicio permitido">
          <img class="module-sidebar__brand-logo-full" src="${BLUE_COAST_LOGO_URL}" alt="Blue Coast Sistema Hotelero" />
        </a>
      </div>
      <nav class="module-sidebar__nav" aria-label="Navegaci\u00f3n principal">
        ${getAuthorizedShellSidebarItems()
          .map((item) => {
            const iconUrl = getSidebarIconUrl(item.key);
            const iconMarkup = iconUrl
              ? `<img src="${iconUrl}" data-sidebar-icon-key="${escapeHtml(item.key)}" alt="" />`
              : escapeHtml(item.fallback || "*");
            return `
              <a
                class="module-sidebar__link ${activeKey === item.key ? "is-active" : ""}"
                href="${new URL(`../../#${item.key}`, window.location.href).href}"
                data-shell-module-link="${escapeHtml(item.key)}"
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

function renderSummaryCards() {
  const todayOccupiedCount = getTodayOccupiedRoomNumbers().length;
  const mealSummary = getMealCoverageSummary();
  return `
    <section class="summary-grid">
      <article class="summary-card">
        <div class="summary-card-header">
          <div class="summary-label">Reservas abiertas</div>
          <span class="summary-card-icon is-open" aria-hidden="true"><img src="${SUMMARY_ICON_URLS.openReservations}" alt="" /></span>
        </div>
        <span class="summary-value">${getOpenVisibleReservationsCount()}</span>
        <span class="summary-foot">Solo cuenta las reservas visibles del sistema.</span>
      </article>
      <article class="summary-card">
        <div class="summary-card-header">
          <div class="summary-label">Reservas confirmadas</div>
          <span class="summary-card-icon is-confirmed" aria-hidden="true"><img src="${SUMMARY_ICON_URLS.confirmedReservations}" alt="" /></span>
        </div>
        <span class="summary-value">${getReadyReservationsCount()}</span>
        <span class="summary-foot">Incluye confirmaciones individuales y reservas creadas desde carga grupal.</span>
      </article>
      <article class="summary-card">
        <div class="summary-card-header">
          <div class="summary-label">Habitaciones en uso hoy</div>
          <span class="summary-card-icon is-occupied" aria-hidden="true"><img src="${SUMMARY_ICON_URLS.occupiedRooms}" alt="" /></span>
        </div>
        <span class="summary-value">${todayOccupiedCount}</span>
        <span class="summary-foot">Control del d&iacute;a ${escapeHtml(formatDisplayDate(getTodayInputDate()))}.</span>
      </article>
      <article class="summary-card">
        <div class="summary-card-header">
          <div class="summary-label">Comidas de hoy</div>
          <span class="summary-card-icon is-meals" aria-hidden="true"><img src="${SUMMARY_ICON_URLS.meals}" alt="" /></span>
        </div>
        <div class="summary-split">
          <span>
            <small>Almuerzo</small>
            <strong>${mealSummary.lunch}</strong>
          </span>
          <span>
            <small>Cena</small>
            <strong>${mealSummary.dinner}</strong>
          </span>
        </div>
        <span class="summary-foot">
          Pensi&oacute;n Completa suma almuerzo y cena. Media Pensi&oacute;n suma solo cena. El d&iacute;a de egreso no cuenta.
        </span>
      </article>
    </section>
  `;
}

function renderGroupReservationBanner(reservation) {
  const company = getReservationCompanyLabel(reservation);
  if (!company) {
    return "";
  }
  const compMeta = getReservationGroupCompRoomMeta(reservation);

  return `
    <div class="tip-box group-context-box">
      <strong>Reserva grupal</strong>
      <p>
        Empresa ${escapeHtml(company)}.
        ${
          Number(reservation.groupRoomCount) > 0 && Number(reservation.groupRoomIndex) > 0
            ? ` Esta es la habitaci&oacute;n ${escapeHtml(reservation.groupRoomIndex)} de ${escapeHtml(
                reservation.groupRoomCount
              )} del grupo.`
            : ""
        }
        ${
          Number(reservation.groupTotalGuests) > 0
            ? ` El grupo inform&oacute; ${escapeHtml(
                reservation.groupTotalGuests
              )} personas tarifadas para esta reserva.`
            : ""
        }
        ${
          compMeta
            ? ` Esta habitaci&oacute;n est&aacute; marcada como ${escapeHtml(
                compMeta.label.toLowerCase()
              )} sin cargo, con un m&aacute;ximo de ${escapeHtml(String(compMeta.maxGuests))} ocupante${
                compMeta.maxGuests === 1 ? "" : "s"
              }.`
            : ""
        }
        Fechas, r&eacute;gimen y tarifas se administran desde Editar grupos; el titular real de esta
        habitaci&oacute;n puede completarse reci&eacute;n el d&iacute;a de llegada.
      </p>
    </div>
  `;
}

function renderResponsiblePanel(reservation) {
  const responsible = getTitular(reservation);
  const ageInfo = getResponsibleLegalAgeInfo(reservation);
  return `
    <section class="responsible-box" id="responsible-panel">
      <div class="panel-title-row">
        <div>
          <div class="eyebrow" style="margin-bottom: 8px; color: var(--accent); opacity: 1;">Responsable</div>
          <h3>Titular / responsable</h3>
          <p>
            Este responsable puede repetirse en m&aacute;s de una habitaci&oacute;n sin ocupar una plaza.
            Si tambi&eacute;n se aloja en esta habitaci&oacute;n, c&aacute;rgalo adem&aacute;s dentro de
            Hu&eacute;spedes.
          </p>
        </div>
        <div class="chip-row">
          <span class="chip ${ageInfo.isMinor === true ? "is-minor" : ""}">${escapeHtml(
            ageInfo.age === null ? "Edad al ingreso pendiente" : ageInfo.label
          )}</span>
          <button class="ghost-button is-compact scanner-action-button" type="button" data-action="open-bulk-guest-scanner">
            Escanear DNI
          </button>
        </div>
      </div>

      <div class="field-grid">
        <label class="field">
          <span>Nombre</span>
          <input
            id="responsible-firstName"
            data-responsible-field="firstName"
            type="text"
            class="${getRequiredFieldStateClass(Boolean(safeText(responsible.firstName)))}"
            value="${escapeHtml(responsible.firstName)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>Apellido</span>
          <input
            id="responsible-lastName"
            data-responsible-field="lastName"
            type="text"
            class="${getRequiredFieldStateClass(Boolean(safeText(responsible.lastName)))}"
            value="${escapeHtml(responsible.lastName)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>DNI</span>
          <input
            id="responsible-document"
            data-responsible-field="document"
            type="text"
            class="${getRequiredFieldStateClass(Boolean(responsible.document))}"
            value="${escapeHtml(responsible.document)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>Fecha de nac</span>
          <input
            id="responsible-birthDate"
            data-responsible-field="birthDate"
            type="text"
            inputmode="numeric"
            maxlength="10"
            class="${getRequiredFieldStateClass(Boolean(normalizeHumanDate(responsible.birthDate)))}"
            value="${escapeHtml(responsible.birthDate)}"
            placeholder="dd/mm/aaaa"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>G&eacute;nero</span>
          <select
            id="responsible-gender"
            data-responsible-field="gender"
            class="${getRequiredFieldStateClass(Boolean(responsible.gender))}"
          >
            <option value="" ${responsible.gender ? "" : "selected"}>Sin definir</option>
            <option value="F" ${responsible.gender === "F" ? "selected" : ""}>F</option>
            <option value="M" ${responsible.gender === "M" ? "selected" : ""}>M</option>
            <option value="X" ${responsible.gender === "X" ? "selected" : ""}>X</option>
          </select>
        </label>
        <label class="field">
          <span>Nacionalidad</span>
          <input
            id="responsible-nationality"
            data-responsible-field="nationality"
            type="text"
            class="${getRequiredFieldStateClass(Boolean(safeText(responsible.nationality || DEFAULT_NATIONALITY)))}"
            value="${escapeHtml(responsible.nationality || DEFAULT_NATIONALITY)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>Correo</span>
          <input
            id="field-email"
            data-reservation-field="email"
            type="text"
            inputmode="email"
            value="${escapeHtml(reservation.email)}"
            placeholder="recepcion@..."
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
          />
        </label>
        <label class="field">
          <span>Tel&eacute;fono</span>
          <input
            id="field-phone"
            data-reservation-field="phone"
            type="text"
            class="${getRequiredFieldStateClass(Boolean(safeText(reservation.phone)))}"
            value="${escapeHtml(reservation.phone)}"
            placeholder="+54 9 ..."
            autocomplete="off"
          />
        </label>
        <label class="field field-span-2">
          <span>Procedencia declarada</span>
          <input
            id="field-travelOrigin"
            data-reservation-field="travelOrigin"
            type="text"
            maxlength="${MAX_TRAVEL_ORIGIN_LENGTH}"
            value="${escapeHtml(getReservationTravelOrigin(reservation))}"
            placeholder="Ejemplo: C&oacute;rdoba Capital"
            autocomplete="off"
          />
          <small>Texto libre. Se duplicar&aacute; como destino en el Libro de Registro.</small>
        </label>
      </div>
      ${
        ageInfo.isMinor === true
          ? `
            <div class="warning-box" style="margin-top: 14px;">
              <strong>Titular no v&aacute;lido</strong>
              <p>
                Para esta reserva, el titular o responsable figura como menor de edad al momento
                del ingreso. Debes cargar un adulto responsable.
              </p>
            </div>
          `
          : ""
      }
    </section>
  `;
}

function renderBookingContactPanel(reservation) {
  const responsible = getTitular(reservation);
  const hasName = hasReservationBookingName(reservation);
  return `
    <section class="responsible-box booking-contact-box">
      <div class="panel-title-row">
        <div>
          <div class="eyebrow" style="margin-bottom: 8px; color: var(--accent); opacity: 1;">Reserva</div>
          <h3>Contacto de la reserva</h3>
          <p>
            Para reservar alcanza con una referencia clara. El legajo legal completo se carga luego,
            desde Check-in, cuando el hu&eacute;sped llega.
          </p>
        </div>
      </div>

      <div class="field-grid">
        <label class="field">
          <span>Nombre o referencia</span>
          <input
            id="responsible-firstName"
            data-responsible-field="firstName"
            data-defer-responsible-render="true"
            type="text"
            class="${getRequiredFieldStateClass(hasName)}"
            value="${escapeHtml(responsible.firstName)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>Apellido</span>
          <input
            id="responsible-lastName"
            data-responsible-field="lastName"
            data-defer-responsible-render="true"
            type="text"
            value="${escapeHtml(responsible.lastName)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>Tel&eacute;fono</span>
          <input
            id="field-phone"
            data-reservation-field="phone"
            type="text"
            value="${escapeHtml(reservation.phone)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>Correo</span>
          <input
            id="field-email"
            data-reservation-field="email"
            type="text"
            inputmode="email"
            value="${escapeHtml(reservation.email)}"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
          />
        </label>
        <label class="field field-span-2">
          <span>Procedencia declarada</span>
          <input
            id="field-travelOrigin"
            data-reservation-field="travelOrigin"
            type="text"
            maxlength="${MAX_TRAVEL_ORIGIN_LENGTH}"
            value="${escapeHtml(getReservationTravelOrigin(reservation))}"
            autocomplete="off"
          />
          <small>Opcional en reserva. Se completa o confirma al hacer Check-in.</small>
        </label>
      </div>
    </section>
  `;
}

function renderReservationDepositPanel(reservation) {
  if (!isReservationsMode() || isGroupReservation(reservation)) {
    return "";
  }

  const method = sanitizeDepositPaymentMethod(reservation.depositPaymentMethod);
  const isDeferred = method === "deferred";
  const requiresAmount = method === "cash" || method === "transfer";
  const hasDepositAmount = Boolean(parseAmount(reservation.depositAmount) > 0);
  const hasDeferredReason = Boolean(safeText(reservation.depositDeferredReason));
  const depositIssues = getReservationDepositIssues(reservation);

  return `
    <section class="booking-deposit-box">
      <div class="panel-title-row">
        <div>
          <div class="eyebrow" style="margin-bottom: 8px; color: var(--accent); opacity: 1;">Se&ntilde;a obligatoria</div>
          <h3>Reserva y se&ntilde;a</h3>
          <p>
            Toda reserva particular debe dejar asentada una se&ntilde;a o una excepci&oacute;n justificada.
          </p>
        </div>
        ${
          depositIssues.length
            ? `<span class="status-badge is-progress">Pendiente</span>`
            : `<span class="status-badge is-checked-in">Se&ntilde;a registrada</span>`
        }
      </div>
      <div class="field-grid">
        <label class="field">
          <span>Forma de se&ntilde;a</span>
          <select
            id="field-depositPaymentMethod"
            data-reservation-field="depositPaymentMethod"
            class="${getRequiredFieldStateClass(Boolean(method))}"
          >
            <option value="" ${method ? "" : "selected"}>Elegir</option>
            <option value="cash" ${method === "cash" ? "selected" : ""}>Efectivo</option>
            <option value="transfer" ${method === "transfer" ? "selected" : ""}>Transferencia</option>
            <option value="deferred" ${method === "deferred" ? "selected" : ""}>A saldar a futuro</option>
          </select>
        </label>
        <label class="field">
          <span>Monto de se&ntilde;a</span>
          <div
            class="${buildClassName(
              "money-field-shell",
              requiresAmount ? getRequiredFieldStateClass(hasDepositAmount) : ""
            )}"
          >
            <span class="money-prefix">$</span>
            <input
              id="field-depositAmount"
              data-reservation-field="depositAmount"
              type="text"
              inputmode="numeric"
              value="${escapeHtml(formatMoneyInputDisplay(reservation.depositAmount))}"
              autocomplete="off"
              ${isDeferred ? "disabled" : ""}
            />
          </div>
          <small>${isDeferred ? "No se carga monto: queda como excepci&oacute;n documentada." : "Puede ser cualquier monto mayor a cero."}</small>
        </label>
        <label class="field field-span-2"${isDeferred ? "" : " hidden"}>
          <span>Motivo de excepci&oacute;n</span>
          <textarea
            id="field-depositDeferredReason"
            data-reservation-field="depositDeferredReason"
            class="${getRequiredFieldStateClass(hasDeferredReason)}"
            maxlength="${MAX_RESERVATION_NOTES_LENGTH}"
          >${escapeHtml(reservation.depositDeferredReason)}</textarea>
          <small>Obligatorio si la se&ntilde;a se salda a futuro.</small>
        </label>
      </div>
    </section>
  `;
}

function renderReservationDepositBadge(reservation) {
  if (!isReservationsMode() || isGroupReservation(reservation)) {
    return "";
  }
  const method = sanitizeDepositPaymentMethod(reservation.depositPaymentMethod);
  const issues = getReservationDepositIssues(reservation);
  if (issues.length) {
    return `<span class="status-badge is-progress">SE&Ntilde;A PENDIENTE</span>`;
  }
  if (method === "deferred") {
    return `<span class="status-badge is-rust">SE&Ntilde;A A FUTURO</span>`;
  }
  const label = method === "transfer" ? "TRANSFERENCIA" : "EFECTIVO";
  return `<span class="status-badge is-checked-in">SE&Ntilde;A ${label} ${escapeHtml(
    formatCurrency(reservation.depositAmount)
  )}</span>`;
}

function renderReservationColorPicker(reservation) {
  if (getReservationCompanyLabel(reservation)) {
    return "";
  }

  const selectedColor = getReservationIndividualColor(reservation);
  const selectedInk = getReadableInkForGroupColor(selectedColor);

  return `
    <div class="field field-span-4 reservation-color-picker">
      <div class="reservation-color-preview">
        <span
          class="reservation-color-sample"
          style="--reservation-color: ${escapeHtml(selectedColor)}; --reservation-ink: ${escapeHtml(
            selectedInk
          )};"
          aria-hidden="true"
        ></span>
        <div>
          <span>Color en calendario</span>
          <small>Se asigna autom&aacute;ticamente; pod&eacute;s cambiarlo si quer&eacute;s distinguir esta reserva.</small>
        </div>
      </div>
      <details class="reservation-color-details">
        <summary id="reservation-color-summary">Cambiar color</summary>
        <div class="group-color-grid reservation-color-grid">
          ${GROUP_COLOR_PALETTE.map(
            (color, index) => `
              <button
                id="reservation-color-swatch-${index + 1}"
                class="group-color-swatch ${color === selectedColor ? "is-selected" : ""}"
                type="button"
                style="--group-color: ${escapeHtml(color)};"
                data-action="select-reservation-color"
                data-reservation-color="${escapeHtml(color)}"
                aria-label="Usar este color para la reserva particular"
              ></button>
            `
          ).join("")}
        </div>
      </details>
    </div>
  `;
}

function renderReservationFields(reservation) {
  const blockingIssue = getReservationBlockingIssue(reservation);
  const roomProfile = getRoomProfile(reservation.roomNumber);
  const guestCount = getReservationGuestCount(reservation);
  const showFinancialFields = shouldShowReservationFinancialFields(reservation);
  const isGroupRoom = isGroupReservation(reservation);
  const tariffInfo = showFinancialFields ? getReservationTariffInfo(reservation) : null;
  const adjustmentInfo = showFinancialFields ? getTariffAdjustmentInfo(reservation) : null;
  const totalMatchesTariff = Boolean(adjustmentInfo && adjustmentInfo.kind === "match");
  const hasTariffDifference = Boolean(adjustmentInfo && adjustmentInfo.kind !== "match");
  const roomFieldInvalid = Boolean(
    blockingIssue &&
      ["Hab. ocupada", "Mantenimiento", "Capacidad"].includes(blockingIssue.label)
  );
  const canEnableExtraBed = Boolean(roomProfile && canRoomUseExtraBed(roomProfile, guestCount));
  const showRoomCapacityBox = Boolean(
    roomProfile &&
      ((blockingIssue && blockingIssue.label === "Capacidad") ||
        reservation.allowExtraBed ||
        canEnableExtraBed ||
        (tariffInfo && tariffInfo.usesRoomBase) ||
        isRoomUnderMaintenance(roomProfile.roomNumber))
  );
  const financialFieldAttribute = showFinancialFields ? "" : " hidden";
  const groupLockedAttribute = isGroupRoom ? " disabled" : "";
  const groupLockedHint = isGroupRoom
    ? `<small>Este dato se modifica desde Editar grupos.</small>`
    : "";
  const checkInLockedAttribute =
    isGroupRoom || reservation.walkInToday === true ? " disabled" : "";
  const checkInLockedHint =
    reservation.walkInToday === true
      ? `<small>Ingreso de mostrador: el Check-in queda fijado en hoy.</small>`
      : groupLockedHint;
  const roomHeadline = getReservationRoomHeadlineData(reservation);
  const roomPickerMessage =
    roomFieldInvalid && blockingIssue
      ? blockingIssue.message
      : roomProfile
        ? getRoomCapacitySummary(roomProfile)
        : "Elige la habitacion desde una ventana aparte, escribiendo el numero o tocandola en el mapa.";
  return `
    <div class="field-grid reservation-stay-grid">
      <div id="rooms-section" class="field field-span-2">
        <span>Habitaci&oacute;n</span>
        <div
          class="${buildClassName(
            "room-picker-shell",
            getRequiredFieldStateClass(Boolean(reservation.roomNumber)),
            roomFieldInvalid ? "is-invalid" : ""
          )}"
        >
          <div class="room-picker-copy">
            <strong>${escapeHtml(roomHeadline.title)}</strong>
            <span>${escapeHtml(roomHeadline.detail)}</span>
          </div>
          <button
            id="open-room-picker-button"
            class="button is-compact"
            type="button"
            data-action="open-room-picker-modal"
          >
            Elegir habitaci&oacute;n
          </button>
        </div>
        <small class="${roomFieldInvalid ? "is-danger" : ""}">${escapeHtml(roomPickerMessage)}</small>
      </div>
      <label class="field">
        <span>Check-in</span>
        <input
          id="field-checkInDate"
          data-reservation-field="checkInDate"
          type="date"
          lang="es-AR"
          data-date-picker="true"
          class="${buildClassName(
            getRequiredFieldStateClass(Boolean(reservation.checkInDate)),
            blockingIssue && blockingIssue.label === "Fechas" ? "is-invalid" : ""
          )}"
          value="${escapeHtml(normalizeInputDate(reservation.checkInDate) || "")}"
          autocomplete="off"
          ${checkInLockedAttribute}
        />
        ${checkInLockedHint}
      </label>
      <label class="field field-checkout-align">
        <span>Check-out</span>
        <input
          id="field-checkOutDate"
          data-reservation-field="checkOutDate"
          type="date"
          lang="es-AR"
          data-date-picker="true"
          class="${buildClassName(
            getRequiredFieldStateClass(Boolean(reservation.checkOutDate)),
            blockingIssue && blockingIssue.label === "Fechas" ? "is-invalid" : ""
          )}"
          min="${escapeHtml(getMinimumCheckOutDate(reservation.checkInDate))}"
          value="${escapeHtml(normalizeInputDate(reservation.checkOutDate) || "")}"
          autocomplete="off"
          ${groupLockedAttribute}
        />
        ${groupLockedHint}
      </label>
      <label class="field">
        <span>Noches</span>
        <input
          id="field-nights"
          data-reservation-field="nights"
          type="number"
          min="1"
          value="${escapeHtml(reservation.nights)}"
          placeholder="1"
          ${groupLockedAttribute}
        />
        ${groupLockedHint}
      </label>
      <label class="field">
        <span>R&eacute;gimen</span>
        <select
          id="field-regime"
          data-reservation-field="regime"
          class="${getRequiredFieldStateClass(Boolean(sanitizeRegime(reservation.regime)))}"
          ${groupLockedAttribute}
        >
          ${REGIME_OPTIONS.map(
            (option) =>
              `<option value="${escapeHtml(option)}"${
                reservation.regime === option ? " selected" : ""
              }>${escapeHtml(option || "Elegir")}</option>`
          ).join("")}
        </select>
        ${groupLockedHint}
      </label>
      <label class="field">
        <span>Patente</span>
        <input
          id="field-licensePlate"
          data-reservation-field="licensePlate"
          type="text"
          value="${escapeHtml(reservation.licensePlate)}"
          placeholder="Ejemplo: AB123CD"
          autocomplete="off"
        />
      </label>
      <label class="field">
        <span>Hu&eacute;spedes</span>
        <input
          id="field-guestCount"
          data-reservation-field="guestCount"
          type="number"
          min="1"
          max="${MAX_GUESTS}"
          class="${getRequiredFieldStateClass(Boolean(guestCount))}"
          value="${escapeHtml(String(guestCount))}"
          ${isGroupRoom ? "disabled" : ""}
        />
        ${
          isGroupRoom
            ? groupLockedHint
            : `<small>Define cu&aacute;ntos pasajeros usar&aacute;n esta habitaci&oacute;n.</small>`
        }
      </label>
      ${renderReservationColorPicker(reservation)}
      <label class="field reservation-total-field"${financialFieldAttribute}>
        <span>Total</span>
        <div
          class="${buildClassName(
            "money-field-shell",
            getRequiredFieldStateClass(Boolean(parseAmount(reservation.total) > 0))
          )}"
        >
          <span class="money-prefix">$</span>
          <input
            id="field-total"
            data-reservation-field="total"
            type="text"
            inputmode="numeric"
            value="${escapeHtml(formatMoneyInputDisplay(reservation.total))}"
            placeholder="0"
            autocomplete="off"
          />
        </div>
        <small>${
          reservation.total
            ? `Actual ${escapeHtml(formatCurrency(reservation.total))}`
            : "Monto final editable o sugerido por tarifario."
        }</small>
      </label>
      <div class="field field-span-4 pricing-box reservation-pricing-box ${totalMatchesTariff ? "is-current" : ""}"${financialFieldAttribute}>
        <div class="pricing-copy">
          <strong>Tarifario sugerido</strong>
          ${
            tariffInfo
              ? `
                <p>
                  ${escapeHtml(tariffInfo.label)} &middot; ${tariffInfo.billedGuestCount} plaza${
                    tariffInfo.billedGuestCount === 1 ? "" : "s"
                  } &middot; ${escapeHtml(formatNightsLabel(tariffInfo.nights))}.
                </p>
                <p>
                  ${escapeHtml(formatCurrency(tariffInfo.rate))} por plaza y noche &middot; Total sugerido
                  ${escapeHtml(formatCurrency(tariffInfo.suggestedTotal))}.
                </p>
                ${
                  tariffInfo.supplementRate
                    ? `<p>${escapeHtml(tariffInfo.supplementLabel)}: ${escapeHtml(
                        formatCurrency(tariffInfo.supplementRate)
                      )} por persona y noche.</p>`
                    : ""
                }
                ${
                  tariffInfo.usesRoomBase
                    ? `<p>Viajan ${tariffInfo.actualGuestCount} pasajero${
                        tariffInfo.actualGuestCount === 1 ? "" : "s"
                      }, pero la habitaci&oacute;n elegida se cobra como ${tariffInfo.billedGuestCount} plazas.</p>`
                    : ""
                }
                ${
                  adjustmentInfo
                    ? adjustmentInfo.kind === "match"
                      ? `<p>El total cargado coincide con la tarifa sugerida.</p>`
                      : adjustmentInfo.kind === "discount"
                        ? `<p>Bonificaci&oacute;n aplicada: ${escapeHtml(
                            formatCurrency(adjustmentInfo.absoluteAmount)
                          )} menos sobre la tarifa sugerida (${escapeHtml(
                            formatPercent(adjustmentInfo.percent)
                          )}).</p>`
                        : `<p>Ajuste sobre tarifa: ${escapeHtml(
                            formatCurrency(adjustmentInfo.absoluteAmount)
                          )} por encima de la sugerencia (${escapeHtml(
                            formatPercent(adjustmentInfo.percent)
                          )}).</p>`
                    : reservation.total
                      ? `<p>El total actual todav&iacute;a no se pudo comparar contra una tarifa sugerida.</p>`
                      : `<p>Todav&iacute;a no hay un total aplicado para comparar.</p>`
                }
              `
              : `
                <p>
                  El tarifario se activa con noches definidas y una base simple, doble, triple o
                  cu&aacute;druple.
                </p>
                <p>
                  Si la habitaci&oacute;n elegida tiene una base mayor que la cantidad de pasajeros, la
                  sugerencia respeta esa tarifa de habitaci&oacute;n.
                </p>
              `
          }
        </div>
        <div class="pricing-actions">
          ${
            tariffInfo
              ? totalMatchesTariff
                ? `<span class="chip is-highlight">Tarifa aplicada</span>`
                : `
                    <button
                      id="apply-tariff-total-button"
                      class="button is-compact"
                      type="button"
                      data-action="apply-tariff-total"
                    >
                      Usar total sugerido
                    </button>
                  `
              : ""
          }
        </div>
      </div>
      ${
        hasTariffDifference
          ? `
            <label class="field field-span-4">
              <span>Motivo de la bonificaci&oacute;n o ajuste</span>
              <input
                id="field-discountNote"
                data-reservation-field="discountNote"
                type="text"
                value="${escapeHtml(reservation.discountNote)}"
                placeholder="Ejemplo: cortesia comercial, promocion especial, tarifa acordada..."
                autocomplete="off"
              />
              <small>Este resumen aparecer&aacute; tambi&eacute;n al pie del libro de hu&eacute;spedes.</small>
            </label>
          `
          : ""
      }
      ${
        showRoomCapacityBox
          ? `
            <div class="field field-span-4 room-capacity-box ${
              blockingIssue && blockingIssue.label === "Capacidad"
                ? "is-warning"
                : reservation.allowExtraBed
                  ? "is-exception"
                  : ""
            }">
              <div class="room-capacity-copy">
                <strong>Hab. ${escapeHtml(roomProfile.roomNumber)} &middot; ${escapeHtml(
                  roomProfile.label
                )}</strong>
                <p>${escapeHtml(getRoomCapacitySummary(roomProfile))}</p>
                <p>
                  Reserva actual: ${guestCount} pasajero${guestCount === 1 ? "" : "s"}.${
                    isRoomUnderMaintenance(roomProfile.roomNumber)
                      ? " Esta habitaci&oacute;n est&aacute; deshabilitada por mantenimiento."
                      : ""
                  }
                </p>
                ${
                  tariffInfo && tariffInfo.usesRoomBase
                    ? `<p>Tarifa sugerida: esta habitaci&oacute;n se liquida como ${tariffInfo.billedGuestCount} plazas aunque viajen ${tariffInfo.actualGuestCount}.</p>`
                    : ""
                }
              </div>
              <div class="room-capacity-actions">
                ${
                  tariffInfo && tariffInfo.usesRoomBase
                    ? `<span class="chip">Tarifa por ${tariffInfo.billedGuestCount} plazas</span>`
                    : ""
                }
                ${
                  reservation.allowExtraBed
                    ? `<span class="chip is-highlight">Excepci&oacute;n activa</span>`
                    : ""
                }
                ${
                  reservation.allowExtraBed || canEnableExtraBed
                    ? `
                      <button
                        class="ghost-button is-compact"
                        type="button"
                        data-action="toggle-extra-bed"
                      >
                        ${
                          reservation.allowExtraBed
                            ? "Quitar cama extra"
                            : "Habilitar cama extra"
                        }
                      </button>
                    `
                    : ""
                }
              </div>
            </div>
          `
          : ""
      }
      <label class="field field-span-4">
        <span>Observaciones</span>
        <textarea
          id="field-notes"
          data-reservation-field="notes"
          maxlength="${MAX_RESERVATION_NOTES_LENGTH}"
          rows="2"
          placeholder="Notas de recepci&oacute;n, r&eacute;gimen especial, llegada tard&iacute;a, etc."
        >${escapeHtml(reservation.notes)}</textarea>
        <small>M&aacute;ximo ${MAX_RESERVATION_NOTES_LENGTH} caracteres.</small>
      </label>
    </div>
  `;
}

function renderLegalPacketAction(reservation, operationalInfo, options = {}) {
  if (!isCheckinMode()) {
    return "";
  }
  if (!canPrintLegalPacket(reservation)) {
    return "";
  }

  const { compact = false } = options;
  if (isLegalPacketPrintedCurrent(reservation)) {
    return `
      <div class="legal-print-current-control${compact ? " is-compact" : ""}">
        <span class="status-badge is-printed legal-print-state${
          compact ? " is-compact" : ""
        }">Formulario impreso</span>
        <button
          class="ghost-button is-compact legal-reprint-button"
          type="button"
          data-action="print-legal-packet"
          data-reservation-id="${escapeHtml(reservation.id)}"
          aria-label="Reimprimir formulario y reglamento"
          title="Reimprimir formulario y reglamento"
        >
          Reimprimir
        </button>
      </div>
    `;
  }

  const label = reservation.lastPrintedAt
    ? "Reimprimir formulario actualizado"
    : operationalInfo.printActionLabel;
  const buttonClass = compact ? "button is-compact" : "ghost-button";
  return `
    <button
      class="${buttonClass}"
      type="button"
      data-action="print-legal-packet"
      data-reservation-id="${escapeHtml(reservation.id)}"
    >
      ${escapeHtml(label)}
    </button>
  `;
}

function renderReservationConfirmationPanel(reservation) {
  if (!canReservationAttemptConfirmation(reservation)) {
    return "";
  }

  const operationalInfo = getReservationOperationalInfo(reservation);
  const hardIssues = getReservationConfirmationHardIssues(reservation);
  const softWarnings = getReservationConfirmationSoftWarnings(reservation);
  const isConfirmed = Boolean(reservation.confirmedAt);
  const bookingMode = isReservationsMode();
  const roomAccessIssues = isConfirmed && isCheckinMode() ? getRoomAccessIssues(reservation) : [];
  const canPrintPacket = isCheckinMode() && canPrintLegalPacket(reservation);
  const isPrintCurrent = isLegalPacketPrintedCurrent(reservation);
  const legacyPrintNote = canPrintPacket
    ? reservation.lastPrintedAt
      ? `Última impresión legal: ${formatLocalDateTime(reservation.lastPrintedAt)}.`
      : operationalInfo.printHelper
    : isConfirmed
      ? "La reserva ya está confirmada, pero todavía falta completar el legajo de ocupantes para habilitar el ingreso y la impresión."
      : "Confirma la reserva para habilitar el formulario legal prellenado.";

  const printNote = canPrintPacket
    ? isPrintCurrent
      ? `Formulario impreso y vigente desde ${formatLocalDateTime(reservation.lastPrintedAt)}.`
      : reservation.lastPrintedAt
        ? "La reserva se edit\u00f3 despu\u00e9s de la \u00faltima impresi\u00f3n. Conviene reimprimir el formulario."
        : operationalInfo.printHelper
    : legacyPrintNote;
  const panelPrintNote = bookingMode
    ? isConfirmed
      ? "La reserva ya quedo registrada. Cuando llegue el huesped, continua desde Check-in para legajo, saldo e impresion."
      : "Confirma la reserva para dejar asentados habitacion, fechas, precio pactado y se\u00f1a."
    : printNote;

  return `
    <section class="confirmation-box ${isConfirmed ? "is-confirmed" : ""}">
      <div class="confirmation-copy">
        <div class="eyebrow" style="margin-bottom: 8px; color: var(--accent); opacity: 1;">Paso final</div>
        <h3>${isConfirmed ? "Reserva confirmada" : "Confirmar reserva"}</h3>
        <p>
          ${
            isConfirmed
              ? `La reserva fue confirmada el ${escapeHtml(
                  formatLocalDateTime(reservation.confirmedAt)
                )}. Puedes volver a revisarla, reconfirmarla o completar el legajo para habilitar el ingreso de la habitaci&oacute;n.`
              : "La habitación ya está elegida. Usa este paso para dejar asentada la reserva en el sistema."
          }
        </p>
      </div>
      <div class="confirmation-meta">
        ${
          hardIssues.length
            ? `
              <div class="warning-box">
                <strong>No se puede confirmar todavía</strong>
                <ul class="warning-list" style="margin-top: 10px;">
                  ${hardIssues.map((issue) => `<li>${escapeHtml(issue)}</li>`).join("")}
                </ul>
              </div>
            `
            : softWarnings.length
              ? `
                <div class="tip-box">
                  <strong>Hay datos a revisar</strong>
                  <p>
                    Podrás confirmar igual, pero el sistema te volverá a mostrar estos faltantes en
                    la ventana final.
                  </p>
                </div>
              `
              : `
                <div class="tip-box">
                  <strong>Todo listo para confirmar</strong>
                  <p>La reserva ya tiene base suficiente para quedar confirmada en la app.</p>
                </div>
              `
        }
        <div class="tip-box">
          <strong>${escapeHtml(operationalInfo.label)}</strong>
          <p>${escapeHtml(panelPrintNote)}</p>
        </div>
        ${
          isConfirmed && isCheckinMode()
            ? canPrintPacket
              ? `
                <div class="tip-box">
                  <strong>Ingreso habilitado</strong>
                  <p>El responsable y los ocupantes reales ya tienen el legajo completo para imprimir y firmar.</p>
                </div>
              `
              : `
                <div class="warning-box">
                  <strong>Ingreso pendiente</strong>
                  <ul class="warning-list" style="margin-top: 10px;">
                    ${roomAccessIssues.map((issue) => `<li>${escapeHtml(issue)}</li>`).join("")}
                  </ul>
                </div>
              `
            : ""
        }
        ${isCheckinMode() ? renderStayPaymentHistoryButton(reservation) : ""}
        ${renderLegalPacketAction(reservation, operationalInfo)}
      </div>
      <div class="confirmation-actions">
        <button
          id="open-reservation-confirm-modal-button"
          class="button confirm-action-button"
          type="button"
          data-action="open-reservation-confirm-modal"
        >
          ${isConfirmed ? "Confirmar cambios" : "Confirmar reserva"}
        </button>
      </div>
    </section>
  `;
}

function renderReservationPanel(reservation) {
  const status = getReservationStatus(reservation);
  const operationalInfo = getReservationOperationalInfo(reservation);
  const groupSummary = getGroupReservationSummary(reservation, { includeFinancials: false });
  const guestCount = getReservationGuestCount(reservation);
  const roomHeadline = getReservationRoomHeadlineData(reservation);
  const minorCount = reservation.guests.filter(
    (guest) => getLegalAgeInfo(guest).isMinor === true
  ).length;
  const showFinancialFields = shouldShowReservationFinancialFields(reservation);
  const tariffInfo = showFinancialFields ? getReservationTariffInfo(reservation) : null;
  const stayRange = formatStayRange(reservation.checkInDate, reservation.checkOutDate);
  const bookingMode = isReservationsMode();
  const privateModalMode = bookingMode && ui.isPrivateReservationModalOpen;
  return `
    <section class="panel" id="reservation-active-panel">
      <div class="panel-title-row">
        <div>
          <h2>${
            privateModalMode ? "Reserva particular" : bookingMode ? "Carga de reserva" : "Carga de Check-in"
          }</h2>
          <div class="reservation-heading-meta ${roomHeadline.roomProfile ? "is-ready" : ""}">
            <strong>${escapeHtml(roomHeadline.title)}</strong>
            <span>${escapeHtml(roomHeadline.detail)}</span>
          </div>
          <p>
            ${
              bookingMode
                ? "Este m&oacute;dulo deja asentada la reserva, el precio pactado y la se&ntilde;a sin exigir todav&iacute;a el legajo legal completo."
                : `Este m&oacute;dulo carga el legajo completo, registra el saldo de hotel y reci&eacute;n entonces habilita la impresi&oacute;n legal. ${escapeHtml(
                    operationalInfo.helperText
                  )}`
            }
          </p>
        </div>
        <div class="chip-row">
          <span class="status-badge ${status.className}">${escapeHtml(status.label)}</span>
          <span class="chip">${escapeHtml(operationalInfo.label)}</span>
          <span class="chip">${escapeHtml(stayRange)}</span>
          ${groupSummary ? `<span class="chip">${escapeHtml(groupSummary)}</span>` : ""}
          <span class="chip">${
            bookingMode ? "Legajo se completa en Check-in" : `Hu&eacute;spedes cargados: ${guestCount}`
          }</span>
          ${
            minorCount
              ? `<span class="chip is-minor">Menores: ${minorCount}</span>`
              : ""
          }
          ${
            showFinancialFields
              ? `
                <span class="chip">
                  ${
                    tariffInfo
                      ? `Tarifa sugerida ${escapeHtml(formatCurrency(tariffInfo.suggestedTotal))}`
                      : "Tarifa pendiente"
                  }
                </span>
                ${reservation.total ? `<span class="chip">Total ${escapeHtml(formatCurrency(reservation.total))}</span>` : ""}
              `
              : ""
          }
        </div>
      </div>
      ${renderGroupReservationBanner(reservation)}
      ${bookingMode ? renderBookingContactPanel(reservation) : renderResponsiblePanel(reservation)}
      ${
        bookingMode
          ? ""
          : `
            <div class="panel-title-row" style="margin-top: 22px;">
              <div>
                <h3>Hu&eacute;spedes</h3>
                <p>
                  Cada tarjeta corresponde a una persona que ocupar&aacute; esta habitaci&oacute;n. El
                  titular o responsable puede coincidir o no con alguno de ellos.
                </p>
              </div>
              <div class="actions-row">
                <button class="ghost-button is-compact" type="button" data-action="add-guest">
                  Agregar hu&eacute;sped
                </button>
              </div>
            </div>

            <div class="guest-grid">
              ${reservation.guests.map((guest, index) => renderGuestCardV2(guest, index)).join("")}
            </div>
          `
      }
      ${renderReservationFields(reservation)}
      ${renderReservationDepositPanel(reservation)}
      ${renderReservationConfirmationPanel(reservation)}
    </section>
  `;
}

function renderPrivateReservationModal(reservation = getActiveReservation()) {
  if (!ui.isPrivateReservationModalOpen || !isReservationsMode() || !reservation) {
    return "";
  }

  const isNewReservation = isReservationPlaceholder(reservation);
  return `
    <div class="scanner-modal-backdrop" data-action="close-private-reservation-modal"></div>
    <section
      class="scanner-modal-shell private-reservation-modal-shell"
      aria-modal="true"
      role="dialog"
      aria-labelledby="private-reservation-modal-title"
    >
      <div class="scanner-modal private-reservation-modal">
        <div class="scanner-modal-toolbar">
          <div>
            <p class="scanner-modal-kicker">Reservas particulares</p>
            <h2 id="private-reservation-modal-title">${
              isNewReservation ? "Nueva reserva particular" : "Editar reserva particular"
            }</h2>
            <p class="scanner-helper">
              Carga contacto, habitaci&oacute;n, estad&iacute;a, tarifa pactada y se&ntilde;a desde una ventana emergente.
            </p>
          </div>
          <button
            id="close-private-reservation-modal-button"
            class="ghost-button is-compact"
            type="button"
            data-action="close-private-reservation-modal"
          >
            Cerrar
          </button>
        </div>
        <div class="private-reservation-modal-body">
          ${renderReservationPanel(reservation)}
        </div>
      </div>
    </section>
  `;
}

function renderGuestCard(guest, index) {
  const isActive = guest.id === ui.activeGuestId;
  const status = getGuestStatus(guest);
  const warnings =
    guest.parseMeta && Array.isArray(guest.parseMeta.warnings) ? guest.parseMeta.warnings : [];
  const guestTitle =
    [guest.firstName, guest.lastName].filter(Boolean).join(" ").trim() ||
    `${getGuestRoleLabel(index)} sin cargar`;
  const guestClasses = [
    "guest-card",
    isActive ? "is-active" : "",
    status.className === "is-progress" ? "is-warning" : "",
    !hasGuestData(guest) ? "is-empty" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <article class="${guestClasses}">
      <div class="guest-card-head">
        <div class="guest-card-copy">
          <div class="chip-row">
            <span class="guest-role ${index === 0 ? "" : "is-secondary"}">
              ${escapeHtml(getGuestRoleLabel(index))}
            </span>
            <span class="status-badge ${status.className}">${escapeHtml(status.label)}</span>
          </div>
          <div class="guest-name">${escapeHtml(guestTitle)}</div>
          <div class="guest-meta">
            ${
              guest.document
                ? `${escapeHtml(guest.document)} &middot; `
                : ""
            }${escapeHtml(normalizeHumanDate(guest.birthDate) || guest.birthDate || "Sin fecha de nac.")}
          </div>
        </div>
        <div class="history-actions">
          ${
            index === 0
              ? `
                <button class="ghost-button is-compact" type="button" data-action="copy-responsible-to-guest" data-guest-id="${guest.id}">
                  Replicar titular
                </button>
              `
              : ""
          }
          <button class="ghost-button is-compact scanner-action-button" type="button" data-action="select-guest" data-guest-id="${guest.id}">
            Escanear aqu&iacute;
          </button>
          <button class="ghost-button is-compact" type="button" data-action="clear-guest" data-guest-id="${guest.id}">
            Limpiar
          </button>
          ${
            index === 0
              ? ""
              : `
                <button class="danger-button is-compact" type="button" data-action="remove-guest" data-guest-id="${guest.id}">
                  Quitar
                </button>
              `
          }
        </div>
      </div>

      <div class="field-grid">
        <label class="field">
          <span>Nombre</span>
          <input
            id="guest-firstName-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="firstName"
            type="text"
            class="${getRequiredFieldStateClass(Boolean(safeText(guest.firstName)))}"
            value="${escapeHtml(guest.firstName)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>Apellido</span>
          <input
            id="guest-lastName-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="lastName"
            type="text"
            class="${getRequiredFieldStateClass(Boolean(safeText(guest.lastName)))}"
            value="${escapeHtml(guest.lastName)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>DNI</span>
          <input
            id="guest-document-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="document"
            type="text"
            class="${getRequiredFieldStateClass(Boolean(guest.document))}"
            value="${escapeHtml(guest.document)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>Fecha de nac</span>
          <input
            id="guest-birthDate-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="birthDate"
            type="text"
            inputmode="numeric"
            maxlength="10"
            class="${getRequiredFieldStateClass(Boolean(normalizeHumanDate(guest.birthDate)))}"
            value="${escapeHtml(guest.birthDate)}"
            placeholder="dd/mm/aaaa"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>G&eacute;nero</span>
          <select
            id="guest-gender-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="gender"
            class="${getRequiredFieldStateClass(Boolean(guest.gender))}"
          >
            <option value="" ${guest.gender ? "" : "selected"}>Sin definir</option>
            <option value="F" ${guest.gender === "F" ? "selected" : ""}>F</option>
            <option value="M" ${guest.gender === "M" ? "selected" : ""}>M</option>
            <option value="X" ${guest.gender === "X" ? "selected" : ""}>X</option>
          </select>
        </label>
        <label class="field">
          <span>Nacionalidad</span>
          <input
            id="guest-nationality-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="nationality"
            type="text"
            class="${getRequiredFieldStateClass(Boolean(safeText(guest.nationality || DEFAULT_NATIONALITY)))}"
            value="${escapeHtml(guest.nationality || DEFAULT_NATIONALITY)}"
            autocomplete="off"
          />
        </label>
      </div>

      ${
        guest.rawScan
          ? `
            <div class="tip-box">
              <strong>Lectura guardada</strong>
              <p class="mono">${escapeHtml(guest.rawScan)}</p>
              ${
                guest.parseMeta
                  ? `
                    <div class="chip-row" style="margin-top: 10px;">
                      <span class="result-pill is-${guest.parseMeta.confidence || "medium"}">
                        ${escapeHtml(guest.parseMeta.format || "Lectura")}
                      </span>
                      <span class="chip">Confianza ${escapeHtml(guest.parseMeta.confidence || "media")}</span>
                    </div>
                  `
                  : ""
              }
              ${
                warnings.length
                  ? `
                    <ul class="warning-list" style="margin-top: 10px;">
                      ${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}
                    </ul>
                  `
                  : ""
              }
            </div>
          `
          : ""
      }
    </article>
  `;
}

function renderGuestCardV2(guest, index) {
  const isActive = guest.id === ui.activeGuestId;
  const status = getGuestStatus(guest);
  const ageInfo = getLegalAgeInfo(guest);
  const warnings =
    guest.parseMeta && Array.isArray(guest.parseMeta.warnings) ? guest.parseMeta.warnings : [];
  const guestTitle =
    [guest.firstName, guest.lastName].filter(Boolean).join(" ").trim() ||
    `${getGuestRoleLabel(index)} sin cargar`;
  const guestClasses = [
    "guest-card",
    isActive ? "is-active" : "",
    status.className === "is-progress" ? "is-warning" : "",
    !hasGuestData(guest) ? "is-empty" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <article class="${guestClasses}">
      <div class="guest-card-head">
        <div class="guest-card-copy">
          <div class="chip-row">
            <span class="guest-role ${index === 0 ? "" : "is-secondary"}">
              ${escapeHtml(getGuestRoleLabel(index))}
            </span>
            <span class="status-badge ${status.className}">${escapeHtml(status.label)}</span>
            ${
              ageInfo.isMinor === true
                ? `<span class="chip is-minor">Menor de edad</span>`
                : ""
            }
          </div>
          <div class="guest-name">${escapeHtml(guestTitle)}</div>
          <div class="guest-meta">
            ${guest.document ? `${escapeHtml(guest.document)} &middot; ` : ""}${escapeHtml(
              normalizeHumanDate(guest.birthDate) || guest.birthDate || "Sin fecha de nac."
            )}${
              ageInfo.age !== null ? ` &middot; ${escapeHtml(ageInfo.shortLabel)}` : ""
            }${
              guest.specialRegime
                ? ` &middot; R&eacute;gimen especial: ${escapeHtml(guest.specialRegime)}`
                : ""
            }
          </div>
        </div>
        <div class="history-actions">
          ${
            index === 0
              ? `
                <button class="ghost-button is-compact" type="button" data-action="copy-responsible-to-guest" data-guest-id="${guest.id}">
                  Replicar titular
                </button>
              `
              : ""
          }
          <button class="ghost-button is-compact scanner-action-button" type="button" data-action="select-guest" data-guest-id="${guest.id}">
            Escanear aqu&iacute;
          </button>
          <button class="ghost-button is-compact" type="button" data-action="clear-guest" data-guest-id="${guest.id}">
            Limpiar
          </button>
          ${
            index === 0
              ? ""
              : `
                <button class="danger-button is-compact" type="button" data-action="remove-guest" data-guest-id="${guest.id}">
                  Quitar
                </button>
              `
          }
        </div>
      </div>

      <div class="field-grid">
        <label class="field">
          <span>Nombre</span>
          <input
            id="guest-firstName-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="firstName"
            type="text"
            value="${escapeHtml(guest.firstName)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>Apellido</span>
          <input
            id="guest-lastName-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="lastName"
            type="text"
            value="${escapeHtml(guest.lastName)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>DNI</span>
          <input
            id="guest-document-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="document"
            type="text"
            value="${escapeHtml(guest.document)}"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>Fecha de nac</span>
          <input
            id="guest-birthDate-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="birthDate"
            type="text"
            inputmode="numeric"
            maxlength="10"
            value="${escapeHtml(guest.birthDate)}"
            placeholder="dd/mm/aaaa"
            autocomplete="off"
          />
        </label>
        <label class="field">
          <span>G&eacute;nero</span>
          <select
            id="guest-gender-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="gender"
          >
            <option value="" ${guest.gender ? "" : "selected"}>Sin definir</option>
            <option value="F" ${guest.gender === "F" ? "selected" : ""}>F</option>
            <option value="M" ${guest.gender === "M" ? "selected" : ""}>M</option>
            <option value="X" ${guest.gender === "X" ? "selected" : ""}>X</option>
          </select>
        </label>
        <label class="field">
          <span>Nacionalidad</span>
          <input
            id="guest-nationality-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="nationality"
            type="text"
            value="${escapeHtml(guest.nationality || DEFAULT_NATIONALITY)}"
            autocomplete="off"
          />
        </label>
        <label class="field field-span-2">
          <span>R&eacute;gimen especial</span>
          <select
            id="guest-specialRegime-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="specialRegime"
          >
            ${SPECIAL_REGIME_OPTIONS.map(
              (option) =>
                `<option value="${escapeHtml(option)}"${
                  guest.specialRegime === option ? " selected" : ""
                }>${escapeHtml(option || "Sin definir")}</option>`
            ).join("")}
          </select>
        </label>
      </div>

      ${
        guest.rawScan
          ? `
            <div class="tip-box">
              <strong>Lectura guardada</strong>
              <p class="mono">${escapeHtml(guest.rawScan)}</p>
              ${
                guest.parseMeta
                  ? `
                    <div class="chip-row" style="margin-top: 10px;">
                      <span class="result-pill is-${guest.parseMeta.confidence || "medium"}">
                        ${escapeHtml(guest.parseMeta.format || "Lectura")}
                      </span>
                      <span class="chip">Confianza ${escapeHtml(guest.parseMeta.confidence || "media")}</span>
                    </div>
                  `
                  : ""
              }
              ${
                warnings.length
                  ? `
                    <ul class="warning-list" style="margin-top: 10px;">
                      ${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}
                    </ul>
                  `
                  : ""
              }
            </div>
          `
          : ""
      }
    </article>
  `;
}

function renderGuestRow(guest, index) {
  const isActive = guest.id === ui.activeGuestId;
  const status = getGuestStatus(guest);
  const warnings =
    guest.parseMeta && Array.isArray(guest.parseMeta.warnings) ? guest.parseMeta.warnings : [];
  const guestTitle =
    [guest.firstName, guest.lastName].filter(Boolean).join(" ").trim() ||
    `${getGuestRoleLabel(index)} sin cargar`;
  const guestClasses = [
    "guest-card",
    isActive ? "is-active" : "",
    status.className === "is-progress" ? "is-warning" : "",
    !hasGuestData(guest) ? "is-empty" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <article class="${guestClasses}">
      <div class="guest-row-summary">
        <div class="guest-card-copy">
          <div class="chip-row">
            <span class="guest-role ${index === 0 ? "" : "is-secondary"}">
              ${escapeHtml(getGuestRoleLabel(index))}
            </span>
            <span class="status-badge ${status.className}">${escapeHtml(status.label)}</span>
          </div>
          <div class="guest-name">${escapeHtml(guestTitle)}</div>
          <div class="guest-meta">
            ${
              guest.document
                ? `${escapeHtml(guest.document)} &middot; `
                : ""
            }${escapeHtml(normalizeHumanDate(guest.birthDate) || guest.birthDate || "Sin fecha de nac.")}
          </div>
        </div>
      </div>

      <div class="guest-row-fields">
        <label class="field guest-inline-field">
          <span>Nombre</span>
          <input
            id="guest-firstName-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="firstName"
            type="text"
            value="${escapeHtml(guest.firstName)}"
            autocomplete="off"
          />
        </label>
        <label class="field guest-inline-field">
          <span>Apellido</span>
          <input
            id="guest-lastName-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="lastName"
            type="text"
            value="${escapeHtml(guest.lastName)}"
            autocomplete="off"
          />
        </label>
        <label class="field guest-inline-field">
          <span>DNI</span>
          <input
            id="guest-document-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="document"
            type="text"
            value="${escapeHtml(guest.document)}"
            autocomplete="off"
          />
        </label>
        <label class="field guest-inline-field">
          <span>Fecha de nac</span>
          <input
            id="guest-birthDate-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="birthDate"
            type="text"
            inputmode="numeric"
            maxlength="10"
            value="${escapeHtml(guest.birthDate)}"
            placeholder="dd/mm/aaaa"
            autocomplete="off"
          />
        </label>
        <label class="field guest-inline-field">
          <span>Genero</span>
          <select
            id="guest-gender-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="gender"
          >
            <option value="" ${guest.gender ? "" : "selected"}>Sin definir</option>
            <option value="F" ${guest.gender === "F" ? "selected" : ""}>F</option>
            <option value="M" ${guest.gender === "M" ? "selected" : ""}>M</option>
            <option value="X" ${guest.gender === "X" ? "selected" : ""}>X</option>
          </select>
        </label>
        <label class="field guest-inline-field">
          <span>Nacionalidad</span>
          <input
            id="guest-nationality-${guest.id}"
            data-guest-id="${guest.id}"
            data-guest-field="nationality"
            type="text"
            value="${escapeHtml(guest.nationality || DEFAULT_NATIONALITY)}"
            autocomplete="off"
          />
        </label>
      </div>

      <div class="guest-row-actions">
        <button class="ghost-button is-compact scanner-action-button" type="button" data-action="select-guest" data-guest-id="${guest.id}">
          Escanear aquí
        </button>
        <button class="ghost-button is-compact" type="button" data-action="clear-guest" data-guest-id="${guest.id}">
          Limpiar
        </button>
        ${
          index === 0
            ? ""
            : `
              <button class="danger-button is-compact" type="button" data-action="remove-guest" data-guest-id="${guest.id}">
                Quitar
              </button>
            `
        }
      </div>

      ${
        guest.rawScan
          ? `
            <div class="tip-box guest-row-extra">
              <strong>Lectura guardada</strong>
              <p class="mono">${escapeHtml(guest.rawScan)}</p>
              ${
                guest.parseMeta
                  ? `
                    <div class="chip-row" style="margin-top: 10px;">
                      <span class="result-pill is-${guest.parseMeta.confidence || "medium"}">
                        ${escapeHtml(guest.parseMeta.format || "Lectura")}
                      </span>
                      <span class="chip">Confianza ${escapeHtml(guest.parseMeta.confidence || "media")}</span>
                    </div>
                  `
                  : ""
              }
              ${
                warnings.length
                  ? `
                    <ul class="warning-list" style="margin-top: 10px;">
                      ${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}
                    </ul>
                  `
                  : ""
              }
            </div>
          `
          : ""
      }
    </article>
  `;
}

function renderReservationPanelLegacy(reservation) {
  const status = getReservationStatus(reservation);
  const stayRange = formatStayRange(reservation.checkInDate, reservation.checkOutDate);
  return `
    <section class="panel">
      <div class="panel-title-row">
        <div>
          <h2>Reserva activa</h2>
          <p>
            Los datos de esta secci&oacute;n completan la reserva activa. Debajo ver&aacute;s el mapa visual de
            las 32 habitaciones para hoy o para la estad&iacute;a pedida.
          </p>
        </div>
        <div class="chip-row">
          <span class="status-badge ${status.className}">${escapeHtml(status.label)}</span>
          <span class="chip">${escapeHtml(stayRange)}</span>
          <span class="chip">Hu&eacute;spedes cargados: ${reservation.guests.length}</span>
          ${reservation.total ? `<span class="chip">Total ${escapeHtml(formatCurrency(reservation.total))}</span>` : ""}
        </div>
      </div>
      ${renderReservationFields(reservation)}

      <div class="panel-title-row" style="margin-top: 22px;">
        <div>
          <h3>Hu&eacute;spedes</h3>
          <p>
            Cada tarjeta corresponde a una persona de la reserva. El titular siempre queda primero.
          </p>
        </div>
        <button class="button is-compact" type="button" data-action="add-guest">
          Agregar hu&eacute;sped
        </button>
      </div>

      <div class="guest-grid">
        ${reservation.guests.map((guest, index) => renderGuestCard(guest, index)).join("")}
      </div>
    </section>
  `;
}

function getRoomAvailabilityDescriptor(reservation, roomNumber, scope) {
  const roomProfile = getRoomProfile(roomNumber);
  const guestCount = getReservationGuestCount(reservation);
  const isSelected = reservation.roomNumber === roomNumber;
  const maintenance = isRoomUnderMaintenance(roomNumber);
  const conflictReservation = getRoomOccupantForRange(
    roomNumber,
    scope.startDate,
    scope.endDate,
    reservation.id
  );
  const needsException = Boolean(
    roomProfile &&
      roomProfile.supportsExtraBed &&
      guestCount > roomProfile.baseCapacity &&
      guestCount <= roomProfile.maxCapacity
  );
  const exceedsCapacity = Boolean(roomProfile && guestCount > roomProfile.maxCapacity);
  const chargesRoomBase = Boolean(
    shouldShowReservationFinancialFields(reservation) &&
      roomProfile &&
      guestCount < roomProfile.baseCapacity
  );

  let status = "available";
  let selectable = scope.mode === "request" && !scope.fallback;

  if (maintenance) {
    status = "maintenance";
    selectable = false;
  } else if (conflictReservation) {
    status = "occupied";
    selectable = false;
  } else if (exceedsCapacity) {
    status = "capacity";
    selectable = false;
  } else if (needsException) {
    status = reservation.allowExtraBed && isSelected ? "exception-active" : "exception";
  } else if (chargesRoomBase) {
    status = "commercial-base";
  }

  return {
    roomNumber,
    roomProfile,
    guestCount,
    isSelected,
    maintenance,
    conflictReservation,
    status,
    selectable,
    chargesRoomBase,
  };
}

function getRoomAvailabilitySelectionWarning(reservation, descriptor, scope) {
  if (scope.mode !== "request" || scope.fallback) {
    return "Completa check-in y check-out con un rango valido para elegir habitacion.";
  }
  if (!descriptor) {
    return "Selecciona una habitacion del 1 al 32.";
  }
  if (descriptor.maintenance) {
    return `La habitacion ${descriptor.roomNumber} esta en mantenimiento.`;
  }
  if (descriptor.conflictReservation) {
    return getRoomConflictMessage(
      reservation,
      descriptor.roomNumber,
      scope.startDate,
      scope.endDate
    );
  }
  if (descriptor.status === "capacity") {
    return `La habitacion ${descriptor.roomNumber} no tiene capacidad para ${descriptor.guestCount} pasajeros.`;
  }
  return "";
}

function renderRoomAvailabilityCard(reservation, scope, descriptor, options = {}) {
  const {
    roomNumber,
    roomProfile,
    guestCount,
    maintenance,
    conflictReservation,
    status,
    selectable,
  } = descriptor;
  const selectedRoomNumber = sanitizeRoomNumber(
    Object.prototype.hasOwnProperty.call(options, "selectedRoomNumber")
      ? options.selectedRoomNumber
      : reservation && reservation.roomNumber
  );
  const isSelected = selectedRoomNumber === roomNumber;
  const action = options.action || "select-availability-room";
  const showMaintenanceToggle = Boolean(
    Object.prototype.hasOwnProperty.call(options, "showMaintenanceToggle")
      ? options.showMaintenanceToggle
      : ui.showMaintenanceEditor
  );
  const classes = [
    "room-card",
    isSelected ? "is-selected" : "",
    selectable ? "is-clickable" : "is-readonly",
    status === "occupied" ? "is-unavailable" : "",
    status === "maintenance" ? "is-maintenance" : "",
    status === "capacity" ? "is-capacity" : "",
    status === "exception" || status === "exception-active" ? "is-exception" : "",
    status === "commercial-base" ? "is-commercial-base" : "",
    status === "available" ? "is-available" : "",
  ]
    .filter(Boolean)
    .join(" ");

  let kicker = "Disponible";
  let helperText = roomProfile ? roomProfile.label : "Habitación";
  let detailText = roomProfile ? getRoomCapacitySummary(roomProfile) : "";
  let tag = roomProfile ? `Cap. ${roomProfile.baseCapacity}` : "Libre";

  if (status === "maintenance") {
    kicker = "En mantenimiento";
    helperText = "Habitación inhabilitada";
    detailText = "Queda fuera de servicio hasta quitar mantenimiento.";
    tag = "Mant.";
  } else if (status === "occupied") {
    kicker = "No disponible";
    helperText = buildReservationTitle(conflictReservation);
    detailText = `Ocupada ${formatStayRange(
      conflictReservation.checkInDate,
      conflictReservation.checkOutDate
    )}`;
    tag = "Ocupada";
  } else if (status === "capacity") {
    kicker = "Capacidad insuficiente";
    helperText = roomProfile ? roomProfile.label : "Capacidad";
    detailText = `Reserva actual: ${guestCount} pasajeros. Máximo ${roomProfile.maxCapacity}.`;
    tag = "Cap.";
  } else if (status === "exception-active") {
    kicker = "Excepción activa";
    detailText = `Cama extra habilitada para ${guestCount} pasajeros.`;
    tag = "Extra";
  } else if (status === "exception") {
    kicker = "Disponible con excepción";
    detailText = `Admite ${guestCount} pasajeros solo con cama extra excepcional.`;
    tag = "Extra";
  } else if (status === "commercial-base") {
    kicker = isSelected
      ? "Seleccionada con tarifa de habitación"
      : "Disponible con tarifa de habitación";
    detailText = `Viajan ${guestCount} pasajero${guestCount === 1 ? "" : "s"}, pero se cobra como ${roomProfile.baseCapacity} plazas.`;
    tag = "Tarifa";
  } else if (isSelected) {
    kicker = "Seleccionada";
    detailText =
      scope.mode === "today"
        ? `Control de hoy ${formatDisplayDate(scope.startDate)}.`
        : `Asignada para ${formatStayRange(scope.startDate, scope.endDate)}.`;
    tag = "Actual";
  } else if (scope.mode === "today") {
    kicker = "Disponible hoy";
    detailText = `Libre para hoy ${formatDisplayDate(scope.startDate)}.`;
  }

  if (status === "occupied") {
    detailText = `${buildReservationTitle(conflictReservation)} · ${detailText}`;
  }
  helperText = getRoomCategoryLabel(roomProfile);

  return `
    <article class="${classes}">
      <button
        class="room-card-main"
        type="button"
        data-action="${escapeHtml(action)}"
        data-room-number="${roomNumber}"
        ${selectable ? "" : "disabled"}
      >
        <span class="room-card-header">
          <span class="room-card-copy">
            <span class="room-card-kicker">${escapeHtml(kicker)}</span>
            <span class="room-meta">${escapeHtml(helperText)}</span>
          </span>
          <span class="room-card-side">
            <span class="room-card-number">${escapeHtml(roomNumber)}</span>
            <span class="room-card-tag">${escapeHtml(tag)}</span>
          </span>
        </span>
        ${renderRoomBedIcons(roomProfile, "room-card", maintenance)}
        <span class="room-total-row">
          <strong>${escapeHtml(roomProfile ? roomProfile.label : "Habitación")}</strong>
          <span class="room-meta">${escapeHtml(detailText)}</span>
        </span>
      </button>
      ${
        showMaintenanceToggle
          ? `
            <button
              class="room-maintenance-toggle ${maintenance ? "is-active" : ""}"
              type="button"
              data-action="toggle-room-maintenance"
              data-room-number="${roomNumber}"
            >
              ${maintenance ? "Quitar mant." : "Poner mant."}
            </button>
          `
          : ""
      }
    </article>
  `;
}

function getRoomOverviewDescriptor(roomNumber, referenceDate = getRoomOverviewDate()) {
  const roomProfile = getRoomProfile(roomNumber);
  const targetDate = normalizeInputDate(referenceDate) || getTodayInputDate();
  const nextDate = addDaysToInputDate(targetDate, 1);
  const maintenance = isRoomUnderMaintenance(roomNumber);
  const conflictReservation = getRoomOccupantForRange(roomNumber, targetDate, nextDate);
  const arrivalReservation = getRoomReservationStartingOnDate(roomNumber, targetDate);
  const departureReservation = getRoomReservationEndingOnDate(roomNumber, targetDate);

  let status = "available";
  if (maintenance) {
    status = "maintenance";
  } else if (conflictReservation) {
    status = "occupied";
  }

  return {
    roomNumber,
    roomProfile,
    referenceDate: targetDate,
    maintenance,
    conflictReservation,
    arrivalReservation,
    departureReservation,
    status,
  };
}

function getRoomOverviewSummary(referenceDate = getRoomOverviewDate()) {
  const descriptors = ROOM_OPTIONS.map((roomNumber) =>
    getRoomOverviewDescriptor(roomNumber, referenceDate)
  );
  return {
    descriptors,
    availableCount: descriptors.filter((descriptor) => descriptor.status === "available").length,
    occupiedCount: descriptors.filter((descriptor) => descriptor.status === "occupied").length,
    maintenanceCount: descriptors.filter((descriptor) => descriptor.status === "maintenance").length,
  };
}

function renderRoomOverviewCard(descriptor) {
  const { roomNumber, roomProfile, referenceDate, maintenance, conflictReservation, status } =
    descriptor;
  const classes = [
    "room-card",
    "is-dashboard",
    "is-clickable",
    status === "occupied" ? "is-unavailable" : "",
    status === "maintenance" ? "is-maintenance" : "",
    status === "available" ? "is-available" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const today = getTodayInputDate();
  const isToday = referenceDate === today;
  let kicker = isToday ? "Disponible hoy" : "Disponible";
  let helperText = roomProfile ? roomProfile.label : "Habitación";
  let detailText = `Libre para ${formatDisplayDate(referenceDate)}.`;
  let tag = "Libre";

  if (status === "maintenance") {
    kicker = "En mantenimiento";
    helperText = "Habitación inhabilitada";
    detailText = "No se puede asignar hasta quitar mantenimiento.";
    tag = "Mant.";
  } else if (status === "occupied") {
    kicker = isToday
      ? "En uso hoy"
      : referenceDate > today
        ? "Reservada para esa fecha"
        : "Ocupada ese d\u00eda";
    helperText = buildReservationTitle(conflictReservation);
    detailText = `Tomada ${formatStayRange(
      conflictReservation.checkInDate,
      conflictReservation.checkOutDate
    )}`;
    tag = isToday ? "En uso" : "Reservada";
  }

  if (status === "occupied") {
    detailText = `${buildReservationTitle(conflictReservation)} · ${detailText}`;
  }
  helperText = getRoomCategoryLabel(roomProfile);

  return `
    <article class="${classes}">
      <button
        class="room-card-main"
        type="button"
        data-action="open-room-shortcut-modal"
        data-room-number="${escapeHtml(roomNumber)}"
        aria-label="Cargar una reserva para la habitaci&oacute;n ${escapeHtml(roomNumber)}"
      >
        <span class="room-card-header">
          <span class="room-card-copy">
            <span class="room-card-kicker">${escapeHtml(kicker)}</span>
            <span class="room-meta">${escapeHtml(helperText)}</span>
          </span>
          <span class="room-card-side">
            <span class="room-card-number">${escapeHtml(roomNumber)}</span>
            <span class="room-card-tag">${escapeHtml(tag)}</span>
          </span>
        </span>
        ${renderRoomBedIcons(roomProfile, "room-card", maintenance)}
        <span class="room-total-row">
          <strong>${escapeHtml(roomProfile ? roomProfile.label : "Habitación")}</strong>
          <span class="room-meta">${escapeHtml(detailText)}</span>
        </span>
      </button>
      ${
        ui.showMaintenanceEditor
          ? `
            <button
              class="room-maintenance-toggle ${maintenance ? "is-active" : ""}"
              type="button"
              data-action="toggle-room-maintenance"
              data-room-number="${roomNumber}"
            >
              ${maintenance ? "Quitar mant." : "Poner mant."}
            </button>
          `
          : ""
      }
    </article>
  `;
}

function renderRoomOverviewCalendar(referenceDate = getRoomOverviewDate()) {
  const selectedDate = normalizeInputDate(referenceDate) || getTodayInputDate();
  const today = getTodayInputDate();
  const monthKey = getMonthKeyFromDate(selectedDate);
  const firstDate = `${monthKey}-01`;
  const leadingBlanks = getCalendarWeekdayIndex(firstDate);
  const daysInMonth = getDaysInMonth(selectedDate);
  const calendarCells = [];

  for (let index = 0; index < leadingBlanks; index += 1) {
    calendarCells.push('<span class="calendar-day is-empty" aria-hidden="true"></span>');
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${monthKey}-${String(day).padStart(2, "0")}`;
    const summary = getRoomOverviewSummary(date);
    const isSelected = date === selectedDate;
    const isCurrentDay = date === today;
    const isSoldOut = summary.availableCount === 0;
    const dayClasses = [
      "calendar-day",
      isSelected ? "is-selected" : "",
      isCurrentDay ? "is-today" : "",
      summary.occupiedCount > 0 ? "is-busy" : "",
      isSoldOut ? "is-sold-out" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const occupancyCopy = isSoldOut
      ? "Sin disponibles"
      : summary.occupiedCount > 0
        ? `${summary.occupiedCount} ocupadas`
        : "Sin ocupaci\u00f3n";

    calendarCells.push(`
      <button
        class="${dayClasses}"
        type="button"
        data-action="select-room-overview-date"
        data-date="${date}"
      >
        <span class="calendar-day-top">
          <span class="calendar-day-number">${day}</span>
          ${isCurrentDay ? '<span class="calendar-day-pill">Hoy</span>' : ""}
        </span>
        <span class="calendar-day-bottom">
          <span class="calendar-day-meta">${escapeHtml(occupancyCopy)}</span>
        </span>
      </button>
    `);
  }

  while (calendarCells.length % 7 !== 0) {
    calendarCells.push('<span class="calendar-day is-empty" aria-hidden="true"></span>');
  }

  return `
    <div class="overview-calendar-shell">
      <div class="calendar-toolbar">
        <div class="calendar-month-nav">
          <button
            class="ghost-button is-compact"
            type="button"
            data-action="shift-room-overview-month"
            data-shift="-1"
          >
            Mes anterior
          </button>
          <div class="calendar-month-copy">
            <strong>${escapeHtml(formatMonthYearLabel(selectedDate))}</strong>
            <span>Fecha elegida: ${escapeHtml(formatDateLong(selectedDate))}</span>
          </div>
          <button
            class="ghost-button is-compact"
            type="button"
            data-action="shift-room-overview-month"
            data-shift="1"
          >
            Mes siguiente
          </button>
        </div>
        <div class="overview-date-controls">
          <button
            class="ghost-button is-compact"
            type="button"
            data-action="set-room-overview-today"
          >
            Volver a hoy
          </button>
          <label class="overview-date-field" for="room-overview-date">
            <span>Ir a fecha</span>
            <input
              id="room-overview-date"
              class="overview-date-input"
              type="date"
              value="${selectedDate}"
              data-overview-date
              data-date-picker
            />
          </label>
        </div>
      </div>

      <div class="calendar-weekdays">
        ${CALENDAR_WEEKDAY_LABELS.map(
          (label) => `<span class="calendar-weekday">${escapeHtml(label)}</span>`
        ).join("")}
      </div>
      <div class="calendar-grid">
        ${calendarCells.join("")}
      </div>
    </div>
  `;
}

function renderRoomOverviewPanel() {
  const selectedDate = getRoomOverviewDate();
  const today = getTodayInputDate();
  const { descriptors, availableCount, occupiedCount, maintenanceCount } =
    getRoomOverviewSummary(selectedDate);
  const headline =
    selectedDate === today ? `Hoy ${formatDisplayDate(selectedDate)}` : formatDateLong(selectedDate);

  return `
    <section id="rooms-section" class="panel panel-strong availability-panel">
      <div class="panel-title-row">
        <div>
          <div class="eyebrow" style="margin-bottom: 8px; color: var(--accent); opacity: 1;">Mapa visual</div>
          <h2>Habitaciones</h2>
          <p>
            Aqu&iacute; ves el estado puntual del hotel para la fecha elegida. Puedes cambiarla
            aqu&iacute; mismo o desde la l&iacute;nea del tiempo de abajo.
          </p>
        </div>
      </div>

      <div class="availability-overview">
        <div class="availability-toolbar">
          <div class="chip-row">
            <span class="chip">${escapeHtml(headline)}</span>
            <span class="status-badge is-ready">${availableCount} disponibles</span>
            <span class="status-badge is-blocked">${occupiedCount} ocupadas</span>
            <span class="chip is-slate">${maintenanceCount} en mantenimiento</span>
          </div>
          <div class="overview-date-controls overview-date-controls-inline">
            <button
              class="ghost-button is-compact maintenance-editor-toggle ${
                ui.showMaintenanceEditor ? "is-active" : ""
              }"
              type="button"
              data-action="toggle-maintenance-editor"
            >
              ${ui.showMaintenanceEditor ? "Cerrar editor" : "Mantenimiento por hab."}
            </button>
            <button
              class="ghost-button is-compact"
              type="button"
              data-action="set-room-overview-today"
            >
              Hoy
            </button>
            <label class="overview-date-field overview-date-field-inline" for="room-overview-date">
              <span>Ver fecha</span>
              <input
                id="room-overview-date"
                class="overview-date-input overview-date-input-inline"
                type="date"
                value="${selectedDate}"
                data-overview-date
                data-date-picker
              />
            </label>
          </div>
        </div>
        <p class="availability-copy">
          Verde: disponible. Rojo: ocupada o reservada para la fecha elegida. Gris: deshabilitada por mantenimiento.
        </p>
        ${
          ui.showMaintenanceEditor
            ? `
              <div class="tip-box" style="margin-top: 14px;">
                <strong>Edici&oacute;n de mantenimiento activa</strong>
                <p>
                  Dentro de cada habitaci&oacute;n aparecer&aacute; el bot&oacute;n para ponerla o quitarla
                  de mantenimiento sin salir de este mapa.
                </p>
              </div>
            `
            : ""
        }
      </div>

      <div class="room-grid" style="margin-top: 16px;">
        ${descriptors.map((descriptor) => renderRoomOverviewCard(descriptor)).join("")}
      </div>
    </section>
  `;
}

function renderRoomTimelineCell(descriptor, date, selectedDate = getRoomOverviewDate()) {
  const isSelectedDay = date === selectedDate;
  const groupCompany = getReservationCompanyLabel(descriptor.conflictReservation);
  const groupColor = getReservationGroupColor(descriptor.conflictReservation);
  const groupInk = groupColor ? getReadableInkForGroupColor(groupColor) : "";
  const classes = [
    "timeline-status",
    descriptor.status === "available" ? "is-available" : "",
    descriptor.status === "occupied" ? "is-occupied" : "",
    descriptor.status === "occupied" && groupCompany ? "is-group" : "",
    descriptor.status === "maintenance" ? "is-maintenance" : "",
    isSelectedDay ? "is-selected-day" : "",
  ]
    .filter(Boolean)
    .join(" ");

  let label = "Disponible";
  if (descriptor.status === "maintenance") {
    label = "Mantenimiento";
  } else if (descriptor.status === "occupied") {
    label = descriptor.referenceDate === getTodayInputDate() ? "En uso" : "Reservada";
  }

  const titleParts = [`Hab. ${descriptor.roomNumber}`, formatDisplayDate(date), label];
  if (descriptor.conflictReservation) {
    titleParts.push(buildReservationTitle(descriptor.conflictReservation));
    if (groupCompany) {
      titleParts.push(`Grupo ${groupCompany}`);
    }
    titleParts.push(
      formatStayRange(
        descriptor.conflictReservation.checkInDate,
        descriptor.conflictReservation.checkOutDate
      )
    );
  }
  const style =
    groupColor && descriptor.status === "occupied"
      ? ` style="--group-color: ${escapeHtml(groupColor)}; --group-ink: ${escapeHtml(groupInk)};"`
      : "";
  const groupInitial =
    groupColor && descriptor.status === "occupied"
      ? getReservationGroupInitial(descriptor.conflictReservation)
      : "";

  return `
    <td class="timeline-cell ${isSelectedDay ? "is-selected-day" : ""}">
      <span class="${classes}" title="${escapeHtml(titleParts.join(" · "))}"></span>
    </td>
  `;
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
  if (!reservation) {
    return;
  }
  const company = getReservationCompanyLabel(reservation);
  titleParts.push(`${label}: ${buildReservationTitle(reservation)}`);
  if (company) {
    titleParts.push(`Grupo ${company}`);
  }
  titleParts.push(formatStayRange(reservation.checkInDate, reservation.checkOutDate));
}

function isTimelineShortcutAvailable(descriptor, date) {
  const normalizedDate = normalizeInputDate(date);
  if (!descriptor || !normalizedDate || normalizedDate < getTodayInputDate() || descriptor.maintenance) {
    return false;
  }
  if (descriptor.status === "available") {
    return true;
  }
  return Boolean(descriptor.departureReservation && !descriptor.arrivalReservation);
}

function renderTimelineStatusShell({ descriptor, date, classes, style = "", title, content = "", actionable }) {
  if (!actionable) {
    return `<span class="${classes}"${style} title="${escapeHtml(title)}">${content}</span>`;
  }

  return `
    <button
      class="${classes} is-actionable"
      type="button"
      data-action="open-room-shortcut-modal"
      data-room-number="${escapeHtml(descriptor.roomNumber)}"
      data-check-in-date="${escapeHtml(date)}"
      title="${escapeHtml(title)}"
      aria-label="Cargar una reserva para la habitaci&oacute;n ${escapeHtml(descriptor.roomNumber)} el ${escapeHtml(formatDisplayDate(date))}"
    >${content}</button>
  `;
}

function renderRoomTimelineCellV2(descriptor, date, selectedDate = getRoomOverviewDate()) {
  const isSelectedDay = date === selectedDate;
  const today = getTodayInputDate();
  const isToday = date === today;
  const isPast = date < today;
  const canOpenShortcut = isTimelineShortcutAvailable(descriptor, date);
  const cellClasses = [
    "timeline-cell",
    isSelectedDay ? "is-selected-day" : "",
    isToday ? "is-today" : "",
    isPast ? "is-past" : "",
    canOpenShortcut ? "is-actionable" : "",
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
      formatDisplayDate(date),
      "Movimiento de medio d\u00eda",
    ];

    addTimelineReservationTitle(titleParts, "Egreso", descriptor.departureReservation);
    addTimelineReservationTitle(titleParts, "Ingreso", descriptor.arrivalReservation);

    return `
      <td class="${cellClasses}">
        ${renderTimelineStatusShell({
          descriptor,
          date,
          classes,
          title: titleParts.join(" \u00b7 "),
          actionable: canOpenShortcut,
          content: `
            ${renderTimelineHalf("left", descriptor.departureReservation)}
            ${renderTimelineHalf("right", descriptor.arrivalReservation)}
          `,
        })}
      </td>
    `;
  }

  const occupiedReservation = descriptor.conflictReservation;
  const groupCompany = getReservationCompanyLabel(occupiedReservation);
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

  const titleParts = [`Hab. ${descriptor.roomNumber}`, formatDisplayDate(date), label];
  addTimelineReservationTitle(titleParts, "Reserva", occupiedReservation);

  const style =
    occupiedPaint
      ? ` style="--timeline-color: ${escapeHtml(occupiedPaint.color)}; --timeline-ink: ${escapeHtml(
          occupiedPaint.ink
        )};"`
      : "";
  const groupInitial =
    occupiedPaint && occupiedPaint.isGroup ? occupiedPaint.initial || getGroupInitial(groupCompany) : "";

  return `
    <td class="${cellClasses}">
      ${renderTimelineStatusShell({
        descriptor,
        date,
        classes,
        style,
        title: titleParts.join(" \u00b7 "),
        actionable: canOpenShortcut,
        content: escapeHtml(groupInitial),
      })}
    </td>
  `;
}

function renderRoomTimelinePanel(referenceDate = getRoomOverviewDate()) {
  const selectedDate = normalizeInputDate(referenceDate) || getTodayInputDate();
  const monthKey = getMonthKeyFromDate(selectedDate);
  const daysInMonth = getDaysInMonth(selectedDate);
  const dates = Array.from({ length: daysInMonth }, (_, index) => {
    return `${monthKey}-${String(index + 1).padStart(2, "0")}`;
  });

  return `
    <section id="timeline-section" class="panel panel-strong availability-panel timeline-panel">
      <div class="panel-title-row">
        <div>
          <div class="eyebrow" style="margin-bottom: 8px; color: var(--accent); opacity: 1;">Planificaci&oacute;n</div>
          <h2>L&iacute;nea del tiempo</h2>
          <p>
            La misma informaci&oacute;n del mapa, pero ordenada por habitaci&oacute;n y por d&iacute;a
            del mes para leer la ocupaci&oacute;n como planilla.
          </p>
        </div>
        <div class="availability-toolbar">
          <div class="chip-row">
            <span class="chip">${escapeHtml(formatMonthYearLabel(selectedDate))}</span>
            <span class="chip">Fecha elegida ${escapeHtml(formatDisplayDate(selectedDate))}</span>
          </div>
          <div class="availability-mode-switch">
            <button
              class="ghost-button is-compact"
              type="button"
              data-action="shift-room-overview-month"
              data-shift="-1"
            >
              Mes anterior
            </button>
            <button
              class="ghost-button is-compact"
              type="button"
              data-action="set-room-overview-today"
            >
              Volver a hoy
            </button>
            <button
              class="ghost-button is-compact"
              type="button"
              data-action="shift-room-overview-month"
              data-shift="1"
            >
              Mes siguiente
            </button>
          </div>
        </div>
      </div>

      <p class="availability-copy">
        Pulsa un d&iacute;a del encabezado para mover toda la consulta a esa fecha.
      </p>

      <div class="timeline-wrap" data-room-timeline-wrap>
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
                        data-action="select-room-overview-date"
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
                        roomProfile ? roomProfile.label : "Habitaci\u00f3n"
                      )}">${escapeHtml(roomProfile ? roomProfile.label : "Habitaci\u00f3n")}</span>
                    </div>
                  </th>
                  ${dates
                    .map((date) =>
                      renderRoomTimelineCellV2(
                        getRoomOverviewDescriptor(roomNumber, date),
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

      <p class="availability-copy">
        Verde: disponible. Colores sin inicial: reservas particulares. Colores con inicial: grupos o empresas.
        Medio cuadrado derecho: ingreso. Medio cuadrado izquierdo: egreso. L&iacute;nea violeta:
        corte de mediod&iacute;a. Gris: mantenimiento.
      </p>
    </section>
  `;
}

function renderRoomAvailabilityPanel(reservation) {
  const scope = getAvailabilityScope(reservation);
  const roomDescriptors = ROOM_OPTIONS.map((roomNumber) =>
    getRoomAvailabilityDescriptor(reservation, roomNumber, scope)
  );
  const availableCount = roomDescriptors.filter((descriptor) =>
    ["available", "exception", "exception-active", "commercial-base"].includes(
      descriptor.status
    )
  ).length;
  const unavailableCount = roomDescriptors.length - availableCount;
  const blockingIssue = getReservationBlockingIssue(reservation);
  const selectedRoomProfile = getRoomProfile(reservation.roomNumber);

  return `
    <section id="rooms-section" class="panel panel-strong availability-panel">
      <div class="panel-title-row">
        <div>
          <div class="eyebrow" style="margin-bottom: 8px; color: var(--accent); opacity: 1;">Mapa visual</div>
          <h2>Habitaciones 1 a 32</h2>
          <p>
            Aqu&iacute; ves disponibilidad real, capacidad por habitaci&oacute;n, excepciones
            posibles y mantenimiento individual cuando una habitaci&oacute;n sale de servicio.
          </p>
        </div>
        <div class="availability-toolbar">
          <div class="availability-mode-switch">
            <button
              class="ghost-button is-compact availability-mode-button ${
                ui.roomAvailabilityMode === "request" ? "is-active" : ""
              }"
              type="button"
              data-action="set-availability-mode"
              data-mode="request"
            >
              Estad&iacute;a solicitada
            </button>
            <button
              class="ghost-button is-compact availability-mode-button ${
                ui.roomAvailabilityMode === "today" ? "is-active" : ""
              }"
              type="button"
              data-action="set-availability-mode"
              data-mode="today"
            >
              Hoy ${escapeHtml(formatDisplayDate(getTodayInputDate()))}
            </button>
          </div>
        </div>
      </div>

      <div class="availability-overview">
        <div class="chip-row">
          <span class="chip">${escapeHtml(scope.headline)}</span>
          <span class="status-badge is-ready">${availableCount} disponibles</span>
          <span class="status-badge is-blocked">${unavailableCount} no disponibles</span>
          <span class="chip">${getReservationGuestCount(reservation)} pasajeros</span>
          <span class="chip">
            ${
              selectedRoomProfile
                ? `Hab. ${escapeHtml(selectedRoomProfile.roomNumber)} &middot; ${escapeHtml(
                    selectedRoomProfile.label
                  )}`
                : "Sin habitaci&oacute;n asignada"
            }
          </span>
        </div>
        <p class="availability-copy">${escapeHtml(scope.description)}</p>
      </div>

      ${
        blockingIssue && blockingIssue.label !== "Fechas"
          ? `
            <div class="warning-box" style="margin-top: 14px;">
              <strong>${escapeHtml(blockingIssue.label)}</strong>
              <p>${escapeHtml(blockingIssue.message)}</p>
            </div>
          `
          : scope.fallback
            ? `
              <div class="warning-box" style="margin-top: 14px;">
                <strong>Fechas a corregir</strong>
                <p>
                  Completa ingreso y egreso con un rango v&aacute;lido para poder elegir habitaci&oacute;n desde
                  este mapa.
                </p>
              </div>
            `
            : scope.mode === "today"
              ? `
                <div class="tip-box" style="margin-top: 14px;">
                  <strong>Modo visual de hoy</strong>
                  <p>
                    Esta vista es solo de control para el ${escapeHtml(
                      formatDisplayDate(getTodayInputDate())
                    )}. Para asignar una habitaci&oacute;n, vuelve a <strong>Estad&iacute;a solicitada</strong>.
                  </p>
                </div>
              `
              : `
                <div class="tip-box" style="margin-top: 14px;">
                  <strong>Lectura r&aacute;pida</strong>
                  <p>
                    Verde: libre. Azul: disponible, pero se cobra la base de esa habitaci&oacute;n.
                    Naranja: revisa capacidad o cama extra. Rojo: ocupada. Gris: mantenimiento por
                    habitaci&oacute;n.
                  </p>
                </div>
              `
      }

      <div class="room-grid" style="margin-top: 16px;">
        ${roomDescriptors
          .map((descriptor) => renderRoomAvailabilityCard(reservation, scope, descriptor))
          .join("")}
      </div>
    </section>
  `;
}

function renderRoomPickerModal(reservation = getActiveReservation()) {
  if (!ui.isRoomPickerModalOpen || !reservation) {
    return "";
  }

  const scope = getAvailabilityScope(reservation, "request");
  const roomDescriptors = ROOM_OPTIONS.map((roomNumber) =>
    getRoomAvailabilityDescriptor(reservation, roomNumber, scope)
  );
  const draftRoomNumber = sanitizeRoomNumber(ui.roomPickerDraftNumber);
  const descriptor = draftRoomNumber
    ? getRoomAvailabilityDescriptor(reservation, draftRoomNumber, scope)
    : null;
  const roomHeadline = getReservationRoomHeadlineData(reservation, draftRoomNumber);
  const canConfirm = Boolean(descriptor && descriptor.selectable);
  const helperText = !draftRoomNumber
    ? "Escribe un numero entre 1 y 32 o toca una habitacion del mapa."
    : canConfirm
      ? "La habitacion esta lista para quedar asignada a esta reserva."
      : getRoomAvailabilitySelectionWarning(reservation, descriptor, scope);

  return `
    <div class="scanner-modal-backdrop" data-action="close-room-picker-modal"></div>
    <section
      class="scanner-modal-shell"
      aria-modal="true"
      role="dialog"
      aria-labelledby="room-picker-title"
    >
      <div class="scanner-modal room-picker-modal">
        <div class="scanner-modal-toolbar">
          <div>
            <p class="scanner-modal-kicker">Selecci&oacute;n de habitaci&oacute;n</p>
            <h2 id="room-picker-title">Elegir habitaci&oacute;n</h2>
            <p class="scanner-helper">
              Busca la habitaci&oacute;n de forma manual o el&iacute;gela desde el mapa visual de la 1 a la 32.
            </p>
          </div>
          <button class="ghost-button is-compact" type="button" data-action="close-room-picker-modal">
            Cerrar
          </button>
        </div>

        <div class="room-picker-summary ${canConfirm ? "is-ready" : ""}">
          <strong>${escapeHtml(roomHeadline.title)}</strong>
          <span>${escapeHtml(roomHeadline.detail)}</span>
        </div>

        <div class="field-grid room-picker-field-grid">
          <label class="field field-span-2">
            <span>N&uacute;mero de habitaci&oacute;n</span>
            <input
              id="room-picker-input"
              data-room-picker-field="roomNumber"
              type="text"
              inputmode="numeric"
              maxlength="2"
              list="room-options"
              class="${getRequiredFieldStateClass(Boolean(draftRoomNumber))}"
              value="${escapeHtml(draftRoomNumber)}"
              placeholder="1 a 32"
              autocomplete="off"
            />
            <small>Escribe el n&uacute;mero o toca una tarjeta del mapa.</small>
          </label>
          <div class="field field-span-2">
            <span>Estado de la selecci&oacute;n</span>
            <div class="room-picker-status ${canConfirm ? "is-ready" : "is-warning"}">
              <strong>${canConfirm ? "Lista para confirmar" : "Pendiente de revisar"}</strong>
              <span>${escapeHtml(helperText)}</span>
            </div>
          </div>
        </div>

        ${
          scope.fallback
            ? `
              <div class="warning-box">
                <strong>Fechas a corregir</strong>
                <p>
                  Completa check-in y check-out con un rango v&aacute;lido antes de confirmar una
                  habitaci&oacute;n para esta reserva.
                </p>
              </div>
            `
            : `
              <div class="tip-box">
                <strong>Lectura r&aacute;pida</strong>
                <p>
                  Verde: libre. Azul: disponible, pero se cobra la base de esa habitaci&oacute;n.
                  Naranja: revisa capacidad o cama extra. Rojo: ocupada. Gris: mantenimiento.
                </p>
              </div>
            `
        }

        <div class="room-grid room-picker-grid">
          ${roomDescriptors
            .map((item) =>
              renderRoomAvailabilityCard(reservation, scope, item, {
                selectedRoomNumber: draftRoomNumber,
                action: "select-room-picker-room",
                showMaintenanceToggle: false,
              })
            )
            .join("")}
        </div>

        <div class="actions-row room-picker-actions">
          <button class="ghost-button" type="button" data-action="close-room-picker-modal">
            Cancelar
          </button>
          <button
            class="button"
            type="button"
            data-action="confirm-room-picker-selection"
            ${canConfirm ? "" : "disabled"}
          >
            Confirmar selecci&oacute;n
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderRoomPickerConfirmationModal(reservation = getActiveReservation()) {
  const roomNumber = sanitizeRoomNumber(ui.roomPickerConfirmNumber);
  if (!ui.isRoomPickerModalOpen || !roomNumber || !reservation) {
    return "";
  }

  const roomProfile = getRoomProfile(roomNumber);
  const roomLabel = roomProfile ? roomProfile.label : "Habitacion";
  const confirmPosition = ui.roomPickerConfirmPosition || {};
  const confirmTop = Number(confirmPosition.top);
  const confirmLeft = Number(confirmPosition.left);
  const positionStyle =
    Number.isFinite(confirmTop) && Number.isFinite(confirmLeft)
      ? ` style="--room-picker-confirm-top: ${Math.round(confirmTop)}px; --room-picker-confirm-left: ${Math.round(confirmLeft)}px;"`
      : "";
  return `
    <div class="scanner-modal-backdrop room-picker-confirm-backdrop" data-action="cancel-room-picker-confirmation"></div>
    <section
      class="scanner-modal-shell room-picker-confirm-shell"
      aria-modal="true"
      role="dialog"
      aria-labelledby="room-picker-confirm-title"
      ${positionStyle}
    >
      <div class="scanner-modal room-picker-confirm-modal">
        <p class="scanner-modal-kicker">Confirmar habitaci&oacute;n</p>
        <h2 id="room-picker-confirm-title">Est&aacute;s seleccionando la habitaci&oacute;n ${escapeHtml(roomNumber)}</h2>
        <p class="scanner-helper">${escapeHtml(roomLabel)}. Si es correcta, confirmala para asignarla a la reserva.</p>
        <div class="actions-row room-picker-confirm-actions">
          <button class="ghost-button" type="button" data-action="cancel-room-picker-confirmation">
            Cancelar
          </button>
          <button id="confirm-room-picker-confirmation-button" class="button" type="button" data-action="confirm-room-picker-confirmation">
            Confirmar habitaci&oacute;n
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderRoomSettingsPanel() {
  return `
    <section id="settings-section" class="panel panel-strong room-settings-panel">
      <div class="panel-title-row">
        <div>
          <h2>Configuraciones</h2>
          <p>
            Este bloque concentra ajustes operativos del mapa. El mantenimiento se aplica por
            habitaci&oacute;n individual y la deja gris e inhabilitada hasta volver a habilitarla.
          </p>
        </div>
        <div class="actions-row">
          <button
            class="ghost-button is-compact maintenance-editor-toggle ${
              ui.showMaintenanceEditor ? "is-active" : ""
            }"
            type="button"
            data-action="toggle-maintenance-editor"
          >
            ${ui.showMaintenanceEditor ? "Cerrar editor" : "Mantenimiento por hab."}
          </button>
        </div>
      </div>
      ${
        ui.showMaintenanceEditor
          ? `
            <div class="tip-box">
              <strong>Edici&oacute;n activa</strong>
              <p>
                Ahora ver&aacute;s <strong>Poner mant.</strong> o <strong>Quitar mant.</strong> dentro de
                cada habitaci&oacute;n para marcarla una por una.
              </p>
            </div>
          `
          : `
            <div class="tip-box">
              <strong>Modo normal</strong>
              <p>
                El mapa queda limpio para elegir habitaciones. Abre este editor solo cuando
                necesites bloquear una habitación puntual.
              </p>
            </div>
          `
      }
    </section>
  `;
}

function renderScannerPanel() {
  const guestLabel = getActiveGuestLabel();
  const isBulkMode = ui.scannerTargetKind === "bulkGuests";
  const bulkSession = isBulkMode ? getBulkScannerSession() : null;
  const bulkNextTargetLabel = bulkSession ? getBulkNextTargetLabel(bulkSession) : "";
  const capacityState = isBulkMode ? getBulkScannerCapacityState() : null;
  const scannerBlocked = Boolean(
    isBulkMode && bulkSession.responsibleLoaded && capacityState.maxCapacityReached
  );

  return `
    <div class="scanner-box">
      <div class="panel-title-row" style="margin-bottom: 8px;">
        <div>
          <h3>${isBulkMode ? "Escaneo continuo de habitaci&oacute;n" : "Lector de DNI"}</h3>
          <p class="scanner-helper">
            ${
              isBulkMode
                ? `Primer disparo: titular o responsable. Desde el segundo disparo, cada DNI entra como hu&eacute;sped de esta habitaci&oacute;n.`
                : "Mant&eacute;n el cursor aqu&iacute; para que la pistolita pegue el QR. Enter procesa la lectura autom&aacute;ticamente."
            }
          </p>
        </div>
        <div class="chip-row">
          <span class="chip">Destino: ${escapeHtml(isBulkMode ? bulkNextTargetLabel : guestLabel)}</span>
          ${
            isBulkMode
              ? `<span class="chip">Habitaci&oacute;n ${escapeHtml(capacityState.roomNumber || "-")}</span>
                <span class="chip">${escapeHtml(String(capacityState.loadedGuestCount))} hu&eacute;sped${
                  capacityState.loadedGuestCount === 1 ? "" : "es"
                }</span>
                <span class="chip">Capacidad normal ${escapeHtml(String(capacityState.baseCapacity))}</span>
                <span class="chip">M&aacute;ximo ${escapeHtml(String(capacityState.maxCapacity))}</span>`
              : ""
          }
        </div>
      </div>

      ${
        isBulkMode && capacityState.maxCapacityReached
          ? `<div class="scanner-capacity-alert is-maximum">
              <strong>Capacidad m&aacute;xima alcanzada</strong>
              <span>No se pueden escanear m&aacute;s hu&eacute;spedes en esta habitaci&oacute;n.</span>
            </div>`
          : isBulkMode && capacityState.baseCapacityReached
            ? `<div class="scanner-capacity-alert is-extra-bed">
                <strong>Capacidad normal completa</strong>
                <span>La pr&oacute;xima plaza es excepcional y requiere preparar una cama extra.</span>
              </div>`
            : ""
      }

      <textarea
        id="scanner-input"
        class="scanner-input${scannerBlocked ? " is-blocked" : ""}"
        ${scannerBlocked ? "disabled aria-disabled=\"true\"" : ""}
        placeholder='${escapeHtml(
          scannerBlocked
            ? "Capacidad m\u00e1xima alcanzada. Quita una ficha para habilitar el lector."
            : isBulkMode
            ? 'Apunta aqu\u00ed y escanea de corrido. 1\u00ba titular, luego hu\u00e9spedes.'
            : 'Ejemplo: 00727915252"LORENZINO"GABRIEL"M"...'
        )}'
      >${escapeHtml(ui.scannerDraft)}</textarea>

      <div class="actions-row" style="margin-top: 12px;">
        ${
          isBulkMode
            ? ""
            : '<button class="button scanner-action-button" type="button" data-action="parse-scanner">Procesar y cargar</button>'
        }
        <button class="ghost-button" type="button" data-action="focus-scanner" ${scannerBlocked ? "disabled" : ""}>Enfocar lector</button>
        <button class="ghost-button" type="button" data-action="clear-scanner">Limpiar caja</button>
      </div>
    </div>
  `;
}

function renderBulkParseResultPanel(result) {
  const assigned = Array.isArray(result.assigned) ? result.assigned : [];
  const failed = Array.isArray(result.failed) ? result.failed : [];
  const skipped = Array.isArray(result.skipped) ? result.skipped : [];
  const hasIssues = failed.length || skipped.length;
  const responsibleCount = assigned.filter((item) => item.kind === "responsible").length;
  const guestCount = assigned.filter((item) => item.kind === "guest").length;

  return `
    <div class="${assigned.length ? "scanner-result" : "warning-box"}">
      <div class="preview-head">
        <div>
          <h3>Carga continua de la habitaci&oacute;n</h3>
          <p class="preview-copy">
            ${
              assigned.length
                ? `${responsibleCount ? "Titular cargado" : "Titular pendiente"} &middot; ${guestCount} hu&eacute;sped${
                    guestCount === 1 ? "" : "es"
                  } cargado${guestCount === 1 ? "" : "s"}.`
                : "Escanea el primer DNI para cargar titular o responsable."
            }
          </p>
        </div>
        <div class="chip-row">
          <span class="chip">Siguiente: ${escapeHtml(result.nextTargetLabel || "Titular / responsable")}</span>
          ${hasIssues ? `<span class="chip">${failed.length + skipped.length} a revisar</span>` : ""}
        </div>
      </div>
      ${
        assigned.length
          ? `
            <ul class="result-list bulk-result-list" style="margin-top: 12px;">
              ${assigned
                .map(
                  (item, assignmentIndex) => `
                    <li class="bulk-result-item">
                      <span class="bulk-result-person"><strong>${escapeHtml(item.label)}</strong>: ${escapeHtml(
                        [item.result.data.firstName, item.result.data.lastName]
                          .filter(Boolean)
                          .join(" ") || "Sin nombre"
                      )} &middot; DNI ${escapeHtml(item.result.data.document || "-")}</span>
                      <span class="result-pill is-${escapeHtml(item.result.confidence)}">
                        ${escapeHtml(item.result.confidence)}
                      </span>
                      <button
                        class="scanner-assignment-remove"
                        type="button"
                        data-action="remove-bulk-scanner-assignment"
                        data-assignment-index="${assignmentIndex}"
                        aria-label="Quitar ${escapeHtml(item.label)}"
                        title="Quitar ficha cargada"
                      >&times;</button>
                    </li>
                  `
                )
                .join("")}
            </ul>
          `
          : `<p>${escapeHtml(result.error || "No se aplicaron lecturas.")}</p>`
      }
      ${
        hasIssues
          ? `
            <div class="warning-box" style="margin-top: 12px;">
              <strong>Lecturas para revisar</strong>
              <ul class="warning-list" style="margin-top: 10px;">
                ${failed
                  .map(
                    (item) =>
                      `<li>${Number.isFinite(item.lineIndex) ? `L&iacute;nea ${item.lineIndex + 1}` : "Lectura"}: ${escapeHtml(item.error)}</li>`
                  )
                  .join("")}
                ${skipped
                  .map(
                    (item) =>
                      `<li>${Number.isFinite(item.lineIndex) ? `L&iacute;nea ${item.lineIndex + 1}` : "Lectura"}: ${escapeHtml(item.reason)}</li>`
                  )
                  .join("")}
              </ul>
            </div>
          `
          : ""
      }
    </div>
  `;
}

function renderParseResultPanel() {
  const result = ui.parseResult;
  if (!result) {
    if (ui.scannerTargetKind === "bulkGuests") {
      return `
        <div class="preview-card is-empty">
          <div class="preview-head">
            <div>
              <h3>Orden de escaneo</h3>
              <p class="preview-copy">
                1) Escanea el DNI del titular o responsable. 2) Escanea, uno tras otro, los DNI de
                quienes ocupar&aacute;n la habitaci&oacute;n. Si el titular tambi&eacute;n se hospeda, escan&eacute;alo
                nuevamente como hu&eacute;sped.
              </p>
            </div>
          </div>
        </div>
      `;
    }
    return `
      <div class="preview-card is-empty">
        <div class="preview-head">
          <div>
            <h3>Diagn&oacute;stico de lectura</h3>
            <p class="preview-copy">
              Cuando pases un DNI, aqu&iacute; ver&aacute;s qu&eacute; formato detect&oacute; la
              app y qu&eacute; campos recuper&oacute;.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  if (result.bulk) {
    return renderBulkParseResultPanel(result);
  }

  if (!result.ok) {
    return `
      <div class="warning-box">
        <strong>${escapeHtml(result.errorTitle || "No pude interpretar este QR.")}</strong>
        <p>${escapeHtml(result.error)}</p>
        ${
          result.rawScan
            ? `<p class="mono" style="margin-top: 10px;">${escapeHtml(result.rawScan)}</p>`
            : ""
        }
      </div>
    `;
  }

  return `
    <div class="scanner-result">
      <div class="preview-head">
        <div>
          <h3>Diagn&oacute;stico de lectura</h3>
          <p class="preview-copy">
            La app detect&oacute; <strong>${escapeHtml(result.format)}</strong> y carg&oacute; los
            campos debajo.
          </p>
        </div>
        <div class="chip-row">
          <span class="result-pill is-${escapeHtml(result.confidence)}">
            Confianza ${escapeHtml(result.confidence)}
          </span>
        </div>
      </div>
      <ul class="result-list" style="margin-top: 12px;">
        <li>Nombre: ${escapeHtml(result.data.firstName || "-")}</li>
        <li>Apellido: ${escapeHtml(result.data.lastName || "-")}</li>
        <li>DNI: ${escapeHtml(result.data.document || "-")}</li>
        <li>Fecha de nacimiento: ${escapeHtml(result.data.birthDate || "-")}</li>
        <li>G&eacute;nero: ${escapeHtml(result.data.gender || "-")}</li>
        <li>Nacionalidad: ${escapeHtml(result.data.nationality || DEFAULT_NATIONALITY)}</li>
      </ul>
      ${
        result.warnings.length
          ? `
            <div class="warning-box" style="margin-top: 12px;">
              <strong>Revisi&oacute;n sugerida</strong>
              <ul class="warning-list" style="margin-top: 10px;">
                ${result.warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}
              </ul>
            </div>
          `
          : ""
      }
    </div>
  `;
}

function renderScannerModal() {
  if (!ui.isScannerModalOpen) {
    return "";
  }

  const isBulkMode = ui.scannerTargetKind === "bulkGuests";
  const scannerTargetLabel = isBulkMode ? getBulkNextTargetLabel() : getActiveGuestLabel();
  return `
    <div class="scanner-modal-backdrop" data-action="close-scanner-modal"></div>
    <section class="scanner-modal-shell" aria-modal="true" role="dialog" aria-labelledby="scanner-modal-title">
      <div class="scanner-modal">
        <div class="scanner-modal-toolbar">
          <div>
            <p class="scanner-modal-kicker">${isBulkMode ? "Escaneo m\u00faltiple" : "Escaneo activo"}</p>
            <h2 id="scanner-modal-title">${isBulkMode ? "Carga de DNI de hu\u00e9spedes" : "Ventana de lectura"}</h2>
            <p class="scanner-helper">
              El lector está apuntando a <strong>${escapeHtml(scannerTargetLabel)}</strong>.
            </p>
          </div>
          <button class="ghost-button" type="button" data-action="close-scanner-modal">Cerrar</button>
        </div>
        <div class="panel-stack">
          ${renderScannerPanel()}
          ${renderParseResultPanel()}
        </div>
      </div>
    </section>
  `;
}

function renderGroupRoomSelectionCard(descriptor) {
  const {
    roomNumber,
    roomProfile,
    maintenance,
    conflictReservation,
    selectable,
    isSelected,
    compRoomType,
    compRoomMeta,
  } = descriptor;
  const classes = [
    "group-room-button",
    isSelected ? "is-selected" : "",
    compRoomType ? "is-complimentary" : "",
    compRoomType ? `is-${compRoomType}` : "",
    selectable ? "" : "is-disabled",
    maintenance ? "is-maintenance" : "",
    conflictReservation ? "is-occupied" : "",
  ]
    .filter(Boolean)
    .join(" ");

  let kicker = "Disponible";
  let helperText = roomProfile
    ? `Base ${roomProfile.baseCapacity} \u00b7 M\u00e1x. ${roomProfile.maxCapacity}`
    : "Habitaci\u00f3n";
  if (compRoomMeta) {
    kicker = `${compRoomMeta.label} $0`;
    helperText = compRoomMeta.helper;
  } else if (maintenance) {
    kicker = "Mantenimiento";
    helperText = "Deshabilitada manualmente.";
  } else if (conflictReservation) {
    kicker = "No disponible";
    helperText = `${buildReservationTitle(conflictReservation)} \u00b7 ${formatStayRange(
      conflictReservation.checkInDate,
      conflictReservation.checkOutDate
    )}`;
  } else if (isSelected) {
    kicker = "Elegida";
  }
  const compControls =
    isSelected && selectable
      ? `
        <div class="group-room-comp-actions">
          ${Object.entries(GROUP_COMP_ROOM_TYPES)
            .map(
              ([type, meta]) => `
                <button
                  class="ghost-button is-compact group-comp-toggle ${
                    compRoomType === type ? "is-active" : ""
                  }"
                  type="button"
                  data-action="set-group-comp-room"
                  data-room-number="${escapeHtml(roomNumber)}"
                  data-comp-type="${escapeHtml(type)}"
                  title="${escapeHtml(meta.helper)}"
                >
                  ${escapeHtml(type === "coordinators" ? "Coord." : meta.label)} $0
                </button>
              `
            )
            .join("")}
          <button
            class="ghost-button is-compact group-comp-toggle ${compRoomType ? "" : "is-active"}"
            type="button"
            data-action="set-group-comp-room"
            data-room-number="${escapeHtml(roomNumber)}"
            data-comp-type=""
            title="Mantener esta habitaci&oacute;n dentro de las plazas tarifadas"
          >
            Con tarifa
          </button>
        </div>
      `
      : "";

  return `
    <article class="group-room-card ${compControls ? "has-comp-controls" : ""}">
      <button
        class="${classes}"
        type="button"
        data-action="toggle-group-room-selection"
        data-room-number="${escapeHtml(roomNumber)}"
        ${selectable ? "" : "disabled"}
      >
        <span class="group-room-top">
          <span class="group-room-kicker">${escapeHtml(kicker)}</span>
          <span class="group-room-number">Hab. ${escapeHtml(roomNumber)}</span>
        </span>
        <strong>${escapeHtml(roomProfile ? roomProfile.label : "Habitaci\u00f3n")}</strong>
        ${renderRoomBedIcons(roomProfile, "group-room", maintenance)}
        <span class="group-room-meta">${escapeHtml(
          roomProfile ? getRoomCategoryLabel(roomProfile) : "Habitaci\u00f3n"
        )}</span>
        <span class="group-room-helper">${escapeHtml(helperText)}</span>
      </button>
      ${compControls}
    </article>
  `;
}

function renderGroupTariffPanel(draft, quoteSummary) {
  if (!draft.showGroupTariffs) {
    return "";
  }

  const currentTariffs = normalizeTariffs(state.tariffs);
  const groupTariffs = quoteSummary.tariffs;

  return `
    <div class="group-tariff-panel">
      <div class="panel-title-row">
        <div>
          <div class="eyebrow" style="margin-bottom: 8px; color: var(--accent); opacity: 1;">Tarifas pre acordadas</div>
          <h3>Valores especiales del grupo</h3>
          <p>
            Estos importes son solo para esta empresa o contingente. No modifican el tarifario de
            reservas particulares.
          </p>
        </div>
        <button class="ghost-button is-compact" type="button" data-action="copy-current-tariffs-to-group">
          Copiar tarifario sugerido
        </button>
      </div>
      <div class="field-grid">
        ${Object.entries(TARIFF_META)
          .map(
            ([key, meta]) => `
              <label class="field field-span-2">
                <span>${escapeHtml(meta.label)}</span>
                <div class="money-field-shell">
                  <span class="money-prefix">$</span>
                  <input
                    id="group-tariff-${escapeHtml(key)}"
                    data-group-tariff-field="${escapeHtml(key)}"
                    type="text"
                    inputmode="numeric"
                    value="${escapeHtml(formatMoneyInputDisplay(groupTariffs[key]))}"
                    placeholder="${escapeHtml(formatMoneyInputDisplay(currentTariffs[key]))}"
                    autocomplete="off"
                  />
                </div>
                <small>
                  Sugerido particular: ${escapeHtml(formatCurrency(currentTariffs[key]))} por plaza y noche.
                </small>
              </label>
            `
          )
          .join("")}
        ${Object.entries(TARIFF_SUPPLEMENT_META)
          .map(
            ([key, meta]) => `
              <label class="field field-span-2">
                <span>${escapeHtml(meta.label)}</span>
                <div class="money-field-shell">
                  <span class="money-prefix">$</span>
                  <input
                    id="group-tariff-${escapeHtml(key)}"
                    data-group-tariff-field="${escapeHtml(key)}"
                    type="text"
                    inputmode="numeric"
                    value="${escapeHtml(formatMoneyInputDisplay(groupTariffs[key]))}"
                    placeholder="${escapeHtml(formatMoneyInputDisplay(currentTariffs[key]))}"
                    autocomplete="off"
                  />
                </div>
                <small>Por persona y noche, independientemente del tipo de habitaci&oacute;n.</small>
              </label>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderGroupQuoteCard(quoteSummary, summary) {
  const detailRows = quoteSummary.lines
    .map(
      (line) =>
        line.isComplimentary
          ? `
            <li>
              Hab. ${escapeHtml(line.roomNumber)} &middot; ${escapeHtml(line.tariffLabel)}
              &middot; <strong>${escapeHtml(formatCurrency(0))}</strong>
            </li>
          `
          : line.pricingMode === "passenger"
            ? `
            <li>
              Hab. ${escapeHtml(line.roomNumber)} &middot; ${escapeHtml(line.tariffLabel)} &middot;
              ${escapeHtml(String(line.actualGuestCount))} pasajero${
                line.actualGuestCount === 1 ? "" : "s"
              } x ${escapeHtml(formatCurrency(line.rate))} = <strong>${escapeHtml(
                formatCurrency(line.subtotal)
              )}</strong>
            </li>
          `
          : `
            <li>
              Hab. ${escapeHtml(line.roomNumber)} &middot; ${escapeHtml(line.tariffLabel)} &middot;
              ${escapeHtml(String(line.billedGuestCount))} plaza${
                line.billedGuestCount === 1 ? "" : "s"
              } x ${escapeHtml(formatNightsLabel(line.nights))} x ${escapeHtml(
                formatCurrency(line.rate)
              )}${
                line.supplementRate
                  ? ` + ${escapeHtml(formatCurrency(line.supplementRate))} x ${escapeHtml(
                      String(line.actualGuestCount)
                    )} pax`
                  : ""
              } = <strong>${escapeHtml(formatCurrency(line.subtotal))}</strong>
            </li>
          `
    )
    .join("");

  return `
    <div class="group-total-card ${quoteSummary.ready ? "is-ready" : ""}">
      <div>
        <span class="group-total-label">Total pactado del grupo</span>
        <strong class="group-total-value">
          ${quoteSummary.ready ? escapeHtml(formatCurrency(quoteSummary.total)) : "Pendiente"}
        </strong>
        <p>
          ${
            quoteSummary.ready
              ? quoteSummary.pricingMode === "passenger"
                ? `Calculado por monto acordado: ${escapeHtml(
                    formatCurrency(quoteSummary.passengerRate)
                  )} x ${escapeHtml(String(summary.guestCount))} persona${
                    summary.guestCount === 1 ? "" : "s"
                  } tarifada${summary.guestCount === 1 ? "" : "s"}.${
                    summary.complimentaryRoomCount
                      ? ` ${escapeHtml(String(summary.complimentaryRoomCount))} habitaci&oacute;n${
                          summary.complimentaryRoomCount === 1 ? "" : "es"
                        } de cortes&iacute;a queda en $0.`
                      : ""
                  }`
                : `Calculado con ${escapeHtml(String(summary.roomCount))} habitaci&oacute;n${
                    summary.roomCount === 1 ? "" : "es"
                  }${
                    summary.complimentaryRoomCount
                      ? ` (${escapeHtml(String(summary.complimentaryRoomCount))} sin cargo)`
                      : ""
                  }, ${escapeHtml(String(summary.guestCount))} persona${
                    summary.guestCount === 1 ? "" : "s"
                  } tarifada${summary.guestCount === 1 ? "" : "s"} y ${escapeHtml(
                    formatNightsLabel(quoteSummary.nights)
                  )}.`
              : "Carga personas tarifadas, fechas y habitaciones para calcular el total pactado."
          }
        </p>
      </div>
      ${
        detailRows
          ? `
            <details class="group-quote-details">
              <summary>Ver desglose</summary>
              <ul>${detailRows}</ul>
            </details>
          `
          : ""
      }
    </div>
  `;
}

function renderGroupPickerModal() {
  if (!ui.isGroupPickerModalOpen) {
    return "";
  }

  const groups = getEditableGroupSummaries();

  return `
    <div class="scanner-modal-backdrop" data-action="close-group-picker-modal"></div>
    <section class="scanner-modal-shell" aria-modal="true" role="dialog" aria-labelledby="group-picker-modal-title">
      <div class="scanner-modal group-picker-modal">
        <div class="scanner-modal-toolbar">
          <div>
            <p class="scanner-modal-kicker">Editar grupos</p>
            <h2 id="group-picker-modal-title">Elegir reserva grupal</h2>
            <p class="scanner-helper">
              Selecciona el grupo para modificar empresa, fechas, r&eacute;gimen, color, tarifas o habitaciones.
            </p>
          </div>
          <button class="ghost-button" type="button" data-action="close-group-picker-modal">Cerrar</button>
        </div>

        <div class="group-picker-list">
          ${
            groups.length
              ? groups
                  .map((group) => {
                    const groupColor = group.groupColor || sanitizeGroupColor("", group.company);
                    const roomLabel = group.rooms.length
                      ? `Hab. ${group.rooms.join(", ")}`
                      : "Sin habitaciones asignadas";
                    return `
                      <button
                        class="group-picker-option"
                        type="button"
                        data-action="choose-group-to-edit"
                        data-group-id="${escapeHtml(group.id)}"
                        style="--group-picker-color: ${escapeHtml(groupColor)}; --group-picker-ink: ${escapeHtml(
                          getReadableInkForGroupColor(groupColor)
                        )};"
                      >
                        <span class="group-picker-initial" aria-hidden="true">${escapeHtml(
                          getGroupInitial(group.company)
                        )}</span>
                        <span class="group-picker-copy">
                          <strong>${escapeHtml(group.company)}</strong>
                          <small>
                            ${escapeHtml(formatStayRange(group.checkInDate, group.checkOutDate))}
                            &middot; ${escapeHtml(roomLabel)}
                            &middot; ${group.regime ? escapeHtml(group.regime) : "R&eacute;gimen pendiente"}
                          </small>
                        </span>
                      </button>
                    `;
                  })
                  .join("")
              : `
                <div class="empty-state">
                  <strong>No hay grupos activos.</strong>
                  <p>Cuando cargues una reserva grupal, aparecer&aacute; aqu&iacute;.</p>
                </div>
              `
          }
        </div>
      </div>
    </section>
  `;
}

function renderGroupLoadModal() {
  if (!ui.isGroupLoadModalOpen) {
    return "";
  }

  const draft = getGroupDraft();
  const summary = getGroupSelectionCapacitySummary(draft);
  const hasValidDates = hasValidStayDates(draft.checkInDate, draft.checkOutDate);
  const canSuggest = Boolean(summary.guestCount && hasValidDates);
  const canCreate =
    Boolean(sanitizeGroupCompany(draft.company)) &&
    Boolean(sanitizeRegime(draft.regime)) &&
    summary.guestCount > 0 &&
    summary.roomCount > 0 &&
    !summary.hasTooManyRooms &&
    summary.fitsMax;
  const extraGuestsNeeded = Math.max(0, summary.guestCount - summary.baseCapacity);
  const selectedRoomsLabel = summary.descriptors.length
    ? summary.descriptors
        .map((descriptor) =>
          descriptor.compRoomMeta
            ? `${descriptor.roomNumber} (${descriptor.compRoomMeta.label} $0)`
            : descriptor.roomNumber
        )
        .join(", ")
    : "Sin habitaciones elegidas";
  const descriptors = ROOM_OPTIONS.map((roomNumber) => getGroupRoomDescriptor(roomNumber, draft));
  const selectedGroupColor = sanitizeGroupColor(draft.groupColor, draft.company);
  const groupInitial = sanitizeEditableGroupInitial(draft.groupInitial);
  const previewGroupInitial = groupInitial || getGroupInitial(draft.company);
  const quoteSummary = getGroupQuoteSummary(draft, summary);
  const isEditingGroup = Boolean(draft.editingGroupId);

  return `
    <div class="scanner-modal-backdrop group-load-modal-backdrop" aria-hidden="true"></div>
    <section class="scanner-modal-shell" aria-modal="true" role="dialog" aria-labelledby="group-load-modal-title">
      <div class="scanner-modal group-modal">
        <div class="scanner-modal-toolbar">
          <div>
            <p class="scanner-modal-kicker">Carga grupal</p>
            <h2 id="group-load-modal-title">${
              isEditingGroup ? "Editar reserva de empresa o contingente" : "Reserva de empresa o contingente"
            }</h2>
            <p class="scanner-helper">
              ${
                isEditingGroup
                  ? "Modifica empresa, fechas, color, tarifas o habitaciones del grupo sin perder los datos ya cargados en las habitaciones que sigan elegidas."
                  : "Deja tomadas las habitaciones del grupo ahora y completa los titulares reales cuando llegue cada uno."
              }
            </p>
          </div>
          <button class="ghost-button" type="button" data-action="close-group-load-modal">Cerrar</button>
        </div>

        <div class="group-form-layout">
          <section class="group-form-section is-primary">
            <div class="group-form-heading">
              <div>
                <strong>Datos principales</strong>
                <span>Identifican al contingente y alimentan el Libro de Registro.</span>
              </div>
              <span class="group-section-badge">Clave</span>
            </div>
            <div class="group-form-grid group-form-grid-main">
              <label class="field group-field-large">
                <span>Empresa o grupo</span>
                <input
                  id="group-company"
                  data-group-field="company"
                  type="text"
                  value="${escapeHtml(draft.company)}"
                  placeholder="Ejemplo: Empresa del Norte"
                  autocomplete="off"
                />
              </label>
              <label class="field">
                <span>Procedencia declarada</span>
                <input
                  id="group-travelOrigin"
                  data-group-field="travelOrigin"
                  type="text"
                  maxlength="${MAX_TRAVEL_ORIGIN_LENGTH}"
                  value="${escapeHtml(sanitizeTravelOrigin(draft.travelOrigin, { trim: false }))}"
                  placeholder="Ejemplo: Rosario"
                  autocomplete="off"
                />
                <small>Se duplicar&aacute; como procedencia y destino legal.</small>
              </label>
            </div>
          </section>

          <section class="group-form-section is-important">
            <div class="group-form-heading">
              <div>
                <strong>Estad&iacute;a y tarifa</strong>
                <span>Estos datos definen disponibilidad, precio y habitaciones sugeridas.</span>
              </div>
              <span class="group-section-badge is-warm">Obligatorio</span>
            </div>
            <div class="group-form-grid group-operational-grid">
              <label class="field group-field-important">
                <span>Personas tarifadas</span>
                <input
                  id="group-guestCount"
                  data-group-field="guestCount"
                  type="text"
                  inputmode="numeric"
                  value="${escapeHtml(draft.guestCount)}"
                  placeholder="0"
                  autocomplete="off"
                />
                <small>Choferes y coordinadores sin cargo van en habitaciones de cortes&iacute;a.</small>
              </label>
              <label class="field group-field-important">
                <span>Monto acordado por pasajero</span>
                <div class="money-field-shell">
                  <span class="money-prefix">$</span>
                  <input
                    id="group-passenger-rate"
                    data-group-field="groupPassengerRate"
                    type="text"
                    inputmode="numeric"
                    value="${escapeHtml(formatMoneyInputDisplay(draft.groupPassengerRate))}"
                    placeholder="Opcional"
                    autocomplete="off"
                  />
                </div>
                <small>Si se carga, reemplaza el c&aacute;lculo por habitaci&oacute;n.</small>
              </label>
              <label class="field group-field-important">
                <span>R&eacute;gimen general</span>
                <select id="group-regime" data-group-field="regime">
                  ${REGIME_OPTIONS.map(
                    (option) =>
                      `<option value="${escapeHtml(option)}"${
                        draft.regime === option ? " selected" : ""
                      }>${escapeHtml(option || "Elegir")}</option>`
                  ).join("")}
                </select>
              </label>
              <label class="field">
                <span>Fecha ingreso</span>
                <input
                  id="group-checkInDate"
                  data-group-field="checkInDate"
                  type="date"
                  lang="es-AR"
                  data-date-picker="true"
                  value="${escapeHtml(draft.checkInDate)}"
                  autocomplete="off"
                />
              </label>
              <label class="field">
                <span>Fecha egreso</span>
                <input
                  id="group-checkOutDate"
                  data-group-field="checkOutDate"
                  type="date"
                  lang="es-AR"
                  data-date-picker="true"
                  min="${escapeHtml(getMinimumCheckOutDate(draft.checkInDate))}"
                  value="${escapeHtml(draft.checkOutDate)}"
                  autocomplete="off"
                />
              </label>
            </div>
          </section>

          <section class="group-form-section is-visual">
            <div class="group-form-heading">
              <div>
                <strong>Referencia visual</strong>
                <span>Solo ayuda a reconocer el grupo en la l&iacute;nea del tiempo y en bebidas.</span>
              </div>
            </div>
            <div class="group-visual-layout">
              <label class="field group-initial-field">
                <span>Inicial</span>
                <input
                  id="group-initial"
                  data-group-field="groupInitial"
                  type="text"
                  maxlength="1"
                  value="${escapeHtml(groupInitial)}"
                  placeholder="N"
                  autocomplete="off"
                />
              </label>
              <div class="field group-color-picker">
                <span>Color del grupo</span>
                <div class="group-color-preview">
                  <span
                    class="group-color-initial"
                    style="--group-color: ${escapeHtml(selectedGroupColor)}; --group-ink: ${escapeHtml(
                      getReadableInkForGroupColor(selectedGroupColor)
                    )};"
                  >${escapeHtml(previewGroupInitial)}</span>
                  <small>
                    As&iacute; se ver&aacute;n las habitaciones vinculadas a esta empresa.
                  </small>
                </div>
                <div class="group-color-grid" role="list" aria-label="Paleta de colores para grupos">
                  ${GROUP_COLOR_PALETTE.map(
                    (color) => `
                      <button
                        class="group-color-swatch ${color === selectedGroupColor ? "is-selected" : ""}"
                        type="button"
                        data-action="select-group-color"
                        data-group-color="${escapeHtml(color)}"
                        style="--group-color: ${escapeHtml(color)};"
                        title="Elegir color"
                        aria-label="Elegir color ${escapeHtml(color)}"
                      ></button>
                    `
                  ).join("")}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="group-summary-card">
          <div class="group-summary-copy">
            <strong>Habitaciones elegidas</strong>
            <p>${escapeHtml(selectedRoomsLabel)}</p>
            <p>
              Capacidad tarifada base ${escapeHtml(summary.baseCapacity)} plaza${
                summary.baseCapacity === 1 ? "" : "s"
              } &middot; Capacidad m&aacute;xima ${escapeHtml(summary.maxCapacity)}.
              ${
                summary.complimentaryRoomCount
                  ? ` ${escapeHtml(String(summary.complimentaryRoomCount))} habitaci&oacute;n${
                      summary.complimentaryRoomCount === 1 ? "" : "es"
                    } sin cargo no suma al total pactado.`
                  : ""
              }
            </p>
          </div>
          <div class="group-summary-actions">
            <button
              class="ghost-button is-compact ${draft.showGroupTariffs ? "is-active" : ""}"
              type="button"
              data-action="toggle-group-tariffs"
            >
              Tarifas pre acordadas
            </button>
            <button
              class="ghost-button is-compact"
              type="button"
              data-action="suggest-group-rooms"
              ${canSuggest ? "" : "disabled"}
            >
              Sugerir habitaciones
            </button>
          </div>
        </div>

        ${renderGroupTariffPanel(draft, quoteSummary)}
        ${renderGroupQuoteCard(quoteSummary, summary)}

        ${
          !sanitizeTravelOrigin(draft.travelOrigin)
            ? `
              <div class="tip-box">
                <strong>Procedencia legal pendiente</strong>
                <p>Conviene cargar de d&oacute;nde viene el grupo. No bloquea la reserva y luego se duplicar&aacute; como destino en el Libro de Registro.</p>
              </div>
            `
            : ""
        }

        ${
          !sanitizeRegime(draft.regime)
            ? `
              <div class="warning-box">
                <strong>Falta el r&eacute;gimen general</strong>
                <p>Eleg&iacute; Desayuno, Media Pensi&oacute;n o Pensi&oacute;n Completa para poder concretar el grupo.</p>
              </div>
            `
            : !hasValidDates
            ? `
              <div class="warning-box">
                <strong>Faltan fechas del grupo</strong>
                <p>Completa ingreso y egreso para ver la disponibilidad real y elegir habitaciones.</p>
              </div>
            `
            : summary.hasTooManyRooms
              ? `
                <div class="warning-box">
                  <strong>Revisa la selecci&oacute;n</strong>
                  <p>Hay m&aacute;s habitaciones tarifadas elegidas que personas tarifadas en la reserva grupal.</p>
                </div>
              `
              : summary.roomCount === 0
                ? `
                    <div class="tip-box">
                      <strong>Selecciona habitaciones</strong>
                    <p>Puedes elegirlas a mano o usar la sugerencia autom&aacute;tica seg&uacute;n la cantidad de personas tarifadas.</p>
                  </div>
                `
                : summary.hasExcessBillableCapacity
                  ? `
                    <div class="warning-box">
                      <strong>Plazas tarifadas excedidas</strong>
                      <p>
                        Las habitaciones tarifadas elegidas suman ${escapeHtml(String(summary.baseCapacity))} plaza${
                          summary.baseCapacity === 1 ? "" : "s"
                        } para ${escapeHtml(String(summary.guestCount))} hu&eacute;sped${
                          summary.guestCount === 1 ? "" : "es"
                        } tarifado${summary.guestCount === 1 ? "" : "s"}. Sobran ${escapeHtml(
                          String(summary.excessBaseCapacity)
                        )} plaza${summary.excessBaseCapacity === 1 ? "" : "s"} paga${
                          summary.excessBaseCapacity === 1 ? "" : "s"
                        }; las habitaciones de choferes y coordinadores no entran en este conteo.
                      </p>
                    </div>
                  `
                : summary.fitsBase
                  ? `
                    <div class="tip-box">
                      <strong>Capacidad cubierta</strong>
                      <p>La selecci&oacute;n actual alcanza al grupo sin depender de cama extra.</p>
                    </div>
                  `
                  : summary.fitsMax
                    ? `
                      <div class="warning-box">
                        <strong>Capacidad excepcional</strong>
                        <p>
                          La selecci&oacute;n llega a ${escapeHtml(summary.guestCount)} personas, pero
                          requerir&aacute; cama extra en al menos ${escapeHtml(extraGuestsNeeded)} habitaci&oacute;n${
                            extraGuestsNeeded === 1 ? "" : "es"
                          }.
                        </p>
                      </div>
                    `
                    : `
                      <div class="warning-box">
                        <strong>Faltan plazas</strong>
                        <p>Con las habitaciones elegidas todav&iacute;a no se alcanza la capacidad necesaria para el grupo.</p>
                      </div>
                    `
        }

        <div class="group-room-grid">
          ${descriptors.map((descriptor) => renderGroupRoomSelectionCard(descriptor)).join("")}
        </div>

        <div class="pricing-actions group-modal-footer">
          <div class="chip-row">
            <span class="chip">${escapeHtml(formatStayRange(draft.checkInDate, draft.checkOutDate))}</span>
            ${
              draft.regime
                ? `<span class="chip">${escapeHtml(draft.regime)}</span>`
                : `<span class="chip">Sin r&eacute;gimen general</span>`
            }
            ${
              sanitizeTravelOrigin(draft.travelOrigin)
                ? `<span class="chip">Procedencia: ${escapeHtml(sanitizeTravelOrigin(draft.travelOrigin))}</span>`
                : `<span class="chip">Procedencia sin cargar</span>`
            }
          </div>
          <div class="group-modal-footer-actions">
            ${
              isEditingGroup
                ? `
                  <button
                    class="danger-button"
                    type="button"
                    data-action="delete-group-reservation"
                    data-group-id="${escapeHtml(draft.editingGroupId)}"
                  >
                    Eliminar reserva
                  </button>
                `
                : ""
            }
            <button
              class="button"
              type="button"
              data-action="create-group-reservations"
              ${canCreate ? "" : "disabled"}
            >
              ${isEditingGroup ? "Guardar cambios del grupo" : "Crear reservas del grupo"}
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderTariffModal() {
  if (!ui.isTariffModalOpen) {
    return "";
  }

  const draft = ui.tariffDraft || normalizeTariffs(state.tariffs);
  return `
    <div class="scanner-modal-backdrop" data-action="close-tariff-modal"></div>
    <section class="scanner-modal-shell" aria-modal="true" role="dialog" aria-labelledby="tariff-modal-title">
      <div class="scanner-modal tariff-modal">
        <div class="scanner-modal-toolbar">
          <div>
            <p class="scanner-modal-kicker">Reservas particulares</p>
            <h2 id="tariff-modal-title">Tarifario de particulares</h2>
            <p class="scanner-helper">
              Edita aqu&iacute; los importes base por persona y por noche para reservas particulares.
              Las tarifas pre acordadas de grupos se cargan aparte dentro de cada grupo.
            </p>
          </div>
          <button class="ghost-button" type="button" data-action="close-tariff-modal">Cerrar</button>
        </div>
        <div class="field-grid">
          ${Object.entries(TARIFF_META)
            .map(
              ([key, meta]) => `
                <label class="field field-span-2 tariff-field">
                  <span>${escapeHtml(meta.label)}</span>
                  <div class="money-field-shell">
                    <span class="money-prefix">$</span>
                    <input
                      id="tariff-${escapeHtml(key)}"
                      data-tariff-field="${escapeHtml(key)}"
                      type="text"
                      inputmode="numeric"
                      value="${escapeHtml(formatMoneyInputDisplay(draft[key]))}"
                      placeholder="0"
                      autocomplete="off"
                    />
                  </div>
                  <small>
                    ${meta.guestCount} pasajero${meta.guestCount === 1 ? "" : "s"} &middot; ${escapeHtml(
                      formatCurrency(draft[key])
                    )} por persona.
                  </small>
                </label>
              `
            )
            .join("")}
          ${Object.entries(TARIFF_SUPPLEMENT_META)
            .map(
              ([key, meta]) => `
                <label class="field field-span-2 tariff-field">
                  <span>${escapeHtml(meta.label)}</span>
                  <div class="money-field-shell">
                    <span class="money-prefix">$</span>
                    <input
                      id="tariff-${escapeHtml(key)}"
                      data-tariff-field="${escapeHtml(key)}"
                      type="text"
                      inputmode="numeric"
                      value="${escapeHtml(formatMoneyInputDisplay(draft[key]))}"
                      placeholder="0"
                      autocomplete="off"
                    />
                  </div>
                  <small>Adicional por persona y noche. Desayuno queda incluido en las bases.</small>
                </label>
              `
            )
            .join("")}
          <div class="field field-span-4 pricing-box">
            <div class="pricing-copy">
              <strong>Criterio aplicado</strong>
              <p>Single para 1 plaza, doble para 2, triple para 3 y cu&aacute;druple para 4.</p>
              <p>Si eliges una habitaci&oacute;n mayor, la sugerencia respeta la base comercial de esa habitaci&oacute;n.</p>
            </div>
            <div class="pricing-actions">
              <button class="button is-compact" type="button" data-action="save-tariff-modal">
                Guardar tarifas
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderReservationConfirmModal() {
  if (!ui.isReservationConfirmModalOpen) {
    return "";
  }

  const reservation = getReservationForConfirmation();
  if (!reservation) {
    return "";
  }

  const hardIssues = getReservationConfirmationHardIssues(reservation);
  const softWarnings = getReservationConfirmationSoftWarnings(reservation);
  const responsible = getTitular(reservation);
  const operationalInfo = getReservationOperationalInfo(reservation);
  const canConfirm = hardIssues.length === 0;
  const isConfirmed = Boolean(reservation.confirmedAt);

  return `
    <div class="scanner-modal-backdrop" data-action="close-reservation-confirm-modal"></div>
    <section class="scanner-modal-shell" aria-modal="true" role="dialog" aria-labelledby="reservation-confirm-title">
      <div class="scanner-modal confirm-modal">
        <div class="scanner-modal-toolbar">
          <div>
            <p class="scanner-modal-kicker">Confirmaci&oacute;n</p>
            <h2 id="reservation-confirm-title">${isConfirmed ? "Confirmar cambios" : "Confirmar reserva"}</h2>
            <p class="scanner-helper">
              ${escapeHtml(buildReservationTitle(reservation))} &middot; ${escapeHtml(
                formatStayRange(reservation.checkInDate, reservation.checkOutDate)
              )}
            </p>
          </div>
          <button class="ghost-button" type="button" data-action="close-reservation-confirm-modal">Cerrar</button>
        </div>

        <div class="panel-stack">
          <div class="preview-card">
            <div class="preview-head">
              <div>
                <h3>Resumen r&aacute;pido</h3>
                <p class="preview-copy">
                  Responsable: ${escapeHtml(
                    [responsible.firstName, responsible.lastName].filter(Boolean).join(" ").trim() ||
                      "Sin cargar"
                  )} &middot; Habitaci&oacute;n ${escapeHtml(reservation.roomNumber || "-")}.
                </p>
              </div>
              <div class="chip-row">
                <span class="chip">${getReservationGuestCount(reservation)} hu&eacute;spedes</span>
                <span class="chip">${escapeHtml(operationalInfo.label)}</span>
                <span class="chip">${escapeHtml(reservation.regime || "Sin régimen")}</span>
              </div>
            </div>
          </div>

          ${
            hardIssues.length
              ? `
                <div class="warning-box">
                  <strong>No se puede confirmar todav&iacute;a</strong>
                  <ul class="warning-list" style="margin-top: 10px;">
                    ${hardIssues.map((issue) => `<li>${escapeHtml(issue)}</li>`).join("")}
                  </ul>
                </div>
              `
              : ""
          }

          ${
            softWarnings.length
              ? `
                <div class="${canConfirm ? "tip-box" : "warning-box"}">
                  <strong>${canConfirm ? "Faltan datos por revisar" : "Revisi&oacute;n sugerida"}</strong>
                  <ul class="warning-list" style="margin-top: 10px;">
                    ${softWarnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}
                  </ul>
                  ${
                    canConfirm
                      ? `<p style="margin-top: 10px;">Si quieres, puedes confirmar igual aunque falte esta informaci&oacute;n.</p>`
                      : ""
                  }
                </div>
              `
              : canConfirm
                ? `
                  <div class="tip-box">
                    <strong>Reserva lista para confirmar</strong>
                    <p>Todo lo importante ya est&aacute; en orden. Puedes confirmarla ahora.</p>
                  </div>
                `
                : ""
          }

          <div class="actions-row">
            <button class="ghost-button" type="button" data-action="close-reservation-confirm-modal">
              Seguir revisando
            </button>
            ${
              canConfirm
                ? `
                  <button class="button" type="button" data-action="confirm-reservation">
                    ${
                      softWarnings.length
                        ? isConfirmed
                          ? "Confirmar cambios igualmente"
                          : "Confirmar igualmente"
                        : isConfirmed
                          ? "Confirmar cambios"
                          : "Confirmar reserva"
                    }
                  </button>
                `
                : ""
            }
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderStayPaymentModal() {
  if (!ui.isStayPaymentModalOpen) {
    return "";
  }

  const reservation = getReservationForStayPayment();
  if (!reservation) {
    return "";
  }

  const summary = getPaymentSummary(reservation);
  const totalText =
    summary.total === null ? "Sin total cargado" : escapeHtml(formatCurrency(summary.total));
  const paidText = escapeHtml(formatCurrency(summary.paid));
  const pendingText =
    summary.pending === null ? "Sin base" : escapeHtml(formatCurrency(summary.pending));
  const roomLabel = reservation.roomNumber ? `Hab ${reservation.roomNumber}` : "Sin habitación";
  const responsible = getTitular(reservation);
  const guestName =
    [responsible.firstName, responsible.lastName].filter(Boolean).join(" ").trim() ||
    "Titular pendiente";

  return `
    <div class="scanner-modal-backdrop" data-action="close-stay-payment-modal"></div>
    <section class="scanner-modal-shell" aria-modal="true" role="dialog" aria-labelledby="stay-payment-title">
      <div class="scanner-modal stay-payment-modal">
        <div class="scanner-modal-toolbar">
          <div>
            <p class="scanner-modal-kicker">Pago de estad&iacute;a</p>
            <h2 id="stay-payment-title">Abonar habitaci&oacute;n</h2>
            <p>Registrar el ingreso de ${escapeHtml(roomLabel)} · ${escapeHtml(guestName)} en la caja correcta.</p>
          </div>
          <button class="ghost-button is-compact" type="button" data-action="close-stay-payment-modal">
            Cerrar
          </button>
        </div>
        <div class="stay-payment-summary">
          <span>Total <strong>${totalText}</strong></span>
          <span>Pagado <strong>${paidText}</strong></span>
          <span>Pendiente <strong>${pendingText}</strong></span>
        </div>
        <div class="stay-payment-choice-grid">
          <button class="stay-payment-choice" type="button" data-action="apply-stay-payment" data-method="cash">
            <strong>Efectivo</strong>
            <span>Ingresa a caja de hotel en efectivo.</span>
          </button>
          <button class="stay-payment-choice" type="button" data-action="apply-stay-payment" data-method="transfer">
            <strong>Transferencia bancaria</strong>
            <span>Ingresa a caja de hotel por transferencia.</span>
          </button>
          <button class="stay-payment-choice" type="button" data-action="open-combined-stay-payment-modal" data-method="combined">
            <strong>Pago combinado</strong>
            <span>Distribuye el saldo entre efectivo y transferencia.</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderCombinedStayPaymentModal() {
  if (!ui.isCombinedStayPaymentModalOpen) {
    return "";
  }

  const reservation = getReservationForStayPayment();
  if (!reservation) {
    return "";
  }

  const pending = getPendingStayPaymentAmount(reservation);
  const draft = ui.combinedStayPaymentDraft || { cash: "0", transfer: String(pending) };
  const cash = Math.max(0, Math.round(parseAmount(draft.cash) || 0));
  const transfer = Math.max(0, Math.round(parseAmount(draft.transfer) || 0));

  return `
    <div class="scanner-modal-backdrop combined-stay-payment-backdrop" data-action="close-combined-stay-payment-modal"></div>
    <section class="scanner-modal-shell combined-stay-payment-shell" aria-modal="true" role="dialog" aria-labelledby="combined-stay-payment-title">
      <div class="scanner-modal combined-stay-payment-modal">
        <div class="scanner-modal-toolbar">
          <div>
            <p class="scanner-modal-kicker">Distribuci&oacute;n del cobro</p>
            <h2 id="combined-stay-payment-title">Pago combinado</h2>
            <p>Al modificar un importe, el otro se calcula autom&aacute;ticamente.</p>
          </div>
          <button class="ghost-button is-compact" type="button" data-action="close-combined-stay-payment-modal">
            Cerrar
          </button>
        </div>
        <div class="combined-payment-total">
          <span>Saldo pendiente a distribuir</span>
          <strong>${escapeHtml(formatCurrency(pending))}</strong>
        </div>
        <div class="combined-payment-grid">
          <label class="field">
            <span>Efectivo</span>
            <div class="money-field-shell required-filled">
              <span class="money-prefix">$</span>
              <input
                id="combined-stay-payment-cash"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                value="${escapeHtml(formatMoneyInputDisplay(cash))}"
                data-combined-stay-payment-field="cash"
              />
            </div>
          </label>
          <label class="field">
            <span>Transferencia bancaria</span>
            <div class="money-field-shell required-filled">
              <span class="money-prefix">$</span>
              <input
                id="combined-stay-payment-transfer"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                value="${escapeHtml(formatMoneyInputDisplay(transfer))}"
                data-combined-stay-payment-field="transfer"
              />
            </div>
          </label>
        </div>
        <div class="combined-payment-balance" id="combined-payment-balance">
          Efectivo ${escapeHtml(formatCurrency(cash))} + transferencia ${escapeHtml(
            formatCurrency(transfer)
          )} = ${escapeHtml(formatCurrency(cash + transfer))}
        </div>
        <div class="actions-row combined-payment-actions">
          <button class="ghost-button" type="button" data-action="close-combined-stay-payment-modal">
            Cancelar
          </button>
          <button class="button" type="button" data-action="apply-combined-stay-payment">
            Confirmar pago combinado
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderRoomShortcutModal() {
  const roomNumber = sanitizeRoomNumber(ui.pendingRoomShortcutNumber);
  if (!roomNumber) {
    return "";
  }

  const referenceDate = normalizeInputDate(ui.pendingRoomShortcutDate) || getRoomOverviewDate();
  const descriptor = getRoomOverviewDescriptor(roomNumber, referenceDate);
  const statusCopy =
    descriptor.status === "occupied"
      ? `Figura tomada para ${formatDisplayDate(descriptor.referenceDate)}. Igual puedes abrir la reserva y revisar fechas.`
      : descriptor.status === "maintenance"
        ? "Figura en mantenimiento. Igual puedes preparar la reserva y decidir despu&eacute;s."
        : `Figura disponible para ${formatDisplayDate(descriptor.referenceDate)}.`;

  return `
    <div class="scanner-modal-backdrop room-shortcut-backdrop" data-action="close-room-shortcut-modal"></div>
    <section class="scanner-modal-shell room-shortcut-shell" aria-modal="true" role="dialog" aria-labelledby="room-shortcut-title">
      <div class="scanner-modal room-shortcut-modal">
        <div class="scanner-modal-toolbar">
          <div>
            <p class="scanner-modal-kicker">Habitaci&oacute;n ${escapeHtml(roomNumber)}</p>
            <h2 id="room-shortcut-title">¿Quer&eacute;s cargar una reserva?</h2>
            <p class="scanner-helper">${statusCopy}</p>
          </div>
        </div>
        <div class="actions-row">
          <button class="ghost-button" type="button" data-action="close-room-shortcut-modal">
            Cancelar
          </button>
          <button class="button" type="button" data-action="confirm-room-shortcut-reservation">
            S&iacute;, cargar reserva
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderQuickExportPanel(reservation) {
  if (!reservation) {
    return `
      <div class="preview-card">
        <div class="preview-head">
          <div>
            <h3>Respaldo local</h3>
            <p class="preview-copy">
              Desde aqu&iacute; puedes guardar o restaurar el trabajo completo de este navegador.
            </p>
          </div>
        </div>
        <div class="actions-row" style="margin-top: 12px;">
          <button class="button" type="button" data-action="export-backup">Exportar JSON</button>
          <button class="ghost-button" type="button" data-action="trigger-import">Importar JSON</button>
        </div>

        <ul class="checklist" style="margin-top: 14px;">
          <li>&Uacute;ltimo guardado local: ${escapeHtml(formatLocalDateTime(state.lastSavedAt))}</li>
          <li>Reservas archivadas: ${getArchivedReservationsCount()}</li>
          <li>Reservas visibles: ${getVisibleReservations().length}</li>
        </ul>

        <div class="tip-box" style="margin-top: 14px;">
          <strong>Panel general</strong>
          <p>No hay una reserva en carga en este momento. El respaldo sigue disponible igual.</p>
        </div>
      </div>
    `;
  }

  const responsible = getTitular(reservation);
  const blockingIssue = getReservationBlockingIssue(reservation);
  const reviewWarnings = [];
  if (!reservation.roomNumber) {
    reviewWarnings.push("Falta definir el n\u00famero de habitaci\u00f3n.");
  }
  if (blockingIssue) {
    reviewWarnings.push(blockingIssue.message);
  }
  if (!reservation.checkInDate || !reservation.checkOutDate) {
    reviewWarnings.push("Falta cargar ingreso y egreso.");
  }
  if (!responsible.firstName || !responsible.lastName || !responsible.document) {
    reviewWarnings.push("El titular o responsable todav\u00eda no tiene nombre, apellido y DNI completos.");
  }
  if (reservation.guests.some((guest) => !hasGuestData(guest))) {
    reviewWarnings.push("Hay fichas vac\u00edas o hu\u00e9spedes pendientes de cargar.");
  }
  if (reservation.confirmedAt && !isRoomAccessReady(reservation)) {
    reviewWarnings.push("El legajo todav\u00eda no habilita el ingreso ni la impresi\u00f3n legal.");
  }

  return `
    <div class="preview-card">
      <div class="preview-head">
        <div>
          <h3>Respaldo local</h3>
          <p class="preview-copy">
            Desde aqu&iacute; puedes guardar o restaurar el trabajo de este navegador.
          </p>
        </div>
      </div>
      <div class="actions-row" style="margin-top: 12px;">
        <button class="button" type="button" data-action="export-backup">Exportar JSON</button>
        <button class="ghost-button" type="button" data-action="trigger-import">Importar JSON</button>
      </div>

      <ul class="checklist" style="margin-top: 14px;">
        <li>&Uacute;ltimo guardado local: ${escapeHtml(formatLocalDateTime(state.lastSavedAt))}</li>
        <li>&Uacute;ltima lectura QR: ${escapeHtml(formatLocalDateTime(reservation.lastScanAt))}</li>
        <li>Reservas archivadas: ${getArchivedReservationsCount()}</li>
      </ul>

      ${
        reviewWarnings.length
          ? `
            <div class="warning-box" style="margin-top: 14px;">
              <strong>Revisi&oacute;n pendiente</strong>
              <ul class="warning-list" style="margin-top: 10px;">
                ${reviewWarnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}
              </ul>
            </div>
          `
          : `
            <div class="tip-box" style="margin-top: 14px;">
              <strong>Reserva prolija</strong>
              <p>La informaci&oacute;n principal ya qued&oacute; ordenada dentro de la app.</p>
            </div>
          `
      }
    </div>
  `;
}

function renderStayPaymentHistoryButton(reservation) {
  if (!canShowStayPaymentAction(reservation)) {
    return "";
  }
  const status = getStayPaymentStatus(reservation);
  if (status.className === "is-green" || status.className === "is-rust") {
    return `<span class="status-badge ${
      status.className === "is-rust" ? "is-stay-deferred" : "is-stay-paid"
    } legal-print-state" title="${escapeHtml(status.helper)}">${escapeHtml(status.label)}</span>`;
  }
  const buttonClass =
    status.className === "is-green"
      ? "ghost-button"
      : status.className === "is-rust"
        ? "button is-rust"
        : "button is-blue";
  return `
    <button
      class="${buttonClass} is-compact"
      type="button"
      data-action="open-stay-payment-modal"
      data-reservation-id="${escapeHtml(reservation.id)}"
      title="${escapeHtml(status.helper)}"
    >
      ${escapeHtml(status.label)}
    </button>
  `;
}

function renderHistoryReservationTitle(reservation) {
  const room = reservation && reservation.roomNumber ? `Hab. ${reservation.roomNumber}` : "Reserva nueva";
  const company = getReservationCompanyLabel(reservation);
  const responsible = getTitular(reservation);
  const responsibleName = [responsible.firstName, responsible.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (!company) {
    return `<div class="history-title">${escapeHtml(buildReservationTitle(reservation))}</div>`;
  }

  const fullTitle = [room, company, responsibleName].filter(Boolean).join(" · ");
  return `
    <div class="history-title history-title-line" title="${escapeHtml(fullTitle)}">
      <span class="history-title-room">${escapeHtml(room)}</span>
      <span class="history-title-dot">&middot;</span>
      <span class="history-title-company">${escapeHtml(company)}</span>
      ${
        responsibleName
          ? `
            <span class="history-title-dot">&middot;</span>
            <span class="history-title-responsible">${escapeHtml(responsibleName)}</span>
          `
          : ""
      }
    </div>
  `;
}

function getHistoryOpenReservationActionLabel(reservation) {
  if (isReservationsMode()) {
    return "Editar reserva";
  }
  return needsHistoryLegajoBadge(reservation) ? "Cargar legajo" : "Editar habitaci\u00f3n";
}

function isReservationVisibleForCurrentMode(reservation) {
  if (!reservation || reservation.archived) {
    return false;
  }
  if (isReservationsMode()) {
    return !isReservationReadyForCheckinHistory(reservation);
  }
  if (!reservation.confirmedAt) {
    return false;
  }
  const operationalInfo = getReservationOperationalInfo(reservation);
  return ["today", "in-house", "past"].includes(operationalInfo.key)
    ? !isReservationReadyForCheckinHistory(reservation)
    : false;
}

function renderHistoryPanel() {
  const reservations = getReservationsSorted().filter(isReservationVisibleForCurrentMode);
  const editableGroups = getEditableGroupSummaries();
  const isBookingPage = isReservationsMode();
  return `
    <section id="history-section" class="panel">
      <div class="panel-title-row">
        <div>
          <h2>${isBookingPage ? "Reservas" : "Check-in pendiente"}</h2>
          <p>${
            isBookingPage
              ? "Desde aqu&iacute; puedes crear, revisar y confirmar reservas individuales o grupales antes del ingreso."
              : "Desde aqu&iacute; se cargan legajos, se saldan estad&iacute;as y se imprime el formulario legal para ingresar."
          }</p>
        </div>
        <div class="history-panel-tools">
          ${
            isBookingPage
              ? `
                <button
                  class="button is-compact is-blue"
                  type="button"
                  data-action="open-group-picker-modal"
                  ${editableGroups.length ? "" : "disabled"}
                >
                  Editar grupos
                </button>
              `
              : ""
          }
          <label class="field" style="min-width: 240px;">
            <span>Buscar</span>
            <input
              id="history-search"
              type="text"
              value="${escapeHtml(ui.historyQuery)}"
              placeholder="Habitaci&oacute;n, apellido, DNI..."
              autocomplete="off"
            />
          </label>
        </div>
      </div>

      <div class="history-stack">
        ${
          reservations.length
            ? reservations
                .map((reservation) => {
                  const status = getReservationStatus(reservation);
                  const operationalInfo = getReservationOperationalInfo(reservation);
                  const canPrintFromHistory =
                    canPrintLegalPacket(reservation) &&
                    ["today", "in-house"].includes(operationalInfo.key);
                  const groupColor = getReservationGroupColor(reservation);
                  const isGroupCard = Boolean(groupColor);
                  const historyCardClasses = [
                    "history-card",
                    operationalInfo.key === "today" ? "is-arrival-today" : "",
                    isGroupCard ? "is-group-reservation" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  const historyCardStyle = isGroupCard
                    ? ` style="--history-group-soft: ${escapeHtml(
                        getSoftHslColor(groupColor, 0.15)
                      )}; --history-group-border: ${escapeHtml(
                        getSoftHslColor(groupColor, 0.35)
                      )}; --history-group-accent: ${escapeHtml(
                        groupColor
                      )}; --history-group-title: ${escapeHtml(getDarkGroupTextColor(groupColor))};"`
                    : "";
                  const responsible = getTitular(reservation);
                  const responsibleName = [responsible.firstName, responsible.lastName]
                    .filter(Boolean)
                    .join(" ")
                    .trim();
                  const guestName = responsibleName
                    ? responsibleName
                    : getReservationCompanyLabel(reservation)
                      ? "Titular pendiente"
                      : "Responsable sin cargar";
                  const groupSummary = getGroupReservationSummary(reservation);
                  const compMeta = getReservationGroupCompRoomMeta(reservation);
                  const metaLead = isGroupCard ? "" : `${escapeHtml(guestName)} &middot; `;
                  return `
                    <article class="${historyCardClasses}"${historyCardStyle}>
                      <div class="history-head">
                        <div>
                          ${renderHistoryReservationTitle(reservation)}
                          <div class="history-meta">
                            ${metaLead}${escapeHtml(
                              formatStayRange(reservation.checkInDate, reservation.checkOutDate)
                            )}${
                              groupSummary ? ` &middot; ${escapeHtml(groupSummary)}` : ""
                            } &middot; ${escapeHtml(operationalInfo.label)} &middot; ${
                              reservation.guests.length
                            } hu&eacute;spedes &middot; actualizado ${escapeHtml(
                              formatLocalDateTime(reservation.updatedAt)
                            )}${
                              reservation.confirmedAt
                                ? ` &middot; confirmada ${escapeHtml(formatLocalDateTime(reservation.confirmedAt))}`
                                : ""
                            }
                          </div>
                        </div>
                      </div>
                      <div class="history-status-row">
                        <span class="status-badge ${status.className}">${escapeHtml(status.label)}</span>
                        ${renderReservationDepositBadge(reservation)}
                        ${
                          compMeta
                            ? `<span class="status-badge is-special-room">Habitaci&oacute;n de ${escapeHtml(
                                compMeta.label
                              )}</span>`
                            : ""
                        }
                      </div>
                      <div class="history-actions">
                        ${
                          canPrintFromHistory
                            ? renderLegalPacketAction(reservation, operationalInfo, { compact: true })
                            : ""
                        }
                        ${renderStayPaymentHistoryButton(reservation)}
                        ${
                          reservation.archived
                            ? ""
                            : `
                              <button class="ghost-button is-compact" type="button" data-action="open-reservation" data-reservation-id="${reservation.id}">
                                ${escapeHtml(getHistoryOpenReservationActionLabel(reservation))}
                              </button>
                            `
                        }
                        <button class="danger-button is-compact" type="button" data-action="delete-reservation" data-reservation-id="${reservation.id}">
                          Eliminar
                        </button>
                      </div>
                    </article>
                  `;
                })
                .join("")
            : `
              <div class="empty-state">
                <strong>${isBookingPage ? "No hay reservas cargadas." : "No hay check-ins pendientes."}</strong>
                <p>${
                  isBookingPage
                    ? "Las reservas particulares y grupales aparecer&aacute;n ac&aacute; cuando se creen."
                    : "Cuando una habitaci&oacute;n ya tenga ingreso, formulario y pago resuelto, pasar&aacute; al historial inferior."
                }</p>
              </div>
            `
        }
      </div>
    </section>
  `;
}

function renderCompletedCheckinHistoryPanel() {
  const reservations = getReservationsSorted().filter(
    isReservationVisibleInCompletedCheckinHistory
  );
  return `
    <section id="completed-history-section" class="panel">
      <div class="panel-title-row">
        <div>
          <h2>Historial de hu&eacute;spedes ingresados</h2>
          <p>
            Habitaciones ya ingresadas que siguen dentro de su estad&iacute;a. Se muestran hasta el d&iacute;a
            del Check-out inclusive; desde el d&iacute;a siguiente quedan resguardadas solamente en el
            Libro de Hu&eacute;spedes.
          </p>
        </div>
      </div>

      <div class="history-stack is-completed-history">
        ${
          reservations.length
            ? reservations
                .map((reservation) => {
                  const status = getReservationStatus(reservation);
                  const operationalInfo = getReservationOperationalInfo(reservation);
                  const groupColor = getReservationGroupColor(reservation);
                  const isGroupCard = Boolean(groupColor);
                  const historyCardClasses = [
                    "history-card",
                    "is-completed-history",
                    isGroupCard ? "is-group-reservation" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  const historyCardStyle = isGroupCard
                    ? ` style="--history-group-soft: ${escapeHtml(
                        getSoftHslColor(groupColor, 0.12)
                      )}; --history-group-border: ${escapeHtml(
                        getSoftHslColor(groupColor, 0.3)
                      )}; --history-group-accent: ${escapeHtml(
                        groupColor
                      )}; --history-group-title: ${escapeHtml(getDarkGroupTextColor(groupColor))};"`
                    : "";
                  const responsible = getTitular(reservation);
                  const responsibleName = [responsible.firstName, responsible.lastName]
                    .filter(Boolean)
                    .join(" ")
                    .trim();
                  const guestName = responsibleName
                    ? responsibleName
                    : getReservationCompanyLabel(reservation)
                      ? "Titular pendiente"
                      : "Responsable sin cargar";
                  const groupSummary = getGroupReservationSummary(reservation);
                  const compMeta = getReservationGroupCompRoomMeta(reservation);
                  const metaLead = isGroupCard ? "" : `${escapeHtml(guestName)} &middot; `;
                  return `
                    <article class="${historyCardClasses}"${historyCardStyle}>
                      <div class="history-head">
                        <div>
                          ${renderHistoryReservationTitle(reservation)}
                          <div class="history-meta">
                            ${metaLead}${escapeHtml(
                              formatStayRange(reservation.checkInDate, reservation.checkOutDate)
                            )}${
                              groupSummary ? ` &middot; ${escapeHtml(groupSummary)}` : ""
                            } &middot; ${reservation.guests.length} hu&eacute;spedes &middot; actualizado ${escapeHtml(
                              formatLocalDateTime(reservation.updatedAt)
                            )}
                          </div>
                        </div>
                      </div>
                      <div class="history-status-row">
                        <span class="status-badge ${status.className}">${escapeHtml(status.label)}</span>
                        ${
                          compMeta
                            ? `<span class="status-badge is-special-room">Habitaci&oacute;n de ${escapeHtml(
                                compMeta.label
                              )}</span>`
                            : ""
                        }
                      </div>
                      <div class="history-actions">
                        ${renderLegalPacketAction(reservation, operationalInfo, { compact: true })}
                        ${renderStayPaymentHistoryButton(reservation)}
                        <button class="ghost-button is-compact" type="button" data-action="open-reservation" data-reservation-id="${reservation.id}">
                          Editar habitaci&oacute;n
                        </button>
                      </div>
                    </article>
                  `;
                })
                .join("")
            : `
              <div class="empty-state">
                <strong>No hay hu&eacute;spedes ingresados dentro de su estad&iacute;a.</strong>
                <p>Los egresos anteriores permanecen conservados en el Libro de Hu&eacute;spedes.</p>
              </div>
            `
        }
      </div>
    </section>
  `;
}

function renderLibroPricingSummary(reservation) {
  if (!shouldShowReservationFinancialFields(reservation)) {
    return "";
  }
  const tariffInfo = getReservationTariffInfo(reservation);
  const adjustmentInfo = getTariffAdjustmentInfo(reservation);
  if (!tariffInfo || !adjustmentInfo || adjustmentInfo.kind === "match") {
    return "";
  }

  const adjustmentLabel =
    adjustmentInfo.kind === "discount"
      ? `Bonificaci\u00f3n aplicada: ${formatCurrency(adjustmentInfo.absoluteAmount)} (${formatPercent(
          adjustmentInfo.percent
        )}).`
      : `Ajuste sobre tarifa: ${formatCurrency(adjustmentInfo.absoluteAmount)} (${formatPercent(
          adjustmentInfo.percent
        )}).`;

  return `
    <div class="pricing-book-summary" style="margin-top: 14px;">
      <strong>Resumen tarifario</strong>
      <p>
        Sugerido ${escapeHtml(formatCurrency(tariffInfo.suggestedTotal))} &middot; Aplicado
        ${escapeHtml(formatCurrency(adjustmentInfo.appliedTotal))}.
      </p>
      ${
        tariffInfo.usesRoomBase
          ? `<p>La habitaci&oacute;n elegida se cotiz&oacute; como ${escapeHtml(String(tariffInfo.billedGuestCount))} plazas aunque viajen ${escapeHtml(String(tariffInfo.actualGuestCount))} pasajeros.</p>`
          : ""
      }
      <p>${escapeHtml(adjustmentLabel)}</p>
      ${
        reservation.discountNote
          ? `<p><strong>Motivo:</strong> ${escapeHtml(reservation.discountNote)}</p>`
          : ""
      }
    </div>
  `;
}

function renderLibroPreviewPanel(reservation) {
  const rows = buildLibroRows(reservation);
  const responsible = getTitular(reservation);
  const responsibleSummary =
    [responsible.firstName, responsible.lastName].filter(Boolean).join(" ").trim() || "Sin cargar";
  return `
    <section id="book-section" class="panel panel-strong book-preview-panel">
      <div class="panel-title-row">
        <div>
          <div class="eyebrow" style="margin-bottom: 8px; color: var(--accent); opacity: 1;">M&oacute;dulo principal</div>
          <h2>Vista del registro</h2>
          <p>Este m&oacute;dulo resume la reserva completa en una sola tabla para revisar datos generales y hu&eacute;spedes sin salir de la app.</p>
        </div>
      </div>
      <div class="tip-box" style="margin-bottom: 12px;">
        <strong>Titular / responsable</strong>
        <p>
          ${escapeHtml(responsibleSummary)}${
            responsible.document ? ` &middot; DNI ${escapeHtml(responsible.document)}` : ""
          }${reservation.phone ? ` &middot; Tel. ${escapeHtml(reservation.phone)}` : ""}
        </p>
      </div>
      <div class="table-note book-preview-note">
        La primera fila concentra ingreso, egreso y datos generales de la reserva. Luego aparece
        una fila por cada hu&eacute;sped cargado.
      </div>
      <div class="table-wrap" style="margin-top: 12px;">
        <table>
          <thead>
            <tr>
              ${BOOK_HEADERS_VIEW.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map(
                      (row) => `
                        <tr>
                          ${row.map((cell) => `<td>${escapeHtml(cell || "")}</td>`).join("")}
                        </tr>
                      `
                    )
                    .join("")
                : `
                  <tr>
                    <td colspan="${BOOK_HEADERS_VIEW.length}">
                      <div class="empty-state" style="margin: 8px 0;">
                        <strong>Sin filas generadas todav&iacute;a.</strong>
                        <p>Empieza cargando una reserva o escaneando el primer DNI.</p>
                      </div>
                    </td>
                  </tr>
                `
            }
          </tbody>
        </table>
      </div>
      ${renderLibroPricingSummary(reservation)}
    </section>
  `;
}

function getElementScrollSnapshot(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    return null;
  }
  return {
    selector,
    scrollTop: element.scrollTop,
    scrollLeft: element.scrollLeft,
  };
}

function getGroupModalScrollSnapshot() {
  return [
    getElementScrollSnapshot(".scanner-modal-shell"),
    getElementScrollSnapshot(".group-modal"),
    getElementScrollSnapshot(".group-room-grid"),
  ].filter(Boolean);
}

function getRoomPickerModalScrollSnapshot() {
  return [
    getElementScrollSnapshot(".scanner-modal-shell"),
    getElementScrollSnapshot(".room-picker-grid"),
  ].filter(Boolean);
}

function getPrivateReservationModalScrollSnapshot() {
  return [
    getElementScrollSnapshot(".private-reservation-modal-shell"),
    getElementScrollSnapshot(".private-reservation-modal"),
  ].filter(Boolean);
}

const MODAL_FOCUSABLE_SELECTOR = [
  'input:not([type="hidden"]):not([disabled])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "summary",
  '[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

const MANAGED_MODAL_ROOT_SELECTORS = [
  ".room-shortcut-modal",
  ".room-picker-confirm-modal",
  ".room-picker-modal",
  ".combined-stay-payment-modal",
  ".stay-payment-modal",
  ".confirm-modal",
  ".tariff-modal",
  ".private-reservation-modal",
  ".group-modal",
  ".group-picker-modal",
  ".scanner-modal",
];

const MANAGED_MODAL_TAB_ORDER = [
  {
    selector: ".private-reservation-modal",
    orderedSelectors: [
      "#responsible-firstName",
      "#responsible-lastName",
      "#field-phone",
      "#field-email",
      "#field-travelOrigin",
      "#open-room-picker-button",
      "#field-checkInDate",
      "#field-checkOutDate",
      "#field-nights",
      "#field-regime",
      "#field-licensePlate",
      "#field-guestCount",
      "#reservation-color-summary",
      ".reservation-color-grid .group-color-swatch",
      "#field-total",
      "#apply-tariff-total-button",
      "#field-discountNote",
      "#field-notes",
      "#field-depositPaymentMethod",
      "#field-depositAmount",
      "#field-depositDeferredReason",
      "#open-reservation-confirm-modal-button",
      "#close-private-reservation-modal-button",
    ],
  },
  {
    selector: ".group-modal",
    orderedSelectors: [
      "#group-company",
      "#group-travelOrigin",
      "#group-guestCount",
      "#group-passenger-rate",
      "#group-regime",
      "#group-checkInDate",
      "#group-checkOutDate",
      "#group-initial",
      ".group-color-grid .group-color-swatch",
      "[data-action='toggle-group-tariffs']",
      "[data-action='copy-current-tariffs-to-group']",
      "[data-group-tariff-field]",
      "[data-action='suggest-group-rooms']",
      "[data-action='delete-group-reservation']",
      "[data-action='create-group-reservations']",
      "[data-action='close-group-load-modal']",
    ],
  },
  {
    selector: ".room-picker-confirm-modal",
    orderedSelectors: [
      "[data-action='confirm-room-picker-confirmation']",
      "[data-action='cancel-room-picker-confirmation']",
    ],
  },
  {
    selector: ".room-picker-modal",
    orderedSelectors: [
      "#room-picker-input",
      "[data-action='select-room-picker-room']",
      "[data-action='confirm-room-picker-selection']",
      "[data-action='close-room-picker-modal']",
    ],
  },
  {
    selector: ".tariff-modal",
    orderedSelectors: [
      "[data-tariff-field]",
      "[data-action='save-tariff-modal']",
      "[data-action='close-tariff-modal']",
    ],
  },
  {
    selector: ".confirm-modal",
    orderedSelectors: [
      "[data-action='confirm-reservation']",
      "[data-action='close-reservation-confirm-modal']",
    ],
  },
  {
    selector: ".combined-stay-payment-modal",
    orderedSelectors: [
      "#combined-stay-payment-cash",
      "#combined-stay-payment-transfer",
      "[data-action='apply-combined-stay-payment']",
      "[data-action='close-combined-stay-payment-modal']",
    ],
  },
  {
    selector: ".stay-payment-modal",
    orderedSelectors: [
      "[data-action='apply-stay-payment'][data-method='cash']",
      "[data-action='apply-stay-payment'][data-method='transfer']",
      "[data-action='open-combined-stay-payment-modal']",
      "[data-action='close-stay-payment-modal']",
    ],
  },
  {
    selector: ".group-picker-modal",
    orderedSelectors: [
      "[data-action='choose-group-to-edit']",
      "[data-action='close-group-picker-modal']",
    ],
  },
  {
    selector: ".room-shortcut-modal",
    orderedSelectors: [
      "[data-action='confirm-room-shortcut-reservation']",
      "[data-action='close-room-shortcut-modal']",
    ],
  },
];

function getManagedModalRoots() {
  const seen = new Set();
  return MANAGED_MODAL_ROOT_SELECTORS.map((selector) => document.querySelector(selector))
    .filter((element) => {
      if (!element || seen.has(element)) {
        return false;
      }
      seen.add(element);
      return true;
    });
}

function isElementTabbableInModal(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  if (element.matches("[disabled], [hidden], [aria-hidden='true']")) {
    return false;
  }
  if (element.closest("[hidden], [aria-hidden='true']")) {
    return false;
  }
  const computedStyle = window.getComputedStyle(element);
  if (computedStyle.display === "none" || computedStyle.visibility === "hidden") {
    return false;
  }
  return element.getClientRects().length > 0;
}

function isManagedModalCloseButton(element) {
  return Boolean(
    element instanceof HTMLElement &&
      element.dataset &&
      typeof element.dataset.action === "string" &&
      element.dataset.action.startsWith("close-")
  );
}

function getManagedModalTabRule(root) {
  return MANAGED_MODAL_TAB_ORDER.find((rule) => root.matches(rule.selector)) || null;
}

function getManagedModalFocusableElements(root) {
  return Array.from(root.querySelectorAll(MODAL_FOCUSABLE_SELECTOR)).filter((element) =>
    isElementTabbableInModal(element)
  );
}

function buildManagedModalTabSequence(root) {
  const allFocusable = getManagedModalFocusableElements(root);
  const rule = getManagedModalTabRule(root);
  const ordered = [];
  const seen = new Set();

  const pushElement = (element) => {
    if (!element || seen.has(element) || !isElementTabbableInModal(element)) {
      return;
    }
    seen.add(element);
    ordered.push(element);
  };

  if (rule) {
    rule.orderedSelectors.forEach((selector) => {
      root.querySelectorAll(selector).forEach((element) => {
        pushElement(element);
      });
    });
  }

  allFocusable.forEach((element) => {
    if (!seen.has(element) && !isManagedModalCloseButton(element)) {
      pushElement(element);
    }
  });

  allFocusable.forEach((element) => {
    if (!seen.has(element) && isManagedModalCloseButton(element)) {
      pushElement(element);
    }
  });

  return ordered;
}

function applyManagedModalTabOrder() {
  const modalRoots = getManagedModalRoots();
  if (!modalRoots.length) {
    return;
  }

  const activeModal = modalRoots[0];
  modalRoots.slice(1).forEach((root) => {
    getManagedModalFocusableElements(root).forEach((element) => {
      element.tabIndex = -1;
    });
  });

  buildManagedModalTabSequence(activeModal).forEach((element, index) => {
    element.tabIndex = index + 1;
  });
}

function trapTabInsideActiveModal(event) {
  const activeModal = getManagedModalRoots()[0];
  if (!activeModal) {
    return;
  }

  const focusableElements = buildManagedModalTabSequence(activeModal);
  if (!focusableElements.length) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (!activeModal.contains(activeElement)) {
    event.preventDefault();
    (event.shiftKey ? lastElement : firstElement).focus();
    return;
  }

  if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
    return;
  }

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }
}

function rememberManagedModalTabDestination(event) {
  const activeModal = getManagedModalRoots()[0];
  ui.pendingManagedModalFocusId = "";
  if (!activeModal) {
    return;
  }

  const activeElement =
    event.target instanceof HTMLElement ? event.target : document.activeElement;
  if (!(activeElement instanceof HTMLElement) || !activeModal.contains(activeElement)) {
    return;
  }

  const focusableElements = buildManagedModalTabSequence(activeModal);
  const currentIndex = focusableElements.indexOf(activeElement);
  if (currentIndex === -1) {
    return;
  }

  const rawNextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
  const nextIndex =
    rawNextIndex < 0
      ? focusableElements.length - 1
      : rawNextIndex >= focusableElements.length
        ? 0
        : rawNextIndex;
  const nextElement = focusableElements[nextIndex];
  ui.pendingManagedModalFocusId =
    nextElement instanceof HTMLElement && nextElement.id ? nextElement.id : "";
}

function consumePendingManagedModalFocusId() {
  const focusId = ui.pendingManagedModalFocusId || null;
  ui.pendingManagedModalFocusId = "";
  return focusId;
}

function getActiveModalScrollSnapshots() {
  if (ui.isGroupLoadModalOpen) {
    return getGroupModalScrollSnapshot();
  }

  if (ui.isRoomPickerModalOpen) {
    return getRoomPickerModalScrollSnapshot();
  }

  if (ui.isPrivateReservationModalOpen) {
    return getPrivateReservationModalScrollSnapshot();
  }

  return [];
}

function restoreElementScrollSnapshots(snapshots = []) {
  snapshots.forEach((snapshot) => {
    const element = document.querySelector(snapshot.selector);
    if (!element) {
      return;
    }
    element.scrollTop = snapshot.scrollTop;
    element.scrollLeft = snapshot.scrollLeft;
  });
}

function scheduleElementScrollRestore(snapshots = []) {
  if (!snapshots.length) {
    return;
  }

  restoreElementScrollSnapshots(snapshots);
  window.requestAnimationFrame(() => {
    restoreElementScrollSnapshots(snapshots);
    window.requestAnimationFrame(() => {
      restoreElementScrollSnapshots(snapshots);
    });
  });
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

function getRoomTimelineViewportKey(referenceDate = getRoomOverviewDate()) {
  return normalizeInputDate(referenceDate) || getTodayInputDate();
}

function setRoomTimelineScrollForKey(referenceDate, scrollLeft) {
  ui.roomTimelineScrollByKey[getRoomTimelineViewportKey(referenceDate)] = Math.max(
    0,
    Number(scrollLeft) || 0
  );
}

function applyRoomTimelineViewport() {
  const timelineWrap = document.querySelector("[data-room-timeline-wrap]");
  if (!timelineWrap) {
    return;
  }

  const applyScroll = () => {
    const currentKey = getRoomTimelineViewportKey();
    const savedScrollLeft = ui.roomTimelineScrollByKey[currentKey];
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
  const {
    preserveScroll = false,
    focusId = null,
    focusModal = false,
    focusTop = false,
    scrollToId = null,
    selectionStart = null,
    selectionEnd = null,
    elementScrollSnapshots = [],
  } = options;
  const root = document.getElementById("app");
  const reservation = getActiveReservation();
  const privateModalReservation =
    isReservationsMode() && ui.isPrivateReservationModalOpen ? reservation : null;
  const isWorkspaceOpen =
    !isReservationsMode() && ui.isReservationWorkspaceOpen && Boolean(reservation);
  const workspaceReservation = isWorkspaceOpen ? reservation : null;
  const scrollX = preserveScroll ? window.scrollX : 0;
  const scrollY = preserveScroll ? window.scrollY : 0;
  const moduleMainScrollTop = preserveScroll
    ? document.querySelector(".module-main-scroll")?.scrollTop || 0
    : 0;
  let embeddedParentMain = null;
  let embeddedParentMainScrollTop = 0;
  if (preserveScroll && window.parent && window.parent !== window) {
    try {
      embeddedParentMain = window.parent.document.querySelector(".app-main");
      embeddedParentMainScrollTop = embeddedParentMain?.scrollTop || 0;
    } catch (error) {
      embeddedParentMain = null;
    }
  }
  const resolvedElementScrollSnapshots =
    elementScrollSnapshots.length || !preserveScroll
      ? elementScrollSnapshots
      : getActiveModalScrollSnapshots();
  applyThemePreference(ui.theme);

  const mainMarkup = `
    <main class="app-shell">
      ${renderHero(reservation, isWorkspaceOpen)}
      ${renderSummaryCards()}
      ${
        isWorkspaceOpen
          ? `
            ${renderReservationPanel(workspaceReservation)}
            ${renderHistoryPanel()}
            ${isCheckinMode() ? renderLibroPreviewPanel(workspaceReservation) : ""}
          `
          : isReservationsMode()
            ? `
              ${renderRoomTimelinePanel()}
              ${renderHistoryPanel()}
              ${renderRoomOverviewPanel()}
            `
            : `
              ${renderHistoryPanel()}
              ${renderCompletedCheckinHistoryPanel()}
            `
      }
      ${renderSystemFooter(
        `<strong>Estado guardado:</strong> ${escapeHtml(formatLocalDateTime(state.lastSavedAt))}. El sistema usa el JSON central; el navegador conserva espejos t&eacute;cnicos para que Check-in y Bebidas se lean sin perder continuidad.`
      )}
    </main>
  `;

  root.innerHTML = `
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
    <input id="backup-input" class="hidden" type="file" accept=".json,application/json" />
    <datalist id="room-options">
      ${ROOM_OPTIONS
        .map((option) => `<option value="${escapeHtml(option)}"></option>`)
        .join("")}
    </datalist>
    ${renderScannerModal()}
    ${renderGroupPickerModal()}
    ${renderGroupLoadModal()}
    ${renderPrivateReservationModal(privateModalReservation)}
    ${renderTariffModal()}
    ${renderReservationConfirmModal()}
    ${renderStayPaymentModal()}
    ${renderCombinedStayPaymentModal()}
    ${renderRoomPickerModal(privateModalReservation || workspaceReservation)}
    ${renderRoomPickerConfirmationModal(privateModalReservation || workspaceReservation)}
    ${renderRoomShortcutModal()}
    ${renderFloatingModuleNav(isWorkspaceOpen)}
    ${!SYSTEM_EMBEDDED ? renderThemeToggleButton("theme-toggle-floating") : ""}
  `;

  document.body.classList.toggle("has-shell-layout", SYSTEM_CHROME);
  document.body.classList.toggle("is-system-embedded", SYSTEM_EMBEDDED);

  setupEmbeddedCheckinModalViewportTracking();
  syncEmbeddedCheckinModalViewport();
  window.requestAnimationFrame(syncEmbeddedCheckinModalViewport);

  document.body.classList.toggle(
    "has-modal",
    ui.isScannerModalOpen ||
      ui.isGroupPickerModalOpen ||
      ui.isGroupLoadModalOpen ||
      ui.isPrivateReservationModalOpen ||
      ui.isTariffModalOpen ||
      ui.isReservationConfirmModalOpen ||
      ui.isStayPaymentModalOpen ||
      ui.isCombinedStayPaymentModalOpen ||
      ui.isRoomPickerModalOpen ||
      Boolean(ui.roomPickerConfirmNumber) ||
      Boolean(ui.pendingRoomShortcutNumber)
  );

  setupFloatingModuleNav();
  applyManagedModalTabOrder();
  emitSystemEmbeddedHeight();

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
    const restorePreservedScroll = () => {
      window.scrollTo(scrollX, scrollY);
      const nextModuleMain = document.querySelector(".module-main-scroll");
      if (nextModuleMain) {
        nextModuleMain.scrollTop = moduleMainScrollTop;
      }
      if (embeddedParentMain) {
        embeddedParentMain.scrollTop = embeddedParentMainScrollTop;
      }
    };
    restorePreservedScroll();
    window.requestAnimationFrame(restorePreservedScroll);
    window.setTimeout(restorePreservedScroll, 120);
  }

  scheduleElementScrollRestore(resolvedElementScrollSnapshots);
  applyRoomTimelineViewport();
  postCheckinStateToParent();

  if (focusModal) {
    focusActiveModalAfterRender();
  } else if (scrollToId) {
    scrollToModuleTargetAfterRender(scrollToId);
  } else if (focusTop || !preserveScroll) {
    focusModuleStartAfterRender();
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

function rerenderWithFocus(target) {
  render({
    preserveScroll: true,
    focusId: target.id || null,
    selectionStart:
      typeof target.selectionStart === "number" ? target.selectionStart : null,
    selectionEnd: typeof target.selectionEnd === "number" ? target.selectionEnd : null,
  });
}

function clearGroupModalRerenderTimer() {
  if (groupModalRerenderTimeoutId) {
    window.clearTimeout(groupModalRerenderTimeoutId);
    groupModalRerenderTimeoutId = null;
  }
}

function scheduleGroupModalRerender(target) {
  clearGroupModalRerenderTimer();
  const focusId = target.id || null;
  const selectionStart =
    typeof target.selectionStart === "number" ? target.selectionStart : null;
  const selectionEnd = typeof target.selectionEnd === "number" ? target.selectionEnd : null;
  const elementScrollSnapshots = getGroupModalScrollSnapshot();

  groupModalRerenderTimeoutId = window.setTimeout(() => {
    groupModalRerenderTimeoutId = null;
    if (!ui.isGroupLoadModalOpen) {
      return;
    }
    render({
      preserveScroll: true,
      focusId,
      selectionStart,
      selectionEnd,
      elementScrollSnapshots,
    });
  }, GROUP_MODAL_RERENDER_DELAY_MS);
}

ensureActiveReservation();
ensureActiveGuest();

document.addEventListener("click", (event) => {
  const datePickerTarget =
    event.target instanceof Element ? event.target.closest("[data-date-picker]") : null;
  if (
    datePickerTarget &&
    typeof datePickerTarget.showPicker === "function" &&
    !datePickerTarget.disabled
  ) {
    try {
      datePickerTarget.showPicker();
    } catch (error) {
      // Algunos navegadores no permiten abrir el picker por c\u00f3digo; en ese caso sigue el comportamiento nativo.
    }
  }

  const shellModuleLink = event.target.closest("[data-shell-module-link]");
  if (shellModuleLink && !isAuthorizedShellModule(shellModuleLink.dataset.shellModuleLink)) {
    event.preventDefault();
    return;
  }
  if (shellModuleLink && window.parent && window.parent !== window) {
    event.preventDefault();
    postCheckinStateToParent();
    window.parent.postMessage(
      {
        type: "solanas:navigate-module",
        module: shellModuleLink.dataset.shellModuleLink,
        emittedAt: nowIso(),
      },
      "*"
    );
    return;
  }

  const target = event.target.closest("[data-action]");
  if (!target) return;

  const { action } = target.dataset;

  if (action === "toggle-sidebar") {
    ui.sidebarCollapsed = !ui.sidebarCollapsed;
    persistSidebarPreference();
    render({ preserveScroll: true, elementScrollSnapshots: getGroupModalScrollSnapshot() });
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

  if (action === "new-reservation") {
    createNewReservation();
    return;
  }

  if (action === "new-walkin-checkin") {
    createNewReservation({ checkInDate: getTodayInputDate(), walkInToday: true });
    return;
  }

  if (action === "open-room-shortcut-modal") {
    if (target.dataset.checkInDate) {
      openTimelineRoomShortcutModal(target.dataset.roomNumber, target.dataset.checkInDate);
    } else {
      openRoomShortcutModal(target.dataset.roomNumber);
    }
    return;
  }

  if (action === "close-room-shortcut-modal") {
    closeRoomShortcutModal();
    return;
  }

  if (action === "confirm-room-shortcut-reservation") {
    confirmRoomShortcutReservation();
    return;
  }

  if (action === "open-group-load-modal") {
    openGroupLoadModal();
    render({ preserveScroll: true, focusId: "group-company", focusModal: true });
    return;
  }

  if (action === "open-group-picker-modal") {
    if (openGroupPickerModal()) {
      render({ preserveScroll: true, focusModal: true });
    }
    return;
  }

  if (action === "close-group-picker-modal") {
    closeGroupPickerModal();
    render({ preserveScroll: true });
    return;
  }

  if (action === "choose-group-to-edit") {
    closeGroupPickerModal();
    if (openGroupEditModal(target.dataset.groupId)) {
      render({ preserveScroll: true, focusId: "group-company", focusModal: true });
    }
    return;
  }

  if (action === "open-group-edit-modal") {
    if (openGroupEditModal(target.dataset.groupId)) {
      render({ preserveScroll: true, focusId: "group-company", focusModal: true });
    }
    return;
  }

  if (action === "close-group-load-modal") {
    closeGroupLoadModal();
    render({ preserveScroll: true });
    return;
  }

  if (action === "close-private-reservation-modal") {
    closePrivateReservationModal();
    return;
  }

  if (action === "confirm-private-reservation") {
    const reservation = getActiveReservation();
    const hardIssues = getReservationConfirmationHardIssues(reservation);
    if (hardIssues.length) {
      window.alert(
        `No se puede confirmar todav\u00eda:\n- ${hardIssues.join("\n- ")}`
      );
      render({ preserveScroll: true });
      return;
    }
    const wasConfirmed = confirmReservation(reservation && reservation.id);
    render({ preserveScroll: !wasConfirmed });
    return;
  }

  if (action === "toggle-group-room-selection") {
    const elementScrollSnapshots = getGroupModalScrollSnapshot();
    const draft = getGroupDraft();
    const roomNumber = sanitizeRoomNumber(target.dataset.roomNumber);
    if (!roomNumber) {
      return;
    }
    if (!Array.isArray(draft.selectedRooms)) {
      draft.selectedRooms = [];
    }
    if (draft.selectedRooms.includes(roomNumber)) {
      draft.selectedRooms = draft.selectedRooms.filter((item) => item !== roomNumber);
    } else {
      const descriptor = getGroupRoomDescriptor(roomNumber, draft);
      if (!descriptor.selectable) {
        return;
      }
      draft.selectedRooms = [...draft.selectedRooms, roomNumber].sort(
        (left, right) => Number(left) - Number(right)
      );
    }
    syncGroupCompRoomsWithSelectedRooms(draft);
    render({ preserveScroll: true, elementScrollSnapshots });
    return;
  }

  if (action === "set-group-comp-room") {
    const elementScrollSnapshots = getGroupModalScrollSnapshot();
    setGroupDraftCompRoomType(target.dataset.roomNumber, target.dataset.compType);
    render({ preserveScroll: true, elementScrollSnapshots });
    return;
  }

  if (action === "select-group-color") {
    updateGroupDraftField("groupColor", target.dataset.groupColor);
    render({ preserveScroll: true });
    return;
  }

  if (action === "toggle-group-tariffs") {
    const draft = getGroupDraft();
    draft.showGroupTariffs = !draft.showGroupTariffs;
    render({ preserveScroll: true, elementScrollSnapshots: getGroupModalScrollSnapshot() });
    return;
  }

  if (action === "copy-current-tariffs-to-group") {
    copyCurrentTariffsToGroupDraft();
    render({ preserveScroll: true, elementScrollSnapshots: getGroupModalScrollSnapshot() });
    return;
  }

  if (action === "select-reservation-color") {
    updateReservationField("reservationColor", target.dataset.reservationColor);
    render({ preserveScroll: true });
    return;
  }

  if (action === "suggest-group-rooms") {
    const suggestion = suggestGroupRoomsFromDraft();
    render({ preserveScroll: true });
    if (suggestion) {
      showSuccessToast(
        suggestion.requiresExtraBed
          ? "Se sugirieron habitaciones y el grupo quedar\u00e1 apoyado en cama extra."
          : "Se sugirieron habitaciones para el grupo."
      );
    }
    return;
  }

  if (action === "create-group-reservations") {
    const created = createGroupReservationsFromDraft();
    render({ preserveScroll: !created });
    if (created) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    return;
  }

  if (action === "delete-group-reservation") {
    deleteGroupReservation(target.dataset.groupId);
    return;
  }

  if (action === "close-reservation-workspace") {
    closeReservationWorkspace();
    return;
  }

  if (action === "open-tariff-modal") {
    openTariffModal();
    render({ preserveScroll: true, focusId: "tariff-single", focusModal: true });
    return;
  }

  if (action === "close-tariff-modal") {
    closeTariffModal();
    render({ preserveScroll: true });
    return;
  }

  if (action === "save-tariff-modal") {
    saveTariffDraft();
    render({ preserveScroll: true });
    return;
  }

  if (action === "open-reservation-confirm-modal") {
    openReservationConfirmModal();
    render({ preserveScroll: true, focusModal: true });
    return;
  }

  if (action === "close-reservation-confirm-modal") {
    closeReservationConfirmModal();
    render({ preserveScroll: true });
    return;
  }

  if (action === "confirm-reservation") {
    const wasConfirmed = confirmReservation();
    const shouldReturnToCheckinHeader = wasConfirmed && isCheckinMode();
    render({
      preserveScroll: !wasConfirmed,
      scrollToId: shouldReturnToCheckinHeader ? "hero-section" : null,
    });
    if (shouldReturnToCheckinHeader) {
      returnToCheckinHeaderAfterCompletion();
    } else if (wasConfirmed) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    return;
  }

  if (action === "open-stay-payment-modal") {
    openStayPaymentModal(target.dataset.reservationId);
    render({ preserveScroll: true, focusModal: true });
    return;
  }

  if (action === "close-stay-payment-modal") {
    closeStayPaymentModal();
    render({ preserveScroll: true });
    return;
  }

  if (action === "apply-stay-payment") {
    applyStayPayment(target.dataset.method || "cash");
    return;
  }

  if (action === "open-combined-stay-payment-modal") {
    if (openCombinedStayPaymentModal()) {
      render({
        preserveScroll: true,
        focusId: "combined-stay-payment-cash",
        focusModal: true,
      });
    }
    return;
  }

  if (action === "close-combined-stay-payment-modal") {
    closeCombinedStayPaymentModal();
    render({ preserveScroll: true, focusModal: true });
    return;
  }

  if (action === "apply-combined-stay-payment") {
    applyCombinedStayPayment();
    return;
  }

  if (action === "archive-reservation") {
    archiveActiveReservation();
    return;
  }

  if (action === "open-room-picker-modal") {
    openRoomPickerModal();
    render({ preserveScroll: true, focusId: "room-picker-input", focusModal: true });
    return;
  }

  if (action === "close-room-picker-modal") {
    closeRoomPickerModal();
    render({ preserveScroll: true });
    return;
  }

  if (action === "select-room-picker-room") {
    openRoomPickerConfirmation(target.dataset.roomNumber, target);
    render({
      preserveScroll: true,
      focusId: "confirm-room-picker-confirmation-button",
      elementScrollSnapshots: getRoomPickerModalScrollSnapshot(),
    });
    return;
  }

  if (action === "confirm-room-picker-selection") {
    confirmRoomPickerSelection();
    return;
  }

  if (action === "cancel-room-picker-confirmation") {
    closeRoomPickerConfirmation();
    render({
      preserveScroll: true,
      elementScrollSnapshots: getRoomPickerModalScrollSnapshot(),
    });
    return;
  }

  if (action === "confirm-room-picker-confirmation") {
    confirmRoomPickerSelection();
    return;
  }

  if (action === "set-availability-mode") {
    ui.roomAvailabilityMode = target.dataset.mode === "today" ? "today" : "request";
    render({ preserveScroll: true });
    return;
  }

  if (action === "set-room-overview-today") {
    ui.roomOverviewDate = getTodayInputDate();
    render({ preserveScroll: true });
    return;
  }

  if (action === "shift-room-overview-month") {
    const shift = Number(target.dataset.shift || "0");
    ui.roomOverviewDate = shiftInputDateByMonths(getRoomOverviewDate(), shift);
    render({ preserveScroll: true });
    return;
  }

  if (action === "select-room-overview-date") {
    const nextDate = normalizeInputDate(target.dataset.date);
    if (!nextDate) {
      return;
    }
    ui.roomOverviewDate = nextDate;
    render({ preserveScroll: true });
    return;
  }

  if (action === "toggle-maintenance-editor") {
    ui.showMaintenanceEditor = !ui.showMaintenanceEditor;
    render({ preserveScroll: true });
    return;
  }

  if (action === "toggle-room-maintenance") {
    toggleRoomMaintenance(target.dataset.roomNumber);
    return;
  }

  if (action === "toggle-extra-bed") {
    toggleExtraBedForActiveReservation();
    return;
  }

  if (action === "select-responsible") {
    resetScannerUi(false);
    openScannerModal({ kind: "responsible" });
    render({ preserveScroll: true, focusId: "scanner-input" });
    return;
  }

  if (action === "apply-tariff-total") {
    applySuggestedTariffToActiveReservation();
    render({ preserveScroll: true });
    return;
  }

  if (action === "select-availability-room") {
    const reservation = getActiveReservation();
    const scope = getAvailabilityScope(reservation);
    if (scope.mode !== "request" || scope.fallback) {
      return;
    }

    const roomNumber = sanitizeRoomNumber(target.dataset.roomNumber);
    if (!roomNumber) {
      return;
    }

    const descriptor = getRoomAvailabilityDescriptor(reservation, roomNumber, scope);
    if (!descriptor.selectable) {
      const warningMessage = descriptor.maintenance
        ? `La habitación ${roomNumber} está en mantenimiento.`
        : descriptor.conflictReservation
          ? getRoomConflictMessage(reservation, roomNumber, scope.startDate, scope.endDate)
          : `La habitación ${roomNumber} no tiene capacidad para ${descriptor.guestCount} pasajeros.`;
      window.alert(getRoomAvailabilitySelectionWarning(reservation, descriptor, scope));
      return;
    }

    updateReservationField("roomNumber", roomNumber);
    render({ preserveScroll: true });
    return;
  }

  if (action === "add-guest") {
    addGuestToActiveReservation();
    return;
  }

  if (action === "open-bulk-guest-scanner") {
    resetScannerUi(false);
    openScannerModal({ kind: "bulkGuests" });
    render({ preserveScroll: true, focusId: "scanner-input" });
    return;
  }

  if (action === "remove-guest") {
    removeGuestFromActiveReservation(target.dataset.guestId);
    return;
  }

  if (action === "remove-bulk-scanner-assignment") {
    removeBulkScannerAssignment(target.dataset.assignmentIndex);
    return;
  }

  if (action === "clear-guest") {
    clearGuest(target.dataset.guestId);
    return;
  }

  if (action === "copy-responsible-to-guest") {
    copyResponsibleToGuest(target.dataset.guestId);
    render({ preserveScroll: true });
    return;
  }

  if (action === "select-guest") {
    resetScannerUi(false);
    openScannerModal(target.dataset.guestId);
    render({ preserveScroll: true, focusId: "scanner-input" });
    return;
  }

  if (action === "close-scanner-modal") {
    closeScannerModal({ clearDraft: true });
    render({ preserveScroll: true });
    return;
  }

  if (action === "focus-scanner") {
    const scannerInput = document.getElementById("scanner-input");
    if (scannerInput) {
      scannerInput.focus();
    }
    return;
  }

  if (action === "clear-scanner") {
    ui.scannerDraft = "";
    ui.parseResult =
      ui.scannerTargetKind === "bulkGuests" && ui.bulkScannerSession
        ? buildBulkScannerParseResult()
        : null;
    render({ preserveScroll: true, focusId: "scanner-input" });
    return;
  }

  if (action === "parse-scanner") {
    applyScannerToCurrentTarget();
    return;
  }

  if (action === "copy-tsv") {
    copyRowsForSheets();
    return;
  }

  if (action === "download-csv") {
    downloadCsvForSheets();
    return;
  }

  if (action === "print-reservation") {
    printReservation();
    return;
  }

  if (action === "print-legal-packet") {
    printLegalPacket(target.dataset.reservationId);
    return;
  }

  if (action === "export-backup") {
    exportBackup();
    return;
  }

  if (action === "trigger-import") {
    triggerBackupImport();
    return;
  }

  if (action === "open-reservation") {
    if (isReservationsMode()) {
      const reservation = state.reservations.find(
        (item) => item.id === target.dataset.reservationId && item.archived !== true
      );
      if (reservation && isGroupReservation(reservation) && reservation.groupId) {
        if (openGroupEditModal(reservation.groupId)) {
          render({ preserveScroll: true, focusId: "group-company" });
        }
        return;
      }
    }
    setActiveReservation(target.dataset.reservationId);
    return;
  }

  if (action === "delete-reservation") {
    deleteReservation(target.dataset.reservationId);
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;

  if (target.matches("[data-combined-stay-payment-field]")) {
    const field = target.dataset.combinedStayPaymentField;
    const split = updateCombinedStayPaymentDraft(field, target.value);
    const otherField = field === "transfer" ? "cash" : "transfer";
    const otherInput = document.getElementById(`combined-stay-payment-${otherField}`);
    const balance = document.getElementById("combined-payment-balance");

    if (otherInput) {
      otherInput.value = formatMoneyInputDisplay(split[otherField]);
    }
    if (balance) {
      balance.textContent = `Efectivo ${formatCurrency(split.cash)} + transferencia ${formatCurrency(
        split.transfer
      )} = ${formatCurrency(split.cash + split.transfer)}`;
    }
    return;
  }

  if (target.matches("[data-tariff-field]")) {
    updateTariffDraft(target.dataset.tariffField, target.value);
    return;
  }

  if (target.matches("[data-group-tariff-field]")) {
    updateGroupDraftTariffField(target.dataset.groupTariffField, target.value);
    return;
  }

  if (target.matches("[data-group-field]")) {
    const field = target.dataset.groupField;
    if (field === "checkInDate" || field === "checkOutDate" || field === "regime") {
      return;
    }
    updateGroupDraftField(field, target.value);
    if (DEFERRED_GROUP_DRAFT_FIELDS.has(field)) {
      scheduleGroupModalRerender(target);
      return;
    }
    rerenderWithFocus(target);
    return;
  }

  if (target.matches("[data-room-picker-field]")) {
    ui.roomPickerDraftNumber = sanitizeRoomNumber(target.value);
    ui.roomPickerConfirmNumber = "";
    render({
      preserveScroll: true,
      focusId: target.id || null,
      selectionStart:
        typeof target.selectionStart === "number" ? target.selectionStart : null,
      selectionEnd: typeof target.selectionEnd === "number" ? target.selectionEnd : null,
      elementScrollSnapshots: getRoomPickerModalScrollSnapshot(),
    });
    return;
  }

  if (target.matches("[data-reservation-field]")) {
    const field = target.dataset.reservationField;
    if (RESERVATION_DATE_FIELDS.has(field)) {
      return;
    }
    updateReservationField(field, target.value);
    if (!DEFERRED_RESERVATION_FIELDS.has(field)) {
      rerenderWithFocus(target);
    }
    return;
  }

  if (target.matches("[data-responsible-field]")) {
    const field = target.dataset.responsibleField;
    if (field === "birthDate") {
      target.value = formatDateTypingInput(target.value);
    }
    updateResponsibleField(field, target.value);
    if (target.dataset.deferResponsibleRender === "true") {
      return;
    }
    rerenderWithFocus(target);
    return;
  }

  if (target.matches("[data-guest-field]")) {
    const field = target.dataset.guestField;
    if (GUEST_DATE_TYPING_FIELDS.has(field)) {
      target.value = formatDateTypingInput(target.value);
    }
    updateGuestField(target.dataset.guestId, field, target.value);
    rerenderWithFocus(target);
    return;
  }

  if (target.id === "history-search") {
    ui.historyQuery = target.value;
    rerenderWithFocus(target);
    return;
  }

  if (target.id === "scanner-input") {
    ui.scannerDraft = target.value;
    scheduleScannerAutoApply();
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;

  if (target.matches("[data-combined-stay-payment-field]")) {
    const field = target.dataset.combinedStayPaymentField;
    const split = updateCombinedStayPaymentDraft(field, target.value);
    target.value = formatMoneyInputDisplay(split[field]);
    return;
  }

  if (target.id === "backup-input") {
    importBackup(target.files && target.files[0]);
    target.value = "";
    return;
  }

  if (target.matches("[data-overview-date]")) {
    const nextDate = normalizeInputDate(target.value);
    if (!nextDate) {
      target.value = getRoomOverviewDate();
      return;
    }
    ui.roomOverviewDate = nextDate;
    render({ preserveScroll: true });
    return;
  }

  if (target.matches("[data-group-field]")) {
    clearGroupModalRerenderTimer();
    updateGroupDraftField(target.dataset.groupField, target.value);
    render({ preserveScroll: true, focusId: target.id || null });
    return;
  }

  if (target.matches("[data-tariff-field]")) {
    updateTariffDraft(target.dataset.tariffField, target.value);
    render({ preserveScroll: true, focusId: target.id || null });
    return;
  }

  if (target.matches("[data-group-tariff-field]")) {
    updateGroupDraftTariffField(target.dataset.groupTariffField, target.value);
    const elementScrollSnapshots = getGroupModalScrollSnapshot();
    window.setTimeout(() => {
      if (!ui.isGroupLoadModalOpen) {
        return;
      }
      render({
        preserveScroll: true,
        focusId: target.id || null,
        elementScrollSnapshots,
      });
    }, 0);
    return;
  }

  if (target.matches("[data-reservation-field]")) {
    updateReservationField(target.dataset.reservationField, target.value);
    render({ preserveScroll: true, focusId: consumePendingManagedModalFocusId() });
    return;
  }

  if (target.matches("[data-responsible-field]")) {
    if (target.dataset.responsibleField === "birthDate") {
      target.value = formatDateTypingInput(target.value);
    }
    updateResponsibleField(target.dataset.responsibleField, target.value);
    render({ preserveScroll: true, focusId: consumePendingManagedModalFocusId() });
  }
});

document.addEventListener(
  "scroll",
  (event) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.matches("[data-room-timeline-wrap]")) {
      return;
    }

    setRoomTimelineScrollForKey(getRoomOverviewDate(), target.scrollLeft);
  },
  true
);

window.addEventListener("message", (event) => {
  if (!event || !event.data || event.data.type !== "solanas:request-checkin-state") {
    return;
  }
  postCheckinStateToParent();
});

document.addEventListener("keydown", (event) => {
  const target = event.target;
  if (event.key === "Tab") {
    rememberManagedModalTabDestination(event);
    trapTabInsideActiveModal(event);
    if (event.defaultPrevented) {
      ui.pendingManagedModalFocusId = "";
      return;
    }
  }

  if (event.key === "Escape" && ui.pendingRoomShortcutNumber) {
    closeRoomShortcutModal();
    return;
  }

  if (event.key === "Escape" && ui.roomPickerConfirmNumber) {
    closeRoomPickerConfirmation();
    render({ preserveScroll: true, focusModal: true });
    return;
  }

  if (event.key === "Escape" && ui.isRoomPickerModalOpen) {
    closeRoomPickerModal();
    render({ preserveScroll: true });
    return;
  }

  if (event.key === "Escape" && ui.isGroupPickerModalOpen) {
    closeGroupPickerModal();
    render({ preserveScroll: true });
    return;
  }

  if (event.key === "Escape" && ui.isGroupLoadModalOpen) {
    closeGroupLoadModal();
    render({ preserveScroll: true });
    return;
  }

  if (event.key === "Escape" && ui.isReservationConfirmModalOpen) {
    closeReservationConfirmModal();
    render({ preserveScroll: true });
    return;
  }

  if (event.key === "Escape" && ui.isCombinedStayPaymentModalOpen) {
    closeCombinedStayPaymentModal();
    render({ preserveScroll: true, focusModal: true });
    return;
  }

  if (event.key === "Escape" && ui.isStayPaymentModalOpen) {
    closeStayPaymentModal();
    render({ preserveScroll: true });
    return;
  }

  if (event.key === "Escape" && ui.isTariffModalOpen) {
    closeTariffModal();
    render({ preserveScroll: true });
    return;
  }

  if (event.key === "Escape" && ui.isScannerModalOpen) {
    closeScannerModal({ clearDraft: true });
    render({ preserveScroll: true });
    return;
  }

  if (event.key === "Escape" && ui.isPrivateReservationModalOpen) {
    closePrivateReservationModal();
    return;
  }

  if (
    target &&
    target.id === "scanner-input" &&
    event.key === "Enter" &&
    event.ctrlKey &&
    ui.scannerTargetKind === "bulkGuests"
  ) {
    event.preventDefault();
    applyScannerToCurrentTarget();
    return;
  }

  if (
    target &&
    target.id === "scanner-input" &&
    event.key === "Enter" &&
    !event.shiftKey &&
    ui.scannerTargetKind !== "bulkGuests"
  ) {
    event.preventDefault();
    applyScannerToCurrentTarget();
  }
});

function startOperationalDayWatcher() {
  lastOperationalDate = getTodayInputDate();
  if (appDayWatcherId) {
    window.clearInterval(appDayWatcherId);
  }
  appDayWatcherId = window.setInterval(() => {
    const nextOperationalDate = getTodayInputDate();
    if (nextOperationalDate === lastOperationalDate) {
      return;
    }
    const shouldFollowToday = getRoomOverviewDate() === lastOperationalDate;
    lastOperationalDate = nextOperationalDate;
    if (shouldFollowToday) {
      ui.roomOverviewDate = nextOperationalDate;
    }
    render({ preserveScroll: true });
  }, 60000);
}

startOperationalDayWatcher();
window.addEventListener("resize", emitSystemEmbeddedHeight);
window.addEventListener("storage", (event) => {
  if (event.key !== THEME_PREF_KEY) {
    return;
  }
  ui.theme = event.newValue === "light" ? "light" : "dark";
  applyThemePreference(ui.theme);
  updateThemeToggleControls();
});
render();
