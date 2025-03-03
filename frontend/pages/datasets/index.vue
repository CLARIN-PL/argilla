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
  <div class="home">
    <base-loading v-if="isLoadingDatasets" :text="loadingProgressText" />
    <div v-else>
      <div class="home__main">
        <app-header
          :copy-button="false"
          :sticky="false"
          :breadcrumbs="[{ action: 'clearFilters', name: $t('common.home') }]"
          @breadcrumb-action="onBreadcrumbAction($event)"
        />
        <error
          v-if="$fetchState.error"
          where="workspace datasets"
          :error="$fetchState.error"
        />
        <div v-else>
          <datasets-table
            ref="table"
            :original-datasets="datasetsOriginal"
            :datasets="datasetsByPage"
            @search="onSearchDatasetsTable"
          />
        </div>
        <base-pagination
          :one-page="onePage"
          :total-items="datasetsOriginal.length"
          :pagination-settings="paginationSettings"
          :visible-page-range="5"
          @changePage="onClickChangePage"
        />
      </div>
      <sidebar-menu
        class="home__sidebar"
        @refresh="$fetch"
        :sidebar-items="[
          {
            id: 'refresh',
            tooltip: $t('common.refresh'),
            icon: 'refresh',
            group: $t('common.refresh'),
            action: 'refresh',
          },
        ]"
      />
    </div>
  </div>
</template>

<script>
import { useDatasetsViewModel } from "./useDatasetsViewModel";
import { GeneralSettings } from "~/models/GeneralSettings";

export default {
  layout: "app",
  name: "DatasetsIndex",
  middleware: ["route-guard"],
  data() {
    return {
      currentPage: 1,
      paginationSize: 5,
      onePage: false,
    };
  },
  computed: {
    loadingProgressText() {
      let text = "";
      if (this.$auth.user.id && this.$auth.user.role === "annotator") {
        const { current_progress_observation, current_progress_feedback } =
          GeneralSettings.find(this.$auth.user.id);
        const avg =
          (current_progress_observation + current_progress_feedback) / 2;
        text = `Loading ${parseInt(avg)}%...`;
      }
      return text;
    },
    datasetsOriginal() {
      const datasets = this.datasets.datasets.map((dataset) => {
        dataset.link = this.getDatasetLink(dataset);
        dataset.workspace = dataset.workspace || dataset.workspaceName;
        return dataset;
      });
      return datasets;
    },
    datasetsByPage() {
      const currentIndex =
        this.currentPage === 1
          ? 0
          : (this.currentPage - 1) * this.paginationSize;
      const nextIndex = currentIndex + this.paginationSize;
      return this.datasetsOriginal.slice(currentIndex, nextIndex);
    },
    paginationSettings() {
      return {
        page: this.currentPage,
        size: this.paginationSize,
        pageSizeOptions: [5, 10, 20, 50, 100],
        maxRecordsLimit: 20000,
        disabledShortCutPagination: false,
      };
    },
  },
  methods: {
    onBreadcrumbAction(e) {
      if (e === "clearFilters") {
        this.$refs.table?.clearFilters();
      }
    },
    onSearchDatasetsTable(searchQuery) {
      this.onePage = !!searchQuery;
    },
    onClickChangePage(currentPage, pageSize) {
      this.currentPage = currentPage;
      this.paginationSize = pageSize;

      this.$forceUpdate();
    },
    isOldTask(task) {
      return [
        "TokenClassification",
        "TextClassification",
        "Text2Text",
      ].includes(task);
    },
    getDatasetLink(dataset) {
      const { task, workspace, id, name, workspaceName } = dataset;
      return this.isOldTask(task)
        ? `/datasets/${workspace || workspaceName}/${name}`
        : `/dataset/${id}/annotation-mode`;
    },
  },
  setup() {
    return useDatasetsViewModel();
  },
};
</script>

<style lang="scss" scoped>
.home {
  &__main {
    display: flex;
    flex-direction: column;
    height: 100vh;

    @include media("<=desktopSmall") {
      height: unset;
      min-height: 100vh;
    }
  }

  &__sidebar.sidebar {
    position: fixed;
    top: 56px;
    right: 0;
    border-left: 1px solid palette(grey, 600);
  }
}
</style>
