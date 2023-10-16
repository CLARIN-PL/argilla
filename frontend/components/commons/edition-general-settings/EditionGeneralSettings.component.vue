<template>
  <div class="edition-user-info">
    <div class="form-group circle-and-role">
      <span v-circle="{ size: 'MEDIUM' }">
        {{ userInfo.username.slice(0, 2) }}
      </span>
      <div class="bubble capitalized" v-text="userInfo.role" />
    </div>

    <div class="form-group general-discard">
      <h2
        class="--heading5 --semibold description__title"
        v-text="$t('userSettings.showDiscardButtonInDatasets')"
      />
      <select v-model="showDiscardButton" class="description__lang-selector">
        <option :value="true" v-text="$t('common.yes')" />
        <option :value="false" v-text="$t('common.no')" />
      </select>
    </div>
    <div class="form-group --actions">
      <BaseButton
        type="submit"
        class="primary submit-button"
        :disabled="isLoading"
        @on-click="onClickSubmit"
      >
        <span v-text="$t('common.submit')" />
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { GeneralSettings } from "@/models/GeneralSettings";
import { setDiscardButtonAvailability } from "@/database/modules/users";

export default {
  name: "EditionGeneralSettingsComponent",
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showDiscardButton: false,
      isLoading: false,
    };
  },
  created() {
    GeneralSettings.new();
    const settings = GeneralSettings.find(this.$auth.user.id);
    this.showDiscardButton = settings?.show_discard_button;
  },
  methods: {
    setDiscardButtonAvailability,
    async onClickSubmit() {
      this.isLoading = true;
      await this.setDiscardButtonAvailability(this.showDiscardButton);
      GeneralSettings.update({
        where: this.$auth.user.id,
        data: {
          show_discard_button: this.showDiscardButton,
        },
      });
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.form-group {
  padding: $base-space * 3 0;
  &:not(:first-child):not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}

.workspaces {
  gap: 5px;
  display: flex;
  flex-wrap: wrap;
  width: 90%;
}

.bubble {
  width: fit-content;
  border: 1px solid rgba(0, 0, 0, 0.37);
  border-radius: 10px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  font-size: 0.75rem;
  line-height: 12px;
  line-height: 0.75rem;
  padding: 4px;
}

.circle-and-role {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: $base-space * 2;
  padding-bottom: 0;
}

.user-first_name {
  display: flex;
  flex-direction: column;
}

.user-last_name {
  display: flex;
  flex-direction: column;
}

.user-username {
  @include font-size(16px);
}

.capitalized {
  text-transform: capitalize;
}

.clickable {
  cursor: pointer;
  background-color: $black-4;
  border: unset;
  &:hover {
    background-color: $black-10;
  }
}

.description {
  &__title {
    margin-top: 0;
    margin-bottom: $base-space;
  }
  &__text {
    margin: 0;
  }

  &__lang-selector {
    border: 1px solid palette(grey, 600);
    border-radius: $border-radius;
    padding: 0 1em;
    outline: none;
    background: transparent;
    min-height: 40px;
  }
}

.form-group {
  &.--actions {
    .submit-button {
      margin-left: auto;
    }
  }
}
</style>
