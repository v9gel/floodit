import { InlineKeyboard } from "grammy";
import type { InlineKeyboardButton } from "grammy/types";
import { COLORS, HEIGHT, WIDTH } from "./consts";

const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};
export const randomArray = (width = WIDTH, height = HEIGHT) => {
  const array: string[][] = [];
  for (let h = 0; h < height; h++) {
    const row: string[] = [];

    for (let w = 0; w < width; w++) {
      row.push(getRandomColor());
    }

    array.push(row);
  }

  return array;
};
export const keyboard2array = (keyboard: InlineKeyboardButton[][]) => {
  return keyboard.map((row) => row.map((button) => button.text));
};
export const array2keyboard = (
  array: string[][] = randomArray(),
  score = 0
) => {
  const keyboard = array.map((row) =>
    row.map((color) => InlineKeyboard.text(color))
  );

  keyboard.push([InlineKeyboard.text(`Score: ${score}`, score.toString())]);

  return keyboard;
};
