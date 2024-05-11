import { Bot } from "grammy";
import { array2keyboard, randomArray, keyboard2array } from "./helpers";
import { COLORS, TOKEN } from "./consts";

const bot = new Bot(TOKEN);

bot.command("start", async (ctx) => {
  await ctx.reply("Click cells, flood the board with a single color", {
    reply_markup: {
      inline_keyboard: array2keyboard(randomArray()),
    },
  });
});

bot.callbackQuery(/./, async (ctx) => {
  const { callback_query } = ctx.update;

  const selectedColor = callback_query.data;

  if (!COLORS.includes(selectedColor)) {
    await ctx.answerCallbackQuery({
      text: "Please click on the cells with the color",
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
      text: "This color has already been selected",
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
    await ctx.editMessageText(`Flood in ${score} steps!`);
    await ctx.answerCallbackQuery({
      text: "That's it, you've flooded in the entire field",
    });
  } else {
    await ctx.answerCallbackQuery({ show_alert: false });
  }

  await ctx.editMessageReplyMarkup({
    reply_markup: {
      inline_keyboard: array2keyboard(array, score),
    },
  });
});

bot.start();
