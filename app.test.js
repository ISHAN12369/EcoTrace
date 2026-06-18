/**
 * @jest-environment jsdom
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Mock Canvas context for JSDOM
HTMLCanvasElement.prototype.getContext = () => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
  createImageData: jest.fn(),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  closePath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  rect: jest.fn(),
  arc: jest.fn(),
  fillText: jest.fn(),
  measureText: jest.fn().mockReturnValue({ width: 0 }),
  scale: jest.fn(),
  rotate: jest.fn(),
  translate: jest.fn(),
  transform: jest.fn(),
  createLinearGradient: jest.fn().mockReturnValue({ addColorStop: jest.fn() }),
  createRadialGradient: jest.fn().mockReturnValue({ addColorStop: jest.fn() }),
  createPattern: jest.fn()
});

// Mock Chart.js
global.Chart = jest.fn().mockImplementation(() => ({
  destroy: jest.fn(),
  update: jest.fn()
}));

// Mock Three.js
global.THREE = {
  Scene: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn()
  })),
  PerspectiveCamera: jest.fn(),
  OrthographicCamera: jest.fn(),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    shadowMap: {},
    render: jest.fn(),
    domElement: document.createElement('canvas')
  })),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn(),
  Group: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    position: { set: jest.fn() },
    rotation: { set: jest.fn() }
  })),
  CylinderGeometry: jest.fn(),
  MeshStandardMaterial: jest.fn(),
  Mesh: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    rotation: { set: jest.fn() },
    add: jest.fn()
  })),
  BoxGeometry: jest.fn(),
  ConeGeometry: jest.fn(),
  RingGeometry: jest.fn(),
  MeshBasicMaterial: jest.fn(),
  DoubleSide: 'DoubleSide',
  PCFSoftShadowMap: 'PCFSoftShadowMap'
};

// Load HTML content into virtual DOM before importing app.js
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let app;

describe('EcoTrace App Unit Tests', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    localStorage.clear();
    jest.resetModules();
    
    // Require app.js to instantiate the state and run the tests on DOM load
    app = require('./app.js');
  });

  test('Utility: sanitize escapes HTML', () => {
    const dirty = '<script>alert("xss")</script>';
    const clean = app.sanitize(dirty);
    expect(clean).toContain('&lt;script&gt;alert("xss")&lt;/script&gt;');
  });

  test('Utility: formatSaved formats grams and kilograms correctly', () => {
    expect(app.formatSaved(500)).toBe('500 g');
    expect(app.formatSaved(1000)).toBe('1.0 kg');
    expect(app.formatSaved(2500)).toBe('2.5 kg');
  });

  test('Utility: todayKey returns YYYY-MM-DD format', () => {
    const key = app.todayKey();
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(key.length).toBe(10);
  });

  test('Utility: dayName returns short weekday name', () => {
    expect(app.dayName('2026-06-18')).toBe('Thu');
    expect(app.dayName('2026-06-19')).toBe('Fri');
  });

  test('Utility: formatDate formats date string correctly', () => {
    expect(app.formatDate('2026-06-18')).toBe('Thursday, June 18');
  });

  test('Utility: getGreeting returns greeting matching time of day', () => {
    const greeting = app.getGreeting();
    expect(['good morning', 'good afternoon', 'good evening']).toContain(greeting);
  });

  test('Utility: getLast7Days returns list of 7 date strings', () => {
    const days = app.getLast7Days();
    expect(days.length).toBe(7);
    expect(days[6]).toBe(app.todayKey());
  });

  test('State: saveState and loadState work seamlessly', () => {
    app.state.onboarded = true;
    app.state.streak = 5;
    app.state.profile.distance = 99;
    app.saveState();
    
    // Clear in-memory state
    app.state.onboarded = false;
    app.state.streak = 0;
    app.state.profile.distance = 0;
    
    app.loadState();
    expect(app.state.onboarded).toBe(true);
    expect(app.state.streak).toBe(5);
    expect(app.state.profile.distance).toBe(99);
  });

  test('State: loadState handles corrupt JSON safely', () => {
    localStorage.setItem('ecotrace_state', '{invalid json}');
    expect(() => app.loadState()).not.toThrow();
  });

  test('State: loadState handles localStorage access block safely', () => {
    const origGet = localStorage.getItem;
    localStorage.getItem = jest.fn(() => { throw new Error('Blocked localStorage'); });
    expect(() => app.loadState()).not.toThrow();
    localStorage.getItem = origGet;
  });

  test('State: saveState handles localStorage write block safely', () => {
    const origSet = localStorage.setItem;
    localStorage.setItem = jest.fn(() => { throw new Error('Quota exceeded'); });
    expect(() => app.saveState()).not.toThrow();
    localStorage.setItem = origSet;
  });

  test('Calculator: calculateFootprint calculates values properly', () => {
    app.state.profile = {
      transport: 'car',
      distance: 100,
      diet: 'heavy_meat',
      electricity: 200,
      shopping: 'high'
    };
    app.calculateFootprint();
    const f = app.state.footprint;
    
    // transport: 100 * 0.171 * 4.33 = 74.043 -> round to 74
    expect(f.transport).toBe(74);
    // diet: heavy_meat -> 220
    expect(f.diet).toBe(220);
    // electricity: 200 * 0.82 = 164
    expect(f.electricity).toBe(164);
    // shopping: high -> 120
    expect(f.shopping).toBe(120);
    // total: 74 + 220 + 164 + 120 = 578
    expect(f.total).toBe(578);
  });

  test('Calculator: calculateFootprint handles edge case with walk/cycle mode', () => {
    app.state.profile = {
      transport: 'walk',
      distance: 50,
      diet: 'vegan',
      electricity: 0,
      shopping: 'zero'
    };
    app.calculateFootprint();
    const f = app.state.footprint;
    
    expect(f.transport).toBe(0);
    expect(f.diet).toBe(70);
    expect(f.electricity).toBe(0);
    expect(f.shopping).toBe(8);
    expect(f.total).toBe(78);
  });

  test('Habits: toggleAction adds action savings to state and UI', () => {
    const today = app.todayKey();
    expect(app.getTodaySaved()).toBe(0);
    
    app.toggleAction('skip_meat');
    expect(app.state.actions[today]['skip_meat']).toBe(true);
    expect(app.getTodaySaved()).toBe(2500);
    
    app.toggleAction('skip_meat'); // Toggle off
    expect(app.state.actions[today]['skip_meat']).toBeUndefined();
    expect(app.getTodaySaved()).toBe(0);
  });

  test('Habits: getAllTimeSaved sums actions across multiple days', () => {
    app.state.actions = {
      '2026-06-17': { skip_meat: true, short_shower: true },
      '2026-06-18': { no_plastic: true }
    };
    // skip_meat = 2500, short_shower = 500, no_plastic = 100
    // total = 3100
    expect(app.getAllTimeSaved()).toBe(3100);
  });

  test('Leaderboard: getUserScore, getUserRank, and getLeaderboardWithUser calculate rank properly', () => {
    app.state.actions = {
      '2026-06-18': { skip_meat: true, air_dry: true, walk_bike: true } // 2500 + 2400 + 2200 = 7100
    };
    const score = app.getUserScore();
    expect(score).toBe(7100);
    
    const rank = app.getUserRank();
    expect(rank).toBeGreaterThan(0);
    expect(rank).toBeLessThanOrEqual(app.MOCK_USERS.length + 1);
    
    const leaderboard = app.getLeaderboardWithUser();
    expect(leaderboard.length).toBe(app.MOCK_USERS.length + 1);
    expect(leaderboard.find(u => u.isUser).score).toBe(7100);
  });

  test('Onboarding: beginOnboarding, quizNext, quizPrev navigates slides', () => {
    app.beginOnboarding();
    const steps = document.querySelectorAll('.quiz-step');
    expect(steps[0].classList.contains('active')).toBe(true);
    
    app.quizNext();
    expect(steps[1].classList.contains('active')).toBe(true);
    
    app.quizPrev();
    expect(steps[0].classList.contains('active')).toBe(true);
  });

  test('Onboarding: selectOption updates state profile', () => {
    app.beginOnboarding();
    const mockBtn = document.createElement('button');
    mockBtn.dataset.q = 'transport';
    mockBtn.dataset.v = 'bike';
    const parent = document.createElement('div');
    parent.appendChild(mockBtn);
    
    const siblingBtn = document.createElement('button');
    siblingBtn.className = 'option-btn';
    parent.appendChild(siblingBtn);
    
    app.selectOption(mockBtn);
    expect(app.state.profile.transport).toBe('bike');
    expect(mockBtn.classList.contains('selected')).toBe(true);
    expect(siblingBtn.classList.contains('selected')).toBe(false);
  });

  test('Onboarding: finishOnboarding sets onboarded and displays dashboard', () => {
    app.beginOnboarding();
    app.finishOnboarding();
    
    expect(app.state.onboarded).toBe(true);
    expect(app.state.streak).toBe(1);
    
    const appEl = document.getElementById('app');
    expect(appEl.classList.contains('visible')).toBe(true);
  });

  test('UI Tabs: switchTab switches screen views', () => {
    const tabBtn = document.createElement('button');
    tabBtn.dataset.screen = 'insights';
    
    app.switchTab(tabBtn);
    
    const insightsScreen = document.getElementById('screen-insights');
    expect(insightsScreen.classList.contains('active')).toBe(true);
    
    const homeScreen = document.getElementById('screen-home');
    expect(homeScreen.classList.contains('active')).toBe(false);
  });

  test('Utility: runTests exits successfully without throwing', () => {
    expect(() => app.runTests()).not.toThrow();
  });
});
