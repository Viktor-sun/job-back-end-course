import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { DataSource } from "typeorm";

const app = express();
app.use(express.json());
app.use(
  cors({
    // origin: ["https://www.section.io", "https://www.google.com"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  })
);
app.use(helmet());

// connect mongo test
const db = mongoose.connect("mongodb://root:example@mongodb:27017");
db.then(() => {
  console.log(`Mongo is here`);
}).catch((e) => {
  console.log(`Error: ${e.message}`);
});

// connect postgres test
export const myDataSource = new DataSource({
  type: "postgres",
  host: "postgresdb",
  port: 5432,
  username: "postgres",
  password: "example",
  database: "mydb",
});

myDataSource
  .initialize()
  .then(() => {
    console.log("Postgres is here");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// app
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});

type PhoneNumberType = {
  id: string;
  number: string;
  name: string;
};

let phoneNumbers: PhoneNumberType[] = [
  { id: "1", number: "+380505559988", name: "Bob" },
];

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Running Node with Express and Typescript",
  });
});

app.get("/phone-numbers", (req, res, next) => {
  res.status(200).json(phoneNumbers);
});

app.get("/phone-numbers/:numberId", (req, res, next) => {
  try {
    const foundNumber = phoneNumbers.find(
      (number) => req.params.numberId === number.id
    );

    if (foundNumber) {
      res.status(200).json(foundNumber);

      return;
    }

    throw new Error("Number not found");
  } catch (error) {
    next(error);
  }
});

app.post("/phone-numbers", (req, res, next) => {
  try {
    if (req.body.hasOwnProperty("number") && req.body.hasOwnProperty("name")) {
      const newItem = { id: String(Date.now()), ...req.body };
      phoneNumbers.push(newItem);
      res.status(201).json(phoneNumbers);

      return;
    }

    throw new Error(
      "Bad request. You have to send an object with the number and name fields"
    );
  } catch (error) {
    next(error);
  }
});

app.delete("/phone-numbers/:numberId", (req, res, next) => {
  try {
    const foundNumber = phoneNumbers.find(
      (number) => req.params.numberId === number.id
    );

    if (foundNumber) {
      const newItems = phoneNumbers.filter(
        (number) => number.id !== req.params.numberId
      );
      phoneNumbers = newItems;
      res.status(204).json({});

      return;
    }

    throw new Error("Number not found");
  } catch (error) {
    next(error);
  }
});

app.patch("/phone-numbers/:numberId", (req, res, next) => {
  try {
    const foundNumber = phoneNumbers.find(
      (number) => req.params.numberId === number.id
    );

    if (
      foundNumber &&
      (req.body.hasOwnProperty("number") || req.body.hasOwnProperty("name"))
    ) {
      const updatedItems = phoneNumbers.map((number) => {
        if (number.id === req.params.numberId) {
          return {
            ...number,
            ...req.body,
          };
        }
        return number;
      });
      phoneNumbers = updatedItems;
      res.status(200).json(phoneNumbers);

      return;
    }

    throw new Error(
      "Bad request. You have to send an object with a number or name field. Or number not found"
    );
  } catch (error) {
    next(error);
  }
});

app.put("/phone-numbers/:numberId", (req, res, next) => {
  try {
    const foundNumber = phoneNumbers.find(
      (number) => req.params.numberId === number.id
    );

    if (
      foundNumber &&
      req.body.hasOwnProperty("number") &&
      req.body.hasOwnProperty("name")
    ) {
      const updatedItems = phoneNumbers.map((number) => {
        if (number.id === req.params.numberId) {
          return {
            ...number,
            ...req.body,
          };
        }
        return number;
      });
      phoneNumbers = updatedItems;
      res.status(200).json(phoneNumbers);

      return;
    }

    throw new Error(
      "Bad request. You have to send an object with a number or name field. Or number not found"
    );
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  res.status(404).send("Not found");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message);
  res.status(400).send(err.message);
});
