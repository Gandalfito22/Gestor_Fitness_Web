# 💪 Gestor Fitness — Dashboard de Progreso Físico

> Dashboard premium para el registro y seguimiento de medidas corporales, con visualización interactiva de progreso y exportación de datos.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

---

## 📋 Descripción

**Gestor Fitness** es una aplicación web de página única (SPA) diseñada para llevar un control detallado del progreso físico personal. Permite registrar medidas corporales con fecha, visualizar su evolución en el tiempo mediante gráficos interactivos y exportar los datos en formato CSV o PDF.

Todo el almacenamiento de datos se realiza localmente en el navegador a través de `localStorage`, sin necesidad de servidor ni base de datos externa.

---

## ✨ Características

- 📅 **Registro de mediciones** con fecha y campos detallados de medidas corporales
- 📊 **Gráfico interactivo** con Chart.js para visualizar la evolución de cualquier métrica
- 📋 **Historial de registros** con tabla navegable (los más recientes primero)
- 🔍 **Vista de detalles** al hacer clic en cualquier registro del historial
- 🗑️ **Eliminación de registros** con confirmación de seguridad
- 📤 **Exportación a CSV** (compatible con Excel, con soporte BOM UTF-8)
- 📄 **Exportación a PDF** con tabla formateada y cabecera con fecha del reporte
- 💾 **Persistencia local** mediante `localStorage` (sin necesidad de internet)
- 📱 **Diseño responsive** adaptado a móvil, tablet y escritorio

---

## 📏 Métricas Registradas

Cada entrada registra los siguientes datos:

| Campo              | Unidad | Descripción                      |
|--------------------|--------|----------------------------------|
| Fecha              | —      | Fecha de la medición             |
| Peso               | kg     | Peso corporal total              |
| Ancho Espalda      | cm     | Perímetro o ancho de espalda     |
| Pecho              | cm     | Perímetro pectoral               |
| Cintura            | cm     | Perímetro de cintura             |
| Cuádriceps         | cm     | Perímetro del muslo              |
| Bíceps Contraído   | cm     | Bíceps en contracción máxima     |
| Bíceps Relajado    | cm     | Bíceps en reposo                 |
| Notas              | —      | Comentarios o contexto libre     |

---

## 🗂️ Estructura del Proyecto

```
Gestor Fitness Pagina Web/
├── Gestor_Fitness.html   # Estructura HTML principal de la aplicación
├── style.css             # Estilos premium con glassmorphism y animaciones
├── app.js                # Lógica de la aplicación (datos, gráficos, exportación)
└── README.md             # Este archivo
```

---

## 🚀 Cómo Usar

Al ser una aplicación puramente estática, no requiere instalación ni servidor:

1. **Clona o descarga** este repositorio.
2. **Abre** el archivo `Gestor_Fitness.html` directamente en cualquier navegador moderno (Chrome, Firefox, Edge, Safari).
3. ¡Listo! La aplicación funciona de inmediato.

> **Nota:** No se necesita conexión a internet (excepto para cargar las fuentes de Google Fonts y las librerías CDN la primera vez).

---

## 🛠️ Tecnologías Utilizadas

| Tecnología     | Versión    | Uso                                          |
|----------------|------------|----------------------------------------------|
| HTML5          | —          | Estructura semántica de la aplicación        |
| CSS3           | —          | Estilos, glassmorphism, animaciones          |
| JavaScript     | ES6+       | Lógica de la app, manipulación del DOM       |
| Chart.js       | Latest CDN | Gráficos de líneas interactivos              |
| jsPDF          | 2.5.1      | Generación de documentos PDF                 |
| Google Fonts   | Outfit     | Tipografía premium                           |

---

## 🎨 Diseño

La interfaz utiliza un estilo **dark mode premium** con los siguientes elementos:

- **Fondo animado** con gradiente de 4 colores en movimiento continuo (`gradientBG`)
- **Glassmorphism** en las tarjetas (transparencia + blur)
- **Paleta de colores:**
  - Violeta vibrante: `#8b5cf6`
  - Cyan acento: `#06b6d4`
  - Verde éxito: `#10b981`
  - Rojo peligro: `#f43f5e`
- **Micro-animaciones** en hover de tarjetas, filas e inputs
- **Tipografía** Outfit (Google Fonts) en pesos 300–800

---

## 📤 Exportación de Datos

### CSV
El archivo exportado (`registro_progreso_fisico.csv`) incluye todas las métricas con cabeceras en español. Lleva BOM UTF-8 para garantizar compatibilidad con Microsoft Excel y evitar problemas con acentos y caracteres especiales.

### PDF
El PDF (`registro_progreso_fisico.pdf`) se genera en formato **A4 horizontal** con:
- Cabecera con título y fecha de generación del reporte
- Tabla con todas las métricas y notas
- Filas con color alternado para facilitar la lectura
- Soporte de múltiples páginas automático

---

## 📝 Notas de Comportamiento

- Si se intenta guardar una medición para una **fecha ya registrada**, la app pregunta si se desea sobrescribir.
- Los registros se ordenan **cronológicamente** para los gráficos (del más antiguo al más reciente).
- En la tabla del historial, los registros se muestran del **más reciente al más antiguo** para facilitar la revisión.
- Al hacer clic en una fila ya seleccionada, se **deselecciona** el registro.

---

## 📄 Licencia

Este proyecto es de uso personal. No tiene una licencia open-source definida.

---

*Creado con ❤️ para el seguimiento del progreso físico personal.*
