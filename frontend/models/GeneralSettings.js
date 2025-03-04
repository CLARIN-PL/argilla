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

class GeneralSettings extends Model {
  static entity = "general_settings";

  static fields() {
    return {
      uid: this.uid(),
      id: this.attr(null),
      agent: this.attr(null),
      show_discard_button: this.boolean(false),
      current_dataset_id: this.attr(null),
      current_dataset_name: this.attr(null),
      current_progress_feedback: this.number(0),
      current_progress_observation: this.number(0),
    };
  }
}

export { GeneralSettings };
