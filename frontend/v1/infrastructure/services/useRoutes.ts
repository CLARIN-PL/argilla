import { useRouter } from "@nuxtjs/composition-api";
import { Dataset } from "@/v1/domain/entities/Dataset";

export const ROUTES = {
  datasets: "datasets",
};
export const useRoutes = () => {
  const router = useRouter();

  const isOldTask = (task: string) => {
    return ["TokenClassification", "TextClassification", "Text2Text"].includes(
      task
    );
  };

  const getDatasetLink = (dataset: Dataset): string => {
    const { task, name, workspace, id, workspaceName } = dataset;
    return isOldTask(task)
      ? `/datasets/${workspace || workspaceName}/${name}`
      : `/dataset/${id}/annotation-mode`;
  };

  const goToSetting = ({ task, workspace, name, id }: Dataset) => {
    if (isOldTask(task)) {
      router.push({
        name: "datasets-workspace-dataset-settings",
        params: {
          workspace,
          dataset: name,
        },
      });
    } else {
      router.push({
        name: "dataset-id-settings",
        params: { id },
      });
    }
  };

  const goToDatasetsList = () => {
    router.push({ path: `/${ROUTES.datasets}` });
  };

  return { goToDatasetsList, goToSetting, getDatasetLink };
};
