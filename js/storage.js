/**
 * Coniugiamo! - Local Storage & Progress Tracking Manager
 */

const StorageManager = {
  currentLang: "it",
  STORAGE_KEY: "coniugiamo_user_progress_it",
  
  // Default structure
  defaultState: {
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null, // format: "YYYY-MM-DD"
    verbStats: {},       // key: verbInfinitive, value: { correct: 0, incorrect: 0, lastPracticed: date }
    reviewList: [],      // array of verb infinitives user manually bookmarked
    history: [],         // small history of recent activity { date, xpGained, correctCount, totalCount }
    apiKey: null         // Gemini API key for dynamic sentences
  },

  state: {},

  init(lang = "it") {
    this.currentLang = lang;
    this.STORAGE_KEY = `coniugiamo_user_progress_${lang}`;
    this.state = JSON.parse(JSON.stringify(this.defaultState));

    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.state = { ...this.state, ...parsed };
      } catch (e) {
        console.error("Failed to parse progress data. Resetting.", e);
      }
    }
    this.updateStreak();

    // Sync API key across languages for user convenience
    if (lang === "de") {
      const itData = localStorage.getItem("coniugiamo_user_progress_it");
      if (itData) {
        try {
          const itParsed = JSON.parse(itData);
          if (itParsed.apiKey && !this.state.apiKey) this.state.apiKey = itParsed.apiKey;
        } catch(e){}
      }
    } else if (lang === "it") {
      const deData = localStorage.getItem("coniugiamo_user_progress_de");
      if (deData) {
        try {
          const deParsed = JSON.parse(deData);
          if (deParsed.apiKey && !this.state.apiKey) this.state.apiKey = deParsed.apiKey;
        } catch(e){}
      }
    }

    this.save();
  },

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  },

  getStats() {
    const totalCorrect = Object.values(this.state.verbStats).reduce((acc, stat) => acc + (stat.correct || 0), 0);
    const totalIncorrect = Object.values(this.state.verbStats).reduce((acc, stat) => acc + (stat.incorrect || 0), 0);
    const totalAttempts = totalCorrect + totalIncorrect;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    return {
      xp: this.state.xp,
      level: this.state.level,
      streak: this.state.streak,
      accuracy,
      totalAttempts,
      totalCorrect,
      reviewCount: this.state.reviewList.length,
      struggleCount: this.getStruggleVerbs().length
    };
  },

  addXp(amount) {
    const prevLevel = this.state.level;
    this.state.xp += amount;
    
    // Level up calculation: e.g. 200 XP per level
    this.state.level = Math.floor(this.state.xp / 200) + 1;
    
    const leveledUp = this.state.level > prevLevel;
    this.save();
    return leveledUp;
  },

  recordAnswer(verb, isCorrect) {
    const todayStr = this.getTodayString();
    
    if (!this.state.verbStats[verb]) {
      this.state.verbStats[verb] = { correct: 0, incorrect: 0, lastPracticed: todayStr };
    }
    
    const stat = this.state.verbStats[verb];
    if (isCorrect) {
      stat.correct++;
    } else {
      stat.incorrect++;
    }
    stat.lastPracticed = todayStr;
    
    // Add XP: 10 XP for correct answer, 2 XP for attempting (helps user stay motivated)
    const xpGained = isCorrect ? 10 : 2;
    const leveledUp = this.addXp(xpGained);
    
    this.save();
    return { xpGained, leveledUp };
  },

  toggleReviewVerb(verb) {
    const idx = this.state.reviewList.indexOf(verb);
    let added = false;
    if (idx === -1) {
      this.state.reviewList.push(verb);
      added = true;
    } else {
      this.state.reviewList.splice(idx, 1);
    }
    this.save();
    return added;
  },

  isVerbInReviewList(verb) {
    return this.state.reviewList.includes(verb);
  },

  getStruggleVerbs() {
    const struggle = [];
    for (const [verb, stat] of Object.entries(this.state.verbStats)) {
      const attempts = stat.correct + stat.incorrect;
      if (attempts >= 3) {
        const accuracy = stat.correct / attempts;
        if (accuracy < 0.70) {
          struggle.push({
            infinitive: verb,
            accuracy: Math.round(accuracy * 100),
            attempts
          });
        }
      }
    }
    return struggle;
  },

  updateStreak() {
    const todayStr = this.getTodayString();
    const lastActiveStr = this.state.lastActiveDate;

    if (!lastActiveStr) {
      // First time playing
      this.state.streak = 1;
      this.state.lastActiveDate = todayStr;
    } else if (lastActiveStr !== todayStr) {
      const today = new Date(todayStr);
      const lastActive = new Date(lastActiveStr);
      
      // Calculate difference in days
      const diffTime = Math.abs(today - lastActive);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Active on consecutive day
        this.state.streak++;
      } else if (diffDays > 1) {
        // Missed a day, reset streak to 1
        this.state.streak = 1;
      }
      this.state.lastActiveDate = todayStr;
    }
    // If lastActiveStr === todayStr, no change to streak
  },

  getTodayString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  resetProgress() {
    const key = this.state.apiKey;
    this.state = JSON.parse(JSON.stringify(this.defaultState));
    this.state.lastActiveDate = this.getTodayString();
    this.state.streak = 1;
    this.state.apiKey = key;
    this.save();
  }
};

// Initialize Storage Manager
StorageManager.init();
window.StorageManager = StorageManager;
