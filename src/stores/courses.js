import { defineStore } from "pinia";
import { getCourses } from "@/api/courses";

export const useCoursesStore = defineStore("courses", {
  state: () => ({
    courses: [],
  }),
  actions: {
    async fetchCourses() {
      const data = await getCourses();
      // API returns array of { id, department, name }
      this.courses = data;
    },
  },
});
