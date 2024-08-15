const $btnSearch = document.getElementById("search-button");
const $searchInput = document.getElementById("search-input");

const fetchPokemonData = async (id) => {
  const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
    (res) => res.json()
  );

  const pokemonTypes = data.types.map((slot) => slot.type.name);
  const [
    pokemonHp,
    pokemonAttack,
    pokemonDefense,
    pokemonSpecialAttack,
    pokemonSpecialDefense,
    pokemonSpeed,
  ] = data.stats.map((stat) => stat.base_stat);

  const pokemonData = {
    id: data.id,
    name: data.name,
    weight: data.weight,
    height: data.height,
    types: [pokemonTypes],
    hp: pokemonHp,
    attack: pokemonAttack,
    defense: pokemonDefense,
    "special-attack": pokemonSpecialAttack,
    "special-defense": pokemonSpecialDefense,
    speed: pokemonSpeed,
  };

  return pokemonData;
};

const validateInputUser = (input) => {
  const pokemonData = fetchPokemonData(input);
};

$searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") return validateInputUser(e.target.value);
});
$btnSearch.addEventListener("click", () =>
  validateInputUser($searchInput.value)
);
