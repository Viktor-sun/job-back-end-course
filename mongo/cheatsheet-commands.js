// draft

// use my_mongo_db

db.testCollection.insertOne({
  name: "bhim",
  age: 22,
  email: "tewst@gmail.com",
});

db.testCollection.find().pretty();

db.testCollection.update({ age: 22 }, { $set: { age: 24 } });

db.testCollection.insertMany([
  {
    name: "navindu",
    age: 22,
    email: "nav@gmail.com",
  },
  {
    name: "kovid",
    age: 27,
    email: "kovig@gmail.com",
  },
  {
    name: "john doe",
    age: 25,
    city: "Hyderabad",
  },
]);

// remove property from single document
db.testCollection.update({ name: "navindu" }, { $unset: { age: "" } });

// remove document
db.testCollection.remove({ name: "navindu" });

db.testCollection.find().limit(2);

db.testCollection.find().sort({ name: 1 });

db.testCollection.insertOne({
  name: "zxcqwe",
  age: 22,
  email: "tewst@gmail.com",
  city: "Colombo",
});

db.testCollection.update({ name: "zxcqwe" }, { $set: { age: 23 } });

db.testCollection.find({ $and: [{ age: { $lt: 25 } }, { city: "Colombo" }] });

db.testCollection.drop();

// HW
// ========================================================================

db.createCollection("customers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age", "city", "orders"],
      properties: {
        name: {
          bsonType: "string",
          description: "Name is a required field",
        },
        age: {
          bsonType: "number",
          description: "Age is a required field",
        },
        city: {
          bsonType: "string",
          description: "City is a required field",
        },
        orders: {
          bsonType: ["array"],
          uniqueItems: true,
          items: {
            bsonType: "number",
          },
          description: "Orders is a required field",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

db.customers.insertMany([
  {
    name: "John",
    age: 28,
    city: "Kharkiv",
    orders: [3],
  },
  {
    name: "Mark",
    age: 25,
    city: "Kharkiv",
    orders: [1, 2],
  },
  {
    name: "Bob",
    age: 30,
    city: "Odessa",
    orders: [4, 5],
  },
  {
    name: "Bill",
    age: 21,
    city: "Odessa",
    orders: [6],
  },
]);

db.orders.insertMany([
  {
    _id: 1,
    date: new Date("03-02-2011"),
    productIds: [11, 12],
  },
  {
    _id: 2,
    date: new Date("05-03-2011"),
    productIds: [12, 13, 14],
  },
  {
    _id: 3,
    date: new Date("07-04-2012"),
    productIds: [11, 13],
  },
  {
    _id: 4,
    date: new Date("08-05-2012"),
    productIds: [12, 14, 15],
  },
  {
    _id: 5,
    date: new Date("03-06-2012"),
    productIds: [10, 11, 12],
  },
  {
    _id: 6,
    date: new Date("12-08-2014"),
    productIds: [14],
  },
]);

db.products.insertMany([
  {
    _id: 10,
    name: "A book",
    author: ["John Smith"],
    product_type: "book",
    price: 119,
  },
  {
    _id: 11,
    name: "LG TV",
    brand: "LG",
    product_type: "appliance",
    price: 2119,
  },
  {
    _id: 12,
    name: "Another book",
    author: ["Sarah King", "Kelly M"],
    product_type: "book",
    price: 122,
  },
  {
    _id: 13,
    name: "iPhone14",
    author: "Apple",
    product_type: "appliance",
    price: 56111,
  },
  {
    _id: 14,
    name: "Washing Machine",
    brand: "Bosch",
    product_type: "appliance",
    price: 12234,
  },
  {
    _id: 15,
    name: "Fridge",
    brand: "Beko",
    product_type: "appliance",
    price: 1199,
  },
]);

// one to many
db.customers.aggregate({
  $lookup: {
    from: "orders",
    localField: "orders",
    foreignField: "_id",
    as: "orders_from_collection",
  },
});

// many to many
db.orders.aggregate({
  $lookup: {
    from: "products",
    localField: "productIds",
    foreignField: "_id",
    as: "products_from_collection",
  },
});

// aggregation ===========================================================

// get customers with two orders
db.customers.aggregate({ $match: { orders: { $size: 2 } } }).pretty();
db.customers.find({ orders: { $size: 2 } }).pretty();

db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "orders",
      foreignField: "_id",
      as: "orders_from_collection",
    },
  },
  { $match: { orders: { $size: 2 } } },
  { $sort: { name: 1 } },
]);

// get customers where age < 26
db.customers.aggregate([
  { $match: { age: { $lt: 26 } } }, // $gt
  {
    $lookup: {
      from: "orders",
      localField: "orders",
      foreignField: "_id",
      as: "orders_from_collection",
    },
  },
  { $sort: { name: 1 } },
]);

db.customers.aggregate({ $count: "allDocumentCount" });

// group and sum by grouped
db.customers.aggregate({ $group: { _id: "$city", total_docs: { $sum: 1 } } });

db.products.aggregate([
  { $match: { price: { $lt: 200 } } },
  { $group: { _id: "$product_type", total_docs: { $sum: 1 } } },
]);

// how many field "author" we have in the collection
db.products.aggregate([
  { $match: { author: { $exists: true } } },
  { $group: { _id: "$author" } },
  { $count: "author" },
]);

// get just name and city fields
db.customers.aggregate([{ $project: { name: 1, city: 1 } }]);

// get all fields except name and city ones
db.customers.aggregate([{ $project: { name: 0, city: 0 } }]);

// get my custom documents
db.customers.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      info: {
        any_name_for_age: "$age",
        any_name_for_city: "$city",
      },
    },
  },
]);

db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "orders",
      foreignField: "_id",
      as: "orders_from_collection",
    },
  },

  {
    $project: {
      _id: 0,
      name: 1,
      info: {
        any_name_for_age: "$age",
        any_name_for_city: "$city",
        any_name_for_orders_from_collection: "$orders_from_collection",
      },
    },
  },
]);

// get the first two documents
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productIds",
      foreignField: "_id",
      as: "products_from_collection",
    },
  },
  { $limit: 2 },
]);

// unwind
db.orders.aggregate([{ $unwind: "$productIds" }]);

// unwind field from lookup (another collection)
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productIds",
      foreignField: "_id",
      as: "products_from_collection",
    },
  },
  { $unwind: "$products_from_collection" },
  {
    $project: {
      _id: 1,
      date: 1, // from orders
      product_name: "$products_from_collection.name", // from products
      product_type: "$products_from_collection.product_type", // from products
    },
  },
]);

// how many repeating products we have or how many times each product has been ordered
db.orders.aggregate([
  { $unwind: "$productIds" },
  { $group: { _id: "$productIds", count: { $sum: 1 } } },
]);

// avg age from every city
db.customers.aggregate({ $group: { _id: "$city", avgAge: { $avg: "$age" } } });
// max age from every city
db.customers.aggregate({ $group: { _id: "$city", avgAge: { $max: "$age" } } });
// min age from every city
db.customers.aggregate({ $group: { _id: "$city", avgAge: { $min: "$age" } } });

// unary operators
db.customers.find({
  $and: [{ orders: { $size: 1 } }, { city: "Kharkiv" }],
});

db.customers.find({
  $and: [{ age: { $gt: 17 } }, { age: { $lt: 25 } }],
});

db.customers.find({
  $or: [{ age: 21 }, { age: 25 }],
});

db.customers.find({
  $where: "this.orders.length > 1",
});

db.customers.aggregate({
  $project: {
    name: 1,
    nameType: { $type: "$name" },
    ageType: { $type: "$age" },
    cityType: { $type: "$city" },
    ordersType: { $type: "$orders" },
  },
});

// out
db.customers.aggregate([
  { $project: { name: 1, city: 1 } },
  { $out: "outCollection" },
]);

// pagination ==================================================
// db.products.find().skip(3).limit(3);

// pg 1
db.products.aggregate([
  {
    $project: {
      name: 1,
      nameType: { $type: "$name" },
      priceType: { $type: "$price" },
    },
  },
  { $skip: 0 },
  { $limit: 2 },
]);

// pg 2
db.products.aggregate([
  {
    $project: {
      name: 1,
      nameType: { $type: "$name" },
      priceType: { $type: "$price" },
    },
  },
  { $skip: 2 },
  { $limit: 2 },
]);

// pg 3
db.products.aggregate([
  {
    $project: {
      name: 1,
      nameType: { $type: "$name" },
      priceType: { $type: "$price" },
    },
  },
  { $skip: 4 },
  { $limit: 2 },
]);
