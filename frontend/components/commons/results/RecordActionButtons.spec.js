import { shallowMount } from "@vue/test-utils";
import RecordActionButtons from "./RecordActionButtons";
import BaseButton from "@/components/base/BaseButton";

let wrapper = null;
const options = {
  stubs: {
    "base-button": BaseButton,
  },
  mocks: {
    $auth: {
      user: {
        id: "recognai",
        show_discard_button: true,
      },
    },
  },
  propsData: {
    actions: [
      {
        id: "validate",
        name: "Validate",
        allow: true,
        active: true,
        show: true,
      },
      {
        id: "discard",
        name: "Discard",
        allow: true,
        active: true,
        show: false,
      },
      {
        id: "clear",
        name: "Clear",
        allow: false,
        active: false,
        show: true,
      },
    ],
  },
};
beforeEach(() => {
  wrapper = shallowMount(RecordActionButtons, options);
});

afterEach(() => {
  wrapper && wrapper.destroy();
});

describe("RecordActionButtonsComponent", () => {
  it("render the component", () => {
    expect(wrapper.is(RecordActionButtons)).toBe(true);
  });
  it("expect to show validate button active", async () => {
    testIfButtonIsDisabled("validate", undefined);
  });

  it("expect to show discard button active", async () => {
    const discardButton = wrapper.find(`.record__actions-button--discard`);
    if (discardButton.exists()) {
      testIfButtonIsDisabled("discard", undefined);
    }
  });

  it("expect to hide buttons when show = false", async () => {
    const newOptions = {
      ...options,
      ...{
        propsData: {
          actions: [
            {
              id: "validate",
              name: "Validate",
              allow: true,
              active: true,
              show: false,
            },
            {
              id: "discard",
              name: "Discard",
              allow: true,
              active: true,
              show: false,
            },
            {
              id: "clear",
              name: "Clear",
              allow: false,
              active: false,
              show: false,
            },
          ],
        },
      },
    };
    wrapper = shallowMount(RecordActionButtons, newOptions);
    const buttons = ["validate", "discard", "clear"];
    buttons.forEach((button) => {
      const actionButton = wrapper.find(`.record__actions-button--${button}`);
      expect(actionButton.exists()).toBe(false);
    });
  });

  it("expect to emit validate on click validate button", async () => {
    testIfEmittedIsCorrect("validate");
  });

  it("expect to emit discard on click discard button", async () => {
    const discardButton = wrapper.find(`.record__actions-button--discard`);
    if (discardButton.exists()) {
      testIfEmittedIsCorrect("discard");
    }
  });

  it("expect not to render clear button", async () => {
    const clearButton = wrapper.find(`.record__actions-button--clear`);
    expect(clearButton.exists()).toBe(false);
  });
});

const testIfButtonIsDisabled = async (button, disabled) => {
  const actionButton = wrapper.find(`.record__actions-button--${button}`);
  expect(actionButton.attributes().disabled).toBe(disabled);
};

const testIfEmittedIsCorrect = async (button) => {
  wrapper.find(`.record__actions-button--${button}`).vm.$emit("click");
  expect(wrapper.emitted()).toHaveProperty(button);
};
