const applicant = {
  id: "A100001234",
  name: "Maria Teresa GARCÍA RAMÍREZ DE ARROYO",
  dob: "March 16, 1964",
  fin: "3211004444",
  cob: "Ecuador",
  parents: ["MIA RAMÍREZ", "Jose GARCÍA"],
  aliases: ["Maria LOPEZ", "Martina GARCIA", "Miya KAWASAKI"],
};

const candidates = [
  {
    id: "A100001678",
    name: "Maria Teresa GARCÍA RAMÍREZ",
    status: "EAD APPROVED",
    dob: "March 16, 1964",
    fin: "3211004444",
    cob: "Ecuador",
    parents: ["Mia Ramírez", "Jose García"],
    aliases: ["Maria LOPEZ"],
    children: ["Gloria Arroyo García", "Mario Arroyo García"],
    spouse: "Julio Arroyo",
    reason: "This identity has similar DOB, FIN, COB, and Parents.",
    pending: false,
  },
  {
    id: "A100014446",
    name: "Julia GARCÍA RAMÍREZ",
    status: "LPR PENDING",
    dob: "March 16, 1964",
    fin: "3211126166",
    cob: "Ecuador",
    parents: ["Julia RAMÍREZ", "Pablo GARCÍA MONCAYO"],
    reason: "This identity has similar DOB and COB.",
  },
  {
    id: "A100001234",
    name: "Victoria GUNNARSON",
    status: "ASYLUM APPROVED",
    dob: "May 20, 1970",
    fin: "32112235667",
    cob: "Canada",
    parents: ["Andy GUNNARSON", "Rosemary MILES"],
    reason: "This identity has similar A#.",
  },
  {
    id: "A100023667",
    name: "Maria GARCÍA RAMÍREZ",
    status: "ASYLUM DENIED",
    dob: "March 16, 1964",
    fin: "32098343434",
    cob: "Ecuador",
    parents: ["Josephina RAMÍREZ", "Jorge GARCÍA"],
    reason: "This identity has similar DOB and COB.",
  },
  {
    id: "A100086760",
    name: "María Teresa RAMÍREZ",
    status: "LPR PENDING",
    dob: "March 16, 1964",
    fin: "3210098765",
    cob: "Ecuador",
    parents: ["Mia RAMÍREZ", "Jose GARCÍA"],
    reason: "This identity has similar DOB and COB.",
  },
];

const savedViewingMode = (() => {
  try {
    return localStorage.getItem("cisViewingMode") || "light";
  } catch {
    return "light";
  }
})();

const state = {
  view: "queue",
  selectedId: null,
  primaryName: "",
  aliasChoice: "",
  primaryA: "",
  consolidatedA: "",
  notes: "",
  modal: null,
  submitting: false,
  submitted: false,
  toast: "",
  expandedHistoryIndex: 2,
  viewingMode: savedViewingMode === "dark" ? "dark" : "light",
};

const app = document.querySelector("#app");

const portraitAssets = {
  applicant: "assets/portrait-applicant-hi.png",
  main: "assets/portrait-applicant-hi.png",
  julia: "assets/portrait-julia-hi.png",
  victoria: "assets/portrait-victoria-hi.png",
  maria: "assets/portrait-maria-hi.png",
  large: "assets/portrait-applicant-hi.png",
  thumbs: [
    "assets/portrait-applicant-hi.png",
    "assets/portrait-julia-hi.png",
    "assets/portrait-victoria-hi.png",
    "assets/portrait-maria-hi.png",
    "assets/photo-thumb-05.png",
    "assets/photo-thumb-06.png",
    "assets/photo-thumb-07.png",
    "assets/photo-thumb-08.png",
  ],
};

const backgroundRows = [
  { year: "2019", type: "PERMANENT RESIDENCE", title: "I-485", status: "PENDING", dateLabel: "RECEIVED", date: "April 19, 2019", accent: "orange" },
  { year: "2019", type: "ASC APPOINTMENT", title: "Fort Lauderdale ASC", status: "COMPLETED", dateLabel: "TRANSACTION DATE", date: "April 19, 2019", accent: "blue" },
  { year: "2019", type: "WORK AUTHORIZATION", title: "I-765", status: "APPROVED", dateLabel: "PROCESS DATE", date: "March 20, 2019", accent: "blue" },
  { year: "2019", type: "AIR ENTRY", title: "Miami International (MIA)", status: "", dateLabel: "ENTRY DATE", date: "March 15, 2019", accent: "blue" },
  { year: "2019", type: "TSA", title: "Miami International (MIA)", status: "", dateLabel: "ENCOUNTER DATE", date: "March 15, 2019", accent: "blue" },
  { year: "2017", type: "AIR EXIT", title: "Dulles International (IAD)", status: "", dateLabel: "EXIT DATE", date: "April 20, 2017", accent: "gray" },
  { year: "2016", type: "IMMIGRATION COURT", title: "IJ Decision", status: "APPROVED", dateLabel: "COURT DATE", date: "December 20, 2016", accent: "blue" },
  { year: "2016", type: "BACKGROUND CHECK", title: "FBI", status: "WATCHLIST", dateLabel: "RESPONSE DATE", date: "October 10, 2016", accent: "red" },
  { year: "2016", type: "BACKGROUND CHECK", title: "DoD", status: "NO HIT", dateLabel: "RESPONSE DATE", date: "October 10, 2016", accent: "blue" },
  { year: "2016", type: "INTERNATIONAL SEARCH", title: "Canada", status: "MATCH", dateLabel: "RESPONSE DATE", date: "October 1, 2016", accent: "red" },
];

const timelineIcons = {
  "PERMANENT RESIDENCE": "assignment_ind",
  "ASC APPOINTMENT": "groups",
  "WORK AUTHORIZATION": "work",
  "AIR ENTRY": "flight_land",
  "TSA": "admin_panel_settings",
  "AIR EXIT": "flight_takeoff",
  "IMMIGRATION COURT": "gavel",
  "BACKGROUND CHECK": "person_search",
  "INTERNATIONAL SEARCH": "travel_explore",
};

const tooltipCopy = {
  COA: "COA: class of admission for the applicant's current status.",
  COB: "COB: country of birth.",
  COC: "COC: country of citizenship.",
  POE: "POE: port of entry where the applicant entered or was processed.",
  DOE: "DOE: date of entry recorded for this benefit.",
  DFO: "DFO: date of first encounter for this identity.",
  "RECEIPT #": "Receipt number associated with this card or case record.",
  "SITE CODE": "Internal office or production site code for this document.",
  "PROVISION OF LAW": "Legal category used to authorize this document.",
};

function escapeAttribute(value = "") {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#39;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function infoTooltip(label) {
  const copy = tooltipCopy[label] || `${label}: reference information for this field.`;
  const tooltip = escapeAttribute(copy);
  return `<span class="info-dot" tabindex="0" aria-label="${tooltip}" data-tooltip="${tooltip}">i</span>`;
}

function shell(content, options = {}) {
  const crumbs = options.crumbs
    ? `<div class="sub-nav">${options.crumbs
        .map((item, index) =>
          index === 0 ? `<span class="crumb">${item}</span>` : `<span>›</span><span class="crumb">${item}</span>`,
        )
        .join("")}</div>`
    : "";

  return `
    <div class="app-shell">
      <header class="top-nav">
        <div class="brand"><img class="seal" src="assets/dhs-seal.png" alt="" /><span>PCIS</span></div>
        <div class="nav-spacer"></div>
        <div class="nav-title">IDENTITY RESOLUTION QUEUE</div>
        <div class="hello">HELLO, DANIEL</div>
      </header>
      ${crumbs}
      ${content}
    </div>
  `;
}

function syncBodyViewingMode(mode = "light") {
  document.body.dataset.viewingMode = mode;
}

function modShell(content) {
  const isDark = state.viewingMode === "dark";
  return `
    <div class="mod-shell ${isDark ? "dark-mode" : "light-mode"}">
      <header class="mod-top-nav">
        <div class="brand"><img class="seal" src="assets/dhs-seal.png" alt="" /><span>CIS Mod</span></div>
        <div class="nav-spacer"></div>
        <div class="nav-title">IDENTITY QUEUE</div>
        <div class="hello">HELLO, DANIEL</div>
      </header>
      <div class="mod-sub-nav">
        <div class="viewing-mode">
          <span>Viewing Mode</span>
          <button class="mode-tab ${isDark ? "" : "active"}" type="button" data-action="set-viewing-mode" data-mode="light" aria-pressed="${!isDark}">Light</button>
          <button class="mode-tab ${isDark ? "active" : ""}" type="button" data-action="set-viewing-mode" data-mode="dark" aria-pressed="${isDark}">Dark</button>
        </div>
        <div class="mod-actions">
          <button class="outline-btn" type="button">View Applicant's Action history</button>
          <button class="outline-btn" type="button">Request data update</button>
        </div>
      </div>
      ${content}
    </div>
  `;
}

function portraitAsset(index = 0) {
  if (index === 1) return portraitAssets.julia;
  if (index === 2) return portraitAssets.victoria;
  if (index === 3) return portraitAssets.maria;
  if (index === 4) return portraitAssets.main;
  return portraitAssets.main;
}

function portrait(kind = "applicant", index = 0, classes = "") {
  const src = kind === "applicant" ? portraitAssets.applicant : kind === "large" ? portraitAssets.large : portraitAsset(index);
  return `<img class="portrait ${classes}" src="${src}" alt="" />`;
}

function statusClass(status = "") {
  if (status.includes("DENIED")) return "tone-red";
  if (status.includes("PENDING")) return "tone-orange";
  return "tone-blue";
}

function candidateId(candidate) {
  const matchingId = candidate.id === applicant.id;
  return `<span class="candidate-id ${matchingId ? "id-highlight" : ""}">${candidate.id}</span>`;
}

function applicantBlock(compact = false) {
  return `
    <section>
      <h3 class="applicant-title">Applicant's information</h3>
      <div class="identity-summary">
        <div class="portrait-card">
          ${portrait("applicant")}
          <button class="outline-btn" type="button">View application</button>
        </div>
        <div class="identity-copy">
          <div class="id-line">${applicant.id}</div>
          <div class="name-line">${applicant.name}</div>
          <div class="field-row ${compact ? "compact" : ""}">
            ${field("DOB", applicant.dob)}
            ${field("FIN", applicant.fin)}
            ${field("COB", applicant.cob)}
          </div>
          <div class="parents">
            <div class="label">PARENTS</div>
            <div class="copy">${applicant.parents.join("<br />")}</div>
          </div>
          <div class="aliases">
            <div class="label">ALIASES</div>
            <div class="chips">${applicant.aliases.map((alias) => `<span class="chip">${alias}</span>`).join("")}</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function field(label, value, highlighted = false, info = false, tone = "") {
  return `
    <div class="field ${tone ? `tone-${tone}` : ""}">
      <div class="label">${label}${info ? infoTooltip(label) : ""}</div>
      <div class="field-value">${highlighted ? `<span class="highlight">${value}</span>` : value}</div>
    </div>
  `;
}

function renderQueue() {
  syncBodyViewingMode("light");
  const selected = Boolean(state.selectedId);
  const pendingCandidate = state.submitted ? { ...candidates[0], pending: true } : candidates[0];
  const content = `
    <main class="queue-grid">
      <section class="left-pane">
        <div class="meta-row">
          <div><div class="label">PRIORITY</div><div class="value danger">High</div></div>
          <div><div class="label">TICKET #</div><div class="value">123789123</div></div>
          <div><div class="label">FORM TYPE</div><div class="value">I-485</div></div>
          <div><div class="label">TIME LEFT</div><div class="value danger">03h:30min</div></div>
        </div>
        ${applicantBlock()}
        <div class="left-rule"></div>
        <section class="empty-actions">
          <div class="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <circle cx="11" cy="11" r="6.2"></circle>
              <path d="m15.4 15.4 4.1 4.1"></path>
              <path d="M11 8.2v5.6M8.2 11h5.6"></path>
            </svg>
          </div>
          <div>
            <h2>Don't see potential matches?</h2>
            <p>These are the actions you can take on this identity.</p>
            <div class="button-row">
              <button class="secondary-btn" type="button">Assign new A#</button>
              <button class="primary-btn" type="button">Escalate identity resolution</button>
            </div>
          </div>
        </section>
      </section>
      <section class="right-pane">
        <h1 class="queue-heading">Select potential identity matches</h1>
        ${candidateRow(pendingCandidate, 0, true)}
        ${candidates.slice(1).map((candidate, index) => compactCandidate(candidate, index + 1)).join("")}
      </section>
    </main>
    ${summaryBar(selected)}
  `;

  app.innerHTML = shell(content) + renderToast() + renderModal();
  bindQueueEvents();
}

function candidateRow(candidate, index, expanded = false) {
  const isSelected = state.selectedId === candidate.id;
  return `
    <div class="candidate-row">
      <div class="check-wrap">
        <button class="checkbox ${isSelected ? "selected" : ""}" type="button" data-action="toggle-select" aria-label="Select ${candidate.id}">
          ${isSelected ? "✓" : ""}
        </button>
      </div>
      <article class="candidate-card ${isSelected ? "selected" : ""}">
        ${isSelected ? `<span class="selected-badge">Selected</span>` : ""}
        ${candidate.pending ? `<span class="selected-badge">Pending review</span>` : ""}
        <p class="card-note">${candidate.reason}</p>
        <div class="candidate-top">
          <div class="portrait-card">
            ${portrait("candidate", index, "small")}
            <button class="outline-btn" type="button" data-action="open-identity">View identity</button>
          </div>
          <div>
            <div>${candidateId(candidate)}<span class="candidate-status ${statusClass(candidate.status)}">${candidate.status}</span></div>
            <div class="candidate-name">${candidate.name}</div>
            <div class="field-row compact">
              ${field("DOB", candidate.dob, candidate.dob === applicant.dob)}
              ${field("FIN", candidate.fin, candidate.fin === applicant.fin)}
              ${field("COB", candidate.cob, candidate.cob === applicant.cob)}
            </div>
            <div class="parents match-parents">
              <div class="label">PARENTS</div>
              <div class="copy">${candidate.parents
                .map((parent) => `<span class="highlight">${parent}</span>`)
                .join("<br />")}</div>
            </div>
            <div class="aliases candidate-aliases">
              <div class="label">ALIASES</div>
              <div class="chips">${candidate.aliases.map((alias) => `<span class="chip">${alias}</span>`).join("")}</div>
            </div>
            <div class="relationship-grid">
              <div>
                <div class="label">CHILDREN</div>
                <div class="copy">${candidate.children
                  .map((child) => `<button class="link" type="button">${child}</button>`)
                  .join("<br />")}</div>
              </div>
              <div>
                <div class="label">SPOUSE</div>
                <div class="copy"><button class="link" type="button">${candidate.spouse}</button></div>
              </div>
            </div>
            <div class="detail-grid">
              <div class="detail-section-title">BIOGRAPHIC DATA</div>
              ${field("COB", candidate.cob, false, true)}
              ${field("POE", "Miami International (MIA)", false, true)}
              ${field("SSN", "123-45-6789")}
              ${field("COC", "Ecuador", false, true)}
              ${field("DOE", "June 18, 2015", false, true)}
              ${field("PASSPORT #", "41234567")}
              ${field("GENDER", "Female")}
              ${field("DFO", "August 10, 2016", false, true)}
              ${field("FBI#", "285927400")}
              <div class="detail-section-title">CARD DATA</div>
              ${cardData()}
            </div>
            ${candidate.pending ? pendingRibbon() : ""}
          </div>
        </div>
      </article>
    </div>
  `;
}

function compactCandidate(candidate, index) {
  return `
    <div class="candidate-row" style="margin-top: 0">
      <div class="check-wrap"><button class="checkbox" type="button" aria-label="Select ${candidate.id}"></button></div>
      <article class="candidate-card compact-match">
        <p class="card-note">${candidate.reason}</p>
        <div class="candidate-top">
          <div class="portrait-card">
            ${portrait("candidate", index, "small")}
            <button class="outline-btn" type="button" data-action="open-identity">View identity</button>
          </div>
          <div>
            <div>${candidateId(candidate)}<span class="candidate-status ${statusClass(candidate.status)}">${candidate.status}</span></div>
            <div class="candidate-name">${candidate.name}</div>
            <div class="field-row compact">
              ${field("DOB", candidate.dob, candidate.dob === applicant.dob)}
              ${field("FIN", candidate.fin)}
              ${field("COB", candidate.cob, candidate.cob === applicant.cob)}
            </div>
            <div class="parents">
              <div class="label">PARENTS</div>
              <div class="copy">${candidate.parents.join("<br />")}</div>
            </div>
          </div>
        </div>
      </article>
    </div>
  `;
}

function cardData() {
  return `
    <div class="card-data-group">
      <div class="card-data-heading">GREEN CARD</div>
      <div></div>
      <div></div>
      ${field("STATUS", "NOT PRINTED", false, false, "orange")}
      ${field("EXPIRES", "TBD")}
      <div></div>
      <div class="card-data-heading">EAD CARD</div>
      <div class="field-value card-link"><button class="link" type="button" data-action="open-ead">View card</button></div>
      <div></div>
      ${field("STATUS", "PRINTED", false, false, "blue")}
      ${field("EXPIRES", "December 10, 2019")}
      ${field("RECEIPT #", "89765543182754", false, true)}
    </div>
  `;
}

function summaryBar(visible) {
  return `
    <aside class="summary-bar ${visible ? "visible" : ""}" aria-live="polite">
      <div class="selected-summary">
        <div class="check-circle">✓</div>
        <div>
          <div class="summary-title">1 identity selected</div>
          <div class="summary-subtitle">A100001678 · Maria Teresa GARCÍA RAMÍREZ</div>
        </div>
      </div>
      <div>
        <div class="label">Matching datapoints</div>
        <div class="match-chips">
          <span class="match-chip">DOB</span>
          <span class="match-chip">FIN</span>
          <span class="match-chip">COB</span>
          <span class="match-chip">Parents</span>
          <span class="summary-copy">Similar DOB, FIN, COB, and parents</span>
        </div>
      </div>
      <div class="summary-actions">
        <button class="secondary-btn" type="button" data-action="clear-selection">Clear</button>
        <button class="primary-btn" type="button" data-action="resolve">Resolve</button>
      </div>
    </aside>
  `;
}

function pendingRibbon() {
  return `
    <div class="pending-ribbon">
      <strong>Status: Pending final resolution.</strong>
      This candidate and your notes were sent to a final evaluator.
    </div>
  `;
}

function setView(view, hash = "") {
  state.view = view;
  if (hash) history.replaceState(null, "", hash);
}

function bindQueueEvents() {
  document.querySelectorAll("[data-action='toggle-select']").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = state.selectedId ? null : candidates[0].id;
      renderQueue();
    });
  });
  document.querySelector("[data-action='clear-selection']")?.addEventListener("click", () => {
    state.selectedId = null;
    renderQueue();
  });
  document.querySelector("[data-action='resolve']")?.addEventListener("click", () => {
    setView("resolve", "#resolve");
    renderResolve();
  });
  document.querySelectorAll("[data-action='open-identity']").forEach((button) => {
    button.addEventListener("click", () => {
      setView("identity", "#identity");
      renderIdentityDetail();
    });
  });
  document.querySelector("[data-action='open-ead']")?.addEventListener("click", () => {
    state.modal = "ead";
    renderQueue();
  });
  bindModalEvents();
}

function renderResolve() {
  syncBodyViewingMode("light");
  const valid = Boolean(state.primaryName && state.primaryA);
  const content = `
    <main class="resolve-page">
      <div class="resolve-content">
        <section class="resolve-intro">
          <h1>Assign primary information</h1>
          <p class="helper">Review the identities to link and select the primary information. You will have one more chance to review your requested updates.</p>
        </section>
        ${applicantBlock(true)}
        <h3 class="resolve-section-title">Selected identity</h3>
        ${selectedIdentityCard()}
        ${resolveSteps(valid)}
      </div>
    </main>
  `;
  app.innerHTML = shell(content, { crumbs: ["Resolve identity", "Link"] }) + renderModal();
  bindResolveEvents();
}

function selectedIdentityCard() {
  const candidate = candidates[0];
  return `
    <article class="selected-identity-card">
      <p class="card-note">${candidate.reason.replace("Parents", "PARENT 1 and PARENT 2")}</p>
      <div class="compact-card">
        <div class="portrait-card">
          ${portrait("candidate", 0, "small")}
          <button class="outline-btn" type="button" data-action="open-identity">View identity</button>
        </div>
        <div>
          <div>${candidateId(candidate)}<span class="candidate-status ${statusClass(candidate.status)}">${candidate.status}</span></div>
          <div class="candidate-name">${candidate.name}</div>
          <div class="field-row compact">
            ${field("DOB", candidate.dob, true)}
            ${field("FIN", candidate.fin, true)}
            ${field("COB", candidate.cob, true)}
          </div>
          <div class="parents match-parents">
            <div class="label">PARENTS</div>
            <div class="copy"><span class="highlight">Mia Ramírez</span><br /><span class="highlight">Jose García</span></div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function resolveSteps(valid) {
  const nameComplete = Boolean(state.primaryName);
  const aComplete = Boolean(state.primaryA);
  return `
    <section class="step">
      <div class="step-header">
        <h3>1. Assign a primary name</h3>
        <span class="step-badge">${nameComplete ? "Complete" : "Required"}</span>
      </div>
      <p class="helper">Choose which name should become the primary identity name. Alias options stay hidden until a primary name is selected.</p>
      <div class="radio-list">
        ${radioOption("primary-name", applicant.name, applicant.name, state.primaryName)}
        ${radioOption("primary-name", candidates[0].name, candidates[0].name, state.primaryName)}
      </div>
      ${
        nameComplete
          ? `<div class="disclosure">
              <h3>Add "Maria Teresa GARCÍA RAMÍREZ" as an alias?</h3>
              <div class="radio-list">
                ${radioOption("alias-choice", "Yes", "yes", state.aliasChoice)}
                ${radioOption("alias-choice", "No", "no", state.aliasChoice)}
              </div>
            </div>`
          : ""
      }
    </section>
    <section class="step ${nameComplete ? "" : "disabled"}">
      <div class="step-header">
        <h3>2. Assign a primary A#</h3>
        <span class="step-badge ${nameComplete ? "" : "locked"}">${!nameComplete ? "Locked" : aComplete ? "Complete" : "Required"}</span>
      </div>
      ${
        nameComplete
          ? `<p class="helper">Select the primary A-number before deciding whether to keep the other A-number as consolidated.</p>
             <div class="radio-list">
              ${radioOption("primary-a", applicant.id, applicant.id, state.primaryA)}
              ${radioOption("primary-a", candidates[0].id, candidates[0].id, state.primaryA)}
             </div>`
          : `<p class="helper">This section unlocks after a primary name has been assigned.</p>`
      }
      ${
        aComplete
          ? `<div class="disclosure">
              <h3>Keep "${otherANumber()}" as a consolidated A# for this identity?</h3>
              <div class="radio-list">
                ${radioOption("consolidated-a", "Yes", "yes", state.consolidatedA)}
                ${radioOption("consolidated-a", "No", "no", state.consolidatedA)}
              </div>
            </div>`
          : ""
      }
    </section>
    <section class="step ${valid ? "" : "disabled"}">
      <div class="step-header">
        <h3>3. Provide a reason for linking these identities and any additional information.</h3>
      </div>
      <p class="helper">${valid ? "Notes will be included for final evaluator review." : "Complete the primary name and A-number selections to add final notes."}</p>
      <textarea class="notes-field" ${valid ? "" : "disabled"} placeholder="Add resolution notes for final evaluator review">${state.notes}</textarea>
      ${
        valid
          ? `<div class="attachment-row">
              <button class="link" type="button">Add a link</button>
              <button class="link" type="button">Attach a document</button>
            </div>`
          : ""
      }
      <div class="resolve-actions">
        <button class="primary-btn" type="button" data-action="submit-resolution" ${valid && !state.submitting ? "" : "disabled"}>
          ${state.submitting ? "Sending package..." : "Send for Final Review"}
        </button>
        <button class="cancel-link" type="button" data-action="cancel-resolve">Cancel</button>
      </div>
    </section>
  `;
}

function radioOption(name, label, value, selectedValue) {
  return `
    <label class="option">
      <input type="radio" name="${name}" value="${value}" ${selectedValue === value ? "checked" : ""} />
      <span>${label}</span>
    </label>
  `;
}

function otherANumber() {
  return state.primaryA === applicant.id ? candidates[0].id : applicant.id;
}

function bindResolveEvents() {
  document.querySelectorAll("input[name='primary-name']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.primaryName = event.target.value;
      if (!state.aliasChoice) state.aliasChoice = "yes";
      renderResolve();
    });
  });
  document.querySelectorAll("input[name='alias-choice']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.aliasChoice = event.target.value;
      renderResolve();
    });
  });
  document.querySelectorAll("input[name='primary-a']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.primaryA = event.target.value;
      state.consolidatedA = "";
      renderResolve();
    });
  });
  document.querySelectorAll("input[name='consolidated-a']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.consolidatedA = event.target.value;
      renderResolve();
    });
  });
  document.querySelector(".notes-field")?.addEventListener("input", (event) => {
    state.notes = event.target.value;
  });
  document.querySelector("[data-action='cancel-resolve']")?.addEventListener("click", () => {
    state.view = "queue";
    renderQueue();
  });
  document.querySelector("[data-action='submit-resolution']")?.addEventListener("click", () => {
    state.submitting = true;
    renderResolve();
    window.setTimeout(() => {
      state.submitting = false;
      state.submitted = true;
      state.selectedId = null;
      state.view = "queue";
      state.toast = "Resolution package sent";
      history.replaceState(null, "", "#pending");
      renderQueue();
    }, 850);
  });
  document.querySelector("[data-action='open-photo']")?.addEventListener("click", () => {
    state.modal = "photo";
    renderResolve();
  });
  document.querySelector("[data-action='open-identity']")?.addEventListener("click", () => {
    setView("identity", "#identity");
    renderIdentityDetail();
  });
  bindModalEvents();
}

function renderIdentityDetail() {
  syncBodyViewingMode(state.viewingMode);
  const candidate = candidates[0];
  const content = `
    <nav class="mod-breadcrumb" aria-label="Breadcrumb">
      <button class="breadcrumb-link" type="button" data-action="return-queue">Identity Resolution Queue</button>
      <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      <span>Applicant Identity</span>
    </nav>
    <main class="identity-detail-page">
      <section class="identity-detail-grid">
        <aside class="identity-side">
          <img class="identity-main-photo" src="${portraitAssets.applicant}" alt="" />
          <button class="link see-more-link" type="button" data-action="open-photo">See more</button>
          <div class="identity-verified-block">
            <div class="label">A# <span class="verified-icon">✓</span></div>
            <div class="big-id">${applicant.id}</div>
            <button class="link" type="button">See consolidated</button>
          </div>
          <div class="identity-verified-block">
            <div class="label">FIN <span class="verified-icon">✓</span></div>
            <div class="big-id">3211-00-4444</div>
          </div>
          <button class="outline-btn mini-action" type="button">⌁ Stacks</button>
          <button class="outline-btn mini-action" type="button">⌁ Rails</button>
        </aside>
        <section class="identity-main">
          <div class="name-grid">
            ${identityNameField("FIRST", "María")}
            ${identityNameField("MIDDLE", "Teresa")}
            ${identityNameField("LAST", "GARCÍA RAMÍREZ DE ARROYO", "wide")}
          </div>
          <div class="profile-facts">
            ${identityFact("COA", "K2", true)}
            ${identityFact("STATUS", "LPR Pending", false, "See previous")}
            ${identityFact("DOB", applicant.dob, false, "See more")}
          </div>
          <div class="identity-alias-row">
            <div class="label">ALIASES</div>
            <div class="chips">
              <span class="chip">Maria Lopez</span>
              <span class="chip">Martina Maria</span>
              <span class="chip">Miya Kawasaki</span>
              <button class="link" type="button">See more</button>
            </div>
          </div>
          <div class="address-block">
            <div class="label">ADDRESS</div>
            <div>123 4th St. Miami, FL 33131 <button class="link" type="button">See previous</button></div>
          </div>
          <div class="detail-divider"></div>
          <section class="identity-section">
            <h3>BIOGRAPHIC DATA</h3>
            <div class="identity-info-grid">
              ${field("COB", candidate.cob, false, true)}
              ${field("POE", "Miami International (MIA)", false, true)}
              ${field("SSN", "123-45-6789")}
              ${field("COC", candidate.cob, false, true)}
              ${field("DOE", "June 18, 2015", false, true)}
              ${field("PASSPORT #", "41234567")}
              ${field("GENDER", "Female")}
              ${field("DFO", "August 10, 2016", false, true)}
              ${field("FBI#", "285927400")}
            </div>
          </section>
          <div class="detail-divider"></div>
          <section class="identity-section relationships-section">
            <h3>RELATIONSHIPS</h3>
            <div class="identity-info-grid">
              <div>
                <div class="label">PARENTS</div>
                <button class="link stacked-link" type="button">Mia Ramírez</button>
                <button class="link stacked-link" type="button">Jose García</button>
              </div>
              <div>
                <div class="label">SPOUSE</div>
                <button class="link stacked-link" type="button">${candidate.spouse}</button>
              </div>
              <div>
                <div class="label">ATTORNEY</div>
                <div>Hunter Fox</div>
                <button class="link stacked-link" type="button">See previous</button>
              </div>
              <div>
                <div class="label">CHILDREN</div>
                ${candidate.children.map((child) => `<button class="link stacked-link" type="button">${child}</button>`).join("")}
              </div>
            </div>
          </section>
          <div class="detail-divider"></div>
          <section class="identity-section">
            <h3>CARD DATA</h3>
            ${identityCardData()}
          </section>
        </section>
      </section>
      <section class="background-section">
        <div class="background-rule"></div>
        <h2>Background information</h2>
        <div class="background-layout">
          ${backgroundFilters()}
          <div class="timeline-list">
            ${backgroundRows.map((row, index) => backgroundRow(row, index)).join("")}
          </div>
        </div>
      </section>
    </main>
  `;

  app.innerHTML = modShell(content) + renderModal();
  bindIdentityEvents();
}

function identityNameField(label, value, variant = "") {
  return `
    <div class="identity-name-field ${variant}">
      <div class="label">${label}</div>
      <div>${value}</div>
    </div>
  `;
}

function identityFact(label, value, info = false, link = "") {
  return `
    <div>
      <div class="label">${label}${info ? infoTooltip(label) : ""}</div>
      <div class="identity-fact-value">${value}</div>
      ${link ? `<button class="link" type="button">${link}</button>` : ""}
    </div>
  `;
}

function identityCardData() {
  return `
    <div class="identity-card-data">
      <div>
        <div class="card-data-heading">GREEN CARD</div>
        <div class="identity-card-row">
          ${field("STATUS", "READY", false, false, "ready")}
          ${field("EXPIRES", "TBD")}
          ${field("SITE CODE", "A123", false, true)}
        </div>
        <button class="outline-btn card-trigger" type="button" data-action="open-green-card">View draft green card</button>
      </div>
      <div>
        <div class="card-data-heading">EAD CARD <button class="link card-heading-link" type="button" data-action="open-ead">View card</button></div>
        <div class="identity-card-row ead-card-row">
          ${field("STATUS", "PRINTED", false, false, "blue")}
          ${field("EXPIRES", "December 10, 2019")}
          ${field("SITE CODE", "A123", false, true)}
          ${field("PROVISION OF LAW", "B23", false, true)}
        </div>
      </div>
    </div>
  `;
}

function backgroundFilters() {
  const groups = [
    ["Background checks", "FBI Background Check", "DoD Background Check", "International Search", "US-Visit"],
    ["Benefits", "I-485 Permanent Residence", "I-765 Work Authorization", "I-94 Travel Visa"],
    ["Court", "Court dates"],
    ["Encounters", "Name Check Hits", "Fingerprint Hits", "Arrests"],
    ["Travel", "Arrivals", "Departures"],
    ["Saved Filters", "George's Favorite Filter"],
  ];
  return `
    <aside class="background-filters">
      <label><input type="checkbox" checked /> Select all <span>(9)</span></label>
      ${groups
        .map(
          ([group, ...items]) => `
            <div class="filter-group">
              <label><input type="checkbox" checked /> ${group} <span>(${items.length})</span></label>
              ${items.map((item) => `<label class="filter-child"><input type="checkbox" checked /> ${item}</label>`).join("")}
            </div>
          `,
        )
        .join("")}
    </aside>
  `;
}

function backgroundRow(row, index) {
  const showYear = index === 0 || backgroundRows[index - 1].year !== row.year;
  const icon = timelineIcons[row.type] || "article";
  const expanded = state.expandedHistoryIndex === index;
  return `
    ${showYear ? `<h3 class="timeline-year">${row.year}</h3>` : ""}
    <article class="timeline-card ${expanded ? "expanded" : ""}" data-history-index="${index}" role="button" tabindex="0" aria-expanded="${expanded}">
      <div class="timeline-accent ${row.accent}"></div>
      <div class="timeline-icon" aria-hidden="true">
        <span class="material-symbols-outlined">${icon}</span>
      </div>
      <div>
        <div class="label">${row.type}</div>
        <div class="timeline-title">${row.title}</div>
        ${expanded ? expandedTimelineDetail(row, index) : ""}
      </div>
      <div class="timeline-status ${row.status.toLowerCase().replaceAll(" ", "-")}">${row.status}</div>
      <div>
        <div class="label">${row.dateLabel}</div>
        <div>${row.date}</div>
      </div>
      <button class="timeline-caret" type="button" aria-label="${expanded ? "Collapse" : "Expand"} ${row.type}">
        <span class="material-symbols-outlined">${expanded ? "keyboard_arrow_up" : "keyboard_arrow_down"}</span>
      </button>
    </article>
  `;
}

function expandedTimelineDetail(row, index) {
  const details = [
    {
      summary: "Initial permanent residence package is open for adjudication.",
      meta: [["Receipt #", "IOE0923847125"], ["Office", "Washington Field Office"], ["Last update", "April 19, 2019"]],
      notes: ["Priority date captured", "Biometrics linked to current A#"],
    },
    {
      summary: "Biometrics appointment completed and associated with the applicant record.",
      meta: [["Appointment ID", "ASC-FTL-041919"], ["Location", "Fort Lauderdale ASC"], ["Result", "Completed"]],
      notes: ["Photo captured", "Fingerprints available for background checks"],
    },
    {
      summary: "Employment authorization approved after review of supporting I-485 record.",
      meta: [["Receipt #", "MSC1992731142"], ["Card status", "Printed"], ["Last update", "March 20, 2019"]],
      notes: ["Draft card image available", "Linked to current mailing address"],
      progress: true,
    },
    {
      summary: "Arrival record received from port-of-entry encounter data.",
      meta: [["Document", "I-94"], ["Carrier", "Aero Nacional 431"], ["Class", "K2"]],
      notes: ["Entry matched passport 41234567", "POE set to Miami International"],
    },
    {
      summary: "Travel encounter matched against TSA screening event.",
      meta: [["Encounter ID", "TSA-2019-0315-88"], ["Terminal", "MIA Central"], ["Disposition", "Cleared"]],
      notes: ["Name variant matched", "No active hold at encounter time"],
    },
    {
      summary: "Departure history imported from air exit manifest.",
      meta: [["Document", "I-94"], ["Carrier", "Capital Air 218"], ["Destination", "IAD outbound"]],
      notes: ["Historical travel event", "No associated enforcement action"],
    },
    {
      summary: "Immigration judge decision recorded in court history.",
      meta: [["Court", "Miami Immigration Court"], ["Proceeding", "Master calendar"], ["Decision", "Approved"]],
      notes: ["Order added to case file", "Attorney Hunter Fox on record"],
    },
    {
      summary: "FBI response returned a watchlist indicator requiring evaluator review.",
      meta: [["Source", "FBI Name Check"], ["Response", "Watchlist"], ["Confidence", "Moderate"]],
      notes: ["Name and DOB overlap", "Manual review required before final decision"],
    },
    {
      summary: "Department of Defense check returned no active derogatory result.",
      meta: [["Source", "DoD"], ["Response", "No hit"], ["Confidence", "High"]],
      notes: ["Search included FIN and passport", "No additional action required"],
    },
    {
      summary: "International search returned a possible match in Canadian records.",
      meta: [["Source", "Canada"], ["Response", "Match"], ["Confidence", "Low"]],
      notes: ["COB and DOB overlap", "Needs evaluator confirmation"],
    },
  ][index];

  return `
    <div class="timeline-expanded">
      <p>${details.summary}</p>
      <div class="timeline-meta-grid">
        ${details.meta.map(([label, value]) => `<div><div class="label">${label}</div><div>${value}</div></div>`).join("")}
      </div>
      ${
        details.progress
          ? `
            <div class="progress-line"><span></span><span></span><span></span></div>
            <div class="progress-labels">
              <div><strong>FILE RECEIVED</strong><br />Dec. 27, 2018</div>
              <div><strong>ASC APPOINTMENT</strong><br />Jan. 7, 2019</div>
              <div><strong>CARD PRINTED</strong><br />Mar. 20, 2019</div>
            </div>
          `
          : ""
      }
      <div class="timeline-notes">
        ${details.notes.map((note) => `<div>${note}</div>`).join("")}
      </div>
      <div class="case-links">
        <button class="link" type="button">Stacks</button>
        <button class="link" type="button">Rails</button>
      </div>
    </div>
  `;
}

function bindIdentityEvents() {
  document.querySelector("[data-action='return-queue']")?.addEventListener("click", () => {
    state.view = "queue";
    state.modal = null;
    history.replaceState(null, "", state.selectedId ? "#selected" : "#queue");
    renderQueue();
  });
  document.querySelectorAll("[data-action='set-viewing-mode']").forEach((button) => {
    button.addEventListener("click", () => {
      state.viewingMode = button.dataset.mode === "dark" ? "dark" : "light";
      try {
        localStorage.setItem("cisViewingMode", state.viewingMode);
      } catch {
        // Ignore storage failures; the in-page switch still works.
      }
      history.replaceState(null, "", state.viewingMode === "dark" ? "#identity-dark" : "#identity");
      renderIdentityDetail();
    });
  });
  document.querySelectorAll(".timeline-card").forEach((row) => {
    const toggleRow = (event) => {
      if (event.target.closest?.(".timeline-expanded .link")) return;
      const index = Number(row.dataset.historyIndex);
      state.expandedHistoryIndex = state.expandedHistoryIndex === index ? null : index;
      renderIdentityDetail();
    };
    row.addEventListener("click", toggleRow);
    row.addEventListener("keydown", (event) => {
      if (event.target !== row) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleRow(event);
    });
  });
  document.querySelector("[data-action='open-photo']")?.addEventListener("click", () => {
    state.modal = "photo";
    renderIdentityDetail();
  });
  document.querySelector("[data-action='open-green-card']")?.addEventListener("click", () => {
    state.modal = "green-card";
    renderIdentityDetail();
  });
  document.querySelector("[data-action='open-ead']")?.addEventListener("click", () => {
    state.modal = "ead";
    renderIdentityDetail();
  });
  bindModalEvents();
}

function renderToast() {
  if (!state.toast) return "";
  return `
    <div class="toast" role="status">
      <h3>${state.toast}</h3>
      <p class="helper">1 linked identity candidate and your notes were sent to a final evaluator.</p>
      <p class="helper"><strong>Status:</strong> Pending final resolution</p>
    </div>
  `;
}

function renderModal() {
  if (state.modal === "photo") return photoOverlay();
  if (state.modal === "ead") return eadOverlay();
  if (state.modal === "green-card") return greenCardOverlay();
  return "";
}

function photoOverlay() {
  const thumbs = portraitAssets.thumbs
    .map((src, index) => `<img class="portrait tiny thumb ${index === 0 ? "selected" : ""}" src="${src}" alt="" />`)
    .join("");
  return `
    <div class="overlay-backdrop">
      <div class="photo-modal" role="dialog" aria-modal="true" aria-label="Photo viewer">
        <button class="modal-close" type="button" data-action="close-modal">×</button>
        <div class="photo-title">10 photos <button class="link" type="button">View as a grid</button></div>
        <div class="photo-viewer">
          <img class="portrait large-photo" src="${portraitAssets.large}" alt="" />
          <div class="photo-meta">
            <div><div class="label">DATE TAKEN</div><div class="value">March 15, 2019</div></div>
            <div><div class="label">RECEIPT #</div><div class="value">IOE1234876542</div></div>
            <div><div class="label">REASON</div><div class="value">ASC Appointment</div></div>
          </div>
          <button class="link" type="button">View more details</button>
        </div>
        <div class="thumb-row">
          <button class="carousel-arrow" type="button">‹</button>
          ${thumbs}
          <button class="carousel-arrow" type="button">›</button>
        </div>
      </div>
    </div>
  `;
}

function eadOverlay() {
  return `
    <div class="overlay-backdrop">
      <div class="ead-panel" role="dialog" aria-modal="true" aria-label="EAD card">
        <button class="modal-close" type="button" data-action="close-modal">×</button>
        <h2>EAD card</h2>
        <img class="ead-art" src="assets/ead-front.png" alt="" />
        <div class="ead-label">EAD Front</div>
        <img class="ead-art back" src="assets/ead-back.png" alt="" />
        <div class="ead-label">EAD Back</div>
      </div>
    </div>
  `;
}

function greenCardOverlay() {
  return `
    <div class="overlay-backdrop">
      <div class="green-card-panel" role="dialog" aria-modal="true" aria-label="Draft green card">
        <button class="modal-close" type="button" data-action="close-modal">×</button>
        <h2>Draft green card</h2>
        <div class="draft-card">
          <div class="draft-card-band">UNITED STATES OF AMERICA · PERMANENT RESIDENT CARD</div>
          <div class="draft-card-body">
            <img src="${portraitAssets.applicant}" alt="" />
            <div class="draft-fields">
              <div><span>Surname</span><strong>GARCÍA RAMÍREZ DE ARROYO</strong></div>
              <div><span>Given Name</span><strong>MARIA TERESA</strong></div>
              <div class="draft-field-grid">
                <div><span>USCIS#</span><strong>${applicant.id.replace("A", "")}</strong></div>
                <div><span>Category</span><strong>K2</strong></div>
                <div><span>Country of Birth</span><strong>ECUADOR</strong></div>
                <div><span>Date of Birth</span><strong>16 MAR 1964</strong></div>
                <div><span>Resident Since</span><strong>DRAFT</strong></div>
                <div><span>Card Expires</span><strong>TBD</strong></div>
              </div>
            </div>
          </div>
          <div class="draft-mrz">GRC&lt;GARCIA&lt;RAMIREZ&lt;DE&lt;ARROYO&lt;&lt;MARIA&lt;TERESA&lt;&lt;&lt;<br />${applicant.id}ECU640316F&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;DRAFT</div>
        </div>
        <p class="helper">Draft preview generated from the selected identity record. Final production requires evaluator approval.</p>
      </div>
    </div>
  `;
}

function bindModalEvents() {
  document.querySelector("[data-action='close-modal']")?.addEventListener("click", () => {
    state.modal = null;
    if (state.view === "resolve") renderResolve();
    else if (state.view === "identity") renderIdentityDetail();
    else renderQueue();
  });
}

function hydrateFromHash() {
  const hash = window.location.hash;
  if (hash === "#selected") state.selectedId = candidates[0].id;
  if (hash === "#resolve" || hash === "#resolve-name" || hash === "#resolve-a") {
    state.view = "resolve";
    state.selectedId = candidates[0].id;
  }
  if (hash === "#identity" || hash === "#identity-dark" || hash === "#photo" || hash === "#green-card") {
    state.view = "identity";
  }
  if (hash === "#identity-dark") state.viewingMode = "dark";
  if (hash === "#resolve-name" || hash === "#resolve-a") {
    state.primaryName = applicant.name;
    state.aliasChoice = "yes";
  }
  if (hash === "#resolve-a") {
    state.primaryA = applicant.id;
  }
  if (hash === "#photo") state.modal = "photo";
  if (hash === "#ead") state.modal = "ead";
  if (hash === "#green-card") state.modal = "green-card";
  if (hash === "#pending") {
    state.submitted = true;
    state.selectedId = null;
    state.toast = "Resolution package sent";
  }
}

hydrateFromHash();
if (state.view === "resolve") renderResolve();
else if (state.view === "identity") renderIdentityDetail();
else renderQueue();
