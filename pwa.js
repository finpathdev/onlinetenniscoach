/* Registers the service worker and surfaces update / offline state. */
(function () {
  function ensure(id, className) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      el.className = className;
      el.hidden = true;
      document.body.appendChild(el);
    }
    return el;
  }

  function paintOffline() {
    const bar = ensure("offlineBar", "offline-bar");
    bar.textContent = "You are offline. Drills and saved sessions on this device still open. A new video needs the pose model from an earlier visit.";
    bar.hidden = navigator.onLine;
  }

  window.addEventListener("online", paintOffline);
  window.addEventListener("offline", paintOffline);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", paintOffline);
  } else {
    paintOffline();
  }

  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((reg) => {
      function offerReload() {
        const bar = ensure("updateBar", "update-bar");
        if (!bar.hidden && bar.dataset.ready === "1") return;
        bar.hidden = false;
        bar.dataset.ready = "1";
        bar.textContent = "";
        const label = document.createElement("span");
        label.textContent = "A new version of the coach is ready.";
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Reload";
        button.addEventListener("click", () => location.reload());
        bar.append(label, button);
      }
      if (reg.waiting && navigator.serviceWorker.controller) offerReload();
      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) offerReload();
        });
      });
      reg.update().catch(() => {});
    }).catch(() => {});
  });
})();
