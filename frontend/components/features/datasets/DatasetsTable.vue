<template>
  <div class="container">
    <datasets-empty v-if="!datasets.length" />
    <div class="dataset__table" v-else>
      <div class="interactions">
        <base-search-bar
          @input="onSearch"
          :placeholder="$t('datasets.searchDatasets')"
        />
      </div>
      <base-table-info
        ref="table"
        search-on="name"
        :global-actions="false"
        :data="datasets"
        :original-data="originalDatasets"
        :sorted-order="sortedOrder"
        :sorted-by-field="sortedByField"
        :actions="actions"
        :columns="filteredTableColumns"
        :query-search="querySearch"
        :empty-search-info="emptySearchInfo"
        :active-filters="activeFilters"
        @sort-column="onSortColumns"
        @onActionClicked="onActionClicked"
        @filter-applied="onColumnFilterApplied"
      />
    </div>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import { currentWorkspace } from "@/models/Workspace";
import { useRoutes } from "@/v1/infrastructure/services";

export default {
  props: {
    originalDatasets: {
      type: Array,
      default: () => [],
    },
    datasets: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      querySearch: undefined,
      tableColumns: [
        {
          name: this.$t("datasets.name"),
          field: "name",
          class: "table-info__title",
          type: "link",
        },
        {
          name: this.$t("datasets.workspace"),
          field: "workspace",
          class: "text",
          type: "text",
          filtrable: "true",
        },
        {
          name: this.$t("datasets.task"),
          field: "task",
          class: "task",
          type: "task",
          filtrable: "true",
        },
        {
          name: this.$t("datasets.tags"),
          field: "tags",
          class: "text",
          type: "object",
          filtrable: "true",
        },
        {
          name: this.$t("datasets.createdAt"),
          field: "createdAt",
          class: "date",
          type: "date",
          sortable: "true",
        },
        {
          name: this.$t("datasets.updatedAt"),
          field: "updatedAt",
          class: "date",
          type: "date",
          sortable: "true",
        },
      ],
      actions: [
        {
          name: "go-to-settings",
          icon: "settings",
          title: this.$t("datasets.goToDatasetSettings"),
          tooltip: this.$t("dataset.settings.datasetSettings"),
        },
        {
          name: "copy",
          icon: "link",
          title: this.$t("datasets.copyUrlToClipboard"),
          tooltip: this.$t("common.copied"),
        },
      ],
      emptySearchInfo: {
        title: this.$t("datasets.noDatasetsFound"),
      },
      externalLinks: [],
      sortedOrder: "asc",
      sortedByField: "createdAt",
    };
  },
  computed: {
    filteredTableColumns() {
      const smMobileColumns = [this.$t("datasets.name")];
      const mmMobileColumns = [
        this.$t("datasets.name"),
        this.$t("datasets.workspace"),
        this.$t("datasets.task"),
      ];
      const allowedMobileColumns =
        this.$mq === "sm" ? smMobileColumns : mmMobileColumns;
      const mobileColumns = this.tableColumns.filter((column) =>
        allowedMobileColumns.includes(column.name)
      );
      const columns = this.$mq < "mm" ? this.tableColumns : mobileColumns;
      return columns;
    },
    activeFilters() {
      const workspaces = this.workspaces;
      const tasks = this.tasks;
      const tags = this.tags;
      return [
        { column: "workspace", values: workspaces },
        { column: "task", values: tasks },
        { column: "tags", values: tags },
      ];
    },
    workspaces() {
      return this.$route.query.workspaces?.split(",") ?? [];
    },
    tasks() {
      return this.$route.query.tasks?.split(",") ?? [];
    },
    tags() {
      return this.$route.query.tags
        ? JSON.parse(Base64.decode(this.$route.query.tags))
        : [];
    },
    workspace() {
      return currentWorkspace(this.$route);
    },
  },
  methods: {
    clearFilters() {
      if (this.$refs.table) {
        this.activeFilters.forEach((filter) => {
          this.$refs.table.onApplyFilters({ field: filter.column }, []);
        });

        this.goToDatasetsList();
      }
    },
    onSearch(event) {
      this.querySearch = event;
      this.$emit("search", this.querySearch);
    },
    onSortColumns(by, order) {
      this.sortedByField = by;
      this.sortedOrder = order;
    },
    onColumnFilterApplied({ column, values }) {
      const updateUrlParamsFor = (
        values,
        paramKey,
        currentParams,
        valuesToPush
      ) => {
        if (values === currentParams) return;

        const query = createQueryFor(values, paramKey, valuesToPush);
        this.$router.push({ query });
      };

      const createQueryFor = (values, paramKey, valuesToPush) => {
        if (values.length) {
          return { ...this.$route.query, [paramKey]: valuesToPush };
        }

        const { [paramKey]: keyToEscape, ...rest } = this.$route.query;
        return { ...rest };
      };

      switch (column) {
        case "workspace":
          updateUrlParamsFor(
            values,
            "workspaces",
            this.workspaces,
            values.join(",")
          );
          break;
        case "task":
          updateUrlParamsFor(values, "tasks", this.tasks, values.join(","));
          break;
        case "tags":
          updateUrlParamsFor(
            values,
            "tags",
            this.tags,
            Base64.encodeURI(JSON.stringify(values))
          );
          break;
      }
    },
    onActionClicked(action, dataset) {
      switch (action) {
        case "go-to-settings":
          this.goToSetting(dataset);
          break;
        case "copy":
          this.copyUrl(dataset);
          break;
        case "copy-name":
          this.copyName(dataset);
          break;
        default:
          console.warn(action);
      }
    },
    copy(value) {
      this.$copyToClipboard(value);
    },
    copyUrl(dataset) {
      this.copy(`${window.origin}${this.getDatasetLink(dataset)}`);
    },
    copyName({ name }) {
      this.copy(name);
    },
  },
  setup() {
    return useRoutes();
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  padding: 0.2em calc($sidebarMenuWidth + 4em) 0 4em;
  flex-grow: 1;
  overflow: auto;

  @include media("<=tablet") {
    padding: 0.2em calc($sidebarMenuWidth + 2em) 0 2em;
  }
}
.dataset {
  &__table {
    width: 100%;
  }
}
.interactions {
  display: flex;
  align-items: flex-end;
  margin: 2em 0 1em 0;
}

.search-area {
  width: clamp(300px, 30vw, 800px);
}
</style>
