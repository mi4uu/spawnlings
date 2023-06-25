let id = 1;
function make(method, params) {
  id++;
  return { msg: JSON.stringify({ id: id, method, params }), id };
}

function sendEval([code]) {
  return send("Runtime.evaluate", {
    expression: code,
    awaitPromise: true,
    returnByValue: true,
  }).then((res) => {
    const type = res?.result?.type;
    switch (type) {
      case "object":
        return res.result.value;
      case "undefined":
        return undefined;
      case "string":
        return res.result.value;
      case "number":
        return res.result.value;
      case "boolean":
        return res.result.value;
      default:
        return res;
    }
  });
}

const toSend = [make("Runtime.enable", {}).msg];

const pending = new Map();
function send(method, params) {
  const { msg, id } = make(method, params);
  const result = new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });

  ws.send(msg);
  return result;
}

const ws = new WebSocket(`ws://${location.host}/bun:inspect`);

ws.onopen = () => {
  toSend.forEach((msg) => ws.send(msg));
};
ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.result);
      }
    } else {
      console.log(data);
    }
  } catch (e) {
    console.log(e);
  }
};

ws.onclose = () => {
  console.log("disconnected");
};

ws.onerror = (error) => {
  console.log(error);
};

globalThis.bunEval = sendEval;
console.log("Type bunEval`<code>` to evaluate code on the server");
