import { defineStore } from "pinia";
import { fetchCsrfToken } from "../api/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    csrfToken: null,
  }),
  actions: {
    async fetchCsrfToken() {
      this.csrfToken = await fetchCsrfToken();
      return this.csrfToken;
    },
  },
});
