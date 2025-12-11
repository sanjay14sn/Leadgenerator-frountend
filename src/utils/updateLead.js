import API from "../api/api";

export async function updateLeadInDB(id, update) {
  try {
    await API.patch(`/leads/update/${id}`, update);
  } catch (err) {
    console.error("Update failed:", err);
  }
}
