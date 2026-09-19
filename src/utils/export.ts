import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface ExportPdfOptions {
    fileName?: string;
    format?: "A4" | "Letter";
}

export const printResume = () => {
    if (typeof window === "undefined") return;
    window.print();
};

export const exportToPdf = async (
    elementId: string = "resume-preview-root",
    fileName: string = "resume.pdf",
    format: "A4" | "Letter" = "A4"
): Promise<{ success: boolean; error?: string }> => {
    if (typeof window === "undefined") {
        return { success: false, error: "Window is not defined." };
    }

    const element = document.getElementById(elementId);
    if (!element) {
        return { success: false, error: `Element #${elementId} not found.` };
    }

    try {
        // Hide interactive hover outlines before capturing
        const canvas = await html2canvas(element, {
            scale: 2.5, // High resolution for sharp text
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            windowWidth: 1200,
        });

        // Dimensions in mm
        const isLetter = format === "Letter";
        const pdfWidthMm = isLetter ? 215.9 : 210;
        const pdfHeightMm = isLetter ? 279.4 : 297;

        // Calculate aspect ratio
        const imgWidthPx = canvas.width;
        const imgHeightPx = canvas.height;
        const pageHeightPx = (imgWidthPx * pdfHeightMm) / pdfWidthMm;

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: isLetter ? "letter" : "a4",
        });

        // If content fits on a single page
        if (imgHeightPx <= pageHeightPx + 10) {
            const imgData = canvas.toDataURL("image/png");
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidthMm, (imgHeightPx * pdfWidthMm) / imgWidthPx);
        } else {
            // Multi-page slicing
            let renderedHeightPx = 0;
            let pageIndex = 0;

            while (renderedHeightPx < imgHeightPx) {
                if (pageIndex > 0) {
                    pdf.addPage(isLetter ? "letter" : "a4", "portrait");
                }

                // Slice a page from the main canvas
                const sliceHeightPx = Math.min(pageHeightPx, imgHeightPx - renderedHeightPx);
                const pageCanvas = document.createElement("canvas");
                pageCanvas.width = imgWidthPx;
                pageCanvas.height = pageHeightPx;

                const ctx = pageCanvas.getContext("2d");
                if (ctx) {
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
                    ctx.drawImage(
                        canvas,
                        0,
                        renderedHeightPx,
                        imgWidthPx,
                        sliceHeightPx,
                        0,
                        0,
                        imgWidthPx,
                        sliceHeightPx
                    );

                    const pageData = pageCanvas.toDataURL("image/png");
                    pdf.addImage(pageData, "PNG", 0, 0, pdfWidthMm, pdfHeightMm);
                }

                renderedHeightPx += pageHeightPx;
                pageIndex++;
            }
        }

        pdf.save(fileName);
        return { success: true };
    } catch (error: any) {
        console.error("PDF Export error:", error);
        return { success: false, error: error.message || "PDF generation failed." };
    }
};
