/**
 * Internationalization (i18n) Module for FBL Hexplorer Companion
 * Provides language detection, translation, and language switching functionality
 */

// --- i18n State ---
let currentLanguage = 'pt';
let translations = null;
const STORAGE_KEY = 'fbl-hexplorer-lang';

// --- Load Translations ---
async function loadTranslations() {
    try {
        const response = await fetch('locales.json');
        translations = await response.json();
        return true;
    } catch (error) {
        console.error('Failed to load translations:', error);
        return false;
    }
}

// --- Get Translation ---
function t(key, ...args) {
    if (!translations || !translations[currentLanguage]) {
        return key;
    }

    let text = translations[currentLanguage][key];
    if (text === undefined) {
        // Fallback to Portuguese
        text = translations['pt'][key];
    }
    if (text === undefined) {
        return key;
    }

    // Replace placeholders like {0}, {1}, etc.
    args.forEach((arg, index) => {
        text = text.replace(`{${index}}`, arg);
    });

    return text;
}

// --- Set Language ---
function setLanguage(lang) {
    if (!translations || !translations[lang]) {
        console.warn(`Language '${lang}' not available, falling back to 'pt'`);
        lang = 'pt';
    }

    currentLanguage = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-br' : 'en';

    // Apply translations to DOM
    applyTranslations();

    // Update language button state in modal
    updateLangModalState();

    // Dispatch event for other modules to react
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// --- Get Current Language ---
function getCurrentLanguage() {
    return currentLanguage;
}

// --- Apply Translations to DOM ---
function applyTranslations() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = t(key);

        // Check if the element should use innerHTML or textContent
        if (el.hasAttribute('data-i18n-html')) {
            el.innerHTML = translated;
        } else {
            el.textContent = translated;
        }
    });

    // Update all elements with data-i18n-title attribute (for tooltips)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });

    // Update all elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
}

// --- Update Language Modal State ---
function updateLangModalState() {
    document.querySelectorAll('.lang-option').forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// --- Detect User Language ---
async function detectUserLanguage() {
    // 1. Check localStorage for saved preference
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && (savedLang === 'pt' || savedLang === 'en')) {
        return savedLang;
    }

    // 2. Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
        const langCode = browserLang.toLowerCase();
        if (langCode.startsWith('pt')) {
            return 'pt';
        }
    }

    // 3. Try geolocation via free API (optional, fallback to browser lang if fails)
    try {
        const response = await fetch('https://ipapi.co/json/', {
            timeout: 3000,
            cache: 'no-store'
        });

        if (response.ok) {
            const data = await response.json();
            const country = data.country_code?.toUpperCase();

            // Brazil and Portugal get Portuguese
            if (country === 'BR' || country === 'PT') {
                return 'pt';
            }
        }
    } catch (error) {
        // Geolocation failed, continue with default
        console.log('Geolocation detection failed, using browser language');
    }

    // 4. Default to English if browser is not Portuguese
    return 'en';
}

// --- Setup Language Modal ---
function setupLangModal() {
    const modal = document.getElementById('lang-modal');
    const btnLang = document.getElementById('btn-lang');
    const btnLangOnboarding = document.getElementById('btn-lang-onboarding');
    const closeBtn = modal ? modal.querySelector('.close-button') : null;

    // Open modal from header button
    if (btnLang) {
        btnLang.addEventListener('click', () => {
            if (modal) modal.style.display = 'block';
            updateLangModalState();
        });
    }

    // Open modal from onboarding button
    if (btnLangOnboarding) {
        btnLangOnboarding.addEventListener('click', () => {
            if (modal) modal.style.display = 'block';
            updateLangModalState();
        });
    }

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }

    // Click outside to close
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Language option buttons
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);

            // Close modal after selection
            if (modal) modal.style.display = 'none';
        });
    });
}

// --- Initialize i18n ---
async function initI18n() {
    // Load translations
    await loadTranslations();

    // Detect and set initial language
    const detectedLang = await detectUserLanguage();
    currentLanguage = detectedLang;

    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage === 'pt' ? 'pt-br' : 'en';

    // Apply translations immediately
    applyTranslations();

    // Setup modal
    setupLangModal();

    // Save detected language if not already saved
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, currentLanguage);
    }

    // Dispatch event so dynamic content can update (e.g., month select)
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLanguage } }));

    console.log(`i18n initialized with language: ${currentLanguage}`);
}

// --- Expose functions globally ---
window.t = t;
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.applyTranslations = applyTranslations;

// --- Initialize on DOM Ready ---
document.addEventListener('DOMContentLoaded', initI18n);
