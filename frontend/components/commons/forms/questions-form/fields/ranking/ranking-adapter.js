import { isNil } from "lodash";

export const adaptQuestionsToSlots = ({ options }) => {
  // Adjustments: From 21/08/2023 the number of slots is fixed to 5 instead of following the number of options
  const slots = Array.from({ length: 5 }, (_, index) => {
    const id = index + 1;
    const items = options.filter((option) => option.rank == id);

    return {
      rank: id,
      items,
    };
  });

  const questions = options.filter((o) => isNil(o.rank));

  const getRanking = (option) => {
    return slots.find((slot) =>
      slot.items.some((item) => item.value === option.value)
    )?.rank;
  };

  return {
    slots,
    questions,
    getRanking,
  };
};
