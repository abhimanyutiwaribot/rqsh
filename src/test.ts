import { executeRequest } from "./core/executeRequest.js";

const result = await executeRequest({
  method: "GET",
  url: "https://jsonplaceholder.typicode.com/posts/1"
});

console.log(JSON.stringify(result))