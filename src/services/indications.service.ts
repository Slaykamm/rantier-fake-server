import { AppDataSource } from "../database/data-source";
import { Indications } from "../entity/indications.entity";
import { IndicationCreateDto } from "../models/indications.model";

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

export const createIndication = async (request: IndicationCreateDto) => {
  try {
    const today = new Date();
    // today.setHours(0, 0, 0, 0); // Обнуляем часы, минуты, секунды, миллисекунды

    const newIndication = indicationsRepository.create({
      createAt: today.toISOString(), //.split("T")[0],
      counterId: request.id,
      value: request.value,
    });
    await indicationsRepository.save(newIndication);
    return { success: true, data: [newIndication] };
  } catch (e) {
    if (e instanceof Error) return { success: false, message: e.message };
  }
};
