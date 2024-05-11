import "dotenv/config";

export const COLORS = ["🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "⬛️", "⬜️"];

export const WIDTH = 8;
export const HEIGHT = 8;

if (!process.env.TOKEN) {
  throw new Error("TOKEN is not set for the bot");
}

export const TOKEN = process.env.TOKEN;
