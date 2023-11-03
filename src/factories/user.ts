import { setSeederFactory } from "typeorm-extension";
import { User } from "../model/postgresql/User.js";

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.name = faker.person.firstName("male");
  user.lastName = faker.person.lastName("male");
  user.email = faker.internet.exampleEmail({
    firstName: user.name,
    lastName: user.lastName,
    allowSpecialCharacters: true,
  });
  user.subscription = faker.datatype.boolean(0.9);
  user.isAdmin = faker.datatype.boolean();
  user.rating = faker.number.int({ min: 0, max: 10 });
  user.createDate = faker.date.anytime();

  return user;
});
