const ErrorCode = [
  { code: 200, message: "Success Get Data" },
  { code: 201, message: "Success Insert Data" },
  { code: 202, message: "Success Update Data" },
  { code: 203, message: "Success Delete Data" },
  { code: 400, message: "Bad Request" },
  { code: 401, message: "Unauthorized" },
  { code: 402, message: "Payment Required" },
  { code: 403, message: "Forbidden" },
  { code: 404, message: "Not Found" },
  { code: 405, message: "Method Not Allowed" },
  { code: 406, message: "Not Acceptable" },
  { code: 407, message: "Proxy Authentication Required" },
  { code: 408, message: "Request Timeout" },
  { code: 409, message: "Conflict" },
  { code: 410, message: "Gone" },
  { code: 411, message: "Length Required" },
  { code: 412, message: "Precondition Failed" },
  { code: 413, message: "Payload Too Large" },
  { code: 414, message: "URI Too Long" },
  { code: 415, message: "Unsupported Media Type" },
  { code: 416, message: "Range Not Satisfiable" },
  { code: 417, message: "Expectation Failed" },
  { code: 418, message: "Im A Teapot" },
  { code: 421, message: "Misdirected Request" },
  { code: 422, message: "Unprocessable Entity" },
  { code: 423, message: "Locked" },
  { code: 424, message: "Failed Dependency" },
  { code: 425, message: "Unordered Collection" },
  { code: 426, message: "Upgrade Required" },
  { code: 428, message: "Precondition Required" },
  { code: 429, message: "Too Many Requests" },
  { code: 431, message: "Request Header Fields Too Large" },
  { code: 451, message: "Unavailable For Legal Reasons" },
  { code: 500, message: "Internal Server Error" },
  { code: 501, message: "Not Implemented" },
  { code: 502, message: "Bad Gateway" },
  { code: 503, message: "Service Unavailable" },
  { code: 504, message: "Gateway Timeout" },
  { code: 505, message: "HTTP Version Not Supported" },
  { code: 506, message: "Variant Also Negotiates" },
  { code: 507, message: "Insufficient Storage" },
  { code: 508, message: "Loop Detected" },
  { code: 509, message: "Bandwidth Limit Exceeded" },
  { code: 510, message: "Not Extended" },
  { code: 511, message: "Network Authentication Required" },
];

export default ErrorCode;
