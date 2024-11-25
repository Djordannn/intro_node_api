import express, { Request, Response, Application } from "express";
import fs from "fs";

const port = 2550;
const app: Application = express();

app.use(express.json());

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

app.post("/user", (req: Request, res: Response) => {
  // akses data db.json
  const data = JSON.parse(fs.readFileSync("./db.json").toString());
  // generate id baru dengan mengambil data terakhir dan menambahkan id
  const newId = data.user[data.user.length - 1].id + 1;
  // add data baru
  data.user.push({ id: newId, ...req.body });
  // rewrite data db.json
  fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
  res.status(201).send({
    message: "Success add data",
    isSuccess: true,
  });
  res.end();
});

app.delete("/user/:id", (req: Request, res: Response) => {
  const data = JSON.parse(fs.readFileSync("./db.json").toString());
  // get params id to integer
  const deleteId = parseInt(req.params.id);
  // filter data from id
  const newData = data.user.filter((user: any) => user.id !== deleteId);
  // rewrite data if delete data success
  if (newData.length !== data.user.length) {
    fs.writeFileSync(
      "./db.json",
      JSON.stringify({ user: newData, product: data.product }, null, 2)
    );
    res.status(200).send({
      message: "Delete Success",
      isSuccess: true,
    });
  } else {
    res.status(404).send({
      message: "Data not found",
      isSuccess: true,
    });
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
