document.addEventListener('DOMContentLoaded', () => {
    // Always show the cursor settings section if it exists
    const cursorSection = document.querySelector('.settings-section h2 i.fas.fa-mouse-pointer')?.closest('.settings-section');
    if (cursorSection) cursorSection.style.display = '';

    // Select the existing preview container
    const previewContainer = document.querySelector('.cursor-preview');
    const cursorSelect = document.getElementById('cursorStyle');

    // Create preview cursor element with a distinct class
    const previewCursor = document.createElement('div');
    previewCursor.className = 'cursor preview-cursor';
    previewCursor.style.display = 'none';
    previewContainer.appendChild(previewCursor);

    // Find the main cursor elements (may be null)
    let mainCursor = document.querySelector('.cursor:not(.preview-cursor)');
    let mainCursorDot = document.querySelector('.cursor-dot:not(.preview-cursor-dot)');

    // Helper to update cursor style classes
    function updateCursorStyle(styleId) {
        const styleNumber = styleId.split('-')[1];
        const newStyleClassName = `cursor-style-${styleNumber}`;
        // Remove all old style classes from both cursors
        if(mainCursor) {
            mainCursor.classList.forEach(cls => {
                if (cls.startsWith('cursor-style-')) mainCursor.classList.remove(cls);
            });
            mainCursor.classList.add(newStyleClassName);
        }
        previewCursor.classList.forEach(cls => {
            if (cls.startsWith('cursor-style-')) previewCursor.classList.remove(cls);
        });
        previewCursor.classList.add(newStyleClassName);
    }

    // On page load, set the preview cursor's class to match the dropdown value
    const savedStyle = localStorage.getItem('cursorStyle') || 'style-1';
    if (cursorSelect) cursorSelect.value = savedStyle;
    updateCursorStyle(savedStyle);

    // Handle cursor style selection
    if (cursorSelect) {
        cursorSelect.addEventListener('change', (e) => {
            const styleId = e.target.value;
            updateCursorStyle(styleId);
            localStorage.setItem('cursorStyle', styleId);
        });
    }

    // Preview cursor movement within preview container
    previewContainer.addEventListener('mousemove', (e) => {
        const rect = previewContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cursorSize = previewCursor.offsetWidth;
        previewCursor.style.left = (x - cursorSize / 2) + 'px';
        previewCursor.style.top = (y - cursorSize / 2) + 'px';
    });

    // Show preview cursor and hide main cursor on mouseenter
    previewContainer.addEventListener('mouseenter', () => {
        if(mainCursor) mainCursor.style.display = 'none';
        if(mainCursorDot) mainCursorDot.style.display = 'none';
        previewCursor.style.display = 'block';
        previewCursor.classList.add('hover');
        // Always update preview cursor to match dropdown
        if (cursorSelect) updateCursorStyle(cursorSelect.value);
    });

    // Hide preview cursor and show main cursor on mouseleave
    previewContainer.addEventListener('mouseleave', () => {
        if(mainCursor) mainCursor.style.display = '';
        if(mainCursorDot) mainCursorDot.style.display = '';
        previewCursor.style.display = 'none';
        previewCursor.classList.remove('hover');
    });

    // Add click effect to preview cursor
    previewContainer.addEventListener('mousedown', () => {
        previewCursor.classList.add('click');
    });
    previewContainer.addEventListener('mouseup', () => {
        previewCursor.classList.remove('click');
    });
}); 