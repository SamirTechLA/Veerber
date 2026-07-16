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
  },
  {
    infinitive: "kommen",
    translation: "to come",
    group: "en",
    type: "irregular",
    auxiliary: "sein",
    conjugations: {
      presente: { ich: "komme", du: "kommst", er_sie_es: "kommt", wir: "kommen", ihr: "kommt", sie_Sie: "kommen" },
      passato_prossimo: { ich: "bin gekommen", du: "bist gekommen", er_sie_es: "ist gekommen", wir: "sind gekommen", ihr: "seid gekommen", sie_Sie: "sind gekommen" },
      imperfetto: { ich: "kam", du: "kamst", er_sie_es: "kam", wir: "kamen", ihr: "kamt", sie_Sie: "kamen" },
      futuro: { ich: "werde kommen", du: "wirst kommen", er_sie_es: "wird kommen", wir: "werden kommen", ihr: "werdet kommen", sie_Sie: "werden kommen" }
    }
  },
  {
    infinitive: "schreiben",
    translation: "to write",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "schreibe", du: "schreibst", er_sie_es: "schreibt", wir: "schreiben", ihr: "schreibt", sie_Sie: "schreiben" },
      passato_prossimo: { ich: "habe geschrieben", du: "hast geschrieben", er_sie_es: "hat geschrieben", wir: "haben geschrieben", ihr: "habt geschrieben", sie_Sie: "haben geschrieben" },
      imperfetto: { ich: "schrieb", du: "schriebst", er_sie_es: "schrieb", wir: "schrieben", ihr: "schriebt", sie_Sie: "schrieben" },
      futuro: { ich: "werde schreiben", du: "wirst schreiben", er_sie_es: "wird schreiben", wir: "werden schreiben", ihr: "werdet schreiben", sie_Sie: "werden schreiben" }
    }
  },
  {
    infinitive: "geben",
    translation: "to give",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "gebe", du: "gibst", er_sie_es: "gibt", wir: "geben", ihr: "gebt", sie_Sie: "geben" },
      passato_prossimo: { ich: "habe gegeben", du: "hast gegeben", er_sie_es: "hat gegeben", wir: "haben gegeben", ihr: "habt gegeben", sie_Sie: "haben gegeben" },
      imperfetto: { ich: "gab", du: "gabst", er_sie_es: "gab", wir: "gaben", ihr: "gabt", sie_Sie: "gaben" },
      futuro: { ich: "werde geben", du: "wirst geben", er_sie_es: "wird geben", wir: "werden geben", ihr: "werdet geben", sie_Sie: "werden geben" }
    }
  },
  {
    infinitive: "nehmen",
    translation: "to take",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "nehme", du: "nimmst", er_sie_es: "nimmt", wir: "nehmen", ihr: "nehmt", sie_Sie: "nehmen" },
      passato_prossimo: { ich: "habe genommen", du: "hast genommen", er_sie_es: "hat genommen", wir: "haben genommen", ihr: "habt genommen", sie_Sie: "haben genommen" },
      imperfetto: { ich: "nahm", du: "nahmst", er_sie_es: "nahm", wir: "nahmen", ihr: "nahmt", sie_Sie: "nahmen" },
      futuro: { ich: "werde nehmen", du: "wirst nehmen", er_sie_es: "wird nehmen", wir: "werden nehmen", ihr: "werdet nehmen", sie_Sie: "werden nehmen" }
    }
  },
  {
    infinitive: "laufen",
    translation: "to run, to walk",
    group: "en",
    type: "irregular",
    auxiliary: "sein",
    conjugations: {
      presente: { ich: "laufe", du: "läufst", er_sie_es: "läuft", wir: "laufen", ihr: "lauft", sie_Sie: "laufen" },
      passato_prossimo: { ich: "bin gelaufen", du: "bist gelaufen", er_sie_es: "ist gelaufen", wir: "sind gelaufen", ihr: "seid gelaufen", sie_Sie: "sind gelaufen" },
      imperfetto: { ich: "lief", du: "liefst", er_sie_es: "lief", wir: "liefen", ihr: "lieft", sie_Sie: "liefen" },
      futuro: { ich: "werde laufen", du: "wirst laufen", er_sie_es: "wird laufen", wir: "werden laufen", ihr: "werdet laufen", sie_Sie: "werden laufen" }
    }
  },
  {
    infinitive: "stehen",
    translation: "to stand",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "stehe", du: "stehst", er_sie_es: "steht", wir: "stehen", ihr: "steht", sie_Sie: "stehen" },
      passato_prossimo: { ich: "habe gestanden", du: "hast gestanden", er_sie_es: "hat gestanden", wir: "haben gestanden", ihr: "habt gestanden", sie_Sie: "haben gestanden" },
      imperfetto: { ich: "stand", du: "standest", er_sie_es: "stand", wir: "standen", ihr: "standet", sie_Sie: "standen" },
      futuro: { ich: "werde stehen", du: "wirst stehen", er_sie_es: "wird stehen", wir: "werden stehen", ihr: "werdet stehen", sie_Sie: "werden stehen" }
    }
  },
  {
    infinitive: "helfen",
    translation: "to help",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "helfe", du: "hilfst", er_sie_es: "hilft", wir: "helfen", ihr: "helft", sie_Sie: "helfen" },
      passato_prossimo: { ich: "habe geholfen", du: "hast geholfen", er_sie_es: "hat geholfen", wir: "haben geholfen", ihr: "habt geholfen", sie_Sie: "haben geholfen" },
      imperfetto: { ich: "half", du: "halfst", er_sie_es: "half", wir: "halfen", ihr: "halft", sie_Sie: "halfen" },
      futuro: { ich: "werde helfen", du: "wirst helfen", er_sie_es: "wird helfen", wir: "werden helfen", ihr: "werdet helfen", sie_Sie: "werden helfen" }
    }
  },
  {
    infinitive: "bleiben",
    translation: "to stay, to remain",
    group: "en",
    type: "irregular",
    auxiliary: "sein",
    conjugations: {
      presente: { ich: "bleibe", du: "bleibst", er_sie_es: "bleibt", wir: "bleiben", ihr: "bleibt", sie_Sie: "bleiben" },
      passato_prossimo: { ich: "bin geblieben", du: "bist geblieben", er_sie_es: "ist geblieben", wir: "sind geblieben", ihr: "seid geblieben", sie_Sie: "sind geblieben" },
      imperfetto: { ich: "blieb", du: "bliebst", er_sie_es: "blieb", wir: "blieben", ihr: "bliebt", sie_Sie: "blieben" },
      futuro: { ich: "werde bleiben", du: "wirst bleiben", er_sie_es: "wird bleiben", wir: "werden bleiben", ihr: "werdet bleiben", sie_Sie: "werden bleiben" }
    }
  },
  {
    infinitive: "finden",
    translation: "to find",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "finde", du: "findest", er_sie_es: "findet", wir: "finden", ihr: "findet", sie_Sie: "finden" },
      passato_prossimo: { ich: "habe gefunden", du: "hast gefunden", er_sie_es: "hat gefunden", wir: "haben gefunden", ihr: "habt gefunden", sie_Sie: "haben gefunden" },
      imperfetto: { ich: "fand", du: "fandest", er_sie_es: "fand", wir: "fanden", ihr: "fandet", sie_Sie: "fanden" },
      futuro: { ich: "werde finden", du: "wirst finden", er_sie_es: "wird finden", wir: "werden finden", ihr: "werdet finden", sie_Sie: "werden finden" }
    }
  },
  {
    infinitive: "denken",
    translation: "to think",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "denke", du: "denkst", er_sie_es: "denkt", wir: "denken", ihr: "denkt", sie_Sie: "denken" },
      passato_prossimo: { ich: "habe gedacht", du: "hast gedacht", er_sie_es: "hat gedacht", wir: "haben gedacht", ihr: "habt gedacht", sie_Sie: "haben gedacht" },
      imperfetto: { ich: "dachte", du: "dachtest", er_sie_es: "dachte", wir: "dachten", ihr: "dachtet", sie_Sie: "dachten" },
      futuro: { ich: "werde denken", du: "wirst denken", er_sie_es: "wird denken", wir: "werden denken", ihr: "werdet denken", sie_Sie: "werden denken" }
    }
  },
  {
    infinitive: "wissen",
    translation: "to know",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "weiß", du: "weißt", er_sie_es: "weiß", wir: "wissen", ihr: "wisst", sie_Sie: "wissen" },
      passato_prossimo: { ich: "habe gewusst", du: "hast gewusst", er_sie_es: "hat gewusst", wir: "haben gewusst", ihr: "habt gewusst", sie_Sie: "haben gewusst" },
      imperfetto: { ich: "wusste", du: "wusstest", er_sie_es: "wusste", wir: "wussten", ihr: "wusstet", sie_Sie: "wussten" },
      futuro: { ich: "werde wissen", du: "wirst wissen", er_sie_es: "wird wissen", wir: "werden wissen", ihr: "werdet wissen", sie_Sie: "werden wissen" }
    }
  },
  {
    infinitive: "schließen",
    translation: "to close",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "schließe", du: "schließt", er_sie_es: "schließt", wir: "schließen", ihr: "schließt", sie_Sie: "schließen" },
      passato_prossimo: { ich: "habe geschlossen", du: "hast geschlossen", er_sie_es: "hat geschlossen", wir: "haben geschlossen", ihr: "habt geschlossen", sie_Sie: "haben geschlossen" },
      imperfetto: { ich: "schloss", du: "schlossest", er_sie_es: "schloss", wir: "schlossen", ihr: "schlosst", sie_Sie: "schlossen" },
      futuro: { ich: "werde schließen", du: "wirst schließen", er_sie_es: "wird schließen", wir: "werden schließen", ihr: "werdet schließen", sie_Sie: "werden schließen" }
    }
  },
  {
    infinitive: "können",
    translation: "can, to be able to",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "kann", du: "kannst", er_sie_es: "kann", wir: "können", ihr: "könnt", sie_Sie: "können" },
      passato_prossimo: { ich: "habe gekonnt", du: "hast gekonnt", er_sie_es: "hat gekonnt", wir: "haben gekonnt", ihr: "habt gekonnt", sie_Sie: "haben gekonnt" },
      imperfetto: { ich: "konnte", du: "konntest", er_sie_es: "konnte", wir: "konnten", ihr: "konntet", sie_Sie: "konnten" },
      futuro: { ich: "werde können", du: "wirst können", er_sie_es: "wird können", wir: "werden können", ihr: "werdet können", sie_Sie: "werden können" }
    }
  },
  {
    infinitive: "müssen",
    translation: "must, to have to",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "muss", du: "musst", er_sie_es: "muss", wir: "müssen", ihr: "müsst", sie_Sie: "müssen" },
      passato_prossimo: { ich: "habe gemusst", du: "hast gemusst", er_sie_es: "hat gemusst", wir: "haben gemusst", ihr: "habt gemusst", sie_Sie: "haben gemusst" },
      imperfetto: { ich: "musste", du: "musstest", er_sie_es: "musste", wir: "mussten", ihr: "musstet", sie_Sie: "mussten" },
      futuro: { ich: "werde müssen", du: "wirst müssen", er_sie_es: "wird müssen", wir: "werden müssen", ihr: "werdet müssen", sie_Sie: "werden müssen" }
    }
  },
  {
    infinitive: "wollen",
    translation: "to want",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "will", du: "willst", er_sie_es: "will", wir: "wollen", ihr: "wollt", sie_Sie: "wollen" },
      passato_prossimo: { ich: "habe gewollt", du: "hast gewollt", er_sie_es: "hat gewollt", wir: "haben gewollt", ihr: "habt gewollt", sie_Sie: "haben gewollt" },
      imperfetto: { ich: "wollte", du: "wolltest", er_sie_es: "wollte", wir: "wollten", ihr: "wolltet", sie_Sie: "wollten" },
      futuro: { ich: "werde wollen", du: "wirst wollen", er_sie_es: "wird wollen", wir: "werden wollen", ihr: "werdet wollen", sie_Sie: "werden wollen" }
    }
  },
  {
    infinitive: "sollen",
    translation: "should, to be supposed to",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "soll", du: "sollst", er_sie_es: "soll", wir: "sollen", ihr: "sollt", sie_Sie: "sollen" },
      passato_prossimo: { ich: "habe gesollt", du: "hast gesollt", er_sie_es: "hat gesollt", wir: "haben gesollt", ihr: "habt gesollt", sie_Sie: "haben gesollt" },
      imperfetto: { ich: "sollte", du: "solltest", er_sie_es: "sollte", wir: "sollten", ihr: "solltet", sie_Sie: "sollten" },
      futuro: { ich: "werde sollen", du: "wirst sollen", er_sie_es: "wird sollen", wir: "werden sollen", ihr: "werdet sollen", sie_Sie: "werden sollen" }
    }
  },
  {
    infinitive: "dürfen",
    translation: "may, to be allowed to",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "darf", du: "darfst", er_sie_es: "darf", wir: "dürfen", ihr: "dürft", sie_Sie: "dürfen" },
      passato_prossimo: { ich: "habe gedurft", du: "hast gedurft", er_sie_es: "hat gedurft", wir: "haben gedurft", ihr: "habt gedurft", sie_Sie: "haben gedurft" },
      imperfetto: { ich: "durfte", du: "durftest", er_sie_es: "durfte", wir: "durften", ihr: "durftet", sie_Sie: "durften" },
      futuro: { ich: "werde dürfen", du: "wirst dürfen", er_sie_es: "wird dürfen", wir: "werden dürfen", ihr: "werdet dürfen", sie_Sie: "werden dürfen" }
    }
  },
  {
    infinitive: "mögen",
    translation: "to like",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "mag", du: "magst", er_sie_es: "mag", wir: "mögen", ihr: "mögt", sie_Sie: "mögen" },
      passato_prossimo: { ich: "habe gemocht", du: "hast gemocht", er_sie_es: "hat gemocht", wir: "haben gemocht", ihr: "habt gemocht", sie_Sie: "haben gemocht" },
      imperfetto: { ich: "mochte", du: "mochtest", er_sie_es: "mochte", wir: "mochten", ihr: "mochtet", sie_Sie: "mochten" },
      futuro: { ich: "werde mögen", du: "wirst mögen", er_sie_es: "wird mögen", wir: "werden mögen", ihr: "werdet mögen", sie_Sie: "werden mögen" }
    }
  },
  {
    infinitive: "schlafen",
    translation: "to sleep",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "schlafe", du: "schläfst", er_sie_es: "schläft", wir: "schlafen", ihr: "schlaft", sie_Sie: "schlafen" },
      passato_prossimo: { ich: "habe geschlafen", du: "hast geschlafen", er_sie_es: "hat geschlafen", wir: "haben geschlafen", ihr: "habt geschlafen", sie_Sie: "haben geschlafen" },
      imperfetto: { ich: "schlief", du: "schliefst", er_sie_es: "schlief", wir: "schliefen", ihr: "schlieft", sie_Sie: "schliefen" },
      futuro: { ich: "werde schlafen", du: "wirst schlafen", er_sie_es: "wird schlafen", wir: "werden schlafen", ihr: "werdet schlafen", sie_Sie: "werden schlafen" }
    }
  },
  {
    infinitive: "tragen",
    translation: "to carry, to wear",
    group: "en",
    type: "irregular",
    auxiliary: "haben",
    conjugations: {
      presente: { ich: "trage", du: "trägst", er_sie_es: "trägt", wir: "tragen", ihr: "tragt", sie_Sie: "tragen" },
      passato_prossimo: { ich: "habe getragen", du: "hast getragen", er_sie_es: "hat getragen", wir: "haben getragen", ihr: "habt getragen", sie_Sie: "haben getragen" },
      imperfetto: { ich: "trug", du: "trugst", er_sie_es: "trug", wir: "trugen", ihr: "trugt", sie_Sie: "trugen" },
      futuro: { ich: "werde tragen", du: "wirst tragen", er_sie_es: "wird tragen", wir: "werden tragen", ihr: "werdet tragen", sie_Sie: "werden tragen" }
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
  { inf: "brauchen", trans: "to need", aux: "haben" },
  { inf: "sagen", trans: "to say", aux: "haben" },
  { inf: "glauben", trans: "to believe", aux: "haben" },
  { inf: "hoffen", trans: "to hope", aux: "haben" },
  { inf: "zeigen", trans: "to show", aux: "haben" },
  { inf: "legen", trans: "to lay, to put down", aux: "haben" },
  { inf: "stellen", trans: "to place upright", aux: "haben" },
  { inf: "setzen", trans: "to set, to place", aux: "haben" },
  { inf: "warten", trans: "to wait", aux: "haben" },
  { inf: "öffnen", trans: "to open", aux: "haben" },
  { inf: "besuchen", trans: "to visit", aux: "haben" },
  { inf: "bezahlen", trans: "to pay", aux: "haben" },
  { inf: "erklären", trans: "to explain", aux: "haben" }
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
