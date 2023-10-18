<template>
  <form
    class="questions-form"
    :class="{ '--edited-form': !isFormUntouched }"
    @submit.prevent="onSubmit"
  >
    <div class="questions-form__content">
      <div class="questions-form__header">
        <p class="questions-form__title --heading5 --medium">
          {{ $t("commons.forms.submitYourFeedback") }}
        </p>
        <p class="questions-form__guidelines-link">
          {{ $t("common.readThe") }}
          <NuxtLink
            :to="{
              name: 'dataset-id-settings',
              params: { id: datasetId },
            }"
            target="_blank"
            >{{ $t("commons.forms.annotationGuidelines") }}
            <svgicon name="external-link" width="12" />
          </NuxtLink>
        </p>
      </div>
      <div
        class="form-group"
        v-for="question in record.questions"
        :key="question.id"
      >
        <TextAreaComponent
          ref="textArea"
          v-if="question.isTextType"
          :title="question.title"
          v-model="question.answer.value"
          :placeholder="question.settings.placeholder"
          :useMarkdown="question.settings.use_markdown"
          :hasSuggestion="!record.isSubmitted && question.matchSuggestion"
          :isRequired="question.isRequired"
          :description="question.description"
        />

        <SingleLabelComponent
          v-if="question.isSingleLabelType"
          :questionId="question.id"
          :title="question.title"
          v-model="question.answer.values"
          :hasSuggestion="!record.isSubmitted && question.matchSuggestion"
          :isRequired="question.isRequired"
          :description="question.description"
          :visibleOptions="question.settings.visible_options"
        />

        <MultiLabelComponent
          v-if="question.isMultiLabelType"
          :questionId="question.id"
          :title="question.title"
          v-model="question.answer.values"
          :hasSuggestion="!record.isSubmitted && question.matchSuggestion"
          :isRequired="question.isRequired"
          :description="question.description"
          :visibleOptions="question.settings.visible_options"
        />

        <RatingComponent
          v-if="question.isRatingType"
          :title="question.title"
          v-model="question.answer.values"
          :hasSuggestion="!record.isSubmitted && question.matchSuggestion"
          :isRequired="question.isRequired"
          :description="question.description"
        />

        <RankingComponent
          v-if="question.isRankingType"
          :title="question.title"
          v-model="question.answer.values"
          :hasSuggestion="!record.isSubmitted && question.matchSuggestion"
          :isRequired="question.isRequired"
          :description="question.description"
        />
      </div>
    </div>
    <div class="footer-form">
      <div class="footer-form__left-footer">
        <BaseButton
          type="button"
          ref="clearButton"
          class="primary text"
          @click.prevent="onClear"
        >
          <span v-text="$t('common.clear')" />
        </BaseButton>
      </div>
      <div class="footer-form__right-area">
        <BaseButton
          type="button"
          class="primary outline"
          v-if="showDiscardButton"
          @on-click="onDiscard"
          :disabled="record.isDiscarded || isDiscardButtonDisabled"
        >
          <span v-text="$t('common.discard')" />
        </BaseButton>
        <div v-if="isSubmitButtonDisabled">
          <tooltip-component
            direction="top"
            :message="$t('common.pleaseFillRequiredFields')"
          >
            <BaseButton
              type="submit"
              class="primary"
              :disabled="isSubmitButtonDisabled || isSubmitButtonLoading"
            >
              <span v-text="$t('common.submit')" />
            </BaseButton>
          </tooltip-component>
        </div>
        <div v-else>
          <BaseButton
            type="submit"
            class="primary"
            :disabled="isSubmitButtonDisabled || isSubmitButtonLoading"
          >
            <span v-text="$t('common.submit')" />
          </BaseButton>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import "assets/icons/external-link";
import { isEqual, cloneDeep } from "lodash";
import { useQuestionFormViewModel } from "./useQuestionsFormViewModel";
import { GeneralSettings } from "@/models/GeneralSettings";
import TooltipComponent from "@/components/base/tooltip/Tooltip.component.vue";

export default {
  name: "QuestionsFormComponent",
  components: {
    TooltipComponent,
  },
  props: {
    datasetId: {
      type: String,
      required: true,
    },
    record: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      originalRecord: null,
      isDiscardButtonDisabled: false,
      isSubmitButtonLoading: false,
    };
  },
  setup() {
    return useQuestionFormViewModel();
  },
  computed: {
    isFormUntouched() {
      return isEqual(this.originalRecord, this.record);
    },
    showDiscardButton() {
      const settings = GeneralSettings.find(this.$auth.user.id);
      return settings?.show_discard_button;
    },
    questionAreCompletedCorrectly() {
      return this.record.questionAreCompletedCorrectly();
    },
    isSubmitButtonDisabled() {
      if (this.record.isSubmitted)
        return this.isFormUntouched || !this.questionAreCompletedCorrectly;

      return !this.questionAreCompletedCorrectly;
    },
  },
  watch: {
    isFormUntouched(isFormUntouched) {
      this.emitIsQuestionsFormUntouched(isFormUntouched);
    },
  },
  created() {
    this.record.restore();

    this.onReset();
  },
  mounted() {
    document.addEventListener("keydown", this.onPressKeyboardShortCut);
  },
  destroyed() {
    this.emitIsQuestionsFormUntouched(true);
    document.removeEventListener("keydown", this.onPressKeyboardShortCut);
  },
  methods: {
    onPressKeyboardShortCut({ code, shiftKey }) {
      switch (code) {
        case "Enter": {
          this.onSubmit();
          break;
        }
        case "Space": {
          if (shiftKey) this.onClear();
          break;
        }
        case "Backspace": {
          this.onDiscard();
          break;
        }
        default:
      }
    },
    async onDiscard() {
      this.isDiscardButtonDisabled = true;
      await this.discard(this.record);
      this.$emit("on-discard-responses");
      this.onReset();
      this.isDiscardButtonDisabled = false;
    },
    async onSubmit() {
      if (!this.questionAreCompletedCorrectly) {
        return;
      }
      this.isSubmitButtonLoading = true;
      await this.submit(this.record);
      this.$emit("on-submit-responses");
      this.onReset();
      this.isSubmitButtonLoading = false;
    },
    async onClear() {
      await this.clear(this.record);
      this.clearTextarea();

      this.onReset();
    },
    clearTextarea() {
      const textareaId = "contentId";
      if (document.getElementById(textareaId)) {
        document.getElementById(textareaId).innerText = "";
      }
    },
    onReset() {
      this.originalRecord = cloneDeep(this.record);
    },
    emitIsQuestionsFormUntouched(isFormUntouched) {
      this.$emit("on-question-form-touched", !isFormUntouched);

      this.$root.$emit("are-responses-untouched", isFormUntouched);
    },
  },
};
</script>

<style lang="scss" scoped>
.questions-form {
  display: flex;
  flex-direction: column;
  flex-basis: 37em;
  height: 70vh;
  min-width: 0;
  justify-content: space-between;
  border-radius: $border-radius-m;
  box-shadow: $shadow;

  @include media("<=desktopSmall") {
    flex-basis: 30em;
    height: auto;
    flex-basis: 0;
  }

  &__header {
    align-items: baseline;
  }
  &__title {
    margin: 0 0 calc($base-space / 2) 0;
    color: $black-87;
  }
  &__guidelines-link {
    margin: 0;
    @include font-size(14px);
    color: $black-37;
    a {
      color: $black-37;
      outline: 0;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    gap: $base-space * 4;
    padding: $base-space * 3;
    overflow: auto;
    scroll-behavior: smooth;
  }
  &.--edited-form {
    border-color: palette(brown);
  }
}

.footer-form {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: $base-space * 2 $base-space * 3;
  border-top: 1px solid $black-10;
  &__left-area {
    display: inline-flex;
  }
  &__right-area {
    display: inline-flex;
    gap: $base-space * 2;
  }
}
</style>
