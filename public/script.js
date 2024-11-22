  // script.js
  const toggleButton = document.getElementById("darkModeToggle");

  // Check for saved theme in localStorage
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
    toggleButton.textContent = "Light Mode";
  }
  
  // Add click event listener to the button
  toggleButton.addEventListener("click", () => {
    const isDarkMode = document.documentElement.classList.toggle("dark-mode");
    toggleButton.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
    
    // Save the user's preference in localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  });