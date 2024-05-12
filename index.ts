import { Bot } from "grammy";
import { I18n } from "@grammyjs/i18n";
import { array2keyboard, randomArray, keyboard2array } from "./src/helpers";
import { COLORS, TOKEN } from "./src/consts";
import type { MyContext } from "./src/types";

const bot = new Bot<MyContext>(TOKEN);

const i18n = new I18n<MyContext>({
  defaultLocale: "en",
  directory: "locales",
});

bot.use(i18n);

bot.command("start", async (ctx) => {
  await ctx.reply(ctx.t("how-play"), {
    reply_markup: {
      inline_keyboard: array2keyboard(ctx, randomArray()),
    },
  });
});

bot.callbackQuery(/./, async (ctx) => {
  const { callback_query } = ctx.update;
  const selectedColor = callback_query.data;

  if (!COLORS.includes(selectedColor)) {
    await ctx.answerCallbackQuery({
      text: ctx.t("alert-press-to-score"),
    });

    return;
  }

  if (!callback_query.message || !callback_query.message.reply_markup) {
    return;
  }

  const {
    message: {
      reply_markup: { inline_keyboard },
    },
  } = callback_query;

  const currentColor = inline_keyboard[0][0].text;

  if (currentColor === selectedColor) {
    await ctx.answerCallbackQuery({
      text: ctx.t("alert-press-to-current-color"),
    });

    return;
  }

  const scoreRow = inline_keyboard.pop();

  if (!scoreRow || !scoreRow.length) {
    return;
  }

  const [{ callback_data: prevScore }] = scoreRow;

  const array = keyboard2array(inline_keyboard);

  const queue = [[0, 0]];

  while (queue.length > 0) {
    const currentCell = queue.pop();

    if (!currentCell) {
      break;
    }

    const [x, y] = currentCell;

    array[x][y] = selectedColor;

    if (x > 0 && array[x - 1][y] === currentColor) {
      queue.push([x - 1, y]);
    }

    if (x < array[0].length - 1 && array[x + 1][y] === currentColor) {
      queue.push([x + 1, y]);
    }

    if (y > 0 && array[x][y - 1] === currentColor) {
      queue.push([x, y - 1]);
    }

    if (y < array.length - 1 && array[x][y + 1] === currentColor) {
      queue.push([x, y + 1]);
    }
  }

  const isEndGame =
    array.flat().findIndex((value) => value !== selectedColor) === -1;

  const score = parseInt(prevScore) + 1;

  if (isEndGame) {
    await ctx.editMessageText(ctx.t("flood-in-score", { score }));
    await ctx.answerCallbackQuery({
      text: ctx.t("flood-in"),
    });
  } else {
    await ctx.answerCallbackQuery({ show_alert: false });
  }

  await ctx.editMessageReplyMarkup({
    reply_markup: {
      inline_keyboard: array2keyboard(ctx, array, score),
    },
  });
});

bot.start();
