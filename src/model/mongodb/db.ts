import mongoose from "mongoose";
// connect mongo test
const db = mongoose.connect("mongodb://root:example@mongodb:27017");
db.then(() => {
  console.log(`Mongo is here`);
}).catch((e) => {
  console.log(`Error: ${e.message}`);
});
