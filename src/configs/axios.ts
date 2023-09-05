import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 4000,
  headers: {
    "Access-Control-Allow-Credentials": "true",
    "Cache-Control": "no-cache",
    // Connection: 'keep-alive',//
    // 'Content-Length': '401',//
    "Content-Type": "application/json; charset=utf-8",
    ETag: 'W/"191-7DnIoxk/oktj4DgKFpQhLQmCm7M"',
    Expires: "-1",
    // 'Keep-Alive': 'timeout=5',//
    Pragma: "no-cache",
    Vary: "Origin, Accept-Encoding",
    "X-Content-Type-Options": "nosniff",
    "X-Powered-By": "Express",
  },
});
