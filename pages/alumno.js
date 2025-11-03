document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    // Datos simulados para el gráfico
    const data = {
        labels: ['Programación I', 'Diseño Web', 'Base de Datos I', 'Inglés Técnico', 'Matemática I', 'Estadística'],
        datasets: [{
            label: 'Calificación Final',
            data: [8, 9, 7, 10, 6, 8], // Calificaciones de ejemplo
            backgroundColor: 'rgba(0, 51, 102, 0.7)',
            borderColor: 'rgba(0, 51, 102, 1)',
            borderWidth: 2,
            borderRadius: 5,
            hoverBackgroundColor: 'rgba(0, 85, 153, 0.9)'
        }]
    };

    // Opciones de configuración del gráfico
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                ticks: {
                    stepSize: 1,
                    color: '#333'
                },
                grid: {
                    color: '#ddd'
                }
            },
            x: {
                ticks: {
                    color: '#333'
                },
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false // Ocultar leyenda para un look más limpio
            },
            tooltip: {
                backgroundColor: '#003366',
                titleColor: '#fff',
                bodyColor: '#fff',
                callbacks: {
                    label: function(context) {
                        return `Calificación: ${context.raw}`;
                    }
                }
            }
        }
    };

    // Crear el gráfico
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
});