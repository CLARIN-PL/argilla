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
  <div
    v-click-outside="{
      events: ['mousedown'],
      handler: close,
    }"
    class="filters"
  >
    <div class="filters__list">
      <div v-for="group in groups" :key="group" class="filters__list__item">
        <p
          :class="{
            active: initialVisibleGroup === group || itemsAppliedOnGroup(group),
          }"
          @click="selectGroup(group)"
        >
          <svgicon v-if="group === 'Sort'" name="sort" width="18" height="18" />
          {{ group }}
          <span v-if="itemsAppliedOnGroup(group)">
            ({{ itemsAppliedOnGroup(group) }})
          </span>
        </p>
        <div
          v-if="initialVisibleGroup === group"
          :class="[
            'filters__list__content',
            ,
            group === 'Sort' ? 'filters__list__content--sort' : null,
          ]"
        >
          <div
            :class="
              searchableFilterList.filter((f) => f.group === group).length > 6
                ? 'filters--scrollable'
                : ''
            "
          >
            <span
              v-for="filter in searchableFilterList.filter(
                (f) => f.group === group
              )"
              :key="filter.id"
            >
              <lazy-select-filter
                v-if="filter.type === 'select'"
                class="filter"
                :filter="filter"
                @apply="onApply"
              />
              <lazy-filter-score
                v-else-if="filter.type === 'score'"
                class="filter"
                :filter="filter"
                @apply="onApply"
              />
              <lazy-filter-uncovered-by-rules
                v-else-if="showUncoveredByRulesFilter"
                class="filter"
                :filter="filter"
                :dataset="dataset"
                @apply="onApply"
              />
            </span>
            <lazy-sort-list
              v-if="initialVisibleGroup === 'Sort'"
              :sort-options="filterList"
              :sort="dataset.sort"
              @closeSort="close"
              @sortBy="onSortBy"
            />
          </div>
          <base-button
            v-if="
              initialVisibleGroup !== 'Sort' && itemsAppliedOnGroup(group) > 1
            "
            class="filters__list__button secondary light small"
            @click="removeFiltersByGroup(group)"
            >{{ $t("common.removeAllFilters") }}</base-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "assets/icons/sort";
export default {
  props: {
    dataset: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => {
    return {
      initialVisibleGroup: undefined,
    };
  },
  computed: {
    filters() {
      return [
        {
          key: "predicted_as",
          name: this.$t("common.predictedAs"),
          type: "select",
          group: this.$t("common.predictions"),
          placeholder: this.$t("common.selectLabels"),
        },
        {
          key: "predicted",
          name: this.$t("common.predictedOk"),
          type: "select",
          group: this.$t("common.predictions"),
          placeholder: this.$t("common.selectYesNo"),
        },
        {
          key: "score",
          name: this.$t("common.score"),
          type: "score",
          group: this.$t("common.predictions"),
        },
        {
          key: "predicted_by",
          name: this.$t("common.predictedBy"),
          type: "select",
          group: this.$t("common.predictions"),
          placeholder: this.$t("common.selectAgents"),
        },
        {
          key: "annotated_as",
          name: this.$t("common.annotatedAs"),
          type: "select",
          group: this.$t("common.annotations"),
          placeholder: this.$t("common.selectLabels"),
        },
        {
          key: "annotated_by",
          name: this.$t("common.annotatedBy"),
          type: "select",
          group: this.$t("common.annotations"),
          placeholder: this.$t("common.selectLabels"),
        },
        {
          key: "status",
          name: this.$t("common.statusLabel"),
          type: "select",
          group: this.$t("common.statusLabel"),
          placeholder: this.$t("common.selectOptions"),
        },
        {
          key: "sort",
          name: this.$t("common.sort"),
          type: "sort",
          group: this.$t("common.sort"),
        },
      ];
    },
    searchableFilterList() {
      return this.filterList.filter((f) => {
        return f.options && Object.keys(f.options).length > 0;
      });
    },
    groups() {
      return [
        ...new Set(this.searchableFilterList.map((f) => f.group)),
        this.$t("common.sort"),
      ];
    },
    isMultiLabel() {
      return this.dataset.isMultiLabel;
    },
    showUncoveredByRulesFilter() {
      return (
        this.dataset.rules &&
        this.dataset.rules.length &&
        this.dataset.task === "TextClassification"
      );
    },
    filterList() {
      const aggregations = this.dataset.results.aggregations;
      const filters = (this.filters || [])
        .map((filter) => {
          return {
            ...filter,
            id: filter.key,
            options: aggregations[filter.key],
            selected: this.dataset.query[filter.key],
            disabled:
              (filter.key === "annotated_as" &&
                this.dataset.task === "Text2Text") ||
              (filter.key === "predicted_as" &&
                this.dataset.task === "Text2Text") ||
              (filter.key === "score" && this.isMultiLabel) ||
              !aggregations[filter.key] ||
              !Object.entries(aggregations[filter.key]).length,
          };
        })
        .filter(({ disabled }) => !disabled);
      const metadataFilters =
        aggregations.metadata &&
        Object.keys(aggregations.metadata).map((key) => {
          const filterContent = aggregations.metadata[key];
          return {
            key: key,
            name: key,
            type: "select",
            group: this.$t("common.metadata"),
            placeholder: this.$t("common.selectOptions"),
            id: key,
            options: Object.keys(filterContent).includes("argilla:stats")
              ? null
              : filterContent,
            selected: (this.dataset.query.metadata || {})[key] || [],
          };
        });
      const sortedMetadataFilters =
        (metadataFilters &&
          metadataFilters.sort((a, b) =>
            a.key.toLowerCase() > b.key.toLowerCase() ? 1 : -1
          )) ||
        [];
      const dateFields = [
        this.sortByDateFilter("last_updated", this.$t("common.lastUpdated")),
        this.sortByDateFilter(
          "event_timestamp",
          this.$t("common.eventTimestamp")
        ),
      ].filter(({ disabled }) => !disabled);
      const uncoveredByRules = {
        id: "uncovered_by_rules",
        key: "uncovered_by_rules",
        group: this.$t("common.annotations"),
        name: this.$t("common.uncoveredByRules"),
        options: [true, false],
        selected:
          this.dataset.query.uncovered_by_rules &&
          this.dataset.query.uncovered_by_rules?.length > 0,
      };

      const formattedFilters = this.showUncoveredByRulesFilter
        ? [
            ...filters,
            ...dateFields,
            ...sortedMetadataFilters,
            uncoveredByRules,
          ]
        : [...filters, ...dateFields, ...sortedMetadataFilters];

      return formattedFilters;
    },
  },
  methods: {
    close() {
      this.initialVisibleGroup = null;
    },
    itemsAppliedOnGroup(group) {
      if (group === "Sort") {
        return this.dataset.sort.length;
      } else {
        return this.filterList
          .filter((f) => f.group === group)
          .flatMap((f) => f.selected)
          .filter((f) => f).length;
      }
    },
    selectGroup(group) {
      if (this.initialVisibleGroup === group) {
        this.initialVisibleGroup = null;
      } else {
        this.initialVisibleGroup = group;
      }
    },
    onApply(filter, values) {
      if (filter.group === "Metadata") {
        this.$emit("applyMetaFilter", { filter: filter.key, values });
      } else {
        this.$emit("applyFilter", { filter: filter.key, values });
      }
      this.close();
    },
    removeFiltersByGroup(group) {
      const filtersInGroup = this.filterList.filter((f) => f.group === group);
      if (group === "Metadata") {
        this.$emit("removeAllMetadataFilters", filtersInGroup);
      } else {
        this.$emit("removeFiltersByGroup", filtersInGroup);
      }
      this.close();
    },
    onSortBy(sortList) {
      this.$emit("applySortBy", sortList);
      this.close();
    },
    sortByDateFilter(id, name, group = "Sort") {
      return {
        id,
        key: id,
        group,
        name,
        disabled: this.recordPropertyHasValue(id),
      };
    },
    recordPropertyHasValue(prop) {
      return (
        !this.dataset.results.records.some((record) => record[prop]) || false
      );
    },
  },
};
</script>

<style lang="scss" scoped>
$number-size: 18px;
.filters {
  $this: &;
  position: relative;
  display: inline-block;
  &__list {
    display: flex;
    &__content {
      width: 455px;
      right: -10em;
      margin: auto;
      position: absolute;
      top: calc(100% + 10px);
      box-shadow: $shadow;
      background: palette(white);
      padding: 20px 20px 10px 20px;
      border-radius: $border-radius;
      z-index: 2;
      @include media("<=tablet") {
        left: 0.5em;
      }

      @include media(">desktop") {
        left: 0;
        right: 0;
      }
      &--sort {
        max-width: 410px;
      }
    }
    &__item {
      position: relative;
      flex-shrink: 0;
    }
    &__button {
      margin: 2em auto 1em 2em;
    }
    p {
      cursor: pointer;
      position: relative;
      margin-bottom: 0;
      margin-top: 0;
      padding: 0.8em;
      border-radius: $border-radius;
      margin-right: $base-space;
      @include font-size(14px);
      white-space: nowrap;
      font-weight: 500;
      @include media(">desktop") {
        padding: 0.8em 1em;
        margin-right: $base-space * 2;
      }
      &:hover {
        background: $black-4;
      }
      &.active {
        background: $black-4;
      }
    }
  }
  :deep(.filters--scrollable) {
    max-height: 312px;
    overflow: auto;
    @extend %hide-scrollbar;
    margin-top: -20px;
    margin-bottom: -10px;
    padding-top: 20px;
    padding-bottom: 10px;
    .dropdown {
      position: static;
    }
  }
  :deep(.filter__remove-button) {
    position: relative;
    margin-right: 1em;
    cursor: pointer;
    flex-shrink: 0;
    width: auto;
    padding: 0;
    display: flex;
    &:hover {
      .svg-icon {
        fill: $black-87;
      }
    }
    .svg-icon {
      margin: auto;
    }
  }
}

.filter {
  margin-bottom: 1em;
}
</style>
