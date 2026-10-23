import { httpJson } from "./http";

export async function getAttendeeByCardId(cardId) {
  const data = await httpJson(
    `/api/participants/?anonymousIdentifier=${encodeURIComponent(cardId)}`,
    {
      method: "GET",
    },
  );
  return data[0] ?? null;
}

export function mapParticipantToFormFields(participant, departments = []) {
  if (!participant) {
    return { cardId: "", faculty: null, semester: "" };
  }

  const department = departments.find((d) => d.id === participant.department);

  return {
    cardId: participant.anonymousIdentifier || "",
    faculty: department?.name ?? null,
    semester: participant.semester == null ? "" : participant.semester,
  };
}
