<template>
  <base-action-tooltip class="button" :tooltip="tooltip">
    <a href="#" @click.prevent="copy(code)">
      <svgicon name="copy" width="16" height="16" />
    </a>
  </base-action-tooltip>
</template>

<script>
import "assets/icons/copy";
export default {
  props: {
    code: {
      type: String,
      required: true,
    },
  },
  computed: {
    tooltip() {
      return this.$nuxt.$i18n.t("common.copied");
    },
  },
  methods: {
    copy(code) {
      this.$copyToClipboard(code);
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  position: absolute !important;
  top: 1em;
  right: 1em;
  svg {
    fill: palette(white);
  }
}
</style>
