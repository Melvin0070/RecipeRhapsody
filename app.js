const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".serch");
const randomMealSection = document.querySelector(".random-meal");
const searchedMealsSection = document.querySelector(".searched-meals");
const ingredientModal = document.querySelector(".ingredient-modal");
const searchResult = document.querySelector("#search-results");


// // Function for getting the ingredient list using the meal id through Fetch API
const showIngredientsModal = async (mealId) => {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await response.json();
    const mealDetails = data.meals[0];
    
    // Extract ingredients using a for loop
    const ingredients = [];
    for (let i = 1; i <= 20; i++) { // Assuming a maximum of 20 ingredients
      const ingredientKey = `strIngredient${i}`;
      const ingredient = mealDetails[ingredientKey];
      if (ingredient) {
        ingredients.push(`<li>${ingredient}</li>`);
      }
    }
  
    // Appending the fetched ingredient list inside the ingredient modal section
    ingredientModal.innerHTML = `
      <h3 class='ingred'>Ingredients</h3> 
      <ul>${ingredients.join('')}</ul>
    `;
    ingredientModal.style.display = "block";
  };



async function fetchRandomMeal() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const data = await response.json();
  const meal = data.meals[0];
  randomMealSection.innerHTML = "";
  randomMealSection.appendChild(createMealElement(meal));
}

// Function for creating a meal-div (template)
const createMealElement = (meal) => {
    const mealEl = document.createElement("div");
    mealEl.classList.add("randomDishes");
    mealEl.innerHTML = `
      <img src="${meal.strMealThumb}" alt="meal-image"> 
      <h6 id="special" >SPECIAL DISH</h6>
      <h3 class='randomDishName'>${meal.strMeal}</h3>
    `;
    // Setting up event listener for the modal
    mealEl.addEventListener("click", () => {
      showIngredientsModal(meal.idMeal);
    });
    return mealEl;
  };
  

window.onclick = (e) => {
  if (e.target == ingredientModal || ingredientModal.contains(e.target)) {
    ingredientModal.style.display = "none";
  }
};

fetchRandomMeal();

// Attach a click event to the search button (replace searchBtn with the appropriate button selector)
searchBtn.addEventListener("click", () => {
    const searchQuery = searchInput.value;
    getMealList(searchQuery); // Pass the searchQuery to the function
  });
  
  // Use the 'Enter' key to trigger the search
  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const searchQuery = searchInput.value;
      getMealList(searchQuery); // Pass the searchQuery to the function
    }
  });
  
  function getMealList(searchQuery) {
    // Define searchQuery here
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        let html = "";
        if (data.meals) {
          data.meals.forEach((meal) => {
            html += `
              <div class="meal" data-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="food">
                <h3>${meal.strMeal}</h3>
              </div>
            `;
          });
          searchedMealsSection.classList.remove('notFound');
        }
        searchedMealsSection.innerHTML = html;
      });
  }
  