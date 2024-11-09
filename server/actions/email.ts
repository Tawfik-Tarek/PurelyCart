"use server";
import getBaseUrl from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseUrl();
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "tawfik@purelycart.store",
    to: email,
    subject: "Please, Confirm your email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <main>
            <h1 style="color: #444;">Confirm Your Email Address</h1>
            <p>Hi there,</p>
            <p>Thank you for signing up with purelycart! Please confirm your email address by clicking the link below:</p>
            <p style="text-align: center;">
              <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Confirm Email</a>
            </p>
            <p>If the button above does not work, copy and paste the following link into your web browser:</p>
            <p><a href="${confirmLink}" style="color: #007bff;">${confirmLink}</a></p>
            <p>If you did not sign up for this account, you can ignore this email.</p>
            <p>Best regards,<br/>The purelycart Team</p>
          </main>
          <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; margin-top: 20px;">
            <p style="font-size: 12px; color: #888;">purelycart Inc, 123 purelycart St, purelycart City, AC 12345</p>
          </footer>
        </div>
      </div>
    `,
  });

  if (error) {
    console.log(error);
    return;
  }
  return data;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "tawfik@purelycart.store",
    to: email,
    subject: "Please, Confirm your Request for reseting password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <main>
            <h1 style="color: #444;">Reset Your Password</h1>
            <p>Hi there,</p>
            <p>Thank you for signing up with purelycart! Please Reset Your Password by clicking the link below:</p>
            <p style="text-align: center;">
              <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Reset Your Password</a>
            </p>
            <p>If the button above does not work, copy and paste the following link into your web browser:</p>
            <p><a href="${confirmLink}" style="color: #007bff;">${confirmLink}</a></p>
            <p>If you did not sign up for this account, you can ignore this email.</p>
            <p>Best regards,<br/>The purelycart Team</p>
          </main>
          <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; margin-top: 20px;">
            <p style="font-size: 12px; color: #888;">purelycart Inc, 123 purelycart St, purelycart City, AC 12345</p>
          </footer>
        </div>
      </div>
    `,
  });

  if (error) {
    console.log(error);
    return;
  }
  return data;
};

export const sendTwoFactorTokenByEmail = async (  email: string,token: string) => {
  const { data, error } = await resend.emails.send({
    from: "tawfik@purelycart.store",
    to: email,
    subject: "PurelyCart - Your 2 Factor Token",
    html: `<p>Your Confirmation Code: ${token}</p>`,
  });
  if (error) return console.log(error);
  if (data) return data;
};
