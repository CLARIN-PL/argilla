<template>
  <div class="similarity-search__buttons">
    <base-button class="primary outline small" @click="cancel">
      {{ $t("common.cancel") }}
    </base-button>
    <base-button class="primary small" @click="findSimilar">
      {{ $t("common.find") }}
    </base-button>
  </div>
</template>
<script>
export default {
  methods: {
    findSimilar() {
      this.$emit("find-similar");
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>
<style lang="scss" scoped>
.similarity-search {
  &__buttons {
    display: flex;
    gap: $base-space;
    & > * {
      flex: 1;
      justify-content: center;
    }
  }
}
</style>
