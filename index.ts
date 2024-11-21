import { log } from "console";
import express, { Request, Response } from "express";
import fs from "fs";

const port = 2440;
const app = express();

// controller
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!");
  res.end();
});

app.get("/user", (req: Request, res: Response) => {
  // read file db.json
  const dataUser = JSON.parse(fs.readFileSync("./db.json").toString());

  if (req.url.includes("?")) {
    const urlQuery = req.url.split("?")[1].split("&");
    const newData = dataUser.user.filter((val: any, index: number) => {
      let result = true;
      for (let i = 0; i < urlQuery.length; i++) {
        const [key, value] = urlQuery[i].split("=");
        if (val[key] != value) {
          result = false;
          break;
        }
      }
      return result;
    });
    res.send(JSON.stringify(newData));
    res.end();
  }
});

app.get("/product", (req: Request, res: Response) => {
  res.send("Data Product!!");
  res.end();
});

// server
app.listen(port, () => {
  console.log("Port listen in port : ", port);
});
