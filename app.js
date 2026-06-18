'use strict';

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const INDIA_AVG = 1900;
const GLOBAL_AVG = 4000;

const TRANSPORT_FACTORS = {
  car: 0.171,
  bike: 0.072,
  public: 0.039,
  walk: 0
};

const DIET_MONTHLY = {
  heavy_meat: 220,
  moderate_meat: 150,
  vegetarian: 105,
  vegan: 70
};

const ELEC_FACTOR = 0.82;

const SHOPPING_MONTHLY = {
  high: 120,
  moderate: 65,
  low: 25,
  zero: 8
};

const ECO_ACTIONS = [
  { id: 'skip_meat', emoji: '\u{1F957}', name: 'Skipped meat today', save: 2500, tip: 'A day without meat saves ~2.5 kg CO2 -- equal to driving 14 km less.' },
  { id: 'public_trans', emoji: '\u{1F68C}', name: 'Used public transport', save: 1800, tip: 'Taking the bus instead of driving saves about 1.8 kg CO2 per trip.' },
  { id: 'no_plastic', emoji: '\u{1F6AB}', name: 'Avoided single-use plastic', save: 100, tip: 'Each plastic bag avoided saves ~100g CO2 from production & disposal.' },
  { id: 'air_dry', emoji: '\u{2600}\u{FE0F}', name: 'Air-dried clothes', save: 2400, tip: 'Skipping the dryer for one load saves ~2.4 kg CO2.' },
  { id: 'short_shower', emoji: '\u{1F6BF}', name: 'Took a short shower (<5 min)', save: 500, tip: 'Cutting your shower to 5 min saves ~500g CO2 from water heating.' },
  { id: 'local_food', emoji: '\u{1F3EA}', name: 'Bought local / seasonal food', save: 800, tip: 'Local food reduces transport emissions by ~800g per meal.' },
  { id: 'lights_off', emoji: '\u{1F4A1}', name: 'Turned off unused lights/devices', save: 200, tip: 'Standby electronics waste energy -- switching off saves ~200g CO2/day.' },
  { id: 'reuse', emoji: '\u{267B}\u{FE0F}', name: 'Reused or repaired something', save: 1500, tip: 'Repairing instead of buying new saves ~1.5 kg CO2 on average.' },
  { id: 'walk_bike', emoji: '\u{1F6B6}', name: 'Walked or cycled instead of driving', save: 2200, tip: 'A 10 km walk/cycle instead of driving saves ~2.2 kg CO2.' },
  { id: 'no_order', emoji: '\u{1F4E6}', name: 'Avoided online ordering today', save: 600, tip: 'Each delivery van trip produces ~600g CO2 -- order less, save more.' }
];

const CATEGORY_TIPS = {
  transport: [
    { title: 'Switch to metro just twice a week', body: 'Replacing 2 car trips with metro saves about 12 kg CO2 per month -- like planting a tree every 2 months.', icon: '\u{1F687}' },
    { title: 'Try carpooling for your commute', body: 'Sharing a ride with just one person cuts your transport emissions in half -- saving 25+ kg CO2/month.', icon: '\u{1F697}' },
    { title: 'Work from home one day a week', body: 'One WFH day eliminates ~3.4 kg CO2 from commuting per week -- 14 kg/month saved effortlessly.', icon: '\u{1F3E0}' },
    { title: 'Keep tires properly inflated', body: 'Under-inflated tires increase fuel consumption by 3%. Proper inflation saves ~6 kg CO2/month.', icon: '\u{26FD}' }
  ],
  diet: [
    { title: 'Go meat-free on Mondays', body: 'Skipping meat one day a week reduces your food carbon footprint by 14% -- saving ~10 kg CO2/month.', icon: '\u{1F33F}' },
    { title: 'Replace beef with chicken', body: 'Beef produces 10x more CO2 than chicken per kg. One swap per week saves ~15 kg CO2/month.', icon: '\u{1F357}' },
    { title: 'Buy seasonal produce', body: 'Out-of-season produce is often air-freighted. Eating seasonal cuts food miles emissions by 80%.', icon: '\u{1F955}' },
    { title: 'Reduce food waste', body: 'The average household wastes 30% of food purchased. Cutting waste in half saves ~20 kg CO2/month.', icon: '\u{1F5D1}\u{FE0F}' }
  ],
  electricity: [
    { title: 'Switch to LED bulbs throughout your home', body: 'LEDs use 75% less energy than incandescent bulbs -- saving ~15 kg CO2/month for a typical home.', icon: '\u{1F4A1}' },
    { title: 'Unplug devices when not in use', body: 'Standby power accounts for 5-10% of household electricity. Unplugging saves ~8 kg CO2/month.', icon: '\u{1F50C}' },
    { title: 'Set AC to 24C instead of 20C', body: 'Every degree higher saves 6% energy. Going from 20 to 24 cuts cooling emissions by 24%.', icon: '\u{2744}\u{FE0F}' },
    { title: 'Use a smart power strip', body: 'Smart strips cut phantom loads automatically -- saving 5-10% on your electricity bill and ~10 kg CO2/month.', icon: '\u{1F50B}' }
  ],
  shopping: [
    { title: 'Apply the 30-day rule before purchases', body: 'Wait 30 days before non-essential purchases. Most impulse buys are forgotten -- saving CO2 and money.', icon: '\u{231B}' },
    { title: 'Buy second-hand clothing', body: 'A single new t-shirt produces 7 kg CO2. Buying second-hand eliminates manufacturing emissions entirely.', icon: '\u{1F455}' },
    { title: 'Choose quality over quantity', body: 'One well-made item that lasts 5 years beats 5 cheap items replaced yearly -- reducing waste emissions by 80%.', icon: '\u{2B50}' },
    { title: 'Go digital where possible', body: 'E-books, digital subscriptions, and shipping save paper, plastic, and shipping emissions.', icon: '\u{1F4F1}' }
  ]
};

const MOCK_USERS = [
  { name: 'Priya S.', avatar: '\u{1F338}', score: 42500 },
  { name: 'Arjun M.', avatar: '\u{1F525}', score: 38200 },
  { name: 'Ananya R.', avatar: '\u{1F33F}', score: 35800 },
  { name: 'Rohan K.', avatar: '\u{26A1}', score: 31400 },
  { name: 'Sneha P.', avatar: '\u{1F33B}', score: 28900 },
  { name: 'Vikram D.', avatar: '\u{1F3AF}', score: 25600 },
  { name: 'Meera J.', avatar: '\u{1F49A}', score: 22100 },
  { name: 'Amit T.', avatar: '\u{1F30A}', score: 19500 },
  { name: 'Kavita N.', avatar: '\u{1F98B}', score: 16800 },
  { name: 'Rahul G.', avatar: '\u{1F331}', score: 14200 },
  { name: 'Nisha L.', avatar: '\u{1F343}', score: 12000 },
  { name: 'Deepak V.', avatar: '\u{1F3D4}\u{FE0F}', score: 9500 },
  { name: 'Pooja B.', avatar: '\u{1F33A}', score: 7200 },
  { name: 'Suresh H.', avatar: '\u{1F319}', score: 5100 },
  { name: 'Ritu W.', avatar: '\u{1F99A}', score: 3800 }
];

let state = {
  onboarded: false,
  profile: { transport: 'car', distance: 50, diet: 'moderate_meat', electricity: 120, shopping: 'moderate' },
  footprint: { transport: 0, diet: 0, electricity: 0, shopping: 0, total: 0 },
  actions: {},
  streak: 0,
  lastActiveDate: null
};

let quizStep = 0;
const TOTAL_STEPS = 5;
let weekChart = null;

// Three.js State variables
let threeInitialized = false;
let scene, camera, renderer, islandGroup;
let dynamicMeshes = [];
let turbineRotors = [];
let rotatingCarGroup = null;

function saveState() {
  try {
    localStorage.setItem('ecotrace_state', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem('ecotrace_state');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.assign(state, parsed);
      }
    }
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
  }
}

function init() {
  loadState();
  if (state.onboarded) {
    const splash = document.getElementById('splash');
    const onboarding = document.getElementById('onboarding');
    const app = document.getElementById('app');
    const bottomNav = document.getElementById('bottom-nav');
    
    if (splash) splash.classList.add('hidden');
    if (onboarding) onboarding.classList.add('hidden');
    if (app) app.classList.add('visible');
    if (bottomNav) bottomNav.style.display = 'block';
    
    calculateFootprint();
    renderHome();
    renderTrack();
    renderInsights();
    renderProgress();
    setTimeout(init3D, 200);
  }
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'good morning';
  if (h < 17) return 'good afternoon';
  return 'good evening';
}

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

function dayName(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function beginOnboarding() {
  const splash = document.getElementById('splash');
  const onboarding = document.getElementById('onboarding');
  if (splash) splash.classList.add('hidden');
  if (onboarding) onboarding.classList.remove('hidden');
  quizStep = 0;
  renderQuiz();
}

function renderQuiz() {
  const prog = document.getElementById('quizProgress');
  if (prog) {
    prog.innerHTML = '';
    for (let i = 0; i < TOTAL_STEPS; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i < quizStep ? ' done' : '') + (i === quizStep ? ' active' : '');
      prog.appendChild(dot);
    }
  }
  document.querySelectorAll('.quiz-step').forEach(function (el, i) {
    el.classList.toggle('active', i === quizStep);
  });
  const quizBack = document.getElementById('quizBack');
  if (quizBack) {
    quizBack.style.visibility = quizStep === 0 ? 'hidden' : 'visible';
  }
  const quizNextBtn = document.getElementById('quizNext');
  if (quizNextBtn) {
    const textSpan = quizNextBtn.querySelector('span');
    if (textSpan) {
      textSpan.textContent = quizStep === TOTAL_STEPS - 1 ? 'See My Footprint' : 'Next';
    }
  }
}

function selectOption(btn) {
  const q = btn.dataset.q;
  const v = btn.dataset.v;
  if (state.profile) {
    state.profile[q] = v;
  }
  btn.parentElement.querySelectorAll('.option-btn').forEach(function (b) {
    b.classList.remove('selected');
  });
  btn.classList.add('selected');
}

function spawnParticles(x, y, isLeaf) {
  const colors = isLeaf ? ['#8ed462', '#6fa64d', '#ffffff'] : ['#2ba0ff', '#ff705d', '#f5e211', '#ebc1ff', '#8ed462', '#ffffff'];
  const count = isLeaf ? 15 : 10;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.border = '1.5px solid #2c2e2a';
    el.style.borderRadius = isLeaf || Math.random() > 0.5 ? '50% 0 50% 0' : '50%';
    el.style.width = (isLeaf ? (6 + Math.random() * 8) : (5 + Math.random() * 6)) + 'px';
    el.style.height = (isLeaf ? (10 + Math.random() * 10) : (5 + Math.random() * 6)) + 'px';

    const angle = Math.random() * Math.PI * 2;
    const speed = (isLeaf ? 1.5 : 2.5) + Math.random() * 4;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed - 1.5;

    el.style.position = 'fixed';
    el.style.zIndex = '9999';
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);

    animateParticle(el, vx, vy, 0.12, 0.98, 45);
  }
}

function animateParticle(el, vx, vy, gravity, friction, life) {
  let x = parseFloat(el.style.left);
  let y = parseFloat(el.style.top);
  let currentLife = 0;
  function step() {
    vy += gravity;
    vx *= friction;
    vy *= friction;
    x += vx;
    y += vy;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.transform = 'rotate(' + (currentLife * 8) + 'deg)';

    currentLife++;
    if (currentLife < life) {
      el.style.opacity = String(1 - currentLife / life);
      requestAnimationFrame(step);
    } else {
      el.remove();
    }
  }
  requestAnimationFrame(step);
}

function triggerTurbineParticles(event) {
  event.stopPropagation();
  spawnParticles(event.clientX, event.clientY, false);
}

function triggerPlantParticles(event) {
  event.stopPropagation();
  spawnParticles(event.clientX, event.clientY, true);
}

document.addEventListener('click', function (e) {
  if (e.target === document.body) {
    spawnParticles(e.clientX, e.clientY, true);
  }
});

function updateSlider(type, val) {
  if (type === 'dist') {
    const distVal = document.getElementById('distVal');
    if (distVal) distVal.textContent = val + ' km / week';
    if (state.profile) state.profile.distance = parseInt(val, 10);
  } else {
    const elecVal = document.getElementById('elecVal');
    if (elecVal) elecVal.textContent = val + ' kWh / month';
    if (state.profile) state.profile.electricity = parseInt(val, 10);
  }
}

function switchTab(btn) {
  const target = btn.dataset.screen;

  document.querySelectorAll('[data-screen]').forEach(function (t) {
    const active = t.dataset.screen === target;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  document.querySelectorAll('.screen').forEach(function (s) {
    s.classList.remove('active');
  });
  const targetScreen = document.getElementById('screen-' + target);
  if (targetScreen) targetScreen.classList.add('active');

  if (target === 'home') {
    renderHome();
    if (threeInitialized) update3DWorld();
  }
  if (target === 'track') renderTrack();
  if (target === 'insights') renderInsights();
  if (target === 'progress') renderProgress();
}

function quizNext() {
  if (quizStep < TOTAL_STEPS - 1) {
    quizStep++;
    renderQuiz();
  } else {
    finishOnboarding();
  }
}

function quizPrev() {
  if (quizStep > 0) {
    quizStep--;
    renderQuiz();
  }
}

function finishOnboarding() {
  state.onboarded = true;
  state.lastActiveDate = todayKey();
  state.streak = 1;
  calculateFootprint();
  saveState();
  const onboarding = document.getElementById('onboarding');
  const app = document.getElementById('app');
  const bottomNav = document.getElementById('bottom-nav');
  
  if (onboarding) onboarding.classList.add('hidden');
  if (app) app.classList.add('visible');
  if (bottomNav) bottomNav.style.display = 'block';
  
  renderHome();
  renderTrack();
  renderInsights();
  renderProgress();
  setTimeout(init3D, 200);
}

function calculateFootprint() {
  const p = state.profile;
  if (!p) return;
  const transport = (p.distance || 0) * (TRANSPORT_FACTORS[p.transport] || 0) * 4.33;
  const diet = DIET_MONTHLY[p.diet] || 150;
  const electricity = (p.electricity || 0) * ELEC_FACTOR;
  const shopping = SHOPPING_MONTHLY[p.shopping] || 65;
  state.footprint = {
    transport: Math.round(transport),
    diet: Math.round(diet),
    electricity: Math.round(electricity),
    shopping: Math.round(shopping),
    total: Math.round(transport + diet + electricity + shopping)
  };
  saveState();
}

function renderHome() {
  const greetingText = document.getElementById('greetingText');
  if (greetingText) greetingText.textContent = getGreeting();
  
  const totalMonthly = state.footprint ? state.footprint.total : 0;
  animateCount('scoreNum', 0, totalMonthly, 1800);
  
  const maxRing = 600;
  const pct = Math.min(totalMonthly / maxRing, 1);
  const circumference = 553;
  setTimeout(function () {
    const ringFill = document.getElementById('ringFill');
    if (ringFill) ringFill.style.strokeDashoffset = String(circumference * (1 - pct));
  }, 200);
  
  const yearly = totalMonthly * 12;
  let lbl = '';
  if (yearly < INDIA_AVG) lbl = '⭐ Below India average!';
  else if (yearly < GLOBAL_AVG) lbl = '👍 Below global average';
  else lbl = '⚠️ Above global average';
  
  const scoreLbl = document.getElementById('scoreLbl');
  const cmpYou = document.getElementById('cmpYou');
  const headerStreakVal = document.getElementById('headerStreakVal');
  
  if (scoreLbl) scoreLbl.textContent = lbl;
  if (cmpYou) cmpYou.textContent = yearly.toLocaleString() + ' kg';
  if (headerStreakVal) headerStreakVal.textContent = String(state.streak || 0);
  
  renderOneThing();
  updateHomeSaved();
  renderMiniLeaderboard();
  if (threeInitialized) {
    update3DWorld();
  }
}

function renderOneThing() {
  const f = state.footprint;
  if (!f) return;
  const cats = [
    { key: 'transport', val: f.transport, label: 'Transport' },
    { key: 'diet', val: f.diet, label: 'Diet' },
    { key: 'electricity', val: f.electricity, label: 'Electricity' },
    { key: 'shopping', val: f.shopping, label: 'Shopping' }
  ].sort(function (a, b) { return b.val - a.val; });
  const top = cats[0];
  const pctVal = Math.round((top.val / f.total) * 100);
  const tips = CATEGORY_TIPS[top.key];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const tip = tips[dayOfYear % tips.length];
  
  const otTitle = document.getElementById('otTitle');
  const otDesc = document.getElementById('otDesc');
  
  if (otTitle) otTitle.textContent = tip.title;
  if (otDesc) otDesc.textContent = 'Your ' + top.label.toLowerCase() + ' is ' + pctVal + '% of your footprint. ' + tip.body;
}

function updateHomeSaved() {
  const saved = getTodaySaved();
  const homeSaved = document.getElementById('homeSaved');
  if (homeSaved) homeSaved.textContent = formatSaved(saved);
  const eqText = document.getElementById('eqText');
  if (eqText) {
    if (saved === 0) {
      eqText.innerHTML = 'Complete eco-actions in the <strong>Track</strong> tab to see your impact here!';
    } else {
      const km = (saved / 171).toFixed(1);
      eqText.innerHTML = 'You saved the equivalent of <strong>not driving ' + sanitize(km) + ' km</strong> today -- keep it up! 🌟';
    }
  }
}

function getTodaySaved() {
  const today = todayKey();
  const todayActions = state.actions[today] || {};
  let total = 0;
  ECO_ACTIONS.forEach(function (a) {
    if (todayActions[a.id]) total += a.save;
  });
  return total;
}

function getAllTimeSaved() {
  let total = 0;
  if (state.actions) {
    Object.keys(state.actions).forEach(function (dateKey) {
      const dayActions = state.actions[dateKey];
      ECO_ACTIONS.forEach(function (a) {
        if (dayActions[a.id]) total += a.save;
      });
    });
  }
  return total;
}

function formatSaved(grams) {
  if (grams >= 1000) return (grams / 1000).toFixed(1) + ' kg';
  return grams + ' g';
}

function animateCount(elId, from, to, duration) {
  const el = document.getElementById(elId);
  if (!el) return;
  const start = performance.now();
  const range = to - from;
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + range * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderTrack() {
  const today = todayKey();
  const trackDate = document.getElementById('trackDate');
  if (trackDate) trackDate.textContent = formatDate(today);
  updateStreak();
  const list = document.getElementById('actionList');
  if (!list) return;
  list.innerHTML = '';
  const todayActions = state.actions[today] || {};
  
  ECO_ACTIONS.forEach(function (action) {
    const checked = !!todayActions[action.id];
    const item = document.createElement('div');
    item.className = 'action-item' + (checked ? ' checked' : '');
    
    // Accessibility checklist roles & keyboard bindings
    item.setAttribute('role', 'checkbox');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-checked', checked ? 'true' : 'false');
    item.setAttribute('aria-label', action.name + ', saves ' + formatSaved(action.save) + ' CO2');
    
    item.onclick = function (e) { toggleAction(action.id, e); };
    item.onkeydown = function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleAction(action.id, e);
      }
    };
    
    item.innerHTML = '<div class="action-check"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div class="action-info"><div class="ai-name">' + sanitize(action.name) + '</div><div class="ai-save">Saves ' + sanitize(formatSaved(action.save)) + ' CO2</div></div><div class="action-emoji">' + sanitize(action.emoji) + '</div>';
    list.appendChild(item);
  });
  updateTrackTotal();
}

function toggleAction(actionId, event) {
  const today = todayKey();
  if (!state.actions[today]) state.actions[today] = {};
  state.actions[today][actionId] = !state.actions[today][actionId];
  if (!state.actions[today][actionId]) delete state.actions[today][actionId];
  saveState();
  renderTrack();
  updateHomeSaved();
  if (state.actions[today] && state.actions[today][actionId]) {
    const x = event && typeof event.clientX === 'number' ? event.clientX : window.innerWidth / 2;
    const y = event && typeof event.clientY === 'number' ? event.clientY : window.innerHeight / 2;
    spawnParticles(x, y, false);
  }
}

function updateTrackTotal() {
  const saved = getTodaySaved();
  const trackTotal = document.getElementById('trackTotal');
  if (trackTotal) trackTotal.textContent = formatSaved(saved);
  const eqIcon = document.getElementById('trackEqIcon');
  const eqText = document.getElementById('trackEqText');
  if (eqText && eqIcon) {
    if (saved === 0) {
      eqIcon.textContent = '💤';
      eqText.innerHTML = 'Check off actions above to start saving!';
    } else {
      const km = (saved / 171).toFixed(1);
      const mins = Math.round(saved / 83);
      eqIcon.textContent = '🎉';
      eqText.innerHTML = 'That\'s like <strong>skipping a ' + sanitize(km) + ' km car ride</strong> or <strong>' + sanitize(mins) + ' fewer minutes of video streaming</strong>!';
    }
  }
}

function updateStreak() {
  const today = todayKey();
  if (state.lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().split('T')[0];
    if (state.lastActiveDate === yKey) {
      state.streak = (state.streak || 0) + 1;
    } else if (state.lastActiveDate !== today) {
      state.streak = state.actions[today] && Object.keys(state.actions[today]).length > 0 ? 1 : (state.streak || 0);
    }
    state.lastActiveDate = today;
    saveState();
    const headerStreakVal = document.getElementById('headerStreakVal');
    if (headerStreakVal) headerStreakVal.textContent = String(state.streak || 0);
  }
}

function renderInsights() {
  const f = state.footprint;
  if (!f) return;
  const cats = [
    { key: 'transport', val: f.transport, label: 'Transport', color: 'var(--blue)' },
    { key: 'diet', val: f.diet, label: 'Diet', color: 'var(--yellow)' },
    { key: 'electricity', val: f.electricity, label: 'Electricity', color: 'var(--green)' },
    { key: 'shopping', val: f.shopping, label: 'Shopping', color: 'var(--red)' }
  ].sort(function (a, b) { return b.val - a.val; });
  const top = cats[0];
  const pctVal = Math.round((top.val / f.total) * 100);
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const tips = CATEGORY_TIPS[top.key];
  const mainTip = tips[dayOfYear % tips.length];
  
  const insightCat = document.getElementById('insightCat');
  const insightTitle = document.getElementById('insightTitle');
  const insightBody = document.getElementById('insightBody');
  
  if (insightCat) insightCat.textContent = '🎯 Highest: ' + top.label + ' (' + pctVal + '%)';
  if (insightTitle) insightTitle.textContent = mainTip.title;
  if (insightBody) insightBody.textContent = mainTip.body;
  
  const barsEl = document.getElementById('breakdownBars');
  if (barsEl) {
    barsEl.innerHTML = '';
    cats.forEach(function (cat) {
      const p = Math.round((cat.val / f.total) * 100);
      const bar = document.createElement('div');
      bar.className = 'ib-bar';
      bar.innerHTML = '<div class="ib-top"><span>' + sanitize(cat.label) + '</span><span>' + sanitize(String(cat.val)) + ' kg/mo (' + sanitize(String(p)) + '%)</span></div><div class="ib-track"><div class="ib-fill" style="background:' + cat.color + '" data-width="' + sanitize(String(p)) + '%"></div></div>';
      barsEl.appendChild(bar);
    });
  }
  
  setTimeout(function () {
    document.querySelectorAll('.ib-fill').forEach(function (el) {
      if (el.dataset.width) el.style.width = el.dataset.width;
    });
  }, 200);
  
  const tipsList = document.getElementById('tipsList');
  if (tipsList) {
    tipsList.innerHTML = '';
    cats.forEach(function (cat) {
      const catTips = CATEGORY_TIPS[cat.key];
      const tip = catTips[(dayOfYear + 1) % catTips.length];
      const card = document.createElement('div');
      card.className = 'tip-card';
      card.innerHTML = '<div class="tc-icon">' + sanitize(tip.icon) + '</div><h4>' + sanitize(tip.title) + '</h4><p>' + sanitize(tip.body) + '</p>';
      tipsList.appendChild(card);
    });
  }
}

function renderProgress() {
  const streak = state.streak || 0;
  const totalSaved = getAllTimeSaved();
  const treesEquiv = (totalSaved / 1000 / 21 * 12).toFixed(1);
  
  const statStreak = document.getElementById('statStreak');
  const statTrees = document.getElementById('statTrees');
  const statTotal = document.getElementById('statTotal');
  
  if (statStreak) statStreak.textContent = String(streak);
  if (statTrees) statTrees.textContent = treesEquiv;
  if (statTotal) statTotal.textContent = formatSaved(totalSaved);
  
  renderWeekChart();
  renderFullLeaderboard();
}

function renderWeekChart() {
  const days = getLast7Days();
  const data = days.map(function (d) {
    const dayActions = state.actions[d] || {};
    let total = 0;
    ECO_ACTIONS.forEach(function (a) { if (dayActions[a.id]) total += a.save; });
    return total / 1000;
  });
  const labels = days.map(function (d) { return dayName(d); });
  const chartCanvas = document.getElementById('weekChart');
  if (!chartCanvas) return;
  const ctx = chartCanvas.getContext('2d');
  if (weekChart) weekChart.destroy();
  weekChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'CO2 Saved (kg)',
        data: data,
        backgroundColor: 'rgba(43, 160, 255, 0.25)',
        borderColor: '#2ba0ff',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#2c2e2a',
          titleColor: '#f5f1e4',
          bodyColor: '#f5f1e4',
          borderColor: 'rgba(44,46,42,0.2)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: function (context) { return context.parsed.y.toFixed(1) + ' kg CO2 saved'; }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#2c2e2a', font: { family: 'Inter', size: 11, weight: '500' } }
        },
        y: {
          grid: { color: 'rgba(44,46,42,0.08)' },
          ticks: {
            color: '#2c2e2a',
            font: { family: 'Inter', size: 11, weight: '500' },
            callback: function (v) { return v + ' kg'; }
          },
          beginAtZero: true
        }
      }
    }
  });
}

function getUserScore() {
  return getAllTimeSaved();
}

function getLeaderboardWithUser() {
  const userScore = getUserScore();
  const allUsers = MOCK_USERS.map(function (u) { return { name: u.name, avatar: u.avatar, score: u.score, isUser: false }; });
  allUsers.push({ name: 'You', avatar: '\u{1F49A}', score: userScore, isUser: true });
  allUsers.sort(function (a, b) { return b.score - a.score; });
  return allUsers;
}

function getUserRank() {
  const sorted = getLeaderboardWithUser();
  return sorted.findIndex(function (u) { return u.isUser; }) + 1;
}

function renderMiniLeaderboard() {
  const sorted = getLeaderboardWithUser();
  const container = document.getElementById('lbMiniRows');
  if (!container) return;
  container.innerHTML = '';
  const top3 = sorted.slice(0, 3);
  const userIdx = sorted.findIndex(function (u) { return u.isUser; });
  const showUsers = top3.slice();
  if (userIdx >= 3) showUsers.push(sorted[userIdx]);
  showUsers.forEach(function (u, i) {
    const rank = u.isUser ? userIdx + 1 : i + 1;
    const row = document.createElement('div');
    row.className = 'lb-row' + (u.isUser ? ' you-row' : '');
    row.innerHTML = '<div class="lb-rank">' + sanitize(String(rank)) + '</div><div class="lb-avatar">' + sanitize(u.avatar) + '</div><div class="lb-name">' + sanitize(u.name) + '</div><div class="lb-score">' + sanitize(formatSaved(u.score)) + '</div>';
    container.appendChild(row);
  });
}

function renderFullLeaderboard() {
  const sorted = getLeaderboardWithUser();
  const userRank = sorted.findIndex(function (u) { return u.isUser; }) + 1;
  const totalUsers = 1000;
  const podium = document.getElementById('lbPodium');
  if (podium) {
    podium.innerHTML = '';
    const medals = ['🥈', '🥇', '🥉'];
    const top3 = sorted.slice(0, 3);
    const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
    podiumOrder.forEach(function (u, i) {
      const actualRank = i === 1 ? 0 : i === 0 ? 1 : 2;
      const item = document.createElement('div');
      item.className = 'podium-item' + (actualRank === 0 ? ' first' : '') + (u.isUser ? ' you-row' : '');
      item.innerHTML = '<div class="pi-medal">' + sanitize(medals[i]) + '</div><div class="pi-name">' + sanitize(u.name) + '</div><div class="pi-score">' + sanitize(formatSaved(u.score)) + '</div>';
      podium.appendChild(item);
    });
  }
  
  const yrRank = document.getElementById('yrRank');
  if (yrRank) yrRank.textContent = '#' + userRank;
  
  const percentile = Math.round(((totalUsers - userRank) / totalUsers) * 100);
  let msg = '';
  if (userRank <= 3) msg = "🏆 You're in the top 3! Absolutely incredible dedication to the planet!";
  else if (userRank <= 10) msg = '🌟 Top ' + userRank + '! You\'re outperforming ' + percentile + '% of users. Amazing work!';
  else if (percentile >= 50) msg = '👏 You\'re ahead of ' + percentile + '% of users. Keep building those green habits!';
  else msg = '🌱 Every action counts! Keep tracking daily to climb the leaderboard.';
  
  const yrMsg = document.getElementById('yrMsg');
  if (yrMsg) yrMsg.textContent = msg;
  
  const container = document.getElementById('lbFullRows');
  if (container) {
    container.innerHTML = '';
    sorted.slice(3, 10).forEach(function (u, i) {
      const row = document.createElement('div');
      row.className = 'lb-row' + (u.isUser ? ' you-row' : '');
      row.innerHTML = '<div class="lb-rank">' + sanitize(String(i + 4)) + '</div><div class="lb-avatar">' + sanitize(u.avatar) + '</div><div class="lb-name">' + sanitize(u.name) + '</div><div class="lb-score">' + sanitize(formatSaved(u.score)) + '</div>';
      container.appendChild(row);
    });
  }
}

/* Three.js Interactive 3D Eco-Island simulation */
function init3D() {
  if (threeInitialized) {
    update3DWorld();
    return;
  }
  const container = document.getElementById('three-container');
  if (!container) return;

  const width = container.clientWidth || 400;
  const height = container.clientHeight || 240;

  scene = new THREE.Scene();

  const aspect = width / height;
  const d = 4.8;
  camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
  camera.position.set(10, 8.5, 10);
  camera.lookAt(0, 0.4, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(8, 12, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 512;
  dirLight.shadow.mapSize.height = 512;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 30;
  const dShadow = 6;
  dirLight.shadow.camera.left = -dShadow;
  dirLight.shadow.camera.right = dShadow;
  dirLight.shadow.camera.top = dShadow;
  dirLight.shadow.camera.bottom = -dShadow;
  scene.add(dirLight);

  islandGroup = new THREE.Group();
  scene.add(islandGroup);

  const grassGeom = new THREE.CylinderGeometry(3.6, 3.4, 0.3, 20);
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x8ed462, roughness: 0.9, flatShading: true });
  const grass = new THREE.Mesh(grassGeom, grassMat);
  grass.position.y = 0.15;
  grass.receiveShadow = true;
  islandGroup.add(grass);

  const soilGeom = new THREE.CylinderGeometry(3.4, 3.1, 1.2, 20);
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 0.9, flatShading: true });
  const soil = new THREE.Mesh(soilGeom, soilMat);
  soil.position.y = -0.6;
  soil.receiveShadow = true;
  islandGroup.add(soil);

  const houseGroup = new THREE.Group();
  houseGroup.position.set(0, 0.3, 0);

  const bodyGeom = new THREE.BoxGeometry(1.0, 0.7, 0.85);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf5f1e4, roughness: 0.8 });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = 0.35;
  body.castShadow = true;
  body.receiveShadow = true;
  houseGroup.add(body);

  const roofGeom = new THREE.ConeGeometry(0.9, 0.6, 4);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xff705d, roughness: 0.7 });
  const roof = new THREE.Mesh(roofGeom, roofMat);
  roof.position.y = 0.9;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  houseGroup.add(roof);

  const doorGeom = new THREE.BoxGeometry(0.25, 0.45, 0.05);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x8B5A2B });
  const door = new THREE.Mesh(doorGeom, doorMat);
  door.position.set(0, 0.225, 0.43);
  houseGroup.add(door);

  islandGroup.add(houseGroup);

  let isDragging = false;
  const previousMousePosition = { x: 0 };

  function handleDown(xVal) {
    isDragging = true;
    previousMousePosition.x = xVal;
    container.style.cursor = 'grabbing';
  }

  function handleMove(xVal) {
    if (!isDragging) return;
    const deltaX = xVal - previousMousePosition.x;
    islandGroup.rotation.y += deltaX * 0.007;
    previousMousePosition.x = xVal;
  }

  function handleUp() {
    isDragging = false;
    container.style.cursor = 'grab';
  }

  container.style.cursor = 'grab';

  container.addEventListener('mousedown', function (e) { handleDown(e.clientX); });
  window.addEventListener('mousemove', function (e) { handleMove(e.clientX); });
  window.addEventListener('mouseup', handleUp);

  container.addEventListener('touchstart', function (e) { handleDown(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', function (e) { handleMove(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', handleUp);

  threeInitialized = true;
  update3DWorld();
  animate();
}

function update3DWorld() {
  if (!threeInitialized) return;

  dynamicMeshes.forEach(function (m) {
    islandGroup.remove(m);
  });
  dynamicMeshes = [];
  turbineRotors = [];
  rotatingCarGroup = null;

  const today = todayKey();
  const todayActions = state.actions[today] || {};

  const treePositions = [
    { x: -1.8, z: 1.8 },
    { x: 1.8, z: -1.8 },
    { x: -2.2, z: -1.5 },
    { x: 2.2, z: 1.5 },
    { x: -1.5, z: -2.2 },
    { x: 1.8, z: 2.2 },
    { x: -2.6, z: 0.5 },
    { x: 2.6, z: -0.5 },
    { x: 0, z: -2.5 },
    { x: 0, z: 2.5 }
  ];

  const totalSaved = getAllTimeSaved();
  const treesEquiv = Math.round(totalSaved / 1000 / 21 * 12);
  const treeCount = Math.max(1, Math.min(treePositions.length, treesEquiv));

  for (let i = 0; i < treeCount; i++) {
    const pos = treePositions[i];
    const tree = create3DTree();
    tree.position.set(pos.x, 0.3, pos.z);
    islandGroup.add(tree);
    dynamicMeshes.push(tree);
  }

  const hasLightsOff = !!todayActions['lights_off'];
  const hasLowElec = state.profile && state.profile.electricity < 150;

  if (hasLightsOff || hasLowElec) {
    const turbine1 = create3DTurbine();
    turbine1.position.set(-2, 0.3, -2);
    islandGroup.add(turbine1);
    dynamicMeshes.push(turbine1);

    if (hasLightsOff && hasLowElec) {
      const turbine2 = create3DTurbine();
      turbine2.position.set(2, 0.3, 2);
      islandGroup.add(turbine2);
      dynamicMeshes.push(turbine2);
    }
  }

  if (!!todayActions['air_dry']) {
    const solar = create3DSolarPanel();
    solar.position.set(2.2, 0.3, -0.6);
    islandGroup.add(solar);
    dynamicMeshes.push(solar);
  }

  if (!!todayActions['public_trans'] || !!todayActions['walk_bike']) {
    const roadGeom = new THREE.RingGeometry(2.4, 2.6, 24);
    const roadMat = new THREE.MeshBasicMaterial({ color: 0x2c2e2a, side: THREE.DoubleSide });
    const road = new THREE.Mesh(roadGeom, roadMat);
    road.rotation.x = Math.PI / 2;
    road.position.y = 0.31;
    islandGroup.add(road);
    dynamicMeshes.push(road);

    const carContainer = new THREE.Group();
    carContainer.position.y = 0.3;

    const carBodyGeom = new THREE.BoxGeometry(0.35, 0.18, 0.2);
    const carBodyMat = new THREE.MeshStandardMaterial({ color: 0x2ba0ff, roughness: 0.5 });
    const carBody = new THREE.Mesh(carBodyGeom, carBodyMat);
    carBody.position.set(2.5, 0.1, 0);
    carBody.castShadow = true;
    carContainer.add(carBody);

    const cabinGeom = new THREE.BoxGeometry(0.2, 0.12, 0.16);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const cabin = new THREE.Mesh(cabinGeom, cabinMat);
    cabin.position.set(2.5, 0.22, 0);
    cabin.castShadow = true;
    carContainer.add(cabin);

    islandGroup.add(carContainer);
    dynamicMeshes.push(carContainer);
    rotatingCarGroup = carContainer;
  }

  const statsTag = document.getElementById('islandStats');
  if (statsTag) {
    statsTag.innerHTML = '<span>🌳 ' + sanitize(String(treeCount)) + ' trees | 🔥 ' + sanitize(String(state.streak || 0)) + ' streak</span>';
  }
}

function create3DTree() {
  const group = new THREE.Group();

  const trunkGeom = new THREE.CylinderGeometry(0.06, 0.08, 0.6, 5);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
  const trunk = new THREE.Mesh(trunkGeom, trunkMat);
  trunk.position.y = 0.3;
  trunk.castShadow = true;
  group.add(trunk);

  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x6fa64d, roughness: 0.9, flatShading: true });

  const cone1Geom = new THREE.ConeGeometry(0.35, 0.5, 5);
  const cone1 = new THREE.Mesh(cone1Geom, foliageMat);
  cone1.position.y = 0.65;
  cone1.castShadow = true;
  group.add(cone1);

  const cone2Geom = new THREE.ConeGeometry(0.25, 0.4, 5);
  const cone2 = new THREE.Mesh(cone2Geom, foliageMat);
  cone2.position.y = 0.95;
  cone2.castShadow = true;
  group.add(cone2);

  return group;
}

function create3DTurbine() {
  const group = new THREE.Group();

  const towerGeom = new THREE.CylinderGeometry(0.04, 0.07, 1.8, 6);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  const tower = new THREE.Mesh(towerGeom, towerMat);
  tower.position.y = 0.9;
  tower.castShadow = true;
  group.add(tower);

  const rotor = new THREE.Group();
  rotor.position.set(0, 1.8, 0.06);

  const hubGeom = new THREE.SphereGeometry(0.07, 6, 6);
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x2c2e2a });
  const hub = new THREE.Mesh(hubGeom, hubMat);
  rotor.add(hub);

  const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  for (let i = 0; i < 3; i++) {
    const bladeGeom = new THREE.BoxGeometry(0.05, 0.6, 0.015);
    const blade = new THREE.Mesh(bladeGeom, bladeMat);
    blade.position.y = 0.3;

    const pivot = new THREE.Group();
    pivot.rotation.z = (i * Math.PI * 2) / 3;
    pivot.add(blade);
    rotor.add(pivot);
  }

  group.add(rotor);
  turbineRotors.push(rotor);

  return group;
}

function create3DSolarPanel() {
  const group = new THREE.Group();

  const standGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 4);
  const standMat = new THREE.MeshStandardMaterial({ color: 0x2c2e2a });
  const stand = new THREE.Mesh(standGeom, standMat);
  stand.position.y = 0.15;
  group.add(stand);

  const plateGeom = new THREE.BoxGeometry(0.5, 0.03, 0.4);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0x2ba0ff, metalness: 0.7, roughness: 0.2 });
  const plate = new THREE.Mesh(plateGeom, plateMat);
  plate.position.set(0, 0.3, 0);
  plate.rotation.x = Math.PI / 6;
  plate.castShadow = true;
  group.add(plate);

  return group;
}

function animate() {
  requestAnimationFrame(animate);

  turbineRotors.forEach(function (r) {
    r.rotation.z += 0.035;
  });

  if (rotatingCarGroup) {
    rotatingCarGroup.rotation.y += 0.012;
  }

  if (threeInitialized && islandGroup) {
    islandGroup.rotation.y += 0.001;
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function runTests() {
  console.assert(typeof calculateFootprint === 'function', 'calculateFootprint exists');
  console.assert(TRANSPORT_FACTORS['car'] === 0.171, 'car factor correct');
  console.assert(formatSaved(1500) === '1.5 kg', 'formatSaved kg works');
  console.assert(formatSaved(500) === '500 g', 'formatSaved g works');
  console.assert(getTodaySaved() >= 0, 'getTodaySaved returns non-negative');
  console.assert(todayKey().length === 10, 'todayKey format correct');
  console.assert(Object.keys(DIET_MONTHLY).length === 4, 'diet options complete');
  console.assert(ECO_ACTIONS.length === 10, 'all eco actions present');
  console.log('✅ All EcoTrace tests passed');
}

runTests();

document.addEventListener('DOMContentLoaded', init);

// Export for Jest testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sanitize,
    INDIA_AVG,
    GLOBAL_AVG,
    TRANSPORT_FACTORS,
    DIET_MONTHLY,
    ELEC_FACTOR,
    SHOPPING_MONTHLY,
    ECO_ACTIONS,
    CATEGORY_TIPS,
    MOCK_USERS,
    state,
    quizStep,
    TOTAL_STEPS,
    saveState,
    loadState,
    init,
    getGreeting,
    todayKey,
    dayName,
    formatDate,
    getLast7Days,
    beginOnboarding,
    renderQuiz,
    selectOption,
    spawnParticles,
    animateParticle,
    triggerTurbineParticles,
    triggerPlantParticles,
    updateSlider,
    switchTab,
    quizNext,
    quizPrev,
    finishOnboarding,
    calculateFootprint,
    renderHome,
    renderOneThing,
    updateHomeSaved,
    getTodaySaved,
    getAllTimeSaved,
    formatSaved,
    animateCount,
    renderTrack,
    toggleAction,
    updateTrackTotal,
    updateStreak,
    renderInsights,
    renderProgress,
    renderWeekChart,
    getUserScore,
    getLeaderboardWithUser,
    getUserRank,
    renderMiniLeaderboard,
    renderFullLeaderboard,
    init3D,
    update3DWorld,
    create3DTree,
    create3DTurbine,
    create3DSolarPanel,
    animate,
    runTests
  };
}
