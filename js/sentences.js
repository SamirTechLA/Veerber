/**
 * Coniugiamo! - Sentences Database for Contextual Learning
 */

const allSentences = [
  // --- Presente ---
  {
    sentence: "Oggi io ______ una mela a merenda.",
    translation: "Today I eat an apple for an afternoon snack.",
    verb: "mangiare",
    tense: "presente",
    pronoun: "io",
    correct: "mangio"
  },
  {
    sentence: "Stasera noi ______ al cinema a vedere un film.",
    translation: "Tonight we go to the cinema to see a movie.",
    verb: "andare",
    tense: "presente",
    pronoun: "noi",
    correct: "andiamo"
  },
  {
    sentence: "Voi ______ l'italiano molto bene!",
    translation: "You (plural) speak Italian very well!",
    verb: "parlare",
    tense: "presente",
    pronoun: "voi",
    correct: "parlate"
  },
  {
    sentence: "Tu ______ dove si trova la stazione?",
    translation: "Do you know where the station is?",
    verb: "sapere",
    tense: "presente",
    pronoun: "tu",
    correct: "sai"
  },
  {
    sentence: "Luca ______ sempre la verità ai suoi genitori.",
    translation: "Luca always tells the truth to his parents.",
    verb: "dire",
    tense: "presente",
    pronoun: "lui_lei",
    correct: "dice"
  },
  {
    sentence: "Noi ______ un caffè caldo al bar dell'angolo.",
    translation: "We drink a hot coffee at the corner bar.",
    verb: "bere",
    tense: "presente",
    pronoun: "noi",
    correct: "beviamo"
  },
  {
    sentence: "I bambini ______ a calcio nel parco della città.",
    translation: "The children play soccer in the city park.",
    verb: "giocare",
    tense: "presente",
    pronoun: "loro",
    correct: "giocano"
  },
  {
    sentence: "Ogni mattina io ______ di casa alle otto.",
    translation: "Every morning I go out of the house at eight o'clock.",
    verb: "uscire",
    tense: "presente",
    pronoun: "io",
    correct: "esco"
  },
  {
    sentence: "Domenica lei ______ a casa per riposare.",
    translation: "On Sunday she stays at home to rest.",
    verb: "stare",
    tense: "presente",
    pronoun: "lui_lei",
    correct: "sta"
  },
  {
    sentence: "Loro ______ un libro molto interessante.",
    translation: "They read a very interesting book.",
    verb: "leggere",
    tense: "presente",
    pronoun: "loro",
    correct: "leggono"
  },

  // --- Passato Prossimo ---
  {
    sentence: "Ieri io ______ al mare con i miei amici.",
    translation: "Yesterday I went to the seaside with my friends.",
    verb: "andare",
    tense: "passato_prossimo",
    pronoun: "io",
    correct: "sono andato/a"
  },
  {
    sentence: "Noi ______ un film fantastico al cinema ieri sera.",
    translation: "We saw a fantastic movie at the cinema last night.",
    verb: "vedere",
    tense: "passato_prossimo",
    pronoun: "noi",
    correct: "abbiamo visto"
  },
  {
    sentence: "Tu ______ tutti i compiti di italiano?",
    translation: "Did you finish all the Italian homework?",
    verb: "finire",
    tense: "passato_prossimo",
    pronoun: "tu",
    correct: "hai finito"
  },
  {
    sentence: "Ieri gli studenti ______ una mail al professore.",
    translation: "Yesterday the students wrote an email to the professor.",
    verb: "scrivere",
    tense: "passato_prossimo",
    pronoun: "loro",
    correct: "hanno scritto"
  },
  {
    sentence: "L'anno scorso lei ______ in treno per tutta l'Europa.",
    translation: "Last year she traveled by train across all of Europe.",
    verb: "viaggiare",
    tense: "passato_prossimo",
    pronoun: "lui_lei",
    correct: "ha viaggiato"
  },
  {
    sentence: "Noi ______ una torta deliziosa per il suo compleanno.",
    translation: "We made a delicious cake for his birthday.",
    verb: "fare",
    tense: "passato_prossimo",
    pronoun: "noi",
    correct: "abbiamo fatto"
  },
  {
    sentence: "Dov'è andato Luca? Lui ______ un'ora fa.",
    translation: "Where did Luca go? He left an hour ago.",
    verb: "partire",
    tense: "passato_prossimo",
    pronoun: "lui_lei",
    correct: "è partito"
  },
  {
    sentence: "Voi ______ con gli amici ieri sera?",
    translation: "Did you go out with friends last night?",
    verb: "uscire",
    tense: "passato_prossimo",
    pronoun: "voi",
    correct: "siete usciti/e"
  },
  {
    sentence: "Ieri io ______ molto stanco dopo il lavoro.",
    translation: "Yesterday I was very tired after work.",
    verb: "essere",
    tense: "passato_prossimo",
    pronoun: "io",
    correct: "sono stato/a"
  },
  {
    sentence: "Loro ______ la partita e hanno festeggiato.",
    translation: "They won the match and celebrated.",
    verb: "vincere",
    tense: "passato_prossimo",
    pronoun: "loro",
    correct: "hanno vinto"
  },

  // --- Imperfetto ---
  {
    sentence: "Mentre tu ______, io ho preparato la cena.",
    translation: "While you were sleeping, I prepared dinner.",
    verb: "dormire",
    tense: "imperfetto",
    pronoun: "tu",
    correct: "dormivi"
  },
  {
    sentence: "Da bambina io ______ sempre con le bambole.",
    translation: "As a little girl I always played with dolls.",
    verb: "giocare",
    tense: "imperfetto",
    pronoun: "io",
    correct: "giocavo"
  },
  {
    sentence: "Ieri ______ brutto tempo e pioveva forte.",
    translation: "Yesterday the weather was bad and it was raining hard.",
    verb: "essere",
    tense: "imperfetto",
    pronoun: "lui_lei",
    correct: "era"
  },
  {
    sentence: "Quando noi ______ giovani, andavamo sempre in bicicletta.",
    translation: "When we were young, we always rode bicycles.",
    verb: "essere",
    tense: "imperfetto",
    pronoun: "noi",
    correct: "eravamo"
  },
  {
    sentence: "Mio padre ______ in una grande fabbrica di Milano.",
    translation: "My father used to work in a large Milan factory.",
    verb: "lavorare",
    tense: "imperfetto",
    pronoun: "lui_lei",
    correct: "lavorava"
  },
  {
    sentence: "Mentre loro ______ la televisione, si è spenta la luce.",
    translation: "While they were watching TV, the lights went out.",
    verb: "vedere",
    tense: "imperfetto",
    pronoun: "loro",
    correct: "vedevano"
  },
  {
    sentence: "Da studente io ______ tre libri al mese.",
    translation: "As a student I used to read three books a month.",
    verb: "leggere",
    tense: "imperfetto",
    pronoun: "io",
    correct: "leggevo"
  },
  {
    sentence: "Voi ______ sempre molte domande a scuola.",
    translation: "You (plural) always had many questions at school.",
    verb: "avere",
    tense: "imperfetto",
    pronoun: "voi",
    correct: "avevate"
  },

  // --- Futuro ---
  {
    sentence: "L'anno prossimo noi ______ in vacanza in Italia.",
    translation: "Next year we will go on vacation to Italy.",
    verb: "andare",
    tense: "futuro",
    pronoun: "noi",
    correct: "andremo"
  },
  {
    sentence: "Domani lei ______ una lettera formale al capo.",
    translation: "Tomorrow she will write a formal letter to the boss.",
    verb: "scrivere",
    tense: "futuro",
    pronoun: "lui_lei",
    correct: "scriverà"
  },
  {
    sentence: "Sabato prossimo io ______ un computer portatile nuovo.",
    translation: "Next Saturday I will buy a new laptop computer.",
    verb: "comprare",
    tense: "futuro",
    pronoun: "io",
    correct: "comprerò"
  },
  {
    sentence: "Loro ______ un viaggio intorno al mondo l'anno prossimo.",
    translation: "They will make a trip around the world next year.",
    verb: "fare",
    tense: "futuro",
    pronoun: "loro",
    correct: "faranno"
  },
  {
    sentence: "Domenica noi ______ fino a tardi per rilassarci.",
    translation: "On Sunday we will sleep late to relax.",
    verb: "dormire",
    tense: "futuro",
    pronoun: "noi",
    correct: "dormiremo"
  },
  {
    sentence: "Se studi con attenzione, tu ______ tutto.",
    translation: "If you study carefully, you will understand everything.",
    verb: "capire",
    tense: "futuro",
    pronoun: "tu",
    correct: "capirai"
  },
  {
    sentence: "Domani i negozi dell'aeroporto ______ alle sei.",
    translation: "Tomorrow the airport shops will open at six.",
    verb: "aprire",
    tense: "futuro",
    pronoun: "loro",
    correct: "apriranno"
  }
];

window.ITALIAN_SENTENCES = allSentences;
