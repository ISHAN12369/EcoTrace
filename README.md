# 🌍 EcoTrace — Personal Carbon Footprint Tracker

EcoTrace is a gorgeous, fully-featured, single-page carbon footprint tracker. It helps individuals understand, track, and reduce their carbon emissions through daily sustainable choices, smart custom insights, and a gamified **interactive 3D isometric Eco-Island**.

The user interface borrows the clean, bouncily animated, flat-vector aesthetic of [MindMarket](https://mindmarket.com/) (bold charcoal outlines, cream sheet overlays, and pastel capsules) and adapts seamlessly from mobile viewports to desktop split-column views.

---

## 🚀 Key Features

### 1. Carbon Footprint Calculator & Onboarding
* An onboarding flow with **5 interactive questions** assessing:
  1. Main daily commute transport (Car, Motorbike, Public Transit, walking/cycling)
  2. Weekly travel distance (using a slider)
  3. Primary diet composition (Heavy meat, Moderate meat, Vegetarian, Vegan)
  4. Monthly electricity usage in kWh (using a slider)
  5. General consumption and shopping habits (Shopaholic, Moderate, Minimal, Zero)
* Instantly computes a personalized monthly CO₂ score and presents comparison indicators mapping against the **India national average (1,900 kg/year)** and the **global average (4,000 kg/year)**.

### 2. Gamified 3D Eco-Island (Three.js)
* An isometric floating 3D Eco-Island built using **Three.js** that reacts dynamically to your green actions in real time:
  * **Click & Drag Rotation**: Click/drag on desktops or touch/drag on smartphones to spin the island around the Y-axis.
  * **Dynamic Trees**: The density of low-poly trees scales with your calculated tree equivalent savings.
  * **Action-Triggered Assets**:
    * **Wind Turbines**: Sprout and spin in real time when you turn off standby devices or maintain low electricity use.
    * **Solar Panels**: Pop up on stands when you choose to air-dry clothes instead of using tumble dryers.
    * **Electric Car**: Spawns and drives along a road loop surrounding the island when public transport or walking/cycling are toggled.

### 3. Daily Action Tracker
* A checklist of **10 pre-built daily eco-actions** (e.g. skipping meat, walking instead of driving, avoiding single-use plastics).
* Each checked action triggers a **physics-based green leaf particle splash** and instantly logs CO₂ savings in grams/kilograms.
* Highlights real-world equivalents (e.g., "equivalent to not driving 12 km" or "streaming 40 fewer minutes of video").

### 4. Interactive Insights & Charts
* A breakdown section displaying emissions categorized by transport, diet, electricity, and shopping.
* Custom, dynamically calculated AI-style recommendations based on your primary emission contributor, rotating daily.
* A clean **Chart.js** weekly bar graph visualizing carbon savings trended over the last 7 days.
* A community leaderboard highlighting user rank among 1,000 simulated users.

### 5. Premium MindMarket Design System
* **Curated Colors**: Vibrant green background (`#8ed462`), off-white panels (`#f5f1e4`), thick charcoal details (`#2c2e2a`), and bright pastel accents.
* **Animated Sheet Transitions**: Screens overlap and slide up with bouncy spring behaviors.
* **Fluid Physics Particles**: Emits dynamic spark/leaf trajectories with gravity, decay, and friction.
* **Responsive Desktop Layout**: Converts automatically from a bottom-navigation smartphone app to a multi-column desktop dashboard with margins decorated by interactive turbine/plant silhouettes.

---

## 🛠️ Technology Stack
* **Frontend Structure**: Semantic HTML5
* **Logic & Rendering**: Vanilla ES6 JavaScript (No bulky frameworks)
* **Design & Styling**: Pure CSS3 (Flexbox, Grid, custom animations)
* **3D Visualizer**: Three.js (via CDN)
* **Data Visualizer**: Chart.js (via CDN)

---

## 💻 Running the Project Locally

Since the project uses external CDNs and WebGL assets (Three.js), it is best to view it via a local web server to avoid browser CORS restrictions.

### Option A: Using Node.js (Recommended)
If you have Node.js installed, you can start a simple server from the root directory:
```bash
node -e "const http = require('http'), fs = require('fs'); http.createServer((q, r) => fs.readFile('index.html', (e, d) => { r.writeHead(200, {'Content-Type': 'text/html'}); r.end(d); })).listen(5000, () => console.log('Server running at http://localhost:5000/'))"
```
Then visit **[http://localhost:5000/](http://localhost:5000/)** in your browser.

### Option B: Double-Click File
You can also open the `index.html` file directly in any modern browser by double-clicking it.

---

## 📖 How to Use the App
1. **Take the Onboarding Quiz**: Click **Start Tracker** on the splash screen and select your parameters.
2. **Review your Dashboard**: Check your main carbon emission index and swipe or rotate the 3D Eco-Island.
3. **Log Daily Habits**: Under the **Track** tab, toggle checkboxes for activities you completed today. Watch the island develop new wind turbines, solar panels, or road transport features instantly.
4. **Learn & Improve**: Visit the **Insights** tab to see your highest-emitting categories and review suggestions.
5. **View Leaderboard & Graphs**: Visit the **Progress** tab to observe your carbon-saving trend line and community ranking.
