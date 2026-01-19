const nodemailer = require('nodemailer');

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
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true para 465, false para otros puertos
            auth: {
                user: 'lanchero.medina@gmail.com',
                pass: 'bcmo cgfk cwqn zlpr', // Contraseña de aplicación de Gmail
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
            from: 'lanchero.medina@gmail.com',
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
