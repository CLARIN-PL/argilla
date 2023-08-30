<template>
  <div class="dataset-delete" v-if="datasetName">
    <h2 class="--heading5 --semibold">{{ $t("common.dangerZone") }}</h2>
    <base-card
      card-type="danger"
      :title="datasetDeleteTitle"
      :text="$t('common.beCarefulThisActionIsNotReversible')"
      :buttonText="$t('common.deleteDataset')"
      @card-action="toggleDeleteModal(true)"
    />
    <base-modal
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
          <base-button
            class="primary outline"
            @click="toggleDeleteModal(false)"
          >
            {{ $t("common.cancel") }}
          </base-button>
          <base-button class="primary" @click="onConfirmDeleteDataset">
            {{ $t("common.yesDelete") }}
          </base-button>
        </div>
      </div>
    </base-modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { currentWorkspace } from "@/models/Workspace";
import { getDatasetFromORM } from "@/models/dataset.utilities";
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
  },
  data: () => {
    return {
      showDeleteModal: false,
    };
  },
  computed: {
    dataset() {
      return getDatasetFromORM(this.datasetId, this.datasetTask);
    },
    datasetName() {
      return this.dataset?.name;
    },
    datasetDeleteTitle() {
      return `${this.$t("common.delete")} <strong>${this.datasetName}</strong>`;
    },
    modalTitle() {
      return `${this.$t("common.deleteConfirmation")}`;
    },
    modalDescription() {
      return `${this.$t("common.youAreAboutToDelete")}: <strong>${
        this.datasetName
      }</strong> ${this.$t("common.fromWorkspace")} <strong>${
        this.workspace
      }</strong>. ${this.$t("common.thisActionCannotBeUndone")}`;
    },
    workspace() {
      return currentWorkspace(this.$route);
    },
  },
  methods: {
    ...mapActions({
      deleteDataset: "entities/datasets/deleteDataset",
    }),
    async onConfirmDeleteDataset() {
      try {
        await this.deleteSelectedDataset();
        this.goToDatasetList();
      } catch ({ response }) {
        if (response === "NOT_ALLOWED_TO_UPDATE_LABELS") {
          console.log("user is not allowed to delete dataset");
        } else {
          console.log(response);
        }
      } finally {
        this.toggleDeleteModal(false);
      }
    },
    toggleDeleteModal(value) {
      this.showDeleteModal = value;
    },
    goToDatasetList() {
      this.$router.push("/");
    },
    async deleteSelectedDataset() {
      await this.deleteDataset({
        workspace: this.workspace,
        name: this.datasetName,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dataset-delete {
  margin-bottom: $base-space * 5;
}
</style>
