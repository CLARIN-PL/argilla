import { Users } from "../../models/Users";

const getters = {};
const actions = {
  async setDiscardButtonAvailability(value: boolean) {
    try {
      const { response } = await Users.api().patch("/users/update_discard", {
        show_discard_button: value,
      });
      return response.data;
    } catch (error) {
      return { labels: [] };
    }
  },
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
export async function getUserDataWithAxios($axios: any) {
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
