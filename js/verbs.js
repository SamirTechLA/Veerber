/**
 * Coniugiamo! - Verb Database & Conjugator Engine
 */

function buildRegularVerb(infinitive, translation, group, auxiliary, options = {}) {
  const isIsc = options.isIsc || false;
  const irregularPastParticiple = options.irregularPastParticiple || null;
  const customConjugations = options.customConjugations || {};

  const verb = {
    infinitive,
    translation,
    group,
    type: "regular",
    auxiliary,
    conjugations: {}
  };

  const stem = infinitive.slice(0, -3);

  const isCare = infinitive.endsWith("care");
  const isGare = infinitive.endsWith("gare");
  const isCiare = infinitive.endsWith("ciare");
  const isGiare = infinitive.endsWith("giare");

  // Auxiliary forms
  const esserePresent = { io: "sono", tu: "sei", lui_lei: "è", noi: "siamo", voi: "siete", loro: "sono" };
  const averePresent = { io: "ho", tu: "hai", lui_lei: "ha", noi: "abbiamo", voi: "avete", loro: "hanno" };
  const aux = auxiliary === "essere" ? esserePresent : averePresent;

  // Past Participle
  let pp = "";
  if (irregularPastParticiple) {
    pp = irregularPastParticiple;
  } else {
    if (group === "are") pp = stem + "ato";
    else if (group === "ere") pp = stem + "uto";
    else if (group === "ire") pp = stem + "ito";
  }

  // Passato Prossimo
  const buildPassatoProssimo = () => {
    const list = {};
    const pronouns = ["io", "tu", "lui_lei", "noi", "voi", "loro"];
    pronouns.forEach(p => {
      if (auxiliary === "essere") {
        if (p === "io" || p === "tu" || p === "lui_lei") {
          list[p] = `${aux[p]} ${pp.slice(0, -1)}o/a`;
        } else {
          list[p] = `${aux[p]} ${pp.slice(0, -1)}i/e`;
        }
      } else {
        list[p] = `${aux[p]} ${pp}`;
      }
    });
    return list;
  };

  // Presente
  const buildPresente = () => {
    const list = {};
    if (group === "are") {
      list.io = stem + "o";
      list.tu = isCare || isGare ? stem + "hi" : (isCiare || isGiare ? stem : stem + "i");
      list.lui_lei = stem + "a";
      list.noi = isCare || isGare ? stem + "hiamo" : (isCiare || isGiare ? stem.slice(0, -1) + "iamo" : stem + "iamo");
      list.voi = stem + "ate";
      list.loro = stem + "ano";
    } else if (group === "ere") {
      list.io = stem + "o";
      list.tu = stem + "i";
      list.lui_lei = stem + "e";
      list.noi = stem + "iamo";
      list.voi = stem + "ete";
      list.loro = stem + "ono";
    } else if (group === "ire") {
      if (isIsc) {
        list.io = stem + "isco";
        list.tu = stem + "isci";
        list.lui_lei = stem + "isce";
        list.noi = stem + "iamo";
        list.voi = stem + "ite";
        list.loro = stem + "iscono";
      } else {
        list.io = stem + "o";
        list.tu = stem + "i";
        list.lui_lei = stem + "e";
        list.noi = stem + "iamo";
        list.voi = stem + "ite";
        list.loro = stem + "ono";
      }
    }
    return list;
  };

  // Imperfetto
  const buildImperfetto = () => {
    const list = {};
    const suffix = group === "are" ? "av" : (group === "ere" ? "ev" : "iv");
    list.io = stem + suffix + "o";
    list.tu = stem + suffix + "i";
    list.lui_lei = stem + suffix + "a";
    list.noi = stem + suffix + "amo";
    list.voi = stem + suffix + "ate";
    list.loro = stem + suffix + "ano";
    return list;
  };

  // Futuro
  const buildFuturo = () => {
    const list = {};
    if (group === "are") {
      let futStem = stem + "er";
      if (isCare || isGare) futStem = stem + "her";
      if (isCiare || isGiare) futStem = stem.slice(0, -1) + "er";
      list.io = futStem + "ò";
      list.tu = futStem + "ai";
      list.lui_lei = futStem + "à";
      list.noi = futStem + "emo";
      list.voi = futStem + "ete";
      list.loro = futStem + "anno";
    } else if (group === "ere") {
      const futStem = stem + "er";
      list.io = futStem + "ò";
      list.tu = futStem + "ai";
      list.lui_lei = futStem + "à";
      list.noi = futStem + "emo";
      list.voi = futStem + "ete";
      list.loro = futStem + "anno";
    } else if (group === "ire") {
      const futStem = stem + "ir";
      list.io = futStem + "ò";
      list.tu = futStem + "ai";
      list.lui_lei = futStem + "à";
      list.noi = futStem + "emo";
      list.voi = futStem + "ete";
      list.loro = futStem + "anno";
    }
    return list;
  };

  verb.conjugations.presente = buildPresente();
  verb.conjugations.passato_prossimo = buildPassatoProssimo();
  verb.conjugations.imperfetto = buildImperfetto();
  verb.conjugations.futuro = buildFuturo();

  // Apply custom overrides
  for (const tense in customConjugations) {
    verb.conjugations[tense] = {
      ...verb.conjugations[tense],
      ...customConjugations[tense]
    };
  }

  return verb;
}

// Manually conjugate standard irregular verbs
const irregularVerbs = [
  {
    infinitive: "essere",
    translation: "to be",
    group: "ere",
    type: "irregular",
    auxiliary: "essere",
    conjugations: {
      presente: { io: "sono", tu: "sei", lui_lei: "è", noi: "siamo", voi: "siete", loro: "sono" },
      passato_prossimo: { io: "sono stato/a", tu: "sei stato/a", lui_lei: "è stato/a", noi: "siamo stati/e", voi: "siete stati/e", loro: "sono stati/e" },
      imperfetto: { io: "ero", tu: "eri", lui_lei: "era", noi: "eravamo", voi: "eravate", loro: "erano" },
      futuro: { io: "sarò", tu: "sarai", lui_lei: "sarà", noi: "saremo", voi: "sarete", loro: "saranno" }
    }
  },
  {
    infinitive: "avere",
    translation: "to have",
    group: "ere",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "ho", tu: "hai", lui_lei: "ha", noi: "abbiamo", voi: "avete", loro: "hanno" },
      passato_prossimo: { io: "ho avuto", tu: "hai avuto", lui_lei: "ha avuto", noi: "abbiamo avuto", voi: "avete avuto", loro: "hanno avuto" },
      imperfetto: { io: "avevo", tu: "avevi", lui_lei: "aveva", noi: "avevamo", voi: "avevate", loro: "avevano" },
      futuro: { io: "avrò", tu: "avrai", lui_lei: "avrà", noi: "avremo", voi: "avrete", loro: "avranno" }
    }
  },
  {
    infinitive: "andare",
    translation: "to go",
    group: "are",
    type: "irregular",
    auxiliary: "essere",
    conjugations: {
      presente: { io: "vado", tu: "vai", lui_lei: "va", noi: "andiamo", voi: "andate", loro: "vanno" },
      passato_prossimo: { io: "sono andato/a", tu: "sei andato/a", lui_lei: "è andato/a", noi: "siamo andati/e", voi: "siete andati/e", loro: "sono andati/e" },
      imperfetto: { io: "andavo", tu: "andavi", lui_lei: "andava", noi: "andavamo", voi: "andavate", loro: "andavano" },
      futuro: { io: "andrò", tu: "andrai", lui_lei: "andrà", noi: "andremo", voi: "andrete", loro: "andranno" }
    }
  },
  {
    infinitive: "fare",
    translation: "to do, to make",
    group: "are",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "faccio", tu: "fai", lui_lei: "fa", noi: "facciamo", voi: "fate", loro: "fanno" },
      passato_prossimo: { io: "ho fatto", tu: "hai fatto", lui_lei: "ha fatto", noi: "abbiamo fatto", voi: "avete fatto", loro: "hanno fatto" },
      imperfetto: { io: "facevo", tu: "facevi", lui_lei: "faceva", noi: "facevamo", voi: "facevate", loro: "facevano" },
      futuro: { io: "farò", tu: "farai", lui_lei: "farà", noi: "faremo", voi: "farete", loro: "faranno" }
    }
  },
  {
    infinitive: "dovere",
    translation: "to have to, must",
    group: "ere",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "devo", tu: "devi", lui_lei: "deve", noi: "dobbiamo", voi: "dovete", loro: "devono" },
      passato_prossimo: { io: "ho dovuto", tu: "hai dovuto", lui_lei: "ha dovuto", noi: "abbiamo dovuto", voi: "avete dovuto", loro: "hanno dovuto" },
      imperfetto: { io: "dovevo", tu: "dovevi", lui_lei: "doveva", noi: "dovevamo", voi: "dovevate", loro: "dovevano" },
      futuro: { io: "dovrò", tu: "dovrai", lui_lei: "dovrà", noi: "dovremo", voi: "dovrete", loro: "dovranno" }
    }
  },
  {
    infinitive: "potere",
    translation: "to be able to, can",
    group: "ere",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "posso", tu: "puoi", lui_lei: "può", noi: "possiamo", voi: "potete", loro: "possono" },
      passato_prossimo: { io: "ho potuto", tu: "hai potuto", lui_lei: "ha potuto", noi: "abbiamo potuto", voi: "avete potuto", loro: "hanno potuto" },
      imperfetto: { io: "potevo", tu: "potevi", lui_lei: "poteva", noi: "potevamo", voi: "potevate", loro: "potevano" },
      futuro: { io: "potrò", tu: "potrai", lui_lei: "potrà", noi: "potremo", voi: "potrete", loro: "potranno" }
    }
  },
  {
    infinitive: "volere",
    translation: "to want",
    group: "ere",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "voglio", tu: "vuoi", lui_lei: "vuole", noi: "vogliamo", voi: "volete", loro: "vogliono" },
      passato_prossimo: { io: "ho voluto", tu: "hai voluto", lui_lei: "ha voluto", noi: "abbiamo voluto", voi: "avete voluto", loro: "hanno voluto" },
      imperfetto: { io: "volevo", tu: "volevi", lui_lei: "voleva", noi: "volevamo", voi: "volevate", loro: "volevano" },
      futuro: { io: "vorrò", tu: "vorrai", lui_lei: "vorrà", noi: "vorremo", voi: "vorrete", loro: "vorranno" }
    }
  },
  {
    infinitive: "venire",
    translation: "to come",
    group: "ire",
    type: "irregular",
    auxiliary: "essere",
    conjugations: {
      presente: { io: "vengo", tu: "vieni", lui_lei: "viene", noi: "veniamo", voi: "venite", loro: "vengono" },
      passato_prossimo: { io: "sono venuto/a", tu: "sei venuto/a", lui_lei: "è venuto/a", noi: "siamo venuti/e", voi: "siete venuti/e", loro: "sono venuti/e" },
      imperfetto: { io: "venivo", tu: "venivi", lui_lei: "veniva", noi: "venivamo", voi: "venivate", loro: "venivano" },
      futuro: { io: "verrò", tu: "verrai", lui_lei: "verrà", noi: "verremo", voi: "verrete", loro: "verranno" }
    }
  },
  {
    infinitive: "dire",
    translation: "to say, to tell",
    group: "ire",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "dico", tu: "dici", lui_lei: "dice", noi: "diciamo", voi: "dite", loro: "dicono" },
      passato_prossimo: { io: "ho detto", tu: "hai detto", lui_lei: "ha detto", noi: "abbiamo detto", voi: "avete detto", loro: "hanno detto" },
      imperfetto: { io: "dicevo", tu: "dicevi", lui_lei: "diceva", noi: "dicevamo", voi: "dicevate", loro: "dicevano" },
      futuro: { io: "dirò", tu: "dirai", lui_lei: "dirà", noi: "diremo", voi: "direte", loro: "diranno" }
    }
  },
  {
    infinitive: "sapere",
    translation: "to know (facts/information)",
    group: "ere",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "so", tu: "sai", lui_lei: "sa", noi: "sappiamo", voi: "sapete", loro: "sanno" },
      passato_prossimo: { io: "ho saputo", tu: "hai saputo", lui_lei: "ha saputo", noi: "abbiamo saputo", voi: "avete saputo", loro: "hanno saputo" },
      imperfetto: { io: "sapevo", tu: "sapevi", lui_lei: "sapeva", noi: "sapevamo", voi: "sapevate", loro: "sapevano" },
      futuro: { io: "saprò", tu: "saprai", lui_lei: "saprà", noi: "sapremo", voi: "saprete", loro: "sapranno" }
    }
  },
  {
    infinitive: "uscire",
    translation: "to go out, to exit",
    group: "ire",
    type: "irregular",
    auxiliary: "essere",
    conjugations: {
      presente: { io: "esco", tu: "esci", lui_lei: "esce", noi: "usciamo", voi: "uscite", loro: "escono" },
      passato_prossimo: { io: "sono uscito/a", tu: "sei uscito/a", lui_lei: "è uscito/a", noi: "siamo usciti/e", voi: "siete usciti/e", loro: "sono usciti/e" },
      imperfetto: { io: "uscivo", tu: "uscivi", lui_lei: "usciva", noi: "uscivamo", voi: "uscivate", loro: "uscivano" },
      futuro: { io: "uscirò", tu: "uscirai", lui_lei: "uscirà", noi: "usciremo", voi: "uscirete", loro: "usciranno" }
    }
  },
  {
    infinitive: "bere",
    translation: "to drink",
    group: "ere",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "bevo", tu: "bevi", lui_lei: "beve", noi: "beviamo", voi: "bevete", loro: "bevono" },
      passato_prossimo: { io: "ho bevuto", tu: "hai bevuto", lui_lei: "ha bevuto", noi: "abbiamo bevuto", voi: "avete bevuto", loro: "hanno bevuto" },
      imperfetto: { io: "bevevo", tu: "bevevi", lui_lei: "beveva", noi: "bevevamo", voi: "bevevate", loro: "bevevano" },
      futuro: { io: "berrò", tu: "berrai", lui_lei: "berrà", noi: "berremo", voi: "berrete", loro: "berranno" }
    }
  },
  {
    infinitive: "dare",
    translation: "to give",
    group: "are",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "do", tu: "dai", lui_lei: "dà", noi: "diamo", voi: "date", loro: "danno" },
      passato_prossimo: { io: "ho dato", tu: "hai dato", lui_lei: "ha dato", noi: "abbiamo dato", voi: "avete dato", loro: "hanno dato" },
      imperfetto: { io: "davo", tu: "davi", lui_lei: "dava", noi: "davamo", voi: "davate", loro: "davano" },
      futuro: { io: "darò", tu: "darai", lui_lei: "darà", noi: "daremo", voi: "darete", loro: "daranno" }
    }
  },
  {
    infinitive: "stare",
    translation: "to stay, to be",
    group: "are",
    type: "irregular",
    auxiliary: "essere",
    conjugations: {
      presente: { io: "sto", tu: "stai", lui_lei: "sta", noi: "stiamo", voi: "state", loro: "stanno" },
      passato_prossimo: { io: "sono stato/a", tu: "sei stato/a", lui_lei: "è stato/a", noi: "siamo stati/e", voi: "siete stati/e", loro: "sono stati/e" },
      imperfetto: { io: "stavo", tu: "stavi", lui_lei: "stava", noi: "stavamo", voi: "stavate", loro: "stavano" },
      futuro: { io: "starò", tu: "starai", lui_lei: "starà", noi: "staremo", voi: "staranno", loro: "staranno" } // corrected loro: staranno
    }
  },
  {
    infinitive: "rimanere",
    translation: "to remain, to stay",
    group: "ere",
    type: "irregular",
    auxiliary: "essere",
    conjugations: {
      presente: { io: "rimango", tu: "rimani", lui_lei: "rimane", noi: "rimaniamo", voi: "rimanete", loro: "rimangono" },
      passato_prossimo: { io: "sono rimasto/a", tu: "sei rimasto/a", lui_lei: "è rimasto/a", noi: "siamo rimasti/e", voi: "siete rimasti/e", loro: "sono rimasti/e" },
      imperfetto: { io: "rimanevo", tu: "rimanevi", lui_lei: "rimaneva", noi: "rimanevamo", voi: "rimanevate", loro: "rimanevano" },
      futuro: { io: "rimarrò", tu: "rimarrai", lui_lei: "rimarrà", noi: "rimarremo", voi: "rimarrete", loro: "rimarranno" }
    }
  },
  {
    infinitive: "scegliere",
    translation: "to choose",
    group: "ere",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "scelgo", tu: "scegli", lui_lei: "sceglie", noi: "scegliamo", voi: "scegliete", loro: "scelgono" },
      passato_prossimo: { io: "ho scelto", tu: "hai scelto", lui_lei: "ha scelto", noi: "abbiamo scelto", voi: "avete scelto", loro: "hanno scelto" },
      imperfetto: { io: "sceglievo", tu: "sceglievi", lui_lei: "sceglieva", noi: "sceglievamo", voi: "sceglievate", loro: "sceglievano" },
      futuro: { io: "sceglierò", tu: "sceglierai", lui_lei: "sceglierà", noi: "sceglieremo", voi: "sceglierete", loro: "sceglieranno" }
    }
  },
  {
    infinitive: "piacere",
    translation: "to like, to please",
    group: "ere",
    type: "irregular",
    auxiliary: "essere",
    conjugations: {
      presente: { io: "piaccio", tu: "piaci", lui_lei: "piace", noi: "piacciamo", voi: "piacete", loro: "piacciono" },
      passato_prossimo: { io: "sono piaciuto/a", tu: "sei piaciuto/a", lui_lei: "è piaciuto/a", noi: "siamo piaciuti/e", voi: "siete piaciuti/e", loro: "sono piaciuti/e" },
      imperfetto: { io: "piacevo", tu: "piacevi", lui_lei: "piaceva", noi: "piacevamo", voi: "piacevate", loro: "piacevano" },
      futuro: { io: "piacerò", tu: "piacerai", lui_lei: "piacerà", noi: "piaceremo", voi: "piacerete", loro: "piaceranno" }
    }
  },
  {
    infinitive: "morire",
    translation: "to die",
    group: "ire",
    type: "irregular",
    auxiliary: "essere",
    conjugations: {
      presente: { io: "muoio", tu: "muori", lui_lei: "muore", noi: "moriamo", voi: "morite", loro: "muoiono" },
      passato_prossimo: { io: "sono morto/a", tu: "sei morto/a", lui_lei: "è morto/a", noi: "siamo morti/e", voi: "siete morti/e", loro: "sono morti/e" },
      imperfetto: { io: "morivo", tu: "morivi", lui_lei: "moriva", noi: "morivamo", voi: "morivate", loro: "morivano" },
      futuro: { io: "morirò", tu: "morirai", lui_lei: "morirà", noi: "moriremo", voi: "morirete", loro: "moriranno" }
    }
  },
  {
    infinitive: "salire",
    translation: "to climb, to go up",
    group: "ire",
    type: "irregular",
    auxiliary: "essere",
    conjugations: {
      presente: { io: "salgo", tu: "sali", lui_lei: "sale", noi: "saliamo", voi: "salite", loro: "salgono" },
      passato_prossimo: { io: "sono salito/a", tu: "sei salito/a", lui_lei: "è salito/a", noi: "siamo saliti/e", voi: "siete saliti/e", loro: "sono saliti/e" },
      imperfetto: { io: "salivo", tu: "salivi", lui_lei: "saliva", noi: "salivamo", voi: "salivate", loro: "salivano" },
      futuro: { io: "salirò", tu: "salirai", lui_lei: "salirà", noi: "saliremo", voi: "salirete", loro: "saliranno" }
    }
  },
  {
    infinitive: "scendere",
    translation: "to go down, to descend",
    group: "ere",
    type: "irregular",
    auxiliary: "essere",
    conjugations: {
      presente: { io: "scendo", tu: "scendi", lui_lei: "scende", noi: "scendiamo", voi: "scendete", loro: "scendono" },
      passato_prossimo: { io: "sono sceso/a", tu: "sei sceso/a", lui_lei: "è sceso/a", noi: "siamo scesi/e", voi: "siete scesi/e", loro: "sono scesi/e" },
      imperfetto: { io: "scendevo", tu: "scendevi", lui_lei: "scendeva", noi: "scendevamo", voi: "scendevate", loro: "scendevano" },
      futuro: { io: "scenderò", tu: "scenderai", lui_lei: "scenderà", noi: "scenderemo", voi: "scenderete", loro: "scenderanno" }
    }
  },
  {
    infinitive: "tenere",
    translation: "to keep, to hold",
    group: "ere",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "tengo", tu: "tieni", lui_lei: "tiene", noi: "teniamo", voi: "tenete", loro: "tengono" },
      passato_prossimo: { io: "ho tenuto", tu: "hai tenuto", lui_lei: "ha tenuto", noi: "abbiamo tenuto", voi: "avete tenuto", loro: "hanno tenuto" },
      imperfetto: { io: "tenevo", tu: "tenevi", lui_lei: "teneva", noi: "tenevamo", voi: "tenevate", loro: "tenevano" },
      futuro: { io: "terrò", tu: "terrai", lui_lei: "terrà", noi: "terremo", voi: "terrete", loro: "terranno" }
    }
  },
  {
    infinitive: "tradurre",
    translation: "to translate",
    group: "ere",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "traduco", tu: "traduci", lui_lei: "traduce", noi: "traduciamo", voi: "traducete", loro: "traducono" },
      passato_prossimo: { io: "ho tradotto", tu: "hai tradotto", lui_lei: "ha tradotto", noi: "abbiamo tradotto", voi: "avete tradotto", loro: "hanno tradotto" },
      imperfetto: { io: "traducevo", tu: "traducevi", lui_lei: "traduceva", noi: "traducevamo", voi: "traducevate", loro: "traducevano" },
      futuro: { io: "tradurrò", tu: "tradurrai", lui_lei: "tradurrà", noi: "tradurremo", voi: "tradurrete", loro: "tradurranno" }
    }
  },
  {
    infinitive: "proporre",
    translation: "to propose, to suggest",
    group: "ere",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "propongo", tu: "proponi", lui_lei: "propone", noi: "proponiamo", voi: "proponete", loro: "propongono" },
      passato_prossimo: { io: "ho proposto", tu: "hai proposto", lui_lei: "ha proposto", noi: "abbiamo proposto", voi: "avete proposto", loro: "hanno proposto" },
      imperfetto: { io: "proponevo", tu: "proponevi", lui_lei: "proponeva", noi: "proponevamo", voi: "proponevate", loro: "proponevano" },
      futuro: { io: "proporrò", tu: "proporrai", lui_lei: "proporrà", noi: "proporremo", voi: "proporrete", loro: "proporranno" }
    }
  },
  {
    infinitive: "nascere",
    translation: "to be born",
    group: "ere",
    type: "irregular",
    auxiliary: "essere",
    conjugations: {
      presente: { io: "nasco", tu: "nasci", lui_lei: "nasce", noi: "nasciamo", voi: "nascete", loro: "nascono" },
      passato_prossimo: { io: "sono nato/a", tu: "sei nato/a", lui_lei: "è nato/a", noi: "siamo nati/e", voi: "siete nati/e", loro: "sono nati/e" },
      imperfetto: { io: "nascevo", tu: "nascevi", lui_lei: "nasceva", noi: "nascevamo", voi: "nascevate", loro: "nascevano" },
      futuro: { io: "nascerò", tu: "nascerai", lui_lei: "nascerà", noi: "nasceremo", voi: "nascerete", loro: "nasceranno" }
    }
  },
  {
    infinitive: "spegnere",
    translation: "to turn off, to switch off",
    group: "ere",
    type: "irregular",
    auxiliary: "avere",
    conjugations: {
      presente: { io: "spengo", tu: "spegni", lui_lei: "spegne", noi: "spegniamo", voi: "spegnete", loro: "spengono" },
      passato_prossimo: { io: "ho spento", tu: "hai spento", lui_lei: "ha spento", noi: "abbiamo spento", voi: "avete spento", loro: "hanno spento" },
      imperfetto: { io: "spegnevo", tu: "spegnevi", lui_lei: "spegneva", noi: "spegnevamo", voi: "spegnevate", loro: "spegnevano" },
      futuro: { io: "spegnerò", tu: "spegnerai", lui_lei: "spegnerà", noi: "spegneremo", voi: "spegnerete", loro: "spegneranno" }
    }
  }
];

// Generate list of regular verbs
const regularVerbsData = [
  // -are regular verbs
  { inf: "parlare", trans: "to speak, to talk", grp: "are", aux: "avere" },
  { inf: "cantare", trans: "to sing", grp: "are", aux: "avere" },
  { inf: "mangiare", trans: "to eat", grp: "are", aux: "avere" },
  { inf: "studiare", trans: "to study", grp: "are", aux: "avere" },
  { inf: "lavorare", trans: "to work", grp: "are", aux: "avere" },
  { inf: "comprare", trans: "to buy", grp: "are", aux: "avere" },
  { inf: "pensare", trans: "to think", grp: "are", aux: "avere" },
  { inf: "ascoltare", trans: "to listen", grp: "are", aux: "avere" },
  { inf: "viaggiare", trans: "to travel", grp: "are", aux: "avere" },
  { inf: "imparare", trans: "to learn", grp: "are", aux: "avere" },
  { inf: "giocare", trans: "to play (games/sports)", grp: "are", aux: "avere" },
  { inf: "pagare", trans: "to pay", grp: "are", aux: "avere" },
  { inf: "cominciare", trans: "to begin, to start", grp: "are", aux: "avere" },
  { inf: "trovare", trans: "to find", grp: "are", aux: "avere" },
  { inf: "cercare", trans: "to search, to look for", grp: "are", aux: "avere" },
  { inf: "chiamare", trans: "to call", grp: "are", aux: "avere" },
  { inf: "portare", trans: "to bring, to carry", grp: "are", aux: "avere" },
  { inf: "aspettare", trans: "to wait", grp: "are", aux: "avere" },
  { inf: "guardare", trans: "to watch, to look at", grp: "are", aux: "avere" },

  // -ere regular verbs (some with irregular past participle)
  { inf: "scrivere", trans: "to write", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "scritto" } },
  { inf: "leggere", trans: "to read", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "letto" } },
  { inf: "prendere", trans: "to take", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "preso" } },
  { inf: "vedere", trans: "to see", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "visto" } },
  { inf: "chiedere", trans: "to ask", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "chiesto" } },
  { inf: "mettere", trans: "to put, to place", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "messo" } },
  { inf: "vincere", trans: "to win", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "vinto" } },
  { inf: "correre", trans: "to run", grp: "ere", aux: "essere", opt: { irregularPastParticiple: "corso" } },
  { inf: "vivere", trans: "to live", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "vissuto" } },
  { inf: "perdere", trans: "to lose", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "perso" } },
  { inf: "credere", trans: "to believe", grp: "ere", aux: "avere" },
  { inf: "chiudere", trans: "to close", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "chiuso" } },
  { inf: "rispondere", trans: "to answer", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "risposto" } },
  { inf: "decidere", trans: "to decide", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "deciso" } },
  { inf: "piangere", trans: "to cry", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "pianto" } },
  { inf: "ridere", trans: "to laugh", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "riso" } },
  { inf: "rompere", trans: "to break", grp: "ere", aux: "avere", opt: { irregularPastParticiple: "rotto" } },

  // -ire regular verbs (without -isc)
  { inf: "partire", trans: "to leave, to depart", grp: "ire", aux: "essere" },
  { inf: "dormire", trans: "to sleep", grp: "ire", aux: "avere" },
  { inf: "sentire", trans: "to feel, to hear", grp: "ire", aux: "avere" },
  { inf: "servire", trans: "to serve, to need", grp: "ire", aux: "avere" },
  { inf: "offrire", trans: "to offer", grp: "ire", aux: "avere", opt: { irregularPastParticiple: "offerto" } },
  { inf: "aprire", trans: "to open", grp: "ire", aux: "avere", opt: { irregularPastParticiple: "aperto" } },

  // -ire regular verbs (with -isc)
  { inf: "capire", trans: "to understand", grp: "ire", aux: "avere", opt: { isIsc: true } },
  { inf: "finire", trans: "to finish", grp: "ire", aux: "avere", opt: { isIsc: true } },
  { inf: "preferire", trans: "to prefer", grp: "ire", aux: "avere", opt: { isIsc: true } },
  { inf: "pulire", trans: "to clean", grp: "ire", aux: "avere", opt: { isIsc: true } },
  { inf: "spedire", trans: "to send", grp: "ire", aux: "avere", opt: { isIsc: true } },
  { inf: "costruire", trans: "to build", grp: "ire", aux: "avere", opt: { isIsc: true } }
];

const regularVerbs = regularVerbsData.map(v => 
  buildRegularVerb(v.inf, v.trans, v.grp, v.aux, v.opt)
);

// Combine both arrays
const allVerbs = [...irregularVerbs, ...regularVerbs];

// Pronouns helper
const pronouns = {
  io: "io (I)",
  tu: "tu (you sing.)",
  lui_lei: "lui / lei (he / she)",
  noi: "noi (we)",
  voi: "voi (you plur.)",
  loro: "loro (they)"
};

// Tenses helper
const tenses = {
  presente: "Presente (Present)",
  passato_prossimo: "Passato Prossimo (Past)",
  imperfetto: "Imperfetto (Imperfect)",
  futuro: "Futuro Semplice (Future)"
};

// Export to window object for global script access
window.ITALIAN_VERBS = allVerbs;
window.ITALIAN_PRONOUNS = pronouns;
window.ITALIAN_TENSES = tenses;
