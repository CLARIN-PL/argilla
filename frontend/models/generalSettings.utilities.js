import { GeneralSettings } from "./GeneralSettings";

export const updateGeneralSettings = (userId, data) => {
  GeneralSettings.update({
    where: userId,
    data,
  });
};
