const EXAMPLE = "Dear colleagues, I would like to meet with you here tomorrow night to write a peaceful letter regarding the upcoming faculty review.";

const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const outputSection = document.getElementById("output-section");
const translateBtn = document.getElementById("translate-btn");
const exampleBtn = document.getElementById("example-btn");
const clearBtn = document.getElementById("clear-btn");

translateBtn.addEventListener("click", run);
exampleBtn.addEventListener("click", () => { inputEl.value = EXAMPLE; });
clearBtn.addEventListener("click", () => {
    inputEl.value = "";
    outputSection.hidden = true;
    outputEl.textContent = "";
});

async function run() {
    const input = inputEl.value.trim();
    if (!input) return;

    translateBtn.disabled = true;
    translateBtn.textContent = "Enriching…";
    outputSection.hidden = false;
    outputEl.textContent = "…";

    try {
        outputEl.textContent = await mangle(input);
    } catch (err) {
        console.error(err);
        outputEl.textContent = `Something broke: ${err.message}`;
    } finally {
        translateBtn.disabled = false;
        translateBtn.textContent = "Enrich passage";
    }
}

async function mangle(text) {
    const tokens = text.match(/[A-Za-z']+|[^A-Za-z']+/g) || [];
    const result = await Promise.all(tokens.map(async (tok) => {
        if (!/^[A-Za-z']+$/.test(tok)) return tok;
        if (tok.length <= 1) return tok;

        // Silent first pass: swap in a Levenshtein-ish neighbor so downstream
        // steps operate on a subtly wrong word.
        const neighbor = await spelledLike(tok);
        const base = neighbor ? matchCase(tok, neighbor) : tok;

        // Coin flip: homophone or syllable-maximizing synonym, on the neighbor.
        const useHomophone = Math.random() < 0.5;
        const replacement = useHomophone
            ? homophoneFor(base)
            : await longestSynonym(base);

        return replacement ? matchCase(base, replacement) : base;
    }));
    return result.join("");
}

const neighborCache = new Map();

async function spelledLike(word) {
    const lower = word.toLowerCase();
    if (neighborCache.has(lower)) return neighborCache.get(lower);
    try {
        const res = await fetch(
            `https://api.datamuse.com/words?sp=${encodeURIComponent(lower)}&max=10`
        );
        const data = await res.json();
        const candidates = data.filter(d => !d.word.includes(" ") && d.word !== lower);
        let pick = null;
        if (candidates.length > 0) {
            const pool = candidates.slice(0, 3);
            pick = pool[Math.floor(Math.random() * pool.length)].word;
        }
        neighborCache.set(lower, pick);
        return pick;
    } catch {
        neighborCache.set(lower, null);
        return null;
    }
}

function homophoneFor(word) {
    return HOMOPHONES[word.toLowerCase()] || null;
}

const synonymCache = new Map();

async function longestSynonym(word) {
    const lower = word.toLowerCase();
    if (synonymCache.has(lower)) return synonymCache.get(lower);

    try {
        const res = await fetch(
            `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(lower)}&md=s&max=30`
        );
        const data = await res.json();
        const candidates = data.filter(d => !d.word.includes(" ") && d.word !== lower);

        let pick = null;
        if (candidates.length > 0) {
            // Sort by syllables desc, then by letter count desc as the tiebreak.
            candidates.sort((a, b) => {
                const sa = parseInt(a.numSyllables ?? 0, 10);
                const sb = parseInt(b.numSyllables ?? 0, 10);
                if (sb !== sa) return sb - sa;
                return b.word.length - a.word.length;
            });
            pick = candidates[0].word;
        }
        synonymCache.set(lower, pick);
        return pick;
    } catch {
        synonymCache.set(lower, null);
        return null;
    }
}

function matchCase(original, replacement) {
    if (original === original.toUpperCase() && original.length > 1) {
        return replacement.toUpperCase();
    }
    if (original[0] === original[0].toUpperCase()) {
        return replacement[0].toUpperCase() + replacement.slice(1);
    }
    return replacement;
}
