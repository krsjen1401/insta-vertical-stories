document.addEventListener("DOMContentLoaded", () => {
  const storiesContainer = document.querySelector(".stories-vertical");

  if (!storiesContainer) {
    return;
  }

  const hasPreexistingStories = storiesContainer.children.length > 0;

  if (!hasPreexistingStories) {
    const demoStories = [
      "Story 1",
      "Story 2",
      "Story 3",
      "Story 4",
      "Story 5"
    ];

    for (const title of demoStories) {
      const storyElement = document.createElement("div");
      storyElement.className = "story";
      storyElement.textContent = title;
      storyElement.addEventListener("click", () => {
        // Placeholder for future navigation/preview logic
        console.log(`Clicked ${title}`);
      });
      storiesContainer.appendChild(storyElement);
    }
  }
});