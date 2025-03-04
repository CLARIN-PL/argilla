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

import { Context } from "@nuxt/types";
import { GeneralSettings } from "~/models/GeneralSettings";
import { getUserDataWithAxios } from "~/database/modules/users";

export default async ({ $auth, $axios, route, redirect }: Context) => {
  let isLoading = true;
  const { isLoadingUserData, userData } = await getUserDataWithAxios($axios);
  isLoading = isLoadingUserData;
  if ($auth && $auth.user && userData && !isLoading) {
    GeneralSettings.insertOrUpdate({
      data: {
        id: $auth.user.id,
        agent: $auth.user.username,
        show_discard_button: userData.show_discard_button,
      },
    });
  }
  switch (route.name) {
    case "login":
      break;
    default:
      if (!$auth.loggedIn) {
        const REDIRECT_URL =
          "/login?redirect=" + encodeURIComponent(route.fullPath);
        redirect(REDIRECT_URL);
      }
  }
};
