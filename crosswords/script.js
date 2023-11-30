$(document).ready(function () {
  // Define your Halloween word list and grid size
  let wordList = ["PUMPKIN", "GHOST", "WITCH", "VAMPIRE", "BAT", "CANDY"];
  const gridSize = 10;

  let grid, selectedLetters, crossedOutWords;

  // Shuffle the Halloween word list (optional)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Shuffle the Halloween word list
  shuffleArray(wordList);

  // Function to generate a grid with 6 complete words and random letters
  function generateGridWithWords(size) {
    const grid = [];

    // Helper function to check if a word can fit in the given direction
    function canFit(word, direction, row, col) {
      if (direction === "horizontal") {
        if (col + word.length > size) {
          return false;
        }
        for (let i = 0; i < word.length; i++) {
          if (grid[row][col + i] !== "" && grid[row][col + i] !== word[i]) {
            return false;
          }
        }
        return true;
      } else if (direction === "vertical") {
        if (row + word.length > size) {
          return false;
        }
        for (let i = 0; i < word.length; i++) {
          if (grid[row + i][col] !== "" && grid[row + i][col] !== word[i]) {
            return false;
          }
        }
        return true;
      }
      return false;
    }

    // Helper function to place a word in the grid
    function placeWord(word, direction, row, col) {
      if (direction === "horizontal") {
        for (let i = 0; i < word.length; i++) {
          grid[row][col + i] = word[i];
        }
      } else if (direction === "vertical") {
        for (let i = 0; i < word.length; i++) {
          grid[row + i][col] = word[i];
        }
      }
    }

    // Initialize the grid with empty cells
    for (let i = 0; i < size; i++) {
      const row = new Array(size).fill("");
      grid.push(row);
    }

    const wordsToPlace = wordList.slice(0, 6);

    // Attempt to place each word
    for (const word of wordsToPlace) {
      let direction, row, col;
      let placed = false;

      while (!placed) {
        direction = Math.random() < 0.5 ? "horizontal" : "vertical";
        row = Math.floor(Math.random() * size);
        col = Math.floor(Math.random() * size);

        if (canFit(word, direction, row, col)) {
          placeWord(word, direction, row, col);
          placed = true;
        }
      }
    }

    // Helper function to fill empty cells with random letters
    function fillRandomLetters() {
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (grid[i][j] === "") {
            const randomLetter = String.fromCharCode(
              Math.floor(Math.random() * 26) + 65
            ); // Generates a random uppercase letter
            grid[i][j] = randomLetter;
          }
        }
      }
    }

    // Fill empty cells with random letters
    fillRandomLetters();

    return grid;
  }

  // Function to display the grid and word list
  function displayGrid() {
    const wordSearchGrid = $("#word-search-grid");
    wordSearchGrid.empty();

    const wordListContainer = $("#word-list");
    wordListContainer.empty();

    for (let i = 0; i < gridSize; i++) {
      const row = $("<div>").addClass("row");
      for (let j = 0; j < gridSize; j++) {
        const cell = $("<div>")
          .addClass("cell")
          .text(grid[i][j])
          .on("click", () => {
            selectLetter(i, j);
            // Check if the selected letters form a word
            const selectedWord = selectedLetters
              .map((letter) => grid[letter.row][letter.col])
              .join("");
            if (
              wordList.includes(selectedWord) &&
              !crossedOutWords.includes(selectedWord)
            ) {
              // Cross out the word in the word list
              crossedOutWords.push(selectedWord);
              updateWordList(); // Update the word list
              resetSelectedWord();
            }
          });

        row.append(cell);
      }
      wordSearchGrid.append(row);
    }

    updateWordList();
  }

  // Function to update the selected word on the word grid
  function updateWordList() {
    createWordList(); // Re-create the word list
  }

  // Separate functions for managing the word list
  function createWordList() {
    const wordListContainer = $("#word-list");
    wordListContainer.empty();

    for (let i = 0; i < wordList.length; i++) {
      const wordItem = $("<li>")
        .text(wordList[i])
        .on("click", () => {
          selectWord(i);
        });

      if (crossedOutWords.includes(wordList[i])) {
        wordItem.addClass("crossed-out");
      }

      wordListContainer.append(wordItem);
    }
  }

  function selectWord(index) {
    const selectedWord = wordList[index];

    if (!crossedOutWords.includes(selectedWord)) {
      crossedOutWords.push(selectedWord);
      updateWordList(); // Update the word list
      resetSelectedWord();
    }
  }

  // Function to handle letter selection
  function selectLetter(row, col) {
    const cell = $(`.row:nth-child(${row + 1}) .cell:nth-child(${col + 1})`);

    if (cell.hasClass("selected")) {
      // Deselect the cell
      cell.removeClass("selected");
      const letterIndex = selectedLetters.findIndex(
        (item) => item.row === row && item.col === col
      );
      selectedLetters.splice(letterIndex, 1);
    } else {
      // Select the cell
      cell.addClass("selected");
      selectedLetters.push({ row, col });
    }

    // Update the selected word
    updateSelectedWord();
  }

  // Function to update the selected word on the word grid
  function updateSelectedWord() {
    const selectedWordElement = $("#selected-word-text");
    const selectedWord = selectedLetters
      .map((letter) => grid[letter.row][letter.col])
      .join("");

    if (
      wordList.includes(selectedWord) &&
      !crossedOutWords.includes(selectedWord)
    ) {
      // If the selected word is a complete word and not crossed out, style it with a CSS class
      selectedWordElement.html(selectedWord);
      selectedWordElement.addClass("crossed-out");
      // Add the selected word to the crossed-out words array
      crossedOutWords.push(selectedWord);
      updateWordList();

      // Clear the selected word display
      selectedLetters = [];
      selectedWordElement.text("");
    } else {
      selectedWordElement.text(selectedWord);
      selectedWordElement.removeClass("crossed-out");
    }
  }

  // Function to reset the selected word
  function resetSelectedWord() {
    const selectedWordElement = $("#selected-word-text");
    selectedWordElement.text(""); // Clear the text
    selectedWordElement.removeClass("crossed-out"); // Remove the "crossed-out" class
  }

  // Function to start the game
  function startGame() {
    grid = generateGridWithWords(gridSize);
    selectedLetters = [];
    crossedOutWords = [];

    // Shuffle the word list
    shuffleArray(wordList);
    displayGrid();
    resetSelectedWord();
  }

  // Event handling using jQuery
  $("#start-button").on("click", startGame);

  // Initial setup when the DOM is ready
  startGame();
});
