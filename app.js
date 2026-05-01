const applicant = {
  id: "A100001234",
  name: "Maria Teresa GARCÍA RAMÍREZ DE ARROYO",
  dob: "March 16, 1964",
  fin: "3211004444",
  cob: "Ecuador",
  parents: ["MIA RAMÍREZ", "Jose GARCÍA"],
  aliases: ["Maria LOPEZ", "Martina GARCIA", "Miya KAWASAKI"],
};

const applicantIdentityAliases = [
  "Maria Lopez",
  "Martina Maria",
  "Miya Kawasaki",
  "María Teresa Ramírez",
  "Maria T. Garcia",
  "Teresa Arroyo",
  "M. Ramírez de Arroyo",
];

const candidates = [
  {
    identityKey: "maria-teresa",
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
    identityKey: "julia",
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
    identityKey: "victoria",
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
    identityKey: "maria-ramirez",
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
    identityKey: "maria-teresa-ramirez",
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
  queueDeadlineAt: Date.now() + 3.5 * 60 * 60 * 1000,
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
  activeIdentityKey: "maria-teresa",
  identityTrail: [],
  aliasesExpanded: false,
  attachments: [],
  undoSnapshot: null,
};

const app = document.querySelector("#app");
let queueTimerId = null;
let toastTimerId = null;

function formatQueueCountdown() {
  const remainingMs = Math.max(0, state.queueDeadlineAt - Date.now());
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, "0");

  return `${pad(hours)}h:${pad(minutes)}m:${pad(seconds)}s`;
}

function updateQueueCountdown() {
  const timer = document.querySelector("[data-countdown='queue-sla']");
  if (!timer) return;
  timer.textContent = formatQueueCountdown();
  timer.classList.toggle("expired", state.queueDeadlineAt <= Date.now());
}

function startQueueCountdown() {
  window.clearInterval(queueTimerId);
  updateQueueCountdown();
  queueTimerId = window.setInterval(updateQueueCountdown, 1000);
}

function stopQueueCountdown() {
  window.clearInterval(queueTimerId);
  queueTimerId = null;
}

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

const identityProfiles = {
  "maria-teresa": {
    key: "maria-teresa",
    label: "Potential match identity",
    first: "María",
    middle: "Teresa",
    last: "GARCÍA RAMÍREZ",
    fullName: "Maria Teresa GARCÍA RAMÍREZ",
    photo: portraitAssets.main,
    aNumber: "A100001678",
    fin: "3211-00-4444",
    finRaw: "3211004444",
    coa: "K2",
    status: "EAD Approved",
    dob: "March 16, 1964",
    address: "1328 Coral Way, Miami, FL 33135",
    aliases: applicantIdentityAliases,
    biographic: {
      cob: "Ecuador",
      poe: "Miami International (MIA)",
      ssn: "123-45-6789",
      coc: "Ecuador",
      doe: "June 18, 2015",
      passport: "41234567",
      gender: "Female",
      dfo: "August 10, 2016",
      fbi: "285927400",
    },
    relationships: {
      parents: ["Mia Ramírez", "Jose García"],
      spouse: "Julio Arroyo",
      attorney: "Hunter Fox",
      children: ["Gloria Arroyo García", "Mario Arroyo García"],
    },
    card: {
      greenStatus: "READY",
      greenExpires: "TBD",
      siteCode: "A123",
      eadStatus: "PRINTED",
      eadExpires: "December 10, 2019",
      provision: "B23",
      receipt: "89765543182754",
    },
    photoMeta: { dateTaken: "March 15, 2019", receipt: "IOE1234876542", reason: "ASC Appointment" },
    draft: {
      surname: "GARCÍA RAMÍREZ",
      givenName: "MARIA TERESA",
      category: "K2",
      country: "ECUADOR",
      birth: "16 MAR 1964",
      mrz: "GRC<GARCIA<RAMIREZ<<MARIA<TERESA<<<<<<<<<<<",
    },
  },
  julia: {
    key: "julia",
    label: "Potential match identity",
    first: "Julia",
    middle: "",
    last: "GARCÍA RAMÍREZ",
    fullName: "Julia GARCÍA RAMÍREZ",
    photo: portraitAssets.julia,
    aNumber: "A100014446",
    fin: "3211-12-6166",
    finRaw: "3211126166",
    coa: "IR1",
    status: "LPR Pending",
    dob: "March 16, 1964",
    address: "2221 SW 12th Ave, Miami, FL 33145",
    aliases: ["Julia Ramirez", "Julia G. Ramirez", "J. García", "Julia Garcia Moncayo", "Julia R. Moncayo"],
    biographic: {
      cob: "Ecuador",
      poe: "Miami International (MIA)",
      ssn: "219-44-0187",
      coc: "Ecuador",
      doe: "May 22, 2016",
      passport: "EC4820191",
      gender: "Female",
      dfo: "September 4, 2017",
      fbi: "301448216",
    },
    relationships: {
      parents: ["Julia Ramírez", "Pablo García Moncayo"],
      spouse: "No spouse recorded",
      attorney: "Melissa Grant",
      children: ["Mateo García", "Lucia García"],
    },
    card: {
      greenStatus: "READY",
      greenExpires: "TBD",
      siteCode: "M211",
      eadStatus: "PENDING",
      eadExpires: "TBD",
      provision: "C09",
      receipt: "MSC2044189204",
    },
    photoMeta: { dateTaken: "May 22, 2016", receipt: "MSC2044189204", reason: "Benefit intake photo" },
    draft: {
      surname: "GARCÍA RAMÍREZ",
      givenName: "JULIA",
      category: "IR1",
      country: "ECUADOR",
      birth: "16 MAR 1964",
      mrz: "GRC<GARCIA<RAMIREZ<<JULIA<<<<<<<<<<<<<<<<",
    },
  },
  victoria: {
    key: "victoria",
    label: "Potential match identity",
    first: "Victoria",
    middle: "",
    last: "GUNNARSON",
    fullName: "Victoria GUNNARSON",
    photo: portraitAssets.victoria,
    aNumber: "A100001234",
    fin: "3211-22-3567",
    finRaw: "32112235667",
    coa: "AS6",
    status: "Asylum Approved",
    dob: "May 20, 1970",
    address: "410 Maple Street, Buffalo, NY 14202",
    aliases: ["Vicky Gunnarson", "Victoria Miles", "V. Gunnarson", "Victoria A. Miles"],
    biographic: {
      cob: "Canada",
      poe: "Peace Bridge (BUF)",
      ssn: "098-34-2210",
      coc: "Canada",
      doe: "April 11, 2014",
      passport: "CA2219037",
      gender: "Female",
      dfo: "June 2, 2015",
      fbi: "441298557",
    },
    relationships: {
      parents: ["Andy Gunnarson", "Rosemary Miles"],
      spouse: "No spouse recorded",
      attorney: "Nadia Coleman",
      children: [],
    },
    card: {
      greenStatus: "READY",
      greenExpires: "TBD",
      siteCode: "B404",
      eadStatus: "ACTIVE",
      eadExpires: "July 14, 2020",
      provision: "A05",
      receipt: "LIN1994421087",
    },
    photoMeta: { dateTaken: "June 2, 2015", receipt: "LIN1994421087", reason: "Asylum biometrics" },
    draft: {
      surname: "GUNNARSON",
      givenName: "VICTORIA",
      category: "AS6",
      country: "CANADA",
      birth: "20 MAY 1970",
      mrz: "GRC<GUNNARSON<<VICTORIA<<<<<<<<<<<<<<<<<<",
    },
  },
  "maria-ramirez": {
    key: "maria-ramirez",
    label: "Potential match identity",
    first: "Maria",
    middle: "",
    last: "GARCÍA RAMÍREZ",
    fullName: "Maria GARCÍA RAMÍREZ",
    photo: portraitAssets.maria,
    aNumber: "A100023667",
    fin: "3209-83-43434",
    finRaw: "32098343434",
    coa: "AS2",
    status: "Asylum Denied",
    dob: "March 16, 1964",
    address: "47-09 35th Ave, Queens, NY 11103",
    aliases: ["Maria Ramirez", "Maria Garcia", "M. García Ramírez", "María R.", "Maria J. Garcia"],
    biographic: {
      cob: "Ecuador",
      poe: "John F. Kennedy International (JFK)",
      ssn: "157-30-8821",
      coc: "Ecuador",
      doe: "October 2, 2013",
      passport: "EC8831042",
      gender: "Female",
      dfo: "November 21, 2015",
      fbi: "398210664",
    },
    relationships: {
      parents: ["Josephina Ramírez", "Jorge García"],
      spouse: "No spouse recorded",
      attorney: "Ravi Mehta",
      children: ["Sofia García"],
    },
    card: {
      greenStatus: "READY",
      greenExpires: "TBD",
      siteCode: "Q118",
      eadStatus: "EXPIRED",
      eadExpires: "January 8, 2018",
      provision: "C08",
      receipt: "EAC1728019451",
    },
    photoMeta: { dateTaken: "November 21, 2015", receipt: "EAC1728019451", reason: "Asylum interview" },
    draft: {
      surname: "GARCÍA RAMÍREZ",
      givenName: "MARIA",
      category: "AS2",
      country: "ECUADOR",
      birth: "16 MAR 1964",
      mrz: "GRC<GARCIA<RAMIREZ<<MARIA<<<<<<<<<<<<<<<",
    },
  },
  "maria-teresa-ramirez": {
    key: "maria-teresa-ramirez",
    label: "Potential match identity",
    first: "María",
    middle: "Teresa",
    last: "RAMÍREZ",
    fullName: "María Teresa RAMÍREZ",
    photo: portraitAssets.applicant,
    aNumber: "A100086760",
    fin: "3210-09-8765",
    finRaw: "3210098765",
    coa: "K2",
    status: "LPR Pending",
    dob: "March 16, 1964",
    address: "5100 NW 7th St, Miami, FL 33126",
    aliases: ["Maria T Ramirez", "Teresa Ramirez", "M. Teresa García", "Maria Teresa Arroyo", "Maria R. Arroyo"],
    biographic: {
      cob: "Ecuador",
      poe: "Miami International (MIA)",
      ssn: "184-22-7430",
      coc: "Ecuador",
      doe: "March 15, 2019",
      passport: "EC7412089",
      gender: "Female",
      dfo: "March 15, 2019",
      fbi: "285927522",
    },
    relationships: {
      parents: ["Mia Ramírez", "Jose García"],
      spouse: "Julio Arroyo",
      attorney: "Hunter Fox",
      children: ["Mario Arroyo García"],
    },
    card: {
      greenStatus: "READY",
      greenExpires: "TBD",
      siteCode: "A123",
      eadStatus: "PRINTED",
      eadExpires: "December 10, 2019",
      provision: "B23",
      receipt: "89765543182754",
    },
    photoMeta: { dateTaken: "March 15, 2019", receipt: "IOE1234880041", reason: "Port-of-entry intake" },
    draft: {
      surname: "RAMÍREZ",
      givenName: "MARIA TERESA",
      category: "K2",
      country: "ECUADOR",
      birth: "16 MAR 1964",
      mrz: "GRC<RAMIREZ<<MARIA<TERESA<<<<<<<<<<<<<<",
    },
  },
};

function relatedIdentityProfile(options) {
  const {
    key,
    first,
    middle = "",
    last,
    fullName,
    photo = portraitAssets.applicant,
    aNumber,
    fin,
    coa = "REL",
    status = "Verified relationship",
    dob = "July 8, 1988",
    address = "Address on linked record",
    aliases = [],
    cob = "United States",
    poe = "Miami International (MIA)",
    ssn = "On file",
    coc = cob,
    doe = "Not applicable",
    passport = "On file",
    gender = "Not specified",
    dfo = "Not applicable",
    fbi = "On file",
    parents = [],
    spouse = "No spouse recorded",
    attorney = "No attorney recorded",
    children = [],
    siteCode = "R214",
  } = options;
  const givenName = [first, middle].filter(Boolean).join(" ").toUpperCase();
  return {
    key,
    label: "Linked person identity",
    first,
    middle,
    last,
    fullName,
    photo,
    aNumber,
    fin,
    finRaw: fin.replaceAll("-", ""),
    coa,
    status,
    dob,
    address,
    aliases: aliases.length ? aliases : [fullName],
    biographic: { cob, poe, ssn, coc, doe, passport, gender, dfo, fbi },
    relationships: { parents, spouse, attorney, children },
    card: {
      greenStatus: "READY",
      greenExpires: "TBD",
      siteCode,
      eadStatus: "NOT REQUESTED",
      eadExpires: "TBD",
      provision: "N/A",
      receipt: `${siteCode}${aNumber.slice(-4)}0001`,
    },
    photoMeta: { dateTaken: dfo, receipt: `${siteCode}${aNumber.slice(-4)}0001`, reason: "Linked person record" },
    draft: {
      surname: last.toUpperCase(),
      givenName,
      category: coa,
      country: cob.toUpperCase(),
      birth: dob.replace(",", "").toUpperCase(),
      mrz: `GRC<${last.replaceAll(" ", "<").toUpperCase()}<<${givenName.replaceAll(" ", "<")}<<<<<<<<<<<<`,
    },
  };
}

Object.assign(identityProfiles, {
  "gloria-arroyo-garcia": relatedIdentityProfile({
    key: "gloria-arroyo-garcia",
    first: "Gloria",
    last: "Arroyo García",
    fullName: "Gloria Arroyo García",
    photo: "assets/photo-thumb-05.png",
    aNumber: "A110004812",
    fin: "4410-62-1184",
    coa: "K2",
    status: "Derivative child",
    dob: "April 18, 1999",
    address: "1328 Coral Way, Miami, FL 33135",
    aliases: ["Gloria Arroyo", "Gloria A. García"],
    cob: "Ecuador",
    ssn: "188-44-9011",
    passport: "EC9021844",
    gender: "Female",
    dfo: "March 15, 2019",
    parents: ["Maria Teresa GARCÍA RAMÍREZ", "Julio Arroyo"],
  }),
  "mario-arroyo-garcia": relatedIdentityProfile({
    key: "mario-arroyo-garcia",
    first: "Mario",
    last: "Arroyo García",
    fullName: "Mario Arroyo García",
    photo: "assets/photo-thumb-06.png",
    aNumber: "A110004813",
    fin: "4410-62-1185",
    coa: "K2",
    status: "Derivative child",
    dob: "October 2, 2002",
    address: "1328 Coral Way, Miami, FL 33135",
    aliases: ["Mario Arroyo", "Mario A. García"],
    cob: "Ecuador",
    ssn: "188-44-9012",
    passport: "EC9021845",
    gender: "Male",
    dfo: "March 15, 2019",
    parents: ["Maria Teresa GARCÍA RAMÍREZ", "Julio Arroyo"],
  }),
  "julio-arroyo": relatedIdentityProfile({
    key: "julio-arroyo",
    first: "Julio",
    last: "Arroyo",
    fullName: "Julio Arroyo",
    photo: "assets/photo-thumb-07.png",
    aNumber: "A100045912",
    fin: "4150-20-7741",
    coa: "IR6",
    status: "LPR Active",
    dob: "September 22, 1961",
    address: "1328 Coral Way, Miami, FL 33135",
    aliases: ["Julio A. Arroyo"],
    cob: "Ecuador",
    ssn: "224-19-6014",
    passport: "EC6612914",
    gender: "Male",
    dfo: "June 12, 2012",
    spouse: "Maria Teresa GARCÍA RAMÍREZ",
    children: ["Gloria Arroyo García", "Mario Arroyo García"],
  }),
  "hunter-fox": relatedIdentityProfile({
    key: "hunter-fox",
    first: "Hunter",
    last: "Fox",
    fullName: "Hunter Fox",
    photo: "assets/photo-thumb-08.png",
    aNumber: "REP-004182",
    fin: "N/A",
    coa: "G-28",
    status: "Attorney of record",
    dob: "January 12, 1975",
    address: "44 Biscayne Blvd, Miami, FL 33132",
    aliases: ["H. Fox", "Hunter R. Fox"],
    cob: "United States",
    ssn: "Representative record",
    passport: "N/A",
    gender: "Male",
    dfo: "April 19, 2019",
  }),
  "mia-ramirez": relatedIdentityProfile({
    key: "mia-ramirez",
    first: "Mia",
    last: "Ramírez",
    fullName: "Mia Ramírez",
    photo: "assets/photo-thumb-05.png",
    aNumber: "A090018271",
    fin: "3301-18-2710",
    status: "Parent record",
    dob: "June 5, 1938",
    aliases: ["MIA RAMÍREZ"],
    cob: "Ecuador",
    gender: "Female",
    children: ["Maria Teresa GARCÍA RAMÍREZ"],
  }),
  "jose-garcia": relatedIdentityProfile({
    key: "jose-garcia",
    first: "Jose",
    last: "García",
    fullName: "Jose García",
    photo: "assets/photo-thumb-06.png",
    aNumber: "A090018272",
    fin: "3301-18-2720",
    status: "Parent record",
    dob: "February 11, 1935",
    aliases: ["Jose GARCÍA"],
    cob: "Ecuador",
    gender: "Male",
    children: ["Maria Teresa GARCÍA RAMÍREZ"],
  }),
  "melissa-grant": relatedIdentityProfile({
    key: "melissa-grant",
    first: "Melissa",
    last: "Grant",
    fullName: "Melissa Grant",
    photo: "assets/photo-thumb-08.png",
    aNumber: "REP-006294",
    fin: "N/A",
    coa: "G-28",
    status: "Attorney of record",
    dob: "May 19, 1980",
    address: "201 S Miami Ave, Miami, FL 33130",
  }),
  "mateo-garcia": relatedIdentityProfile({
    key: "mateo-garcia",
    first: "Mateo",
    last: "García",
    fullName: "Mateo García",
    photo: "assets/photo-thumb-06.png",
    aNumber: "A111014446",
    fin: "4411-14-4461",
    status: "Child record",
    dob: "August 7, 2007",
    cob: "Ecuador",
    gender: "Male",
    parents: ["Julia GARCÍA RAMÍREZ"],
  }),
  "lucia-garcia": relatedIdentityProfile({
    key: "lucia-garcia",
    first: "Lucia",
    last: "García",
    fullName: "Lucia García",
    photo: "assets/photo-thumb-05.png",
    aNumber: "A111014447",
    fin: "4411-14-4471",
    status: "Child record",
    dob: "December 1, 2010",
    cob: "Ecuador",
    gender: "Female",
    parents: ["Julia GARCÍA RAMÍREZ"],
  }),
  "nadia-coleman": relatedIdentityProfile({
    key: "nadia-coleman",
    first: "Nadia",
    last: "Coleman",
    fullName: "Nadia Coleman",
    photo: "assets/photo-thumb-08.png",
    aNumber: "REP-008113",
    fin: "N/A",
    coa: "G-28",
    status: "Attorney of record",
    dob: "March 2, 1978",
    address: "18 Court Street, Buffalo, NY 14202",
  }),
  "ravi-mehta": relatedIdentityProfile({
    key: "ravi-mehta",
    first: "Ravi",
    last: "Mehta",
    fullName: "Ravi Mehta",
    photo: "assets/photo-thumb-08.png",
    aNumber: "REP-003771",
    fin: "N/A",
    coa: "G-28",
    status: "Attorney of record",
    dob: "November 13, 1972",
    address: "33-02 Broadway, Queens, NY 11106",
  }),
  "sofia-garcia": relatedIdentityProfile({
    key: "sofia-garcia",
    first: "Sofia",
    last: "García",
    fullName: "Sofia García",
    photo: "assets/photo-thumb-05.png",
    aNumber: "A112023667",
    fin: "4412-23-6671",
    status: "Child record",
    dob: "February 14, 2008",
    cob: "Ecuador",
    gender: "Female",
    parents: ["Maria GARCÍA RAMÍREZ"],
  }),
  "julia-ramirez-parent": relatedIdentityProfile({
    key: "julia-ramirez-parent",
    first: "Julia",
    last: "Ramírez",
    fullName: "Julia Ramírez",
    photo: "assets/photo-thumb-05.png",
    aNumber: "A090014446",
    fin: "3301-14-4460",
    status: "Parent record",
    dob: "January 6, 1940",
    cob: "Ecuador",
    gender: "Female",
    children: ["Julia GARCÍA RAMÍREZ"],
  }),
  "pablo-garcia-moncayo": relatedIdentityProfile({
    key: "pablo-garcia-moncayo",
    first: "Pablo",
    last: "García Moncayo",
    fullName: "Pablo García Moncayo",
    photo: "assets/photo-thumb-07.png",
    aNumber: "A090014447",
    fin: "3301-14-4470",
    status: "Parent record",
    dob: "May 30, 1936",
    cob: "Ecuador",
    gender: "Male",
    children: ["Julia GARCÍA RAMÍREZ"],
  }),
  "andy-gunnarson": relatedIdentityProfile({
    key: "andy-gunnarson",
    first: "Andy",
    last: "Gunnarson",
    fullName: "Andy Gunnarson",
    photo: "assets/photo-thumb-07.png",
    aNumber: "A090001234",
    fin: "3301-01-2341",
    status: "Parent record",
    dob: "July 20, 1944",
    cob: "Canada",
    gender: "Male",
    children: ["Victoria GUNNARSON"],
  }),
  "rosemary-miles": relatedIdentityProfile({
    key: "rosemary-miles",
    first: "Rosemary",
    last: "Miles",
    fullName: "Rosemary Miles",
    photo: "assets/photo-thumb-05.png",
    aNumber: "A090001235",
    fin: "3301-01-2351",
    status: "Parent record",
    dob: "October 14, 1948",
    cob: "Canada",
    gender: "Female",
    children: ["Victoria GUNNARSON"],
  }),
  "josephina-ramirez": relatedIdentityProfile({
    key: "josephina-ramirez",
    first: "Josephina",
    last: "Ramírez",
    fullName: "Josephina Ramírez",
    photo: "assets/photo-thumb-05.png",
    aNumber: "A090023667",
    fin: "3301-23-6671",
    status: "Parent record",
    dob: "March 27, 1939",
    cob: "Ecuador",
    gender: "Female",
    children: ["Maria GARCÍA RAMÍREZ"],
  }),
  "jorge-garcia": relatedIdentityProfile({
    key: "jorge-garcia",
    first: "Jorge",
    last: "García",
    fullName: "Jorge García",
    photo: "assets/photo-thumb-07.png",
    aNumber: "A090023668",
    fin: "3301-23-6681",
    status: "Parent record",
    dob: "August 9, 1937",
    cob: "Ecuador",
    gender: "Male",
    children: ["Maria GARCÍA RAMÍREZ"],
  }),
});

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

function escapeHtml(value = "") {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
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
  if (status.includes("DENIED") || status.includes("EXPIRED") || status.includes("WATCHLIST")) return "tone-red";
  if (status.includes("PENDING")) return "tone-orange";
  return "tone-blue";
}

function candidateId(candidate) {
  const matchingId = candidate.id === applicant.id;
  return `<span class="candidate-id ${matchingId ? "id-highlight" : ""}">${candidate.id}</span>`;
}

function identityHash(key = state.activeIdentityKey, mode = state.viewingMode) {
  return `#identity-${key}${mode === "dark" ? "-dark" : ""}`;
}

function parseIdentityHash(hash) {
  if (!hash.startsWith("#identity")) return null;
  if (hash === "#identity") return { key: "maria-teresa", dark: false };
  if (hash === "#identity-dark") return { key: "maria-teresa", dark: true };

  const suffix = hash.replace("#identity-", "");
  const dark = suffix.endsWith("-dark");
  const key = dark ? suffix.slice(0, -5) : suffix;
  return { key: identityProfiles[key] ? key : "maria-teresa", dark };
}

function currentIdentityProfile() {
  return identityProfiles[state.activeIdentityKey] || identityProfiles["maria-teresa"];
}

function openIdentity(key = "maria-teresa", options = {}) {
  state.activeIdentityKey = identityProfiles[key] ? key : "maria-teresa";
  state.identityTrail = options.trail || [];
  state.aliasesExpanded = false;
  state.modal = null;
  setView("identity", identityHash(state.activeIdentityKey));
  renderIdentityDetail();
}

function openIdentityFromButton(button) {
  openIdentity(button.dataset.identityKey || "maria-teresa", { trail: [] });
}

function openRelatedIdentityFromButton(button) {
  const targetKey = button.dataset.identityKey || "maria-teresa";
  const parentKey = button.dataset.parentIdentityKey || state.activeIdentityKey;
  const baseTrail = state.view === "identity" ? state.identityTrail : [];
  const trail = parentKey && parentKey !== targetKey ? [...baseTrail, parentKey] : baseTrail;
  openIdentity(targetKey, { trail });
}

function openBreadcrumbIdentityFromButton(button) {
  const targetKey = button.dataset.identityKey || "maria-teresa";
  const index = Number(button.dataset.trailIndex);
  const trail = Number.isFinite(index) ? state.identityTrail.slice(0, index) : [];
  openIdentity(targetKey, { trail });
}

function linkedIdentityItems(items = [], fallback = "Not recorded", options = {}) {
  const usableItems = items.filter((item) => item && !String(item).startsWith("No "));
  if (!usableItems.length) return `<div class="empty-value">${fallback}</div>`;
  const parentKey = options.parentKey || state.activeIdentityKey;
  return usableItems
    .map((item) => {
      const targetKey = profileKeyForPersonName(item);
      if (!targetKey) return ghostButton(item, { className: "stacked-link" });
      return ghostButton(item, {
        action: "open-related-identity",
        className: "stacked-link",
        iconName: "account_circle",
        attrs: {
          "data-identity-key": targetKey,
          "data-parent-identity-key": parentKey,
        },
      });
    })
    .join("");
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

const relationshipIdentityAliases = {
  [normalized("MIA RAMÍREZ")]: "mia-ramirez",
  [normalized("Jose GARCÍA")]: "jose-garcia",
  [normalized("Julia RAMÍREZ")]: "julia-ramirez-parent",
  [normalized("Pablo GARCÍA MONCAYO")]: "pablo-garcia-moncayo",
  [normalized("Andy GUNNARSON")]: "andy-gunnarson",
  [normalized("Rosemary MILES")]: "rosemary-miles",
  [normalized("Josephina RAMÍREZ")]: "josephina-ramirez",
  [normalized("Jorge GARCÍA")]: "jorge-garcia",
};

function profileKeyForPersonName(name = "") {
  const normalizedName = normalized(name);
  if (relationshipIdentityAliases[normalizedName]) return relationshipIdentityAliases[normalizedName];
  const match = Object.values(identityProfiles).find(
    (profile) => normalized(profile.fullName) === normalizedName || (profile.aliases || []).some((alias) => normalized(alias) === normalizedName),
  );
  return match?.key || "";
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
  return `<button ${attrString}>${selected ? icon("check_small", "ui-checkbox__icon") : ""}</button>`;
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
          <div><div class="label">TIME LEFT</div><div class="value danger countdown-value" data-countdown="queue-sla" aria-live="polite">${formatQueueCountdown()}</div></div>
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
  startQueueCountdown();
  bindQueueEvents();
  bindToastEvents();
}

function candidateRow(candidate, index, expanded = false) {
  const isSelected = isCandidateSelected(candidate);
  const profile = identityProfiles[candidate.identityKey] || {};
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
            ${buttonComponent("View identity", { variant: "outline", action: "open-identity", attrs: { "data-identity-key": candidate.identityKey } })}
          </div>
          <div>
            <div class="candidate-heading">${candidateId(candidate)}${statusBadge(candidate.status)}</div>
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
                <div class="copy">${linkedIdentityItems(candidate.children || [], "No children recorded", { parentKey: candidate.identityKey })}</div>
              </div>
              <div>
                <div class="label">SPOUSE</div>
                <div class="copy">${linkedIdentityItems([candidate.spouse], "No spouse recorded", { parentKey: candidate.identityKey })}</div>
              </div>
              <div>
                <div class="label">ATTORNEY</div>
                <div class="copy">${linkedIdentityItems([profile.relationships?.attorney], "No attorney recorded", { parentKey: candidate.identityKey })}</div>
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
            ${buttonComponent("View identity", { variant: "outline", action: "open-identity", attrs: { "data-identity-key": candidate.identityKey } })}
          </div>
          <div>
            <div class="candidate-heading">${candidateId(candidate)}${statusBadge(candidate.status)}</div>
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
  if (!count) return "";
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
    <aside class="summary-bar visible" aria-live="polite">
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
    button.addEventListener("click", () => openIdentityFromButton(button));
  });
  bindIdentityNavigationEvents();
  document.querySelector("[data-action='open-ead']")?.addEventListener("click", () => {
    state.activeIdentityKey = candidates[0].identityKey;
    state.modal = "ead";
    renderQueue();
  });
  bindModalEvents();
}

function bindIdentityNavigationEvents() {
  document.querySelectorAll("[data-action='open-related-identity']").forEach((button) => {
    button.addEventListener("click", () => openRelatedIdentityFromButton(button));
  });
  document.querySelectorAll("[data-action='open-breadcrumb-identity']").forEach((button) => {
    button.addEventListener("click", () => openBreadcrumbIdentityFromButton(button));
  });
}

function renderResolve(options = {}) {
  const restoreScrollY = options.preserveScroll ? window.scrollY : options.restoreScrollY;
  stopQueueCountdown();
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
  app.innerHTML = shell(content, { crumbs: ["Resolve identity", "Link"] }) + renderToast() + renderModal();
  if (Number.isFinite(restoreScrollY)) {
    window.scrollTo(0, restoreScrollY);
    window.requestAnimationFrame(() => window.scrollTo(0, restoreScrollY));
  } else {
    window.scrollTo(0, 0);
  }
  bindResolveEvents();
  bindToastEvents();
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
                  ${buttonComponent("View identity", { variant: "outline", action: "open-identity", attrs: { "data-identity-key": candidate.identityKey } })}
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
  const attachmentCount = state.attachments.length;
  return `
    <section class="step ${nameComplete ? "complete" : "active"}">
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
          ? `<div class="disclosure" aria-live="polite">
              <div class="disclosure-marker">${icon("subdirectory_arrow_right")}</div>
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
    <section class="step ${nameComplete ? aComplete ? "complete" : "active" : "disabled"}">
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
          ? `<div class="disclosure" aria-live="polite">
              <div class="disclosure-marker">${icon("subdirectory_arrow_right")}</div>
              <h3>Keep "${remainingA}" as consolidated A#${remainingA.includes(",") ? "s" : ""} for this identity?</h3>
              <p class="helper">Consolidated A-numbers remain searchable but this package will name ${state.primaryA} as primary.</p>
              <div class="radio-list">
                ${radioOption("consolidated-a", "Yes", "yes", state.consolidatedA)}
                ${radioOption("consolidated-a", "No", "no", state.consolidatedA)}
              </div>
            </div>`
          : aComplete
            ? `<div class="disclosure" aria-live="polite"><div class="disclosure-marker">${icon("subdirectory_arrow_right")}</div><p class="helper">No additional A-numbers need to be consolidated for this package.</p></div>`
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
              ${ghostButton("Add a link", { action: "open-add-link", iconName: "link" })}
              ${ghostButton("Attach a document", { action: "open-attach-document", iconName: "attach_file" })}
            </div>`
          : ""
      }
      ${attachmentCount ? attachmentSummary() : ""}
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

function attachmentSummary() {
  return `
    <div class="attachment-summary" aria-live="polite">
      <div class="label">PACKAGE MATERIALS</div>
      <div class="attachment-pill-row">
        ${state.attachments
          .map((item) => `<span class="attachment-pill">${icon(item.type === "link" ? "link" : "description")}${item.label}</span>`)
          .join("")}
      </div>
    </div>
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
      renderResolve({ preserveScroll: true });
    });
  });
  document.querySelectorAll("input[name='alias-choice']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.aliasChoice = event.target.value;
      renderResolve({ preserveScroll: true });
    });
  });
  document.querySelectorAll("input[name='primary-a']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.primaryA = event.target.value;
      state.consolidatedA = "";
      renderResolve({ preserveScroll: true });
    });
  });
  document.querySelectorAll("input[name='consolidated-a']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.consolidatedA = event.target.value;
      renderResolve({ preserveScroll: true });
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
    const undoSnapshot = {
      selectedIds: getSelectedIds(),
      primaryName: state.primaryName,
      aliasChoice: state.aliasChoice,
      primaryA: state.primaryA,
      consolidatedA: state.consolidatedA,
      notes: state.notes,
      attachments: [...state.attachments],
      scrollY: window.scrollY,
    };
    state.submitting = true;
    renderResolve({ preserveScroll: true });
    window.setTimeout(() => {
      state.submitting = false;
      state.submitted = true;
      state.undoSnapshot = undoSnapshot;
      setSelectedIds([]);
      state.view = "queue";
      state.toast = {
        title: "Resolution package sent",
        body: `${selectedCount} linked identity ${selectedCount === 1 ? "candidate" : "candidates"} and your notes were sent to a final evaluator.`,
        status: "Pending final resolution",
        action: "undo-resolution-submit",
        actionLabel: "Undo",
        duration: 3000,
      };
      history.replaceState(null, "", "#pending");
      renderQueue();
    }, 850);
  });
  document.querySelector("[data-action='open-photo']")?.addEventListener("click", () => {
    state.modal = "photo";
    renderResolve({ preserveScroll: true });
  });
  document.querySelector("[data-action='open-add-link']")?.addEventListener("click", () => {
    state.modal = "add-link";
    renderResolve({ preserveScroll: true });
  });
  document.querySelector("[data-action='open-attach-document']")?.addEventListener("click", () => {
    state.modal = "attach-document";
    renderResolve({ preserveScroll: true });
  });
  document.querySelectorAll("[data-action='open-identity']").forEach((button) => {
    button.addEventListener("click", () => openIdentityFromButton(button));
  });
  bindIdentityNavigationEvents();
  bindModalEvents();
}

function identityBreadcrumb(profile) {
  const trail = state.identityTrail.filter((key) => identityProfiles[key] && key !== profile.key);
  const trailItems = trail
    .map((key, index) => {
      const trailProfile = identityProfiles[key];
      return `
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        ${ghostButton(trailProfile.fullName, {
          action: "open-breadcrumb-identity",
          className: "breadcrumb-link",
          attrs: {
            "data-identity-key": key,
            "data-trail-index": index,
          },
        })}
      `;
    })
    .join("");
  return `
    <nav class="mod-breadcrumb" aria-label="Breadcrumb">
      ${ghostButton("Identity Resolution Queue", { action: "return-queue", className: "breadcrumb-link" })}
      ${trailItems}
      <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      <span>${profile.fullName}</span>
    </nav>
  `;
}

function renderIdentityDetail() {
  stopQueueCountdown();
  syncBodyViewingMode(state.viewingMode);
  const profile = currentIdentityProfile();
  const visibleAliases = state.aliasesExpanded ? profile.aliases : profile.aliases.slice(0, 3);
  const hiddenAliasCount = profile.aliases.length - visibleAliases.length;
  const content = `
    ${identityBreadcrumb(profile)}
    <main class="identity-detail-page">
      <section class="identity-detail-grid identity-dossier">
        <aside class="identity-side">
          <div class="rail-eyebrow">${profile.label}</div>
          <div class="identity-photo-frame">
            <img class="identity-main-photo" src="${profile.photo}" alt="" />
            ${ghostButton("See more", { action: "open-photo", className: "see-more-link", iconName: "photo_library" })}
          </div>
          <div class="identity-verified-block rail-fact">
            <div class="label">A# <span class="verified-icon">${icon("check")}</span></div>
            <div class="big-id">${profile.aNumber}</div>
            ${ghostButton("See consolidated")}
          </div>
          <div class="identity-verified-block rail-fact">
            <div class="label">FIN <span class="verified-icon">${icon("check")}</span></div>
            <div class="big-id">${profile.fin}</div>
          </div>
          <div class="rail-action-stack">
            ${buttonComponent("Stacks", { variant: "outline", className: "mini-action", iconName: "inventory_2" })}
            ${buttonComponent("Rails", { variant: "outline", className: "mini-action", iconName: "account_tree" })}
          </div>
        </aside>
        <section class="identity-main">
          <div class="dossier-kicker">${profile.label === "Linked person identity" ? "Linked person record" : "Applicant identity record"}</div>
          <div class="name-grid">
            ${identityNameField("FIRST", profile.first)}
            ${identityNameField("MIDDLE", profile.middle || "—")}
            ${identityNameField("LAST", profile.last, "wide")}
          </div>
          <div class="profile-facts">
            ${identityFact("COA", profile.coa, true)}
            ${identityFact("STATUS", profile.status, false, "See previous")}
            ${identityFact("DOB", profile.dob, false, "See more")}
          </div>
          <div class="identity-alias-row">
            <div class="label">ALIASES</div>
            <div class="chips">
              ${visibleAliases.map((alias) => chip(alias)).join("")}
              ${
                hiddenAliasCount > 0 || state.aliasesExpanded
                  ? ghostButton(state.aliasesExpanded ? "Show fewer" : `See ${hiddenAliasCount} more`, {
                      action: "toggle-aliases",
                      attrs: { "aria-expanded": String(state.aliasesExpanded) },
                    })
                  : ""
              }
            </div>
          </div>
          <div class="address-block">
            <div class="label">ADDRESS</div>
            <div>${profile.address} ${ghostButton("See previous")}</div>
          </div>
          <div class="detail-divider"></div>
          <section class="identity-section">
            <h3>BIOGRAPHIC DATA</h3>
            <div class="identity-info-grid">
              ${field("COB", profile.biographic.cob, false, true)}
              ${field("POE", profile.biographic.poe, false, true)}
              ${field("SSN", profile.biographic.ssn)}
              ${field("COC", profile.biographic.coc, false, true)}
              ${field("DOE", profile.biographic.doe, false, true)}
              ${field("PASSPORT #", profile.biographic.passport)}
              ${field("GENDER", profile.biographic.gender)}
              ${field("DFO", profile.biographic.dfo, false, true)}
              ${field("FBI#", profile.biographic.fbi)}
            </div>
          </section>
          <div class="detail-divider"></div>
          <section class="identity-section relationships-section">
            <h3>RELATIONSHIPS</h3>
            <div class="identity-info-grid">
              <div>
                <div class="label">PARENTS</div>
                ${linkedIdentityItems(profile.relationships.parents)}
              </div>
              <div>
                <div class="label">SPOUSE</div>
                ${linkedIdentityItems([profile.relationships.spouse], "No spouse recorded")}
              </div>
              <div>
                <div class="label">ATTORNEY</div>
                ${linkedIdentityItems([profile.relationships.attorney], "No attorney recorded")}
                ${ghostButton("See previous", { className: "stacked-link" })}
              </div>
              <div>
                <div class="label">CHILDREN</div>
                ${linkedIdentityItems(profile.relationships.children, "No children recorded")}
              </div>
            </div>
          </section>
          <div class="detail-divider"></div>
          <section class="identity-section">
            <h3>CARD DATA</h3>
            ${identityCardData(profile)}
          </section>
        </section>
      </section>
      <section class="background-section">
        <div class="background-rule"></div>
        <h2>Background information</h2>
        <div class="background-layout">
          ${backgroundFilters()}
          <div class="timeline-list">
            ${backgroundRows.map((row, index) => backgroundRow(row, index, backgroundRows, profile)).join("")}
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

function identityCardData(profile = currentIdentityProfile()) {
  const card = profile.card;
  const greenTone = card.greenStatus === "READY" ? "ready" : statusClass(card.greenStatus).replace("tone-", "");
  const eadTone = statusClass(card.eadStatus).replace("tone-", "") || "blue";
  return `
    <div class="identity-card-data">
      <article class="document-card document-card-ready">
        <div class="document-card-header">
          <div class="card-data-heading">GREEN CARD</div>
          ${badge(card.greenStatus, { className: `document-status ${greenTone}` })}
        </div>
        <div class="identity-card-row">
          ${field("EXPIRES", card.greenExpires)}
          ${field("SITE CODE", card.siteCode, false, true)}
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
          ${field("STATUS", card.eadStatus, false, false, eadTone)}
          ${field("EXPIRES", card.eadExpires)}
          ${field("SITE CODE", card.siteCode, false, true)}
          ${field("PROVISION OF LAW", card.provision, false, true)}
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

function backgroundRow(row, index, rows = backgroundRows, profile = currentIdentityProfile()) {
  const showYear = index === 0 || rows[index - 1].year !== row.year;
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
        ${expanded ? expandedTimelineDetail(row, index, profile) : ""}
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

function expandedTimelineDetail(row, index, profile = currentIdentityProfile()) {
  const details = [
    {
      summary: `${row.title} package is open for adjudication under ${profile.aNumber}.`,
      meta: [["Receipt #", profile.card.receipt], ["Office", `${profile.card.siteCode} Field Office`], ["Last update", row.date]],
      notes: ["Priority date captured", `Biometrics linked to ${profile.fullName}`],
    },
    {
      summary: `Biometrics appointment completed and associated with ${profile.fullName}.`,
      meta: [["Appointment ID", `ASC-${profile.card.siteCode}-${profile.aNumber.slice(-4)}`], ["Location", `${profile.biographic.poe} ASC`], ["Result", "Completed"]],
      notes: ["Photo captured", "Fingerprints available for background checks"],
    },
    {
      summary: "Employment authorization reviewed against the supporting benefit record.",
      meta: [["Receipt #", profile.card.receipt], ["Card status", profile.card.eadStatus], ["Last update", row.date]],
      notes: ["Draft card image available", "Linked to current mailing address"],
      progress: true,
    },
    {
      summary: "Arrival record received from port-of-entry encounter data.",
      meta: [["Document", "I-94"], ["Carrier", "Aero Nacional 431"], ["Class", profile.coa]],
      notes: [`Entry matched passport ${profile.biographic.passport}`, `POE set to ${profile.biographic.poe}`],
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
      meta: [["Court", "Immigration Court"], ["Proceeding", "Master calendar"], ["Decision", row.status || "Recorded"]],
      notes: ["Order added to case file", `Attorney ${profile.relationships.attorney} on record`],
    },
    {
      summary: "FBI response returned a watchlist indicator requiring evaluator review.",
      meta: [["Source", "FBI Name Check"], ["Response", "Watchlist"], ["Confidence", "Moderate"]],
      notes: ["Name and DOB overlap", "Manual review required before final decision"],
    },
    {
      summary: "Department of Defense check returned no active derogatory result.",
      meta: [["Source", "DoD"], ["Response", "No hit"], ["Confidence", "High"]],
      notes: [`Search included FIN ${profile.finRaw} and passport`, "No additional action required"],
    },
    {
      summary: "International search returned a possible match in Canadian records.",
      meta: [["Source", "Canada"], ["Response", "Match"], ["Confidence", "Low"]],
      notes: [`COB ${profile.biographic.cob} and DOB overlap`, "Needs evaluator confirmation"],
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
      history.replaceState(null, "", identityHash(state.activeIdentityKey, state.viewingMode));
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
  document.querySelector("[data-action='toggle-aliases']")?.addEventListener("click", () => {
    state.aliasesExpanded = !state.aliasesExpanded;
    renderIdentityDetail();
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
  bindIdentityNavigationEvents();
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
  const duration = toast.duration || 0;
  return `
    <div class="toast ${duration ? "timed-toast" : ""}" role="status" style="${duration ? `--toast-duration: ${duration}ms;` : ""}">
      <div class="toast-content">
        <h3>${toast.title}</h3>
        <p class="helper">${toast.body}</p>
        ${toast.status ? `<p class="helper"><strong>Status:</strong> ${toast.status}</p>` : ""}
      </div>
      ${
        toast.action
          ? `<div class="toast-actions">${ghostButton(toast.actionLabel || "Undo", { action: toast.action, className: "toast-action" })}</div>`
          : ""
      }
      ${duration ? `<div class="toast-progress" aria-hidden="true"><span></span></div>` : ""}
    </div>
  `;
}

function dismissToast(options = {}) {
  window.clearTimeout(toastTimerId);
  toastTimerId = null;
  if (options.clearUndo) state.undoSnapshot = null;
  state.toast = "";
  if (state.view === "resolve") renderResolve({ preserveScroll: true });
  else if (state.view === "identity") renderIdentityDetail();
  else renderQueue();
}

function bindToastEvents() {
  window.clearTimeout(toastTimerId);
  toastTimerId = null;
  const toast = state.toast;
  if (!toast || typeof toast === "string") return;

  document.querySelector("[data-action='undo-resolution-submit']")?.addEventListener("click", undoResolutionSubmit);

  if (toast.duration) {
    toastTimerId = window.setTimeout(() => {
      if (state.toast === toast) dismissToast({ clearUndo: true });
    }, toast.duration);
  }
}

function undoResolutionSubmit() {
  const snapshot = state.undoSnapshot;
  if (!snapshot) return;
  window.clearTimeout(toastTimerId);
  toastTimerId = null;
  state.submitting = false;
  state.submitted = false;
  setSelectedIds(snapshot.selectedIds);
  state.primaryName = snapshot.primaryName;
  state.aliasChoice = snapshot.aliasChoice;
  state.primaryA = snapshot.primaryA;
  state.consolidatedA = snapshot.consolidatedA;
  state.notes = snapshot.notes;
  state.attachments = [...snapshot.attachments];
  state.undoSnapshot = null;
  state.toast = "";
  state.view = "resolve";
  history.replaceState(null, "", "#resolve");
  renderResolve({ restoreScrollY: snapshot.scrollY });
}

function renderModal() {
  if (state.modal === "photo") return photoOverlay();
  if (state.modal === "ead") return eadOverlay();
  if (state.modal === "green-card") return greenCardOverlay();
  if (state.modal === "assign-a") return assignANumberOverlay();
  if (state.modal === "escalate") return escalateResolutionOverlay();
  if (state.modal === "add-link") return addLinkOverlay();
  if (state.modal === "attach-document") return attachDocumentOverlay();
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

function resolvePackageSummary() {
  const selected = selectedCandidates();
  const linkedNames = selected.length ? selected.map((candidate) => candidate.name).join(" · ") : candidates[0].name;
  return `
    <div class="package-context-card">
      <div class="label">RESOLUTION PACKAGE</div>
      <strong>${state.primaryName || applicant.name}</strong>
      <div class="action-record-meta">
        <span>Primary A# ${state.primaryA || applicant.id}</span>
        <span>${selected.length || 1} selected fragment${selected.length === 1 ? "" : "s"}</span>
      </div>
      <p>${linkedNames}</p>
    </div>
  `;
}

function addLinkOverlay() {
  return `
    <div class="overlay-backdrop">
      <div class="action-modal package-modal" role="dialog" aria-modal="true" aria-labelledby="add-link-title">
        ${iconButton("close", "Close add link dialog", { action: "close-modal", className: "modal-close" })}
        <div class="modal-kicker">PACKAGE MATERIAL</div>
        <h2 id="add-link-title">Add supporting link</h2>
        <p class="helper">Add a case-system reference that the final evaluator should review with this identity package.</p>
        ${resolvePackageSummary()}
        <label class="action-note-label" for="support-link-label">Link label</label>
        <input id="support-link-label" class="modal-input" value="Background check packet" />
        <label class="action-note-label" for="support-link-url">Reference URL or case path</label>
        <input id="support-link-url" class="modal-input" value="pcis://case/123789123/background-checks" />
        <div class="modal-helper-row">
          ${icon("info", "modal-helper-icon")}
          <span>The link is included as package context. It does not change the underlying identity records.</span>
        </div>
        <div class="modal-actions">
          ${ghostButton("Cancel", { action: "close-modal" })}
          ${buttonComponent("Add link to package", { variant: "primary", action: "confirm-add-link" })}
        </div>
      </div>
    </div>
  `;
}

function attachDocumentOverlay() {
  return `
    <div class="overlay-backdrop">
      <div class="action-modal package-modal" role="dialog" aria-modal="true" aria-labelledby="attach-document-title">
        ${iconButton("close", "Close attach document dialog", { action: "close-modal", className: "modal-close" })}
        <div class="modal-kicker">PACKAGE MATERIAL</div>
        <h2 id="attach-document-title">Attach a document</h2>
        <p class="helper">Select a plausible source document to include with the review package. The prototype simulates the attachment state.</p>
        ${resolvePackageSummary()}
        <div class="document-choice-list">
          <label class="document-choice">
            <input type="radio" name="document-choice" value="I-485 receipt bundle" checked />
            <span>${icon("description")}I-485 receipt bundle</span>
          </label>
          <label class="document-choice">
            <input type="radio" name="document-choice" value="ASC biometrics notice" />
            <span>${icon("fingerprint")}ASC biometrics notice</span>
          </label>
          <label class="document-choice">
            <input type="radio" name="document-choice" value="Name check response memo" />
            <span>${icon("person_search")}Name check response memo</span>
          </label>
        </div>
        <div class="modal-helper-row">
          ${icon("task_alt", "modal-helper-icon")}
          <span>Attached documents travel with the package sent for final evaluator review.</span>
        </div>
        <div class="modal-actions">
          ${ghostButton("Cancel", { action: "close-modal" })}
          ${buttonComponent("Attach selected document", { variant: "primary", action: "confirm-attach-document" })}
        </div>
      </div>
    </div>
  `;
}

function photoOverlay() {
  const profile = currentIdentityProfile();
  const photoSet = [profile.photo, ...portraitAssets.thumbs.filter((src) => src !== profile.photo)].slice(0, 8);
  const thumbs = photoSet
    .map((src, index) => `<img class="portrait tiny thumb ${index === 0 ? "selected" : ""}" src="${src}" alt="" />`)
    .join("");
  return `
    <div class="overlay-backdrop">
      <div class="photo-modal" role="dialog" aria-modal="true" aria-label="Photo viewer">
        ${iconButton("close", "Close photo viewer", { action: "close-modal", className: "modal-close" })}
        <div class="photo-title">${photoSet.length} photos ${ghostButton("View as a grid")}</div>
        <div class="photo-viewer">
          <img class="portrait large-photo" src="${profile.photo}" alt="" />
          <div class="photo-meta">
            <div><div class="label">DATE TAKEN</div><div class="value">${profile.photoMeta.dateTaken}</div></div>
            <div><div class="label">RECEIPT #</div><div class="value">${profile.photoMeta.receipt}</div></div>
            <div><div class="label">REASON</div><div class="value">${profile.photoMeta.reason}</div></div>
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
  const profile = currentIdentityProfile();
  return `
    <div class="overlay-backdrop">
      <div class="ead-panel" role="dialog" aria-modal="true" aria-label="EAD card">
        ${iconButton("close", "Close EAD card", { action: "close-modal", className: "modal-close" })}
        <h2>EAD card</h2>
        <p class="helper">${profile.fullName} · ${profile.card.eadStatus} · ${profile.card.eadExpires}</p>
        <img class="ead-art" src="assets/ead-front.png" alt="" />
        <div class="ead-label">EAD Front</div>
        <img class="ead-art back" src="assets/ead-back.png" alt="" />
        <div class="ead-label">EAD Back</div>
      </div>
    </div>
  `;
}

function greenCardOverlay() {
  const profile = currentIdentityProfile();
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
            <img src="${profile.photo}" alt="" />
            <div class="draft-fields">
              <div><span>Surname</span><strong>${profile.draft.surname}</strong></div>
              <div><span>Given Name</span><strong>${profile.draft.givenName}</strong></div>
              <div class="draft-field-grid">
                <div><span>USCIS#</span><strong>${profile.aNumber.replace("A", "")}</strong></div>
                <div><span>Category</span><strong>${profile.draft.category}</strong></div>
                <div><span>Country of Birth</span><strong>${profile.draft.country}</strong></div>
                <div><span>Date of Birth</span><strong>${profile.draft.birth}</strong></div>
                <div><span>Resident Since</span><strong>DRAFT</strong></div>
                <div><span>Card Expires</span><strong>${profile.card.greenExpires}</strong></div>
              </div>
            </div>
          </div>
          <div class="draft-mrz">${escapeHtml(profile.draft.mrz)}<br />${profile.aNumber}${profile.draft.country.slice(0, 3)}${profile.draft.birth.replaceAll(" ", "")}F&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;DRAFT</div>
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
    if (state.view === "resolve") renderResolve({ preserveScroll: true });
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
  document.querySelector("[data-action='confirm-add-link']")?.addEventListener("click", () => {
    const label = document.querySelector("#support-link-label")?.value?.trim() || "Supporting link";
    state.attachments = [...state.attachments, { type: "link", label }];
    state.modal = null;
    state.toast = {
      title: "Link added to package",
      body: `${label} will be included for final evaluator review.`,
      status: "Package material staged",
    };
    renderResolve({ preserveScroll: true });
  });
  document.querySelector("[data-action='confirm-attach-document']")?.addEventListener("click", () => {
    const label = document.querySelector("input[name='document-choice']:checked")?.value || "Source document";
    state.attachments = [...state.attachments, { type: "document", label }];
    state.modal = null;
    state.toast = {
      title: "Document attached",
      body: `${label} was added to the resolution package.`,
      status: "Package material staged",
    };
    renderResolve({ preserveScroll: true });
  });
}

function hydrateFromHash() {
  const hash = window.location.hash;
  const identityRoute = parseIdentityHash(hash);
  if (hash === "#selected") setSelectedIds([candidates[0].id]);
  if (hash === "#resolve" || hash === "#resolve-name" || hash === "#resolve-a") {
    state.view = "resolve";
    setSelectedIds([candidates[0].id]);
  }
  if (identityRoute) {
    state.view = "identity";
    state.activeIdentityKey = identityRoute.key;
    state.identityTrail = [];
    if (identityRoute.dark) state.viewingMode = "dark";
  }
  if (hash === "#photo" || hash === "#green-card" || hash === "#ead") {
    state.view = "identity";
  }
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
