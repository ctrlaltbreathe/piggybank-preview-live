(() => {
  const expectedHash = "d3547f015b6afc49eab3df9975fe82c8ca25d5f2e1a37930b4483c22a264ca97";
  const gate = document.querySelector("[data-preview-gate]");
  const form = document.querySelector("[data-preview-gate-form]");
  const input = document.querySelector("[data-preview-password]");
  const error = document.querySelector("[data-preview-gate-error]");

  const unlock = () => {
    document.body.classList.remove("preview-locked");
    gate.hidden = true;
    window.sessionStorage.setItem("piggybank-preview", "unlocked");
  };

  if (window.sessionStorage.getItem("piggybank-preview") === "unlocked") {
    unlock();
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.hidden = true;

    const digest = await window.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(input.value)
    );
    const enteredHash = [...new Uint8Array(digest)]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    if (enteredHash === expectedHash) {
      input.value = "";
      unlock();
      return;
    }

    error.hidden = false;
    input.select();
  });
})();
