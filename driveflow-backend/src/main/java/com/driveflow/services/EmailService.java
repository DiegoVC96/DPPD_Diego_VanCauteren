package com.driveflow.services;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void enviarCorreoConfirmacion(String nombre, String apellido, String emailDestino) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(emailDestino);
            helper.setSubject("🚗 ¡Bienvenido a DriveFlow! Confirmación de Registro Exitoso");
            helper.setFrom("no-reply@driveflow.com");

            // Cuerpo del correo con HTML 
            String contenidoHtml = """
                <div style="font-family: Arial, sans-serif; background-color: #F8FAFC; padding: 30px; color: #0F172A;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <div style="background-color: #2563EB; color: white; display: inline-block; padding: 12px 20px; font-weight: 900; border-radius: 12px; font-size: 20px; letter-spacing: -0.5px;">DF</div>
                            <h1 style="font-size: 22px; font-weight: 900; margin-top: 15px; margin-bottom: 5px; color: #0F172A;">¡Tu registro fue exitoso!</h1>
                            <p style="color: #64748B; font-size: 14px; margin: 0;">Gracias por unirte a DriveFlow Premium Car Rental</p>
                        </div>
                        <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                        <p style="font-size: 14px; line-clamp: 1.5; color: #334155;">Hola <strong>%s %s</strong>,</p>
                        <p style="font-size: 14px; color: #334155; line-height: 1.6;">Queremos confirmarte que tu cuenta ha sido creada de manera correcta en nuestra plataforma. Por favor, verifica que tus datos de acceso ingresados sean válidos:</p>
                        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 12px; margin: 20px 0; font-size: 13px;">
                            <strong>Usuario:</strong> %s %s<br/>
                            <strong>Dirección de correo:</strong> %s
                        </div>
                        <p style="font-size: 14px; color: #334155; margin-bottom: 25px;">Para comenzar a explorar la flota y realizar reservas, haz clic en el siguiente enlace de acceso directo:</p>
                        <div style="text-align: center; margin-bottom: 25px;">
                            <a href="http://localhost:5173/?openLogin=true" style="background-color: #2563EB; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 14px 30px; border-radius: 12px; font-size: 13px; display: inline-block; box-shadow: 0 4px 6px rgba(37,99,235,0.2);">Iniciar Sesión en mi Cuenta</a>
                        </div>
                        <p style="font-size: 11px; color: #94A3B8; text-align: center; margin-top: 40px; line-height: 1.4;">
                            &copy; %d DriveFlow. Todos los derechos reservados.<br/>
                            Este correo se ha enviado de forma automática, por favor no responder.
                        </p>
                    </div>
                </div>
            """.formatted(nombre, apellido, nombre, apellido, emailDestino, java.time.Year.now().getValue());

            helper.setText(contenidoHtml, true);
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("⚠️ No se pudo despachar el correo de confirmación: " + e.getMessage());
        }
    }
}
