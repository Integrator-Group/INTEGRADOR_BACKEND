import PDFDocument from "pdfkit";

interface AppointmentInvoiceData {
    seq_val: string;
    customerFullName: string;
    professionalFullName: string;
    serviceName: string;
    branchName: string;
    scheduleDate: Date;
    startTime: string;
    endTime: string;
    paymentAmount: number | string;
    paymentMethodName?: string;
}

const IVA_RATE = 0.12; // 12% IVA

export async function buildAppointmentInvoicePdf(
    data: AppointmentInvoiceData
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const chunks: Buffer[] = [];

            doc.on("data", (chunk) => {
                chunks.push(chunk as Buffer);
            });

            doc.on("end", () => {
                resolve(Buffer.concat(chunks));
            });

            doc.on("error", (err) => {
                reject(err);
            });

            const rawTotal =
                typeof data.paymentAmount === "number"
                    ? data.paymentAmount
                    : Number(data.paymentAmount);
            const total = Number.isFinite(rawTotal) ? rawTotal : 0;
            const subtotal = total / (1 + IVA_RATE);
            const iva = total - subtotal;

            // Encabezado / marca
            doc
                .fillColor("#0f172a")
                .fontSize(22)
                .font("Helvetica-Bold")
                .text("Beauty Salon", { align: "left" });

            doc
                .moveDown(0.3)
                .fontSize(10)
                .font("Helvetica")
                .fillColor("#6b7280")
                .text("Factura electrónica de servicios", { align: "left" });

            doc
                .moveUp()
                .fontSize(10)
                .fillColor("#4b5563")
                .text(`Factura N.º ${data.seq_val}`, {
                    align: "right",
                });

            // Datos de la tienda
            doc.moveDown(1);
            const startY = doc.y;
            doc
                .fontSize(10)
                .fillColor("#111827")
                .font("Helvetica-Bold")
                .text("Beauty Salon", 50, startY);
            doc
                .moveDown(0.2)
                .font("Helvetica")
                .fillColor("#4b5563")
                .text("Servicios de peluquería y belleza", { lineGap: 2 })
                .text("Sucursal: " + data.branchName, { lineGap: 2 })
                .text("Teléfono: 0998286160", { lineGap: 2 })
                .text("Correo: contacto@beautysalon.com");

            // Datos del cliente
            const clientBoxX = 320;
            const clientBoxY = startY;
            doc
                .fontSize(10)
                .fillColor("#111827")
                .font("Helvetica-Bold")
                .text("Datos del cliente", clientBoxX, clientBoxY);
            doc
                .moveDown(0.2)
                .font("Helvetica")
                .fillColor("#4b5563")
                .text(`Nombre: ${data.customerFullName}`, { lineGap: 2 })
                .text(`Profesional: ${data.professionalFullName}`, {
                    lineGap: 2,
                })
                .text(`Fecha: ${data.scheduleDate}`, { lineGap: 2 })
                .text(`Horario: ${data.startTime} - ${data.endTime}`, {
                    lineGap: 2,
                });

            // Separador
            doc.moveDown(1.5);
            const lineY = doc.y;
            doc
                .moveTo(50, lineY)
                .lineTo(545, lineY)
                .lineWidth(0.5)
                .stroke("#e5e7eb");

            // Tabla de detalle
            doc.moveDown(0.8);
            doc
                .fontSize(11)
                .fillColor("#111827")
                .font("Helvetica-Bold")
                .text("Detalle del servicio", 50);

            doc.moveDown(0.6);

            const tableTop = doc.y;
            const descriptionX = 50;
            const qtyX = 320;
            const unitPriceX = 380;
            const amountX = 470;

            doc
                .fontSize(9)
                .fillColor("#6b7280")
                .font("Helvetica-Bold")
                .text("Descripción", descriptionX, tableTop)
                .text("Cant.", qtyX, tableTop, { width: 40, align: "right" })
                .text("P. unitario", unitPriceX, tableTop, {
                    width: 70,
                    align: "right",
                })
                .text("Importe", amountX, tableTop, {
                    width: 80,
                    align: "right",
                });

            const rowY = tableTop + 16;

            doc
                .font("Helvetica")
                .fillColor("#111827")
                .text(data.serviceName, descriptionX, rowY, {
                    width: 250,
                })
                .text("1", qtyX, rowY, { width: 40, align: "right" })
                .text(subtotal.toFixed(2), unitPriceX, rowY, {
                    width: 70,
                    align: "right",
                })
                .text(subtotal.toFixed(2), amountX, rowY, {
                    width: 80,
                    align: "right",
                });

            // Resumen de valores (subtotal, IVA, total)
            const summaryTop = rowY + 40;
            doc
                .fontSize(9)
                .font("Helvetica")
                .fillColor("#4b5563")
                .text("Subtotal:", amountX - 60, summaryTop, {
                    width: 60,
                    align: "right",
                })
                .text(subtotal.toFixed(2), amountX, summaryTop, {
                    width: 80,
                    align: "right",
                });

            doc
                .text("IVA (12%):", amountX - 60, summaryTop + 14, {
                    width: 60,
                    align: "right",
                })
                .text(iva.toFixed(2), amountX, summaryTop + 14, {
                    width: 80,
                    align: "right",
                });

            doc
                .font("Helvetica-Bold")
                .fillColor("#111827")
                .text("Total:", amountX - 60, summaryTop + 32, {
                    width: 60,
                    align: "right",
                })
                .text(total.toFixed(2), amountX, summaryTop + 32, {
                    width: 80,
                    align: "right",
                });

            if (data.paymentMethodName) {
                doc
                    .moveDown(2)
                    .fontSize(9)
                    .font("Helvetica")
                    .fillColor("#4b5563")
                    .text(
                        `Método de pago: ${data.paymentMethodName}`,
                        50,
                        summaryTop + 40
                    );
            }

            // Pie de página
            doc.moveDown(4);
            const footerY = doc.page.height - 80;
            doc
                .fontSize(8)
                .font("Helvetica")
                .fillColor("#9ca3af")
                .text(
                    "Gracias por confiar en Beauty Salon. Si tienes dudas sobre esta factura, contáctanos.",
                    50,
                    footerY,
                    { width: 500, align: "center" }
                )
                .moveDown(0.3)
                .text("Teléfono: 0998286160  |  Correo: contacto@beautysalon.com", {
                    width: 500,
                    align: "center",
                });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

