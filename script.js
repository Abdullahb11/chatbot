async function sendMsg() {
  const message = document.getElementById("msg").value;
  const resBox = document.getElementById("response");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  resBox.innerText = data.reply || "No reply";
}
