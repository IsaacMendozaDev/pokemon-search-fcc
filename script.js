const updateDOMElementText = (id, text) => {
  document.getElementById(id).textContent = text;
};

const resetPokemonData = () => {
  const fields = ["pokemon-name", "pokemon-id", "weight", "height"];
  fields.forEach((field) => updateDOMElementText(field, ""));

  document.getElementById("sprite-container").innerHTML = "";
  document.getElementById("types").innerHTML = "";

  const stats = [
    "hp",
    "attack",
    "defense",
    "special-attack",
    "special-defense",
    "speed",
  ];
  stats.forEach((stat) => {
    updateDOMElementText(stat, "");
    document.getElementById(`${stat}-progress`).value = 0;
  });
};

const displayPokemonData = (pokemonData) => {
  updateDOMElementText("pokemon-name", pokemonData.name.toUpperCase());
  updateDOMElementText("pokemon-id", `#${pokemonData.id}`);
  updateDOMElementText("weight", `Weight: ${pokemonData.weight}`);
  updateDOMElementText("height", `Height: ${pokemonData.height}`);

  const $pokemonSprite = document.getElementById("sprite-container");
  $pokemonSprite.innerHTML = `<img
  src="${pokemonData.spriteURL}"
  alt="${pokemonData.name} front sprite"
  id="sprite"
/>`;

  pokemonData.stats.forEach((stat) => {
    const [statName, statValue] = stat;

    // THIS IS TO DISPLAY THE VALUE OF EACH STAT
    updateDOMElementText(`${statName}`, statValue);
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

const setLoadingState = (isLoading) => {
  const $loadingContainer = document.getElementById("loading");

  const svgLoading =
    '<?xml version="1.0" encoding="utf-8"?><svg class="img" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" stroke="#000000" stroke-width="4" stroke-linejoin="round"/><circle cx="24" cy="24" r="6" fill="#2F88FF" stroke="#000000" stroke-width="4" stroke-linejoin="round"/><path d="M30 24H44" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 24H18" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="24" r="2" fill="white"/></svg>';

  if (isLoading) {
    $loadingContainer.style.display = "block";

    $loadingContainer.innerHTML = svgLoading;
  } else {
    $loadingContainer.style.display = "none";
    $loadingContainer.innerHTML = "";
  }
};

const fetchDataFromPokeAPI = async (searchID) => {
  try {
    setLoadingState(true);

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchID}`
    );
    if (!response.ok) throw new Error("Error in request");

    const data = await response.json();

    getPokemonData(data);
  } catch (error) {
    console.error("An error occurred: ", error);
    alert("Pokémon not found");
  } finally {
    setLoadingState(false);
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

  resetPokemonData();
  validateInputUser(inputUser);
});

//todo: Make the animation of the progress bar.
