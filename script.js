document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".item-text");
  let activeIndex = 0;
  let gamepadIndex = null;
  console.log(gamepadIndex);

  // Delay settings for gamepad input
  const inputDelay = 250; // Delay in milliseconds
  let lastInputTime = 0;

  // Function to set the active item
  const setActiveItem = (index) => {
    items.forEach((item, i) => {
      if (i === index) item.classList.add("active");
      else item.classList.remove("active");
    });
  };

  // Function to activate the item
  const activateItem = (item) => {
    item.classList.add("selected"); // Add animation class
    setTimeout(() => item.classList.remove("selected"), 200); // Remove animation class after animation ends

    console.log(`Activated: ${item.textContent}`);
  };

  // Handle click events
  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      activeIndex = index;
      setActiveItem(activeIndex);
      activateItem(items[activeIndex]);
    });
  });

  // Handle keyboard navigation
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        setActiveItem(activeIndex);
        break;
      case "s":
      case "ArrowDown":
        activeIndex = (activeIndex + 1) % items.length;
        setActiveItem(activeIndex);
        break;
      case "Enter":
        activateItem(items[activeIndex]);
        break;
    }
  });

  // Handle gamepad navigation
  window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad connected:", e.gamepad);
    gamepadIndex = e.gamepad.index;
  });

  window.addEventListener("gamepaddisconnected", (e) => {
    console.log("Gamepad disconnected:", e.gamepad);
    gamepadIndex = null;
  });

  const pollGamepad = () => {
    const currentTime = Date.now();

    // Check if enough time has passed since the last input
    if (currentTime - lastInputTime >= inputDelay) {
      const gamepads = navigator.getGamepads();
      if (gamepads[gamepadIndex]) {
        const gp = gamepads[gamepadIndex];
        const upPressed = gp.buttons[12].pressed; // D-pad Up
        const downPressed = gp.buttons[13].pressed; // D-pad Down
        const xPressed = gp.buttons[0].pressed; // X Button

        if (upPressed) {
          activeIndex = (activeIndex - 1 + items.length) % items.length;
          setActiveItem(activeIndex);
          lastInputTime = currentTime; // Update the last input time
        } else if (downPressed) {
          activeIndex = (activeIndex + 1) % items.length;
          setActiveItem(activeIndex);
          lastInputTime = currentTime; // Update the last input time
        }

        if (xPressed) {
          activateItem(items[activeIndex]);
          lastInputTime = currentTime; // Update the last input time
        }
      }
    }

    requestAnimationFrame(pollGamepad);
  };

  // Initial active item setup
  setActiveItem(activeIndex);
  pollGamepad();
});
