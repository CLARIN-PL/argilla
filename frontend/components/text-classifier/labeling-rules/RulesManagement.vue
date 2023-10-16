<template>
  <div
    v-if="isVisible"
    class="rules-management"
  >
    <base-loading v-if="$fetchState.pending" />
    <div v-else-if="!$fetchState.error">
      <div class="rules-management__header">
        <p class="rules-management__title">
          {{ $t("dataset.rules") }}
          <span v-if="formattedRules.length">({{ formattedRules.length }})</span>
        </p>
        <base-button
          class="rules-management__button primary outline small"
          @click="hideList"
        >
          <svgicon
            name="chevron-left"
            width="12"
            height="12"
          ></svgicon>
          {{ $t("dataset.backTo") }}
        </base-button>
      </div>
      <base-search-bar
        v-if="formattedRules.length"
        :placeholder="$t('dataset.searchRule')"
        @input="onSearch"
      />

      <BaseFeedbackComponent
        v-if="areMetricsInPending"
        :feedbackInput="feedbackInputInMetricsPendingState"
        :isLoading="areMetricsInPending"
        class="feedback-area"
      />

      <base-table-info
        class="rules-management__table"
        :data="formattedRules"
        :sorted-order="sortedOrder"
        :sorted-by-field="sortedByField"
        :columns="tableColumns"
        :actions="areMetricsInPending ? [] : actions"
        :query-search="querySearch"
        :global-actions="false"
        search-on="query"
        :no-data-info="noDataInfo"
        :empty-search-info="emptySearchInfo"
        :visible-modal-id="visibleModalId"
        :delete-modal-content="getDeleteModalText"
        @sort-column="onSortColumns"
        @onActionClicked="onActionClicked"
        @close-modal="closeModal"
      />
    </div>
  </div>
</template>

<script>
import "assets/icons/unavailable";
import _ from "lodash";
import { mapActions } from "vuex";
import { getDatasetFromORM } from "@/models/dataset.utilities";
import { getViewSettingsByDatasetName } from "@/models/viewSettings.queries";

export default {
  props: {
    datasetId: {
      type: Array,
      required: true,
    },
    datasetTask: {
      type: String,
      required: true,
    },
    datasetName: {
      type: String,
      required: true,
    },
  },
  data: () => {
    return {
      querySearch: undefined,
      visibleModalId: undefined,
      sortedOrder: "desc",
      sortedByField: "created_at",
    };
  },
  async fetch() {
    if (!this.rules) {
      await this.dataset.refreshRules();
    }
  },
  computed: {
    isMobile() {
      const mobileViews = ["sm", "mm"];
      return mobileViews.includes(this.$mq);
    },
    actions() {
      return [
        {
          name: "delete",
          icon: "trash-empty",
          title: this.$t("datasets.deleteRule"),
        },
      ];
    },
    emptySearchInfo() {
      return {
        title: this.$t("datasets.zeroRulesFound"),
      };
    },
    noDataInfo() {
      return {
        title: this.$t("datasets.zeroRulesDefined"),
        message: this.$t("datasets.noDataInfo"),
        icon: "unavailable",
      };
    },
    feedbackInputInMetricsPendingState() {
      return {
        message: this.$t("dataset.calculatingRule"),
        feedbackType: "ERROR",
      };
    },
    dataset() {
      return getDatasetFromORM(this.datasetId, this.datasetTask);
    },
    viewSettings() {
      return getViewSettingsByDatasetName(this.datasetName);
    },
    tableColumns() {
      const columns = [
        {
          name: this.$t("datasets.query"),
          field: "query",
          class: "table-info__title",
          type: "action",
        },
        {
          name: this.$t("datasets.labels"),
          field: "labels",
          class: "array",
          type: "array",
        },
        {
          name: this.$t("datasets.coverage"),
          field: "coverage",
          class: "text",
          type: "percentage",
          tooltip: this.$t("datasets.coverageDescription"),
        },
        {
          name:
            this.$mq >= "sm"
              ? this.$t("datasets.anCoverage")
              : this.$t("datasets.annotationCoverage"),
          field: "coverage_annotated",
          class: "text",
          type: "percentage",
          tooltip: this.$t("datasets.annotationCoverageDescription"),
        },
        {
          name: this.$t("datasets.correct"),
          field: "correct",
          class: "text",
          tooltip: this.$t("datasets.correctDescription"),
        },
        {
          name: this.$t("datasets.incorrect"),
          field: "incorrect",
          class: "text",
          tooltip: this.$t("datasets.incorrectDescription"),
        },
        {
          name: this.$t("datasets.precision"),
          field: "precision",
          class: "text",
          type: "percentage",
          tooltip: this.$t("datasets.precisionDescription"),
        },
        {
          name: this.$t("datasets.createdAt"),
          field: "created_at",
          class: "date",
          type: "date",
        },
      ];

      const mobileColumnNames = ["query", "labels", "coverage"];
      const tabletColumnNames = mobileColumnNames.join([
        "coverage_annotated",
        "correct",
        "incorrect",
      ]);
      const mobileColumns = columns.filter((col) =>
        mobileColumnNames.includes(col.field)
      );
      const tabletColumns = columns.filter((col) =>
        tabletColumnNames.includes(col.field)
      );
      return this.$mq === "sm"
        ? mobileColumns
        : this.$mq === "mm"
        ? tabletColumns
        : columns;
    },
    rules() {
      return this.dataset.labelingRules;
    },
    perRuleMetrics() {
      return this.dataset.labelingRulesMetrics;
    },
    isVisible() {
      return this.viewSettings.visibleRulesList;
    },
    formattedRules() {
      if (this.rules) {
        return this.rules.map((r) => {
          return {
            id: r.query,
            name: r.description,
            query: r.query,
            kind: "select",
            labels: r.labels,
            ...this.metricsForRule(r),
            created_at: r.created_at,
          };
        });
      } else {
        return [];
      }
    },
    getDeleteModalText() {
      return {
        title: this.$t("datasets.permanentlyDeleteRule"),
        text: `${this.$t("datasets.youAreAboutToDelete")} <strong>"${
          this.visibleModalId
        }"</strong> ${this.$t("datasets.fromYourDatasetThis")}`,
      };
    },
    areMetricsInPending() {
      return (
        this.rules?.length !== 0 &&
        this.rules.length !== Object.keys(this.perRuleMetrics || {})?.length
      );
    },
  },
  methods: {
    ...mapActions({
      search: "entities/datasets/search",
    }),

    metricsForRule(rule) {
      const metrics = _.isNil(this.perRuleMetrics)
        ? null
        : this.perRuleMetrics[rule.query];

      if (!metrics) {
        return {};
      }
      return {
        coverage: metrics.coverage,
        coverage_annotated: metrics.coverage_annotated,
        correct: metrics.correct,
        incorrect: metrics.incorrect,
        precision: !isNaN(metrics.precision) ? metrics.precision : "-",
      };
    },

    async hideList() {
      await this.viewSettings.disableRulesSummary();
    },

    async onSelectQuery(rule) {
      await this.dataset.setCurrentLabelingRule(rule);
      if (rule.query !== this.dataset.query.text) {
        await this.search({
          dataset: this.dataset,
          query: { text: rule.query },
        });
      }
      await this.hideList();
    },
    onActionClicked(action, rule) {
      switch (action) {
        case "delete":
          this.onShowConfirmRuleDeletion(rule);
          break;
        case "confirm-delete":
          this.onDeleteRule(rule);
          break;
        case "select":
          this.onSelectQuery(rule);
          break;
        default:
          console.warn(action);
      }
    },
    onSortColumns(by, order) {
      this.sortedByField = by;
      this.sortedOrder = order;
    },
    onSearch(event) {
      this.querySearch = event;
    },
    onShowConfirmRuleDeletion(id) {
      this.visibleModalId = id.query;
    },
    async onDeleteRule(rule) {
      await this.dataset.deleteLabelingRule(rule);
    },
    closeModal() {
      this.visibleModalId = undefined;
    },
  },
};
</script>
<style lang="scss" scoped>
.rules-management {
  padding-left: 4em;
  padding-top: 2em;
  margin-bottom: 2em;
  overflow: auto;
  height: 100vh;
  @extend %hide-scrollbar;

  @include media("<=tablet") {
    padding-left: 2em;
  }

  &__header {
    display: flex;
    align-items: center;
  }
  &__title {
    @include font-size(22px);
    font-weight: 600;
    margin-top: 0;
    @include media("<=tablet") {
      @include font-size(20px);
    }

    span {
      @include font-size(16px);
      font-weight: normal;

      @include media("<=tablet") {
        @include font-size(14px);
      }
    }
  }
  &__button {
    margin-left: auto;
  }
  &__table {
    margin-bottom: 2em !important;
    :deep() {
      .table-info__item__col {
        width: 130px;
      }
      .table-info__item__col:first-child {
        width: auto;
        min-width: auto;
        flex-grow: 1.5;
      }
      .table-info__body {
        overflow: visible;
        height: auto;
      }
      .table-info__item {
        padding-right: 3em !important;
      }
    }
  }
}
</style>
