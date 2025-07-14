import { PrismaClient } from '@prisma/client';
import * as countriesData from './data/countries.json';

export async function seedCountryStateLga(prisma: PrismaClient) {
  console.log('Seeding countries, states, and LGAs...');

  for (const countryData of countriesData) {
    await prisma.$transaction(async tx => {
      const country = await tx.country.upsert({
        where: { name: countryData.name },
        update: {},
        create: {
          name: countryData.name,
          code2: countryData.code2,
          code3: countryData.code3,
          capital: countryData.capital,
          region: countryData.region,
          subregion: countryData.subregion,
        },
      });

      for (const stateData of countryData.states) {
        const state = await tx.state.upsert({
          where: { name_countryId: { name: stateData.name, countryId: country.id } },
          update: {},
          create: {
            name: stateData.name,
            countryId: country.id,
          },
        });

        if (stateData.subdivision && Array.isArray(stateData.subdivision)) {
          for (const lgaName of stateData.subdivision) {
            await tx.lga.upsert({
              where: { name_stateId: { name: lgaName, stateId: state.id } },
              update: {},
              create: {
                name: lgaName,
                stateId: state.id,
              },
            });
          }
        }
      }
    });
  }

  console.log('Countries, states, and LGAs seeding completed.');
}
