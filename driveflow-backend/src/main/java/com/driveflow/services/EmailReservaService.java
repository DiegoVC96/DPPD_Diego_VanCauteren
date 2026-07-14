package com.driveflow.services;

import com.driveflow.models.Reserva;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;

@Service
public class EmailReservaService {

    private final JavaMailSender mailSender;

    public EmailReservaService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Se despacha en segundo plano de forma inmediata
    @Async
    public void enviarCorreoConfirmacionReserva(Reserva reserva) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Destinatario proporcionado durante el registro
            helper.setTo(reserva.getUsuario().getEmail());
            helper.setSubject("🚗 ¡Reserva Confirmada! Tu contrato de alquiler DriveFlow #" + reserva.getId());

            DateTimeFormatter formateador = DateTimeFormatter.ofPattern("dd 'de' MMMM, yyyy");
            String inicioFormateado = reserva.getFechaInicio().format(formateador);
            String finFormateado = reserva.getFechaFin().format(formateador);

            // DISEÑO 
            String contenidoHtml = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; color: #1E293B; margin: 0; padding: 0; }
                        .wrapper { width: 100%%; padding: 24px 0; background-color: #F8FAFC; }
                        .container { max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border: 1px border #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                        .header { background-color: #0F172A; padding: 32px 24px; text-align: center; }
                        .logo { background-color: #2563EB; color: #FFFFFF; display: inline-block; padding: 8px 16px; border-radius: 8px; font-weight: 900; font-size: 14px; letter-spacing: -0.5px; }
                        .content { padding: 32px 24px; }
                        h1 { font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: -0.5px; }
                        p { font-size: 13px; line-height: 1.6; color: #475569; margin: 0 0 24px 0; }
                        .card { background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
                        .card-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94A3B8; letter-spacing: 0.5px; margin-bottom: 8px; }
                        .item-name { font-size: 15px; font-weight: 800; color: #0F172A; margin: 0; }
                        .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 12px; margin-top: 16px; }
                        .date-block { font-size: 12px; color: #334155; font-weight: 600; }
                        .date-label { font-size: 9px; font-weight: 700; uppercase; color: #64748B; }
                        .footer-info { font-size: 11px; line-height: 1.5; color: #64748B; border-t: 1px solid #E2E8F0; padding-top: 16px; }
                        .provider { font-weight: 700; color: #0F172A; }
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <div class="container">
                            <div class="header">
                                <div class="logo">DRIVEFLOW</div>
                            </div>
                            <div class="content">
                                <h1>Reserva Confirmada Exitosamente</h1>
                                <p>Hola %s, ¡tu viaje ya está en marcha! Hemos procesado tu contrato de forma segura en nuestro maestro de inventario corporativo. A continuación, adjuntamos los detalles para validarlos:</p>
                                
                                <div class="card">
                                    <div class="card-title">Vehículo Alquilado</div>
                                    <p class="item-name">%s</p>
                                    
                                    <div style="margin-top: 12px; font-size: 12px; color: #475569;">
                                        <span style="font-weight: 700; color: #2563EB;">Punto de Retiro:</span> %s
                                    </div>
                                </div>

                                <div class="card">
                                    <div class="card-title">Período del Servicio</div>
                                    <div style="font-size: 12px; color: #334155; font-weight: 600;">
                                        Desde el <span style="color: #2563EB;">%s</span><br>
                                        Hasta el <span style="color: #2563EB;">%s</span>
                                    </div>
                                </div>

                                <div class="footer-info">
                                    <span class="provider">Información de Contacto del Proveedor:</span><br>
                                    🏢 DriveFlow Car Rental S.A.<br>
                                    📍 Sede Central: Av. Libertador 4500, Buenos Aires, Argentina<br>
                                    📞 Soporte Corporativo Tel: +54 9 11 2345-6789<br>
                                    📧 Email: soporte@driveflow.com
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                    reserva.getUsuario().getNombre(),
                    reserva.getVehiculo().getNombre(),
                    reserva.getCiudadRetiro() != null ? reserva.getCiudadRetiro() : "Sede Central",
                    inicioFormateado,
                    finFormateado
                );

            helper.setText(contenidoHtml, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("⚠️ Error crítico al despachar el correo de reserva: " + e.getMessage());
        }
    }
}
