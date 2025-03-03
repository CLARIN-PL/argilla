<!--
  - coding=utf-8
  - Copyright 2021-present, the Recognai S.L. team.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div class="container">
    <BaseLoading v-if="hasAuthToken" />
    <form class="form" @submit.prevent="onLoginUser">
      <div class="form__header">
        <brand-logo class="form__logo" />
        <select v-model="selectedLocale" class="form__lang-selector">
          <option
            v-for="(locale, idx) in $i18n.locales"
            :key="'option_' + idx"
            :value="locale.code"
          >
            {{ locale.name }}
          </option>
        </select>
      </div>
      <div class="form__content">
        <p class="form__title">{{ $t("login.messages.welcome") }}</p>
        <p class="form__text">
          {{ $t("login.messages.pleaseEnterYourDetails") }}
        </p>
        <div class="form__input" :class="{ active: login.username }">
          <label class="form__label">{{ $t("login.username") }}</label>
          <input
            v-model="login.username"
            type="text"
            :placeholder="$t('login.guides.enterUsername')"
          />
        </div>
        <div class="form__input" :class="{ active: login.password }">
          <label class="form__label">{{ $t("login.password") }}</label>
          <input
            v-model="login.password"
            type="password"
            :placeholder="$t('login.guides.enterPassword')"
          />
        </div>
        <p v-if="deployment === 'quickstart'">
          {{ $t("login.guides.youAreUsingQuickstartVersion") }}
          <a
            href="https://docs.argilla.io/en/latest/getting_started/quickstart.html"
            target="_blank"
            >{{ $t("login.guides.thisGuide") }}</a
          >
          {{ $t("login.guides.toLearnMore") }}
        </p>
        <base-button
          type="submit"
          class="form__button primary"
          :loading="loading"
          :disabled="disabled"
        >
          {{ showLoadingText ? loadingProgressText : $t("login.enter") }}
        </base-button>
        <p class="form__error" v-if="error">{{ formattedError }}</p>
      </div>
    </form>
    <div class="login--right">
      <p class="login__claim">{{ $t("login.messages.slogan") }}</p>
      <geometric-shape-a />
      <p class="login__text">
        {{ $t("login.messages.slackSupport") }}
        <a
          href="https://join.slack.com/t/rubrixworkspace/shared_invite/zt-whigkyjn-a3IUJLD7gDbTZ0rKlvcJ5g"
          target="_blank"
          >Slack</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import { GeneralSettings } from "~/models/GeneralSettings";
export default {
  layout: "app",
  data() {
    return {
      error: undefined,
      login: {
        username: "",
        password: "",
      },
      loading: false,
      disabled: false,
      deployment: false,
      hasAuthToken: false,
      showLoadingText: false,
    };
  },
  async created() {
    const rawAuthToken = this.$route.query.auth;

    if (!rawAuthToken) return;

    try {
      const [username, password] = atob(rawAuthToken).split(":");
      if (username && password) {
        this.hasAuthToken = true;
        try {
          await this.loginUser({ username, password });
        } catch {
          this.hasAuthToken = false;
        }
      }
    } catch {
      /* lint:disable:no-empty */
    }
  },
  async mounted() {
    try {
      const response = await fetch("deployment.json");

      const { deployment } = await response.json();

      this.deployment = deployment;
    } catch {
      this.deployment = null;
    }
  },
  computed: {
    loadingProgressText() {
      let text = "";
      if (this.$auth.user.id) {
        const { current_progress_observation, current_progress_feedback } =
          GeneralSettings.find(this.$auth.user.id);
        const avg =
          (current_progress_observation + current_progress_feedback) / 2;
        text = `Loading ${parseInt(avg)}%...`;
      }
      return text;
    },
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
      },
    },
    formattedError() {
      if (this.error) {
        return this.error.toString().includes("401")
          ? this.$t("login.messages.wrongCredentials")
          : this.error;
      }
    },
  },
  methods: {
    nextRedirect() {
      const redirect_url = this.$nuxt.$route.query.redirect || "/";
      this.$router.push({
        path: redirect_url,
      });
    },
    async loginUser(authData) {
      await this.$auth.logout();
      await this.$store.dispatch("entities/deleteAll");
      await this.$auth.loginWith("authProvider", {
        data: this.encodedLoginData(authData),
      });
      GeneralSettings.insertOrUpdate({
        data: {
          id: this.$auth.user.id,
          agent: this.$auth.user.username,
          show_discard_button: this.$auth.user.show_discard_button,
        },
      });
      this.showLoadingText = this.$auth.user.role === "annotator";
      this.nextRedirect();
      this.$nextTick(() => {
        setTimeout(() => {
          this.loading = false;
          this.disabled = false;
        }, 5000);
      });
    },
    async onLoginUser() {
      try {
        this.loading = true;
        this.disabled = true;
        await this.loginUser(this.login);
      } catch (err) {
        this.error = err;
        this.loading = false;
        this.disabled = false;
      }
    },
    encodedLoginData({ username, password }) {
      return `username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: $brand-secondary-color;
  display: flex;

  @include media("<=tablet") {
    flex-direction: column;
  }

  a {
    outline: none;
    color: $brand-primary-color;
    text-decoration: none;
    &:hover {
      color: darken($brand-primary-color, 10%);
    }
  }
}
.form {
  background: palette(white);
  display: flex;
  padding: $base-space * 5;
  z-index: 1;
  min-height: 100vh;
  width: 50vw;
  flex-flow: column;

  @include media("<=desktopSmall") {
    width: 100%;
  }

  &__content {
    max-width: 300px;
    margin: auto;

    @include media("<=desktopSmall") {
      max-width: 600px;
    }

    @include media("<=tablet") {
      max-width: 300px;
    }
  }
  &__logo {
    text-align: left;
    max-width: 120px;
    height: auto;
  }
  &__label {
    display: block;
    margin-bottom: $base-space;
    font-weight: 500;
  }
  &__title {
    @include font-size(40px);
    line-height: 1.2em;
    margin: 0 auto $base-space auto;
    color: $black-87;
    font-weight: 500;
    letter-spacing: 0.03em;
    font-family: "raptor_v2_premiumbold", "Helvetica", "Arial", sans-serif;
  }
  &__text {
    margin-top: 0;
    margin-bottom: $base-space * 6;
    @include font-size(18px);
    line-height: 1.4em;
    font-weight: 400;
  }
  &__button {
    margin: 2em auto 0 auto;
    justify-content: center;
    width: 100%;
  }
  &__input {
    position: relative;
    display: block;
    margin-bottom: 1em;

    input {
      border: 1px solid palette(grey, 600);
      border-radius: $border-radius;
      padding: 0 1em;
      outline: none;
      background: transparent;
      min-height: 40px;
      width: 100%;
    }
  }

  &__header {
    display: flex;
  }

  &__lang-selector {
    border: 1px solid palette(grey, 600);
    border-radius: $border-radius;
    padding: 0 1em;
    outline: none;
    background: transparent;
    min-height: 40px;
    width: auto;
    margin-left: auto;
  }

  &__error {
    color: #ff4f46;
  }
}
input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px palette(white) inset;
}
.login {
  &--right {
    display: flex;
    flex-flow: column;
    position: relative;
    width: 50vw;

    @include media("<=desktopSmall") {
      display: none;
    }

    svg {
      position: absolute;
      max-width: 380px;
      margin: auto;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
  &__claim {
    margin: auto auto;
    max-width: 400px;
    z-index: 1;
    @include font-size(40px);
    line-height: 1.3em;
    color: palette(white);
    font-family: "raptor_v2_premiumbold", "Helvetica", "Arial", sans-serif;
    transform: translateX(-0.85em);
    padding-top: 1em;
  }
  &__text {
    margin-top: 0;
    text-align: center;
    margin-bottom: $base-space * 3;
    @include font-size(16px);
    line-height: 1.4em;
    font-weight: 400;

    @include media("<=tablet") {
      @include font-size(14px);
    }
  }
}
</style>
