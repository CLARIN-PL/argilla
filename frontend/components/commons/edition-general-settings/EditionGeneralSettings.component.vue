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
  </div>
</template>

<script>
import { GeneralSettings } from "@/models/GeneralSettings";

export default {
  name: "EditionGeneralSettingsComponent",
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    showDiscardButton: {
      get() {
        return false;
        // return GeneralSettings.find("showDiscardButton");
      },
      set() {
        // GeneralSettings.insertOrUpdate({
        //   where: "showDiscardButton",
        //   data: {
        //     value
        //   }
        // })
      },
    },
  },
  created() {
    GeneralSettings.new();
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
</style>
