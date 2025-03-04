/*
 * coding=utf-8
 * Copyright 2021-present, the Recognai S.L. team.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Model } from "@vuex-orm/core";
import { ExpiredAuthSessionError } from "@nuxtjs/auth-next/dist/runtime";
import { Notification } from "@/models/Notifications";
import { currentWorkspace } from "@/models/Workspace";
import Vue from "vue";

const $t = (sign) => Vue.prototype.$nuxt.$options.i18n.t(sign);

export default ({ $axios, app }) => {
  Model.setAxios($axios);

  $axios.interceptors.request.use(async (config) => {
    const currentUser = app.$auth.user;

    if (!currentUser) {
      return config;
    }

    const ws = currentWorkspace(app.context.route);
    if (ws) {
      config.headers["X-Argilla-Workspace"] = ws;
    }
    return config;
  });

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    if (error instanceof ExpiredAuthSessionError || 401 === code) {
      app.$auth.logout();
    }

    const messageDetail = error.response.data.detail || {
      code: undefined,
      params: {},
    };

    switch (code) {
      case 400:
        Notification.dispatch("notify", {
          message: Object.entries(messageDetail.params)
            .map(([k, v]) => `${$t("common.errorLabel")} ${k}: ${v}`)
            .join("\n"),
          type: "error",
        });
        break;
      case 422:
        (messageDetail.params.errors || [undefined]).forEach(({ msg }) => {
          Notification.dispatch("notify", {
            message: $t("common.errorLabel") + ": " + (msg || "Unknown"),
            type: "error",
          });
        });
        break;
      case 404:
        Notification.dispatch("notify", {
          message:
            $t("common.warningLabel") + ": " + `${messageDetail.params.detail}`,
          type: "warning",
        });
        break;
      default:
        Notification.dispatch("notify", {
          message: `${$t("common.errorLabel")}:  ${
            messageDetail.params.detail
          }`,
          type: "error",
        });
    }

    throw error;
  });
};
