/**
 * Coniugiamo! - Main App Logic & View Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  // App State
  const App = {
    view: "dashboard",
    lang: "it",

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
      // Load settings
      const savedTheme = localStorage.getItem("coniugiamo_theme") || "light";
      this.setTheme(savedTheme);
      
      const savedSound = localStorage.getItem("coniugiamo_sound");
      this.sound = savedSound === null ? true : savedSound === "true";
      this.updateSoundIcon();

      // Load data & stats
            // Load saved language
      const savedLang = localStorage.getItem("coniugiamo_lang") || "it";
      this.setLanguage(savedLang);

      // Load saved API Key status
      const savedKey = StorageManager.state.apiKey;
      if (savedKey) {
        document.getElementById("input-api-key").value = savedKey;
        const statusEl = document.getElementById("api-key-status");
        statusEl.textContent = "Abilitata";
        statusEl.style.color = "var(--success)";
      }

      // Bind events
      this.bindEvents();
      
      // Load explorer verb list
      this.renderExplorerList();

      // Async sync API key from server
      this.syncApiKeyFromServer();

      console.log("Coniugiamo initialized successfully!");
    },

    // Bind all event listeners
    bindEvents() {
      // Theme Toggle
      document.getElementById("btn-toggle-theme").addEventListener("click", () => {
        const nextTheme = this.theme === "light" ? "dark" : "light";
        this.setTheme(nextTheme);
        AudioManager.playClick();
      });

      // Sound Toggle
      document.getElementById("btn-toggle-sound").addEventListener("click", () => {
        this.sound = AudioManager.toggleSound();
        localStorage.setItem("coniugiamo_sound", this.sound);
        this.updateSoundIcon();
        if (this.sound) AudioManager.playClick();
      });

      // Language selector
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

      // Reset Dati button
      document.getElementById("btn-reset-data").addEventListener("click", () => {
        if (confirm("Sei sicuro di voler resettare tutti i tuoi progressi, i punti XP e le statistiche?")) {
          StorageManager.resetProgress();
                // Load saved language
      const savedLang = localStorage.getItem("coniugiamo_lang") || "it";
      this.setLanguage(savedLang);
          AudioManager.playFailure();
        }
      });

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
        e.stopPropagation(); // stop click from flipping back
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

      // API Key visibility toggle
      document.getElementById("btn-toggle-key-visibility").addEventListener("click", () => {
        AudioManager.playClick();
        const input = document.getElementById("input-api-key");
        const icon = document.getElementById("btn-toggle-key-visibility").querySelector("i");
        if (input.type === "password") {
          input.type = "text";
          icon.className = "fa-solid fa-eye";
        } else {
          input.type = "password";
          icon.className = "fa-solid fa-eye-slash";
        }
      });

      // API Key Save and test
      document.getElementById("btn-save-api-key").addEventListener("click", async () => {
        AudioManager.playClick();
        const input = document.getElementById("input-api-key");
        const key = input.value.trim();
        const statusEl = document.getElementById("api-key-status");
        const saveBtn = document.getElementById("btn-save-api-key");

        if (!key) {
          alert("Inserisci una chiave API valida.");
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = "Verifica...";
        statusEl.textContent = "Verifica...";
        statusEl.style.color = "var(--text-muted)";

        try {
          const isValid = await this.testApiKey(key);
          if (isValid) {
            StorageManager.state.apiKey = key;
            StorageManager.save();
            this.saveApiKeyToServer(key);
            statusEl.textContent = "Abilitata";
            statusEl.style.color = "var(--success)";
            AudioManager.playSuccess();
          } else {
            statusEl.textContent = "Non valida";
            statusEl.style.color = "var(--error)";
            AudioManager.playFailure();
            alert("La chiave API inserita non è valida o non è supportata. Verifica che sia corretta.");
          }
        } catch (e) {
          console.error(e);
          statusEl.textContent = "Errore connessione";
          statusEl.style.color = "var(--error)";
          AudioManager.playFailure();
          alert("Impossibile connettersi alle API di Gemini. Controlla la tua connessione internet.");
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = "Salva e Verifica";
        }
      });

      // API Key Clear
      document.getElementById("btn-clear-api-key").addEventListener("click", () => {
        AudioManager.playClick();
        StorageManager.state.apiKey = null;
        StorageManager.save();
        this.saveApiKeyToServer(null);
        document.getElementById("input-api-key").value = "";
        const statusEl = document.getElementById("api-key-status");
        statusEl.textContent = "Non inserita";
        statusEl.style.color = "var(--text-muted)";
      });
    },

    // Helper for tag selection menus
    setupFilterButtons(parentId, filterKey) {
      const container = document.getElementById(parentId);
      const buttons = container.querySelectorAll(".tag-btn");
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          buttons.forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
          
          let val = btn.dataset[filterKey];
          this.filters[filterKey] = val;
          AudioManager.playClick();
        });
      });
    },

    // Theme setter
    setTheme(theme) {
      this.theme = theme;
      document.body.setAttribute("data-theme", theme);
      localStorage.setItem("coniugiamo_theme", theme);

      const themeBtn = document.getElementById("btn-toggle-theme").querySelector("i");
      if (theme === "dark") {
        themeBtn.className = "fa-solid fa-sun";
      } else {
        themeBtn.className = "fa-solid fa-moon";
      }
    },

    updateSoundIcon() {
      const icon = document.getElementById("btn-toggle-sound").querySelector("i");
      if (this.sound) {
        icon.className = "fa-solid fa-volume-high";
      } else {
        icon.className = "fa-solid fa-volume-xmark";
      }
    },

    // Refresh XP, Streak, Accuracy widgets on dashboard
    refreshStats() {
      const stats = StorageManager.getStats();
      
      // Header values
      document.getElementById("header-streak").textContent = stats.streak;
      document.getElementById("header-xp").textContent = stats.xp;
      document.getElementById("header-level").textContent = `Lvl ${stats.level}`;

      // Dashboard cards
      document.getElementById("stat-xp").textContent = stats.xp;
      document.getElementById("stat-streak").textContent = stats.streak;
      document.getElementById("stat-accuracy").textContent = `${stats.accuracy}%`;
      document.getElementById("stat-attempts").textContent = stats.totalAttempts;

      // Filter Counts
      document.getElementById("tag-bookmark-count").textContent = stats.reviewCount;
      document.getElementById("tag-struggle-count").textContent = stats.struggleCount;

      // Welcome title
      document.getElementById("welcome-title").textContent = `Bentornato! Livello ${stats.level}`;

      // Level Progress Bar
      const currentLevelMin = (stats.level - 1) * 200;
      const nextLevelMin = stats.level * 200;
      const levelRange = nextLevelMin - currentLevelMin;
      const progressInLevel = stats.xp - currentLevelMin;
      const percentage = Math.min(100, Math.max(0, Math.round((progressInLevel / levelRange) * 100)));

      document.getElementById("level-label-current").textContent = `Livello ${stats.level}`;
      document.getElementById("level-label-next").textContent = `Livello ${stats.level + 1}`;
      document.getElementById("xp-progress-fill").style.width = `${percentage}%`;
      
      const xpLeft = nextLevelMin - stats.xp;
      document.getElementById("xp-to-next").textContent = `${xpLeft} XP rimasti al livello successivo`;

      // Struggle Panel list
      const struggleList = StorageManager.getStruggleVerbs();
      const strugglePanel = document.getElementById("struggle-panel");
      const struggleContainer = document.getElementById("struggle-container");

      if (struggleList.length > 0) {
        strugglePanel.style.display = "block";
        struggleContainer.innerHTML = "";
        
        struggleList.forEach(item => {
          const div = document.createElement("div");
          div.className = "struggle-item";
          div.innerHTML = `
            <span>${item.infinitive}</span>
            <span style="font-size: 0.75rem; opacity: 0.8;">(${item.accuracy}%)</span>
          `;
          struggleContainer.appendChild(div);
        });
      } else {
        strugglePanel.style.display = "none";
      }
    },

    // Routing switch
    switchView(newView) {
      // Hide all views
      const views = document.querySelectorAll(".view");
      views.forEach(v => v.classList.remove("active"));

      // Show requested view
      const target = document.getElementById(`view-${newView}`);
      if (target) {
        target.classList.add("active");
        this.view = newView;
        window.scrollTo(0, 0);
      }

      // If returning to dashboard, update stats
      if (newView === "dashboard") {
              // Load saved language
      const savedLang = localStorage.getItem("coniugiamo_lang") || "it";
      this.setLanguage(savedLang);
      }
    },

    // Fetch verbs matching active filter configuration
    getFilteredVerbs() {
      let list = this.getVerbs();

      // Filter by type
      if (this.filters.type !== "all") {
        list = list.filter(v => v.type === this.filters.type);
      }

      // Filter by group
      if (this.filters.group !== "all") {
        list = list.filter(v => v.group === this.filters.group);
      }

      // Filter by custom pool (struggling / bookmarks)
      if (this.filters.pool === "struggle") {
        const struggling = StorageManager.getStruggleVerbs().map(s => s.infinitive);
        list = list.filter(v => struggling.includes(v.infinitive));
      } else if (this.filters.pool === "bookmarks") {
        list = list.filter(v => StorageManager.isVerbInReviewList(v.infinitive));
      }

      return list;
    },

    /* ======================================================================
       QUIZ / DRILL SESSION LOGIC
       ====================================================================== */
    startQuizSession() {
      const verbs = this.getFilteredVerbs();
      
      if (verbs.length === 0) {
        let msg = "Nessun verbo corrisponde ai filtri selezionati.";
        if (this.filters.pool === "struggle") msg += " Non hai ancora verbi considerati 'difficili' (precisione < 70% su almeno 3 tentativi).";
        else if (this.filters.pool === "bookmarks") msg += " Non hai ancora aggiunto alcun verbo ai preferiti.";
        alert(msg);
        return;
      }

      // Build session questions (10 questions or size of verb pool if smaller)
      const tenses = this.filters.tenses;
      const questionPool = [];
      const sessionLength = Math.min(10, verbs.length * tenses.length * 4); // ceiling limits
      
      const pronounsList = this.getPronounsList();

      for (let i = 0; i < sessionLength; i++) {
        // Random pick
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const tense = tenses[Math.floor(Math.random() * tenses.length)];
        const pronoun = pronounsList[Math.floor(Math.random() * pronounsList.length)];
        const correctForm = verb.conjugations[tense][pronoun];

        questionPool.push({
          verb: verb,
          tense: tense,
          pronoun: pronoun,
          correctForm: correctForm
        });
      }

      // Set Quiz State
      this.quiz = {
        active: true,
        mode: "conjugation",
        questions: questionPool,
        currentIndex: 0,
        correctCount: 0,
        isAnswered: false,
        currentQuestion: null
      };

      this.switchView("drill");
      this.showQuizQuestion();
    },

    async startSentenceSession() {
      const apiKey = StorageManager.state.apiKey;

      if (apiKey) {
        // Show Loading Overlay
        this.switchView("drill");
        const loader = document.getElementById("drill-loading-overlay");
        document.getElementById("loading-overlay-text").textContent = this.lang === "de"
          ? "Sätze mit Gemini generieren..."
          : "Generazione frasi con Gemini...";
        loader.style.display = "flex";
        
        // Hide card inputs to keep it clean
        document.getElementById("drill-text-input").style.display = "none";
        document.getElementById("btn-submit-drill").style.display = "none";

        const verbs = this.getFilteredVerbs().map(v => v.infinitive);
        const tenses = this.filters.tenses;

        try {
          const aiSentences = await this.generateSentencesAI(apiKey, verbs, tenses);
          const questionPool = [];

          aiSentences.forEach(item => {
            const verbObj = this.getVerbs().find(v => v.infinitive === item.verb);
            if (verbObj) {
              questionPool.push({
                mode: "sentence",
                sentenceText: item.sentence,
                sentenceTranslation: item.translation,
                verb: verbObj,
                tense: item.tense,
                pronoun: item.pronoun,
                correctForm: item.correct
              });
            }
          });

          if (questionPool.length === 0) {
            throw new Error("No sentences generated successfully");
          }

          this.quiz = {
            active: true,
            mode: "sentence",
            questions: questionPool,
            currentIndex: 0,
            correctCount: 0,
            isAnswered: false,
            currentQuestion: null
          };

          // Restore display inputs
          document.getElementById("drill-text-input").style.display = "";
          document.getElementById("btn-submit-drill").style.display = "";
          loader.style.display = "none";

          this.showQuizQuestion();
          return;

        } catch (e) {
          console.error("Gemini sentence generation failed. Falling back to offline mode.", e);
          document.getElementById("drill-text-input").style.display = "";
          document.getElementById("btn-submit-drill").style.display = "";
          loader.style.display = "none";
          const errMsg = this.lang === "de"
            ? "Fehler bei der Generierung von Sätzen mit KI (Gemini). Verwendung von Offline-Standardphrasen."
            : "Impossibile generare le frasi con l'IA (Gemini). Utilizzo delle frasi predefinite offline.";
          alert(errMsg);
        }
      }

      // Offline Fallback
      let filteredSentences = this.getSentences();

      // Filter by active tenses
      filteredSentences = filteredSentences.filter(s => this.filters.tenses.includes(s.tense));

      // Filter by verb constraints (type, group, pool bookmarks/struggles)
      const allowedVerbs = this.getFilteredVerbs().map(v => v.infinitive);
      filteredSentences = filteredSentences.filter(s => allowedVerbs.includes(s.verb));

      if (filteredSentences.length === 0) {
        const noSentencesMsg = this.lang === "de"
          ? "Keine Offline-Sätze entsprechen den ausgewählten Filtern. Versuchen Sie, mehr Zeitformen auszuwählen oder Typ-/Konjugationsfilter zu entfernen."
          : "Nessuna frase offline corrisponde ai filtri selezionati. Prova a selezionare più tempi verbali o rimuovere i filtri di tipologia/coniugazione.";
        alert(noSentencesMsg);
        this.switchView("dashboard");
        return;
      }

      // Build session questions (10 questions or size of pool if smaller)
      const questionPool = [];
      const sessionLength = Math.min(10, filteredSentences.length);
      
      // Shuffle
      const shuffled = [...filteredSentences].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < sessionLength; i++) {
        const item = shuffled[i];
        const verbObj = this.getVerbs().find(v => v.infinitive === item.verb);
        
        questionPool.push({
          mode: "sentence",
          sentenceText: item.sentence,
          sentenceTranslation: item.translation,
          verb: verbObj,
          tense: item.tense,
          pronoun: item.pronoun,
          correctForm: item.correct
        });
      }

      // Set Quiz State
      this.quiz = {
        active: true,
        mode: "sentence",
        questions: questionPool,
        currentIndex: 0,
        correctCount: 0,
        isAnswered: false,
        currentQuestion: null
      };

      this.switchView("drill");
      this.showQuizQuestion();
    },

    showQuizQuestion() {
      const q = this.quiz.questions[this.quiz.currentIndex];
      this.quiz.currentQuestion = q;
      this.quiz.isAnswered = false;

      // Update Header progress
      const percent = (this.quiz.currentIndex / this.quiz.questions.length) * 100;
      document.getElementById("drill-progress-fill").style.width = `${percent}%`;
      document.getElementById("drill-counter").textContent = `Domanda ${this.quiz.currentIndex + 1} / ${this.quiz.questions.length}`;

      // Card details
      if (this.quiz.mode === "sentence") {
        document.getElementById("drill-inf").textContent = q.sentenceText;
        document.getElementById("drill-trans").textContent = q.sentenceTranslation;
      } else {
        document.getElementById("drill-inf").textContent = q.verb.infinitive;
        document.getElementById("drill-trans").textContent = q.verb.translation;
      }
      
      // Badges
      const tenseLabel = this.getTenses()[q.tense];
      if (this.quiz.mode === "sentence") {
        document.getElementById("drill-tense-badge").textContent = `${tenseLabel} [${q.verb.infinitive}]`;
      } else {
        document.getElementById("drill-tense-badge").textContent = tenseLabel;
      }
      document.getElementById("drill-pronoun-badge").textContent = this.getPronouns()[q.pronoun];

      // Reset Inputs & Feedback
      const input = document.getElementById("drill-text-input");
      input.value = "";
      input.disabled = false;
      input.className = "drill-input"; // remove success/error styling
      
      const feedback = document.getElementById("drill-feedback");
      feedback.style.display = "none";
      feedback.className = "drill-feedback";

      const submitBtn = document.getElementById("btn-submit-drill");
      submitBtn.textContent = this.lang === "de" ? "Antworten" : "Invia Risposta";
      submitBtn.className = "btn-primary";

      setTimeout(() => input.focus(), 150);
    },

    handleQuizSubmit() {
      if (this.quiz.isAnswered) {
        // Go to next question
        this.quiz.currentIndex++;
        if (this.quiz.currentIndex < this.quiz.questions.length) {
          this.showQuizQuestion();
        } else {
          // Finished session
          this.endQuizSession();
        }
        return;
      }

      // Process answer
      const input = document.getElementById("drill-text-input");
      const answer = input.value;
      const q = this.quiz.currentQuestion;

      const isCorrect = this.checkSpelling(answer, q.correctForm);
      this.quiz.isAnswered = true;
      input.disabled = true;

      // Update statistics
      const { xpGained, leveledUp } = StorageManager.recordAnswer(q.verb.infinitive, isCorrect);
      
      // Floating XP popup
      this.spawnFloatyXp(`+${xpGained} XP`, isCorrect ? "gold" : "muted");

      // Play Sound
      if (isCorrect) {
        this.quiz.correctCount++;
        AudioManager.playSuccess();
        input.classList.add("correct");
        const correctText = this.lang === "de" ? "Sehr gut! Die Antwort ist korrekt." : "Splendido! La risposta è corretta.";
        this.showQuizFeedback(true, correctText);
        if (window.Confetti) {
          window.Confetti.spawn(window.innerWidth / 2, window.innerHeight * 0.4, 25);
        }
      } else {
        AudioManager.playFailure();
        input.classList.add("incorrect");
        
        // Format display spelling to look cleaner
        const displaySpelling = q.correctForm.replace("/", " / ");
        const wrongText = this.lang === "de" 
          ? `Oops! Die richtige Antwort war: <strong>${displaySpelling}</strong>.`
          : `Oops! La risposta corretta era: <strong>${displaySpelling}</strong>.`;
        this.showQuizFeedback(false, wrongText);
      }

      // Check level up chime
      if (leveledUp) {
        setTimeout(() => {
          AudioManager.playLevelUp();
          this.showLevelUpToast();
        }, 600);
      }

      // Change button state
      const submitBtn = document.getElementById("btn-submit-drill");
      submitBtn.className = "btn-primary";
      if (this.quiz.currentIndex + 1 === this.quiz.questions.length) {
        submitBtn.textContent = this.lang === "de" ? "Sitzung beenden" : "Termina Quiz";
      } else {
        submitBtn.textContent = this.lang === "de" ? "Nächste Frage" : "Prossima Domanda";
      }
    },

    showQuizFeedback(isCorrect, htmlContent) {
      const feedback = document.getElementById("drill-feedback");
      const headline = document.getElementById("feedback-headline");
      const details = document.getElementById("feedback-details");

      feedback.className = "drill-feedback " + (isCorrect ? "correct" : "incorrect");
      if (isCorrect) {
        headline.innerHTML = this.lang === "de" 
          ? `<i class="fa-solid fa-circle-check"></i> Richtig!`
          : `<i class="fa-solid fa-circle-check"></i> Bravissimo!`;
      } else {
        headline.innerHTML = this.lang === "de" 
          ? `<i class="fa-solid fa-triangle-exclamation"></i> Falsch`
          : `<i class="fa-solid fa-triangle-exclamation"></i> Sbagliato`;
      }

      details.innerHTML = htmlContent;
      feedback.style.display = "block";
    },

    endQuizSession() {
      this.quiz.active = false;
      this.switchView("dashboard");
    },

    /* Smart spellchecker algorithm */
    checkSpelling(userInput, correctSpelling) {
      const input = userInput.trim().toLowerCase().replace(/\s+/g, ' ');
      const correct = correctSpelling.trim().toLowerCase();
      
      // Remove optional pronouns that the user might have accidentally typed (e.g. "io parlo")
      const prefixes = this.lang === "de"
        ? ["ich ", "du ", "er ", "sie ", "es ", "wir ", "ihr ", "Sie "]
        : ["io ", "tu ", "lui ", "lei ", "noi ", "voi ", "loro "];
      let cleanedInput = input;
      for (const prefix of prefixes) {
        if (cleanedInput.startsWith(prefix)) {
          cleanedInput = cleanedInput.substring(prefix.length).trim();
          break;
        }
      }

      // Expand slashes (e.g., "sono andato/a" -> "sono andato" or "sono andata")
      if (correct.includes("/")) {
        const expansions = this.expandSlashes(correct);
        return expansions.includes(cleanedInput);
      }

      return cleanedInput === correct;
    },

    expandSlashes(str) {
      if (!str.includes("/")) return [str];
      
      const words = str.split(" ");
      const slashWordIdx = words.findIndex(w => w.includes("/"));
      if (slashWordIdx === -1) return [str];

      const slashWord = words[slashWordIdx]; // e.g. "andato/a" or "stati/e"
      const parts = slashWord.split("/"); // ["andato", "a"]
      const word1 = parts[0];
      const suffix2 = parts[1]; // "a"
      const suffixLength = suffix2.length;
      
      // replace ending of word1 with suffix2
      const word2 = word1.slice(0, -suffixLength) + suffix2;

      const optionA = [...words];
      optionA[slashWordIdx] = word1;

      const optionB = [...words];
      optionB[slashWordIdx] = word2;

      return [optionA.join(" "), optionB.join(" ")];
    },

    spawnFloatyXp(text, type) {
      const container = document.getElementById("floaty-xp-container");
      if (!container) return;

      const el = document.createElement("div");
      el.className = "xp-float";
      if (type === "muted") el.style.color = "var(--text-muted)";
      el.textContent = text;

      container.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    },

    showLevelUpToast() {
      if (window.Confetti) {
        window.Confetti.spawn(window.innerWidth / 2, window.innerHeight * 0.5, 75);
      }
      // Build a premium floating toast for level-up celebration
      const toast = document.createElement("div");
      toast.style.position = "fixed";
      toast.style.bottom = "30px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%) translateY(100px)";
      toast.style.background = "linear-gradient(135deg, var(--accent-gold), var(--primary))";
      toast.style.color = "white";
      toast.style.padding = "16px 32px";
      toast.style.borderRadius = "99px";
      toast.style.boxShadow = "0 10px 30px rgba(249, 115, 22, 0.4)";
      toast.style.zIndex = "1000";
      toast.style.textAlign = "center";
      toast.style.fontWeight = "800";
      toast.style.fontFamily = "var(--font-family-display)";
      toast.style.transition = "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      const levelTitle = this.lang === "de" ? "NEUES LEVEL!" : "NUOVO LIVELLO!";
      const levelSubtitle = this.lang === "de" ? "Du bist ein Level aufgestiegen! Weiter so!" : "Sei salito di livello! Continua così!";
      toast.innerHTML = `
        <div style="font-size:1.5rem; margin-bottom: 2px;">🎉 ${levelTitle} 🎉</div>
        <div style="font-size:0.9rem; font-weight: 500; opacity: 0.9;">${levelSubtitle}</div>
      `;

      document.body.appendChild(toast);
      
      // Animate up
      setTimeout(() => {
        toast.style.transform = "translateX(-50%) translateY(0)";
      }, 50);

      // Animate down and remove
      setTimeout(() => {
        toast.style.transform = "translateX(-50%) translateY(150px)";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 600);
      }, 4000);
    },

    /* ======================================================================
       FLASHCARDS SESSION LOGIC
       ====================================================================== */
    startFlashcardSession() {
      const verbs = this.getFilteredVerbs();
      
      if (verbs.length === 0) {
        alert("Nessun verbo corrisponde ai filtri selezionati.");
        return;
      }

      // Generate a set of 10 random flashcards
      const tenses = this.filters.tenses;
      const cards = [];
      const sessionLength = Math.min(10, verbs.length * tenses.length);

      for (let i = 0; i < sessionLength; i++) {
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const tense = tenses[Math.floor(Math.random() * tenses.length)];
        cards.push({ verb, tense });
      }

      this.flashcards = {
        active: true,
        cards: cards,
        currentIndex: 0,
        flipped: false
      };

      this.switchView("flashcards");
      this.showFlashcard();
    },

    showFlashcard() {
      const card = this.flashcards.cards[this.flashcards.currentIndex];
      
      // Reset 3D element flip state
      this.flashcards.flipped = false;
      const cardEl = document.getElementById("flashcard-element");
      cardEl.classList.remove("flipped");

      // Counter
      document.getElementById("flashcards-counter").textContent = `Card ${this.flashcards.currentIndex + 1} / ${this.flashcards.cards.length}`;

      // Card Front content
      document.getElementById("card-inf").textContent = card.verb.infinitive;
      document.getElementById("card-trans").textContent = card.verb.translation;
      document.getElementById("card-tense").textContent = this.getTenses()[card.tense];

      // Card Back content
      document.getElementById("card-back-tense-title").textContent = this.getTenses()[card.tense];
      
      // Generate conjugation table inside back of card
      const conjContainer = document.getElementById("card-back-conjugations");
      conjContainer.innerHTML = "";

      const pronounsList = this.getPronounsList();
      pronounsList.forEach(p => {
        const spelling = card.verb.conjugations[card.tense][p];
        const displaySpelling = spelling.replace("/", " / ");
        
        const cell = document.createElement("div");
        cell.className = "conj-cell";
        cell.innerHTML = `
          <span class="pron">${this.getPronouns()[p]}</span>
          <span class="conj">${displaySpelling}</span>
        `;
        conjContainer.appendChild(cell);
      });
    },

    handleFlashcardFeedback(isCorrect) {
      const card = this.flashcards.cards[this.flashcards.currentIndex];
      
      // Record answer
      const { xpGained, leveledUp } = StorageManager.recordAnswer(card.verb.infinitive, isCorrect);
      
      // Floating XP popup
      this.spawnFloatyXp(`+${xpGained} XP`, isCorrect ? "gold" : "muted");

      // Play Sound
      if (isCorrect) {
        AudioManager.playSuccess();
        if (window.Confetti) {
          window.Confetti.spawn(window.innerWidth / 2, window.innerHeight * 0.4, 25);
        }
      } else {
        AudioManager.playFailure();
      }

      // Check level up
      if (leveledUp) {
        setTimeout(() => {
          AudioManager.playLevelUp();
          this.showLevelUpToast();
        }, 600);
      }

      // Show next card or end
      this.flashcards.currentIndex++;
      if (this.flashcards.currentIndex < this.flashcards.cards.length) {
        this.showFlashcard();
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
    setLanguage(lang) {
      this.lang = lang;
      localStorage.setItem("coniugiamo_lang", lang);
      StorageManager.init(lang);
      
      // Update select element value
      document.getElementById("header-lang-select").value = lang;

      // Update API Key UI elements
      const savedKey = StorageManager.state.apiKey;
      document.getElementById("input-api-key").value = savedKey || "";
      const statusEl = document.getElementById("api-key-status");
      if (statusEl) {
        if (savedKey) {
          statusEl.textContent = "Abilitata";
          statusEl.style.color = "var(--success)";
        } else {
          statusEl.textContent = "Non inserita";
          statusEl.style.color = "var(--text-muted)";
        }
      }

      // Update Verb Ending Group filters
      const groupContainer = document.getElementById("filter-group");
      if (groupContainer) {
        const buttons = groupContainer.querySelectorAll(".tag-btn");
        if (lang === "de") {
          buttons[0].textContent = "Alle";
          buttons[0].setAttribute("data-group", "all");
          buttons[1].textContent = "-en";
          buttons[1].setAttribute("data-group", "en");
          buttons[2].textContent = "-n";
          buttons[2].setAttribute("data-group", "n");
          if (buttons[3]) buttons[3].style.display = "none";
        } else {
          buttons[0].textContent = "Tutte";
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
        
        // Reset active filter selection to "all" to prevent invalid states
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
        if (lang === "de") {
          buttons[0].childNodes[0].textContent = "Alle Verben";
          buttons[1].childNodes[0].textContent = "Schwierige Verben ";
          buttons[2].childNodes[0].textContent = "Favoriten ";
        } else {
          buttons[0].childNodes[0].textContent = "Tutti i verbi";
          buttons[1].childNodes[0].textContent = "Verbi difficili ";
          buttons[2].childNodes[0].textContent = "Preferiti ";
        }
      }

      // Update Verb Type buttons
      const typeContainer = document.getElementById("filter-type");
      if (typeContainer) {
        const buttons = typeContainer.querySelectorAll(".tag-btn");
        if (lang === "de") {
          buttons[0].textContent = "Alle";
          buttons[1].textContent = "Regelmäßig";
          buttons[2].textContent = "Unregelmäßig";
        } else {
          buttons[0].textContent = "Tutti";
          buttons[1].textContent = "Regolari";
          buttons[2].textContent = "Irregolari";
        }
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
            <p>${lang === "de" ? "Wählen Sie ein Verb aus der Liste links aus, um die Konjugationstabellen anzuzeigen." : "Seleziona un verbo dalla lista a sinistra per visualizzare le tabelle di coniugazione complete."}</p>
          </div>
        `;
      }

      // Adapt welcome UI
      const welcomeBox = document.getElementById("welcome-title");
      if (welcomeBox) {
        if (lang === "de") {
          welcomeBox.textContent = `Willkommen! Level ${StorageManager.state.level}`;
          document.getElementById("btn-go-explorer").innerHTML = `<i class="fa-solid fa-book-open"></i> Verben durchsuchen (Verb Dictionary)`;
        } else {
          welcomeBox.textContent = `Bentornato! Livello ${StorageManager.state.level}`;
          document.getElementById("btn-go-explorer").innerHTML = `<i class="fa-solid fa-book-open"></i> Esplora Coniugazioni (Verb Dictionary)`;
        }
      }
    },

renderExplorerList() {
      const search = document.getElementById("explorer-search").value.trim().toLowerCase();
      const groupFilter = document.getElementById("explorer-filter-group").value;
      const listContainer = document.getElementById("explorer-verb-list");
      
      listContainer.innerHTML = "";

      let verbs = this.getVerbs();

      // Apply search term
      if (search) {
        verbs = verbs.filter(v => 
          v.infinitive.toLowerCase().includes(search) || 
          v.translation.toLowerCase().includes(search)
        );
      }

      // Apply conjugation group filter
      if (groupFilter !== "all") {
        verbs = verbs.filter(v => v.group === groupFilter);
      }

      if (verbs.length === 0) {
        listContainer.innerHTML = `
          <div class="empty-state" style="padding:20px;">
            <i class="fa-solid fa-circle-info"></i>
            <p style="font-size:0.9rem;">Nessun verbo corrisponde alla ricerca.</p>
          </div>
        `;
        return;
      }

      // Render buttons in left column
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
          // Highlight active
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

      // Bind TTS button
      header.querySelector("#btn-speak-infinitive").addEventListener("click", (e) => {
        e.stopPropagation();
        this.speakText(verb.infinitive);
      });

      // Bind Bookmark button
      header.querySelector("#btn-toggle-bookmark").addEventListener("click", (e) => {
        e.stopPropagation();
        const added = StorageManager.toggleReviewVerb(verb.infinitive);
        AudioManager.playClick();
        this.renderExplorerDetails(verb); // re-render to update colors
              // Load saved language
      const savedLang = localStorage.getItem("coniugiamo_lang") || "it";
      this.setLanguage(savedLang); // updates counts in dashboard
      });

      // Grid of tenses table cards
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
        // Cancel active Speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const targetLangCode = this.lang === "de" ? "de-DE" : "it-IT";
        utterance.lang = targetLangCode;
        
        // Find target voice
        const voices = window.speechSynthesis.getVoices();
        const targetVoice = voices.find(v => v.lang.startsWith(this.lang));
        if (targetVoice) {
          utterance.voice = targetVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    },

    // Gemini API integration helpers
    async testApiKey(apiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Respond ONLY with JSON: {\"status\":\"ok\"}" }] }],
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
      
      const langName = this.lang === "de" ? "German" : "Italian";
      const exampleSentence = this.lang === "de" ? 'Heute ______ ich ein Buch.' : 'Oggi io ______ una mela.';
      const exampleTranslation = this.lang === "de" ? 'Today I read a book.' : 'Today I eat an apple.';
      const exampleVerb = this.lang === "de" ? 'lesen' : 'mangiare';
      const exampleTense = this.lang === "de" ? 'presente' : 'presente';
      const examplePronoun = this.lang === "de" ? 'ich' : 'io';
      const exampleCorrect = this.lang === "de" ? 'lese' : 'mangio';
      const pronounConstraint = this.lang === "de" 
        ? "ich, du, er_sie_es, wir, ihr, sie_Sie" 
        : "io, tu, lui_lei, noi, voi, loro";

      const prompt = `Generate a JSON list of exactly 5 ${langName} fill-in-the-blank sentences for language learning.
Choose randomly from the following verbs: [${verbs.join(", ")}].
Choose randomly from the following tenses: [${tenses.join(", ")}].
For each sentence, create a single '______' placeholder representing the conjugated verb.
The pronouns allowed are: ${pronounConstraint}.
The tense keys MUST be exactly: presente, passato_prossimo, imperfetto, futuro.
If the verb uses 'sein' in Perfekt (passato_prossimo) in German, or 'essere' in passato_prossimo in Italian, ensure the correct field has the appropriate auxiliary + past participle. 
Ensure the correct field matches the pronoun and tense exactly.
Respond ONLY with a valid JSON array of objects, containing no extra text or markdown formatting. The schema is:
[
  {
    "sentence": "${exampleSentence}",
    "translation": "${exampleTranslation}",
    "verb": "${exampleVerb}",
    "tense": "${exampleTense}",
    "pronoun": "${examplePronoun}",
    "correct": "${exampleCorrect}"
  }
]`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
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
            this.setLanguage(this.lang);
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
    }

  };

  // Run app
  App.init();
});
