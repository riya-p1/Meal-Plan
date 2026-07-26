# Apartment Meal Prep

A local-first meal prep website based on the Gemini planning convo. It runs as a
static site and saves meal logs, ingredient checks, and prep progress in browser
localStorage on this machine.

It also has an optional AI planner. Paste an OpenAI API key into the AI Plan
section to generate a new weekly plan from your saved pantry, fridge, freezer,
kitchen assets, prep tasks, and meal logs. If you check "Remember key locally,"
the key is stored only in this browser's localStorage.

Use the Meals section to save custom meals with ingredients and notes. Any saved
custom, logged, or AI-generated meal can be placed into a day and lunch/dinner
slot on the current week.

## Open It

Open `index.html` directly in a browser, or run a local static server from this
folder:

```powershell
python -m http.server 4173
```

Then visit `http://localhost:4173`.
