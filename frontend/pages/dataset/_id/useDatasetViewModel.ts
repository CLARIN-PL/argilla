import Vue from "vue";
import { computed, ref, useRoute, useRouter } from "@nuxtjs/composition-api";
import { useResolve } from "ts-injecty";
import { Notification } from "@/models/Notifications";
import { GetDatasetByIdUseCase } from "@/v1/domain/usecases/get-dataset-by-id-use-case";
import { DATASET_API_ERRORS } from "@/v1/infrastructure/repositories/DatasetRepository";
import { useDataset } from "@/v1/infrastructure/storage/DatasetStorage";
import { Dataset } from "@/v1/domain/entities/Dataset";

const $t = (sign) => Vue.prototype.$nuxt.$options.i18n.t(sign);

export const useDatasetViewModel = () => {
  const isLoadingDataset = ref(false);
  const router = useRouter();
  const route = useRoute();
  const datasetId = route.value.params.id;

  const { state: dataset } = useDataset();
  const getDatasetUseCase = useResolve(GetDatasetByIdUseCase);

  const breadcrumbs = computed(() => createBreadcrumbs(dataset));

  const handleError = (response: string) => {
    let message = "";
    switch (response) {
      case DATASET_API_ERRORS.ERROR_FETCHING_DATASET_INFO:
        message = `${$t("dataset.cantGetDatasetInfo")} ${datasetId}`;
        break;
      case DATASET_API_ERRORS.ERROR_FETCHING_WORKSPACE_INFO:
        message = `${$t("dataset.cantGetWorkspaceInfo")} ${datasetId}`;
        break;
      default:
        message = $t("dataset.cantGetInfo");
    }

    const paramsForNotification = {
      message,
      numberOfChars: message.length,
      type: "error",
    };

    Notification.dispatch("notify", paramsForNotification);
  };

  const createBreadcrumbs = (dataset: Dataset) => {
    return [
      { link: { name: "datasets" }, name: $t("common.home") },
      {
        link: { path: `/datasets?workspace=${dataset.workspace}` },
        name: dataset.workspace,
      },
      {
        link: {
          name: null,
        },
        name: dataset.name,
      },
    ];
  };

  const loadDataset = async () => {
    try {
      isLoadingDataset.value = true;

      await getDatasetUseCase.execute(datasetId);
    } catch (error) {
      handleError(error.response);

      router.push("/");
    } finally {
      isLoadingDataset.value = false;
    }
  };

  const loadDatasetWithMetrics = async () => {
    try {
      isLoadingDataset.value = true;

      await getDatasetUseCase.execute(datasetId);
    } catch (error) {
      handleError(error.response);

      router.push("/");
    } finally {
      isLoadingDataset.value = false;
    }
  };

  return {
    dataset,
    datasetId,
    isLoadingDataset,
    loadDataset,
    loadDatasetWithMetrics,
    breadcrumbs,
  };
};
