/**
 * Coniugiamo! - German Sentences Database for Contextual Learning
 */

const allSentencesDe = [
  // --- Präsens ---
  {
    sentence: "Heute ______ ich ein sehr interessantes Buch.",
    translation: "Today I am reading a very interesting book.",
    verb: "lesen",
    tense: "presente",
    pronoun: "ich",
    correct: "lese"
  },
  {
    sentence: "Was ______ du in deiner Freizeit?",
    translation: "What are you doing in your free time?",
    verb: "machen",
    tense: "presente",
    pronoun: "du",
    correct: "machst"
  },
  {
    sentence: "Er ______ am Abend gerne klassische Musik.",
    translation: "He likes listening to classical music in the evening.",
    verb: "hören",
    tense: "presente",
    pronoun: "er_sie_es",
    correct: "hört"
  },
  {
    sentence: "Wir ______ seit drei Jahren in Berlin.",
    translation: "We have been living in Berlin for three years.",
    verb: "wohnen",
    tense: "presente",
    pronoun: "wir",
    correct: "wohnen"
  },
  {
    sentence: "______ ihr jeden Tag Deutsch?",
    translation: "Are you (plural) studying German every day?",
    verb: "lernen",
    tense: "presente",
    pronoun: "ihr",
    correct: "lernt"
  },
  {
    sentence: "Sie ______ morgen früh nach Hamburg.",
    translation: "They are driving to Hamburg tomorrow morning.",
    verb: "fahren",
    tense: "presente",
    pronoun: "sie_Sie",
    correct: "fahren"
  },
  {
    sentence: "Ich ______ heute extrem müde.",
    translation: "I am extremely tired today.",
    verb: "sein",
    tense: "presente",
    pronoun: "ich",
    correct: "bin"
  },
  {
    sentence: "______ du heute Abend Zeit für mich?",
    translation: "Do you have time for me tonight?",
    verb: "haben",
    tense: "presente",
    pronoun: "du",
    correct: "hast"
  },
  {
    sentence: "Anna ______ ein schönes rotes Auto.",
    translation: "Anna has a beautiful red car.",
    verb: "haben",
    tense: "presente",
    pronoun: "er_sie_es",
    correct: "hat"
  },
  {
    sentence: "Ich ______ gerne ein kaltes Glas Wasser.",
    translation: "I would like to drink a cold glass of water.",
    verb: "trinken",
    tense: "presente",
    pronoun: "ich",
    correct: "trinke"
  },

  // --- Perfekt ---
  {
    sentence: "Gestern ______ ich mit dem Zug nach Berlin gefahren.",
    translation: "Yesterday I traveled to Berlin by train.",
    verb: "fahren",
    tense: "passato_prossimo",
    pronoun: "ich",
    correct: "bin"
  },
  {
    sentence: "Er ______ gestern Abend ein ganzes Buch gelesen.",
    translation: "He read a whole book last night.",
    verb: "lesen",
    tense: "passato_prossimo",
    pronoun: "er_sie_es",
    correct: "hat"
  },
  {
    sentence: "Wir ______ heute sehr fleißig Deutsch gelernt.",
    translation: "We studied German very diligently today.",
    verb: "lernen",
    tense: "passato_prossimo",
    pronoun: "wir",
    correct: "haben"
  },
  {
    sentence: "Lukas ______ gestern den ganzen Tag im Kino gewesen.",
    translation: "Lukas was at the cinema all day yesterday.",
    verb: "sein",
    tense: "passato_prossimo",
    pronoun: "er_sie_es",
    correct: "ist"
  },
  {
    sentence: "Ich ______ gestern alle meine Hausaufgaben gemacht.",
    translation: "I did all of my homework yesterday.",
    verb: "machen",
    tense: "passato_prossimo",
    pronoun: "ich",
    correct: "habe"
  },
  {
    sentence: "______ du schon zu Mittag gegessen?",
    translation: "Have you already eaten lunch?",
    verb: "essen",
    tense: "passato_prossimo",
    pronoun: "du",
    correct: "hast"
  },
  {
    sentence: "Ihr ______ im Sommer nach Italien gereist.",
    translation: "You (plural) traveled to Italy in the summer.",
    verb: "reisen",
    tense: "passato_prossimo",
    pronoun: "ihr",
    correct: "seid"
  },
  {
    sentence: "Sie ______ gestern sehr spät nach Hause gekommen.",
    translation: "They came home very late yesterday.",
    verb: "kommen",
    tense: "passato_prossimo",
    pronoun: "sie_Sie",
    correct: "sind"
  },
  {
    sentence: "______ ihr das frische Brot beim Bäcker gekauft?",
    translation: "Did you (plural) buy the fresh bread at the bakery?",
    verb: "kaufen",
    tense: "passato_prossimo",
    pronoun: "ihr",
    correct: "habt"
  },
  {
    sentence: "Ich ______ gestern einen langen Brief geschrieben.",
    translation: "I wrote a long letter yesterday.",
    verb: "schreiben",
    tense: "passato_prossimo",
    pronoun: "ich",
    correct: "habe"
  },

  // --- Präteritum ---
  {
    sentence: "Als Kind ______ ich einen kleinen Hund.",
    translation: "As a child I had a small dog.",
    verb: "haben",
    tense: "imperfetto",
    pronoun: "ich",
    correct: "hatte"
  },
  {
    sentence: "Gestern ______ das Wetter den ganzen Tag schön.",
    translation: "Yesterday the weather was beautiful all day.",
    verb: "sein",
    tense: "imperfetto",
    pronoun: "er_sie_es",
    correct: "war"
  },
  {
    sentence: "Wir ______ am Ende des Tages sehr müde.",
    translation: "We were very tired at the end of the day.",
    verb: "sein",
    tense: "imperfetto",
    pronoun: "wir",
    correct: "waren"
  },
  {
    sentence: "Du ______ früher viel mehr Kaffee als heute.",
    translation: "You used to drink much more coffee than today.",
    verb: "trinken",
    tense: "imperfetto",
    pronoun: "du",
    correct: "trankst"
  },
  {
    sentence: "Sie ______ damals in einer Wohnung in München.",
    translation: "She used to live in an apartment in Munich back then.",
    verb: "wohnen",
    tense: "imperfetto",
    pronoun: "er_sie_es",
    correct: "wohnte"
  },
  {
    sentence: "Wir ______ fleißig für die schwere Prüfung.",
    translation: "We studied hard for the difficult exam.",
    verb: "lernen",
    tense: "imperfetto",
    pronoun: "wir",
    correct: "lernten"
  },
  {
    sentence: "Früher ______ ich jeden Nachmittag draußen Fußball.",
    translation: "I used to play soccer outside every afternoon.",
    verb: "spielen",
    tense: "imperfetto",
    pronoun: "ich",
    correct: "spielte"
  },
  {
    sentence: "Ihr ______ damals ein schönes Haus am See.",
    translation: "You (plural) had a beautiful house by the lake back then.",
    verb: "haben",
    tense: "imperfetto",
    pronoun: "ihr",
    correct: "hattet"
  },

  // --- Futur I ---
  {
    sentence: "Morgen ______ ich nach Berlin mit dem Auto fahren.",
    translation: "Tomorrow I will drive to Berlin by car.",
    verb: "fahren",
    tense: "futuro",
    pronoun: "ich",
    correct: "werde"
  },
  {
    sentence: "Wir ______ bestimmt bald fließend Deutsch sprechen.",
    translation: "We will certainly speak fluent German soon.",
    verb: "sprechen",
    tense: "futuro",
    pronoun: "wir",
    correct: "werden"
  },
  {
    sentence: "______ du heute Abend zu meiner Party kommen?",
    translation: "Will you come to my party tonight?",
    verb: "kommen",
    tense: "futuro",
    pronoun: "du",
    correct: "wirst"
  },
  {
    sentence: "Ihr ______ am Samstag im Supermarkt arbeiten.",
    translation: "You (plural) will work at the supermarket on Saturday.",
    verb: "arbeiten",
    tense: "futuro",
    pronoun: "ihr",
    correct: "werdet"
  },
  {
    sentence: "Das ______ bestimmt ein fantastisches Jahr werden!",
    translation: "That will certainly be a fantastic year!",
    verb: "werden",
    tense: "futuro",
    pronoun: "er_sie_es",
    correct: "wird"
  },
  {
    sentence: "Sie ______ das neue Auto nächste Woche kaufen.",
    translation: "They will buy the new car next week.",
    verb: "kaufen",
    tense: "futuro",
    pronoun: "sie_Sie",
    correct: "werden"
  }
];

window.GERMAN_SENTENCES = allSentencesDe;
