import { AppDataSource } from "../database/data-source";
import { Counter } from "../entity/counter.entity";
import { CounterType } from "../entity/counterType.entity";
import { Request, Response } from "express";

const counterRepository = AppDataSource.getRepository(Counter);
// .find({relations: ['counterType']});

export const getCountersService = async (req: Request, res: Response) => {
  //   const respData = await counterRepository
  //     .createQueryBuilder("counter")
  //     .leftJoinAndSelect("counter.counterType", "counterType")
  //     .getMany();

  const respData = await counterRepository.find({ relations: ["counterType"] });
  res.send(respData);
};

export const getCounterById = async (id: number) => {
  return counterRepository.findOneBy({ id });
};

export const getCountersByPropertyId = async (propertyId: number) => {
  return counterRepository.findBy({ propertyId });
};
