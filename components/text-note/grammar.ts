import { GrammarSuggestion } from "./types";

export const localGrammarChecker = {
  checkGrammar: async (text: string): Promise<GrammarSuggestion[]> => {
    await new Promise((r) => setTimeout(r, 150));
    const suggestions: GrammarSuggestion[] = [];

    // Helper: push suggestion only if not already caught at same offset
    const seen = new Set<number>();
    const add = (s: GrammarSuggestion) => {
      if (!seen.has(s.offset)) {
        seen.add(s.offset);
        suggestions.push(s);
      }
    };

    // ── 1. Standalone lowercase "i" (not inside a word) ───────────────────────
    // Must be surrounded by non-word chars (or start/end of string)
    const iRegex = /(?<![a-zA-Z])i(?![a-zA-Z])/g;
    for (const m of text.matchAll(iRegex)) {
      if (m.index !== undefined && m[0] === "i") {
        add({ offset: m.index, length: 1, text: "i", suggestion: "I", message: 'Pronoun "I" must always be capitalized.' });
      }
    }

    // ── 2. Common misspellings ─────────────────────────────────────────────────
    const misspellings: [RegExp, string][] = [
      [/\b(recieve)\b/gi,   "receive"],
      [/\b(recieved)\b/gi,  "received"],
      [/\b(recieving)\b/gi, "receiving"],
      [/\b(teh)\b/gi,       "the"],
      [/\b(alot)\b/gi,      "a lot"],
      [/\b(definately)\b/gi,"definitely"],
      [/\b(occured)\b/gi,   "occurred"],
      [/\b(occurence)\b/gi, "occurrence"],
      [/\b(seperately)\b/gi,"separately"],
      [/\b(thier)\b/gi,     "their"],
      [/\b(wierd)\b/gi,     "weird"],
      [/\b(freind)\b/gi,    "friend"],
      [/\b(beleive)\b/gi,   "believe"],
      [/\b(truely)\b/gi,    "truly"],
      [/\b(untill)\b/gi,    "until"],
      [/\b(occassion)\b/gi, "occasion"],
      [/\b(neccessary)\b/gi,"necessary"],
      [/\b(accomodate)\b/gi,"accommodate"],
      [/\b(reccommend)\b/gi,"recommend"],
      [/\b(realy)\b/gi,     "really"],
      [/\b(dont)\b/gi,      "don't"],
      [/\b(didnt)\b/gi,     "didn't"],
      [/\b(wont)\b/gi,      "won't"],
      [/\b(cant)\b/gi,      "can't"],
      [/\b(isnt)\b/gi,      "isn't"],
      [/\b(wasnt)\b/gi,     "wasn't"],
      [/\b(wouldnt)\b/gi,   "wouldn't"],
      [/\b(couldnt)\b/gi,   "couldn't"],
    ];

    for (const [regex, fix] of misspellings) {
      for (const m of text.matchAll(regex)) {
        if (m.index !== undefined) {
          // Preserve original casing for the first letter
          const original = m[1];
          const corrected = original[0] === original[0].toUpperCase()
            ? fix.charAt(0).toUpperCase() + fix.slice(1)
            : fix;
          add({
            offset: m.index,
            length: original.length,
            text: original,
            suggestion: corrected,
            message: `Spelling: "${original}" → "${corrected}"`,
          });
        }
      }
    }

    // ── 3. Double words (e.g. "the the") ──────────────────────────────────────
    for (const m of text.matchAll(/\b(\w+)\s+\1\b/gi)) {
      if (m.index !== undefined) {
        add({
          offset: m.index,
          length: m[0].length,
          text: m[0],
          suggestion: m[1],
          message: `Repeated word: "${m[1]}" appears twice.`,
        });
      }
    }

    // ── 4. Sentence starts with lowercase ─────────────────────────────────────
    for (const m of text.matchAll(/(?:^|[.!?]\s+)([a-z])/gm)) {
      if (m.index !== undefined && m[1]) {
        const charOffset = m.index + m[0].length - 1;
        add({
          offset: charOffset,
          length: 1,
          text: m[1],
          suggestion: m[1].toUpperCase(),
          message: "Sentences should start with a capital letter.",
        });
      }
    }

    // Sort by position
    return suggestions.sort((a, b) => a.offset - b.offset);
  },
};
