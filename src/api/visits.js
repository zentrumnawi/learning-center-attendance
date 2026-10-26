import { format } from "date-fns";
import { httpJson } from "./http";

export async function submitVisit(data) {
  return await httpJson("/api/visits/", {
    method: "POST",
    body: data,
  });
}

// Map AttendeeForm state to the /api/visits/ POST body.
export function buildVisitPayload(form, departments = []) {
  const department = departments.find((d) => d.name === form.faculty);

  return {
    anonymousIdentifier: form.cardId,
    semester: form.semester,
    department: department?.id,
    date: format(form.start, "yyyy-MM-dd"),
    startTime: format(form.start, "HH:mm:ss"),
    endTime: format(form.end, "HH:mm:ss"),
    courses: form.generalQuestion ? [] : form.courses,
  };
}
