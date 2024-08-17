const displayPokemonData = (pokemonData) => {
  const $pokemonName = document.getElementById("pokemon-name");
  $pokemonName.textContent = pokemonData.name.toUpperCase();

  const $pokemonId = document.getElementById("pokemon-id");
  $pokemonId.textContent = `#${pokemonData.id}`;

  const $pokemonWeight = document.getElementById("weight");
  $pokemonWeight.textContent = `Weight: ${pokemonData.weight}`;

  const $pokemonHeight = document.getElementById("height");
  $pokemonHeight.textContent = `Height: ${pokemonData.height}`;

  const $pokemonSprite = document.getElementById("sprite-container");
  $pokemonSprite.innerHTML = `<img
  src="${pokemonData.spriteURL}"
  alt="${pokemonData.name} front sprite"
  id="sprite"
/>`;

  pokemonData.stats.forEach((stat) => {
    const [statName, statValue] = stat;

    // THIS IS TO DISPLAY THE VALUE OF EACH STAT
    document.getElementById(`${statName}`).textContent = statValue;
    // THIS IS ADJUST THE VALUE OF THE PROGRESS BAR OF EACH STAT
    document.getElementById(`${statName}-progress`).value = statValue;
  });

  const $typesList = document.getElementById("types");
  $typesList.innerHTML = "";

  let typesItems = "";
  pokemonData.types.forEach((type) => {
    typesItems += `<li class="list-item type-item ${type}">${
      type.charAt(0).toUpperCase() + type.slice(1) // THIS IS TO UPPER CASE THE FIRST LETTER OF THE WORD
    }</li>`;
  });
  document.getElementById("types").innerHTML = typesItems;
};

const getPokemonData = (data) => {
  const pokemonTypes = data.types.map((slot) => slot.type.name);
  const statsValues = data.stats.map((stat) => [
    stat.stat.name,
    stat.base_stat,
  ]);

  const pokemonData = {
    id: data.id,
    name: data.name,
    weight: data.weight,
    height: data.height,
    types: pokemonTypes,
    stats: statsValues,
    spriteURL: data.sprites.front_default,
  };

  displayPokemonData(pokemonData);
};

const fetchDataFromPokeAPI = async (searchID) => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchID}`
    );
    if (!response.ok) {
      throw new Error("Error in request");
    }

    const data = await response.json();

    getPokemonData(data);
  } catch (error) {
    console.error("An error occurred: ", error);
    alert("Pokémon not found");
  }
};

// THIS IS TO TRACK THE LAST INPUT OF THE USER, TO AVOID AN UNNECESSARY FETCH
let initalInput = "";
const validateInputUser = (inputUser) => {
  if (inputUser.length <= 0 || inputUser <= 0)
    return alert("Please enter a valid input");

  if (inputUser === initalInput)
    return alert(
      "This input has already been searched for, please enter a new one."
    );

  // HERE WE UPDATE THE LAST INPUT USER
  initalInput = inputUser;

  fetchDataFromPokeAPI(inputUser);
};

const getInputUser = (input) => {
  const inputUser = isNaN(Number(input))
    ? input.trim().toLowerCase()
    : Number(input);

  return inputUser;
};

const $searchForm = document.getElementById("search-form");
$searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const $searchInput = document.getElementById("search-input");
  const inputUser = getInputUser($searchInput.value);
  $searchInput.value = "";
  validateInputUser(inputUser);
});

const test = "TEST";
console.log(test);
