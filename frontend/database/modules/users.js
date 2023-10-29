import { Users } from "~/models/Users";

export async function setDiscardButtonAvailability(discard_button) {
  try {
    const { response } = await Users.api().patch("/users/update_discard", {
      show_discard_button: discard_button,
    });
    return response.data;
  } catch (error) {
    return { labels: [] };
  }
}

const getters = {};
const actions = {
  setDiscardButtonAvailability,
  async getUserData() {
    try {
      const { response } = await Users.api().get("/me");
      return { isLoadingUserData: false, userData: response.data };
    } catch (error) {
      return {};
    }
  },
};

/* Hack, using the Users.api() will generate new error since the Vue & Vuex is not yet initialized on page load state */
export async function getUserDataWithAxios($axios) {
  try {
    const { data } = await $axios.get("/me");
    return { isLoadingUserData: false, userData: data };
  } catch (error) {
    return {};
  }
}

export default {
  getters,
  actions,
};
