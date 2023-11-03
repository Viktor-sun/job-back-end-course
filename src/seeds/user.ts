import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { User } from "../model/postgresql/User.js";
import { Message } from "../model/postgresql/Message.js";

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    // const repository = dataSource.getRepository(User);
    // await repository.insert([
    //   {
    //     name: "Caleb",
    //     lastName: "Barrows",
    //     email: "caleb.barrows@gmail.com",
    //   },
    // ]);

    // ---------------------------------------------------

    // const userFactory = factoryManager.get(User);
    // save 1 factory generated entity, to the database
    // await userFactory.save();
    // save 5 factory generated entities, to the database
    // await userFactory.saveMany(5);

    // with one-to-many ---------------------------------------------------

    const userRepository = dataSource.getRepository(User);
    const messageRepository = dataSource.getRepository(Message);

    userRepository.query('TRUNCATE TABLE "user" CASCADE;');
    messageRepository.query("TRUNCATE TABLE message");

    const userFactory = factoryManager.get(User);
    const massagesFactory = factoryManager.get(Message);

    const users = await userFactory.saveMany(20);

    const messages = await Promise.all(
      Array(20)
        .fill("")
        .map(async () => {
          const made = await massagesFactory.make({
            user: faker.helpers.arrayElement(users),
          });
          return made;
        })
    );
    await messageRepository.save(messages);
  }
}
