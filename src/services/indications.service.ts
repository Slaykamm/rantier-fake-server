import { AppDataSource } from "../database/data-source";
import { Indications } from "../entity/indications.entity";

const indicationsRepository = AppDataSource.getRepository(Indications);

//

export const getIndications = async () => {
  const respData = await indicationsRepository.find({
    relations: ["counters", "counters.counterType"],
  });
  return respData;
};

export const getIndicationsById = async (id: number) => {
  return await indicationsRepository.find({
    where: { id },
    relations: ["counters", "counters.counterType"],
  });
};

export const postIndicationsByCounterId = async (counterId: number) => {
  const indicationsData = await indicationsRepository.find({
    where: { counterId },
  });
  if (indicationsData?.length) {
    const orderedFilteredIndications = indicationsData.sort(
      // @ts-ignore
      (a, b) => new Date(b.createAt) - new Date(a.createAt)
    );

    const twoLatestIndications = [
      orderedFilteredIndications?.[0],
      orderedFilteredIndications?.[1],
    ];

    const filteredTwoLatestIndications = twoLatestIndications.filter(
      (item) => !!item
    );

    return filteredTwoLatestIndications;
  }
};
