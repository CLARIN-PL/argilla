<template>
  <div class="left-content">
    <div class="left-content-item dataset-description">
      <div class="item">
        <p class="dataset-name" v-html="datasetName" />
        <p class="dataset-task" v-html="datasetTask" />
      </div>
      <base-action-tooltip :tooltip="$t('common.copied')">
        <base-button
          :title="$t('common.copyKeyToClipboard')"
          class="secondary small"
          @click.prevent="$copyToClipboard(datasetSettingsUrl)"
        >
          {{ $t("common.copyLink") }}
        </base-button>
      </base-action-tooltip>
    </div>
    <div class="dataset-description-component left-content-item">
      <DatasetDescriptionComponent :datasetDescription="settingsDescription" />
    </div>
    <div
      class="labels-edition-component left-content-item"
      v-if="isTaskTokenClassification || isTaskTextClassification"
    >
      <EditionLabelComponent
        class="labels-edition-component__content"
        :datasetId="datasetId"
        :datasetTask="datasetTask"
        :isLoading="isLoading"
      />
    </div>
    <div class="delete-dataset-component" v-if="datasetTask && hasPermission">
      <DatasetDeleteComponent
        :datasetId="datasetId"
        :datasetTask="datasetTask"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  ObservationDataset,
  getDatasetModelPrimaryKey,
} from "@/models/Dataset";

export default {
  name: "LeftDatasetSettingsContent",
  computed: {
    hasPermission() {
      const permissions = ["admin", "owner"];
      return permissions.includes(this.$auth.user.role);
    },
    datasetSettingsUrl() {
      const { fullPath } = this.$route;
      const datasetSettingsUrl = `${window.origin}${fullPath}`;
      return datasetSettingsUrl;
    },
    datasetName() {
      return this.$route.params.dataset;
    },
    datasetWorkspace() {
      return this.$route.params.workspace;
    },
    datasetId() {
      return getDatasetModelPrimaryKey({
        name: this.datasetName,
        workspace: this.datasetWorkspace,
      });
    },
    dataset() {
      return ObservationDataset.query().whereId(this.datasetId).first();
    },
    datasetTask() {
      return this.dataset?.task;
    },
    isTaskTokenClassification() {
      return this.datasetTask === "TokenClassification";
    },
    isTaskTextClassification() {
      return this.datasetTask === "TextClassification";
    },
    settingsDescription() {
      return this.$t("dataset.settings.soonYouWillBeAble");
    },
    isLoading() {
      return this.$fetchState.pending;
    },
  },
  async fetch() {
    //  Fetch the record data and initialize the corresponding data models and fetch labels
    await this.fetchByName(this.datasetName);
  },
  watch: {
    isLoading(loadingState) {
      this.onEmitLoadingStateByBusEvent(loadingState);
    },
  },
  methods: {
    ...mapActions({
      fetchByName: "entities/datasets/fetchByName",
    }),
    onEmitLoadingStateByBusEvent(loadingState) {
      this.$root.$emit("is-loading-value", loadingState);
    },
  },
  destroyed() {
    this.$root.$off("is-loading-value");
  },
};
</script>

<style lang="scss" scoped>
.left-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .dataset-description {
    display: flex;
    align-items: center;
    min-height: 5em;

    @include media("<=tablet") {
      flex-direction: column;
      align-items: flex-start;
      padding: 1em 0;
    }

    .item {
      flex: 1;
      display: flex;
      align-items: center;
      gap: $base-space * 2;
    }
  }
}

.left-content-item {
  border-bottom: 1px solid $black-10;
}

.labels-edition-component {
  min-height: 15em;
  padding-bottom: $base-space * 4;
  &__content {
    max-width: calc(100% - 150px);
  }
}
.dataset-name {
  @include font-size(16px);

  @include media("<=desktopSmall") {
    @include font-size(14px);
  }
}
.dataset-task {
  color: $black-54;
  border: 1px solid $black-37;
  border-radius: $border-radius-m;
  padding: calc($base-space / 2);
  @include font-size(12px);
  @include line-height(12px);
}
</style>
