/**
 * Coniugiamo! - German Verb Database & Conjugator Engine
 */

function buildGermanRegularVerb(infinitive, translation, auxiliary, options = {}) {
  const customConjugations = options.customConjugations || {};
  const isIeren = infinitive.endsWith("ieren");
  const isSeparable = options.isSeparable || false;
  const hasInseparablePrefix = options.hasInseparablePrefix || 
    (infinitive.startsWith("be") || infinitive.startsWith("ent") || 
     infinitive.startsWith("er") || infinitive.startsWith("ver") || 
     infinitive.startsWith("zer") || infinitive.startsWith("ge") || 
     infinitive.startsWith("emp"));

  const verb = {
    infinitive,
    translation,
    group: infinitive.endsWith("en") ? "en" : "n",
    type: "regular",
    auxiliary,
    conjugations: {}
  };

  // Determine stem (e.g. "lernen" -> "lern", "handeln" -> "handel")
  const stem = infinitive.endsWith("en") ? infinitive.slice(0, -2) : infinitive.slice(0, -1);

  // Spelling flags
  const endsInTOrD = stem.endsWith("t") || stem.endsWith("d");
  const endsInFNOrGN = stem.endsWith("fn") || stem.endsWith("gn");
  const needsE = endsInTOrD || endsInFNOrGN; // e.g. arbeiten -> du arbeitest (adds e)
  
  const endsInSibilant = stem.endsWith("s") || stem.endsWith("z") || stem.endsWith("ß") || stem.endsWith("x");

  // Auxiliary forms
  const habenPresent = { ich: "habe", du: "hast", er_sie_es: "hat", wir: "haben", ihr: "habt", sie_Sie: "haben" };
  const seinPresent = { ich: "bin", du: "bist", er_sie_es: "ist", wir: "sind", ihr: "seid", sie_Sie: "sind" };
  const aux = auxiliary === "sein" ? seinPresent : habenPresent;

  // Past Participle
  let pp = "";
  if (isIeren || hasInseparablePrefix) {
    pp = stem + (needsE ? "et" : "t"); // e.g. studieren -> studiert, verkaufen -> verkauft
  } else {
    pp = "ge" + stem + (needsE ? "et" : "t"); // e.g. lernen -> gelernt, arbeiten -> gearbeitet
  }

  // Perfekt
  const buildPerfekt = () => {
    const list = {};
    const pronouns = ["ich", "du", "er_sie_es", "wir", "ihr", "sie_Sie"];
    pronouns.forEach(p => {
      list[p] = `${aux[p]} ${pp}`;
    });
    return list;
  };

  // Präsens
  const buildPräsens = () => {
    const list = {};
    list.ich = stem + "e";
    list.du = needsE ? stem + "est" : (endsInSibilant ? stem + "t" : stem + "st");
    list.er_sie_es = needsE ? stem + "et" : stem + "t";
    list.wir = stem + "en";
    list.ihr = needsE ? stem + "et" : stem + "t";
    list.sie_Sie = stem + "en";
    return list;
  };

  // Präteritum
  const buildPräteritum = () => {
    const list = {};
    const suffix = needsE ? "ete" : "te";
    list.ich = stem + suffix;
    list.du = stem + suffix + "st";
    list.er_sie_es = stem + suffix;
    list.wir = stem + suffix + "n";
    list.ihr = stem + suffix + "t";
    list.sie_Sie = stem + suffix + "n";
    return list;
  };

  // Futur I
  const buildFuturI = () => {
    const werdenPresent = { ich: "werde", du: "wirst", er_sie_es: "wird", wir: "werden", ihr: "werdet", sie_Sie: "werden" };
    const list = {};
    const pronouns = ["ich", "du", "er_sie_es", "wir", "ihr", "sie_Sie"];
    pronouns.forEach(p => {
      list[p] = `${werdenPresent[p]} ${infinitive}`;
    });
    return list;
  };

  verb.conjugations.presente = buildPräsens();       // mapped key for Present
  verb.conjugations.passato_prossimo = buildPerfekt(); // mapped key for Perfect
  verb.conjugations.imperfetto = buildPräteritum();  // mapped key for Imperfect
  verb.conjugations.futuro = buildFuturI();          // mapped key for Future

  // Apply custom overrides
  for (const tense in customConjugations) {
    verb.conjugations[tense] = {
      ...verb.conjugations[tense],
      ...customConjugations[tense]
    };
  }

  return verb;
}

// Manually conjugate strong and irregular German verbs
const irregularVerbsDe = [
  {
    infinitive: "sein",
    translation: "to be",
    group: "en",
    type: "irregular",
    auxiliary: "sein",
    conjugations: {
      presente: { ich: "bin", du: "bist", er_sie_es: "ist", wir: "sind", ihr: "seid", sie_Sie: "sind" },
      passato_prossimo: { ich: "bin gewesen", du: "bist gewesen", er_sie_es: "ist gewesen", wir: "sind gewesen", ihr: "seid gewesen", sie_Sie: "sind gewesen" },
      imperfetto: { ich: "war", du: "warst", er_sie_es: "war", wir: "waren", ihr: "wart", sie_Sie: "waren" },
      futuro: { ich: "werde sein", du: "wirst sein", er_sie_es: "wird sein", wir: "werden sein", ihr: "werdet sein", sie_Sie: "werden sein" }
    }
  },
  {
    infinitive: "haben",
    translation: "to have",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "habe", du: "hast", er_sie_es: "hat", wir: "haben", ihr: "habt", sie_Sie: "haben" },
      passato_prossimo: { ich: "habe gehabt", du: "hast gehabt", er_sie_es: "hat gehabt", wir: "haben gehabt", ihr: "habt gehabt", sie_Sie: "haben gehabt" },
      imperfetto: { ich: "hatte", du: "hattest", er_sie_es: "hatte", wir: "hatten", ihr: "hattet", sie_Sie: "hatten" },
      futuro: { ich: "werde haben", du: "wirst haben", er_sie_es: "wird haben", wir: "werden haben", ihr: "werdet haben", sie_Sie: "werden haben" }
    }
  },
  {
    infinitive: "werden",
    translation: "to become",
    group: "en",
    type: "irregular",
    auxiliary: "sein",
    conjugations: {
      presente: { ich: "werde", du: "wirst", er_sie_es: "wird", wir: "werden", ihr: "werdet", sie_Sie: "werden" },
      passato_prossimo: { ich: "bin geworden", du: "bist geworden", er_sie_es: "ist geworden", wir: "sind geworden", ihr: "seid geworden", sie_Sie: "sind geworden" },
      imperfetto: { ich: "wurde", du: "wurdest", er_sie_es: "wurde", wir: "wurden", ihr: "wurdet", sie_Sie: "wurden" },
      futuro: { ich: "werde werden", du: "wirst werden", er_sie_es: "wird werden", wir: "werden werden", ihr: "werdet werden", sie_Sie: "werden werden" }
    }
  },
  {
    infinitive: "gehen",
    translation: "to go",
    group: "en",
    type: "irregular",
    auxiliary: "sein",
    conjugations: {
      presente: { ich: "gehe", du: "gehst", er_sie_es: "geht", wir: "gehen", ihr: "geht", sie_Sie: "gehen" },
      passato_prossimo: { ich: "bin gegangen", du: "bist gegangen", er_sie_es: "ist gegangen", wir: "sind gegangen", ihr: "seid gegangen", sie_Sie: "sind gegangen" },
      imperfetto: { ich: "ging", du: "gingst", er_sie_es: "ging", wir: "gingen", ihr: "gingt", sie_Sie: "gingen" },
      futuro: { ich: "werde gehen", du: "wirst gehen", er_sie_es: "wird gehen", wir: "werden gehen", ihr: "werdet gehen", sie_Sie: "werden gehen" }
    }
  },
  {
    infinitive: "fahren",
    translation: "to drive, to ride",
    group: "en",
    type: "irregular",
    auxiliary: "sein",
    conjugations: {
      presente: { ich: "fahre", du: "fährst", er_sie_es: "fährt", wir: "fahren", ihr: "fahrt", sie_Sie: "fahren" },
      passato_prossimo: { ich: "bin gefahren", du: "bist gefahren", er_sie_es: "ist gefahren", wir: "sind gefahren", ihr: "seid gefahren", sie_Sie: "sind gefahren" },
      imperfetto: { ich: "fuhr", du: "fuhrst", er_sie_es: "fuhr", wir: "fuhren", ihr: "fuhrt", sie_Sie: "fuhren" },
      futuro: { ich: "werde fahren", du: "wirst fahren", er_sie_es: "wird fahren", wir: "werden fahren", ihr: "werdet fahren", sie_Sie: "werden fahren" }
    }
  },
  {
    infinitive: "sehen",
    translation: "to see",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "sehe", du: "siehst", er_sie_es: "sieht", wir: "sehen", ihr: "seht", sie_Sie: "sehen" },
      passato_prossimo: { ich: "habe gesehen", du: "hast gesehen", er_sie_es: "hat gesehen", wir: "haben gesehen", ihr: "habt gesehen", sie_Sie: "haben gesehen" },
      imperfetto: { ich: "sah", du: "sahst", er_sie_es: "sah", wir: "sahen", ihr: "saht", sie_Sie: "sahen" },
      futuro: { ich: "werde sehen", du: "wirst sehen", er_sie_es: "wird sehen", wir: "werden sehen", ihr: "werdet sehen", sie_Sie: "werden sehen" }
    }
  },
  {
    infinitive: "lesen",
    translation: "to read",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "lese", du: "liest", er_sie_es: "liest", wir: "lesen", ihr: "lest", sie_Sie: "lesen" },
      passato_prossimo: { ich: "habe gelesen", du: "hast gelesen", er_sie_es: "hat gelesen", wir: "haben gelesen", ihr: "habt gelesen", sie_Sie: "haben gelesen" },
      imperfetto: { ich: "las", du: "last", er_sie_es: "las", wir: "lasen", ihr: "last", sie_Sie: "lasen" },
      futuro: { ich: "werde lesen", du: "wirst lesen", er_sie_es: "wird lesen", wir: "werden lesen", ihr: "werdet lesen", sie_Sie: "werden lesen" }
    }
  },
  {
    infinitive: "sprechen",
    translation: "to speak",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "spreche", du: "sprichst", er_sie_es: "spricht", wir: "sprechen", ihr: "sprecht", sie_Sie: "sprechen" },
      passato_prossimo: { ich: "habe gesprochen", du: "hast gesprochen", er_sie_es: "hat gesprochen", wir: "haben gesprochen", ihr: "habt gesprochen", sie_Sie: "haben gesprochen" },
      imperfetto: { ich: "sprach", du: "sprachst", er_sie_es: "sprach", wir: "sprachen", ihr: "spracht", sie_Sie: "sprachen" },
      futuro: { ich: "werde sprechen", du: "wirst sprechen", er_sie_es: "wird sprechen", wir: "werden sprechen", ihr: "werdet sprechen", sie_Sie: "werden sprechen" }
    }
  },
  {
    infinitive: "essen",
    translation: "to eat",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "esse", du: "isst", er_sie_es: "isst", wir: "essen", ihr: "esst", sie_Sie: "essen" },
      passato_prossimo: { ich: "habe gegessen", du: "hast gegessen", er_sie_es: "hat gegessen", wir: "haben gegessen", ihr: "habt gegessen", sie_Sie: "haben gegessen" },
      imperfetto: { ich: "aß", du: "aßest", er_sie_es: "aß", wir: "aßen", ihr: "aßt", sie_Sie: "aßen" },
      futuro: { ich: "werde essen", du: "wirst essen", er_sie_es: "wird essen", wir: "werden essen", ihr: "werdet essen", sie_Sie: "werden essen" }
    }
  },
  {
    infinitive: "trinken",
    translation: "to drink",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "trinke", du: "trinkst", er_sie_es: "trinkt", wir: "trinken", ihr: "trinkt", sie_Sie: "trinken" },
      passato_prossimo: { ich: "habe getrunken", du: "hast getrunken", er_sie_es: "hat getrunken", wir: "haben getrunken", ihr: "habt getrunken", sie_Sie: "haben getrunken" },
      imperfetto: { ich: "trank", du: "trankst", er_sie_es: "trank", wir: "tranken", ihr: "trankt", sie_Sie: "tranken" },
      futuro: { ich: "werde trinken", du: "wirst trinken", er_sie_es: "wird trinken", wir: "werden trinken", ihr: "werdet trinken", sie_Sie: "werden trinken" }
    }
  }
];

// Generate regular German verbs
const regularVerbsDataDe = [
  { inf: "spielen", trans: "to play", aux: "haben" },
  { inf: "lernen", trans: "to learn, to study", aux: "haben" },
  { inf: "machen", trans: "to make, to do", aux: "haben" },
  { inf: "kaufen", trans: "to buy", aux: "haben" },
  { inf: "arbeiten", trans: "to work", aux: "haben" },
  { inf: "reisen", trans: "to travel", aux: "sein" },
  { inf: "wohnen", trans: "to live, to reside", aux: "haben" },
  { inf: "suchen", trans: "to search, to look for", aux: "haben" },
  { inf: "fragen", trans: "to ask", aux: "haben" },
  { inf: "studieren", trans: "to study (at university)", aux: "haben" },
  { inf: "verkaufen", trans: "to sell", aux: "haben" },
  { inf: "lieben", trans: "to love", aux: "haben" },
  { inf: "leben", trans: "to live", aux: "haben" },
  { inf: "hören", trans: "to hear, to listen", aux: "haben" },
  { inf: "brauchen", trans: "to need", aux: "haben" }
];

const regularVerbsDe = regularVerbsDataDe.map(v => 
  buildGermanRegularVerb(v.inf, v.trans, v.aux)
);

// Combine both arrays
const allVerbsDe = [...irregularVerbsDe, ...regularVerbsDe];

// German Pronouns helper
const pronounsDe = {
  ich: "ich (I)",
  du: "du (you sing. inf.)",
  er_sie_es: "er / sie / es (he/she/it)",
  wir: "wir (we)",
  ihr: "ihr (you plur. inf.)",
  sie_Sie: "sie / Sie (they/formal you)"
};

// German Tenses helper
const tensesDe = {
  presente: "Präsens (Present)",
  passato_prossimo: "Perfekt (Perfect)",
  imperfetto: "Präteritum (Imperfect)",
  futuro: "Futur I (Future)"
};

// Export to window
window.GERMAN_VERBS = allVerbsDe;
window.GERMAN_PRONOUNS = pronounsDe;
window.GERMAN_TENSES = tensesDe;
