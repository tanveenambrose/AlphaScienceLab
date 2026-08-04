import nodemailer from "nodemailer";

export const getTransporter = () => {
    let email = process.env.SMTP_EMAIL || "";
    const rawPass = process.env.SMTP_PASSWORD || "";
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "465", 10);

    if (!email || !rawPass) {
        throw new Error("SMTP_EMAIL and SMTP_PASSWORD must be defined in environment variables");
    }

    // Normalize email if @gmail.com is missing
    if (!email.includes("@")) {
        email = email.replace(/\.com$/, "@gmail.com");
        if (!email.includes("@")) {
            email = `${email}@gmail.com`;
        }
    }

    // Gmail App Password must have spaces removed
    const pass = rawPass.replace(/\s+/g, "");

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465 SSL, false for 587 TLS
        auth: {
            user: email,
            pass: pass,
        },
    });
};

const getSenderEmail = () => {
    let email = process.env.SMTP_EMAIL || "alphasciencelabmecbd@gmail.com";
    if (!email.includes("@")) {
        email = email.replace(/\.com$/, "@gmail.com");
        if (!email.includes("@")) {
            email = `${email}@gmail.com`;
        }
    }
    return email;
};

/**
 * Send Welcome Email with generated login credentials to an approved applicant
 */
export const sendWelcomeEmail = async (
    to: string,
    name: string,
    tempPassword?: string,
    portalUrl: string = "https://alphasciencelab.org/login"
) => {
    try {
        const transporter = getTransporter();
        const sender = getSenderEmail();

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Alpha Science Lab</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0510; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0c0510; padding: 30px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #140a1b; border: 1px solid rgba(236, 13, 110, 0.25); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
                    <!-- Header Banner -->
                    <tr>
                        <td style="padding: 35px 30px; text-align: center; background: linear-gradient(135deg, rgba(236, 13, 110, 0.15), rgba(150, 46, 155, 0.2)); border-bottom: 1px solid rgba(255,255,255,0.08);">
                            <div style="margin-bottom: 14px;">
                                <img src="https://raw.githubusercontent.com/tanveenambrose/AlphaScienceLab/main/public/assests/asl.png" alt="Alpha Science Lab Logo" width="80" style="max-width: 80px; height: auto; display: inline-block;" />
                            </div>
                            <div style="display: inline-block; padding: 6px 16px; border-radius: 50px; background: rgba(236, 13, 110, 0.15); border: 1px solid rgba(236, 13, 110, 0.4); font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #EC0D6E; text-transform: uppercase; margin-bottom: 14px;">
                                Membership Officialization
                            </div>
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                                Welcome to <span style="color: #EC0D6E;">Alpha Science Lab</span>
                            </h1>
                            <p style="margin: 8px 0 0 0; font-size: 13px; color: #a1a1aa;">Creativity Starts from Belief</p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 35px 30px;">
                            <p style="font-size: 15px; color: #ffffff; margin: 0 0 16px 0;">
                                Dear <strong>${name}</strong>,
                            </p>
                            <p style="font-size: 14px; line-height: 1.6; color: #d4d4d8; margin: 0 0 20px 0;">
                                Congratulations! We are thrilled to inform you that your membership application to <strong style="color: #ffffff;">Alpha Science Lab</strong> has been <span style="color: #10B981; font-weight: bold;">APPROVED</span>.
                            </p>
                            <p style="font-size: 14px; line-height: 1.6; color: #d4d4d8; margin: 0 0 25px 0;">
                                You are now an official member of ASL. Your dedicated portal account has been provisioned. Please use the credentials below to log into the ASL Portal:
                            </p>

                            <!-- Credentials Box -->
                            ${tempPassword ? `
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1c0f26; border: 1px solid rgba(236, 13, 110, 0.35); border-radius: 12px; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #EC0D6E;">
                                            🔐 Your ASL Portal Credentials
                                        </p>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="4" border="0">
                                            <tr>
                                                <td width="90" style="font-size: 13px; color: #a1a1aa;">Username:</td>
                                                <td style="font-size: 14px; font-weight: bold; color: #ffffff; font-family: monospace;">${to}</td>
                                            </tr>
                                            <tr>
                                                <td width="90" style="font-size: 13px; color: #a1a1aa;">Password:</td>
                                                <td style="font-size: 14px; font-weight: bold; color: #34D399; font-family: monospace; background: rgba(52, 211, 153, 0.1); padding: 4px 8px; border-radius: 6px; display: inline-block;">${tempPassword}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}

                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="${portalUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #EC0D6E, #962E9B); color: #ffffff; text-decoration: none; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 50px; box-shadow: 0 4px 20px rgba(236, 13, 110, 0.4);">
                                            Access ASL Member Portal &rarr;
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Guidelines Reminder -->
                            <div style="padding: 16px 20px; background-color: rgba(255,255,255,0.03); border-left: 3px solid #EC0D6E; border-radius: 8px; margin-bottom: 25px;">
                                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #ffffff;">📋 Next Steps & Guidelines:</p>
                                <ul style="margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.6; color: #a1a1aa;">
                                    <li>Please log in and update your password upon first login.</li>
                                    <li>Attend the weekly wing and general meetings regularly.</li>
                                    <li>Maintain active collaboration and adhere to ASL Confidentiality & Code of Conduct.</li>
                                </ul>
                            </div>

                            <p style="font-size: 13px; color: #d4d4d8; margin: 0;">
                                We look forward to seeing your innovative contributions to our community!
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); background-color: #0f0714;">
                            <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #ffffff;">Alpha Science Lab</p>
                            <p style="margin: 0 0 6px 0; font-size: 11px; color: #71717a;">Official Student Research & Innovation Lab</p>
                            <p style="margin: 0; font-size: 11px; color: #52525b;">Email: alphasciencelabmecbd@gmail.com</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        const info = await transporter.sendMail({
            from: `"Alpha Science Lab" <${sender}>`,
            to,
            subject: "🎉 Welcome to Alpha Science Lab — Membership Application Approved",
            html,
        });

        console.log(`[Email] Welcome email sent successfully to ${to} (Message ID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`[Email] Failed to send welcome email to ${to}:`, error);
        return { success: false, error: error?.message || "Unknown error sending email" };
    }
};

/**
 * Send Rejection Email to an applicant
 */
export const sendRejectionEmail = async (to: string, name: string) => {
    try {
        const transporter = getTransporter();
        const sender = getSenderEmail();

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASL Membership Application Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0510; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0c0510; padding: 30px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #140a1b; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 35px 30px; text-align: center; background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(150, 46, 155, 0.1)); border-bottom: 1px solid rgba(255,255,255,0.08);">
                            <div style="margin-bottom: 12px;">
                                <img src="https://raw.githubusercontent.com/tanveenambrose/AlphaScienceLab/main/public/assests/asl.png" alt="Alpha Science Lab Logo" width="70" style="max-width: 70px; height: auto; display: inline-block;" />
                            </div>
                            <div style="display: inline-block; padding: 6px 16px; border-radius: 50px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #a1a1aa; text-transform: uppercase; margin-bottom: 12px;">
                                Application Update
                            </div>
                            <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                                Alpha Science Lab
                            </h1>
                            <p style="margin: 8px 0 0 0; font-size: 13px; color: #a1a1aa;">Creativity Starts from Belief</p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 35px 30px;">
                            <p style="font-size: 15px; color: #ffffff; margin: 0 0 16px 0;">
                                Dear <strong>${name}</strong>,
                            </p>
                            <p style="font-size: 14px; line-height: 1.6; color: #d4d4d8; margin: 0 0 20px 0;">
                                Thank you for your interest in joining <strong>Alpha Science Lab</strong> and taking the time to submit your membership application.
                            </p>
                            <p style="font-size: 14px; line-height: 1.6; color: #d4d4d8; margin: 0 0 20px 0;">
                                After thorough evaluation by our review committee, we regret to inform you that we are unable to accept your membership application for this recruitment cycle due to limited positions per wing.
                            </p>
                            <div style="padding: 16px 20px; background-color: rgba(255,255,255,0.03); border-left: 3px solid #71717a; border-radius: 8px; margin-bottom: 24px;">
                                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #a1a1aa;">
                                    We sincerely appreciate your enthusiasm and encourage you to participate in upcoming ASL open workshops, public symposiums, and future recruitment drives.
                                </p>
                            </div>
                            <p style="font-size: 13px; color: #d4d4d8; margin: 0;">
                                We wish you the very best in your academic and technical endeavors.
                            </p>
                            <br/>
                            <p style="font-size: 13px; color: #a1a1aa; margin: 0;">
                                Warm regards,<br/>
                                <strong style="color: #ffffff;">The ASL Executive Committee</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); background-color: #0f0714;">
                            <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #ffffff;">Alpha Science Lab</p>
                            <p style="margin: 0 0 6px 0; font-size: 11px; color: #71717a;">Official Student Research & Innovation Lab</p>
                            <p style="margin: 0; font-size: 11px; color: #52525b;">Email: alphasciencelabmecbd@gmail.com</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        const info = await transporter.sendMail({
            from: `"Alpha Science Lab" <${sender}>`,
            to,
            subject: "Update on your Alpha Science Lab Membership Application",
            html,
        });

        console.log(`[Email] Rejection email sent successfully to ${to} (Message ID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`[Email] Failed to send rejection email to ${to}:`, error);
        return { success: false, error: error?.message || "Unknown error sending email" };
    }
};

/**
 * Send Password Recovery Email with current / present password to member
 */
export const sendPasswordRecoveryEmail = async (
    to: string,
    name: string,
    presentPassword: string,
    loginUrl: string = "https://alphasciencelab.org/login"
) => {
    try {
        const transporter = getTransporter();
        const sender = getSenderEmail();

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASL Account Password Recovery</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0510; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0c0510; padding: 30px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #140a1b; border: 1px solid rgba(236, 13, 110, 0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
                    <!-- Header with ASL Logo -->
                    <tr>
                        <td style="padding: 35px 30px; text-align: center; background: linear-gradient(135deg, rgba(236, 13, 110, 0.18), rgba(150, 46, 155, 0.25)); border-bottom: 1px solid rgba(255,255,255,0.08);">
                            <div style="margin-bottom: 14px;">
                                <img src="https://raw.githubusercontent.com/tanveenambrose/AlphaScienceLab/main/public/assests/asl.png" alt="Alpha Science Lab Logo" width="85" style="max-width: 85px; height: auto; display: inline-block;" />
                            </div>
                            <div style="display: inline-block; padding: 6px 18px; border-radius: 50px; background: rgba(236, 13, 110, 0.15); border: 1px solid rgba(236, 13, 110, 0.4); font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #EC0D6E; text-transform: uppercase; margin-bottom: 12px;">
                                Security & Credential Recovery
                            </div>
                            <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                                Alpha Science Lab
                            </h1>
                            <p style="margin: 6px 0 0 0; font-size: 13px; color: #a1a1aa;">Creativity Starts from Belief</p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 35px 30px;">
                            <p style="font-size: 15px; color: #ffffff; margin: 0 0 16px 0;">
                                Hello <strong>${name || "Member"}</strong>,
                            </p>
                            <p style="font-size: 14px; line-height: 1.6; color: #d4d4d8; margin: 0 0 20px 0;">
                                We received a request to recover your present login password for your <strong>Alpha Science Lab</strong> account associated with <span style="color: #EC0D6E; font-family: monospace;">${to}</span>.
                            </p>

                            <!-- Password Box -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1b0d26; border: 1px solid rgba(236, 13, 110, 0.4); border-radius: 12px; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 22px;">
                                        <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #EC0D6E;">
                                            🔑 Your Present ASL Password
                                        </p>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="4" border="0">
                                            <tr>
                                                <td width="90" style="font-size: 13px; color: #a1a1aa;">Account:</td>
                                                <td style="font-size: 14px; font-weight: bold; color: #ffffff; font-family: monospace;">${to}</td>
                                            </tr>
                                            <tr>
                                                <td width="90" style="font-size: 13px; color: #a1a1aa;">Password:</td>
                                                <td style="font-size: 15px; font-weight: bold; color: #34D399; font-family: monospace; background: rgba(52, 211, 153, 0.12); border: 1px solid rgba(52, 211, 153, 0.3); padding: 6px 12px; border-radius: 6px; display: inline-block;">${presentPassword}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 25px;">
                                <tr>
                                    <td align="center">
                                        <a href="${loginUrl}" style="display: inline-block; padding: 14px 34px; background: linear-gradient(135deg, #EC0D6E, #962E9B); color: #ffffff; text-decoration: none; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 50px; box-shadow: 0 4px 20px rgba(236, 13, 110, 0.4);">
                                            Sign In to ASL Portal &rarr;
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Warning -->
                            <div style="padding: 14px 18px; background-color: rgba(236, 13, 110, 0.05); border-left: 3px solid #EC0D6E; border-radius: 8px;">
                                <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #d4d4d8;">
                                    🛡️ <strong>Security Tip:</strong> If you did not request this password recovery, please change your password immediately in your account settings or contact the lab administrator.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); background-color: #0f0714;">
                            <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #ffffff;">Alpha Science Lab</p>
                            <p style="margin: 0 0 6px 0; font-size: 11px; color: #71717a;">Official Student Research & Innovation Lab</p>
                            <p style="margin: 0; font-size: 11px; color: #52525b;">Email: alphasciencelabmecbd@gmail.com</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        const info = await transporter.sendMail({
            from: `"Alpha Science Lab" <${sender}>`,
            to,
            subject: "🔐 Your Alpha Science Lab Account Password Recovery",
            html,
        });

        console.log(`[Email] Password recovery email sent successfully to ${to} (Message ID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`[Email] Failed to send password recovery email to ${to}:`, error);
        return { success: false, error: error?.message || "Unknown error sending email" };
    }
};
