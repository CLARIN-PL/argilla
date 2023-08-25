<template>
  <HeaderAndTopAndTwoColumns>
    <template v-slot:header>
      <HeaderGeneralSettingsContent />
    </template>
    <template v-slot:top>
      <TopGeneralSettingsContent />
    </template>
    <template v-slot:left>
      <LeftGeneralSettingsContent />
    </template>
  </HeaderAndTopAndTwoColumns>
</template>

<script>
import HeaderAndTopAndTwoColumns from "@/layouts/HeaderAndTopAndTwoColumns";

export default {
  name: "GeneralSettingsPage",
  components: {
    HeaderAndTopAndTwoColumns,
  },
};
</script>
