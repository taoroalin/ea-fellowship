import { createLettuceMeet, createDayOfWeekLettuceMeet } from "./lettucemeet.mjs"
import * as nodemailer from "nodemailer"
import * as db from "./db.mjs"

const emailEx = () => {
  let transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "username",
      pass: "password"
    }
  })
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
}

const startup = async () => {
  console.log("hi")
  const client = await db.connect()
  await db.setupDB(client)
  client.end()
}

startup()