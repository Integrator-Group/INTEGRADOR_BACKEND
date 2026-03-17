import nodemailer from 'nodemailer';

interface AppointmentConfirmationEmailData {
    to: string;
    customerFullName: string;
    serviceName: string;
    professionalFullName: string;
    scheduleDate: Date;
    startTime: string;
    endTime: string;
    paymentAmount: number | string;
    paymentMethodName?: string;
    appointmentCode: string;
    clientPortalUrl?: string;
}

interface EmailCredentials {
    email: string;
    username: string;
    password: string;
    names: string;
    last_names?: string;
}

class EmailService {
    private transporter: any;

    constructor() {
        // Configuración para Gmail
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASSWORD, // Contraseña de aplicación de Gmail
            },
        });
    }

    /**
     * Envía las credenciales del usuario por correo electrónico
     */
    async sendCredentialsEmail(credentials: EmailCredentials): Promise<void> {
        const { email, username, password, names, last_names } = credentials;
        const fullName = last_names ? `${names} ${last_names}` : names;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Credenciales de Acceso - Sistema de Gestión',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            background-color: #f9f9f9;
                            border-radius: 10px;
                            padding: 30px;
                            border: 1px solid #ddd;
                        }
                        .header {
                            background-color: #4CAF50;
                            color: white;
                            padding: 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                            margin: -30px -30px 30px -30px;
                        }
                        .credentials-box {
                            background-color: #ffffff;
                            border: 2px solid #4CAF50;
                            border-radius: 5px;
                            padding: 20px;
                            margin: 20px 0;
                        }
                        .credential-item {
                            margin: 15px 0;
                            padding: 10px;
                            background-color: #f5f5f5;
                            border-left: 4px solid #4CAF50;
                        }
                        .label {
                            font-weight: bold;
                            color: #555;
                            display: block;
                            margin-bottom: 5px;
                        }
                        .value {
                            font-family: 'Courier New', monospace;
                            font-size: 16px;
                            color: #333;
                            word-break: break-all;
                        }
                        .warning {
                            background-color: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 5px;
                        }
                        .footer {
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #ddd;
                            text-align: center;
                            color: #777;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Bienvenido al Sistema</h1>
                        </div>
                        
                        <p>Estimado/a <strong>${fullName}</strong>,</p>
                        
                        <p>Sus credenciales de acceso al sistema han sido generadas exitosamente. A continuación encontrará sus datos de inicio de sesión:</p>
                        
                        <div class="credentials-box">
                            <h2 style="margin-top: 0; color: #4CAF50;">Credenciales de Acceso</h2>
                            
                            <div class="credential-item">
                                <span class="label">Usuario (Username):</span>
                                <span class="value">${username}</span>
                            </div>
                            
                            <div class="credential-item">
                                <span class="label">Contraseña:</span>
                                <span class="value">${password}</span>
                            </div>
                        </div>
                        
                        <div class="warning">
                            <strong>⚠️ Importante:</strong>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Por seguridad, le recomendamos cambiar su contraseña después del primer inicio de sesión.</li>
                                <li>No comparta estas credenciales con nadie.</li>
                                <li>Si no solicitó estas credenciales, por favor contacte al administrador del sistema.</li>
                            </ul>
                        </div>
                        
                        <p>Para iniciar sesión, utilice el usuario y contraseña proporcionados arriba.</p>
                        
                        <div class="footer">
                            <p>Este es un correo automático, por favor no responda a este mensaje.</p>
                            <p>&copy; ${new Date().getFullYear()} Sistema de Gestión. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
Bienvenido al Sistema

Estimado/a ${fullName},

Sus credenciales de acceso al sistema han sido generadas exitosamente.

Credenciales de Acceso:
- Usuario (Username): ${username}
- Contraseña: ${password}

IMPORTANTE:
- Por seguridad, le recomendamos cambiar su contraseña después del primer inicio de sesión.
- No comparta estas credenciales con nadie.
- Si no solicitó estas credenciales, por favor contacte al administrador del sistema.

Para iniciar sesión, utilice el usuario y contraseña proporcionados arriba.

Este es un correo automático, por favor no responda a este mensaje.
            `.trim(),
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Correo enviado exitosamente:', info.messageId);
        } catch (error) {
            console.error('Error al enviar correo:', error);
            throw new Error('Error al enviar el correo electrónico con las credenciales');
        }
    }

    async sendAppointmentConfirmationEmail(
        data: AppointmentConfirmationEmailData,
        invoicePdf: Buffer
    ): Promise<void> {
        const rawAmount = typeof data.paymentAmount === "number"
            ? data.paymentAmount
            : Number(data.paymentAmount);
        const safeAmount = Number.isFinite(rawAmount) ? rawAmount : 0;

        const paymentDescription = data.paymentMethodName
            ? `${safeAmount.toFixed(2)} (${data.paymentMethodName})`
            : safeAmount.toFixed(2);

        const scheduleDate = data.scheduleDate.toISOString().split("T")[0];

        const html = `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Cita confirmada</title>
                </head>
                <body style="margin:0; padding:0; background-color:#f3f6fb; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f6fb; padding:24px 0;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px; background-color:#0f172a; border-radius:20px; overflow:hidden; box-shadow:0 18px 45px rgba(15,23,42,0.35);">
                          <tr>
                            <td style="padding:20px 28px 12px 28px; background:linear-gradient(135deg,#0b1935,#0c3b8c); color:#ffffff;">
                              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                  <td style="font-size:18px; font-weight:600;">
                                    Beauty Salon
                                  </td>
                                  <td align="right" style="font-size:12px; color:rgba(255,255,255,0.75);">
                                    Cita confirmada
                                  </td>
                                </tr>
                              </table>
                              <div style="margin-top:20px; font-size:22px; font-weight:700;">
                                ¡Hola, ${data.customerFullName}! ✨
                              </div>
                              <div style="margin-top:8px; font-size:14px; line-height:1.6; color:rgba(255,255,255,0.85);">
                                Tu cita ha sido <strong>confirmada</strong>. Aquí tienes el resumen de tu orden y los detalles del servicio que agendaste.
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:18px 28px 4px 28px; background:linear-gradient(135deg,#0c3b8c,#0b1935);">
                              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-radius:18px; background:linear-gradient(135deg,#0b1935,#0c3b8c);">
                                <tr>
                                  <td style="padding:18px 20px; text-align:left; color:#ffffff; font-size:14px;">
                                    <div style="opacity:0.85; line-height:1.5;">
                                      Te esperamos en la fecha y hora indicada. Si necesitas reprogramar, puedes hacerlo desde tu portal de cliente 1 día antes de la cita.
                                    </div>
                                  </td>
                                  <td align="right" style="padding:0 20px 0 0; white-space:nowrap;">
                                    ${
                                        data.clientPortalUrl
                                            ? `<a href="${data.clientPortalUrl}" style="display:inline-block; padding:10px 20px; border-radius:999px; background:linear-gradient(135deg,#f59e0b,#f97316); color:#fff; text-decoration:none; font-size:13px; font-weight:600; box-shadow:0 10px 25px rgba(249,115,22,0.4);">
                                          Ver mi cita
                                        </a>`
                                            : ""
                                    }
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:20px 28px 8px 28px; background-color:#0f172a;">
                              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0b1220; border-radius:18px; padding:18px 20px; color:#e5e7eb;">
                                <tr>
                                  <td colspan="2" style="padding-bottom:8px; font-size:15px; font-weight:600; color:#ffffff;">
                                    Detalles de tu cita
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:6px 0; font-size:13px; color:#9ca3af; width:40%;">Nombre del cliente</td>
                                  <td style="padding:6px 0; font-size:13px; color:#f9fafb; font-weight:500;">${data.customerFullName}</td>
                                </tr>
                                <tr>
                                  <td style="padding:6px 0; font-size:13px; color:#9ca3af;">Servicio agendado</td>
                                  <td style="padding:6px 0; font-size:13px; color:#f9fafb; font-weight:500;">${data.serviceName}</td>
                                </tr>
                                <tr>
                                  <td style="padding:6px 0; font-size:13px; color:#9ca3af;">Profesional asignado</td>
                                  <td style="padding:6px 0; font-size:13px; color:#f9fafb; font-weight:500;">${data.professionalFullName}</td>
                                </tr>
                                <tr>
                                  <td style="padding:6px 0; font-size:13px; color:#9ca3af;">Fecha de la orden</td>
                                  <td style="padding:6px 0; font-size:13px; color:#f9fafb; font-weight:500;">${scheduleDate}</td>
                                </tr>
                                <tr>
                                  <td style="padding:6px 0; font-size:13px; color:#9ca3af;">Hora del servicio</td>
                                  <td style="padding:6px 0; font-size:13px; color:#f9fafb; font-weight:500;">${data.startTime} - ${data.endTime}</td>
                                </tr>
                                <tr>
                                  <td style="padding:10px 0 0 0; font-size:13px; color:#9ca3af;">Pago</td>
                                  <td style="padding:10px 0 0 0; font-size:14px; font-weight:600; color:#f59e0b;">${paymentDescription}</td>
                                </tr>
                                <tr>
                                  <td style="padding:10px 0 0 0; font-size:13px; color:#9ca3af;">Código de cita</td>
                                  <td style="padding:10px 0 0 0; font-size:13px; color:#f9fafb; font-weight:500;">${data.appointmentCode}</td>
                                </tr>
                              </table>
                              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:16px; background-color:#020617; border-radius:16px; padding:14px 18px; color:#e5e7eb;">
                                <tr>
                                  <td style="font-size:13px; line-height:1.5;">
                                    Hemos adjuntado la <strong>factura en PDF</strong> correspondiente a este servicio.
                                    Puedes descargarla y guardarla para tus registros.
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:16px 28px 22px 28px; background-color:#020617; color:#6b7280; font-size:11px; text-align:center;">
                              Recibiste este correo porque registraste una cita en <strong>Beauty Salon</strong>.<br />
                              Si no reconoces esta acción, por favor contáctanos de inmediato.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
            `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: data.to,
            subject: "Cita confirmada",
            html,
            attachments: [
                {
                    filename: `factura-cita-${data.appointmentCode}.pdf`,
                    content: invoicePdf,
                },
            ],
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Correo de cita confirmada enviado:", info.messageId);
        } catch (error) {
            console.error("Error al enviar correo de cita confirmada:", error);
            throw new Error(
                "Error al enviar el correo electrónico de confirmación de cita"
            );
        }
    }

    /**
     * Verifica la conexión con el servidor de correo
     */
    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error('Error al verificar conexión de correo:', error);
            return false;
        }
    }
}

export default new EmailService();
