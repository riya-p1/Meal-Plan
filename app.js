const STORAGE_KEY = "apartment-meal-prep-v2";
const OLD_STORAGE_KEY = "apartment-meal-prep-v1";
const DEFAULT_MODEL = "gpt-5.6-sol";
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const defaultPlan = {
  id: "corrected-sunday-friday-plan",
  title: "Sunday-Friday concrete plan",
  source: "Corrected Gemini plan",
  createdAt: Date.now(),
  note: "Sunday dinner through Friday dinner. One fast-casual dinner only, and its leftovers become the next day's lunch.",
  days: [
    {
      day: "Sunday",
      lunch: {
        title: "No planned lunch",
        note: "The concrete plan starts tonight with dinner.",
      },
      dinner: {
        title: "Dosa night",
        note: "Finish the dosa batter tonight. Eat dosas hot with pickle paste and homemade yogurt.",
      },
    },
    {
      day: "Monday",
      lunch: {
        title: "No packed leftovers",
        note: "Breakfast is provided and fruit can be your snack. Fast-casual happens at dinner, not lunch.",
      },
      dinner: {
        title: "Fast-casual night",
        note: "Buy Subway or Chipotle on the way home. Eat half for dinner and save half for Tuesday lunch.",
      },
    },
    {
      day: "Tuesday",
      lunch: {
        title: "Leftover fast-casual half",
        note: "Pack the remaining sandwich or bowl in a glass box for work.",
      },
      dinner: {
        title: "Pesto or marinara penne with chicken",
        note: "Boil penne. Toss with pesto or marinara, canned black olives, and chicken slices.",
      },
    },
    {
      day: "Wednesday",
      lunch: {
        title: "Leftover chicken pasta",
        note: "Pack Tuesday's pasta in a glass box and microwave it at work.",
      },
      dinner: {
        title: "Lemon or puliyogare rice with eggs",
        note: "Use the rice cooker for Sona Masoori rice. Mix with lemon rice mix or puliyogare paste, ghee, and 2 boiled eggs.",
      },
    },
    {
      day: "Thursday",
      lunch: {
        title: "Leftover seasoned rice and egg",
        note: "Pack leftover lemon or puliyogare rice with another boiled egg.",
      },
      dinner: {
        title: "Avocado and cheese quesadillas",
        note: "Pan-warm tortillas with butter, cheese, mashed avocado with lime and salt, cucumbers, and chicken slices.",
      },
    },
    {
      day: "Friday",
      lunch: {
        title: "Leftover quesadillas",
        note: "Pack Thursday's quesadillas. Eat cold or rewarm quickly in the microwave.",
      },
      dinner: {
        title: "Weekend kickoff ramen",
        note: "Make Buldak or Maggi. Add cheddar, soy sauce, boiled egg, and jalapenos if you want heat.",
      },
    },
  ],
  shoppingList: ["Chicken slices", "Lettuce", "Soy sauce"],
  prepTasks: ["Finish dosa batter Sunday night", "Boil eggs for Wednesday and Friday", "Set out glass boxes for Tue-Fri leftovers"],
};

const defaultRoutineTasks = [
  {
    id: "routine-rewind",
    name: "Social / rewind hour",
    category: "Social",
    cadence: "weekdays",
    day: "",
    time: "After work",
    notes: "1-2 hours after getting back from work: shower, chill, reply/social, decompress.",
    doneDates: [],
    locked: true,
  },
  {
    id: "routine-legato",
    name: "Work on Legato",
    category: "Work",
    cadence: "weekdays",
    day: "",
    time: "After rewind",
    notes: "Focused project block after the shower/chill reset.",
    doneDates: [],
    locked: true,
  },
  {
    id: "routine-dinner",
    name: "Make dinner",
    category: "Meals",
    cadence: "daily",
    day: "",
    time: "Evening",
    notes: "Use the meal plan when there is one; otherwise make the easiest viable dinner.",
    doneDates: [],
    locked: true,
  },
  {
    id: "routine-lunch",
    name: "Make or pack lunch",
    category: "Meals",
    cadence: "weekdays",
    day: "",
    time: "Night before",
    notes: "Pack leftovers or assemble tomorrow's work lunch.",
    doneDates: [],
    locked: true,
  },
  {
    id: "routine-dishes",
    name: "Wash dishes",
    category: "Home",
    cadence: "daily",
    day: "",
    time: "Daily",
    notes: "Quick sink reset so tomorrow starts cleaner.",
    doneDates: [],
    locked: true,
  },
  {
    id: "routine-laundry",
    name: "Do laundry",
    category: "Home",
    cadence: "weekly",
    day: "Saturday",
    time: "Late morning",
    notes: "Run clothes, towels, and anything that needs drying time.",
    doneDates: [],
    locked: true,
  },
  {
    id: "routine-hair",
    name: "Wash hair",
    category: "Care",
    cadence: "weekly",
    day: "Sunday",
    time: "Evening",
    notes: "Weekly hair wash and reset before the work week.",
    doneDates: [],
    locked: true,
  },
  {
    id: "routine-clean",
    name: "Clean / vacuum",
    category: "Home",
    cadence: "weekly",
    day: "Sunday",
    time: "Afternoon",
    notes: "Vacuum, wipe surfaces, empty trash, and reset the apartment.",
    doneDates: [],
    locked: true,
  },
];

const defaultState = {
  meals: {},
  currentPlan: structuredClone(defaultPlan),
  savedPlans: [structuredClone(defaultPlan)],
  ingredients: [
    { id: "buy-soy-sauce", bucket: "buy", name: "Soy sauce", amount: "For dumplings, ramen, and quick sauces", checked: false },
    { id: "buy-chicken-slices", bucket: "buy", name: "Chicken slices", amount: "Sandwiches, wraps, and pasta protein", checked: false },
    { id: "buy-lettuce", bucket: "buy", name: "Lettuce", amount: "Crunch for sandwiches and tortillas", checked: false },
    { id: "soon-dosa", bucket: "useSoon", name: "Dosa batter", amount: "Use soon", checked: false },
    { id: "soon-yogurt", bucket: "useSoon", name: "Homemade yogurt / curd", amount: "Pair with dosa, rice, or spicy food", checked: false },
    { id: "soon-avocado", bucket: "useSoon", name: "Avocado", amount: "Mash with lime for quesadillas or toast", checked: false },
    { id: "fridge-milk", bucket: "fridge", name: "Milk", amount: "Coffee, tea, or backup snack", checked: false },
    { id: "fridge-bread", bucket: "fridge", name: "Bread", amount: "Toast, sandwiches, Nutella toast", checked: false },
    { id: "fridge-eggs", bucket: "fridge", name: "Eggs", amount: "Boil 4-5 for the week", checked: false },
    { id: "fridge-tortillas", bucket: "fridge", name: "Almond flour tortillas", amount: "Wraps and quesadillas", checked: false },
    { id: "fridge-sauces", bucket: "fridge", name: "Marinara / pesto / alfredo", amount: "Pasta nights", checked: false },
    { id: "fridge-chiles", bucket: "fridge", name: "Poblano, jalapenos, limes, cucumbers", amount: "Fresh add-ins", checked: false },
    { id: "fridge-cheese", bucket: "fridge", name: "Mexican cheese and cheddar slices", amount: "Pasta, ramen, quesadillas", checked: false },
    { id: "fridge-condiments", bucket: "fridge", name: "Olives, pickle chips, sriracha mayo, Cholula", amount: "Quick flavor boosts", checked: false },
    { id: "freezer-dumplings", bucket: "freezer", name: "Frozen dumplings", amount: "Weekend or emergency dinner", checked: false },
    { id: "pantry-rice", bucket: "pantry", name: "Sona Masoori rice", amount: "Lemon rice, puliyogare, egg rice", checked: false },
    { id: "pantry-pasta", bucket: "pantry", name: "Rotini and penne pasta", amount: "Cook once, pack leftovers", checked: false },
    { id: "pantry-dal", bucket: "pantry", name: "Toor dal", amount: "Future dal batch", checked: false },
    { id: "pantry-vermicelli", bucket: "pantry", name: "Vermicelli", amount: "South Indian upma", checked: false },
    { id: "pantry-pastes", bucket: "pantry", name: "Puliyogare paste, pickle paste, lemon rice mix", amount: "Fast rice flavor", checked: false },
    { id: "pantry-ramen", bucket: "pantry", name: "Buldak ramen and Maggi", amount: "Low-energy dinner", checked: false },
    { id: "pantry-basics", bucket: "pantry", name: "Salt, pepper, sugar, flour, peanut oil, ghee", amount: "Basics", checked: false },
    { id: "pantry-snacks", bucket: "pantry", name: "Nutella, Oreos, coffee roasts, tea packets", amount: "Snacks and drinks", checked: false },
    { id: "asset-microwave", bucket: "equipment", name: "Microwave", amount: "Reheats packed lunch", checked: false },
    { id: "asset-stove", bucket: "equipment", name: "Electric stove", amount: "Dosa, pasta, dumplings, eggs", checked: false },
    { id: "asset-rice-cooker", bucket: "equipment", name: "Rice cooker", amount: "Rice batches for leftovers", checked: false },
    { id: "asset-egg-boiler", bucket: "equipment", name: "Egg boiler", amount: "Fast weekly protein prep", checked: false },
    { id: "asset-pans", bucket: "equipment", name: "Medium/large pots, saucepans, shallow and deep pans", amount: "Flexible cooking setup", checked: false },
    { id: "asset-storage", bucket: "equipment", name: "Glass bowls and boxes", amount: "Pack lunches", checked: false },
    { id: "asset-kettle-toaster", bucket: "equipment", name: "Water kettle and toaster", amount: "Tea, coffee, toast", checked: false },
    { id: "prep-eggs", bucket: "prep", name: "Boil eggs", amount: "Make 4-5 at the start of the week", checked: false },
    { id: "prep-boxes", bucket: "prep", name: "Set out glass boxes", amount: "Pack pasta, rice, or leftovers before bed", checked: false },
    { id: "prep-rice", bucket: "prep", name: "Rice cooker batch", amount: "Thursday dinner becomes Friday lunch", checked: false },
    { id: "prep-takeout", bucket: "prep", name: "Split fast-casual dinner", amount: "Only one fast-casual dinner; save half for next day's lunch", checked: false },
  ],
  logs: [],
  mealLibrary: [],
  routineTasks: structuredClone(defaultRoutineTasks),
  ai: {
    apiKey: "",
    model: DEFAULT_MODEL,
    lastPrompt: "",
  },
};

const bucketMeta = {
  buy: { title: "Need to buy", color: "#fff0ed" },
  useSoon: { title: "Use soon", color: "#fff8dc" },
  pantry: { title: "Pantry / shelf", color: "#fffdf1" },
  fridge: { title: "Fridge", color: "#eef8f1" },
  freezer: { title: "Freezer", color: "#eef8ff" },
  equipment: { title: "Kitchen assets", color: "#f5f0ff" },
  prep: { title: "Prep tasks", color: "#f5f7e8" },
};

const state = loadState();

const elements = {
  todayLabel: document.querySelector("#today-label"),
  todayTitle: document.querySelector("#today-title"),
  todayContent: document.querySelector("#today-content"),
  currentPlanTitle: document.querySelector("#current-plan-title"),
  currentPlanNote: document.querySelector("#current-plan-note"),
  weekGrid: document.querySelector("#week-grid"),
  ingredientBoard: document.querySelector("#ingredient-board"),
  ingredientForm: document.querySelector("#ingredient-form"),
  routineBoard: document.querySelector("#routine-board"),
  routineForm: document.querySelector("#routine-form"),
  choreGrid: document.querySelector("#chore-grid"),
  aiPlanForm: document.querySelector("#ai-plan-form"),
  aiStatus: document.querySelector("#ai-status"),
  savedPlanList: document.querySelector("#saved-plan-list"),
  customMealForm: document.querySelector("#custom-meal-form"),
  placeMealForm: document.querySelector("#place-meal-form"),
  mealLibraryList: document.querySelector("#meal-library-list"),
  placeMealSelect: document.querySelector("#place-meal-select"),
  placeMealDay: document.querySelector("#place-meal-day"),
  mealLogForm: document.querySelector("#meal-log-form"),
  logList: document.querySelector("#log-list"),
  toast: document.querySelector("#toast"),
};

function loadState() {
  const fallback = structuredClone(defaultState);
  const saved = readJson(STORAGE_KEY);
  if (saved) return normalizeState(saved, fallback);

  const old = readJson(OLD_STORAGE_KEY);
  if (!old) return fallback;

  const migrated = normalizeState(old, fallback);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
  return migrated;
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function normalizeState(saved, fallback) {
  const normalized = {
    ...fallback,
    ...saved,
    meals: saved.meals || {},
    currentPlan: saved.currentPlan?.days ? saved.currentPlan : fallback.currentPlan,
    savedPlans: Array.isArray(saved.savedPlans) && saved.savedPlans.length ? saved.savedPlans : fallback.savedPlans,
    ingredients: Array.isArray(saved.ingredients) ? mergeIngredientDefaults(saved.ingredients) : fallback.ingredients,
    logs: Array.isArray(saved.logs) ? saved.logs : [],
    mealLibrary: Array.isArray(saved.mealLibrary) ? saved.mealLibrary : [],
    routineTasks: Array.isArray(saved.routineTasks) ? mergeRoutineDefaults(saved.routineTasks) : fallback.routineTasks,
    ai: {
      ...fallback.ai,
      ...(saved.ai || {}),
    },
  };

  normalized.ai.model ||= DEFAULT_MODEL;
  normalized.ingredients = normalized.ingredients.map((item) => ({
    ...item,
    bucket: item.bucket === "onHand" ? "pantry" : item.bucket,
  }));
  if (normalized.currentPlan.id === "starter-gemini-plan") {
    normalized.currentPlan = structuredClone(defaultPlan);
  }
  normalized.savedPlans = normalized.savedPlans.map((plan) =>
    plan.id === "starter-gemini-plan" ? structuredClone(defaultPlan) : plan,
  );
  return normalized;
}

function mergeIngredientDefaults(savedIngredients) {
  const savedById = new Map(savedIngredients.map((item) => [item.id, item]));
  const defaults = defaultState.ingredients.map((item) => savedById.get(item.id) || item);
  const extras = savedIngredients.filter((item) => !defaultState.ingredients.some((defaultItem) => defaultItem.id === item.id));
  return [...defaults, ...extras];
}

function mergeRoutineDefaults(savedTasks) {
  const savedById = new Map(savedTasks.map((item) => [item.id, item]));
  const defaults = defaultRoutineTasks.map((item) => ({ ...item, ...(savedById.get(item.id) || {}) }));
  const extras = savedTasks.filter((item) => !defaultRoutineTasks.some((defaultItem) => defaultItem.id === item.id));
  return [...defaults, ...extras].map((item) => ({
    ...item,
    doneDates: Array.isArray(item.doneDates) ? item.doneDates : [],
  }));
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function getTodayName() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
}

function getPlanForDay(dayName) {
  return state.currentPlan.days.find((item) => item.day === dayName) || state.currentPlan.days[0];
}

function getMealKey(day, kind) {
  return `${state.currentPlan.id}-${day}-${kind}`;
}

function getMealState(day, kind) {
  const key = getMealKey(day, kind);
  state.meals[key] ||= { done: false, packed: false };
  return state.meals[key];
}

function renderToday() {
  const todayName = getTodayName();
  const plan = getPlanForDay(todayName);
  elements.todayLabel.textContent = todayName === "Sunday" ? "Today / reset day" : "Today";
  elements.todayTitle.textContent = plan.day;
  elements.todayContent.innerHTML = ["lunch", "dinner"]
    .map((kind) => {
      const meal = plan[kind];
      const status = getMealState(plan.day, capitalize(kind));
      const statusText = status.done ? "Done" : status.packed ? "Packed" : "Planned";
      return `
        <article class="today-meal">
          <strong>${capitalize(kind)}: ${escapeHtml(meal.title)}</strong>
          <p>${escapeHtml(meal.note)}</p>
          <div class="tag-row" aria-label="${capitalize(kind)} status">
            <span class="tag">${statusText}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderWeek() {
  elements.currentPlanTitle.textContent = state.currentPlan.title || "This week's meals";
  elements.currentPlanNote.textContent = state.currentPlan.note || "Tap a meal to mark it done or packed.";
  elements.weekGrid.innerHTML = state.currentPlan.days
    .map((day) => {
      const lunchState = getMealState(day.day, "Lunch");
      const dinnerState = getMealState(day.day, "Dinner");
      return `
        <div class="day-column">
          <div class="day-title">${escapeHtml(day.day)}<span>${countDone(day.day)}/2</span></div>
          ${mealCard(day.day, "Lunch", day.lunch, lunchState)}
          ${mealCard(day.day, "Dinner", day.dinner, dinnerState)}
        </div>
      `;
    })
    .join("");
}

function mealCard(day, kind, meal, mealState) {
  return `
    <article class="meal-card ${mealState.done ? "is-done" : ""}" data-kind="${kind}">
      <div>
        <p class="eyebrow">${kind}</p>
        <h3>${escapeHtml(meal.title)}</h3>
        <p>${escapeHtml(meal.note)}</p>
      </div>
      <div class="meal-actions">
        <button type="button" class="${mealState.done ? "active" : ""}" data-meal-action="done" data-day="${day}" data-kind="${kind}">
          ${mealState.done ? "Done" : "Mark done"}
        </button>
        <button type="button" class="${mealState.packed ? "active" : ""}" data-meal-action="packed" data-day="${day}" data-kind="${kind}">
          ${mealState.packed ? "Packed" : "Pack"}
        </button>
      </div>
    </article>
  `;
}

function countDone(day) {
  return ["Lunch", "Dinner"].filter((kind) => getMealState(day, kind).done).length;
}

function renderIngredients() {
  const buckets = Object.keys(bucketMeta);
  elements.ingredientBoard.innerHTML = buckets
    .map((bucket) => {
      const items = state.ingredients.filter((item) => item.bucket === bucket);
      const meta = bucketMeta[bucket];
      return `
        <section class="ingredient-column" style="background: ${meta.color}">
          <h3>${meta.title}<span class="tag">${items.filter((item) => !item.checked).length}</span></h3>
          <div class="ingredient-list">
            ${
              items.length
                ? items.map(ingredientItem).join("")
                : `<div class="empty-state">Nothing here right now.</div>`
            }
          </div>
        </section>
      `;
    })
    .join("");
}

function ingredientItem(item) {
  return `
    <article class="ingredient-item ${item.checked ? "is-checked" : ""}">
      <input type="checkbox" data-ingredient-check="${item.id}" ${item.checked ? "checked" : ""} aria-label="Mark ${escapeHtml(item.name)} complete" />
      <span>
        <span>${escapeHtml(item.name)}</span>
        <small>${escapeHtml(item.amount || "No note")}</small>
      </span>
      <button class="remove-button" type="button" data-ingredient-remove="${item.id}" title="Remove ${escapeHtml(item.name)}" aria-label="Remove ${escapeHtml(item.name)}">x</button>
    </article>
  `;
}

function renderRoutine() {
  const today = new Date();
  const dayName = getDayName(today);
  const dateKey = getDateKey(today);
  const tasks = state.routineTasks.filter((task) => isTaskScheduled(task, dayName));

  elements.routineBoard.innerHTML = tasks.length
    ? tasks.map((task) => routineItem(task, dateKey, dayName)).join("")
    : `<div class="empty-state">Nothing scheduled for today. Add a routine task to start tracking it.</div>`;
}

function renderChoreGrid() {
  const weekDates = getCurrentWeekDates();
  elements.choreGrid.innerHTML = weekDates
    .map(({ date, day }) => {
      const dateKey = getDateKey(date);
      const tasks = state.routineTasks.filter((task) => isTaskScheduled(task, day));
      return `
        <div class="chore-day">
          <div class="day-title">${day}<span>${tasks.filter((task) => isRoutineDone(task, dateKey)).length}/${tasks.length}</span></div>
          <div class="chore-list">
            ${
              tasks.length
                ? tasks.map((task) => routineItem(task, dateKey, day, true)).join("")
                : `<div class="empty-state">No tasks.</div>`
            }
          </div>
        </div>
      `;
    })
    .join("");
}

function routineItem(task, dateKey, dayName, compact = false) {
  const done = isRoutineDone(task, dateKey);
  return `
    <article class="routine-item ${done ? "is-checked" : ""}">
      <input
        type="checkbox"
        data-routine-check="${task.id}"
        data-routine-date="${dateKey}"
        ${done ? "checked" : ""}
        aria-label="Mark ${escapeHtml(task.name)} done for ${escapeHtml(dayName)}"
      />
      <span>
        <span>${escapeHtml(task.name)}</span>
        <small>${escapeHtml([task.category, task.time, compact ? "" : task.notes].filter(Boolean).join(" - "))}</small>
      </span>
      <button class="remove-button" type="button" data-routine-remove="${task.id}" title="Remove ${escapeHtml(task.name)}" aria-label="Remove ${escapeHtml(task.name)}" ${task.locked ? "disabled" : ""}>x</button>
    </article>
  `;
}

function renderSavedPlans() {
  if (!state.savedPlans.length) {
    elements.savedPlanList.innerHTML = `<div class="empty-state">Generated plans will land here.</div>`;
    return;
  }

  elements.savedPlanList.innerHTML = [...state.savedPlans]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(
      (plan) => `
        <article class="saved-plan">
          <header>
            <div>
              <strong>${escapeHtml(plan.title || "Weekly plan")}</strong>
              <p>${formatTimestamp(plan.createdAt)} - ${escapeHtml(plan.source || "local")}</p>
            </div>
            <button class="small-button" type="button" data-plan-apply="${plan.id}">Use</button>
          </header>
          <p>${escapeHtml(plan.note || "No summary note.")}</p>
          <div class="tag-row">
            ${(plan.shoppingList || []).slice(0, 4).map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderMealLibrary() {
  const meals = [...state.mealLibrary].sort((a, b) => b.createdAt - a.createdAt);
  elements.placeMealDay.innerHTML = state.currentPlan.days
    .map((day) => `<option value="${escapeHtml(day.day)}">${escapeHtml(day.day)}</option>`)
    .join("");

  elements.placeMealSelect.innerHTML = meals.length
    ? meals.map((meal) => `<option value="${escapeHtml(meal.id)}">${escapeHtml(meal.title)}</option>`).join("")
    : `<option value="">No saved meals yet</option>`;

  if (!meals.length) {
    elements.mealLibraryList.innerHTML = `<div class="empty-state">Save a custom meal, log a meal, or generate an AI plan to build this library.</div>`;
    return;
  }

  elements.mealLibraryList.innerHTML = meals
    .map(
      (meal) => `
        <article class="library-meal">
          <header>
            <div>
              <strong>${escapeHtml(meal.title)}</strong>
              <p>${escapeHtml(meal.kind || "Meal")} - ${formatTimestamp(meal.createdAt)}</p>
            </div>
            <button class="remove-button" type="button" data-meal-remove="${meal.id}" title="Remove meal" aria-label="Remove meal">x</button>
          </header>
          ${meal.ingredients ? `<p><strong>Uses:</strong> ${escapeHtml(meal.ingredients)}</p>` : ""}
          ${meal.note ? `<p>${escapeHtml(meal.note)}</p>` : ""}
          <div class="tag-row">
            <span class="tag">${escapeHtml(meal.sourcePlanId === "custom" ? "custom" : meal.sourcePlanId === "log" ? "logged" : "planned")}</span>
            ${meal.leftovers ? `<span class="tag">leftover-friendly</span>` : ""}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderLogs() {
  if (!state.logs.length) {
    elements.logList.innerHTML = `<div class="empty-state">No meals logged yet. The first one gets the calendar rolling.</div>`;
    return;
  }

  elements.logList.innerHTML = [...state.logs]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(
      (log) => `
        <article class="log-item">
          <header>
            <div>
              <strong>${escapeHtml(log.title)}</strong>
              <p>${formatDate(log.date)} - ${escapeHtml(log.meal)}</p>
            </div>
            <button class="remove-button" type="button" data-log-remove="${log.id}" title="Remove log" aria-label="Remove log">x</button>
          </header>
          ${log.notes ? `<p>${escapeHtml(log.notes)}</p>` : ""}
          <div class="tag-row">
            <span class="tag">${escapeHtml(log.mood)}</span>
            ${log.packed ? `<span class="tag">leftovers packed</span>` : ""}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderAiSettings() {
  document.querySelector("#ai-model").value = state.ai.model || DEFAULT_MODEL;
  document.querySelector("#ai-key").value = state.ai.apiKey || "";
}

function renderAll() {
  renderToday();
  renderRoutine();
  renderChoreGrid();
  renderWeek();
  renderIngredients();
  renderMealLibrary();
  renderSavedPlans();
  renderLogs();
}

function addMealsToLibrary(plan) {
  const existing = new Set(state.mealLibrary.map((meal) => meal.title.toLowerCase()));
  plan.days.forEach((day) => {
    ["lunch", "dinner"].forEach((kind) => {
      const title = day[kind]?.title?.trim();
      if (!title || existing.has(title.toLowerCase())) return;
      state.mealLibrary.push({
        id: makeId("meal"),
        title,
        kind: capitalize(kind),
        note: day[kind].note || "",
        ingredients: "",
        leftovers: kind === "dinner",
        sourcePlanId: plan.id,
        createdAt: Date.now(),
      });
      existing.add(title.toLowerCase());
    });
  });
}

function buildAiPrompt(notes, takeoutNights) {
  const ingredientsByBucket = Object.keys(bucketMeta)
    .map((bucket) => {
      const items = state.ingredients
        .filter((item) => item.bucket === bucket && !item.checked)
        .map((item) => `${item.name}${item.amount ? ` (${item.amount})` : ""}`)
        .join("; ");
      return `${bucketMeta[bucket].title}: ${items || "none"}`;
    })
    .join("\n");

  const recentLogs = state.logs
    .slice(-8)
    .map((log) => `${log.date} ${log.meal}: ${log.title}${log.notes ? ` - ${log.notes}` : ""}`)
    .join("\n");

  const customMeals = state.mealLibrary
    .filter((meal) => meal.sourcePlanId === "custom")
    .map((meal) => `${meal.title}: ${meal.ingredients || "ingredients not listed"}; ${meal.note || "no notes"}`)
    .join("\n");

  const prompt = `Create a realistic one-week meal plan for an apartment stay.

Context:
- Work schedule is about 9 AM to 5/6 PM.
- Generate the plan from Sunday dinner through Friday dinner.
- Sunday only needs dinner; Monday through Friday need lunch and dinner.
- Breakfast is provided and should not be planned, except fruit can be mentioned as a snack.
- Mostly vegetarian, but chicken slices are okay.
- Prefer low-effort meals, rice cooker/stove/microwave friendly.
- Use cook-once-eat-twice logic where dinner can become tomorrow's lunch.
- Exactly ${takeoutNights} fast-casual dinner night(s), unless the user explicitly says zero.
- Fast-casual must happen at night for dinner, and the leftover half must be the next day's lunch.

Saved kitchen inventory and assets:
${ingredientsByBucket}

Recent meal logs:
${recentLogs || "No logs yet."}

Saved custom meals:
${customMeals || "No custom meals yet."}

This week's update:
${notes || "No extra update."}

Return exactly 6 days in this order: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday. Keep lunch and dinner practical, include use-soon items, and generate only food that fits the saved kitchen assets.`;

  state.ai.lastPrompt = prompt;
  return prompt;
}

const mealPlanSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "note", "days", "shoppingList", "prepTasks"],
  properties: {
    title: { type: "string" },
    note: { type: "string" },
    shoppingList: { type: "array", items: { type: "string" } },
    prepTasks: { type: "array", items: { type: "string" } },
    days: {
      type: "array",
      minItems: 6,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["day", "lunch", "dinner"],
        properties: {
          day: { type: "string" },
          lunch: {
            type: "object",
            additionalProperties: false,
            required: ["title", "note"],
            properties: {
              title: { type: "string" },
              note: { type: "string" },
            },
          },
          dinner: {
            type: "object",
            additionalProperties: false,
            required: ["title", "note"],
            properties: {
              title: { type: "string" },
              note: { type: "string" },
            },
          },
        },
      },
    },
  },
};

async function generatePlan(event) {
  event.preventDefault();
  const formData = new FormData(elements.aiPlanForm);
  const apiKey = String(formData.get("apiKey") || "").trim();
  const model = String(formData.get("model") || DEFAULT_MODEL).trim();
  const notes = String(formData.get("notes") || "").trim();
  const takeoutNights = Number(formData.get("takeoutNights") || 1);

  if (!apiKey) {
    showToast("Add an OpenAI API key first.");
    document.querySelector("#ai-key").focus();
    return;
  }

  state.ai.model = model;
  state.ai.apiKey = formData.get("saveKey") === "on" ? apiKey : "";
  const prompt = buildAiPrompt(notes, takeoutNights);
  saveState();

  const button = document.querySelector("#generate-plan");
  button.disabled = true;
  button.textContent = "Generating...";
  elements.aiStatus.textContent = "Asking AI for a practical week based on your pantry and assets.";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content:
              "You are a practical meal-prep planner. Return concise, realistic meal plans as valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "meal_plan",
            schema: mealPlanSchema,
            strict: true,
          },
        },
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error?.message || "The AI request failed.");
    }

    const text = payload.output_text || extractResponseText(payload);
    const generated = JSON.parse(text);
    const plan = normalizeGeneratedPlan(generated, model);
    saveGeneratedPlan(plan);
    elements.aiStatus.textContent = "Generated and saved. Your current week has been updated.";
    elements.aiPlanForm.reset();
    renderAiSettings();
    renderAll();
    showToast("New AI meal plan saved.");
  } catch (error) {
    elements.aiStatus.textContent = error.message;
    showToast("AI plan failed. Prompt is saved to copy.");
  } finally {
    button.disabled = false;
    button.textContent = "Generate weekly plan";
  }
}

function extractResponseText(payload) {
  return (payload.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || "")
    .join("")
    .trim();
}

function normalizeGeneratedPlan(generated, model) {
  return {
    id: makeId("plan"),
    title: generated.title || "AI weekly meal plan",
    source: `OpenAI ${model}`,
    createdAt: Date.now(),
    note: generated.note || "Generated from your saved ingredients, assets, and notes.",
    days: generated.days.map((day) => ({
      day: day.day,
      lunch: {
        title: day.lunch.title,
        note: day.lunch.note,
      },
      dinner: {
        title: day.dinner.title,
        note: day.dinner.note,
      },
    })),
    shoppingList: generated.shoppingList || [],
    prepTasks: generated.prepTasks || [],
  };
}

function saveGeneratedPlan(plan) {
  state.currentPlan = plan;
  state.savedPlans = [plan, ...state.savedPlans.filter((savedPlan) => savedPlan.id !== plan.id)].slice(0, 12);
  addMealsToLibrary(plan);

  plan.shoppingList.forEach((item) => {
    if (!state.ingredients.some((ingredient) => ingredient.name.toLowerCase() === item.toLowerCase() && ingredient.bucket === "buy")) {
      state.ingredients.push({
        id: makeId("buy"),
        bucket: "buy",
        name: item,
        amount: "From generated plan",
        checked: false,
      });
    }
  });

  plan.prepTasks.forEach((item) => {
    if (!state.ingredients.some((ingredient) => ingredient.name.toLowerCase() === item.toLowerCase() && ingredient.bucket === "prep")) {
      state.ingredients.push({
        id: makeId("prep"),
        bucket: "prep",
        name: item,
        amount: "From generated plan",
        checked: false,
      });
    }
  });

  saveState();
}

function applyMealToWeek(mealId, dayName, kind) {
  const meal = state.mealLibrary.find((item) => item.id === mealId);
  const day = state.currentPlan.days.find((item) => item.day === dayName);
  if (!meal || !day) return false;

  const slot = kind.toLowerCase();
  day[slot] = {
    title: meal.title,
    note: meal.note || (meal.ingredients ? `Uses: ${meal.ingredients}` : "Custom meal from your saved library."),
  };
  state.currentPlan = {
    ...state.currentPlan,
    source: "Customized locally",
    note: "Customized with your saved meals.",
  };
  state.savedPlans = [
    structuredClone(state.currentPlan),
    ...state.savedPlans.filter((plan) => plan.id !== state.currentPlan.id),
  ].slice(0, 12);
  saveState();
  return true;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getDayName(date) {
  return DAY_NAMES[date.getDay()];
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentWeekDates() {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  return DAY_NAMES.map((day, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);
    return { day, date };
  });
}

function isTaskScheduled(task, dayName) {
  if (task.cadence === "daily") return true;
  if (task.cadence === "weekdays") return WEEKDAYS.includes(dayName);
  if (task.cadence === "weekly" || task.cadence === "custom") return task.day === dayName;
  return false;
}

function isRoutineDone(task, dateKey) {
  return task.doneDates?.includes(dateKey);
}

function toggleRoutine(taskId, dateKey, checked) {
  const task = state.routineTasks.find((item) => item.id === taskId);
  if (!task) return;
  task.doneDates ||= [];
  if (checked && !task.doneDates.includes(dateKey)) {
    task.doneDates.push(dateKey);
  }
  if (!checked) {
    task.doneDates = task.doneDates.filter((item) => item !== dateKey);
  }
  saveState();
}

function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(year, month - 1, day),
  );
}

function formatTimestamp(value) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(
    new Date(value),
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => elements.toast.classList.remove("show"), 2200);
}

function setDefaultDate() {
  const dateInput = document.querySelector("#log-date");
  dateInput.value = new Date().toISOString().slice(0, 10);
}

function copyBuyList() {
  const buyItems = state.ingredients
    .filter((item) => item.bucket === "buy" && !item.checked)
    .map((item) => `- ${item.name}${item.amount ? `: ${item.amount}` : ""}`)
    .join("\n");
  copyText(buyItems || "Everything on the buy list is checked off.", "Buy list copied.");
}

function copyText(text, message) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(
      () => showToast(message),
      () => fallbackCopy(text, message),
    );
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  showToast(message);
}

document.addEventListener("click", (event) => {
  const mealButton = event.target.closest("[data-meal-action]");
  if (mealButton) {
    const { day, kind, mealAction } = mealButton.dataset;
    const mealState = getMealState(day, kind);
    mealState[mealAction] = !mealState[mealAction];
    saveState();
    renderAll();
    showToast(`${kind} updated.`);
    return;
  }

  const ingredientCheck = event.target.closest("[data-ingredient-check]");
  if (ingredientCheck) {
    const item = state.ingredients.find((ingredient) => ingredient.id === ingredientCheck.dataset.ingredientCheck);
    if (item) {
      item.checked = ingredientCheck.checked;
      saveState();
      renderIngredients();
    }
    return;
  }

  const routineCheck = event.target.closest("[data-routine-check]");
  if (routineCheck) {
    toggleRoutine(routineCheck.dataset.routineCheck, routineCheck.dataset.routineDate, routineCheck.checked);
    renderRoutine();
    renderChoreGrid();
    showToast(routineCheck.checked ? "Task logged." : "Task unchecked.");
    return;
  }

  const ingredientRemove = event.target.closest("[data-ingredient-remove]");
  if (ingredientRemove) {
    state.ingredients = state.ingredients.filter((item) => item.id !== ingredientRemove.dataset.ingredientRemove);
    saveState();
    renderIngredients();
    showToast("Ingredient removed.");
    return;
  }

  const routineRemove = event.target.closest("[data-routine-remove]");
  if (routineRemove && !routineRemove.disabled) {
    state.routineTasks = state.routineTasks.filter((task) => task.id !== routineRemove.dataset.routineRemove);
    saveState();
    renderRoutine();
    renderChoreGrid();
    showToast("Routine task removed.");
    return;
  }

  const mealRemove = event.target.closest("[data-meal-remove]");
  if (mealRemove) {
    state.mealLibrary = state.mealLibrary.filter((meal) => meal.id !== mealRemove.dataset.mealRemove);
    saveState();
    renderMealLibrary();
    showToast("Saved meal removed.");
    return;
  }

  const planApply = event.target.closest("[data-plan-apply]");
  if (planApply) {
    const plan = state.savedPlans.find((savedPlan) => savedPlan.id === planApply.dataset.planApply);
    if (plan) {
      state.currentPlan = structuredClone(plan);
      saveState();
      renderAll();
      document.querySelector("#week").scrollIntoView({ behavior: "smooth" });
      showToast("Plan applied.");
    }
    return;
  }

  const logRemove = event.target.closest("[data-log-remove]");
  if (logRemove) {
    state.logs = state.logs.filter((log) => log.id !== logRemove.dataset.logRemove);
    saveState();
    renderLogs();
    showToast("Meal log removed.");
  }
});

elements.ingredientForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(elements.ingredientForm);
  state.ingredients.push({
    id: makeId("ingredient"),
    bucket: formData.get("bucket"),
    name: String(formData.get("name")).trim(),
    amount: String(formData.get("amount")).trim(),
    checked: false,
  });
  saveState();
  elements.ingredientForm.reset();
  renderIngredients();
  showToast("Ingredient or asset added.");
});

elements.routineForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(elements.routineForm);
  const cadence = formData.get("cadence");
  const day = formData.get("day");
  state.routineTasks.push({
    id: makeId("routine"),
    name: String(formData.get("name")).trim(),
    category: formData.get("category"),
    cadence,
    day: cadence === "daily" || cadence === "weekdays" ? "" : day,
    time: String(formData.get("time")).trim(),
    notes: String(formData.get("notes")).trim(),
    doneDates: [],
    locked: false,
  });
  saveState();
  elements.routineForm.reset();
  renderRoutine();
  renderChoreGrid();
  showToast("Routine task saved.");
});

elements.aiPlanForm.addEventListener("submit", generatePlan);

elements.customMealForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(elements.customMealForm);
  const title = String(formData.get("title")).trim();
  const existing = state.mealLibrary.find((meal) => meal.title.toLowerCase() === title.toLowerCase());
  const meal = {
    id: existing?.id || makeId("meal"),
    title,
    kind: formData.get("kind"),
    ingredients: String(formData.get("ingredients")).trim(),
    note: String(formData.get("note")).trim(),
    leftovers: formData.get("leftovers") === "on",
    sourcePlanId: "custom",
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now(),
  };
  state.mealLibrary = [meal, ...state.mealLibrary.filter((item) => item.id !== meal.id)];
  saveState();
  elements.customMealForm.reset();
  document.querySelector("#custom-meal-leftovers").checked = true;
  renderMealLibrary();
  showToast(existing ? "Custom meal updated." : "Custom meal saved.");
});

elements.placeMealForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(elements.placeMealForm);
  if (applyMealToWeek(formData.get("mealId"), formData.get("day"), formData.get("kind"))) {
    renderAll();
    document.querySelector("#week").scrollIntoView({ behavior: "smooth" });
    showToast("Meal added to this week.");
  } else {
    showToast("Save a meal first.");
  }
});

elements.mealLogForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(elements.mealLogForm);
  const title = String(formData.get("title")).trim();
  state.logs.push({
    id: makeId("log"),
    date: formData.get("date"),
    meal: formData.get("meal"),
    title,
    notes: String(formData.get("notes")).trim(),
    mood: formData.get("mood"),
    packed: formData.get("packed") === "on",
    createdAt: Date.now(),
  });
  if (title && !state.mealLibrary.some((meal) => meal.title.toLowerCase() === title.toLowerCase())) {
    state.mealLibrary.push({
      id: makeId("meal"),
      title,
      kind: formData.get("meal"),
      note: String(formData.get("notes")).trim(),
      ingredients: "",
      leftovers: formData.get("packed") === "on",
      sourcePlanId: "log",
      createdAt: Date.now(),
    });
  }
  saveState();
  elements.mealLogForm.reset();
  setDefaultDate();
  renderLogs();
  showToast("Meal logged and saved.");
});

document.querySelector("#open-log").addEventListener("click", () => {
  document.querySelector("#log").scrollIntoView({ behavior: "smooth" });
  document.querySelector("#log-title").focus({ preventScroll: true });
});

document.querySelector("#add-ingredient").addEventListener("click", () => {
  document.querySelector("#ingredients").scrollIntoView({ behavior: "smooth" });
  document.querySelector("#ingredient-name").focus({ preventScroll: true });
});

document.querySelector("#open-routine").addEventListener("click", () => {
  document.querySelector("#routine").scrollIntoView({ behavior: "smooth" });
  document.querySelector("#routine-name").focus({ preventScroll: true });
});

document.querySelector("#open-meals").addEventListener("click", () => {
  document.querySelector("#custom-meals").scrollIntoView({ behavior: "smooth" });
  document.querySelector("#custom-meal-title").focus({ preventScroll: true });
});

document.querySelector("#open-ai").addEventListener("click", () => {
  document.querySelector("#ai-planner").scrollIntoView({ behavior: "smooth" });
  document.querySelector("#ai-notes").focus({ preventScroll: true });
});

document.querySelector("#jump-today").addEventListener("click", () => {
  document.querySelector("#today").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#copy-list").addEventListener("click", copyBuyList);

document.querySelector("#copy-ai-prompt").addEventListener("click", () => {
  const prompt = state.ai.lastPrompt || buildAiPrompt(document.querySelector("#ai-notes").value, document.querySelector("#ai-takeout").value);
  copyText(prompt, "AI prompt copied.");
  saveState();
});

document.querySelector("#clear-bought").addEventListener("click", () => {
  state.ingredients = state.ingredients.filter((item) => !(item.bucket === "buy" && item.checked));
  saveState();
  renderIngredients();
  showToast("Checked buy-list items cleared.");
});

document.querySelector("#clear-logs").addEventListener("click", () => {
  if (!state.logs.length) return showToast("No logs to clear.");
  if (window.confirm("Clear all meal logs?")) {
    state.logs = [];
    saveState();
    renderLogs();
    showToast("Meal logs cleared.");
  }
});

document.querySelector("#clear-routine-log").addEventListener("click", () => {
  if (window.confirm("Clear all task check-off history? The task list will stay.")) {
    state.routineTasks = state.routineTasks.map((task) => ({ ...task, doneDates: [] }));
    saveState();
    renderRoutine();
    renderChoreGrid();
    showToast("Task log cleared.");
  }
});

document.querySelector("#clear-custom-meals").addEventListener("click", () => {
  const customMeals = state.mealLibrary.filter((meal) => meal.sourcePlanId === "custom");
  if (!customMeals.length) return showToast("No custom meals to clear.");
  if (window.confirm("Clear custom meals? Logged and AI meals stay saved.")) {
    state.mealLibrary = state.mealLibrary.filter((meal) => meal.sourcePlanId !== "custom");
    saveState();
    renderMealLibrary();
    showToast("Custom meals cleared.");
  }
});

document.querySelector("#reset-data").addEventListener("click", () => {
  if (window.confirm("Reset the planner to the original local data?")) {
    localStorage.removeItem(STORAGE_KEY);
    Object.assign(state, structuredClone(defaultState));
    setDefaultDate();
    renderAiSettings();
    renderAll();
    showToast("Planner reset.");
  }
});

setDefaultDate();
renderAiSettings();
renderAll();
