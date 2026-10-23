import { defineStore } from "pinia";

export const useRfidStore = defineStore("rfid", {
  state: () => ({
    cardId: "",
    participant: null,
  }),

  actions: {
    setCardId(cardId) {
      this.cardId = cardId || "";
    },
    clearCardId() {
      this.cardId = "";
    },
    setParticipant(participant) {
      this.participant = participant ?? null;
    },
    clearParticipant() {
      this.participant = null;
    },
  },
});
