<template>
  <BaseTopbarBrand>
    <BaseBreadcrumbs
      v-if="breadcrumbs.length"
      :breadcrumbs="breadcrumbs"
      :copy-button="copyButton"
      @breadcrumb-action="$emit('breadcrumb-action', $event)"
    />
    <template v-if="datasetId">
      <BaseButton
        ref="trainButtonRef"
        class="header__button small"
        @on-click="onClickTrain"
        v-if="isAdminOrOwnerRole && showTrainButton && isDesktop"
      >
        <svgicon name="code" width="20" height="20" /> {{ $t("common.train") }}
      </BaseButton>
      <NuxtLink
        v-if="isDesktop"
        :to="{ name: 'dataset-id-settings', params: { id: this.datasetId } }"
      >
        <DatasetSettingsIconFeedbackTaskComponent
          v-if="datasetId"
          :datasetId="datasetId"
        />
      </NuxtLink>
    </template>
    <user-avatar-tooltip />
  </BaseTopbarBrand>
</template>

<script>
export default {
  name: "HeaderFeedbaskTaskComponent",
  props: {
    datasetId: {
      type: String,
      required: true,
    },
    breadcrumbs: {
      type: Array,
      default: () => [],
    },
    showTrainButton: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      copyButton: false,
    };
  },
  computed: {
    isDesktop() {
      const mobileViews = ["sm", "mm"];
      return !mobileViews.includes(this.$mq);
    },
    isAdminOrOwnerRole() {
      const role = this.$auth.user.role;
      return role === "admin" || role === "owner";
    },
  },
  methods: {
    onClickTrain() {
      this.$emit("on-click-train");
    },
  },
};
</script>

<style lang="scss" scoped>
$header-button-color: #262a2e;
.header__button {
  background: $header-button-color;
  color: palette(white);
  margin-right: $base-space;
  padding: 10px 12px 10px 10px;
  font-weight: 600;
  @include font-size(14px);
  box-shadow: $shadow-200;
  &:hover {
    background: lighten($header-button-color, 3%);
  }
  svg {
    fill: palette(white);
  }
}
</style>
