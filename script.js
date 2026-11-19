/* =========================================================
   1. CUSTOMIZE YOUR DETAILS HERE
   ========================================================= */
const appConfig = {
  sisterName: "Didi / Bucha",       // Her name or nickname
  senderName: "Prabhat",            // Your name
  vaultCode: "2001",                // 4-digit passcode (e.g., her birth year)
  memories: [
    { img: "photo1.jpg", caption: "Always having my back" },
    { img: "photo2.jpg", caption: "Partner in crime" },
    { img: "photo3.jpg", caption: "Best day out" },
    { img: "photo4.jpg", caption: "My forever guide" }
  ],
  treatPrizes: [
    "Free Chai/Coffee",
    "No Annoying 24h",
    "Movie Night Pick",
    "Free Dinner Treat",
    "1 Chore Pass",
    "Chocolate Box"
  ],
  quizQuestions: [
    {
      q: "Who is officially Mom & Dad's favorite child?",
      options: ["Obviously me (Didi)", "Definitely your younger brother", "The family pet / Wi-Fi router"],
      roast: "Nice try! Everyone knows it's me—except today because it's your birthday. 😉"
    },
    {
      q: "What happens whenever we disagree on something?",
      options: ["We talk it out calmly", "You pull the 'I'm older' card", "I immediately win"],
      roast: "Haha, pulling the elder sister card works 99% of the time!"
    },
    {
      q: "Who is the coolest elder sister in the world?",
      options: ["You, hands down!", "Still you!", "100% Didi!"],
      roast: "Zero lies detected! You unlocked the final clue! 🎉"
    }
  ],
  letter: `Dear Didi,\n\nHappy Birthday! Even though I tease you every single day, I honestly wouldn't trade having you as my elder sister for anything in the world.\n\nThank you for always guiding me, covering for me, and being my built-in best friend. May this year bring you endless happiness, success, and everything you've been wishing for!\n\nHave the best day ever!`
};

/* =========================================================
   AUDIO TRACK MANAGER (Pages 1-4 vs. Last Page)
   ========================================================= */
let isMuted = false;
let currentPageId = "page-cake";
let audioStarted = false;

function updateAudioTrack() {
  const mainAudio = document.getElementById("bg-music-main");
  const bdayAudio = document.getElementById("bg-music-bday");
  if (!mainAudio || !bdayAudio) return;

  mainAudio.volume = 0.6;
  bdayAudio.volume = 0.7;

  if (isMuted) {
    mainAudio.pause();
    bdayAudio.pause();
    return;
  }

  if (currentPageId === "page-vault") {
    mainAudio.pause();
    bdayAudio.play().catch(() => {});
  } else {
    bdayAudio.pause();
    bdayAudio.currentTime = 0;
    mainAudio.play().catch(() => {});
  }
}

/* =========================================================
   2. INITIALIZATION & PAGE NAVIGATION
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Populate Names & Letter
  document.getElementById("display-sister-name").textContent = appConfig.sisterName;
  document.getElementById("display-sender-name").textContent = appConfig.senderName;
  document.getElementById("letter-body").textContent = appConfig.letter;

  // Render Scrapbook Polaroids (No Dates)
  const grid = document.getElementById("polaroid-grid");
  appConfig.memories.forEach((item) => {
    const card = document.createElement("div");
    card.className = "polaroid-card";
    card.innerHTML = `
      <img src="${item.img}" alt="Memory" onerror="this.src='https://placehold.co/300x300/fce7f3/ff4d8d?text=Add+${item.img}'" />
      <p class="polaroid-caption">${item.caption}</p>
    `;
    grid.appendChild(card);
  });

  // Navigation Handlers
  function switchPage(targetId) {
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));

    const targetPage = document.getElementById(targetId);
    if (targetPage) {
      targetPage.classList.add("active");
      targetPage.scrollTop = 0;
    }

    const activeNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
    if (activeNav) activeNav.classList.add("active");

    currentPageId = targetId;
    if (targetId === "page-memories") syncThenNowWidth();
    updateAudioTrack();
  }

  document.querySelectorAll(".nav-item, .next-page-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchPage(btn.dataset.target));
  });

  initCakeAndAudio();
  initThenNowSlider();
  initCatchGame();
  initQuizGame();
  initTreatWheel();
  initSecretVault();
});

/* =========================================================
   3. INTERACTIVE CAKE & BACKGROUND MUSIC CONTROLS
   ========================================================= */
function initCakeAndAudio() {
  const soundBtn = document.getElementById("sound-toggle");

  // Unlock mobile browser audio on the very first screen tap
  document.body.addEventListener("pointerdown", () => {
    if (!audioStarted && !isMuted) {
      audioStarted = true;
      soundBtn.textContent = "🔊";
      updateAudioTrack();
    }
  }, { once: true });

  // Top-right mute/unmute button
  soundBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isMuted = !isMuted;
    audioStarted = true;
    soundBtn.textContent = isMuted ? "🔇" : "🔊";
    updateAudioTrack();
  });

  function blowCandles() {
    document.querySelectorAll(".candle").forEach((c) => c.classList.add("out"));
    document.getElementById("cake-instruction").textContent = "Yay! Happy Birthday! 🎊";
    document.getElementById("wish-box").classList.remove("hidden");

    if (typeof confetti === "function") {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }
    if (!isMuted) {
      audioStarted = true;
      soundBtn.textContent = "🔊";
      updateAudioTrack();
    }
  }

  document.getElementById("cake-stage").addEventListener("click", blowCandles);
  document.getElementById("blow-btn").addEventListener("click", blowCandles);

  document.getElementById("send-wish-btn").addEventListener("click", () => {
    const input = document.getElementById("wish-input");
    if (!input.value.trim()) return;
    input.value = "";
    document.getElementById("wish-box").classList.add("hidden");
    document.getElementById("wish-sent-msg").classList.remove("hidden");
    if (typeof confetti === "function") confetti({ particleCount: 50, spread: 60 });
  });
}

/* =========================================================
   4. THEN VS. NOW SLIDER
   ========================================================= */
let syncThenNowWidth = () => {};

function initThenNowSlider() {
  const container = document.getElementById("tn-container");
  const overlay = document.getElementById("tn-overlay");
  const thenImg = document.getElementById("tn-then-img");
  const handle = document.getElementById("tn-handle");
  if (!container) return;

  let dragging = false;

  syncThenNowWidth = () => {
    if (container.offsetWidth > 0) {
      thenImg.style.width = container.offsetWidth + "px";
    }
  };

  function moveSlider(clientX) {
    const rect = container.getBoundingClientRect();
    let x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = (x / rect.width) * 100;
    overlay.style.width = pct + "%";
    handle.style.left = pct + "%";
  }

  container.addEventListener("mousedown", (e) => { dragging = true; moveSlider(e.clientX); });
  window.addEventListener("mousemove", (e) => { if (dragging) moveSlider(e.clientX); });
  window.addEventListener("mouseup", () => { dragging = false; });

  container.addEventListener("touchstart", (e) => { dragging = true; moveSlider(e.touches[0].clientX); }, { passive: true });
  container.addEventListener("touchmove", (e) => { if (dragging) moveSlider(e.touches[0].clientX); }, { passive: true });
  window.addEventListener("touchend", () => { dragging = false; });

  window.addEventListener("resize", syncThenNowWidth);
  syncThenNowWidth();
}

/* =========================================================
   5. MINI-GAMES (CATCH GIFTS + SIBLING QUIZ)
   ========================================================= */
function unlockClue(part) {
  const firstTwo = appConfig.vaultCode.slice(0, 2);
  const lastTwo = appConfig.vaultCode.slice(2, 4);

  if (part === 1) {
    const badge = document.getElementById("clue-1-badge");
    badge.textContent = `Clue 1: ${firstTwo}__`;
    badge.classList.replace("locked", "unlocked");
    document.getElementById("vault-clue-1").textContent = `First 2 digits: ${firstTwo}`;
  } else {
    const badge = document.getElementById("clue-2-badge");
    badge.textContent = `Clue 2: __${lastTwo}`;
    badge.classList.replace("locked", "unlocked");
    document.getElementById("vault-clue-2").textContent = `Last 2 digits: ${lastTwo}`;
  }
}

function initCatchGame() {
  document.querySelectorAll(".game-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".game-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".game-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.game).classList.add("active");
    });
  });

  const canvas = document.getElementById("catch-canvas");
  const ctx = canvas.getContext("2d");
  const startBtn = document.getElementById("start-catch-btn");
  const scoreEl = document.getElementById("catch-score");

  let running = false;
  let score = 0;
  let basketX = canvas.width / 2 - 30;
  const basketW = 60;
  let items = [];
  let animId = null;

  const goodies = ["🎁", "🎂", "🍫", "🛍️"];
  const chores = ["🧹", "📚", "🥦"];

  function setBasketFromClientX(clientX) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (clientX - rect.left) * scaleX;
    basketX = Math.max(0, Math.min(x - basketW / 2, canvas.width - basketW));
  }

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    setBasketFromClientX(e.touches[0].clientX);
  }, { passive: false });

  canvas.addEventListener("mousemove", (e) => {
    if (running) setBasketFromClientX(e.clientX);
  });

  function spawnItem() {
    const isGood = Math.random() > 0.3;
    const list = isGood ? goodies : chores;
    items.push({
      x: Math.random() * (canvas.width - 30) + 15,
      y: -20,
      speed: 2.3 + Math.random() * 1.6,
      emoji: list[Math.floor(Math.random() * list.length)],
      good: isGood
    });
  }

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🧺", basketX + basketW / 2, canvas.height - 12);

    if (Math.random() < 0.045) spawnItem();

    ctx.font = "26px Arial";
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.y += it.speed;
      ctx.fillText(it.emoji, it.x, it.y);

      if (it.y > canvas.height - 45 && it.y < canvas.height - 10 && Math.abs(it.x - (basketX + basketW / 2)) < 34) {
        score = it.good ? score + 1 : Math.max(0, score - 1);
        scoreEl.textContent = score;
        items.splice(i, 1);

        if (score >= 10) {
          running = false;
          unlockClue(1);
          startBtn.textContent = "Clue 1 Unlocked! Play Again";
          if (typeof confetti === "function") confetti({ particleCount: 60, spread: 50 });
          return;
        }
        continue;
      }

      if (it.y > canvas.height + 20) items.splice(i, 1);
    }

    animId = requestAnimationFrame(loop);
  }

  startBtn.addEventListener("click", () => {
    cancelAnimationFrame(animId);
    score = 0;
    scoreEl.textContent = "0";
    items = [];
    running = true;
    startBtn.textContent = "Playing...";
    loop();
  });
}

function initQuizGame() {
  let qIndex = 0;
  const qNumEl = document.getElementById("quiz-num");
  const qTextEl = document.getElementById("quiz-question");
  const optBox = document.getElementById("quiz-options");
  const roastEl = document.getElementById("quiz-roast");

  function renderQuestion() {
    const current = appConfig.quizQuestions[qIndex];
    qNumEl.textContent = qIndex + 1;
    qTextEl.textContent = current.q;
    optBox.innerHTML = "";
    roastEl.classList.add("hidden");

    current.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt-btn";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        roastEl.textContent = current.roast;
        roastEl.classList.remove("hidden");

        setTimeout(() => {
          if (qIndex < appConfig.quizQuestions.length - 1) {
            qIndex++;
            renderQuestion();
          } else {
            unlockClue(2);
            qTextEl.textContent = "🎉 Challenge Complete!";
            optBox.innerHTML = "";
          }
        }, 1600);
      });
      optBox.appendChild(btn);
    });
  }

  renderQuestion();
}

/* =========================================================
   6. TREAT SPIN WHEEL
   ========================================================= */
function initTreatWheel() {
  const canvas = document.getElementById("wheel-canvas");
  const ctx = canvas.getContext("2d");
  const spinBtn = document.getElementById("spin-btn");
  const prizes = appConfig.treatPrizes;
  const colors = ["#ff4d8d", "#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];
  const arc = (2 * Math.PI) / prizes.length;
  let currentAngle = 0;
  let spinning = false;

  function drawWheel() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    prizes.forEach((label, i) => {
      const angle = currentAngle + i * arc;
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + arc);
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px Poppins, sans-serif";
      ctx.fillText(label, r - 14, 4);
      ctx.restore();
    });
  }

  drawWheel();

  spinBtn.addEventListener("click", () => {
    if (spinning) return;
    spinning = true;
    const extraSpins = (Math.floor(Math.random() * 5) + 5) * 2 * Math.PI;
    const randomOffset = Math.random() * 2 * Math.PI;
    const targetAngle = currentAngle + extraSpins + randomOffset;
    const duration = 3000;
    const start = performance.now();
    const initial = currentAngle;

    function animateSpin(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentAngle = initial + (targetAngle - initial) * easeOut;
      drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        spinning = false;
        const normalized = (2 * Math.PI - ((currentAngle + Math.PI / 2) % (2 * Math.PI))) % (2 * Math.PI);
        const winningIndex = Math.floor(normalized / arc) % prizes.length;
        document.getElementById("voucher-prize").textContent = prizes[winningIndex];
        document.getElementById("voucher-card").classList.remove("hidden");
        if (typeof confetti === "function") confetti({ particleCount: 70, spread: 60 });
      }
    }

    requestAnimationFrame(animateSpin);
  });
}

/* =========================================================
   7. SECRET VAULT UNLOCK
   ========================================================= */
function initSecretVault() {
  const unlockBtn = document.getElementById("unlock-btn");
  const input = document.getElementById("vault-input");
  const errorMsg = document.getElementById("vault-error");

  unlockBtn.addEventListener("click", () => {
    if (input.value.trim() === appConfig.vaultCode) {
      document.getElementById("vault-locked").classList.add("hidden");
      document.getElementById("vault-unlocked").classList.remove("hidden");
      if (typeof confetti === "function") confetti({ particleCount: 120, spread: 80 });
    } else {
      errorMsg.classList.remove("hidden");
    }
  });
}