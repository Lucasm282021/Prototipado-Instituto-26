<div align="center">

# Trabajo de Investigación  
**Análisis de sitio web I.S.F.D. y T. 26**  
[https://isfd26-bue.infd.edu.ar/sitio/](https://isfd26-bue.infd.edu.ar/sitio/)  
**Autor:** Lucas Montero  
**Fecha:** 20 de Septiembre 2025  

</div>

## Tablero de Control  
🔗 [Tablero de Prácticas Profesionalizantes](https://trello.com/b/fTic7Sgi/tablero-practicas-profesionalizantes)
---
### 1. Propósito y público objetivo  
- **Objetivo declarado:** Sitio institucional I.S.F.D. y T. 26  
- **Público objetivo:** Alumnos y Docentes  
- **Problemas detectados:**  
  - No hay una narrativa clara ni estructura funcional que guíe al usuario

---

### 2. Evaluación visual inicial  
- Estructura poco amigable  
- No hay distinción clara entre secciones prioritarias y secundarias  
- El diseño no guía al usuario hacia una acción principal (inscribirse, consultar carreras, etc.)  
- Sección principal con banner institucional desactualizado  
- Enlaces de contacto y Facebook poco legibles  

---

### 3. Arquitectura de la información  
- **Navegación confusa:** Menú sin categorías claras, estructura laberíntica  
- **Barra de navegación:** Demasiados ítems, muchos poco funcionales  
- **Inicio:** Información poco relevante y desordenada  
- **Carreras:** Vínculos a PDF o errores 404  
- **Oferta Académica 2025:** Imagen poco intuitiva, redirección externa y enlace roto  
- **Inscripción 2025:** Información desactualizada, enlaces no funcionales  
- **Campus Virtual:** Sin posibilidad de crear usuario  
- **Alumnos:** Información relevante pero poco intuitiva  
- **Docentes:** Contenido útil con instructivos y submenús  
- **Convocatoria Aspirante Docente:** Documentos PDF sin contexto  
- **Diseños Curriculares / Documento Marco:** Enlaces a PDF sin explicación  
- **Galería de Imágenes:** Sin contexto  
- **Contacto:** Formulario posiblemente mal codificado  
- **Cl26 / Radio 26 / Clases Abiertas 2024:** Enlaces desactualizados  
- **Consejo Académico:** Información obsoleta  
- **Clases Virtuales 2025:** Enlaces disponibles para alumnos  

---

### 4. Adaptabilidad y accesibilidad  
- Diseño poco o nulo responsivo en móviles  
- Contraste insuficiente para usuarios con baja visión  
- Navegación por teclado: cumple estándares mínimos  

---

### 5. Informe de Accesibilidad y SEO para Aplicación Web  
**Auditoría automatizada: Lighthouse (Desktop / Mobile)**  

#### Accesibilidad  
- **Problemas detectados:**  
  - Relación de contraste insuficiente  
  - Enlaces sin texto descriptivo  
  - Elementos interactivos no accesibles por teclado  
  - Uso incorrecto de `aria-label`, roles y atributos semánticos  
- **Recomendaciones:**  
  - Asegurar contraste mínimo de 4.5:1 (texto normal) y 3:1 (texto grande)  
  - Verificar accesibilidad por teclado  
  - Revisar semántica y roles  

#### SEO  
- **Problemas detectados:**  
  - Ausencia de metadescripción  
- **Recomendaciones:**  
  - Agregar etiqueta `<meta name="description">` en el `<head>`  
  - Mantener entre 150 y 160 caracteres con palabras clave relevantes  

---

### 6. Percepción del usuario  
- Frustración: Dificultad para encontrar información  
- Falta de confianza: Diseño descuidado  
- Ausencia de llamados a la acción (CTA) claros  

---

### 7. Propuesta de mejora  
- Rediseñar arquitectura visual con bloques funcionales y jerarquía clara  
- Validar semánticamente formularios y retroalimentación visual  
- Optimizar tiempos de carga y aplicar estándares WCAG  
- Documentar componentes con leyendas modulares y nomenclatura BEM  

---

### 8. Prototipado  
🔗 [Vista del Prototipo Funcional](https://prototipado-instituto-26.vercel.app)

---
