
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-image');
    const span = document.getElementsByClassName('close')[0];
    const filterButtons = document.querySelectorAll('.filter-button');
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Event delegation for gallery item clicks
    galleryGrid.addEventListener('click', event => {
        if (event.target.classList.contains('gallery-item__image')) {
            modal.style.display = 'block';
            modalImg.src = event.target.src;
        }
    });

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter images
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});
