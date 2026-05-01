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
];

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
};

const app = document.querySelector("#app");

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
        <div class="brand"><span class="seal" aria-hidden="true"></span><span>PCIS</span></div>
        <div class="nav-spacer"></div>
        <div class="nav-title">IDENTITY RESOLUTION QUEUE</div>
        <div class="hello">HELLO, DANIEL</div>
      </header>
      ${crumbs}
      ${content}
    </div>
  `;
}

function portraitClass(index = 0) {
  return index === 1 ? "alt-one" : index === 2 ? "alt-two" : "";
}

function applicantBlock(compact = false) {
  return `
    <section>
      <h3 class="applicant-title">Applicant's information</h3>
      <div class="identity-summary">
        <div class="portrait-card">
          <div class="portrait" aria-label="Applicant portrait"></div>
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

function field(label, value, highlighted = false) {
  return `
    <div class="field">
      <div class="label">${label}</div>
      <div class="field-value">${highlighted ? `<span class="highlight">${value}</span>` : value}</div>
    </div>
  `;
}

function renderQueue() {
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
          <h2>Don't see potential matches?</h2>
          <p>These are the actions you can take on this identity.</p>
          <div class="button-row">
            <button class="primary-btn" type="button">Assign new Arf</button>
            <button class="primary-btn" type="button">Escalate identity resolution</button>
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
            <div class="portrait small ${portraitClass(index)}"></div>
            <button class="outline-btn" type="button" data-action="open-photo">View identity</button>
          </div>
          <div>
            <div><span class="candidate-id">${candidate.id}</span><span class="candidate-status">${candidate.status}</span></div>
            <div class="candidate-name">${candidate.name}</div>
            <div class="field-row compact">
              ${field("DOB", candidate.dob, candidate.dob === applicant.dob)}
              ${field("FIN", candidate.fin, candidate.fin === applicant.fin)}
              ${field("COB", candidate.cob, candidate.cob === applicant.cob)}
            </div>
            <div class="parents">
              <div class="label">PARENTS</div>
              <div class="copy">${candidate.parents
                .map((parent) => `<span class="highlight">${parent}</span>`)
                .join("<br />")}</div>
            </div>
            <div class="parents">
              <div class="label">ALIASES</div>
              <div class="chips">${candidate.aliases.map((alias) => `<span class="chip">${alias}</span>`).join("")}</div>
            </div>
            <div class="detail-grid">
              <div class="detail-section-title">BIOGRAPHIC DATA</div>
              ${field("COB", candidate.cob)}
              ${field("POE", "Miami International (MIA)")}
              ${field("SSN", "123-45-6789")}
              ${field("COC", "Ecuador")}
              ${field("DOE", "June 18, 2015")}
              ${field("PASSPORT #", "41234567")}
              ${field("GENDER", "Female")}
              ${field("DFO", "August 10, 2016")}
              ${field("FBI#", "285927400")}
              <div class="detail-section-title">CARD DATA</div>
              ${field("GREEN CARD", "NOT PRINTED")}
              ${field("EAD CARD", "PRINTED")}
              <div class="field">
                <div class="label">CARD</div>
                <div class="field-value"><button class="link" type="button" data-action="open-ead">View card</button></div>
              </div>
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
      <article class="candidate-card" style="min-height: 260px; padding-bottom: 28px">
        <p class="card-note">${candidate.reason}</p>
        <div class="candidate-top">
          <div class="portrait-card">
            <div class="portrait small ${portraitClass(index)}"></div>
            <button class="outline-btn" type="button">View identity</button>
          </div>
          <div>
            <div><span class="candidate-id">${candidate.id}</span><span class="candidate-status">${candidate.status}</span></div>
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
    state.view = "resolve";
    renderResolve();
  });
  document.querySelector("[data-action='open-photo']")?.addEventListener("click", () => {
    state.modal = "photo";
    renderQueue();
  });
  document.querySelector("[data-action='open-ead']")?.addEventListener("click", () => {
    state.modal = "ead";
    renderQueue();
  });
  bindModalEvents();
}

function renderResolve() {
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
          <div class="portrait small"></div>
          <button class="outline-btn" type="button" data-action="open-photo">View identity</button>
        </div>
        <div>
          <div><span class="candidate-id">${candidate.id}</span><span class="candidate-status">${candidate.status}</span></div>
          <div class="candidate-name">${candidate.name}</div>
          <div class="field-row compact">
            ${field("DOB", candidate.dob, true)}
            ${field("FIN", candidate.fin, true)}
            ${field("COB", candidate.cob, true)}
          </div>
          <div class="parents">
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
      renderQueue();
    }, 850);
  });
  document.querySelector("[data-action='open-photo']")?.addEventListener("click", () => {
    state.modal = "photo";
    renderResolve();
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
  return "";
}

function photoOverlay() {
  const thumbs = Array.from({ length: 8 }, (_, index) => `<div class="portrait tiny thumb ${index === 0 ? "selected" : portraitClass(index % 3)}"></div>`).join("");
  return `
    <div class="overlay-backdrop">
      <div class="photo-modal" role="dialog" aria-modal="true" aria-label="Photo viewer">
        <button class="modal-close" type="button" data-action="close-modal">×</button>
        <div class="photo-title">10 photos <button class="link" type="button">View as a grid</button></div>
        <div class="photo-viewer">
          <div class="portrait large-photo"></div>
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
        <div class="ead-art">
          <div class="ead-card-copy">SPECIMEN<br />TEST V<br />C09&nbsp;&nbsp;&nbsp;SRC0000000773</div>
        </div>
        <div class="ead-label">EAD Front</div>
        <div class="ead-art back"></div>
        <div class="ead-label">EAD Back</div>
      </div>
    </div>
  `;
}

function bindModalEvents() {
  document.querySelector("[data-action='close-modal']")?.addEventListener("click", () => {
    state.modal = null;
    state.view === "resolve" ? renderResolve() : renderQueue();
  });
}

renderQueue();
