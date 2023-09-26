/*
 * coding=utf-8
 * Copyright 2023-present, CLARIN-PL team
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
    let settings: any = userId ? GeneralSettings.find(userId) : null;
    const allowedRoles: any[] = ["admin", "owner"];
    if (!allowedRoles.includes($auth.user.role) && settings) {
      if (!settings.current_dataset_name) {
        await getDatasetsUseCase.execute();
      }
      settings = GeneralSettings.find(userId);
      const isNotOnCorrectDataset =
        route.name.startsWith("datasets-") &&
        settings.current_dataset_name &&
        !route.fullPath.includes(settings.current_dataset_name);
      const isNotOnCorrectDatasetFeedback =
        route.name.startsWith("dataset-") &&
        settings.current_dataset_id &&
        !route.fullPath.includes(settings.current_dataset_id);
      if (isNotOnCorrectDataset || isNotOnCorrectDatasetFeedback) {
        redirect("/datasets");
      }
    }
  }
};
