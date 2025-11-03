document.addEventListener('DOMContentLoaded', () => {
    const fileInputs = document.querySelectorAll('.inscripcion-form__input--file');

    fileInputs.forEach(input => {
        input.addEventListener('change', (event) => {
            const fileNameSpan = event.target.nextElementSibling;
            const fileName = event.target.files.length > 0 ? event.target.files[0].name : 'Ningún archivo seleccionado';
            fileNameSpan.textContent = fileName;
        });
    });
});