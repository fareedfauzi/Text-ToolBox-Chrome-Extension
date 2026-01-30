/* =========================
   ELEMENT REFERENCES
========================= */
const textarea = document.getElementById("textInput");
const info = document.getElementById("info");
const darkToggle = document.getElementById("darkToggle");

/* =========================
   UNDO STACK
========================= */
let historyStack = [];
const MAX_HISTORY = 50;

function saveState() {
  if (
    historyStack.length === 0 ||
    historyStack[historyStack.length - 1] !== textarea.value
  ) {
    historyStack.push(textarea.value);
    if (historyStack.length > MAX_HISTORY) {
      historyStack.shift();
    }
  }
}

undoBtn.onclick = () => {
  if (historyStack.length === 0) {
    info.textContent = "Nothing to undo";
    return;
  }
  textarea.value = historyStack.pop();
  info.textContent = "Reverted to previous state";
};

/* =========================
   HELPERS
========================= */
function lines() {
  return textarea.value.split(/\r?\n/);
}

/* =========================
   CORE TEXT TOOLS
========================= */
dedupBtn.onclick = () => {
  saveState();
  const before = lines().length;
  const uniq = [...new Set(lines().filter(l => l.trim()))];
  textarea.value = uniq.join("\n");
  info.textContent = `${uniq.length} lines remain, ${before - uniq.length} removed`;
};

sortBtn.onclick = () => {
  saveState();
  textarea.value = lines().filter(l => l.trim()).sort().join("\n");
  info.textContent = "Text sorted";
};

reverseBtn.onclick = () => {
  saveState();
  textarea.value = textarea.value.split("").reverse().join("");
  info.textContent = "Text reversed";
};

upperBtn.onclick = () => {
  saveState();
  textarea.value = textarea.value.toUpperCase();
  info.textContent = "Converted to UPPERCASE";
};

lowerBtn.onclick = () => {
  saveState();
  textarea.value = textarea.value.toLowerCase();
  info.textContent = "Converted to lowercase";
};

/* =========================
   REMOVE CHARS (WITH COUNT)
========================= */
removeBtn.onclick = () => {
  const chars = removeChars.value;
  if (!chars) {
    info.textContent = "No characters to remove";
    return;
  }

  const matches = textarea.value.split(chars).length - 1;
  if (matches === 0) {
    info.textContent = `No occurrences of "${chars}" found`;
    return;
  }

  saveState();
  textarea.value = textarea.value.split(chars).join("");
  info.textContent = `Removed ${matches} occurrence${matches > 1 ? "s" : ""} of "${chars}"`;
};

/* =========================
   NORMAL FIND & REPLACE (WITH COUNT)
========================= */
normalReplaceBtn.onclick = () => {
  const find = findText.value;
  const replace = replaceText.value;

  if (!find) {
    info.textContent = "Find text is empty";
    return;
  }

  const matches = textarea.value.split(find).length - 1;
  if (matches === 0) {
    info.textContent = `No occurrences of "${find}" found`;
    return;
  }

  saveState();
  textarea.value = textarea.value.split(find).join(replace);
  info.textContent = `Replaced ${matches} occurrence${matches > 1 ? "s" : ""}`;
};

/* =========================
   REGEX REPLACE (WITH COUNT)
========================= */
regexReplaceBtn.onclick = () => {
  const pattern = regexFind.value;
  if (!pattern) {
    info.textContent = "Regex pattern is empty";
    return;
  }

  try {
    const regex = new RegExp(pattern, "g");
    const matches = textarea.value.match(regex);

    if (!matches) {
      info.textContent = "No regex matches found";
      return;
    }

    saveState();
    textarea.value = textarea.value.replace(regex, regexReplace.value);
    info.textContent = `Regex replaced ${matches.length} match${matches.length > 1 ? "es" : ""}`;
  } catch {
    info.textContent = "Invalid regex pattern";
  }
};

/* =========================
   REGEX REMOVE (WITH COUNT)
========================= */
regexRemoveBtn.onclick = () => {
  const pattern = regexFind.value;
  if (!pattern) {
    info.textContent = "Regex pattern is empty";
    return;
  }

  try {
    const regex = new RegExp(pattern, "g");
    const matches = textarea.value.match(regex);

    if (!matches) {
      info.textContent = "No regex matches found";
      return;
    }

    saveState();
    textarea.value = textarea.value.replace(regex, "");
    info.textContent = `Regex removed ${matches.length} match${matches.length > 1 ? "es" : ""}`;
  } catch {
    info.textContent = "Invalid regex pattern";
  }
};

/* =========================
   JSON
========================= */
jsonBtn.onclick = () => {
  try {
    saveState();
    textarea.value = JSON.stringify(JSON.parse(textarea.value), null, 2);
    info.textContent = "JSON beautified";
  } catch {
    info.textContent = "❌ Invalid JSON";
  }
};

/* =========================
   BASE64
========================= */
b64EncBtn.onclick = () => {
  saveState();
  textarea.value = btoa(textarea.value);
  info.textContent = "Base64 encoded";
};

b64DecBtn.onclick = () => {
  try {
    saveState();
    textarea.value = atob(textarea.value.trim());
    info.textContent = "Base64 decoded";
  } catch {
    info.textContent = "Invalid Base64";
  }
};

/* =========================
   URL
========================= */
urlEncBtn.onclick = () => {
  saveState();
  textarea.value = encodeURIComponent(textarea.value);
  info.textContent = "URL encoded";
};

urlDecBtn.onclick = () => {
  try {
    saveState();
    textarea.value = decodeURIComponent(textarea.value);
    info.textContent = "URL decoded";
  } catch {
    info.textContent = "Invalid URL encoding";
  }
};

/* =========================
   DARK MODE
========================= */
darkToggle.onchange = () => {
  document.body.classList.toggle("dark", darkToggle.checked);
  localStorage.setItem("darkMode", darkToggle.checked ? "1" : "0");
};

if (localStorage.getItem("darkMode") === "1") {
  darkToggle.checked = true;
  document.body.classList.add("dark");
}
