/**
 * SIT725 – 5.4D Validation Tests (MANDATORY TEMPLATE)
 *
 * HOW TO RUN: (Node.js 18+ is required)
 *   1. Start MongoDB
 *   2. Start your server (npm start)
 *   3. node validation-tests.js
 *
 * DO NOT MODIFY:
 *   - Output format (TEST|, SUMMARY|, COVERAGE|)
 *   - test() function signature
 *   - Exit behaviour
 *   - coverageTracker object
 *   - Logging structure
 *
 * YOU MUST:
 *   - Modify makeValidBook() to satisfy your schema rules
 *   - Add sufficient tests to meet coverage requirements
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = "/api/books";

// =============================
// INTERNAL STATE (DO NOT MODIFY)
// =============================

const results = [];

const coverageTracker = {
  CREATE_FAIL: 0,
  UPDATE_FAIL: 0,
  TYPE: 0,
  REQUIRED: 0,
  BOUNDARY: 0,
  LENGTH: 0,
  TEMPORAL: 0,
  UNKNOWN_CREATE: 0,
  UNKNOWN_UPDATE: 0,
  IMMUTABLE: 0,
};

// =============================
// OUTPUTS FORMAT (DO NOT MODIFY)
// =============================

function logHeader(uniqueId) {
  console.log("SIT725_VALIDATION_TESTS");
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`API_BASE=${API_BASE}`);
  console.log(`INFO|Generated uniqueId=${uniqueId}`);
}

function logResult(r) {
  console.log(
    `TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`
  );
}

function logSummary() {
  const failed = results.filter(r => !r.pass).length;
  console.log(
    `SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`
  );
  return failed === 0;
}

function logCoverage() {
  console.log(
    `COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
    `|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
    `|TYPE=${coverageTracker.TYPE}` +
    `|REQUIRED=${coverageTracker.REQUIRED}` +
    `|BOUNDARY=${coverageTracker.BOUNDARY}` +
    `|LENGTH=${coverageTracker.LENGTH}` +
    `|TEMPORAL=${coverageTracker.TEMPORAL}` +
    `|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
    `|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
    `|IMMUTABLE=${coverageTracker.IMMUTABLE}`
  );
}

// =============================
// HTTP HELPER
// =============================

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  return { status: res.status, text };
}

// =============================
// TEST REGISTRATION FUNCTION
// =============================

async function test({ id, name, method, path, expected, body, tags }) {

  const { status } = await http(method, path, body);
  const pass = status === expected;

  const result = { id, name, method, path, expected, actual: status, pass };
  results.push(result);
  logResult(result);

  // treat missing or invalid tags as []
  const safeTags = Array.isArray(tags) ? tags : [];

  safeTags.forEach(tag => {
    if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
      coverageTracker[tag]++;
    }
  });
}

// =============================
// STUDENT MUST MODIFY THESE
// =============================

function makeValidBook(id) {
  return {
    id,
    title: "Validation Test Book Title",
    author: "Validation Author",
    year: 2005,
    genre: "Fiction",
    summary:
      "A summary that is definitely long enough to pass the server minimum length rule for book summaries.",
    price: 19.99,
  };
}

function makeValidUpdate() {
  return {
    title: "Updated Validation Test Book Title Here",
    author: "Updated Validation Author Name",
    year: 2006,
    genre: "Non-Fiction",
    summary:
      "Updated summary text that is still long enough for the minimum summary length requirement enforced.",
    price: 29.99,
  };
}

// =============================
// REQUIRED BASE TESTS (DO NOT REMOVE)
// =============================

async function run() {

  const uniqueId = `b${Date.now()}`;
  logHeader(uniqueId);

  const ping = await http("GET", "/api/integrity-check42");
  if (ping.status !== 204) {
    throw new Error(
      `Cannot reach API at ${BASE_URL} (GET /api/integrity-check42 expected 204, got ${ping.status}). Start the server with MongoDB running.`
    );
  }

  const createPath = API_BASE;
  const updatePath = (mongoId) => `${API_BASE}/${mongoId}`;

  // ---- T01 Valid CREATE ----
  await test({
    id: "T01",
    name: "Valid create",
    method: "POST",
    path: createPath,
    expected: 201,
    body: makeValidBook(uniqueId),
    tags: []
  });

  const listRes = await http("GET", createPath);
  if (listRes.status !== 200) {
    throw new Error("After T01: GET /api/books failed; cannot resolve Mongo _id for PUT tests.");
  }
  let books;
  try {
    books = JSON.parse(listRes.text);
  } catch {
    throw new Error("After T01: could not parse GET /api/books JSON.");
  }
  const created = Array.isArray(books) ? books.find((b) => b.id === uniqueId) : null;
  if (!created || !created._id) {
    throw new Error("After T01: created book not found in list (check makeValidBook matches schema).");
  }
  const mongoId = created._id;

  // ---- T02 Duplicate ID ----
  await test({
    id: "T02",
    name: "Duplicate ID",
    method: "POST",
    path: createPath,
    expected: 409,
    body: makeValidBook(uniqueId),
    tags: ["CREATE_FAIL"]
  });

  // ---- T03 Immutable ID ----
  await test({
    id: "T03",
    name: "Immutable ID on update",
    method: "PUT",
    path: updatePath(mongoId),
    expected: 400,
    body: { ...makeValidUpdate(), id: "b999" },
    tags: ["UPDATE_FAIL", "IMMUTABLE"]
  });

  // ---- T04 Unknown field CREATE ----
  await test({
    id: "T04",
    name: "Unknown field CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 1}`), hack: true },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"]
  });

  // ---- T05 Unknown field UPDATE ----
  await test({
    id: "T05",
    name: "Unknown field UPDATE",
    method: "PUT",
    path: updatePath(mongoId),
    expected: 400,
    body: { ...makeValidUpdate(), hack: true },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"]
  });

  // =====================================
  // STUDENTS MUST ADD ADDITIONAL TESTS
  // =====================================

  const runSuffix = `${Date.now()}`;

  await test({
    id: "T06",
    name: "GET book by Mongo id returns 200",
    method: "GET",
    path: updatePath(mongoId),
    expected: 200,
    tags: []
  });

  await test({
    id: "T07",
    name: "PUT valid full update returns 200",
    method: "PUT",
    path: updatePath(mongoId),
    expected: 200,
    body: makeValidUpdate(),
    tags: []
  });

  await test({
    id: "T08",
    name: "PUT non-existent Mongo id returns 404",
    method: "PUT",
    path: updatePath("507f1f77bcf86cd799439011"),
    expected: 404,
    body: makeValidUpdate(),
    tags: []
  });

  await test({
    id: "T09",
    name: "POST missing required title",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => {
      const p = makeValidBook(`b${runSuffix}-RQ`);
      delete p.title;
      return p;
    })(),
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  await test({
    id: "T10",
    name: "POST year as string wrong type",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => {
      const p = makeValidBook(`b${runSuffix}-TP`);
      p.year = "2000";
      return p;
    })(),
    tags: ["CREATE_FAIL", "TYPE"]
  });

  await test({
    id: "T11",
    name: "POST future year",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => {
      const p = makeValidBook(`b${runSuffix}-FY`);
      p.year = 2032;
      return p;
    })(),
    tags: ["CREATE_FAIL", "TEMPORAL"]
  });

  await test({
    id: "T12",
    name: "POST title exceeds max length",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => {
      const p = makeValidBook(`b${runSuffix}-TL`);
      p.title = "x".repeat(201);
      return p;
    })(),
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  await test({
    id: "T13",
    name: "POST zero price",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => {
      const p = makeValidBook(`b${runSuffix}-ZP`);
      p.price = 0;
      return p;
    })(),
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  await test({
    id: "T14",
    name: "POST invalid business id pattern",
    method: "POST",
    path: createPath,
    expected: 400,
    body: makeValidBook("bad!"),
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  await test({
    id: "T15",
    name: "POST summary too short",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => {
      const p = makeValidBook(`b${runSuffix}-SS`);
      p.summary = "short";
      return p;
    })(),
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  await test({
    id: "T16",
    name: "PUT year wrong type",
    method: "PUT",
    path: updatePath(mongoId),
    expected: 400,
    body: (() => {
      const u = makeValidUpdate();
      u.year = "1999";
      return u;
    })(),
    tags: ["UPDATE_FAIL", "TYPE"]
  });

  await test({
    id: "T17",
    name: "PUT summary too short",
    method: "PUT",
    path: updatePath(mongoId),
    expected: 400,
    body: (() => {
      const u = makeValidUpdate();
      u.summary = "too short";
      return u;
    })(),
    tags: ["UPDATE_FAIL", "LENGTH"]
  });

  await test({
    id: "T18",
    name: "PUT future year",
    method: "PUT",
    path: updatePath(mongoId),
    expected: 400,
    body: (() => {
      const u = makeValidUpdate();
      u.year = 2040;
      return u;
    })(),
    tags: ["UPDATE_FAIL", "TEMPORAL"]
  });

  await test({
    id: "T19",
    name: "PUT price over max",
    method: "PUT",
    path: updatePath(mongoId),
    expected: 400,
    body: (() => {
      const u = makeValidUpdate();
      u.price = 200000;
      return u;
    })(),
    tags: ["UPDATE_FAIL", "BOUNDARY"]
  });

  await test({
    id: "T20",
    name: "PUT missing required field",
    method: "PUT",
    path: updatePath(mongoId),
    expected: 400,
    body: (() => {
      const u = makeValidUpdate();
      delete u.genre;
      return u;
    })(),
    tags: ["UPDATE_FAIL", "REQUIRED"]
  });

  const pass = logSummary();
  logCoverage();

  process.exit(pass ? 0 : 1);
}

run().catch(err => {
  console.error("ERROR", err);
  process.exit(2);
});
