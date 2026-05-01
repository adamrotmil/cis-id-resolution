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
  selectedIds: [],
  primaryName: "",
  aliasChoice: "",
  primaryA: "",
  consolidatedA: "",
  notes: "",
  modal: null,
  submitting: false,
  submitted: false,
  toast: "",
  actionSubmitting: "",
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
          index === 0
            ? `<span class="crumb">${item}</span>`
            : `${icon("chevron_right", "crumb-separator")}<span class="crumb">${item}</span>`,
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
        <div class="brand"><img class="seal" src="assets/dhs-seal.png" alt="" /><span>PCIS</span></div>
        <div class="nav-spacer"></div>
        <div class="nav-title">IDENTITY RESOLUTION QUEUE</div>
        <div class="hello">HELLO, DANIEL</div>
      </header>
      <div class="mod-sub-nav">
        <div class="viewing-mode">
          <span>Viewing Mode</span>
          ${buttonComponent("Light", { variant: "mode", action: "set-viewing-mode", className: isDark ? "" : "active", attrs: { "data-mode": "light", "aria-pressed": !isDark } })}
          ${buttonComponent("Dark", { variant: "mode", action: "set-viewing-mode", className: isDark ? "active" : "", attrs: { "data-mode": "dark", "aria-pressed": isDark } })}
        </div>
        <div class="mod-actions">
          ${buttonComponent("View Applicant's Action history", { variant: "outline" })}
          ${buttonComponent("Request data update", { variant: "outline" })}
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

function getSelectedIds() {
  if (Array.isArray(state.selectedIds) && state.selectedIds.length) return state.selectedIds;
  return state.selectedId ? [state.selectedId] : [];
}

function setSelectedIds(ids) {
  state.selectedIds = [...new Set(ids.filter(Boolean))];
  state.selectedId = state.selectedIds[0] || null;
}

function selectedCandidates() {
  const ids = getSelectedIds();
  return candidates.filter((candidate) => ids.includes(candidate.id));
}

function isCandidateSelected(candidate) {
  return getSelectedIds().includes(candidate.id);
}

function toggleCandidateSelection(id) {
  const ids = getSelectedIds();
  setSelectedIds(ids.includes(id) ? ids.filter((selectedId) => selectedId !== id) : [...ids, id]);
}

function normalized(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function candidateMatchLabels(candidate) {
  const labels = [];
  if (candidate.dob === applicant.dob) labels.push("DOB");
  if (candidate.fin === applicant.fin) labels.push("FIN");
  if (candidate.cob === applicant.cob) labels.push("COB");
  const applicantParentTokens = new Set(applicant.parents.flatMap((parent) => normalized(parent).split(/\s+/)).filter((token) => token.length > 3));
  const hasParentOverlap = (candidate.parents || []).some((parent) =>
    normalized(parent)
      .split(/\s+/)
      .some((token) => applicantParentTokens.has(token)),
  );
  if (hasParentOverlap) labels.push("Parents");
  if (candidate.id === applicant.id) labels.push("A#");
  return labels;
}

function evidenceSummary(selected) {
  const labels = ["DOB", "FIN", "COB", "Parents", "A#"];
  return labels
    .map((label) => {
      const count = selected.filter((candidate) => candidateMatchLabels(candidate).includes(label)).length;
      return { label, count };
    })
    .filter((item) => item.count > 0);
}

function attrsToString(attrs = {}) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== false && value !== null && value !== undefined)
    .map(([key, value]) => (value === true ? key : `${key}="${escapeAttribute(String(value))}"`))
    .join(" ");
}

function icon(name, className = "") {
  return `<span class="material-symbols-outlined ${className}" aria-hidden="true">${name}</span>`;
}

function buttonComponent(label, options = {}) {
  const {
    variant = "outline",
    className = "",
    action = "",
    disabled = false,
    iconName = "",
    iconPosition = "start",
    attrs = {},
  } = options;
  const legacyClasses = {
    primary: "primary-btn",
    secondary: "secondary-btn",
    outline: "outline-btn",
    ghost: "link",
    mode: "mode-tab",
    icon: "icon-btn",
  };
  const classList = ["ui-button", `ui-button--${variant}`, legacyClasses[variant], className].filter(Boolean).join(" ");
  const attrString = attrsToString({
    type: "button",
    class: classList,
    "data-action": action || undefined,
    disabled: disabled || undefined,
    ...attrs,
  });
  const iconMarkup = iconName ? icon(iconName, "ui-button__icon") : "";
  const content = iconMarkup && iconPosition === "end" ? `${label}${iconMarkup}` : `${iconMarkup}${label}`;
  return `<button ${attrString}>${content}</button>`;
}

function ghostButton(label, options = {}) {
  return buttonComponent(label, { ...options, variant: "ghost" });
}

function iconButton(iconName, label, options = {}) {
  return buttonComponent("", {
    ...options,
    variant: "icon",
    iconName,
    attrs: { "aria-label": label, ...(options.attrs || {}) },
  });
}

function chip(label, className = "") {
  return `<span class="ui-chip chip ${className}">${label}</span>`;
}

function badge(label, options = {}) {
  const { tone = "", className = "" } = options;
  return `<span class="ui-badge ${tone ? `ui-badge--${tone}` : ""} ${className}">${label}</span>`;
}

function statusBadge(status) {
  return badge(status, { tone: statusClass(status), className: `candidate-status ${statusClass(status)}` });
}

function checkboxComponent(options = {}) {
  const { selected = false, label = "Select", action = "", attrs = {} } = options;
  const attrString = attrsToString({
    type: "button",
    class: `ui-checkbox checkbox ${selected ? "selected" : ""}`,
    role: "checkbox",
    "aria-checked": selected,
    "aria-label": label,
    "data-action": action || undefined,
    ...attrs,
  });
  return `<button ${attrString}>${selected ? icon("check", "ui-checkbox__icon") : ""}</button>`;
}

function filterCheckbox(label, options = {}) {
  const { count = "", child = false } = options;
  return `
    <label class="ui-checkbox-label ${child ? "filter-child" : ""}">
      <input class="ui-checkbox-input" type="checkbox" checked />
      <span class="ui-checkbox-box" aria-hidden="true">${icon("check", "ui-checkbox-check")}</span>
      <span>${label}${count ? ` <span>(${count})</span>` : ""}</span>
    </label>
  `;
}

function applicantBlock(compact = false) {
  return `
    <section>
      <h3 class="applicant-title">Applicant's information</h3>
      <div class="identity-summary">
        <div class="portrait-card">
          ${portrait("applicant")}
          ${buttonComponent("View application", { variant: "outline" })}
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
            <div class="chips">${applicant.aliases.map((alias) => chip(alias)).join("")}</div>
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
  const selected = selectedCandidates();
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
          <div class="empty-icon" aria-hidden="true">${icon("person_search")}</div>
          <div>
            <h2>Don't see potential matches?</h2>
            <p>These are the actions you can take on this identity.</p>
            <div class="button-row">
              ${buttonComponent("Assign new A#", { variant: "secondary", action: "open-assign-a" })}
              ${buttonComponent("Escalate identity resolution", { variant: "primary", action: "open-escalate" })}
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
  const isSelected = isCandidateSelected(candidate);
  return `
    <div class="candidate-row">
      <div class="check-wrap">
        ${checkboxComponent({ selected: isSelected, label: `Select ${candidate.id}`, action: "toggle-select", attrs: { "data-candidate-id": candidate.id } })}
      </div>
      <article class="candidate-card ${isSelected ? "selected" : ""}">
        ${isSelected ? badge("Selected", { className: "selected-badge" }) : ""}
        ${candidate.pending ? badge("Pending review", { className: "selected-badge" }) : ""}
        <p class="card-note">${candidate.reason}</p>
        <div class="candidate-top">
          <div class="portrait-card">
            ${portrait("candidate", index, "small")}
            ${buttonComponent("View identity", { variant: "outline", action: "open-identity" })}
          </div>
          <div>
            <div>${candidateId(candidate)}${statusBadge(candidate.status)}</div>
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
              <div class="chips">${candidate.aliases.map((alias) => chip(alias)).join("")}</div>
            </div>
            <div class="relationship-grid">
              <div>
                <div class="label">CHILDREN</div>
                <div class="copy">${candidate.children
                  .map((child) => ghostButton(child))
                  .join("<br />")}</div>
              </div>
              <div>
                <div class="label">SPOUSE</div>
                <div class="copy">${ghostButton(candidate.spouse)}</div>
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
  const isSelected = isCandidateSelected(candidate);
  return `
    <div class="candidate-row" style="margin-top: 0">
      <div class="check-wrap">${checkboxComponent({ selected: isSelected, label: `Select ${candidate.id}`, action: "toggle-select", attrs: { "data-candidate-id": candidate.id } })}</div>
      <article class="candidate-card compact-match ${isSelected ? "selected" : ""}">
        ${isSelected ? badge("Selected", { className: "selected-badge" }) : ""}
        <p class="card-note">${candidate.reason}</p>
        <div class="candidate-top">
          <div class="portrait-card">
            ${portrait("candidate", index, "small")}
            ${buttonComponent("View identity", { variant: "outline", action: "open-identity" })}
          </div>
          <div>
            <div>${candidateId(candidate)}${statusBadge(candidate.status)}</div>
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
      <div class="field-value card-link">${ghostButton("View card", { action: "open-ead" })}</div>
      <div></div>
      ${field("STATUS", "PRINTED", false, false, "blue")}
      ${field("EXPIRES", "December 10, 2019")}
      ${field("RECEIPT #", "89765543182754", false, true)}
    </div>
  `;
}

function summaryBar(selected = []) {
  const count = selected.length;
  const visible = count > 0;
  const title = `${count} ${count === 1 ? "identity" : "identities"} selected`;
  const subtitle =
    count === 1
      ? `${selected[0].id} · ${selected[0].name}`
      : `Resolution cluster: ${selected.map((candidate) => candidate.id).join(" · ")}`;
  const evidence = evidenceSummary(selected);
  const evidenceContent =
    count <= 1
      ? `<div class="match-chips">
          ${candidateMatchLabels(selected[0] || candidates[0])
            .map((label) => chip(label, "match-chip"))
            .join("")}
          <span class="summary-copy">Similar ${candidateMatchLabels(selected[0] || candidates[0]).join(", ")}${count ? "" : "."}</span>
        </div>`
      : `<div class="cluster-evidence-grid">
          ${evidence
            .map(
              ({ label, count: matchCount }) => `
                <div class="cluster-evidence-item">
                  <strong>${label}</strong>
                  <span>${matchCount} of ${count} ${matchCount === 1 ? "candidate" : "candidates"}</span>
                </div>
              `,
            )
            .join("")}
        </div>
        <p class="summary-copy cluster-copy">Treating these as possible fragments of the same identity. Resolve packages each candidate's evidence separately for final evaluator review.</p>`;
  return `
    <aside class="summary-bar ${visible ? "visible" : ""}" aria-live="polite">
      <div class="selected-summary">
        <div class="check-circle">${icon("check")}</div>
        <div>
          <div class="summary-title">${title}</div>
          <div class="summary-subtitle">${subtitle}</div>
        </div>
      </div>
      <div>
        <div class="label">${count > 1 ? "Cluster evidence" : "Matching datapoints"}</div>
        ${evidenceContent}
      </div>
      <div class="summary-actions">
        ${buttonComponent("Clear", { variant: "secondary", action: "clear-selection" })}
        ${buttonComponent(count > 1 ? "Resolve cluster" : "Resolve", { variant: "primary", action: "resolve" })}
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
      toggleCandidateSelection(button.dataset.candidateId || candidates[0].id);
      renderQueue();
    });
  });
  document.querySelector("[data-action='clear-selection']")?.addEventListener("click", () => {
    setSelectedIds([]);
    renderQueue();
  });
  document.querySelector("[data-action='resolve']")?.addEventListener("click", () => {
    if (!selectedCandidates().length) return;
    setView("resolve", "#resolve");
    renderResolve();
  });
  document.querySelector("[data-action='open-assign-a']")?.addEventListener("click", () => {
    state.modal = "assign-a";
    renderQueue();
  });
  document.querySelector("[data-action='open-escalate']")?.addEventListener("click", () => {
    state.modal = "escalate";
    renderQueue();
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
  if (!selectedCandidates().length) setSelectedIds([candidates[0].id]);
  const selected = selectedCandidates();
  const valid = Boolean(state.primaryName && state.primaryA);
  const content = `
    <main class="resolve-page">
      <div class="resolve-content">
        <section class="resolve-intro">
          <h1>Assign primary information</h1>
          <p class="helper">Review the ${selected.length === 1 ? "identity" : "identity cluster"} to link and select the primary information. Each selected candidate will be included as a separate evidence fragment for final evaluator review.</p>
        </section>
        ${applicantBlock(true)}
        <h3 class="resolve-section-title">${selected.length === 1 ? "Selected identity" : "Selected identities"}</h3>
        ${selectedIdentityCard()}
        ${resolveSteps(valid)}
      </div>
    </main>
  `;
  app.innerHTML = shell(content, { crumbs: ["Resolve identity", "Link"] }) + renderModal();
  window.scrollTo(0, 0);
  bindResolveEvents();
}

function selectedIdentityCard() {
  const selected = selectedCandidates();
  const list = selected.length ? selected : [candidates[0]];
  return `
    <div class="selected-identity-list ${list.length > 1 ? "multi" : ""}">
      ${list
        .map((candidate) => {
          const index = candidates.findIndex((item) => item.id === candidate.id);
          const matches = candidateMatchLabels(candidate);
          return `
            <article class="selected-identity-card">
              <p class="card-note">${candidate.reason.replace("Parents", "PARENT 1 and PARENT 2")}</p>
              <div class="compact-card">
                <div class="portrait-card">
                  ${portrait("candidate", index, "small")}
                  ${buttonComponent("View identity", { variant: "outline", action: "open-identity" })}
                </div>
                <div>
                  <div>${candidateId(candidate)}${statusBadge(candidate.status)}</div>
                  <div class="candidate-name">${candidate.name}</div>
                  <div class="field-row compact">
                    ${field("DOB", candidate.dob, matches.includes("DOB"))}
                    ${field("FIN", candidate.fin, matches.includes("FIN"))}
                    ${field("COB", candidate.cob, matches.includes("COB"))}
                  </div>
                  <div class="selected-card-evidence">
                    ${matches.map((label) => chip(label, "match-chip")).join("")}
                  </div>
                </div>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function resolveSteps(valid) {
  const nameComplete = Boolean(state.primaryName);
  const aComplete = Boolean(state.primaryA);
  const selected = selectedCandidates();
  const nameOptions = [...new Set([applicant.name, ...selected.map((candidate) => candidate.name)])];
  const aOptions = [...new Set([applicant.id, ...selected.map((candidate) => candidate.id)])];
  const nonPrimaryNames = nameOptions.filter((name) => name !== state.primaryName);
  const remainingA = remainingANumbers();
  return `
    <section class="step">
      <div class="step-header">
        <h3>1. Assign a primary name</h3>
        ${badge(nameComplete ? "Complete" : "Required", { className: "step-badge" })}
      </div>
      <p class="helper">Choose which name should become the primary identity name. Alias options stay hidden until a primary name is selected.</p>
      <div class="radio-list">
        ${nameOptions.map((name) => radioOption("primary-name", name, name, state.primaryName)).join("")}
      </div>
      ${
        nameComplete
          ? `<div class="disclosure">
              <h3>Keep the non-primary selected names as aliases?</h3>
              ${nonPrimaryNames.length ? `<p class="helper">${nonPrimaryNames.join(" · ")}</p>` : ""}
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
        ${badge(!nameComplete ? "Locked" : aComplete ? "Complete" : "Required", { className: `step-badge ${nameComplete ? "" : "locked"}` })}
      </div>
      ${
        nameComplete
          ? `<p class="helper">Select the primary A-number before deciding whether to keep the remaining selected A-numbers as consolidated.</p>
             <div class="radio-list">
              ${aOptions.map((id) => radioOption("primary-a", id, id, state.primaryA)).join("")}
             </div>`
          : `<p class="helper">This section unlocks after a primary name has been assigned.</p>`
      }
      ${
        aComplete && remainingA
          ? `<div class="disclosure">
              <h3>Keep "${remainingA}" as consolidated A#${remainingA.includes(",") ? "s" : ""} for this identity?</h3>
              <div class="radio-list">
                ${radioOption("consolidated-a", "Yes", "yes", state.consolidatedA)}
                ${radioOption("consolidated-a", "No", "no", state.consolidatedA)}
              </div>
            </div>`
          : aComplete
            ? `<div class="disclosure"><p class="helper">No additional A-numbers need to be consolidated for this package.</p></div>`
          : ""
      }
    </section>
    <section class="step ${valid ? "" : "disabled"}">
      <div class="step-header">
        <h3>3. Provide a reason for linking these identities and any additional information.</h3>
      </div>
      <p class="helper">${valid ? "Notes will be included for final evaluator review." : "Complete the primary name and A-number selections to add final notes."}</p>
      <textarea class="notes-field" ${valid ? "" : "disabled"} placeholder="Add why these selected fragments appear to refer to the same identity">${state.notes}</textarea>
      ${
        valid
          ? `<div class="attachment-row">
              ${ghostButton("Add a link", { iconName: "link" })}
              ${ghostButton("Attach a document", { iconName: "attach_file" })}
            </div>`
          : ""
      }
      <div class="resolve-actions">
        ${buttonComponent(state.submitting ? "Sending package..." : "Send for Final Review", { variant: "primary", action: "submit-resolution", disabled: !(valid && !state.submitting) })}
        ${ghostButton("Cancel", { action: "cancel-resolve", className: "cancel-link" })}
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

function remainingANumbers() {
  const ids = [...new Set([applicant.id, ...selectedCandidates().map((candidate) => candidate.id)])].filter((id) => id !== state.primaryA);
  return ids.join(", ");
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
    const selectedCount = selectedCandidates().length || 1;
    state.submitting = true;
    renderResolve();
    window.setTimeout(() => {
      state.submitting = false;
      state.submitted = true;
      setSelectedIds([]);
      state.view = "queue";
      state.toast = {
        title: "Resolution package sent",
        body: `${selectedCount} linked identity ${selectedCount === 1 ? "candidate" : "candidates"} and your notes were sent to a final evaluator.`,
        status: "Pending final resolution",
      };
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
      ${ghostButton("Identity Resolution Queue", { action: "return-queue", className: "breadcrumb-link" })}
      <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      <span>Applicant Identity</span>
    </nav>
    <main class="identity-detail-page">
      <section class="identity-detail-grid identity-dossier">
        <aside class="identity-side">
          <div class="rail-eyebrow">SOURCE IDENTITY</div>
          <div class="identity-photo-frame">
            <img class="identity-main-photo" src="${portraitAssets.applicant}" alt="" />
            ${ghostButton("See more", { action: "open-photo", className: "see-more-link", iconName: "photo_library" })}
          </div>
          <div class="identity-verified-block rail-fact">
            <div class="label">A# <span class="verified-icon">${icon("check")}</span></div>
            <div class="big-id">${applicant.id}</div>
            ${ghostButton("See consolidated")}
          </div>
          <div class="identity-verified-block rail-fact">
            <div class="label">FIN <span class="verified-icon">${icon("check")}</span></div>
            <div class="big-id">3211-00-4444</div>
          </div>
          <div class="rail-action-stack">
            ${buttonComponent("Stacks", { variant: "outline", className: "mini-action", iconName: "inventory_2" })}
            ${buttonComponent("Rails", { variant: "outline", className: "mini-action", iconName: "account_tree" })}
          </div>
        </aside>
        <section class="identity-main">
          <div class="dossier-kicker">Applicant identity record</div>
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
              ${chip("Maria Lopez")}
              ${chip("Martina Maria")}
              ${chip("Miya Kawasaki")}
              ${ghostButton("See more")}
            </div>
          </div>
          <div class="address-block">
            <div class="label">ADDRESS</div>
            <div>123 4th St. Miami, FL 33131 ${ghostButton("See previous")}</div>
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
                ${ghostButton("Mia Ramírez", { className: "stacked-link" })}
                ${ghostButton("Jose García", { className: "stacked-link" })}
              </div>
              <div>
                <div class="label">SPOUSE</div>
                ${ghostButton(candidate.spouse, { className: "stacked-link" })}
              </div>
              <div>
                <div class="label">ATTORNEY</div>
                <div>Hunter Fox</div>
                ${ghostButton("See previous", { className: "stacked-link" })}
              </div>
              <div>
                <div class="label">CHILDREN</div>
                ${candidate.children.map((child) => ghostButton(child, { className: "stacked-link" })).join("")}
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
      ${link ? ghostButton(link) : ""}
    </div>
  `;
}

function identityCardData() {
  return `
    <div class="identity-card-data">
      <article class="document-card document-card-ready">
        <div class="document-card-header">
          <div class="card-data-heading">GREEN CARD</div>
          ${badge("READY", { className: "document-status ready" })}
        </div>
        <div class="identity-card-row">
          ${field("EXPIRES", "TBD")}
          ${field("SITE CODE", "A123", false, true)}
          ${field("DRAFT", "Available", false, false, "ready")}
        </div>
        <p class="document-card-copy">Draft document is ready to preview. Final production requires evaluator approval.</p>
        ${buttonComponent("View draft green card", { variant: "outline", action: "open-green-card", className: "card-trigger", iconName: "badge" })}
      </article>
      <article class="document-card">
        <div class="document-card-header">
          <div class="card-data-heading">EAD CARD</div>
          ${ghostButton("View card", { action: "open-ead", className: "card-heading-link", iconName: "visibility" })}
        </div>
        <div class="identity-card-row ead-card-row">
          ${field("STATUS", "PRINTED", false, false, "blue")}
          ${field("EXPIRES", "December 10, 2019")}
          ${field("SITE CODE", "A123", false, true)}
          ${field("PROVISION OF LAW", "B23", false, true)}
        </div>
      </article>
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
      ${filterCheckbox("Select all", { count: 9 })}
      ${groups
        .map(
          ([group, ...items]) => `
            <div class="filter-group">
              ${filterCheckbox(group, { count: items.length })}
              ${items.map((item) => filterCheckbox(item, { child: true })).join("")}
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
      <div class="timeline-description">
        <div class="label">${row.type}</div>
        <div class="timeline-title">${row.title}</div>
        ${expanded ? expandedTimelineDetail(row, index) : ""}
      </div>
      <div class="timeline-status ${row.status.toLowerCase().replaceAll(" ", "-")}">${row.status}</div>
      <div class="timeline-date">
        <div class="label">${row.dateLabel}</div>
        <div>${row.date}</div>
      </div>
      ${iconButton(expanded ? "keyboard_arrow_up" : "keyboard_arrow_down", `${expanded ? "Collapse" : "Expand"} ${row.type}`, { className: "timeline-caret" })}
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
        ${ghostButton("Stacks", { iconName: "inventory_2" })}
        ${ghostButton("Rails", { iconName: "account_tree" })}
      </div>
    </div>
  `;
}

function bindIdentityEvents() {
  document.querySelector("[data-action='return-queue']")?.addEventListener("click", () => {
    state.view = "queue";
    state.modal = null;
    history.replaceState(null, "", getSelectedIds().length ? "#selected" : "#queue");
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
  const toast =
    typeof state.toast === "string"
      ? {
          title: state.toast,
          body: "1 linked identity candidate and your notes were sent to a final evaluator.",
          status: "Pending final resolution",
        }
      : state.toast;
  return `
    <div class="toast" role="status">
      <h3>${toast.title}</h3>
      <p class="helper">${toast.body}</p>
      ${toast.status ? `<p class="helper"><strong>Status:</strong> ${toast.status}</p>` : ""}
    </div>
  `;
}

function renderModal() {
  if (state.modal === "photo") return photoOverlay();
  if (state.modal === "ead") return eadOverlay();
  if (state.modal === "green-card") return greenCardOverlay();
  if (state.modal === "assign-a") return assignANumberOverlay();
  if (state.modal === "escalate") return escalateResolutionOverlay();
  return "";
}

function actionRecordSummary() {
  return `
    <div class="action-record-summary">
      <img src="${portraitAssets.applicant}" alt="" />
      <div>
        <div class="label">TARGET APPLICANT</div>
        <strong>${applicant.name}</strong>
        <div class="action-record-meta">
          <span>${applicant.dob}</span>
          <span>FIN ${applicant.fin}</span>
          <span>COB ${applicant.cob}</span>
        </div>
      </div>
      ${badge("High priority", { className: "status-badge" })}
    </div>
  `;
}

function assignANumberOverlay() {
  const submitting = state.actionSubmitting === "assign-a";
  return `
    <div class="overlay-backdrop">
      <div class="action-modal" role="dialog" aria-modal="true" aria-labelledby="assign-a-title">
        ${iconButton("close", "Close assign A-number dialog", { action: "close-modal", className: "modal-close" })}
        <div class="modal-kicker">NO MATCH PATH</div>
        <h2 id="assign-a-title">Assign new A-number</h2>
        <p class="helper">Use this when no listed candidate is a suspected duplicate and the incoming identity should continue as a separate record.</p>
        ${actionRecordSummary()}
        <section class="action-modal-section">
          <h3>Assignment preview</h3>
          <div class="action-data-grid">
            <div><div class="label">RESERVED A#</div><strong>A100089442</strong></div>
            <div><div class="label">REVIEW STATUS</div><strong>Supervisor confirmation required</strong></div>
            <div><div class="label">AUDIT REASON</div><strong>No candidate selected</strong></div>
          </div>
        </section>
        <label class="action-note-label" for="assign-note">Assignment note</label>
        <textarea id="assign-note" class="notes-field action-notes" placeholder="Example: Reviewed suggested matches; DOB and parent evidence does not support linking."></textarea>
        <div class="modal-helper-row">
          ${icon("info", "modal-helper-icon")}
          <span>This queues the A-number assignment package. It does not modify any potential match records.</span>
        </div>
        <div class="modal-actions">
          ${ghostButton("Cancel", { action: "close-modal" })}
          ${buttonComponent(submitting ? "Reserving..." : "Reserve A# for review", { variant: "primary", action: "confirm-assign-a", disabled: submitting })}
        </div>
      </div>
    </div>
  `;
}

function escalateResolutionOverlay() {
  const submitting = state.actionSubmitting === "escalate";
  return `
    <div class="overlay-backdrop">
      <div class="action-modal" role="dialog" aria-modal="true" aria-labelledby="escalate-title">
        ${iconButton("close", "Close escalation dialog", { action: "close-modal", className: "modal-close" })}
        <div class="modal-kicker">MANUAL REVIEW PATH</div>
        <h2 id="escalate-title">Escalate identity resolution</h2>
        <p class="helper">Use this when the evidence is not strong enough to link records or assign a new A-number without specialist review.</p>
        ${actionRecordSummary()}
        <section class="action-modal-section">
          <h3>Escalation package</h3>
          <div class="evidence-chip-row">
            ${chip("No candidate selected", "evidence-chip")}
            ${chip("Potential DOB overlap", "evidence-chip")}
            ${chip("Parent evidence mixed", "evidence-chip")}
            ${chip("A# conflict possible", "evidence-chip")}
          </div>
        </section>
        <label class="action-note-label" for="escalation-note">Escalation note</label>
        <textarea id="escalation-note" class="notes-field action-notes" placeholder="Example: Candidate data has partial overlap, but confidence is not sufficient for officer-level resolution."></textarea>
        <div class="modal-helper-row warning">
          ${icon("priority_high", "modal-helper-icon")}
          <span>The queue item will remain open and be marked Pending specialist review.</span>
        </div>
        <div class="modal-actions">
          ${ghostButton("Cancel", { action: "close-modal" })}
          ${buttonComponent(submitting ? "Sending..." : "Send escalation", { variant: "primary", action: "confirm-escalate", disabled: submitting })}
        </div>
      </div>
    </div>
  `;
}

function photoOverlay() {
  const thumbs = portraitAssets.thumbs
    .map((src, index) => `<img class="portrait tiny thumb ${index === 0 ? "selected" : ""}" src="${src}" alt="" />`)
    .join("");
  return `
    <div class="overlay-backdrop">
      <div class="photo-modal" role="dialog" aria-modal="true" aria-label="Photo viewer">
        ${iconButton("close", "Close photo viewer", { action: "close-modal", className: "modal-close" })}
        <div class="photo-title">10 photos ${ghostButton("View as a grid")}</div>
        <div class="photo-viewer">
          <img class="portrait large-photo" src="${portraitAssets.large}" alt="" />
          <div class="photo-meta">
            <div><div class="label">DATE TAKEN</div><div class="value">March 15, 2019</div></div>
            <div><div class="label">RECEIPT #</div><div class="value">IOE1234876542</div></div>
            <div><div class="label">REASON</div><div class="value">ASC Appointment</div></div>
          </div>
          ${ghostButton("View more details")}
        </div>
        <div class="thumb-row">
          ${iconButton("chevron_left", "Previous photo", { className: "carousel-arrow" })}
          ${thumbs}
          ${iconButton("chevron_right", "Next photo", { className: "carousel-arrow" })}
        </div>
      </div>
    </div>
  `;
}

function eadOverlay() {
  return `
    <div class="overlay-backdrop">
      <div class="ead-panel" role="dialog" aria-modal="true" aria-label="EAD card">
        ${iconButton("close", "Close EAD card", { action: "close-modal", className: "modal-close" })}
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
        ${iconButton("close", "Close draft green card", { action: "close-modal", className: "modal-close" })}
        <div class="modal-kicker">DOCUMENT PREVIEW</div>
        <div class="green-card-heading">
          <h2>Draft green card</h2>
          ${badge("Ready for review", { className: "document-status ready" })}
        </div>
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
        <p class="helper">Draft preview generated from the selected identity record. Final production is held until evaluator approval.</p>
      </div>
    </div>
  `;
}

function bindModalEvents() {
  document.querySelectorAll("[data-action='close-modal']").forEach((button) => button.addEventListener("click", () => {
    state.modal = null;
    state.actionSubmitting = "";
    if (state.view === "resolve") renderResolve();
    else if (state.view === "identity") renderIdentityDetail();
    else renderQueue();
  }));
  document.querySelector("[data-action='confirm-assign-a']")?.addEventListener("click", () => {
    state.actionSubmitting = "assign-a";
    renderQueue();
    window.setTimeout(() => {
      state.modal = null;
      state.actionSubmitting = "";
      state.toast = {
        title: "A-number assignment queued",
        body: "A100089442 was reserved and the assignment package was sent for supervisor confirmation.",
        status: "Pending supervisor confirmation",
      };
      renderQueue();
    }, 650);
  });
  document.querySelector("[data-action='confirm-escalate']")?.addEventListener("click", () => {
    state.actionSubmitting = "escalate";
    renderQueue();
    window.setTimeout(() => {
      state.modal = null;
      state.actionSubmitting = "";
      state.toast = {
        title: "Identity resolution escalated",
        body: "The applicant record and unresolved match signals were sent to the specialist review queue.",
        status: "Pending specialist review",
      };
      renderQueue();
    }, 650);
  });
}

function hydrateFromHash() {
  const hash = window.location.hash;
  if (hash === "#selected") setSelectedIds([candidates[0].id]);
  if (hash === "#resolve" || hash === "#resolve-name" || hash === "#resolve-a") {
    state.view = "resolve";
    setSelectedIds([candidates[0].id]);
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
    setSelectedIds([]);
    state.toast = "Resolution package sent";
  }
}

hydrateFromHash();
if (state.view === "resolve") renderResolve();
else if (state.view === "identity") renderIdentityDetail();
else renderQueue();
