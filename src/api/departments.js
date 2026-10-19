import { httpJson } from "@/api/http";

export async function getDepartments() {
  return await httpJson("/api/departments/");
}
