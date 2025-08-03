// js/custom-theme.js

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
    { css: '--app-hover-shadow', input: 'custom-app-hover-shadow' }
  ];
  
  function saveCustomTheme() {
    const theme = {};
    customThemeVars.forEach(({ css, input }) => {
      const val = document.getElementById(input)?.value;
      if (val !== undefined) theme[input] = val;
    });
    localStorage.setItem('customTheme', JSON.stringify(theme));
    console.log('Theme saved:', theme);
  }
  
  function loadCustomTheme() {
    const stored = localStorage.getItem('customTheme');
    if (!stored) return;
    const theme = JSON.parse(stored);
    Object.entries(theme).forEach(([input, val]) => {
      const el = document.getElementById(input);
      if (el) {
        el.value = val;
        if (!input.includes('gradient') && !input.includes('shadow')) {
          document.documentElement.style.setProperty(`--${input.replace('custom-', '')}`, val);
        }
      }
    });
    document.getElementById('custom-bg-gradient').dispatchEvent(new Event('input'));
    document.getElementById('custom-app-shadow').dispatchEvent(new Event('input'));
    document.getElementById('custom-app-hover-shadow').dispatchEvent(new Event('input'));
  }
  
  function updateGradientInput() {
    const start = document.getElementById('gradient-start').value;
    const end = document.getElementById('gradient-end').value;
    const gradient = `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
    document.getElementById('custom-bg-gradient').value = gradient;
    document.getElementById('gradient-preview').style.background = gradient;
    document.documentElement.style.setProperty('--bg-gradient', gradient);
  }
  
  function syncGradientPickers() {
    const gradient = document.getElementById('custom-bg-gradient').value;
    const match = gradient.match(/linear-gradient\(135deg, (#[0-9a-fA-F]+) 0%, (#[0-9a-fA-F]+) 100%\)/);
    if (match) {
      document.getElementById('gradient-start').value = match[1];
      document.getElementById('gradient-end').value = match[2];
      document.getElementById('gradient-preview').style.background = gradient;
    }
  }
  
  function updateShadowInput() {
    const blur = document.getElementById('app-shadow-blur').value;
    const color = document.getElementById('app-shadow-color').value;
    const shadow = `0 0 ${blur}px ${hexToRgba(color, 0.2)}`;
    document.getElementById('custom-app-shadow').value = shadow;
    document.getElementById('app-shadow-preview').style.boxShadow = shadow;
    document.documentElement.style.setProperty('--app-shadow', shadow);
  }
  
  function updateHoverShadowInput() {
    const blur = document.getElementById('app-hover-shadow-blur').value;
    const color = document.getElementById('app-hover-shadow-color').value;
    const shadow = `0 0 ${blur}px ${hexToRgba(color, 0.3)}`;
    document.getElementById('custom-app-hover-shadow').value = shadow;
    document.getElementById('app-hover-shadow-preview').style.boxShadow = shadow;
    document.documentElement.style.setProperty('--app-hover-shadow', shadow);
  }
  
  function syncShadowPickers() {
    const val = document.getElementById('custom-app-shadow').value;
    const match = val.match(/0 0 (\d+)px rgba?\((\d+), ?(\d+), ?(\d+), ?([\d.]+)\)/);
    if (match) {
      document.getElementById('app-shadow-blur').value = match[1];
      document.getElementById('app-shadow-color').value = rgbToHex(match[2], match[3], match[4]);
      document.getElementById('app-shadow-preview').style.boxShadow = val;
    }
    const val2 = document.getElementById('custom-app-hover-shadow').value;
    const match2 = val2.match(/0 0 (\d+)px rgba?\((\d+), ?(\d+), ?(\d+), ?([\d.]+)\)/);
    if (match2) {
      document.getElementById('app-hover-shadow-blur').value = match2[1];
      document.getElementById('app-hover-shadow-color').value = rgbToHex(match2[2], match2[3], match2[4]);
      document.getElementById('app-hover-shadow-preview').style.boxShadow = val2;
    }
  }
  
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  
  function rgbToHex(r, g, b) {
    return (
      '#' +
      Number(r).toString(16).padStart(2, '0') +
      Number(g).toString(16).padStart(2, '0') +
      Number(b).toString(16).padStart(2, '0')
    );
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    customThemeVars.forEach(({ css, input }) => {
      const el = document.getElementById(input);
      if (el) {
        el.addEventListener('input', () => {
          if (!input.includes('gradient') && !input.includes('shadow')) {
            document.documentElement.style.setProperty(css, el.value);
          }
        });
      }
    });
  
    document.getElementById('gradient-start').addEventListener('input', updateGradientInput);
    document.getElementById('gradient-end').addEventListener('input', updateGradientInput);
    document.getElementById('custom-bg-gradient').addEventListener('input', syncGradientPickers);
    document.getElementById('app-shadow-blur').addEventListener('input', updateShadowInput);
    document.getElementById('app-shadow-color').addEventListener('input', updateShadowInput);
    document.getElementById('app-hover-shadow-blur').addEventListener('input', updateHoverShadowInput);
    document.getElementById('app-hover-shadow-color').addEventListener('input', updateHoverShadowInput);
    document.getElementById('custom-app-shadow').addEventListener('input', syncShadowPickers);
    document.getElementById('custom-app-hover-shadow').addEventListener('input', syncShadowPickers);
  
    if (localStorage.getItem('customTheme')) {
      loadCustomTheme();
      syncShadowPickers();
      syncGradientPickers();
    } else {
      updateGradientInput();
      updateShadowInput();
      updateHoverShadowInput();
    }
  });
  