<template>
  <BaseTopbarBrand v-once>
    <BaseBreadcrumbs
      v-if="breadcrumbs"
      :breadcrumbs="breadcrumbs"
      @breadcrumb-action="$emit('breadcrumb-action', $event)"
    />
    <user-avatar-tooltip />
  </BaseTopbarBrand>
</template>

<script>
import { ROUTES } from "@/v1/infrastructure/services";
export default {
  name: "HeaderUserSettingsComponent",
  computed: {
    breadcrumbs() {
      return [
        { link: { name: ROUTES.datasets}, name: this.$t("common.home") },
        {
          link: null,
          name: this.$t("userSettings.mySettings"),
        },
      ];
    },
  },
};
</script>
