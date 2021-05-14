import {createTransport} from 'nodemailer';

/** 
 * Create transport for mail.
 */
function createMail() {
    return createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });
}

/** 
 * Send mail.
 */
export async function sendMail(subject: string, text: string, html: string) {
    const transport = createMail();

    await transport.sendMail({
        from: process.env.MAIL_ADDRESS,
        to: process.env.MAIL_RECIEVERS.split(","), 
        subject,
        text, 
        html,
    });
}