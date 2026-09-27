import { httpJson } from "@/api/http";

export async function getCourses() {
  return await httpJson("/api/courses/");
}
