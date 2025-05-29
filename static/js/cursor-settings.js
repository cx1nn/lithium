document.addEventListener('DOMContentLoaded', () => {
    // Remove the old cursorStyles definition and selector creation
    // const cursorStyles = [
    //     { id: 'style-1', name: 'Circle', class: 'cursor-style-1' },
    //     { id: 'style-2', name: 'Diamond', class: 'cursor-style-2' },
    //     { id: 'style-3', name: 'Diamond Fill', class: 'cursor-style-3' },
    //     { id: 'style-4', name: 'Square', class: 'cursor-style-4' }
    // ];

    // Remove the old selector creation and insertion
    // const selector = document.createElement('div');
    // selector.className = 'cursor-style-selector';
    // cursorStyles.forEach(style => {
    //     const option = document.createElement('div');
    //     option.className = 'cursor-option';
    //     option.dataset.style = style.id;
    //     const preview = document.createElement('div');
    //     preview.className = `cursor ${style.class}`;
    //     preview.style.position = 'relative';
    //     preview.style.left = '50%';
    //     preview.style.top = '50%';
    //     preview.style.transform = 'translate(-50%, -50%)';
    //     const label = document.createElement('div');
    //     label.textContent = style.name;
    //     label.style.textAlign = 'center';
    //     label.style.marginTop = '10px';
    //     option.appendChild(preview);
    //     option.appendChild(label);
    //     selector.appendChild(option);
    // });

    // Select the existing preview container
    const previewContainer = document.querySelector('.cursor-preview');
    
    // Remove the old insertion of elements
    // const container = document.querySelector('.container');
    // container.insertBefore(selector, container.firstChild);
    // container.insertBefore(previewContainer, selector);

    const cursorSelect = document.getElementById('cursorStyle');

    // Create preview cursor element with a distinct class
    const previewCursor = document.createElement('div');
    previewCursor.className = 'cursor preview-cursor'; // Use both base and preview classes
    // Initially hide the preview cursor
    previewCursor.style.display = 'none';
    previewContainer.appendChild(previewCursor);

    // Find the main cursor elements
    const mainCursor = document.querySelector('.cursor:not(.preview-cursor)');
    const mainCursorDot = document.querySelector('.cursor-dot:not(.preview-cursor-dot)'); // Assuming there's a dot for the main cursor as well

    // Load saved cursor style
    const savedStyle = localStorage.getItem('cursorStyle') || 'style-1';
    cursorSelect.value = savedStyle;
    const styleNumber = savedStyle.split('-')[1];
    const initialClassName = `cursor-style-${styleNumber}`;
    
    // Apply initial style to both cursors
    if(mainCursor) {
        mainCursor.classList.add(initialClassName);
    }
    // Add the initial style class to the preview cursor (it also has .cursor and .preview-cursor)
    previewCursor.classList.add(initialClassName);

    // Handle cursor style selection
    cursorSelect.addEventListener('change', (e) => {
        const styleId = e.target.value;
        const styleNumber = styleId.split('-')[1];
        const newStyleClassName = `cursor-style-${styleNumber}`;
        
        // Update the main cursor class (remove old style, add new style)
        if(mainCursor) {
             mainCursor.classList.forEach(cls => {
                if (cls.startsWith('cursor-style-')) {
                    mainCursor.classList.remove(cls);
                }
            });
            mainCursor.classList.add(newStyleClassName);
        }

        // Update the preview cursor class (remove old style, add new style)
        previewCursor.classList.forEach(cls => {
            if (cls.startsWith('cursor-style-')) {
                previewCursor.classList.remove(cls);
            }
        });
        previewCursor.classList.add(newStyleClassName);

        localStorage.setItem('cursorStyle', styleId);
    });

    // Preview cursor movement within preview container
    previewContainer.addEventListener('mousemove', (e) => {
        const rect = previewContainer.getBoundingClientRect();
        // Calculate mouse position relative to the preview container
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update preview cursor position
        // Adjust by half the cursor size to center it on the mouse
        const cursorSize = previewCursor.offsetWidth; // Get the actual width of the preview cursor element
        previewCursor.style.left = (x - cursorSize / 2) + 'px';
        previewCursor.style.top = (y - cursorSize / 2) + 'px';
    });

    // Show preview cursor and hide main cursor on mouseenter
    previewContainer.addEventListener('mouseenter', () => {
        if(mainCursor) mainCursor.style.display = 'none';
        if(mainCursorDot) mainCursorDot.style.display = 'none'; // Hide the dot as well
        previewCursor.style.display = 'block';
        previewCursor.classList.add('hover'); // Apply hover effect on enter
    });

    // Hide preview cursor and show main cursor on mouseleave
    previewContainer.addEventListener('mouseleave', () => {
        if(mainCursor) mainCursor.style.display = ''; // Use empty string to revert to default display
        if(mainCursorDot) mainCursorDot.style.display = ''; // Show the dot again
        previewCursor.style.display = 'none';
        previewCursor.classList.remove('hover'); // Remove hover effect on leave
    });

    // Add click effect to preview cursor
    previewContainer.addEventListener('mousedown', () => {
        previewCursor.classList.add('click');
    });

    previewContainer.addEventListener('mouseup', () => {
        previewCursor.classList.remove('click');
    });
}); 