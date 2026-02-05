(function() {
    // Prevent multiple executions
    if (window.googleTranslateLoaded) return;
    window.googleTranslateLoaded = true;
    
    // Function to clean up Google Translate
    function cleanupGoogleTranslate() {
        const scripts = document.querySelectorAll('script[src*="translate.google.com"]');
        scripts.forEach(script => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        });
        
        const iframes = document.querySelectorAll('iframe.goog-te-banner-frame, iframe.goog-te-menu-frame');
        iframes.forEach(iframe => {
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
        });
        
        const styleSheets = document.querySelectorAll('link[href*="translate.googleapis.com"], style[data-href*="translate.googleapis.com"]');
        styleSheets.forEach(style => {
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        });
    }
    
    // Clean up on page unload
    window.addEventListener('beforeunload', cleanupGoogleTranslate);
})();