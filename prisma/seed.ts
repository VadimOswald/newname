import { PrismaClient, QuoteType } from '../src/generated/prisma';
import { compliments } from '../src/data/compliments';
import { insults } from '../src/data/insults';

const prisma = new PrismaClient();

async function main() {
  const payload = [
    ...compliments.map((text) => ({ text, type: QuoteType.compliment })),
    ...insults.map((text) => ({ text, type: QuoteType.insult })),
  ];

  for (const item of payload) {
    await prisma.quote.upsert({
      where: { id: `${item.type}:${item.text}`.slice(0, 191) },
      update: {},
      create: {
        id: `${item.type}:${item.text}`.slice(0, 191),
        text: item.text,
        type: item.type,
      },
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
