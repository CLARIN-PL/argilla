<template>
  <div class="edition-user-info">
    <div class="form-group circle-and-role">
      <span v-circle="{ size: 'MEDIUM' }" v-html="userNameFirstChar" />
      <div class="user-role" v-text="userRole" />
    </div>

    <div class="form-group user-first_name">
      <h2
        class="--heading5 --semibold description__title"
        :v-text="$t('userSettings.username')"
      />
      <p class="--body1 description__text" v-text="username" />
    </div>

    <div class="form-group user-first_name">
      <h2
        class="--heading5 --semibold description__title"
        :v-text="$t('userSettings.name')"
      />
      <p class="--body1 description__text" v-text="firstName" />
    </div>

    <div class="form-group user-last_name">
      <h2
        class="--heading5 --semibold description__title"
        :v-text="$t('userSettings.surname')"
      />
      <p class="--body1 description__text" v-text="lastName" />
    </div>

    <div class="form-group user-language">
      <h2
        class="--heading5 --semibold description__title"
        :v-text="$t('userSettings.language')"
      />
      <select v-model="selectedLocale" class="description__lang-selector">
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
import { cloneDeep } from "lodash";
export default {
  name: "EditionUserInfoComponent",
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      language: "",
    };
  },
  created() {
    this.userInfoCloned = cloneDeep(this.userInfo);
    this.username = this.userInfoCloned.username;
    this.firstName = this.userInfoCloned.first_name;
    this.lastName = this.userInfoCloned.last_name ?? "-";
  },
  computed: {
    userName() {
      return this.userInfoCloned.username;
    },
    userNameFirstChar() {
      return this.userName.slice(0, 2);
    },
    userRole() {
      return this.$options.filters.capitalize(this.userInfoCloned.role);
    },
    selectedLocale: {
      get() {
        return (
          this.$i18n.locales.find((locale) => locale.code == this.$i18n.locale)
            .code || "pl"
        );
      },
      set(val) {
        this.$i18n.setLocale(val);
        window.location.reload(true);
      },
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

.user-role {
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
