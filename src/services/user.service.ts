import { AppDataSource } from "../database/data-source";
import { User } from "../entity/user.entity";
import { IUpdateUserDto } from "../models/user.model";
import { getTgUsername } from "../utils/untils";

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

export const updateUserDataAction = async (props: IUpdateUserDto) => {
  const { tgId, userId, firstName, lastName, tgUsername } = props;
  try {
    if (!userId) {
      return {
        success: false,
        message: "userId absent!",
      };
    }

    const result = await AppDataSource.transaction(
      async (transactionalManager) => {
        const usersRepository = transactionalManager.getRepository(User);
        const oldUserData = await userRepository.findOneBy({ userId });

        const updateData = {
          tgId,
          // avatar,
          firstName,
          lastName,
          tgNickname: getTgUsername(tgUsername),
        };

        const dataToSave = { ...oldUserData, ...updateData };

        console.log("test props3", oldUserData);
        console.log("test props2", dataToSave);
        await usersRepository.save(dataToSave);

        return { success: true };
      }
    );

    return {
      success: true,
      message: "Userdata updated successfully",
    };
  } catch (e) {
    return {
      success: false,
      message: `Error while update userData`,
    };
  }
};
