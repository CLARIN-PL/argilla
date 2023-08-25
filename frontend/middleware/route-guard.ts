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
import { useResolve } from "ts-injecty";
import { GeneralSettings } from "~/models/GeneralSettings";
import { GetDatasetsUseCase } from "@/v1/domain/usecases/get-datasets-use-case";

export default async ({ $auth, route, redirect }: Context) => {
  if ($auth && $auth.user) {
    const getDatasetsUseCase = useResolve(GetDatasetsUseCase);
    GeneralSettings.insertOrUpdate({
      data: {
        id: $auth.user.id,
        agent: $auth.user.username,
      },
    });
    const userId: any = $auth.user.id || "";
    let settings: any = GeneralSettings.find(userId);
    if ($auth.user.role !== "admin" && settings) {
      if (!settings.current_dataset_name) {
        await getDatasetsUseCase.execute();
      }
      settings = GeneralSettings.find(userId);
      const isNotOnCorrectDataset =
        settings.current_dataset_name &&
        !route.fullPath.includes(settings.current_dataset_name);
      if (route.name.startsWith("datasets-") && isNotOnCorrectDataset) {
        redirect("/datasets");
      }
    }
  }
};
