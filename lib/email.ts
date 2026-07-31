import nodemailer from "nodemailer";

const getTransporter = () => {
    const email = process.env.SMTP_EMAIL;
    const pass = process.env.SMTP_PASSWORD;

    if (!email || !pass) {
        throw new Error("SMTP_EMAIL and SMTP_PASSWORD must be defined in environment variables");
    }

    return nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: email,
            pass: pass,
        },
    });
};

export const sendWelcomeEmail = async (to: string, name: string, tempPassword?: string) => {
    try {
        const transporter = getTransporter();

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                <h2 style="color: #EC0D6E;">Welcome to Alpha Science Lab!</h2>
                <p>Hi ${name},</p>
                <p>Congratulations! Your membership application to Alpha Science Lab has been <strong>approved</strong>.</p>
                <p>We are thrilled to have you onboard.</p>
                ${tempPassword ? `
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #EC0D6E; margin: 20px 0;">
                    <p style="margin: 0; font-weight: bold;">Your temporary login credentials:</p>
                    <p style="margin: 5px 0 0 0;">Email: ${to}</p>
                    <p style="margin: 5px 0 0 0;">Password: <span style="font-family: monospace; background: #e0e0e0; padding: 2px 6px; border-radius: 4px;">${tempPassword}</span></p>
                </div>
                ` : ''}
                <p>Please log in and update your password as soon as possible.</p>
                <br/>
                <p>Best regards,<br/>The ASL Executive Team</p>
            </div>
        `;

        await transporter.sendMail({
            from: `"Alpha Science Lab" <${process.env.SMTP_EMAIL}>`,
            to,
            subject: "Your ASL Membership Application - Approved",
            html,
        });

        console.log(`Welcome email sent to ${to}`);
    } catch (error) {
        console.error("Failed to send welcome email:", error);
    }
};

export const sendRejectionEmail = async (to: string, name: string) => {
    try {
        const transporter = getTransporter();

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                <h2 style="color: #333;">Alpha Science Lab Membership Application</h2>
                <p>Hi ${name},</p>
                <p>Thank you for your interest in joining Alpha Science Lab. We have carefully reviewed your application.</p>
                <p>Unfortunately, we are unable to accept your membership request at this time.</p>
                <p>We appreciate the time you took to apply and encourage you to continue pursuing your interest in research and innovation.</p>
                <br/>
                <p>Best regards,<br/>The ASL Executive Team</p>
            </div>
        `;

        await transporter.sendMail({
            from: `"Alpha Science Lab" <${process.env.SMTP_EMAIL}>`,
            to,
            subject: "Update on your ASL Membership Application",
            html,
        });

        console.log(`Rejection email sent to ${to}`);
    } catch (error) {
        console.error("Failed to send rejection email:", error);
    }
};
