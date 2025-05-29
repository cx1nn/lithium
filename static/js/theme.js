function applySettings() {
    const savedTitle = localStorage.getItem("cloakTitle");
    const savedFavicon = localStorage.getItem("cloakFavicon");
    const selectedTheme = localStorage.getItem("selectedTheme");

    if (savedTitle) {
        document.title = savedTitle;
    }

    if (savedFavicon) {
        let faviconLink = document.querySelector("link[rel='shortcut icon']");
        if (!faviconLink) {
            faviconLink = document.createElement("link");
            faviconLink.rel = "shortcut icon";
            document.head.appendChild(faviconLink);
        }
        faviconLink.href = savedFavicon;
    }
}

function applyTheme(theme) {
    console.log('🎨 Attempting to load theme:', theme);
    fetch('./themes.json')
        .then(response => response.json())
        .then(data => {
            var linkElement = document.querySelector("link[rel='stylesheet']");
            if (data[theme]) {
                console.log('✅ Found theme in themes.json:', theme);
                console.log('📁 Loading CSS file:', data[theme]);
                linkElement.href = data[theme];
                console.log('✨ Theme applied successfully');
            } else {
                console.warn('⚠️ Theme not found:', theme);
                console.log('🔄 Falling back to default theme');
                linkElement.href = data["default"];
            }
        })
        .catch(error => {
            console.error('❌ Error loading themes.json:', error);
            console.error('🔍 Stack trace:', error.stack);
        });
}

window.onload = function() {
    console.log('🚀 Initializing theme system...');
    console.log('📦 Current localStorage values:');
    console.log('   📝 Title:', localStorage.getItem("cloakTitle"));
    console.log('   🖼️ Favicon:', localStorage.getItem("cloakFavicon"));
    console.log('   🎨 Theme:', localStorage.getItem("selectedTheme"));
    
    applySettings();
    const savedTheme = localStorage.getItem("selectedTheme");
    console.log('💾 Retrieved saved theme from localStorage:', savedTheme);
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        console.log('ℹ️ No saved theme found, using default');
        applyTheme('default');
    }
}; 