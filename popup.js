document.addEventListener("DOMContentLoaded", async () => {
  const hideCheckbox = document.getElementById("hideMode");
  const clicksInput = document.getElementById("clicks");

  const { mode = "gate", clicks = 10 } = await browser.storage.sync.get(["mode", "clicks"]);
  hideCheckbox.checked = mode === "hide";
  clicksInput.value = clicks;
  clicksInput.disabled = mode === "hide";

  hideCheckbox.addEventListener("change", async () => {
    const newMode = hideCheckbox.checked ? "hide" : "gate";
    await browser.storage.sync.set({ mode: newMode });
    clicksInput.disabled = newMode === "hide";
  });

  clicksInput.addEventListener("change", async () => {
    const val = parseInt(clicksInput.value, 10) || 10;
    const clamped = Math.max(10, val);
    clicksInput.value = clamped;
    await browser.storage.sync.set({ clicks: clamped });
  });
});
