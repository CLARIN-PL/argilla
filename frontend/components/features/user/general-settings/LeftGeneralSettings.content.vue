<template>
  <div class="wrapper">
    <BaseSpinner v-if="!user" />
    <div class="left-content" v-if="user">
      <div class="left-content-item edition-general-settings-component">
        <EditionGeneralSettingsComponent :userInfo="user" />
      </div>
    </div>
  </div>
</template>

<script>
import EditionGeneralSettingsComponent from "../../../commons/edition-general-settings/EditionGeneralSettings.component.vue";

export default {
  name: "LeftGeneralSettingsContent",
  computed: {
    user() {
      return this.$auth.user;
    },
  },
  components: { EditionGeneralSettingsComponent },
};
</script>

<style lang="scss" scoped>
.left-content-item {
  border-bottom: 1px solid $black-10;
}
</style>
