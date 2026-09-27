import { defineStore } from "pinia";
import { getDepartments } from "@/api/departments";

export const useDepartmentsStore = defineStore("departments", {
  state: () => ({
    departments: [],
  }),
  actions: {
    async fetchDepartments() {
      const data = await getDepartments();
      // API returns array of { id, name }
      this.departments = data;
    },
  },
});
