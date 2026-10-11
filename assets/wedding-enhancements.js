/**
 * wedding-enhancements.js
 * 1. Background Music Engine with Luxury Equalizer Toggle Button
 * 2. Automatic Smooth Autoscroll (triggers right after blessing finishes and guest enters)
 * 3. Dynamic Card Enhancements & Text Polish
 */

(function () {
  "use strict";

  /* ==========================================================================
     1. BACKGROUND AUDIO ENGINE
     ========================================================================== */
  const audioSrc =
    (window.WEDDING_DATA &&
      window.WEDDING_DATA.intro &&
      window.WEDDING_DATA.intro.musicSrc) ||
    "./editable/assets/bg-music.mp3";

  const audio = new Audio(audioSrc);
  audio.loop = true;
  audio.preload = "auto";
  let isAudioPlaying = false;
  let audioUserToggled = false;

  const musicBtn = document.createElement("button");
  musicBtn.className = "music-toggle-btn music-muted";
  musicBtn.id = "wedding-music-btn";
  musicBtn.setAttribute("type", "button");
  musicBtn.setAttribute("aria-label", "Toggle Background Music");
  musicBtn.innerHTML = `
    <div class="music-eq-bars">
      <span class="music-eq-bar"></span>
      <span class="music-eq-bar"></span>
      <span class="music-eq-bar"></span>
      <span class="music-eq-bar"></span>
    </div>
  `;

  function startAudio() {
    if (isAudioPlaying) return;
    audio
      .play()
      .then(() => {
        isAudioPlaying = true;
        musicBtn.classList.remove("music-muted");
        musicBtn.classList.add("music-playing");
      })
      .catch((err) => {
        console.log("Audio waiting for user gesture:", err);
      });
  }

  function pauseAudio() {
    audio.pause();
    isAudioPlaying = false;
    musicBtn.classList.remove("music-playing");
    musicBtn.classList.add("music-muted");
  }

  function toggleAudio(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    audioUserToggled = true;
    if (isAudioPlaying) {
      pauseAudio();
    } else {
      startAudio();
    }
  }

  musicBtn.addEventListener("click", toggleAudio);

  // Auto-play audio on first user touch / click
  function handleFirstInteraction() {
    if (!audioUserToggled && !isAudioPlaying) {
      startAudio();
    }
  }

  window.addEventListener("pointerdown", handleFirstInteraction, { passive: true });
  window.addEventListener("click", handleFirstInteraction, { passive: true });
  window.addEventListener("touchstart", handleFirstInteraction, { passive: true });

  /* ==========================================================================
     2. DUAL-ENGINE AUTOSCROLL (Native + Lenis Support)
     ========================================================================== */
  let isAutoScrolling = false;
  let autoScrollPausedByUser = false;
  let autoScrollRaf = null;
  let lastFrameTime = null;
  let userInteractTimeout = null;
  const SCROLL_SPEED_PX_PER_SEC = 40; // Luxurious, comfortable reading speed

  const scrollPill = document.createElement("button");
  scrollPill.className = "autoscroll-pill autoscroll-paused";
  scrollPill.id = "wedding-autoscroll-pill";
  scrollPill.setAttribute("type", "button");
  scrollPill.style.display = "none";
  scrollPill.innerHTML = `
    <span class="autoscroll-dot"></span>
    <span class="autoscroll-text">Auto-Scroll</span>
  `;

  function updateScrollPillUI(active, text) {
    if (active) {
      scrollPill.classList.remove("autoscroll-paused");
      scrollPill.classList.add("autoscroll-active");
      scrollPill.querySelector(".autoscroll-text").textContent =
        text || "Auto-Scrolling";
    } else {
      scrollPill.classList.remove("autoscroll-active");
      scrollPill.classList.add("autoscroll-paused");
      scrollPill.querySelector(".autoscroll-text").textContent =
        text || "Resume Scroll";
    }
  }

  function stepNativeAutoScroll(timestamp) {
    if (!isAutoScrolling) return;

    if (!lastFrameTime) {
      lastFrameTime = timestamp;
    }
    const deltaMs = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    const scrollDelta = (SCROLL_SPEED_PX_PER_SEC * deltaMs) / 1000;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll =
      window.scrollY || document.documentElement.scrollTop || 0;

    if (currentScroll >= maxScroll - 6) {
      stopAutoScroll();
      updateScrollPillUI(false, "End of Invitation");
      return;
    }

    if (window.lenis && typeof window.lenis.scrollTo === "function") {
      // Advance Lenis target
      window.lenis.scrollTo(currentScroll + scrollDelta, {
        immediate: true,
        force: true,
      });
    } else {
      window.scrollBy(0, scrollDelta);
    }

    autoScrollRaf = requestAnimationFrame(stepNativeAutoScroll);
  }

  function startAutoScroll() {
    if (isAutoScrolling) return;
    isAutoScrolling = true;
    lastFrameTime = null;
    updateScrollPillUI(true);
    autoScrollRaf = requestAnimationFrame(stepNativeAutoScroll);
  }

  function stopAutoScroll() {
    isAutoScrolling = false;
    if (autoScrollRaf) {
      cancelAnimationFrame(autoScrollRaf);
      autoScrollRaf = null;
    }
    updateScrollPillUI(false);
  }

  function toggleAutoScroll(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (isAutoScrolling) {
      autoScrollPausedByUser = true;
      stopAutoScroll();
    } else {
      autoScrollPausedByUser = false;
      startAutoScroll();
    }
  }

  scrollPill.addEventListener("click", toggleAutoScroll);

  // Pause temporarily when user interacts
  function handleManualScrollEvent() {
    if (!isAutoScrolling) return;
    stopAutoScroll();

    if (!autoScrollPausedByUser) {
      clearTimeout(userInteractTimeout);
      userInteractTimeout = setTimeout(() => {
        if (!autoScrollPausedByUser && scrollPill.style.display !== "none") {
          startAutoScroll();
        }
      }, 3500);
    }
  }

  window.addEventListener("wheel", handleManualScrollEvent, { passive: true });
  window.addEventListener("touchmove", handleManualScrollEvent, { passive: true });

  // Hook called when invitation is unlocked
  window.__initAutoScroll = function (lenisInstance) {
    if (lenisInstance) {
      window.lenis = lenisInstance;
    }
    startAudio();

    // Give the reveal animation 1.2s to complete, then start smooth auto-scroll
    setTimeout(() => {
      scrollPill.style.display = "inline-flex";
      startAutoScroll();
    }, 1200);
  };

  // Also listen for button clicks to trigger flow
  document.addEventListener(
    "click",
    function (e) {
      const btn = e.target.closest("button");
      if (!btn) return;

      const label = (btn.getAttribute("aria-label") || "").toLowerCase();
      const text = (btn.textContent || "").toLowerCase();

      if (
        label.includes("enter") ||
        text.includes("enter") ||
        btn.closest('[aria-label="Enter the invitation"]')
      ) {
        startAudio();
        setTimeout(() => {
          scrollPill.style.display = "inline-flex";
          startAutoScroll();
        }, 1200);
      } else if (
        label.includes("begin") ||
        text.includes("begin") ||
        btn.closest('[aria-label="Wedding invitation cover"]')
      ) {
        startAudio();
      }
    },
    true
  );

  /* ==========================================================================
     3. DOM ENHANCEMENTS & PLAQUES
     ========================================================================== */
  function enhanceDOM() {
    // 1. Family Card plaque
    const familyCardSection = document.querySelector("section.py-12");
    if (familyCardSection) {
      const innerText = familyCardSection.querySelector(".absolute.inset-0.flex-col");
      if (innerText && !innerText.classList.contains("family-card-plaque")) {
        innerText.classList.add("family-card-plaque");
      }
    }

    // 2. Couple Roles
    const coupleCards = document.querySelectorAll("section.py-24 article");
    if (coupleCards && coupleCards.length >= 2) {
      const p1 = coupleCards[0].querySelector("p");
      const p2 = coupleCards[1].querySelector("p");
      if (p1 && (!p1.textContent || p1.textContent.trim() === "")) {
        p1.textContent = "The Bride";
      }
      if (p2 && (!p2.textContent || p2.textContent.trim() === "")) {
        p2.textContent = "The Groom";
      }
    }

    // 3. Clean any replacement character artifacts
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.includes("\uFFFD")) {
        node.nodeValue = node.nodeValue.replace(/\uFFFD/g, "");
      }
    }

    // 4. Show pill if main invitation is active
    const main = document.querySelector("main:not(.sr-only)");
    if (main && scrollPill.style.display === "none") {
      scrollPill.style.display = "inline-flex";
    }
  }

  const observer = new MutationObserver(enhanceDOM);

  function init() {
    if (!document.getElementById("wedding-music-btn")) {
      document.body.appendChild(musicBtn);
    }
    if (!document.getElementById("wedding-autoscroll-pill")) {
      document.body.appendChild(scrollPill);
    }
    observer.observe(document.body, { childList: true, subtree: true });
    enhanceDOM();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
