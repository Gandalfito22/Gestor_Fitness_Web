// Estado de la Aplicación
let data = JSON.parse(localStorage.getItem('fitnessData')) || [];
let chart = null;
let selectedIndex = -1;

// Mapeo de nombres legibles para métricas
const metricLabels = {
    weight: 'Peso (kg)',
    back: 'Ancho Espalda (cm)',
    chest: 'Pecho (cm)',
    waist: 'Cintura (cm)',
    quad: 'Cuádriceps (cm)',
    bicepsFlex: 'Bíceps Contraído (cm)',
    bicepsRel: 'Bíceps Relajado (cm)'
};

// Inicialización por defecto de la fecha al día de hoy
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Si hay datos, ordenar cronológicamente
    sortDataByDate();
    render();
});

// Ordenar datos cronológicamente (más antiguos a más recientes)
function sortDataByDate() {
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Renderizado principal
function render() {
    const body = document.getElementById('tableBody');
    const detailsView = document.getElementById('detailsView');
    
    if (data.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                    No hay mediciones registradas. ¡Agrega tu primera medición arriba!
                </td>
            </tr>
        `;
        detailsView.classList.add('hidden');
        updateChart();
        return;
    }

    // Renderizar filas de la tabla (más recientes primero en la tabla, para facilidad de visualización)
    // Pero mantener el índice original del array 'data'
    const tableRows = [...data]
        .map((d, indexInSorted) => {
            // Guardamos el índice real del array original
            const originalIndex = indexInSorted; 
            return { d, originalIndex };
        })
        // Mostrar los más recientes primero en la tabla
        .reverse()
        .map(({ d, originalIndex }) => {
            const isSelected = originalIndex === selectedIndex;
            return `
                <tr onclick="selectRow(${originalIndex})" class="${isSelected ? 'selected' : ''}">
                    <td>${formatDate(d.date)}</td>
                    <td style="font-weight: 600; color: var(--color-accent);">${d.weight} kg</td>
                    <td style="color: var(--text-muted); max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${d.notes || '—'}
                    </td>
                </tr>
            `;
        })
        .join('');
        
    body.innerHTML = tableRows;

    // Actualizar vista de detalles si hay selección activa
    if (selectedIndex > -1 && selectedIndex < data.length) {
        const d = data[selectedIndex];
        document.getElementById('detailsContent').innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Fecha</span>
                <span class="detail-val" style="color: #fff;">${formatDate(d.date)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Peso</span>
                <span class="detail-val">${d.weight} kg</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Espalda</span>
                <span class="detail-val">${d.back} cm</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Pecho</span>
                <span class="detail-val">${d.chest} cm</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Cintura</span>
                <span class="detail-val">${d.waist} cm</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Cuádriceps</span>
                <span class="detail-val">${d.quad} cm</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Bíceps Cont.</span>
                <span class="detail-val">${d.bicepsFlex} cm</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Bíceps Rel.</span>
                <span class="detail-val">${d.bicepsRel} cm</span>
            </div>
            <div class="detail-item detail-notes">
                <span class="detail-label">Notas</span>
                <span class="detail-val" style="color: var(--text-primary); font-size: 0.95rem; font-weight: normal; margin-top: 0.25rem;">
                    ${d.notes || 'Sin anotaciones adicionales.'}
                </span>
            </div>
        `;
        detailsView.classList.remove('hidden');
    } else {
        detailsView.classList.add('hidden');
    }

    // Actualizar gráfico de progreso
    updateChart();
}

// Formatear Fecha
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateStr).toLocaleDateString('es-ES', options);
}

// Seleccionar Fila
function selectRow(index) {
    if (selectedIndex === index) {
        selectedIndex = -1; // Deseleccionar si hace clic de nuevo
    } else {
        selectedIndex = index;
    }
    render();
}

// Eliminar Registro Seleccionado
function deleteSelected() {
    if (selectedIndex > -1 && selectedIndex < data.length) {
        if (confirm('¿Estás seguro de que deseas eliminar esta medición?')) {
            data.splice(selectedIndex, 1);
            localStorage.setItem('fitnessData', JSON.stringify(data));
            selectedIndex = -1;
            render();
        }
    }
}

// Formulario Submit
document.getElementById('measurementForm').onsubmit = (e) => {
    e.preventDefault();
    
    const entry = {
        date: document.getElementById('date').value,
        weight: parseFloat(document.getElementById('weight').value),
        back: parseFloat(document.getElementById('back').value),
        chest: parseFloat(document.getElementById('chest').value),
        waist: parseFloat(document.getElementById('waist').value),
        quad: parseFloat(document.getElementById('quad').value),
        bicepsFlex: parseFloat(document.getElementById('bicepsFlex').value),
        bicepsRel: parseFloat(document.getElementById('bicepsRel').value),
        notes: document.getElementById('notes').value.trim()
    };

    // Verificar si ya existe medición para esa fecha
    const existingIndex = data.findIndex(d => d.date === entry.date);
    if (existingIndex > -1) {
        if (confirm(`Ya existe un registro para la fecha ${entry.date}. ¿Deseas sobreescribirlo?`)) {
            data[existingIndex] = entry;
        } else {
            return;
        }
    } else {
        data.push(entry);
    }

    // Persistir y ordenar
    localStorage.setItem('fitnessData', JSON.stringify(data));
    sortDataByDate();
    selectedIndex = -1; // Resetear selección
    render();
    
    // Resetear formulario (manteniendo la fecha de hoy por comodidad)
    document.getElementById('measurementForm').reset();
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
};

// Actualizar Gráfico Chart.js
function updateChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const metric = document.getElementById('metricSelector').value;
    
    if (chart) {
        chart.destroy();
    }

    if (data.length === 0) {
        return;
    }

    // Obtener los datos ordenados cronológicamente para el gráfico
    const labels = data.map(d => formatDate(d.date));
    const values = data.map(d => d[metric]);

    // Crear un gradiente hermoso para el relleno de la línea
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: metricLabels[metric],
                data: values,
                borderColor: '#06b6d4',
                borderWidth: 3,
                backgroundColor: gradient,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: 'rgba(255, 255, 255, 0.8)',
                pointBorderWidth: 1.5,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Ocultamos la leyenda para una apariencia más limpia
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleFont: { family: 'Outfit', size: 13 },
                    bodyFont: { family: 'Outfit', size: 14, weight: 'bold' },
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} ${metric === 'weight' ? 'kg' : 'cm'}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.04)',
                        borderColor: 'transparent'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'Outfit', size: 11 }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.04)',
                        borderColor: 'transparent'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'Outfit', size: 11 }
                    }
                }
            }
        }
    });
}

// Exportar CSV
function exportCSV() {
    if (data.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }

    const headers = 'Fecha,Peso (kg),Espalda (cm),Pecho (cm),Cintura (cm),Cuadriceps (cm),Biceps Contraido (cm),Biceps Relajado (cm),Notas\n';
    const rows = data.map(d => [
        d.date,
        d.weight,
        d.back,
        d.chest,
        d.waist,
        d.quad,
        d.bicepsFlex,
        d.bicepsRel,
        `"${(d.notes || '').replace(/"/g, '""')}"`
    ].join(',')).join('\n');

    const csvContent = "\uFEFF" + headers + rows; // \uFEFF es el BOM para que Excel lea caracteres especiales como acentos
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registro_progreso_fisico.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Exportar PDF con jsPDF
function exportPDF() {
    if (data.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }

    const { jsPDF } = window.jspdf;
    // landscape orientation
    const doc = new jsPDF('landscape', 'pt', 'a4');
    
    // Título y Cabecera del PDF
    doc.setFillColor(11, 15, 25); // Color primario oscuro de fondo para la cabecera
    doc.rect(0, 0, 842, 80, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Reporte de Progreso Físico", 40, 48);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    const fechaReporte = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Generado el: ${fechaReporte}`, 650, 48);

    // Configuración de la Tabla
    let y = 120;
    
    // Dibujar encabezados de tabla
    doc.setFillColor(30, 41, 59);
    doc.rect(40, y, 762, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    
    const headers = [
        { title: "Fecha", w: 70 },
        { title: "Peso", w: 50 },
        { title: "Espalda", w: 60 },
        { title: "Pecho", w: 60 },
        { title: "Cintura", w: 60 },
        { title: "Cuadr.", w: 60 },
        { title: "B.Flex", w: 60 },
        { title: "B.Rel", w: 60 },
        { title: "Notas", w: 282 }
    ];
    
    let currentX = 45;
    headers.forEach(h => {
        doc.text(h.title, currentX, y + 16);
        currentX += h.w;
    });
    
    y += 25;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);

    // Dibujar filas de datos (del más reciente al más antiguo)
    const reversedData = [...data].reverse();
    
    reversedData.forEach((d, idx) => {
        // Fondo alternado para filas
        if (idx % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(40, y, 762, 20, 'F');
        }
        
        let rowX = 45;
        doc.text(formatDate(d.date), rowX, y + 13); rowX += headers[0].w;
        doc.text(`${d.weight} kg`, rowX, y + 13); rowX += headers[1].w;
        doc.text(`${d.back} cm`, rowX, y + 13); rowX += headers[2].w;
        doc.text(`${d.chest} cm`, rowX, y + 13); rowX += headers[3].w;
        doc.text(`${d.waist} cm`, rowX, y + 13); rowX += headers[4].w;
        doc.text(`${d.quad} cm`, rowX, y + 13); rowX += headers[5].w;
        doc.text(`${d.bicepsFlex} cm`, rowX, y + 13); rowX += headers[6].w;
        doc.text(`${d.bicepsRel} cm`, rowX, y + 13); rowX += headers[7].w;
        
        // Truncar notas largas
        let noteText = d.notes || '';
        if (noteText.length > 60) {
            noteText = noteText.substring(0, 57) + '...';
        }
        doc.text(noteText, rowX, y + 13);
        
        // Línea divisoria sutil
        doc.setDrawColor(226, 232, 240);
        doc.line(40, y + 20, 802, y + 20);
        
        y += 20;
        
        // Nueva página si sobrepasa el límite
        if (y > 520) {
            doc.addPage();
            y = 50;
            
            // Repetir encabezados en nueva página
            doc.setFillColor(30, 41, 59);
            doc.rect(40, y, 762, 25, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            
            let newPageX = 45;
            headers.forEach(h => {
                doc.text(h.title, newPageX, y + 16);
                newPageX += h.w;
            });
            
            y += 25;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(30, 41, 59);
        }
    });

    // Guardar PDF
    doc.save('registro_progreso_fisico.pdf');
}
