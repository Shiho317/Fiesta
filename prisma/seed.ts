/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Chance from "chance";

import { prisma } from "~/server/db";
import { generateJWT } from "~/utils/server";
import { cardClassy, cardElegant, cardSimple } from "./helper";

const chance = new Chance();

const seed = async () => {
  //Delete all records before seeding
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.cardTemplate.deleteMany({});
  await prisma.emailTemplate.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.guest.deleteMany({});
  await prisma.invitation.deleteMany({});
  await prisma.planner.deleteMany({});
  await prisma.venue.deleteMany({});

  //create Admin user
  console.log("Creating admin...");
  const password = "admin";
  const token = generateJWT({ password });
  const user = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@fiesta.com",
      password: token,
      emailVerified: new Date(),
    },
  });
  console.log(`Created admin user.`);

  // create 5 venues
  console.log("Creating venues...");
  let totalVenue = 0;
  for (let i = 0; i < 5; i++) {
    const venue = await prisma.venue.create({
      data: {
        name: chance.company(),
        country: chance.country(),
        state_province: chance.pickone([chance.state(), chance.province()]),
        city: chance.city(),
        address: chance.address(),
        zipcode: chance.pickone([
          chance.zip(),
          chance.postal(),
          chance.postcode(),
        ]),
        registeredBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    console.info(`Created venue ${venue.name}`);
    totalVenue++;
  }
  console.info(`Created ${totalVenue} venues`);

  // Create 5 planners
  console.log("Creating planners...");
  let totalPlanner = 0;
  for (let i = 0; i < 5; i++) {
    const planner = await prisma.planner.create({
      data: {
        name: chance.name(),
        email: chance.email(),
        phone: chance.phone(),
        organization: chance.company(),
        client: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    console.info(`Created planner ${planner.name}`);
    totalPlanner++;
  }
  console.info(`Created ${totalPlanner} planner.`);

  //Create invitation card templates
  console.log("Creating invitation card...");
  const elegant = await prisma.cardTemplate.create({
    data: cardElegant,
  });
  console.log(`Created card ${elegant.name}`);

  const simple = await prisma.cardTemplate.create({
    data: cardSimple,
  });
  console.log(`Created card ${simple.name}`);

  const classy = await prisma.cardTemplate.create({
    data: cardClassy,
  });
  console.log(`Created card ${classy.name}`);

  //TODO: Create email templates
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  });
