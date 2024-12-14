import { prisma } from "../lib/prisma";
import adjectives from "./adjectives.json";
import nouns from "./nouns.json";

export async function generateUniqueUsername(): Promise<string> {
  let unique = false;
  let username = "";

  while (!unique) {
    const randomAdjective =
      adjectives.adjectives[Math.floor(Math.random() * adjectives.adjectives.length)];
    const randomNoun = nouns.nouns[Math.floor(Math.random() * nouns.nouns.length)];
    username = `${randomAdjective}${randomNoun}`;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    unique = !existingUser;
  }

  return username;
}
