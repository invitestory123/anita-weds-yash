/**
 * wedding-enhancements.js
 * 1. Background Music Engine with Luxury Equalizer Toggle Button
 * 2. Automatic Smooth Autoscroll (triggers right after blessing finishes and guest enters)
 * 3. Dynamic Contrast & Card Plaque Enhancements
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

  // Create Luxury Floating Music Toggle Button
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
        // Autoplay may be restricted until user gesture
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

  // Auto-start audio on first user interaction anywhere
  function handleFirstInteraction() {
    if (!audioUserToggled && !isAudioPlaying) {
      startAudio();
    }
  }

  window.addEventListener("pointerdown", handleFirstInteraction, { passive: true });
  window.addEventListener("click", handleFirstInteraction, { passive: true });
  window.addEventListener("touchstart", handleFirstInteraction, { passive: true });

  /* ==========================================================================
     2. AUTOSCROLL ENGINE (Begins after blessing finishes and click)
     ========================================================================== */
  let isAutoScrolling = false;
  let autoScrollPausedByUser = false;
  let autoScrollRaf = null;
  let lastFrameTime = null;
  let userInteractTimeout = null;
  const SCROLL_SPEED_PX_PER_SEC = 42; // Elegant, comfortable reading pace

  // Floating Auto-scroll pill widget
  const scrollPill = document.createElement("button");
  scrollPill.className = "autoscroll-pill autoscroll-paused";
  scrollPill.id = "wedding-autoscroll-pill";
  scrollPill.setAttribute("type", "button");
  scrollPill.style.display = "none"; // Shown once invitation opens
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

  function stepAutoScroll(timestamp) {
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
      // Reached the end
      stopAutoScroll();
      updateScrollPillUI(false, "End of Story");
      return;
    }

    window.scrollBy(0, scrollDelta);
    autoScrollRaf = requestAnimationFrame(stepAutoScroll);
  }

  function startAutoScroll() {
    if (isAutoScrolling) return;
    isAutoScrolling = true;
    lastFrameTime = null;
    updateScrollPillUI(true);
    autoScrollRaf = requestAnimationFrame(stepAutoScroll);
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

  // Pause briefly if user scrolls or touches manually
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

  // Start Autoscroll after blessing finishes and click:
  function triggerPostBlessingFlow() {
    // 1. Start audio playback
    startAudio();

    // 2. Wait for gate reveal transition to finish (~1200ms)
    setTimeout(() => {
      scrollPill.style.display = "inline-flex";
      startAutoScroll();
    }, 1200);
  }

  // Listen to Enter Click on Blessing Screen
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    // Check if clicked the blessing enter button or cover begin button
    const label = (btn.getAttribute("aria-label") || "").toLowerCase();
    const text = (btn.textContent || "").toLowerCase();

    if (
      label.includes("enter") ||
      text.includes("enter") ||
      btn.closest('[aria-label="Enter the invitation"]')
    ) {
      triggerPostBlessingFlow();
    } else if (
      label.includes("begin") ||
      text.includes("begin") ||
      btn.closest('[aria-label="Wedding invitation cover"]')
    ) {
      // Start audio immediately on cover begin
      startAudio();
    }
  }, true);

  /* ==========================================================================
     3. DOM & PLAQUE ENHANCEMENTS (Fix spacing, contrast, cards)
     ========================================================================== */
  function enhanceDOM() {
    // A. Check for Family Card (QM) and wrap inner text in elegant plaque
    const familyCardSection = document.querySelector("section.py-12");
    if (familyCardSection) {
      const innerTextContainer = familyCardSection.querySelector(".absolute.inset-0.flex-col");
      if (innerTextContainer && !innerTextContainer.classList.contains("family-card-plaque")) {
        innerTextContainer.classList.add("family-card-plaque");
      }
    }

    // B. Fix Couple roles if empty
    const coupleCards = document.querySelectorAll("section .grid.sm\\:grid-cols-2 article");
    if (coupleCards && coupleCards.length >= 2) {
      const card1 = coupleCards[0];
      const card2 = coupleCards[1];

      const p1 = card1.querySelector("p.text-temple-bronze\\/65") || card1.querySelector("p");
      const p2 = card2.querySelector("p.text-temple-bronze\\/65") || card2.querySelector("p");

      if (p1 && (!p1.textContent || p1.textContent.trim() === "")) {
        p1.textContent = "The Bride";
      }
      if (p2 && (!p2.textContent || p2.textContent.trim() === "")) {
        p2.textContent = "The Groom";
      }
    }

    // C. Clean any replacement character artifacts in texts
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

    // D. If main is mounted and scrollPill is hidden, show it
    const main = document.querySelector("main:not(.sr-only)");
    if (main && scrollPill.style.display === "none") {
      scrollPill.style.display = "inline-flex";
    }
  }

  // Observe DOM changes to continuously ensure enhancements
  const observer = new MutationObserver(enhanceDOM);

  document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(musicBtn);
    document.body.appendChild(scrollPill);
    observer.observe(document.body, { childList: true, subtree: true });
    enhanceDOM();
  });

  if (document.readyState === "complete" || document.readyState === "interactive") {
    if (!document.getElementById("wedding-music-btn")) {
      document.body.appendChild(musicBtn);
    }
    if (!document.getElementById("wedding-autoscroll-pill")) {
      document.body.appendChild(scrollPill);
    }
    enhanceDOM();
  }
})();
