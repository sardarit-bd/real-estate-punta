// function TranslateInit() {
//     if (typeof window === "undefined") return;
    
//     if (!window.__GOOGLE_TRANSLATION_CONFIG__) {
//         return;
//     }
//     new google.translate.TranslateElement({
//         pageLanguage: window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage,
//     });
// }
function TranslateInit() {
  if (window.__GOOGLE_TRANSLATION_INITIALIZED__) return;

  window.__GOOGLE_TRANSLATION_INITIALIZED__ = true;

  new google.translate.TranslateElement(
    {
      pageLanguage: window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage,
      autoDisplay: false,
    },
    "google_translate_element"
  );
}

