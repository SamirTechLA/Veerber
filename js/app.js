/**
 * Veerber - Main App Logic & View Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  // Translations Dictionary for UI Language Localization
  const TRANSLATIONS = {
    en: {
      settings_title: '<i class="fa-solid fa-gear"></i> Settings',
      ui_lang_label: "UI Language",
      ui_lang_sub: "Language of buttons, labels & menus",
      target_lang_label: "Practice Language",
      target_lang_sub: "Verbs & sentences to practice",
      theme_label: "Appearance",
      theme_sub: "Switch between Light and Dark mode",
      theme_light: "Light",
      theme_dark: "Dark",
      sound_label: "Sound Effects",
      sound_sub: "Audio feedback on answers",
      sound_on: "On",
      sound_off: "Off",
      ai_section_title: "Gemini AI Assistant",
      ai_section_desc: "Enable unlimited dynamic context sentences with your free Gemini API key.",
      ai_key_placeholder: "Paste Gemini API key...",
      btn_save_verify: "Save & Verify",
      ai_status_label: "Status:",
      ai_status_enabled: "Enabled",
      ai_status_disabled: "Not Set",
      ai_status_invalid: "Invalid",
      ai_status_verifying: "Verifying...",
      ai_status_error: "Connection Error",
      get_free_key: "Get free key",
      reset_data_label: "Reset Data",
      reset_data_sub: "Clear all stats, level & XP progress",
      btn_reset: "Reset",

      config_title: '<i class="fa-solid fa-sliders"></i> Practice Setup',
      welcome_title: "Welcome! Level {level}",
      welcome_desc: "Select verbs and tenses you wish to practice, then choose a study mode.",
      filter_type_label: "Verb Type",
      type_all: "All",
      type_regular: "Regular",
      type_irregular: "Irregular",
      filter_group_label: "Ending Group",
      group_all: "All",
      filter_tense_label: "Tenses (Select at least one)",
      filter_pool_label: "Verb Pool",
      pool_all_it: "All Italian Verbs",
      pool_all_de: "All German Verbs",
      pool_struggle: "Difficult Verbs",
      pool_bookmarks: "Bookmarks",
      btn_start_quiz: '<i class="fa-solid fa-graduation-cap"></i> Start Quiz',
      btn_start_flashcards: '<i class="fa-solid fa-layer-group"></i> Flashcards',
      btn_start_sentences: '<i class="fa-solid fa-pen-to-square"></i> Complete Sentences',
      btn_go_explorer: '<i class="fa-solid fa-book-open"></i> Verb Dictionary',
      stats_title: '<i class="fa-solid fa-chart-line"></i> Your Progress',
      stat_xp_label: "Total XP",
      stat_streak_label: "Streak (Days)",
      stat_accuracy_label: "Accuracy",
      stat_attempts_label: "Exercises done",
      level_current: "Level {level}",
      level_next: "Level {level}",
      xp_to_next: "Reach {xp} XP to level up",
      struggle_title: "⚠️ Difficult Verbs",
      struggle_desc: "These verbs have an accuracy below 70%. Practice them more!",

      exit_drill_title: "Back to Dashboard",
      drill_counter_format: "Question {current} of {total}",
      drill_placeholder: "Type the conjugation...",
      btn_submit_drill: "Submit Answer",
      feedback_correct_headline: '<i class="fa-solid fa-circle-check"></i> Excellent!',
      feedback_wrong_headline: '<i class="fa-solid fa-circle-xmark"></i> Not quite!',
      feedback_correct_details: "The correct answer is <strong>{answer}</strong>.",
      loading_overlay_text: "Generating sentences with Gemini AI...",

      exit_flashcards_title: "Back to Dashboard",
      flashcards_counter_format: "Card {current} of {total}",
      flip_hint_front: '<i class="fa-solid fa-rotate-left"></i> Click to flip card',
      flip_hint_back: "Click again to flip back",
      btn_flash_fail: `<i class="fa-solid fa-xmark"></i> Didn't know it`,
      btn_flash_success: '<i class="fa-solid fa-check"></i> Knew it! (+10 XP)',

      exit_explorer: '<i class="fa-solid fa-arrow-left"></i> Dashboard',
      explorer_title_it: "Explore Italian Verbs",
      explorer_title_de: "Explore German Verbs",
      explorer_search_placeholder: "Search verb by infinitive or translation...",
      explorer_group_all: "All conjugation groups",
      explorer_empty_details: "Select a verb from the list on the left to view its full conjugation tables.",
      explorer_no_verbs: "No verbs match your search.",

      reset_data_confirm: "Are you sure you want to reset all your progress, XP points, and statistics?",
      invalid_key_alert: "The API key entered is invalid or unsupported. Please check and try again.",
      conn_error_alert: "Unable to connect to Gemini API. Please check your internet connection.",
      enter_key_alert: "Please enter a valid API key."
    },
    it: {
      settings_title: '<i class="fa-solid fa-gear"></i> Impostazioni',
      ui_lang_label: "Lingua Interfaccia",
      ui_lang_sub: "Lingua di pulsanti, etichette e menu",
      target_lang_label: "Lingua da Studiare",
      target_lang_sub: "Verbi e frasi da esercitare",
      theme_label: "Aspetto",
      theme_sub: "Passa da Modalità Chiara a Scura",
      theme_light: "Chiaro",
      theme_dark: "Scuro",
      sound_label: "Effetti Sonori",
      sound_sub: "Feedback audio sulle risposte",
      sound_on: "Attivi",
      sound_off: "Disattivi",
      ai_section_title: "Assistente IA Gemini",
      ai_section_desc: "Abilita frasi di contesto infinite in tempo reale con la tua chiave API gratuita.",
      ai_key_placeholder: "Incolla chiave API Gemini...",
      btn_save_verify: "Salva e Verifica",
      ai_status_label: "Stato:",
      ai_status_enabled: "Abilitata",
      ai_status_disabled: "Non inserita",
      ai_status_invalid: "Non valida",
      ai_status_verifying: "Verifica...",
      ai_status_error: "Errore Connessione",
      get_free_key: "Ottieni chiave gratis",
      reset_data_label: "Resetta Dati",
      reset_data_sub: "Cancella tutti i progressi, livelli e punti XP",
      btn_reset: "Resetta",

      config_title: '<i class="fa-solid fa-sliders"></i> Configura Studio',
      welcome_title: "Bentornato! Livello {level}",
      welcome_desc: "Seleziona i verbi e i tempi che desideri esercitare, quindi scegli una modalità di studio.",
      filter_type_label: "Tipologia Verbi",
      type_all: "Tutti",
      type_regular: "Regolari",
      type_irregular: "Irregolari",
      filter_group_label: "Coniugazione",
      group_all: "Tutte",
      filter_tense_label: "Tempi Verbali (Seleziona almeno uno)",
      filter_pool_label: "Bacino di Verbi",
      pool_all_it: "Tutti i verbi italiani",
      pool_all_de: "Tutti i verbi tedeschi",
      pool_struggle: "Verbi difficili",
      pool_bookmarks: "Preferiti",
      btn_start_quiz: '<i class="fa-solid fa-graduation-cap"></i> Avvia Quiz',
      btn_start_flashcards: '<i class="fa-solid fa-layer-group"></i> Flashcards',
      btn_start_sentences: '<i class="fa-solid fa-pen-to-square"></i> Completa Frasi',
      btn_go_explorer: '<i class="fa-solid fa-book-open"></i> Esplora Coniugazioni',
      stats_title: '<i class="fa-solid fa-chart-line"></i> I tuoi Progressi',
      stat_xp_label: "XP totali",
      stat_streak_label: "Streak (Giorni)",
      stat_accuracy_label: "Precisione",
      stat_attempts_label: "Esercizi fatti",
      level_current: "Livello {level}",
      level_next: "Livello {level}",
      xp_to_next: "Raggiungi {xp} XP per salire di livello",
      struggle_title: "⚠️ Verbi ostici",
      struggle_desc: "Questi verbi hanno una precisione inferiore al 70%. Esercitati di più!",

      exit_drill_title: "Torna alla Dashboard",
      drill_counter_format: "Domanda {current} di {total}",
      drill_placeholder: "Scrivi la coniugazione...",
      btn_submit_drill: "Invia Risposta",
      feedback_correct_headline: '<i class="fa-solid fa-circle-check"></i> Bravissimo!',
      feedback_wrong_headline: '<i class="fa-solid fa-circle-xmark"></i> Non esattamente!',
      feedback_correct_details: "La risposta corretta è <strong>{answer}</strong>.",
      loading_overlay_text: "Generazione frasi con Gemini...",

      exit_flashcards_title: "Torna alla Dashboard",
      flashcards_counter_format: "Card {current} di {total}",
      flip_hint_front: '<i class="fa-solid fa-rotate-left"></i> Clicca per girare',
      flip_hint_back: "Clicca di nuovo per girare",
      btn_flash_fail: '<i class="fa-solid fa-xmark"></i> Non la sapevo',
      btn_flash_success: '<i class="fa-solid fa-check"></i> Lo sapevo! (+10 XP)',

      exit_explorer: '<i class="fa-solid fa-arrow-left"></i> Dashboard',
      explorer_title_it: "Esplora Verbi Italiani",
      explorer_title_de: "Esplora Verbi Tedeschi",
      explorer_search_placeholder: "Cerca verbo per infinito o traduzione...",
      explorer_group_all: "Tutte le coniugazioni",
      explorer_empty_details: "Seleziona un verbo dalla lista a sinistra per visualizzare le tabelle di coniugazione complete.",
      explorer_no_verbs: "Nessun verbo corrisponde alla ricerca.",

      reset_data_confirm: "Sei sicuro di voler resettare tutti i tuoi progressi, i punti XP e le statistiche?",
      invalid_key_alert: "La chiave API inserita non è valida o non è supportata. Verifica che sia corretta.",
      conn_error_alert: "Impossibile connettersi alle API di Gemini. Controlla la tua connessione internet.",
      enter_key_alert: "Inserisci una chiave API valida."
    },
    de: {
      settings_title: '<i class="fa-solid fa-gear"></i> Einstellungen',
      ui_lang_label: "Benutzeroberfläche-Sprache",
      ui_lang_sub: "Sprache von Schaltflächen, Labels & Menüs",
      target_lang_label: "Lernziel-Sprache",
      target_lang_sub: "Zu übende Verben & Sätze",
      theme_label: "Erscheinungsbild",
      theme_sub: "Wechseln Sie zwischen hellem und dunklem Modus",
      theme_light: "Hell",
      theme_dark: "Dunkel",
      sound_label: "Soundeffekte",
      sound_sub: "Audio-Feedback bei Antworten",
      sound_on: "An",
      sound_off: "Aus",
      ai_section_title: "Gemini KI-Assistent",
      ai_section_desc: "Aktivieren Sie unendliche Kontext-Sätze mit Ihrem kostenlosen Gemini API-Schlüssel.",
      ai_key_placeholder: "Gemini-API-Schlüssel eingeben...",
      btn_save_verify: "Speichern & Prüfen",
      ai_status_label: "Status:",
      ai_status_enabled: "Aktiviert",
      ai_status_disabled: "Nicht angegeben",
      ai_status_invalid: "Ungültig",
      ai_status_verifying: "Prüfen...",
      ai_status_error: "Verbindungsfehler",
      get_free_key: "Kostenlosen Schlüssel holen",
      reset_data_label: "Fortschritt zurücksetzen",
      reset_data_sub: "Alle Statistiken, Level & XP löschen",
      btn_reset: "Zurücksetzen",

      config_title: '<i class="fa-solid fa-sliders"></i> Übungskonfiguration',
      welcome_title: "Willkommen! Level {level}",
      welcome_desc: "Wählen Sie Verben und Zeiten aus, die Sie üben möchten, und wählen Sie einen Lernmodus.",
      filter_type_label: "Verb-Typ",
      type_all: "Alle",
      type_regular: "Regelmäßig",
      type_irregular: "Unregelmäßig",
      filter_group_label: "Endungsgruppe",
      group_all: "Alle",
      filter_tense_label: "Zeiten (Mindestens eine auswählen)",
      filter_pool_label: "Verben-Pool",
      pool_all_it: "Alle italienischen Verben",
      pool_all_de: "Alle deutschen Verben",
      pool_struggle: "Schwierige Verben",
      pool_bookmarks: "Favoriten",
      btn_start_quiz: '<i class="fa-solid fa-graduation-cap"></i> Quiz starten',
      btn_start_flashcards: '<i class="fa-solid fa-layer-group"></i> Karteikarten',
      btn_start_sentences: '<i class="fa-solid fa-pen-to-square"></i> Sätze vervollständigen',
      btn_go_explorer: '<i class="fa-solid fa-book-open"></i> Verben durchsuchen',
      stats_title: '<i class="fa-solid fa-chart-line"></i> Ihre Fortschritte',
      stat_xp_label: "Gesamt-XP",
      stat_streak_label: "Streak (Tage)",
      stat_accuracy_label: "Genauigkeit",
      stat_attempts_label: "Absolvierte Übungen",
      level_current: "Level {level}",
      level_next: "Level {level}",
      xp_to_next: "Erreichen Sie {xp} XP für Level-Up",
      struggle_title: "⚠️ Schwierige Verben",
      struggle_desc: "Diese Verben haben eine Genauigkeit von unter 70%. Üben Sie mehr!",

      exit_drill_title: "Zurück zum Dashboard",
      drill_counter_format: "Frage {current} von {total}",
      drill_placeholder: "Konjugation eingeben...",
      btn_submit_drill: "Antwort absenden",
      feedback_correct_headline: '<i class="fa-solid fa-circle-check"></i> Hervorragend!',
      feedback_wrong_headline: '<i class="fa-solid fa-circle-xmark"></i> Nicht ganz!',
      feedback_correct_details: "Die richtige Antwort lautet <strong>{answer}</strong>.",
      loading_overlay_text: "Generiere Sätze mit Gemini...",

      exit_flashcards_title: "Zurück zum Dashboard",
      flashcards_counter_format: "Karte {current} von {total}",
      flip_hint_front: '<i class="fa-solid fa-rotate-left"></i> Klicken zum Umdrehen',
      flip_hint_back: "Nochmal klicken zum Umdrehen",
      btn_flash_fail: '<i class="fa-solid fa-xmark"></i> Wusste ich nicht',
      btn_flash_success: '<i class="fa-solid fa-check"></i> Wusste ich! (+10 XP)',

      exit_explorer: '<i class="fa-solid fa-arrow-left"></i> Dashboard',
      explorer_title_it: "Italienische Verben durchsuchen",
      explorer_title_de: "Deutsche Verben durchsuchen",
      explorer_search_placeholder: "Verb nach Infinitiv oder Übersetzung suchen...",
      explorer_group_all: "Alle Konjugationsgruppen",
      explorer_empty_details: "Wählen Sie ein Verb aus der Liste links aus, um die Konjugationstabellen anzuzeigen.",
      explorer_no_verbs: "Keine Verben entsprechen der Suche.",

      reset_data_confirm: "Sind Sie sicher, dass Sie alle Ihre Fortschritte, XP und Statistiken zurücksetzen möchten?",
      invalid_key_alert: "Der eingegebene API-Schlüssel ist ungültig. Bitte überprüfen Sie die Eingabe.",
      conn_error_alert: "Keine Verbindung zu Gemini. Bitte überprüfen Sie Ihre Internetverbindung.",
      enter_key_alert: "Bitte geben Sie einen gültigen API-Schlüssel ein."
    }
  };

  // App State
  const App = {
    view: "dashboard",
    lang: "it",    // Target Practice Language ("it" | "de")
    uiLang: "en",  // Interface Language ("en" | "it" | "de")

    getVerbs() {
      return this.lang === "de" ? window.GERMAN_VERBS : window.ITALIAN_VERBS;
    },
    getPronouns() {
      return this.lang === "de" ? window.GERMAN_PRONOUNS : window.ITALIAN_PRONOUNS;
    },
    getTenses() {
      return this.lang === "de" ? window.GERMAN_TENSES : window.ITALIAN_TENSES;
    },
    getSentences() {
      return this.lang === "de" ? window.GERMAN_SENTENCES : window.ITALIAN_SENTENCES;
    },
    getPronounsList() {
      return this.lang === "de" 
        ? ["ich", "du", "er_sie_es", "wir", "ihr", "sie_Sie"]
        : ["io", "tu", "lui_lei", "noi", "voi", "loro"];
    },

    theme: "light",
    sound: true,
    
    // Filters selected in dashboard
    filters: {
      type: "all",      // "all" | "regular" | "irregular"
      group: "all",     // "all" | "are" | "ere" | "ire"
      tenses: ["presente"], // array of tenses
      pool: "all"       // "all" | "struggle" | "bookmarks"
    },

    // Session states
    quiz: {
      active: false,
      questions: [],
      currentIndex: 0,
      correctCount: 0,
      isAnswered: false,
      currentQuestion: null
    },

    flashcards: {
      active: false,
      cards: [],
      currentIndex: 0,
      flipped: false
    },

    // Initialization
    init() {
      // Load saved settings
      const savedTheme = localStorage.getItem("veerber_theme") || "light";
      this.setTheme(savedTheme);
      
      const savedSound = localStorage.getItem("veerber_sound");
      this.sound = savedSound === null ? true : savedSound === "true";
      this.updateSoundIcon();

      // Load saved Target Practice language
      const savedTargetLang = localStorage.getItem("veerber_lang") || "it";
      this.lang = savedTargetLang;

      // Load saved UI language (defaults to savedTargetLang if not explicitly set)
      const savedUiLang = localStorage.getItem("veerber_ui_lang") || savedTargetLang;
      this.uiLang = savedUiLang;

      // Apply UI localization
      this.setUiLanguage(savedUiLang);

      // Bind events
      this.bindEvents();
      
      // Load explorer verb list
      this.renderExplorerList();

      // Async sync API key from server
      this.syncApiKeyFromServer();

      console.log("Veerber initialized successfully!");
    },

    // Helper to get translated UI text
    t(key) {
      const dict = TRANSLATIONS[this.uiLang] || TRANSLATIONS.en;
      return dict[key] || TRANSLATIONS.en[key] || key;
    },

    // Apply UI Language
    setUiLanguage(uiLang) {
      this.uiLang = uiLang;
      localStorage.setItem("veerber_ui_lang", uiLang);

      const dict = TRANSLATIONS[uiLang] || TRANSLATIONS.en;

      // Update data-i18n innerHTML elements
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) {
          el.innerHTML = dict[key];
        }
      });

      // Update placeholders
      document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (dict[key]) {
          el.placeholder = dict[key];
        }
      });

      // Update titles
      document.querySelectorAll("[data-i18n-title]").forEach(el => {
        const key = el.getAttribute("data-i18n-title");
        if (dict[key]) {
          el.title = dict[key];
        }
      });

      // Update segmented control buttons active state in modal
      document.querySelectorAll("#ui-lang-selector .segmented-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.uilang === uiLang);
      });

      // Update dashboard text labels
      this.setLanguage(this.lang, false);
    },

    // Bind all event listeners
    bindEvents() {
      // Settings Modal toggles
      const settingsModal = document.getElementById("modal-settings");
      
      document.getElementById("btn-toggle-settings").addEventListener("click", () => {
        AudioManager.playClick();
        this.openSettingsModal();
      });

      document.getElementById("btn-close-settings").addEventListener("click", () => {
        AudioManager.playClick();
        this.closeSettingsModal();
      });

      if (settingsModal) {
        settingsModal.addEventListener("click", (e) => {
          if (e.target === settingsModal) {
            this.closeSettingsModal();
          }
        });
      }

      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && settingsModal && settingsModal.classList.contains("active")) {
          this.closeSettingsModal();
          return;
        }

        // Flashcards keyboard shortcuts
        if (this.view === "flashcards" && this.flashcards.active) {
          const activeModal = document.querySelector(".modal-backdrop[style*='display: flex']");
          if (activeModal) return;

          if (e.key === " " || e.key === "ArrowUp") {
            e.preventDefault();
            const cardEl = document.getElementById("flashcard-element");
            if (cardEl) {
              this.flashcards.flipped = !this.flashcards.flipped;
              cardEl.classList.toggle("flipped", this.flashcards.flipped);
              AudioManager.playClick();
            }
          } else if (e.key === "ArrowRight" || e.key === "1") {
            e.preventDefault();
            this.handleFlashcardFeedback(true);
          } else if (e.key === "ArrowLeft" || e.key === "2") {
            e.preventDefault();
            this.handleFlashcardFeedback(false);
          }
        }
      });

      // Modal UI Language selector buttons
      document.querySelectorAll("#ui-lang-selector .segmented-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          AudioManager.playClick();
          this.setUiLanguage(btn.dataset.uilang);
        });
      });

      // Modal Target Language selector buttons
      document.querySelectorAll("#target-lang-selector .segmented-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          AudioManager.playClick();
          this.setLanguage(btn.dataset.targetlang);
        });
      });

      // Modal Theme selector buttons
      document.querySelectorAll("#theme-selector .segmented-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          AudioManager.playClick();
          this.setTheme(btn.dataset.themeval);
        });
      });

      // Modal Sound selector buttons
      document.querySelectorAll("#sound-selector .segmented-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const val = btn.dataset.soundval === "true";
          this.sound = val;
          localStorage.setItem("veerber_sound", this.sound);
          this.updateSoundIcon();
          this.updateSettingsModalState();
          if (this.sound) AudioManager.playClick();
        });
      });

      // Header Theme Toggle
      document.getElementById("btn-toggle-theme").addEventListener("click", () => {
        const nextTheme = this.theme === "light" ? "dark" : "light";
        this.setTheme(nextTheme);
        AudioManager.playClick();
      });

      // Header Sound Toggle
      document.getElementById("btn-toggle-sound").addEventListener("click", () => {
        this.sound = AudioManager.toggleSound();
        localStorage.setItem("veerber_sound", this.sound);
        this.updateSoundIcon();
        this.updateSettingsModalState();
        if (this.sound) AudioManager.playClick();
      });

      // Header Language selector
      document.getElementById("header-lang-select").addEventListener("change", (e) => {
        AudioManager.playClick();
        this.setLanguage(e.target.value);
      });

      // Dashboard Filter Tags
      this.setupFilterButtons("filter-type", "type");
      this.setupFilterButtons("filter-group", "group");
      this.setupFilterButtons("filter-pool", "pool");
      
      // Multi-select Tense Buttons
      const tenseButtons = document.querySelectorAll("#filter-tenses .tag-btn");
      tenseButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          const tense = btn.dataset.tense;
          const idx = this.filters.tenses.indexOf(tense);
          
          if (idx === -1) {
            this.filters.tenses.push(tense);
            btn.classList.add("selected");
          } else {
            // Prevent removing the last remaining tense
            if (this.filters.tenses.length > 1) {
              this.filters.tenses.splice(idx, 1);
              btn.classList.remove("selected");
            } else {
              // Highlight flash error
              btn.style.transform = "translateX(5px)";
              setTimeout(() => btn.style.transform = "none", 100);
            }
          }
          AudioManager.playClick();
        });
      });

      // Start Quiz Button
      document.getElementById("btn-start-quiz").addEventListener("click", () => {
        AudioManager.playClick();
        this.startQuizSession();
      });

      // Start Flashcards Button
      document.getElementById("btn-start-flashcards").addEventListener("click", () => {
        AudioManager.playClick();
        this.startFlashcardSession();
      });

      // Start Sentences Button
      document.getElementById("btn-start-sentences").addEventListener("click", () => {
        AudioManager.playClick();
        this.startSentenceSession();
      });

      // Go to Explorer button
      document.getElementById("btn-go-explorer").addEventListener("click", () => {
        AudioManager.playClick();
        this.switchView("explorer");
      });

      // Exit Drill button
      document.getElementById("btn-exit-drill").addEventListener("click", () => {
        AudioManager.playClick();
        this.endQuizSession();
      });

      // Exit Flashcards button
      document.getElementById("btn-exit-flashcards").addEventListener("click", () => {
        AudioManager.playClick();
        this.endFlashcardSession();
      });

      // Exit Explorer button
      document.getElementById("btn-exit-explorer").addEventListener("click", () => {
        AudioManager.playClick();
        this.switchView("dashboard");
      });

      // Reset Data buttons (Dashboard & Modal)
      const handleResetData = () => {
        if (confirm(this.t("reset_data_confirm"))) {
          StorageManager.resetProgress();
          this.setLanguage(this.lang);
          AudioManager.playFailure();
        }
      };

      document.getElementById("btn-reset-data").addEventListener("click", handleResetData);
      document.getElementById("modal-btn-reset-data").addEventListener("click", handleResetData);

      // Quiz - Accent Characters buttons
      const accentButtons = document.querySelectorAll(".accent-row .btn-accent");
      const quizInput = document.getElementById("drill-text-input");
      accentButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          AudioManager.playClick();
          const char = btn.textContent;
          const start = quizInput.selectionStart;
          const end = quizInput.selectionEnd;
          const val = quizInput.value;
          
          quizInput.value = val.substring(0, start) + char + val.substring(end);
          quizInput.selectionStart = quizInput.selectionEnd = start + 1;
          quizInput.focus();
        });
      });

      // Quiz - Enter key press / Submit Answer
      quizInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.handleQuizSubmit();
        }
      });
      document.getElementById("btn-submit-drill").addEventListener("click", () => {
        this.handleQuizSubmit();
      });

      // Flashcards - Flip click on 3D element
      const cardEl = document.getElementById("flashcard-element");
      cardEl.addEventListener("click", () => {
        this.flashcards.flipped = !this.flashcards.flipped;
        cardEl.classList.toggle("flipped", this.flashcards.flipped);
        AudioManager.playClick();
      });

      // Flashcards actions
      document.getElementById("btn-flash-success").addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleFlashcardFeedback(true);
      });
      document.getElementById("btn-flash-fail").addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleFlashcardFeedback(false);
      });

      // Explorer Search & filters
      document.getElementById("explorer-search").addEventListener("input", () => {
        this.renderExplorerList();
      });
      document.getElementById("explorer-filter-group").addEventListener("change", () => {
        this.renderExplorerList();
      });

      // API Key visibility toggles
      const setupVisibilityToggle = (btnId, inputId) => {
        document.getElementById(btnId).addEventListener("click", () => {
          AudioManager.playClick();
          const input = document.getElementById(inputId);
          const icon = document.getElementById(btnId).querySelector("i");
          if (input.type === "password") {
            input.type = "text";
            icon.className = "fa-solid fa-eye";
          } else {
            input.type = "password";
            icon.className = "fa-solid fa-eye-slash";
          }
        });
      };

      setupVisibilityToggle("btn-toggle-key-visibility", "input-api-key");
      setupVisibilityToggle("modal-btn-toggle-key-visibility", "modal-input-api-key");

      // API Key Save and test
      const handleSaveKey = async (inputId, saveBtnId) => {
        AudioManager.playClick();
        const input = document.getElementById(inputId);
        const key = input.value.trim();
        const saveBtn = document.getElementById(saveBtnId);

        if (!key) {
          alert(this.t("enter_key_alert"));
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = this.t("ai_status_verifying");
        this.updateApiKeyStatusUI(this.t("ai_status_verifying"), "var(--text-muted)");

        try {
          const isValid = await this.testApiKey(key);
          if (isValid) {
            StorageManager.state.apiKey = key;
            StorageManager.save();
            this.saveApiKeyToServer(key);
            this.updateApiKeyStatusUI(this.t("ai_status_enabled"), "var(--success)");
            AudioManager.playSuccess();
          } else {
            this.updateApiKeyStatusUI(this.t("ai_status_invalid"), "var(--error)");
            AudioManager.playFailure();
            alert(this.t("invalid_key_alert"));
          }
        } catch (e) {
          console.error(e);
          this.updateApiKeyStatusUI(this.t("ai_status_error"), "var(--error)");
          AudioManager.playFailure();
          alert(this.t("conn_error_alert"));
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = this.t("btn_save_verify");
        }
      };

      document.getElementById("btn-save-api-key").addEventListener("click", () => {
        handleSaveKey("input-api-key", "btn-save-api-key");
      });
      document.getElementById("modal-btn-save-api-key").addEventListener("click", () => {
        handleSaveKey("modal-input-api-key", "modal-btn-save-api-key");
      });

      // API Key Clear
      const handleClearKey = () => {
        AudioManager.playClick();
        StorageManager.state.apiKey = null;
        StorageManager.save();
        this.saveApiKeyToServer(null);
        document.getElementById("input-api-key").value = "";
        document.getElementById("modal-input-api-key").value = "";
        this.updateApiKeyStatusUI(this.t("ai_status_disabled"), "var(--text-muted)");
      };

      document.getElementById("btn-clear-api-key").addEventListener("click", handleClearKey);
      document.getElementById("modal-btn-clear-api-key").addEventListener("click", handleClearKey);
    },

    updateApiKeyStatusUI(text, color) {
      ["api-key-status", "modal-api-key-status"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = text;
          el.style.color = color;
        }
      });
    },

    openSettingsModal() {
      const modal = document.getElementById("modal-settings");
      if (modal) {
        this.updateSettingsModalState();
        modal.style.display = "flex";
        requestAnimationFrame(() => modal.classList.add("active"));
      }
    },

    closeSettingsModal() {
      const modal = document.getElementById("modal-settings");
      if (modal) {
        modal.classList.remove("active");
        setTimeout(() => modal.style.display = "none", 300);
      }
    },

    updateSettingsModalState() {
      // UI Language
      document.querySelectorAll("#ui-lang-selector .segmented-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.uilang === this.uiLang);
      });

      // Target Language
      document.querySelectorAll("#target-lang-selector .segmented-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.targetlang === this.lang);
      });

      // Theme
      document.querySelectorAll("#theme-selector .segmented-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.themeval === this.theme);
      });

      // Sound
      document.querySelectorAll("#sound-selector .segmented-btn").forEach(btn => {
        btn.classList.toggle("active", (btn.dataset.soundval === "true") === this.sound);
      });

      // API Key Sync
      const savedKey = StorageManager.state.apiKey;
      document.getElementById("modal-input-api-key").value = savedKey || "";
      document.getElementById("input-api-key").value = savedKey || "";
      if (savedKey) {
        this.updateApiKeyStatusUI(this.t("ai_status_enabled"), "var(--success)");
      } else {
        this.updateApiKeyStatusUI(this.t("ai_status_disabled"), "var(--text-muted)");
      }
    },

    // Helper for Dashboard single-choice tag filters
    setupFilterButtons(containerId, filterKey) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const buttons = container.querySelectorAll(".tag-btn");
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          buttons.forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");

          const value = btn.dataset[filterKey];
          this.filters[filterKey] = value;
          AudioManager.playClick();
        });
      });
    },

    // View Routing
    switchView(targetView) {
      this.view = targetView;
      const views = document.querySelectorAll(".view");
      views.forEach(v => v.classList.remove("active"));

      const targetEl = document.getElementById(`view-${targetView}`);
      if (targetEl) {
        targetEl.classList.add("active");
        window.scrollTo(0, 0);
      }
    },

    // Theme Switcher
    setTheme(themeName) {
      this.theme = themeName;
      document.body.setAttribute("data-theme", themeName);
      localStorage.setItem("veerber_theme", themeName);

      const icon = document.getElementById("btn-toggle-theme").querySelector("i");
      if (themeName === "dark") {
        icon.className = "fa-solid fa-sun";
      } else {
        icon.className = "fa-solid fa-moon";
      }

      this.updateSettingsModalState();
    },

    // Sound Icon Sync
    updateSoundIcon() {
      const icon = document.getElementById("btn-toggle-sound").querySelector("i");
      if (this.sound) {
        icon.className = "fa-solid fa-volume-high";
      } else {
        icon.className = "fa-solid fa-volume-xmark";
      }
    },

    /* ======================================================================
       TARGET PRACTICE LANGUAGE & DATA LOGIC
       ====================================================================== */
    setLanguage(lang, syncUi = true) {
      this.lang = lang;
      localStorage.setItem("veerber_lang", lang);
      StorageManager.init(lang);
      
      // When target practice language changes, also sync UI localization to match
      if (syncUi && this.uiLang !== lang) {
        this.setUiLanguage(lang);
        return;
      }
      
      // Update select element value in header and modal
      const headerSelect = document.getElementById("header-lang-select");
      if (headerSelect) headerSelect.value = lang;

      // Update Verb Ending Group filters
      const groupContainer = document.getElementById("filter-group");
      if (groupContainer) {
        const buttons = groupContainer.querySelectorAll(".tag-btn");
        if (lang === "de") {
          buttons[0].textContent = this.t("group_all");
          buttons[0].setAttribute("data-group", "all");
          buttons[1].textContent = "-en";
          buttons[1].setAttribute("data-group", "en");
          buttons[2].textContent = "-n";
          buttons[2].setAttribute("data-group", "n");
          if (buttons[3]) buttons[3].style.display = "none";
        } else {
          buttons[0].textContent = this.t("group_all");
          buttons[0].setAttribute("data-group", "all");
          buttons[1].textContent = "-are";
          buttons[1].setAttribute("data-group", "are");
          buttons[2].textContent = "-ere";
          buttons[2].setAttribute("data-group", "ere");
          if (buttons[3]) {
            buttons[3].style.display = "inline-block";
            buttons[3].textContent = "-ire";
            buttons[3].setAttribute("data-group", "ire");
          }
        }
        
        buttons.forEach(btn => btn.classList.remove("selected"));
        buttons[0].classList.add("selected");
        this.filters.group = "all";
      }

      // Update Tense filter buttons text
      const tensesContainer = document.getElementById("filter-tenses");
      if (tensesContainer) {
        const buttons = tensesContainer.querySelectorAll(".tag-btn");
        const tensesMap = this.getTenses();
        buttons.forEach(btn => {
          const key = btn.getAttribute("data-tense");
          const fullLabel = tensesMap[key] || key;
          const shortLabel = fullLabel.split(" (")[0];
          btn.textContent = shortLabel;
        });
      }

      // Update Verb Pool buttons
      const poolContainer = document.getElementById("filter-pool");
      if (poolContainer) {
        const buttons = poolContainer.querySelectorAll(".tag-btn");
        buttons[0].childNodes[0].textContent = lang === "de" ? this.t("pool_all_de") : this.t("pool_all_it");
        buttons[1].childNodes[0].textContent = this.t("pool_struggle") + " ";
        buttons[2].childNodes[0].textContent = this.t("pool_bookmarks") + " ";
      }

      // Update Verb Type buttons
      const typeContainer = document.getElementById("filter-type");
      if (typeContainer) {
        const buttons = typeContainer.querySelectorAll(".tag-btn");
        buttons[0].textContent = this.t("type_all");
        buttons[1].textContent = this.t("type_regular");
        buttons[2].textContent = this.t("type_irregular");
      }

      // Rebuild UI elements
      this.refreshStats();
      this.renderExplorerList();

      // Clear details panel
      const detailContainer = document.getElementById("explorer-verb-details");
      if (detailContainer) {
        detailContainer.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-book-open"></i>
            <p>${this.t("explorer_empty_details")}</p>
          </div>
        `;
      }

      // Adapt welcome UI
      const welcomeBox = document.getElementById("welcome-title");
      if (welcomeBox) {
        welcomeBox.textContent = this.t("welcome_title").replace("{level}", StorageManager.state.level);
      }

      // Update Explorer view title
      const explorerTitleEl = document.querySelector("#view-explorer h2");
      if (explorerTitleEl) {
        explorerTitleEl.textContent = lang === "de" ? this.t("explorer_title_de") : this.t("explorer_title_it");
      }

      // Update Explorer search input placeholder
      const searchInput = document.getElementById("explorer-search");
      if (searchInput) {
        searchInput.placeholder = this.t("explorer_search_placeholder");
      }

      // Update Explorer group filter dropdown first option
      const expGroupFilter = document.getElementById("explorer-filter-group");
      if (expGroupFilter && expGroupFilter.options[0]) {
        expGroupFilter.options[0].textContent = this.t("explorer_group_all");
      }

      this.updateSettingsModalState();
    },

    // Refresh XP, Streak & Stats dashboard counters
    refreshStats() {
      const state = StorageManager.state;

      document.getElementById("header-streak").textContent = state.streak;
      document.getElementById("header-xp").textContent = state.xp;
      document.getElementById("header-level").textContent = `Lvl ${state.level}`;

      document.getElementById("stat-xp").textContent = state.xp;
      document.getElementById("stat-streak").textContent = state.streak;
      document.getElementById("stat-attempts").textContent = state.totalAttempts;

      const accuracy = state.totalAttempts > 0 
        ? Math.round((state.totalCorrect / state.totalAttempts) * 100) 
        : 0;
      document.getElementById("stat-accuracy").textContent = `${accuracy}%`;

      // XP Progress Bar
      const currentLevelXP = (state.level - 1) * 200;
      const nextLevelXP = state.level * 200;
      const progressXP = state.xp - currentLevelXP;
      const neededXP = nextLevelXP - currentLevelXP;
      const percent = Math.min(100, Math.max(0, (progressXP / neededXP) * 100));

      document.getElementById("xp-progress-fill").style.width = `${percent}%`;
      document.getElementById("level-label-current").textContent = this.t("level_current").replace("{level}", state.level);
      document.getElementById("level-label-next").textContent = this.t("level_next").replace("{level}", state.level + 1);
      document.getElementById("xp-to-next").textContent = this.t("xp_to_next").replace("{xp}", nextLevelXP);

      // Bookmarks count tag
      const bookmarkCountEl = document.getElementById("tag-bookmark-count");
      if (bookmarkCountEl) {
        bookmarkCountEl.textContent = state.reviewList ? state.reviewList.length : 0;
      }

      // Struggling verbs list
      this.renderStruggleVerbs();
    },

    renderStruggleVerbs() {
      const container = document.getElementById("struggle-container");
      const panel = document.getElementById("struggle-panel");
      const tagCount = document.getElementById("tag-struggle-count");
      
      const verbsStats = StorageManager.state.verbsStats;
      const strugglingList = [];

      for (const inf in verbsStats) {
        const item = verbsStats[inf];
        if (item.attempts >= 3) {
          const acc = item.correct / item.attempts;
          if (acc < 0.7) {
            strugglingList.push({ infinitive: inf, accuracy: Math.round(acc * 100) });
          }
        }
      }

      if (tagCount) tagCount.textContent = strugglingList.length;

      if (strugglingList.length === 0) {
        panel.style.display = "none";
        return;
      }

      panel.style.display = "block";
      container.innerHTML = "";

      strugglingList.sort((a, b) => a.accuracy - b.accuracy);

      strugglingList.forEach(v => {
        const badge = document.createElement("span");
        badge.className = "struggle-tag";
        badge.innerHTML = `${v.infinitive} <small>(${v.accuracy}%)</small>`;
        container.appendChild(badge);
      });
    },

    /* ======================================================================
       DRILL / QUIZ LOGIC
       ====================================================================== */
    startQuizSession() {
      const candidates = this.getFilteredVerbs();
      
      if (candidates.length === 0) {
        alert(this.uiLang === "de" ? "Keine Verben entsprechen den gewählten Filtern." : "Nessun verbo corrisponde ai filtri selezionati.");
        return;
      }

      const questions = [];
      const totalQuestions = 10;
      const pronounsList = this.getPronounsList();

      for (let i = 0; i < totalQuestions; i++) {
        const verb = candidates[Math.floor(Math.random() * candidates.length)];
        const tenseKey = this.filters.tenses[Math.floor(Math.random() * this.filters.tenses.length)];
        const pronounKey = pronounsList[Math.floor(Math.random() * pronounsList.length)];

        const correctAnswer = verb.conjugations[tenseKey][pronounKey];

        questions.push({
          verb,
          tenseKey,
          pronounKey,
          correctAnswer
        });
      }

      this.quiz.active = true;
      this.quiz.questions = questions;
      this.quiz.currentIndex = 0;
      this.quiz.correctCount = 0;
      this.quiz.isAnswered = false;

      this.switchView("drill");
      this.showQuizQuestion();
    },

        renderAccentRow() {
      const accentRow = document.querySelector(".accent-row");
      const input = document.getElementById("drill-text-input");
      if (!accentRow || !input) return;

      if (this.lang === "de") {
        accentRow.innerHTML = `
          <button class="btn-accent">ä</button>
          <button class="btn-accent">ö</button>
          <button class="btn-accent">ü</button>
          <button class="btn-accent">ß</button>
        `;
      } else {
        accentRow.innerHTML = `
          <button class="btn-accent">à</button>
          <button class="btn-accent">è</button>
          <button class="btn-accent">é</button>
          <button class="btn-accent">ì</button>
          <button class="btn-accent">ò</button>
          <button class="btn-accent">ù</button>
        `;
      }

      accentRow.querySelectorAll(".btn-accent").forEach(btn => {
        btn.addEventListener("click", () => {
          AudioManager.playClick();
          const char = btn.textContent;
          const start = input.selectionStart;
          const end = input.selectionEnd;
          const val = input.value;
          input.value = val.substring(0, start) + char + val.substring(end);
          input.selectionStart = input.selectionEnd = start + 1;
          input.focus();
        });
      });
    },

    showQuizQuestion() {
      this.quiz.isAnswered = false;
      const q = this.quiz.questions[this.quiz.currentIndex];
      this.quiz.currentQuestion = q;

      document.getElementById("drill-inf").textContent = q.verb.infinitive;
      document.getElementById("drill-trans").textContent = q.verb.translation;

      document.getElementById("drill-tense-badge").textContent = this.getTenses()[q.tenseKey];
      document.getElementById("drill-pronoun-badge").textContent = this.getPronouns()[q.pronounKey];

      const input = document.getElementById("drill-text-input");
      input.value = "";
      input.disabled = false;
      input.focus();

      this.renderAccentRow();

      // Hide feedback
      const feedback = document.getElementById("drill-feedback");
      feedback.classList.remove("visible", "correct", "wrong");

      const submitBtn = document.getElementById("btn-submit-drill");
      submitBtn.textContent = this.t("btn_submit_drill");

      // Progress bar & counter
      const progressPercent = (this.quiz.currentIndex / this.quiz.questions.length) * 100;
      document.getElementById("drill-progress-fill").style.width = `${progressPercent}%`;
      document.getElementById("drill-counter").textContent = this.t("drill_counter_format")
        .replace("{current}", this.quiz.currentIndex + 1)
        .replace("{total}", this.quiz.questions.length);
    },

    handleQuizSubmit() {
      if (this.quiz.autoAdvanceTimer) {
        clearTimeout(this.quiz.autoAdvanceTimer);
        this.quiz.autoAdvanceTimer = null;
      }

      if (this.quiz.isAnswered) {
        // Go to next question
        this.quiz.currentIndex++;
        if (this.quiz.currentIndex < this.quiz.questions.length) {
          const nextQ = this.quiz.questions[this.quiz.currentIndex];
          if (nextQ && nextQ.sentence) {
            this.showSentenceQuestion();
          } else {
            this.showQuizQuestion();
          }
        } else {
          this.endQuizSession();
        }
        return;
      }

      const q = this.quiz.currentQuestion;
      const input = document.getElementById("drill-text-input");
      const userText = input.value.trim();

      if (!userText) return;

      this.quiz.isAnswered = true;
      input.disabled = true;

      // Clean check (ignore punctuation, case, whitespace)
      const cleanUser = userText.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const cleanCorrect = q.correctAnswer.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

      let isCorrect = cleanUser === cleanCorrect;

      // Check slash variations (e.g. "stato/a")
      if (!isCorrect && cleanCorrect.includes("/")) {
        const parts = cleanCorrect.split("/");
        const base = parts[0].slice(0, -1);
        const opt1 = parts[0];
        const opt2 = base + parts[1];
        if (cleanUser === opt1 || cleanUser === opt2 || cleanUser === parts[0] || cleanUser === parts[1]) {
          isCorrect = true;
        }
      }

      // Flexible check for multi-word or auxiliary answers (e.g. "bin" vs "bin gefahren")
      if (!isCorrect) {
        const userWords = cleanUser.split(/\s+/);
        const correctWords = cleanCorrect.split(/\s+/);
        if (userWords[0] === correctWords[0] && userWords[0].length > 1) {
          isCorrect = true;
        }
      }

      const feedback = document.getElementById("drill-feedback");
      const headline = document.getElementById("feedback-headline");
      const details = document.getElementById("feedback-details");
      const submitBtn = document.getElementById("btn-submit-drill");

      // Record result in Storage
      const { leveledUp, xpGained } = StorageManager.recordAttempt(q.verb.infinitive, isCorrect);
      this.refreshStats();

      if (isCorrect) {
        this.quiz.correctCount++;
        AudioManager.playSuccess();
        if (window.Confetti) {
          Confetti.spawn(window.innerWidth / 2, window.innerHeight * 0.35, 60);
        }

        feedback.className = "drill-feedback visible correct";
        headline.innerHTML = this.getMotivationalMessage(true);
        details.innerHTML = `+${xpGained} XP!`;
        this.spawnFloatyXP(`+${xpGained} XP`);

        // Auto advance on correct answer after 1.4s if user doesn't click next manually
        this.quiz.autoAdvanceTimer = setTimeout(() => {
          if (this.quiz.active && this.quiz.isAnswered) {
            this.handleQuizSubmit();
          }
        }, 1400);
      } else {
        AudioManager.playFailure();
        feedback.className = "drill-feedback visible wrong";
        headline.innerHTML = this.getMotivationalMessage(false);
        const tipText = this.uiLang === "de" 
          ? "Keine Sorge! Weiter geht's 💪" 
          : (this.uiLang === "it" ? "Nessun problema! Continua così 💪" : "Don't worry, keep going! 💪");
        
        details.innerHTML = `${this.t("feedback_correct_details").replace("{answer}", q.correctAnswer)} <br><span class="motivate-badge"><i class="fa-solid fa-lightbulb"></i> ${tipText}</span>`;
      }

      if (leveledUp) {
        setTimeout(() => {
          AudioManager.playLevelUp();
          this.showLevelUpToast();
        }, 600);
      }

      submitBtn.textContent = this.quiz.currentIndex < this.quiz.questions.length - 1 
        ? (this.uiLang === "de" ? "Nächste Frage" : (this.uiLang === "it" ? "Prossima Domanda" : "Next Question"))
        : (this.uiLang === "de" ? "Ergebnisse anzeigen" : (this.uiLang === "it" ? "Vedi Risultati" : "View Results"));
    },

    endQuizSession() {
      this.quiz.active = false;
      document.getElementById("drill-progress-fill").style.width = "100%";
      this.switchView("dashboard");
    },

    /* ======================================================================
       SENTENCE BUILDER (FILL-IN-THE-BLANK) LOGIC
       ====================================================================== */
    async startSentenceSession() {
      const candidates = this.getFilteredVerbs();
      
      if (candidates.length === 0) {
        alert(this.uiLang === "de" ? "Keine Verben entsprechen den gewählten Filtern." : "Nessun verbo corrisponde ai filtri selezionati.");
        return;
      }

      const apiKey = StorageManager.state.apiKey;

      if (apiKey) {
        // Use Gemini AI API
        const overlay = document.getElementById("drill-loading-overlay");
        overlay.style.display = "flex";
        this.switchView("drill");

        try {
          const verbInfList = candidates.map(v => v.infinitive);
          const aiSentences = await this.generateSentencesAI(apiKey, verbInfList, this.filters.tenses);
          
          const questions = aiSentences.map(item => {
            let matchedVerb = candidates.find(v => v.infinitive === item.verb);
            if (!matchedVerb) {
              matchedVerb = { infinitive: item.verb, translation: item.translation, conjugations: {} };
            }
            return {
              verb: matchedVerb,
              tenseKey: item.tense,
              pronounKey: item.pronoun,
              correctAnswer: item.correct,
              sentence: item.sentence,
              translation: item.translation
            };
          });

          this.quiz.active = true;
          this.quiz.questions = questions;
          this.quiz.currentIndex = 0;
          this.quiz.correctCount = 0;
          this.quiz.isAnswered = false;

          overlay.style.display = "none";
          this.showSentenceQuestion();
          return;
        } catch (e) {
          console.error("Gemini AI failed, falling back to built-in sentences:", e);
          overlay.style.display = "none";
        }
      }

      // Offline Fallback Sentences
      const sentencesBank = this.getSentences();
      const matchingSentences = sentencesBank.filter(s => 
        candidates.some(c => c.infinitive === s.verb) &&
        this.filters.tenses.includes(s.tense)
      );

      let pool = matchingSentences.length > 0 ? matchingSentences : sentencesBank;

      const questions = [];
      const totalQuestions = Math.min(10, pool.length);
      const shuffled = [...pool].sort(() => Math.random() - 0.5);

      for (let i = 0; i < totalQuestions; i++) {
        const item = shuffled[i];
        let matchedVerb = candidates.find(v => v.infinitive === item.verb);
        if (!matchedVerb) {
          matchedVerb = { infinitive: item.verb, translation: item.translation, conjugations: {} };
        }
        questions.push({
          verb: matchedVerb,
          tenseKey: item.tense,
          pronounKey: item.pronoun,
          correctAnswer: item.correct,
          sentence: item.sentence,
          translation: item.translation
        });
      }

      this.quiz.active = true;
      this.quiz.questions = questions;
      this.quiz.currentIndex = 0;
      this.quiz.correctCount = 0;
      this.quiz.isAnswered = false;

      this.switchView("drill");
      this.showSentenceQuestion();
    },

    showSentenceQuestion() {
      this.quiz.isAnswered = false;
      const q = this.quiz.questions[this.quiz.currentIndex];
      this.quiz.currentQuestion = q;

      document.getElementById("drill-inf").textContent = q.sentence;
      document.getElementById("drill-trans").textContent = q.translation;

      document.getElementById("drill-tense-badge").textContent = this.getTenses()[q.tenseKey] || q.tenseKey;
      document.getElementById("drill-pronoun-badge").textContent = this.getPronouns()[q.pronounKey] || q.pronounKey;

      const input = document.getElementById("drill-text-input");
      input.value = "";
      input.disabled = false;
      input.focus();

      this.renderAccentRow();

      // Hide feedback
      const feedback = document.getElementById("drill-feedback");
      feedback.classList.remove("visible", "correct", "wrong");

      const submitBtn = document.getElementById("btn-submit-drill");
      submitBtn.textContent = this.t("btn_submit_drill");

      // Progress bar & counter
      const progressPercent = (this.quiz.currentIndex / this.quiz.questions.length) * 100;
      document.getElementById("drill-progress-fill").style.width = `${progressPercent}%`;
      document.getElementById("drill-counter").textContent = this.t("drill_counter_format")
        .replace("{current}", this.quiz.currentIndex + 1)
        .replace("{total}", this.quiz.questions.length);
    },

    /* ======================================================================
       FLASHCARDS LOGIC
       ====================================================================== */
    startFlashcardSession() {
      const candidates = this.getFilteredVerbs();
      
      if (candidates.length === 0) {
        alert(this.uiLang === "de" ? "Keine Verben entsprechen den gewählten Filtern." : "Nessun verbo corrisponde ai filtri selezionati.");
        return;
      }

      const cards = [];
      const totalCards = 10;

      for (let i = 0; i < totalCards; i++) {
        const verb = candidates[Math.floor(Math.random() * candidates.length)];
        const tenseKey = this.filters.tenses[Math.floor(Math.random() * this.filters.tenses.length)];

        cards.push({ verb, tenseKey });
      }

      this.flashcards.active = true;
      this.flashcards.cards = cards;
      this.flashcards.currentIndex = 0;
      this.flashcards.flipped = false;

      this.switchView("flashcards");
      this.showFlashcard();
    },

    showFlashcard() {
      this.flashcards.flipped = false;
      const cardEl = document.getElementById("flashcard-element");
      cardEl.classList.remove("flipped");

      const c = this.flashcards.cards[this.flashcards.currentIndex];

      // Front
      document.getElementById("card-inf").textContent = c.verb.infinitive;
      document.getElementById("card-trans").textContent = c.verb.translation;
      document.getElementById("card-tense").textContent = this.getTenses()[c.tenseKey];

      // Back
      document.querySelector(".card-back-title").textContent = c.verb.infinitive;
      document.getElementById("card-back-tense-title").textContent = this.getTenses()[c.tenseKey];

      const grid = document.getElementById("card-back-conjugations");
      grid.innerHTML = "";

      const pronounsList = this.getPronounsList();
      pronounsList.forEach(p => {
        const spelling = c.verb.conjugations[c.tenseKey][p];
        const item = document.createElement("div");
        item.className = "conj-item";
        item.innerHTML = `
          <span class="pronoun">${this.getPronouns()[p]}</span>
          <span class="spelling">${spelling}</span>
        `;
        grid.appendChild(item);
      });

      // Counter
      document.getElementById("flashcards-counter").textContent = this.t("flashcards_counter_format")
        .replace("{current}", this.flashcards.currentIndex + 1)
        .replace("{total}", this.flashcards.cards.length);
    },

    handleFlashcardFeedback(isSuccess) {
      const c = this.flashcards.cards[this.flashcards.currentIndex];
      const { leveledUp, xpGained } = StorageManager.recordAttempt(c.verb.infinitive, isSuccess);
      this.refreshStats();

      if (isSuccess) {
        AudioManager.playSuccess();
        if (window.Confetti) {
          Confetti.spawn(window.innerWidth / 2, window.innerHeight * 0.35, 35);
        }
        this.spawnFloatyXP(`+${xpGained} XP`);
      } else {
        AudioManager.playFailure();
        const motivateMsg = this.uiLang === "de" ? "Übung macht den Meister! 💪" : (this.uiLang === "it" ? "Sbagliando s'impara! 💪" : "Practice makes perfect! 💪");
        this.spawnFloatyXP(motivateMsg);
      }

      if (leveledUp) {
        setTimeout(() => {
          AudioManager.playLevelUp();
          this.showLevelUpToast();
        }, 600);
      }

      this.flashcards.currentIndex++;
      if (this.flashcards.currentIndex < this.flashcards.cards.length) {
        const cardEl = document.getElementById("flashcard-element");
        if (cardEl && cardEl.classList.contains("flipped")) {
          cardEl.classList.remove("flipped");
          this.flashcards.flipped = false;
          setTimeout(() => {
            this.showFlashcard();
          }, 250);
        } else {
          this.showFlashcard();
        }
      } else {
        this.endFlashcardSession();
      }
    },

    endFlashcardSession() {
      this.flashcards.active = false;
      this.switchView("dashboard");
    },

    /* ======================================================================
       EXPLORER / DICTIONARY VIEW LOGIC
       ====================================================================== */
    renderExplorerList() {
      const search = document.getElementById("explorer-search").value.trim().toLowerCase();
      const groupFilter = document.getElementById("explorer-filter-group").value;
      const listContainer = document.getElementById("explorer-verb-list");
      
      listContainer.innerHTML = "";

      let verbs = this.getVerbs();

      if (search) {
        verbs = verbs.filter(v => 
          v.infinitive.toLowerCase().includes(search) || 
          v.translation.toLowerCase().includes(search)
        );
      }

      if (groupFilter !== "all") {
        verbs = verbs.filter(v => v.group === groupFilter);
      }

      if (verbs.length === 0) {
        listContainer.innerHTML = `
          <div class="empty-state" style="padding:20px;">
            <i class="fa-solid fa-circle-info"></i>
            <p style="font-size:0.9rem;">${this.t("explorer_no_verbs")}</p>
          </div>
        `;
        return;
      }

      verbs.forEach(v => {
        const item = document.createElement("div");
        item.className = "verb-list-item";
        item.innerHTML = `
          <div>
            <div class="verb-inf">${v.infinitive}</div>
            <div class="verb-trans">${v.translation}</div>
          </div>
          <i class="fa-solid fa-angle-right" style="opacity: 0.5;"></i>
        `;
        
        item.addEventListener("click", () => {
          document.querySelectorAll(".verb-list-item").forEach(el => el.classList.remove("selected"));
          item.classList.add("selected");
          
          this.renderExplorerDetails(v);
          AudioManager.playClick();
        });

        listContainer.appendChild(item);
      });
    },

    renderExplorerDetails(verb) {
      const detailsContainer = document.getElementById("explorer-verb-details");
      detailsContainer.innerHTML = "";

      const isBookmarked = StorageManager.isVerbInReviewList(verb.infinitive);
      const starClass = isBookmarked ? "fa-solid fa-star bookmarked" : "fa-regular fa-star";

      const header = document.createElement("div");
      header.className = "verb-detail-header";
      header.innerHTML = `
        <div>
          <h2 class="verb-detail-infinitive">${verb.infinitive}</h2>
          <p class="verb-detail-trans">${verb.translation}</p>
        </div>
        <div style="display:flex; gap:16px; align-items:center;">
          <button class="btn-speaker" id="btn-speak-infinitive" title="Ascolta Pronuncia (Text-to-Speech)">
            <i class="fa-solid fa-volume-high"></i>
          </button>
          <span class="btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" id="btn-toggle-bookmark" title="Aggiungi ai preferiti">
            <i class="${starClass}" style="font-size: 1.5rem;"></i>
          </span>
        </div>
      `;

      detailsContainer.appendChild(header);

      header.querySelector("#btn-speak-infinitive").addEventListener("click", (e) => {
        e.stopPropagation();
        this.speakText(verb.infinitive);
      });

      header.querySelector("#btn-toggle-bookmark").addEventListener("click", (e) => {
        e.stopPropagation();
        const added = StorageManager.toggleReviewVerb(verb.infinitive);
        AudioManager.playClick();
        this.renderExplorerDetails(verb);
        this.setLanguage(this.lang);
      });

      const tablesGrid = document.createElement("div");
      tablesGrid.className = "detail-tenses-grid";

      const tensesList = ["presente", "passato_prossimo", "imperfetto", "futuro"];
      const pronounsList = this.getPronounsList();

      tensesList.forEach(tenseKey => {
        const card = document.createElement("div");
        card.className = "tense-table-card";
        card.innerHTML = `<h4>${this.getTenses()[tenseKey]}</h4>`;
        
        const rowsContainer = document.createElement("div");
        
        pronounsList.forEach(p => {
          const spelling = verb.conjugations[tenseKey][p];
          const displaySpelling = spelling.replace("/", " / ");

          const row = document.createElement("div");
          row.className = "tense-row";
          row.innerHTML = `
            <span class="pron">${this.getPronouns()[p]}</span>
            <span class="form">${displaySpelling}</span>
          `;
          
          rowsContainer.appendChild(row);
        });

        card.appendChild(rowsContainer);
        tablesGrid.appendChild(card);
      });

      detailsContainer.appendChild(tablesGrid);
    },

    // Speech synthesis helper
    speakText(text) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const targetLangCode = this.lang === "de" ? "de-DE" : "it-IT";
        utterance.lang = targetLangCode;
        
        const voices = window.speechSynthesis.getVoices();
        const targetVoice = voices.find(v => v.lang.startsWith(this.lang));
        if (targetVoice) {
          utterance.voice = targetVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    },

    // Candidate verb filter
    getFilteredVerbs() {
      let candidateVerbs = this.getVerbs();

      if (this.filters.type !== "all") {
        candidateVerbs = candidateVerbs.filter(v => v.type === this.filters.type);
      }
      if (this.filters.group !== "all") {
        candidateVerbs = candidateVerbs.filter(v => v.group === this.filters.group);
      }
      if (this.filters.pool === "struggle") {
        const stats = StorageManager.state.verbsStats;
        candidateVerbs = candidateVerbs.filter(v => {
          const s = stats[v.infinitive];
          return s && s.attempts >= 3 && (s.correct / s.attempts < 0.7);
        });
      } else if (this.filters.pool === "bookmarks") {
        const reviewList = StorageManager.state.reviewList || [];
        candidateVerbs = candidateVerbs.filter(v => reviewList.includes(v.infinitive));
      }

      return candidateVerbs;
    },

    // Gemini API integration helpers
    async testApiKey(apiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond ONLY with JSON: {"status":"ok"}' }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      if (!response.ok) return false;
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      return text.includes("ok");
    },

    async generateSentencesAI(apiKey, verbs, tenses) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
      
      const isDe = this.lang === "de";
      const prompt = isDe 
        ? `Generate a JSON list of exactly 5 German fill-in-the-blank sentences for language learning.
Choose randomly from the following verbs: [${verbs.join(", ")}].
Choose randomly from the following tenses: [${tenses.join(", ")}].

GERMAN GRAMMAR RULES FOR SENTENCES:
1. For 'presente' (Präsens) and 'imperfetto' (Präteritum): Put a single '______' placeholder where the conjugated verb belongs. 'correct' MUST be ONLY the single conjugated verb.
   Example: {"sentence": "Heute ______ ich ein Buch.", "translation": "Today I read a book.", "verb": "lesen", "tense": "presente", "pronoun": "ich", "correct": "lese"}

2. For 'passato_prossimo' (Perfekt): Put the '______' placeholder in position 2 for the auxiliary verb ('haben' or 'sein'). The past participle MUST be placed at the VERY END of the sentence. 'correct' MUST be ONLY the conjugated auxiliary verb ('habe', 'hast', 'hat', 'haben', 'habt', 'bin', 'bist', 'ist', 'sind', 'seid').
   Example: {"sentence": "Gestern ______ ich nach Berlin gefahren.", "translation": "Yesterday I drove to Berlin.", "verb": "fahren", "tense": "passato_prossimo", "pronoun": "ich", "correct": "bin"}

3. For 'futuro' (Futur I): Put the '______' placeholder in position 2 for the auxiliary verb 'werden'. The infinitive verb MUST be placed at the VERY END of the sentence. 'correct' MUST be ONLY the conjugated form of 'werden' ('werde', 'wirst', 'wird', 'werden', 'werdet').
   Example: {"sentence": "Morgen ______ wir nach Berlin fahren.", "translation": "Tomorrow we will drive to Berlin.", "verb": "fahren", "tense": "futuro", "pronoun": "wir", "correct": "werden"}

The pronouns allowed are: ich, du, er_sie_es, wir, ihr, sie_Sie.
The tense keys MUST be exactly: presente, passato_prossimo, imperfetto, futuro.

Respond ONLY with a valid JSON array of objects, containing no extra text or markdown formatting. Schema:
[
  {
    "sentence": "Heute ______ ich ein Buch.",
    "translation": "Today I read a book.",
    "verb": "lesen",
    "tense": "presente",
    "pronoun": "ich",
    "correct": "lese"
  }
]`
        : `Generate a JSON list of exactly 5 Italian fill-in-the-blank sentences for language learning.
Choose randomly from the following verbs: [${verbs.join(", ")}].
Choose randomly from the following tenses: [${tenses.join(", ")}].
For each sentence, create a single '______' placeholder representing the conjugated verb.
The pronouns allowed are: io, tu, lui_lei, noi, voi, loro.
The tense keys MUST be exactly: presente, passato_prossimo, imperfetto, futuro.
Ensure the 'correct' field matches the pronoun and tense exactly.
Respond ONLY with a valid JSON array of objects, containing no extra text or markdown formatting. Schema:
[
  {
    "sentence": "Oggi io ______ una mela.",
    "translation": "Today I eat an apple.",
    "verb": "mangiare",
    "tense": "presente",
    "pronoun": "io",
    "correct": "mangio"
  }
]`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(text);
      
      if (!Array.isArray(parsed)) {
        throw new Error("Invalid response format: not an array");
      }

      return parsed;
    },

    async syncApiKeyFromServer() {
      try {
        const response = await fetch("/api/get-key");
        if (response.ok) {
          const data = await response.json();
          if (data.apiKey) {
            StorageManager.state.apiKey = data.apiKey;
            StorageManager.save();
            this.updateSettingsModalState();
          }
        }
      } catch (e) {
        console.log("Could not contact server to sync API key, using local storage fallback.", e);
      }
    },

    async saveApiKeyToServer(key) {
      try {
        await fetch("/api/save-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey: key })
        });
      } catch (e) {
        console.log("Could not save API key to server file, key will remain local to this browser.", e);
      }
    },


    getMotivationalMessage(isCorrect) {
      const isDe = this.uiLang === "de";
      const isIt = this.uiLang === "it";

      if (isCorrect) {
        const correctPraise = isDe
          ? ['🎉 Fantastisch!', '🌟 Ausgezeichnet!', '🔥 Wunderbar!', '🏆 Hervorragend!', '⚡ Super gemacht!']
          : (isIt
            ? ['🎉 Fantastico!', '🌟 Perfetto!', '🔥 Grandioso!', '🏆 Bravissimo!', '⚡ Eccellente!']
            : ['🎉 Fantastic!', '🌟 Excellent!', '🔥 Spot on!', '🏆 Brilliant!', '⚡ Superb!']);
        return correctPraise[Math.floor(Math.random() * correctPraise.length)];
      } else {
        const wrongMotivate = isDe
          ? ['💔 Nicht aufgeben!', '💡 Übung macht den Meister!', '🌱 Aus Fehlern lernt man!', '💪 Beim nächsten Mal klappt's!']
          : (isIt
            ? ['💔 Non ti arrendere!', '💡 Sbagliando s'impara!', '🌱 Ogni errore ti fa crescere!', '💪 Ci riuscirai la prossima volta!']
            : ['💔 Don't give up!', '💡 Practice makes perfect!', '🌱 Every mistake is progress!', '💪 You'll get it next time!']);
        return wrongMotivate[Math.floor(Math.random() * wrongMotivate.length)];
      }
    },

    spawnFloatyXP(text) {
      const container = document.getElementById("floaty-xp-container");
      if (!container) return;
      
      const el = document.createElement("div");
      el.className = "xp-float";
      el.textContent = text;
      container.appendChild(el);

      setTimeout(() => el.remove(), 1200);
    },

    showLevelUpToast() {
      const toast = document.createElement("div");
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, var(--accent-gold), var(--primary));
        color: white;
        padding: 12px 24px;
        border-radius: 99px;
        font-weight: 800;
        font-size: 1.1rem;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        font-family: var(--font-family-display);
        animation: floatUp 2s ease forwards;
      `;
      toast.innerHTML = `<i class="fa-solid fa-crown"></i> LEVEL UP! ${this.t("level_current").replace("{level}", StorageManager.state.level)}`;
      document.body.appendChild(toast);

      setTimeout(() => toast.remove(), 2500);
    }
  };

  // Run app
  App.init();
});
