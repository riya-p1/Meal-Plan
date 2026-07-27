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

Planning rule: the default week runs from Sunday dinner through Friday dinner.
There should be only one fast-casual dinner, and its leftover half should become
the next day's lunch.

## Open It

Hosted version:

```text
https://apartment-meal-prep-20260726.dpatil.chatgpt.site
```

Local double-click version:

Double-click `start-meal-prep.bat`. It starts the local server and opens the
site in your browser.

Manual local server:

```powershell
python -m http.server 4173
```

Then visit `http://localhost:4173`.

Direct file version:

Open `index.html` directly in a browser. Most planner features work this way,
but the local server path is better for browser features like clipboard and API
requests.
