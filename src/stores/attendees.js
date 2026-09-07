import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useAttendeesStore = defineStore("attendees", {
  state: () => ({
    attendees: [],
    courses_phy_act: [],
    courses_math_act: [],
    faculties_act: [],
    semester_toggle: 0,
  }),

  actions: {
    saveAttendee(formData) {
      if (formData.id) {
        const index = this.attendees.findIndex(
          (attendee) => attendee.id === formData.id,
        );
        if (index !== -1) {
          this.attendees[index] = formData;
        }
      } else {
        formData.id = uuidv4();
        this.attendees.push(formData);
      }
    },
    removeAttendee(id) {
      const index = this.attendees.findIndex((attendee) => attendee.id === id);
      if (index !== -1) {
        this.attendees.splice(index, 1);
      }
    },
    clearAttendees() {
      this.attendees = [];
    },
    populatedb() {
      this.attendees.push({
        pid: "imadummy",
        start:
          "Fri Oct 18 2019 15:47:57 GMT+0200 (Mitteleuropäische Sommerzeit)",
        end: "Fri Oct 18 2019 17:48:30 GMT+0200 (Mitteleuropäische Sommerzeit)",
        faculty: "Sonstige",
        semester: "7+",
        courses: ["MathChem1", "AP2"],
        comments: "Buh!",
        idnumber: "c923593d-ba64-416d-8d6f-03462bf86b12",
      });
    },
  },
  persist: true,
});
