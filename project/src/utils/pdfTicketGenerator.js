import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates the HTML content for the ticket with inlined styles for PDF conversion.
 * @param {object} booking - The booking object.
 * @param {object} event - The event object (can be derived from booking.events).
 * @returns {string} The HTML string for the ticket.
 */
const getTicketHtmlContent = (booking, event) => {
    const formattedDate = new Date(event.date).toLocaleDateString();
    const bookingDate = new Date(booking.booking_date).toLocaleString();
    const bookingIdSnippet = booking.id.slice(0, 8);

    // Using inline styles for PDF generation via html2canvas is recommended.
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 4px solid #0284c7; max-width: 600px; margin: 20px auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="text-align: center; background-color: #0284c7; color: white; padding: 15px; margin: -20px -20px 20px -20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                <h1 style="margin: 0; font-size: 24px;">EVENT TICKET - CONFIRMED</h1>
            </div>

            <h2 style="color: #0369a1; font-size: 22px; margin-bottom: 10px; border-bottom: 2px solid #e0f2fe; padding-bottom: 5px;">${event.name}</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Booking ID:</td>
                    <td style="padding: 8px 0;">${bookingIdSnippet}...</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Date:</td>
                    <td style="padding: 8px 0;">${formattedDate}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Time:</td>
                    <td style="padding: 8px 0;">${event.time}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Location:</td>
                    <td style="padding: 8px 0;">${event.location}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Seats Booked:</td>
                    <td style="padding: 8px 0;">${booking.seats_booked}</td>
                </tr>
            </table>

            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; border: 1px solid #bae6fd;">
                <p style="text-align: center; font-size: 14px; font-weight: bold; color: #0284c7;">
                    Booking Status: CONFIRMED (FREE EVENT)
                </p>
                <p style="margin-top: 5px; font-size: 12px; color: #777; text-align: center;">Booked On: ${bookingDate}</p>
            </div>

            <p style="text-align: center; margin-top: 20px; color: #0284c7; font-style: italic;">Thank you for your booking!</p>
        </div>
    `;
};


/**
 * Generates a PDF ticket and triggers download.
 * @param {object} booking - The booking object.
 * @param {object} event - The event object.
 */
export const downloadTicketPdf = async (booking, event) => {
    // 1. Create a temporary container for the HTML content
    const ticketHtml = getTicketHtmlContent(booking, event);
    const tempElement = document.createElement('div');
    tempElement.innerHTML = ticketHtml;
    // Append to body but keep it off-screen
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';
    document.body.appendChild(tempElement);
    
    // 2. Generate Canvas from HTML
    const canvas = await html2canvas(tempElement, { 
        scale: 2, // Improves resolution
        useCORS: true,
    });
    
    // 3. Initialize jsPDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    
    // Calculate PDF dimensions to fit the content
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // 4. Add the image and save
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ticket-${booking.id.slice(0, 8)}.pdf`);
    
    // 5. Clean up the temporary element
    document.body.removeChild(tempElement);
};