<template>
  <div class="dataset-delete">
    <h2 class="--heading5 --semibold" v-text="$t('common.dangerZone')" />
    <BaseCard
      card-type="danger"
      :title="datasetDeleteTitle"
      :text="$t('common.beCarefulThisActionIsNotReversible')"
      :buttonText="$t('common.deleteDataset')"
      @card-action="toggleDeleteModal(true)"
    />

    <BaseModal
      class="delete-modal"
      :modal-custom="true"
      :prevent-body-scroll="true"
      modal-class="modal-secondary"
      :modal-title="modalTitle"
      :modal-visible="showDeleteModal"
      @close-modal="toggleDeleteModal(false)"
    >
      <div>
        <p v-html="modalDescription"></p>
        <div class="modal-buttons">
          <BaseButton class="primary outline" @click="toggleDeleteModal(false)">
            {{ $t("common.cancel") }}
          </BaseButton>
          <BaseButton class="primary" @click="onConfirmDeleteDataset">
            {{ $t("common.yesDelete") }}
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script lang="ts">
import { Notification } from "@/models/Notifications";
import { deleteDatasetById } from "@/models/feedback-task-model/feedback-dataset/feedbackDataset.queries";
import { urlDeleteDatasetV1 } from "@/utils/url.properties";

const TYPE_OF_FEEDBACK = Object.freeze({
  NOT_ALLOWED_TO_DELETE_DATASET: "NOT_ALLOWED_TO_DELETE_DATASET",
});

export default {
  name: "DatasetDeleteFeedbackTaskComponent",
  props: {
    dataset: {
      type: Object,
      required: true,
    },
  },
  created() {},
  data() {
    return {
      showDeleteModal: false,
      datasetId: this.dataset.id,
      datasetName: this.dataset.name,
      workspace: this.dataset.workspace,
    };
  },
  computed: {
    datasetDeleteTitle() {
      return this.$t("dataset.deleteDataset", {
        dataset_name: this.dataset.name,
      });
    },
    modalTitle() {
      return this.$t("common.deleteConfirmation");
    },
    modalDescription() {
      return (
        this.$t("common.youAreAboutToDelete") +
        ` <strong>${this.dataset.name}</strong> ` +
        this.$t("common.fromThisWorkspace") +
        ` <strong>${this.dataset.workspace}</strong>. ` +
        this.$t("common.thisActionCannotBeUndone")
      );
    },
  },
  methods: {
    toggleDeleteModal(show) {
      this.showDeleteModal = show;
    },
    async onConfirmDeleteDataset() {
      try {
        await this.deleteDataset();
        this.goToDatasetList();
      } catch ({ response }) {
        if (response === TYPE_OF_FEEDBACK.NOT_ALLOWED_TO_DELETE_DATASET) {
          console.log("user is not allowed to delete dataset");
        } else {
          console.log(response);
        }
      } finally {
        this.toggleDeleteModal(false);
      }
    },
    async deleteDataset() {
      let message = "";
      let typeOfNotification = "";
      let statusCall = null;

      const url = urlDeleteDatasetV1(this.datasetId);
      try {
        await this.$axios.delete(url);

        // DELETE dataset from the orm
        deleteDatasetById(this.datasetId);

        message = `${this.datasetName} ${this.$t("common.hasBeenDeleted")} `;
        typeOfNotification = "success";
      } catch ({ response }) {
        const { status } = response;
        statusCall = status;
        message = `${this.$t("common.itsNotPossibleToDelete")} ${
          this.datasetName
        }`;
        typeOfNotification = "error";
        if (status === 403) {
          throw {
            response: TYPE_OF_FEEDBACK.NOT_ALLOWED_TO_DELETE_DATASET,
          };
        }
      } finally {
        statusCall === 403 ||
          Notification.dispatch("notify", {
            message,
            numberOfChars: message?.length,
            type: typeOfNotification,
          });
      }
    },
    goToDatasetList() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
.dataset-delete {
  margin-bottom: $base-space * 5;
}
</style>
