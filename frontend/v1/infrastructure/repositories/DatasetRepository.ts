import { type NuxtAxiosInstance } from "@nuxtjs/axios";
import { Store } from "vuex";
import _, { sortBy } from "lodash";
import { Dataset } from "@/v1/domain/entities/Dataset";
import { IDatasetRepository } from "@/v1/domain/services/IDatasetRepository";
import { GeneralSettings } from "~/models/GeneralSettings";

export const DATASET_API_ERRORS = {
  ERROR_FETCHING_FEEDBACK_DATASETS: "ERROR_FETCHING_FEEDBACK_DATASETS",
  ERROR_FETCHING_WORKSPACES: "ERROR_FETCHING_WORKSPACES",
  ERROR_FETCHING_DATASET_INFO: "ERROR_FETCHING_DATASET_INFO",
  ERROR_FETCHING_WORKSPACE_INFO: "ERROR_FETCHING_WORKSPACE_INFO",
};

export class DatasetRepository implements IDatasetRepository {
  constructor(
    private readonly axios: NuxtAxiosInstance,
    private readonly store: Store<unknown>
  ) {}

  async getById(id: string): Promise<Dataset> {
    const dataset = await this.getDatasetById(id);
    const workspace = await this.getWorkspaceById(dataset.workspace_id);

    return new Dataset(
      dataset.id,
      dataset.name,
      "FeedbackTask",
      dataset.guidelines,
      dataset.status,
      dataset.workspace_id,
      workspace,
      {},
      dataset.inserted_at,
      dataset.updated_at,
      dataset.is_completed
    );
  }

  async getAll(): Promise<Dataset[]> {
    const response = await this.getDatasets();

    const otherDatasets = response.oldDatasets.map((dataset) => {
      return new Dataset(
        dataset.id,
        dataset.name,
        dataset.task,
        "",
        "",
        "",
        dataset.workspace,
        dataset.tags,
        dataset.created_at,
        dataset.last_updated,
        dataset.is_completed
      );
    });

    const feedbackDatasets = response.feedbackDatasetsWithWorkspaces.map(
      (datasetFromBackend) => {
        return new Dataset(
          datasetFromBackend.id,
          datasetFromBackend.name,
          "FeedbackTask",
          datasetFromBackend.guidelines,
          datasetFromBackend.status,
          datasetFromBackend.workspace_id,
          datasetFromBackend.workspace_name,
          {},
          datasetFromBackend.inserted_at,
          datasetFromBackend.updated_at,
          datasetFromBackend.is_completed
        );
      }
    );

    const datasets = [...otherDatasets, ...feedbackDatasets].map((dataset) => {
      return {
        ...dataset,
        createdAt: dataset.createdAt || dataset.insertedAt,
      };
    });
    const orderedDatasets = sortBy(
      datasets,
      [(dataset) => new Date(dataset.createdAt)],
      ["asc"]
    );
    let filteredDatasets = _.cloneDeep(orderedDatasets);
    const allowedRoles: any[] = ["admin", "owner"];
    if (!allowedRoles.includes(this.store.$auth.$state.user.role)) {
      const completedDatasets = filteredDatasets.filter(
        (dataset) => !dataset.isCompleted
      );
      filteredDatasets = completedDatasets.splice(0, 1);

      if (filteredDatasets.length) {
        GeneralSettings.update({
          where: this.store.$auth.$state.user.id,
          data: {
            current_dataset_id: filteredDatasets[0].id,
            current_dataset_name: filteredDatasets[0].name,
          },
        });
      }
    }

    return filteredDatasets;
  }

  private async getDatasetById(datasetId: string) {
    try {
      const { data } = await this.axios.get(`/v1/datasets/${datasetId}`);

      return data;
    } catch (err) {
      throw {
        response: DATASET_API_ERRORS.ERROR_FETCHING_DATASET_INFO,
      };
    }
  }

  private async getWorkspaceById(workspaceId: string) {
    try {
      const { data: responseWorkspace } = await this.axios.get(
        `/v1/workspaces/${workspaceId}`
      );

      const { name } = responseWorkspace || { name: null };

      return name;
    } catch (err) {
      throw {
        response: DATASET_API_ERRORS.ERROR_FETCHING_WORKSPACE_INFO,
      };
    }
  }

  private fetchFeedbackDatasets = async (axios) => {
    try {
      const { data } = await axios.get("/v1/me/datasets");
      if (data.items && data.items.length) {
        const promises = data.items.map((item) => {
          const apiLink = `/v1/me/datasets/${item.id}/metrics`;
          return axios.get(apiLink).then((response) => {
            item.metrics = response.data;
            item.is_completed =
              item.metrics.records.count === item.metrics.responses.count;
            return item;
          });
        });
        await Promise.all(promises);
      }

      return data;
    } catch (err) {
      throw {
        response: DATASET_API_ERRORS.ERROR_FETCHING_FEEDBACK_DATASETS,
      };
    }
  };

  private fetchWorkspaces = async (axios) => {
    try {
      const { data } = await axios.get("/workspaces");

      return data;
    } catch (err) {
      throw {
        response: DATASET_API_ERRORS.ERROR_FETCHING_WORKSPACES,
      };
    }
  };

  private factoryFeedbackDatasetsWithCorrespondingWorkspaceName = (
    feedbackDatasets,
    workspaces
  ) => {
    const newFeedbackDatasets = feedbackDatasets.map((feedbackDataset) => {
      return {
        ...feedbackDataset,
        workspace_name:
          workspaces.find(
            (workspace) => workspace.id === feedbackDataset.workspace_id
          )?.name || "",
      };
    });
    return newFeedbackDatasets;
  };

  private getDatasets = async () => {
    const [oldDatasets, newDatasets, workspaces] = await Promise.all([
      this.store.dispatch("entities/datasets/fetchAll"),
      this.fetchFeedbackDatasets(this.axios),
      this.fetchWorkspaces(this.axios),
    ]);

    const { items: feedbackTaskDatasets } = newDatasets;

    const feedbackDatasetsWithWorkspaces =
      this.factoryFeedbackDatasetsWithCorrespondingWorkspaceName(
        feedbackTaskDatasets,
        workspaces
      );

    return { oldDatasets, feedbackDatasetsWithWorkspaces };
  };
}
