import { config } from "dotenv";

config();

import app from "..";
import mongoConnect from "../config/mongo";

(async function () {
  try {
    const port = process.env.PORT ?? 3200;
    await mongoConnect();
    console.log("connect to mongodb");
    app.listen(port, () => console.log(`app listening on port ${port}`));
  } catch (err) {
    console.log(err);
    //send email
    throw err;
  }
})();
