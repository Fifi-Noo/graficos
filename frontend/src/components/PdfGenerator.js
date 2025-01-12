import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CategoriaIngresos from "./categoriaIngresos";
import CategoriaGastos from "./categoriaGastos";
import UsoCategoriasFiltrado from "./usoCategoria";
import TransaccionesFiltradas from "./transaccionesFiltradas";
import General from "./general";

const PdfGenerator = ({ fechaInicio, fechaFinal }) => {
  const chartRefs = {
    ingresosRef: useRef(),
    gastosRef: useRef(),
    usoCategoriasRef: useRef(),
    transaccionesRef: useRef(),
    generalRef: useRef(),
  };

  const handleGeneratePdf = async () => {
    try {
      const pdf = new jsPDF();
      const elements = [
        { ref: chartRefs.ingresosRef, title: 'Ingresos por Categoría' },
        { ref: chartRefs.gastosRef, title: 'Gastos por Categoría' },
        { ref: chartRefs.usoCategoriasRef, title: 'Uso de Categorías' },
        { ref: chartRefs.transaccionesRef, title: 'Transacciones Filtradas' },
        { ref: chartRefs.generalRef, title: 'Comparativa de Gastos vs Ingresos' }
      ];

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const canvas = await html2canvas(element.ref.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i !== 0) {
          pdf.addPage();
        }
        pdf.text(element.title, 10, 10);
        pdf.addImage(imgData, "PNG", 10, 20, pdfWidth - 20, pdfHeight);
      }

      pdf.save("reporte.pdf");
    } catch (error) {
      console.error("Error al generar el PDF: ", error);
    }
  };

  return (
    <div>
      <h2>Generar PDF de Ingresos, Gastos y Transacciones por Fecha</h2>
      <button onClick={handleGeneratePdf}>Generar PDF</button>
      <div style={{ position: 'absolute', top: '-9999px', width: '210mm', height: '297mm' }}>
        {fechaInicio && fechaFinal && (
          <>
            <div ref={chartRefs.ingresosRef} style={{ marginBottom: '20px' }}>
              <CategoriaIngresos fechaInicio={fechaInicio} fechaFinal={fechaFinal} />
            </div>
            <div ref={chartRefs.gastosRef} style={{ marginBottom: '20px' }}>
              <CategoriaGastos fechaInicio={fechaInicio} fechaFinal={fechaFinal} />
            </div>
            <div ref={chartRefs.usoCategoriasRef} style={{ marginBottom: '20px' }}>
              <UsoCategoriasFiltrado fechaInicio={fechaInicio} fechaFinal={fechaFinal} />
            </div>
            <div ref={chartRefs.transaccionesRef} style={{ marginBottom: '20px' }}>
              <TransaccionesFiltradas fechaInicio={fechaInicio} fechaFinal={fechaFinal} />
            </div>
            <div ref={chartRefs.generalRef} style={{ marginBottom: '20px' }}>
              <General fechaInicio={fechaInicio} fechaFinal={fechaFinal} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PdfGenerator;
