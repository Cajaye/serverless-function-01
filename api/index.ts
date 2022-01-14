import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another option
  // res.setHeader('Access-Control-Allow-Origin', req.header.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return await fn(req, res);
};

try {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} catch (error) {
  console.error(error);
  process.exit(1);
}

const MY_EMAIL_ADDRESS = process.env.TO_EMAIL;

async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method === "POST" && !request.body) {
    return response
      .status(404)
      .json({ msg: "Please fill in all input fields" });
  } else {
    response
      .status(200)
      .send(`<h1 style="text-align:center;">Hello aliens🚀</h1>`);
  }

  if (request.method === "POST") {
    try {
      const { email, name, body } = request.body;
      const msg = {
        to: MY_EMAIL_ADDRESS,
        from: email,
        subject: `It's time to do business`,
        text: `${body} from ${name},${email}`,
        html: `${body} from ${name},${email}`,
      };
      await sgMail.send(msg);
      return response.status(200).json({ msg: "Email sent" });
    } catch (error) {
      console.log("ERROR", error);
      response.status(400).send("Email not sent.");
    }
  }
}

export = allowCors(handler);
