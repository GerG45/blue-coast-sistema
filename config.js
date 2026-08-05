window.BLUE_COAST_REMOTE_STATE = Object.freeze({
  provider: "firestore",
  firestore: Object.freeze({
    collection: "blue_coast_state",
    document: "operational",
    chunkSize: 600000,
  }),
});
