<template>
  <BaseTopbarBrand v-once>
    <BaseBreadcrumbs
      v-if="breadcrumbs"
      :breadcrumbs="breadcrumbs"
      @breadcrumb-action="$emit('breadcrumb-action', $event)"
    />
    <user />
  </BaseTopbarBrand>
</template>

<script>
export default {
  name: "HeaderUserSettingsComponent",
  computed: {
    breadcrumbs() {
      return [
        { link: { name: "datasets" }, name: this.$t("common.home") },
        {
          link: null,
          name: this.$t("userSettings.mySettings"),
        },
      ];
    },
  },
};
</script>
