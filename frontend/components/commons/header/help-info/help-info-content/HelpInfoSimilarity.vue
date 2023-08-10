<!--
  - coding=utf-8
  - Copyright 2021-present, the Recognai S.L. team.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div>
    <p>
      {{ $t("helpInfo.sinceCode") }}
    </p>
    <img src="images/help-info/similarity.png" alt="token attributions" />
    <p>
      {{ $t("helpInfo.thisFeature") }}
    </p>
    <p>
      {{ $t("helpInfo.toBenefit") }}
      <a
        class="link"
        href="https://docs.argilla.io/en/latest/guides/features/semantic-search.html"
        target="_blank"
      >
        {{ $t("helpInfo.docs") }}
      </a>
    </p>
  </div>
</template>

<style lang="scss" scoped>
code {
  background: $black-4;
}
.link {
  color: $primary-color;
  text-decoration: none;
  &:hover {
    color: darken($primary-color, 15%);
  }
}
img {
  display: flex;
  max-width: calc(100% - 16px);
  margin: 1.5em auto;
  border-radius: $border-radius;
  box-shadow: 0 2px 4px 3px $black-20;
}
</style>
