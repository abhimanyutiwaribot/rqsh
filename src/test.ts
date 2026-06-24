import { parseReplCommand } from "./utils/parseReplCommand.js";

interface Test {
  input: string;
  baseUrl?: string;
  expectedUrl: string;
  expectedMethod: string;
  expectedHeaders?: Record<string, string>;
  expectedBody?: string;
}

const tests: Test[] = [
  {
    input: "jsonplaceholder.typicode.com/posts/1",
    expectedUrl: "http://jsonplaceholder.typicode.com/posts/1",
    expectedMethod: "GET"
  },
  {
    input: "GET jsonplaceholder.typicode.com/posts limit=5 page=1",
    expectedUrl: "http://jsonplaceholder.typicode.com/posts?limit=5&page=1",
    expectedMethod: "GET"
  },
  {
    input: "POST jsonplaceholder.typicode.com/posts Authorization:Bearer title=\"Test API\" userId:=10",
    expectedUrl: "http://jsonplaceholder.typicode.com/posts",
    expectedMethod: "POST",
    expectedHeaders: { "Authorization": "Bearer" },
    expectedBody: JSON.stringify({ title: "Test API", userId: 10 })
  },
  {
    input: "/posts/5",
    baseUrl: "https://api.github.com",
    expectedUrl: "https://api.github.com/posts/5",
    expectedMethod: "GET"
  },
  {
    input: "GET jsonplaceholder.typicode.com/posts limit==5",
    expectedUrl: "http://jsonplaceholder.typicode.com/posts?limit=5",
    expectedMethod: "GET"
  },
  {
    input: "POST jsonplaceholder.typicode.com/posts limit==5 title=\"hello\"",
    expectedUrl: "http://jsonplaceholder.typicode.com/posts?limit=5",
    expectedMethod: "POST",
    expectedBody: JSON.stringify({ title: "hello" })
  },
  {
    input: "POST /signup user[name]=\"John\" user[age]:=30 tags[]=\"tech\" tags[]=\"news\"",
    baseUrl: "https://api.example.com",
    expectedUrl: "https://api.example.com/signup",
    expectedMethod: "POST",
    expectedBody: JSON.stringify({
      user: { name: "John", age: 30 },
      tags: ["tech", "news"]
    })
  },
  {
    input: "GET /posts Authorization:\"Bearer some_jwt\"",
    baseUrl: "https://api.example.com",
    expectedUrl: "https://api.example.com/posts",
    expectedMethod: "GET",
    expectedHeaders: { "Authorization": "Bearer some_jwt" }
  },
  {
    input: "GET /posts?category=tech limit==5",
    baseUrl: "https://api.example.com",
    expectedUrl: "https://api.example.com/posts?category=tech&limit=5",
    expectedMethod: "GET"
  }
];

let failed = false;
for (const [idx, t] of tests.entries()) {
  const res = parseReplCommand(t.input, t.baseUrl);
  
  if (res.type !== "request") {
    console.error(`FAIL: Test #${idx} failed with type ${res.type}`);
    failed = true;
    continue;
  }

  const urlOk = res.url === t.expectedUrl;
  const methodOk = res.method === t.expectedMethod;
  let headersOk = true;
  if (t.expectedHeaders) {
    for (const [k, v] of Object.entries(t.expectedHeaders)) {
      if (res.headers[k] !== v) headersOk = false;
    }
  }
  let bodyOk = true;
  if (t.expectedBody) {
    bodyOk = res.body === t.expectedBody;
  }

  if (urlOk && methodOk && headersOk && bodyOk) {
    console.log(`PASS: Test #${idx} ("${t.input}")`);
  } else {
    console.error(`FAIL: Test #${idx} ("${t.input}")`);
    console.error(`  Expected URL: ${t.expectedUrl}, Got: ${res.url}`);
    console.error(`  Expected Method: ${t.expectedMethod}, Got: ${res.method}`);
    if (t.expectedHeaders) {
      console.error(`  Expected Headers: ${JSON.stringify(t.expectedHeaders)}, Got: ${JSON.stringify(res.headers)}`);
    }
    if (t.expectedBody) {
      console.error(`  Expected Body: ${t.expectedBody}, Got: ${res.body}`);
    }
    failed = true;
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log("All parsing unit tests passed successfully!");
}