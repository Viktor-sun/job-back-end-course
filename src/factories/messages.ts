import { setSeederFactory } from "typeorm-extension";
import { Message } from "../model/postgresql/Message.js";

export default setSeederFactory(Message, (faker) => {
  const message = new Message();
  message.text = faker.lorem.text();
  message.createDate = faker.date.anytime();

  return message;
});
