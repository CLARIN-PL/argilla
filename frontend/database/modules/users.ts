import { Users } from "../../models/users";

const getters = {};
const actions = {};

export async function setDiscardButtonAvailability(value: boolean) {
  try {
    const { response } = await Users.api().patch("/users/update_discard", {
      show_discard_button: value,
    });
    return response.data;
  } catch (error) {
    return { labels: [] };
  }
}

export async function getUserData() {
  try {
    const { response } = await Users.api().get("/me");
    return { isLoadingUserData: false, userData: response.data };
  } catch (error) {
    return {};
  }
}

export default {
  getters,
  actions,
};
