(function () {
  const bar = document.getElementById("scroll-progress-bar");
  if (!bar) return;

  let current = 0;
  let target = 0;
  const ease = 0.12; // lower = smoother, higher = snappier

  function updateTarget() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    target = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  }

  function animate() {
    current += (target - current) * ease;
    bar.style.width = current.toFixed(2) + "%";
    requestAnimationFrame(animate);
  }

  window.addEventListener("scroll", updateTarget, { passive: true });
  animate();
})();