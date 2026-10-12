/**
 * wedding-enhancements.js
 * 1. Background Music Engine with Luxury Equalizer Toggle Button
 * 2. Automatic Smooth Autoscroll (triggers right after blessing finishes and guest enters, without intrusive floating pill)
 * 3. Family Welcome Card: Compact translucent centered plaque preserving background artwork
 * 4. RSVP: Hide WhatsApp button when no number is configured in wedding-data.js
 * 5. Footer: "ANITA & YASH" watermark with proper spacing preventing text collisions
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
     2. DUAL-ENGINE AUTOSCROLL (Clean, Natural, No Floating Pill)
     ========================================================================== */
  let isAutoScrolling = false;
  let autoScrollRaf = null;
  let lastFrameTime = null;
  let userInteractTimeout = null;
  const SCROLL_SPEED_PX_PER_SEC = 38; // Smooth, comfortable reading pace

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
      return;
    }

    if (window.lenis && typeof window.lenis.scrollTo === "function") {
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
    autoScrollRaf = requestAnimationFrame(stepNativeAutoScroll);
  }

  function stopAutoScroll() {
    isAutoScrolling = false;
    if (autoScrollRaf) {
      cancelAnimationFrame(autoScrollRaf);
      autoScrollRaf = null;
    }
  }

  // Pause temporarily when user interacts, then resume after reading pause
  function handleManualScrollEvent() {
    if (!isAutoScrolling) return;
    stopAutoScroll();

    clearTimeout(userInteractTimeout);
    userInteractTimeout = setTimeout(() => {
      const main = document.querySelector("main:not(.sr-only)");
      if (main) {
        startAutoScroll();
      }
    }, 4000);
  }

  window.addEventListener("wheel", handleManualScrollEvent, { passive: true });
  window.addEventListener("touchmove", handleManualScrollEvent, { passive: true });

  // Hook called when invitation is unlocked
  window.__initAutoScroll = function (lenisInstance) {
    if (lenisInstance) {
      window.lenis = lenisInstance;
    }
    startAudio();

    setTimeout(() => {
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
     3. DOM ENHANCEMENTS: FAMILY CARD, RSVP & FOOTER WATERMARK
     ========================================================================== */
  function enhanceDOM() {
    // 1. Family Card: Wrap text inside a compact, translucent, centered plaque
    const familyCardSection = document.querySelector("section.py-12");
    if (familyCardSection) {
      const container = familyCardSection.querySelector(".absolute.inset-0.flex-col");
      if (container) {
        container.classList.remove("family-card-plaque");
        container.classList.add("family-card-outer");

        let subtlePlaque = container.querySelector(".family-card-subtle-plaque");
        if (!subtlePlaque) {
          subtlePlaque = document.createElement("div");
          subtlePlaque.className = "family-card-subtle-plaque";

          // Move all existing children of the container inside the subtle plaque
          while (container.firstChild) {
            subtlePlaque.appendChild(container.firstChild);
          }
          container.appendChild(subtlePlaque);
        }
      }
    }

    // 2. RSVP: Hide WhatsApp button if no WhatsApp number is configured
    const rsvpWhatsapp = (window.WEDDING_DATA?.rsvp?.whatsapp || "").trim();
    if (!rsvpWhatsapp) {
      const waButtons = document.querySelectorAll('a[href*="wa.me"]');
      waButtons.forEach((btn) => {
        btn.style.display = "none";
      });
      // Also adjust grid layout if phone call button is alone
      const rsvpBtnGrid = document.querySelector(".bg-ivory-soft\\/80.p-6 .grid");
      if (rsvpBtnGrid && !window.WEDDING_DATA?.rsvp?.phone) {
        rsvpBtnGrid.style.display = "none";
      }
    }

    // 3. Footer: Set couple watermark to "ANITA & YASH" and prevent overlap
    const footerWatermark = document.querySelector("footer span.text-\\[10vw\\]") ||
                            document.querySelector("footer .footer-couple-watermark");
    if (footerWatermark) {
      if (footerWatermark.textContent !== "ANITA & YASH") {
        footerWatermark.textContent = "ANITA & YASH";
      }
    }

    // 4. Couple Roles fallback
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

    // 5. Clean any replacement character artifacts
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
  }

  const observer = new MutationObserver(enhanceDOM);

  function init() {
    if (!document.getElementById("wedding-music-btn")) {
      document.body.appendChild(musicBtn);
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
