(() => {
  const storageKey = "dv_lang";

  const getDefaultLang = () => {
    if (window.DV_I18N && window.DV_I18N.defaultLang) {
      return window.DV_I18N.defaultLang;
    }
    return "fr";
  };

  const getStringsFor = (lang) => {
    if (!window.DV_I18N || !window.DV_I18N.strings) return {};
    return window.DV_I18N.strings[lang] || {};
  };

  const resolve = (lang, key, fallback = "") => {
    const current = getStringsFor(lang);
    const defaults = getStringsFor(getDefaultLang());
    if (Object.prototype.hasOwnProperty.call(current, key)) return current[key];
    if (Object.prototype.hasOwnProperty.call(defaults, key)) return defaults[key];
    return fallback;
  };

  let currentLang = null;

  const applyTranslations = (lang) => {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const fallback = el.textContent;
      const value = resolve(lang, key, fallback);
      if (value !== null && value !== undefined) {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const fallback = el.innerHTML;
      const value = resolve(lang, key, fallback);
      if (value !== null && value !== undefined) {
        el.innerHTML = value;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const fallback = el.getAttribute("placeholder") || "";
      const value = resolve(lang, key, fallback);
      if (value !== null && value !== undefined) {
        el.setAttribute("placeholder", value);
      }
    });

    document.querySelectorAll("[data-i18n-value]").forEach((el) => {
      const key = el.getAttribute("data-i18n-value");
      const fallback = el.value || "";
      const value = resolve(lang, key, fallback);
      if (value !== null && value !== undefined) {
        el.value = value;
      }
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      const fallback = el.getAttribute("alt") || "";
      const value = resolve(lang, key, fallback);
      if (value !== null && value !== undefined) {
        el.setAttribute("alt", value);
      }
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      const fallback = el.getAttribute("title") || "";
      const value = resolve(lang, key, fallback);
      if (value !== null && value !== undefined) {
        el.setAttribute("title", value);
      }
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      const fallback = el.getAttribute("aria-label") || "";
      const value = resolve(lang, key, fallback);
      if (value !== null && value !== undefined) {
        el.setAttribute("aria-label", value);
      }
    });

    const titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) {
      const key = titleEl.getAttribute("data-i18n");
      const fallback = document.title;
      const value = resolve(lang, key, fallback);
      if (value) document.title = value;
    }

    document.dispatchEvent(new CustomEvent("dv:lang-change", { detail: { lang } }));
  };

  const setLanguage = (lang) => {
    if (!lang) return;
    localStorage.setItem(storageKey, lang);
    applyTranslations(lang);
  };

  const getLanguage = () => currentLang || getDefaultLang();

  window.dvI18n = {
    t: (key, fallback = "") => resolve(getLanguage(), key, fallback),
    setLanguage,
    getLanguage
  };

  const initI18n = () => {
    const saved = localStorage.getItem(storageKey);
    const initial = saved || getDefaultLang();
    applyTranslations(initial);

    const langBtn = document.getElementById("lang-btn");
    const langMenu = document.getElementById("lang-menu");

    if (langBtn && langMenu) {
      langBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        langMenu.classList.toggle("show");
        langBtn.setAttribute("aria-expanded", langMenu.classList.contains("show"));
      });

      document.addEventListener("click", (e) => {
        if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
          langMenu.classList.remove("show");
          langBtn.setAttribute("aria-expanded", "false");
        }
      });

      langMenu.querySelectorAll("li").forEach((item) => {
        item.addEventListener("click", () => {
          const lang = item.dataset.lang;
          setLanguage(lang);
          langMenu.classList.remove("show");
          langBtn.setAttribute("aria-expanded", "false");
        });
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initI18n);
  } else {
    initI18n();
  }
})();
