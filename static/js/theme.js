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

// --- Custom Theme Support ---
const customThemeVars = [
  { css: '--bg-gradient', input: 'custom-bg-gradient' },
  { css: '--text-color', input: 'custom-text-color' },
  { css: '--accent-color', input: 'custom-accent-color' },
  { css: '--input-bg', input: 'custom-input-bg' },
  { css: '--input-border', input: 'custom-input-border' },
  { css: '--input-hover-bg', input: 'custom-input-hover-bg' },
  { css: '--glow-color', input: 'custom-glow-color' },
  { css: '--category-title-gradient', input: 'custom-category-title-gradient' },
  { css: '--category-bg', input: 'custom-category-bg' },
  { css: '--app-bg', input: 'custom-app-bg' },
  { css: '--app-border', input: 'custom-app-border' },
  { css: '--app-hover-bg', input: 'custom-app-hover-bg' },
  { css: '--app-hover-border', input: 'custom-app-hover-border' },
  { css: '--app-shadow', input: 'custom-app-shadow' },
  { css: '--app-hover-shadow', input: 'custom-app-hover-shadow' },
];

function applyCustomTheme(theme) {
  customThemeVars.forEach(({ css, input }) => {
    if (theme && theme[input] !== undefined) {
      document.documentElement.style.setProperty(css, theme[input]);
    }
  });
}

function loadCustomTheme() {
    const theme = JSON.parse(localStorage.getItem('customTheme') || '{}');
    console.log('🎨 Loaded custom theme from localStorage:', theme);
    if (Object.keys(theme).length > 0) {
      applyCustomTheme(theme);
    } else {
      console.warn('⚠️ Custom theme was empty or malformed');
    }
  }

function applyTheme(theme) {
    if (theme === 'custom') {
        loadCustomTheme();
        return;
    }
    console.log('🎨 Attempting to load theme:', theme);
    fetch('./json/themes.json')
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