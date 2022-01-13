import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";
try {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} catch (error) {
  console.error(error);
  process.exit(1);
}

const MY_EMAIL_ADDRESS = process.env.TO_EMAIL;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (!request.body) {
    return response
      .status(404)
      .json({ msg: "Please fill in all input fields" });
  }
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
