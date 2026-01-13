(function () {
  "use strict";

  // Prevent multiple injections
  if (window.__contextLexLoaded) return;
  window.__contextLexLoaded = true;

  let tooltip = null;
  let currentWord = null;

  // Create tooltip element
  function createTooltip() {
    if (tooltip) return tooltip;

    tooltip = document.createElement("div");
    tooltip.id = "contextlex-tooltip";
    tooltip.setAttribute("role", "tooltip");
    document.body.appendChild(tooltip);
    return tooltip;
  }

  // Remove tooltip
  function hideTooltip() {
    if (tooltip && tooltip.parentNode) {
      tooltip.remove();
      tooltip = null;
    }
    currentWord = null;
  }

  // Validate that selection is a single word
  function isValidWord(text) {
    if (!text || text.length === 0 || text.length > 50) return false;
    // Must be alphabetic characters only (supports accented characters)
    const wordPattern = /^[a-zA-ZÀ-ÿ'-]+$/;
    return wordPattern.test(text);
  }

  // Position tooltip near selection
  function positionTooltip(selection) {
    if (!tooltip || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;

    let top = rect.bottom + window.scrollY + 8;
    let left = rect.left + window.scrollX + rect.width / 2 - tooltipWidth / 2;

    // Keep within viewport horizontally
    const viewportWidth = document.documentElement.clientWidth;
    if (left < 8) left = 8;
    if (left + tooltipWidth > viewportWidth - 8) {
      left = viewportWidth - tooltipWidth - 8;
    }

    // If tooltip would go below viewport, show above selection
    const viewportHeight = document.documentElement.clientHeight;
    if (rect.bottom + tooltipHeight + 16 > viewportHeight) {
      top = rect.top + window.scrollY - tooltipHeight - 8;
    }

    tooltip.style.top = `${Math.max(8, top)}px`;
    tooltip.style.left = `${left}px`;
  }

  // Fetch word definition from Free Dictionary API
  async function fetchDefinition(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        return null;
      }

      const entry = data[0];
      const meanings = [];

      // Extract up to 3 meanings for brevity
      for (const meaning of entry.meanings || []) {
        if (meanings.length >= 3) break;

        const partOfSpeech = meaning.partOfSpeech || "";
        const definitions = meaning.definitions || [];

        if (definitions.length > 0) {
          meanings.push({
            partOfSpeech,
            definition: definitions[0].definition,
            example: definitions[0].example || null,
          });
        }
      }

      if (meanings.length === 0) return null;

      return {
        word: entry.word || word,
        phonetic:
          entry.phonetic ||
          (entry.phonetics && entry.phonetics[0]?.text) ||
          null,
        meanings,
      };
    } catch (error) {
      console.error("ContextLex: Failed to fetch definition", error);
      return null;
    }
  }

  // Render tooltip content
  function renderTooltip(data) {
    if (!tooltip) return;

    if (!data) {
      tooltip.innerHTML = `<div class="contextlex-error">Definition not found</div>`;
      return;
    }

    let html = `<div class="contextlex-word">${escapeHtml(data.word)}`;
    if (data.phonetic) {
      html += ` <span class="contextlex-phonetic">${escapeHtml(data.phonetic)}</span>`;
    }
    html += `</div>`;

    html += `<div class="contextlex-meanings">`;
    for (const meaning of data.meanings) {
      html += `<div class="contextlex-meaning">`;
      html += `<span class="contextlex-pos">${escapeHtml(meaning.partOfSpeech)}</span>`;
      html += `<span class="contextlex-def">${escapeHtml(meaning.definition)}</span>`;
      if (meaning.example) {
        html += `<span class="contextlex-example">"${escapeHtml(meaning.example)}"</span>`;
      }
      html += `</div>`;
    }
    html += `</div>`;

    tooltip.innerHTML = html;
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Show loading state
  function showLoading(selection) {
    createTooltip();
    tooltip.innerHTML = `<div class="contextlex-loading">Loading...</div>`;
    tooltip.style.opacity = "1";
    tooltip.style.visibility = "visible";
    positionTooltip(selection);
  }

  // Handle word selection
  async function handleSelection() {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";

    // Ignore if same word or invalid
    if (!text || text === currentWord || !isValidWord(text)) {
      return;
    }

    currentWord = text;
    showLoading(selection);

    const definition = await fetchDefinition(text);

    // Check if word changed during fetch
    if (text !== currentWord) return;

    renderTooltip(definition);
    positionTooltip(selection);
  }

  // Event listeners
  document.addEventListener("dblclick", (e) => {
    // Ignore clicks on tooltip itself
    if (tooltip && tooltip.contains(e.target)) return;

    // Small delay to let selection complete
    setTimeout(handleSelection, 10);
  });

  // Touch device support - detect selection changes
  let selectionTimeout = null;
  document.addEventListener("selectionchange", () => {
    // Only process on touch devices or when there's an active selection
    if (selectionTimeout) clearTimeout(selectionTimeout);

    selectionTimeout = setTimeout(() => {
      const selection = window.getSelection();
      const text = selection ? selection.toString().trim() : "";

      // Only trigger if it looks like a deliberate word selection
      if (text && text !== currentWord && isValidWord(text)) {
        handleSelection();
      }
    }, 300);
  });

  // Dismiss tooltip on click outside
  document.addEventListener("click", (e) => {
    if (tooltip && !tooltip.contains(e.target)) {
      hideTooltip();
    }
  });

  // Dismiss on scroll
  document.addEventListener("scroll", hideTooltip, { passive: true });

  // Dismiss on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideTooltip();
    }
  });

  // Clean up on page unload
  window.addEventListener("beforeunload", hideTooltip);
})();
