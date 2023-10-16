<template>
  <div class="edition-user-info">
    <div class="form-group circle-and-role">
      <span v-circle="{ size: 'MEDIUM' }">
        {{ userInfo.username.slice(0, 2) }}
      </span>
      <div
        class="bubble capitalized"
        v-text="userInfo.role"
      />
    </div>

    <div class="form-group user-first_name">
      <h2 class="--heading5 --semibold description__title">
        {{ $t("userSettings.username") }}
      </h2>
      <p
        class="--body1 description__text"
        v-text="userInfo.username"
      />
    </div>

    <div class="form-group user-first_name">
      <h2 class="--heading5 --semibold description__title">
        {{ $t("userSettings.name") }}
      </h2>
      <p
        class="--body1 description__text"
        v-text="userInfo.first_name"
      />
    </div>

    <div class="form-group user-last_name">
      <h2 class="--heading5 --semibold description__title">
        {{ $t("userSettings.surname") }}
      </h2>
      <p
        class="--body1 description__text"
        v-if="userInfo.last_name"
        v-text="userInfo.last_name"
      />
      <p
        class="--body1 description__text"
        v-else
      >-</p>
    </div>

    <div class="form-group">
      <h2 class="--heading5 --semibold description__title">
        {{ $t("userSettings.workspace") }}
      </h2>
      <div
        class="workspaces"
        v-if="userInfo.workspaces.length"
      >
        <div
          class="bubble clickable"
          v-for="(workspace, idx) in userInfo.workspaces"
          :key="`workspace_${idx}`"
          v-text="workspace"
          @click="goToWorkspace(workspace)"
        />
      </div>
      <p
        v-else
        class="--body1 description__text"
      >-</p>
    </div>

    <div class="form-group user-language">
      <h2
        class="--heading5 --semibold description__title"
        v-text="$t('userSettings.language')"
      />
      <select
        v-model="selectedLocale"
        class="description__lang-selector"
      >
        <option
          v-for="(locale, idx) in $i18n.locales"
          :key="'option_' + idx"
          :value="locale.code"
        >
          {{ locale.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditionUserInfoComponent",
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    selectedLocale: {
      get() {
        const locales = this.$i18n.locales || [];
        const locale = locales.find(
          (locale) => locale.code == this.$i18n.locale
        );
        return locale?.code || "pl";
      },
      set(val) {
        this.$i18n.setLocale(val);
        window.location.reload(true);
      },
    },
  },
  methods: {
    goToWorkspace(workspace) {
      this.$router.push(`/datasets?workspaces=${workspace}`);
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

  @include media("<=tablet") {
    @include font-size(14px);
  }
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
