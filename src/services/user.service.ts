import { AppDataSource } from "../database/data-source";
import { User } from "../entity/user.entity";

const userRepository = AppDataSource.getRepository(User);

export const getUserByUserId = async (userId: string) => {
  const respData = await userRepository.findOneBy({ userId });
  return respData;
};

export const createUserByUserId = async (userId: string) => {
  try {
    const presentUser = await userRepository.findOneBy({ userId });
    if (!!presentUser) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(presentUser)),
      };
    }

    let newUser;

    await AppDataSource.manager.transaction(async (transactionUserManager) => {
      const userRepository = transactionUserManager.getRepository(User);
      newUser = userRepository.create({
        userId,
        email: userId,
      });

      await userRepository.save(newUser);
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newUser)),
    };
  } catch (e) {
    // console.log("TEST e", e);
    return {
      success: false,
      message: `Error while creating user ${e}`,
    };
  }
};
