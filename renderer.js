window.onload = () => {
  Notification.requestPermission();
};

async function request() {
  //new Notification("test", {body: "body"})

  const method = document.getElementById("method").value;
  const url = document.getElementById("url").value;
  let headers = document.getElementById("headers").value;
  let body = document.getElementById("body").value;

  if (!headers) {
    headers = {};
  }

  if (!body) {
    body = {};
  }

  new Notification("Stuff", { body: `${method}\n${url}\n${headers}\n${body}`})

  let res;

  if (method === "GET") {
    res = await fetch(url, {
      method: method,
      headers: headers,
    })
  } else {
    res = await fetch(url, {
      method: method,
      headers: headers,
      body: body
    })
  }


  new Notification("Request Sucessful!")

  document.getElementById("response").innerHTML = `Reponse: <br /> <code>${await res.text()}</code>`
}