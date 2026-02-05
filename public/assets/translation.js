window.__GOOGLE_TRANSLATION_CONFIG__ = {
    languages: [
        { title: 'English', name: 'en' },
        { title: 'Bengali', name: 'bn' },
        { title: 'Deutsch', name: 'de' },
        { title: 'Español', name: 'es' },
        { title: 'Français', name: 'fr' },
        { title: 'Arabic', name: 'ar' },
    ],
    defaultLanguage: 'en',
};

function TranslateInit() {
    if (!window.__GOOGLE_TRANSLATION_CONFIG__) return;
    
    // Check if Google Translate already exists
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        try {
            new google.translate.TranslateElement({
                pageLanguage: window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage,
                includedLanguages: 'en,bn,es,de,fr,ar',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false, // Important: prevent auto widget
                multilanguagePage: true
            }, 'google_translate_element');
            
            // Hide the widget
            setTimeout(() => {
                const widget = document.querySelector('.goog-te-banner-frame');
                if (widget) widget.style.display = 'none';
            }, 100);
        } catch (error) {
            console.warn('Google Translate init error:', error);
        }
    }
}

// Prevent duplicate initialization
let translateInitialized = false;
if (!translateInitialized) {
    translateInitialized = true;
}