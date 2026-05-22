# Assessment Answers

### 1. How to run
Simply open `index.html` in a web browser. No installation or build process is needed.

### 2. Stack & design choices
**Stack:** I chose Vanilla HTML, CSS, and JavaScript. Since the core requirement was just rendering a grid and saving state to `localStorage`, introducing a framework like React would have overcomplicated it. Vanilla JS keeps the app fast and demonstrates a solid understanding of core web fundamentals.

**Design Decisions:**
1. **The Checkmark Animation:** I added a scaling effect (`transform: scale(1.1)`) and color transition to the checkmark buttons. Ticking off a habit should feel satisfying and provide immediate visual feedback.
2. **Streak Logic:** I implemented a forgiving "current streak" counter. It looks backward from today. If today is unchecked, it starts counting backward from yesterday instead. This ensures a user doesn't log in at 9:00 AM and see their streak broken just because they haven't completed their evening habit yet.

### 3. Responsive & accessibility
**Responsiveness:** On a wide laptop, the grid sits neatly in the center of the screen. On a narrow phone screen, 7 days of columns plus text get too squished. To fix this, I wrapped the grid in a container with `overflow-x: auto` and made the habit name column sticky (`position: sticky; left: 0;`). This lets mobile users swipe through the week while keeping the habit names visible on the left.

**Accessibility:** * **Handled:** All the clickable checkmarks in the grid are `<button>` elements with `aria-label="Toggle habit"`. This ensures they can be reached using `Tab` on a keyboard and are recognized by screen readers.
* **Skipped:** I skipped adding an `aria-live` region to announce the streak counter updating in real-time. Managing live region verbosity can be complex, and visual feedback is the primary indicator for this version.

### 4. AI usage
* **Tool used:** Google Gemini.
* **Prompt:** I asked for help structuring the date math required to generate an array of 7 date objects for the current week starting on Monday, and the logic to calculate the streak backwards.
* **What I changed:** Gemini initially provided a streak calculation that checked sequentially from the beginning of time. I changed it to a `while` loop that counts *backwards* from the current date until it hits an unchecked day, breaking the loop automatically. This is much more efficient. I also removed a lot of complex ES6 syntax it suggested to keep the code simpler and more readable.

### 5. Honest gap
The renaming functionality is missing. Currently, if a user wants to rename a habit, they have to delete it and create a new one, which wipes their historical streak data. If I had another day, I would make the habit names in the grid editable so the user could just click the text, type a new name, and update the JavaScript state without losing their history.