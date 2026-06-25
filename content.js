(function () {
  "use strict";

  const postStates = new WeakMap();
  let activePost = null;
  let revealedPost = null;
  let currentMode = "gate";
  let requiredClicks = 10;
  let modeLoaded = false;

  function init() {
    const observer = new MutationObserver((mutations) => {
      for (const mut of mutations) {
        for (const node of mut.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;

          if (node.matches?.("article")) {
            processPost(node);
            continue;
          }

          const articles = node.querySelectorAll?.("article");
          if (articles?.length) {
            for (const a of articles) processPost(a);
            continue;
          }

          const video =
            node.tagName === "VIDEO"
              ? node
              : node.querySelector?.("video");
          if (video) {
            const article = video.closest("article");
            if (article) processPost(article);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    browser.storage.sync.get(["mode", "clicks"]).then(({ mode, clicks }) => {
      currentMode = mode || "gate";
      requiredClicks = clicks || 10;
      modeLoaded = true;
      document.querySelectorAll("article").forEach(processPost);
    });

    browser.storage.onChanged.addListener(onStorageChanged);
  }

  function onStorageChanged(changes) {
    if (changes.mode) {
      const wasHide = currentMode === "hide";
      currentMode = changes.mode.newValue;
      const nowHide = currentMode === "hide";

      if (nowHide && !wasHide) {
        document.querySelectorAll("article").forEach((article) => {
          const st = postStates.get(article);
          if (!st) return;
          if (st.button) {
            st.button.remove();
            st.button = null;
          }
          hideText(st.textEls);
        });
      } else if (!nowHide && wasHide) {
        document.querySelectorAll("article").forEach((article) => {
          const st = postStates.get(article);
          if (!st) return;
          if (!st.button) {
            const button = createButton(article, st);
            st.button = button;
            st.clickCount = 0;
            injectButton(st.textEls, button);
          }
        });
      }
    }

    if (changes.clicks && currentMode === "gate") {
      requiredClicks = changes.clicks.newValue;
      document.querySelectorAll("article").forEach((article) => {
        const st = postStates.get(article);
        if (!st?.button) return;
        st.button.textContent = `(${st.clickCount}/${requiredClicks}) Reveal text`;
      });
    }
  }

  function processPost(article) {
    if (!modeLoaded) return;
    if (postStates.has(article)) return;

    if (!article.querySelector("video")) return;

    const textEls = [...article.querySelectorAll('[data-testid="tweetText"]')];
    if (textEls.length === 0) return;

    const state = { clickCount: 0, textEls, button: null };
    postStates.set(article, state);

    hideText(textEls);

    if (currentMode === "gate") {
      const button = createButton(article, state);
      state.button = button;
      injectButton(textEls, button);
    }
  }

  function hideText(els) {
    for (const el of els) {
      el.style.setProperty("opacity", "0", "important");
      el.style.setProperty("height", "0", "important");
      el.style.setProperty("overflow", "hidden", "important");
      el.style.setProperty("margin", "0", "important");
      el.style.setProperty("padding", "0", "important");
    }
  }

  function revealText(els) {
    for (const el of els) {
      el.style.removeProperty("opacity");
      el.style.removeProperty("height");
      el.style.removeProperty("overflow");
      el.style.removeProperty("margin");
      el.style.removeProperty("padding");
    }
  }

  function injectButton(textEls, button) {
    const lastText = textEls[textEls.length - 1];
    lastText.after(button);
  }

  function createButton(article, state) {
    const btn = document.createElement("button");
    btn.textContent = `(0/${requiredClicks}) Reveal text`;
    btn.type = "button";
    Object.assign(btn.style, {
      display: "block",
      width: "100%",
      padding: "8px 12px",
      margin: "4px 0",
      background: "#1d9bf0",
      color: "#fff",
      border: "none",
      borderRadius: "20px",
      font: "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      cursor: "pointer",
      transition: "opacity 0.2s",
      boxSizing: "border-box",
    });
    btn.onmouseenter = () => (btn.style.opacity = "0.8");
    btn.onmouseleave = () => (btn.style.opacity = "1");
    btn.onclick = () => handleClick(article, state, btn);
    return btn;
  }

  function handleClick(article, state, btn) {
    if (revealedPost && revealedPost !== article) {
      regatePost(revealedPost);
    }
    if (activePost && activePost !== article) {
      resetPost(activePost);
    }

    activePost = article;
    state.clickCount++;

    if (state.clickCount >= requiredClicks) {
      revealText(state.textEls);
      btn.style.display = "none";
      revealedPost = article;
      activePost = null;
      return;
    }

    btn.textContent = `(${state.clickCount}/${requiredClicks}) Reveal text`;
    btn.style.transform = "scale(0.96)";
    setTimeout(() => (btn.style.transform = "scale(1)"), 100);
  }

  function resetPost(article) {
    const st = postStates.get(article);
    if (!st) return;

    st.clickCount = 0;
    hideText(st.textEls);

    if (st.button) st.button.textContent = `(0/${requiredClicks}) Reveal text`;
  }

  function regatePost(article) {
    const st = postStates.get(article);
    if (!st) return;

    st.clickCount = 0;
    hideText(st.textEls);

    if (st.button) {
      st.button.style.display = "block";
      st.button.textContent = `(0/${requiredClicks}) Reveal text`;
    }

    revealedPost = null;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
