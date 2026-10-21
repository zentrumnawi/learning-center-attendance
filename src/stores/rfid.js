import { defineStore } from "pinia";

export const useRfidStore = defineStore("rfid", {
  state: () => ({
    cardId: "",
  }),

  actions: {
    setCardId(cardId) {
      this.cardId = cardId || "";
    },
    clearCardId() {
      this.cardId = "";
    },
  },
});
