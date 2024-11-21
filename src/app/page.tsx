"use client"
import { useEffect, useState } from "react";
import { getPokemonDetails, getPokemons } from "@/utils/pokeapi";
import Image from "next/image";

type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 20;

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
      const data = await getPokemons(page * limit, limit);
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const details = await getPokemonDetails(pokemon.url);
          return {
            id: details.id,
            name: pokemon.name,
            image: details.sprites.front_default,
            types: details.types.map((typeInfo: any) => typeInfo.type.name),
          };
        })
      );

      setPokemons(pokemonDetails);
    } catch (error) {
      console.log("Erro ao buscar os Pokémons:", error);
    } finally {
      setLoading(false);
    }
  };

    fetchPokemons();
  }, [page])

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  const selectPokemon = (pokemon: Pokemon) => setSelectedPokemon(pokemon);
  const closeDetails = () => setSelectedPokemon(null);  

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Pokedex Eliti</h1>
      { loading ? (
        <p className="text-center text-gray-600">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          { pokemons.map((pokemon) => (
            <div 
              key={pokemon.id} 
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
            >
              <Image 
                src={pokemon.image} 
                alt={pokemon.name}
                width={96}
                height={96} 
                className="w-24 h-24 object-contain mb-4" />
              <h3 className="text-lg font-semibold capitalize text-gray-700">{pokemon.name}</h3>
              <p className="text-gray-500">#{pokemon.id}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                { pokemon.types.map((type) => (
                  <span key={type} className="bg-gray-200 text-gray-600 text-sm px-2 py-1 rounded">{type}</span>
                )) }
              </div>
            </div>
          )) }
        </div>
      ) }

      { selectedPokemon ? (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
            <button 
              type="button"
              onClick={closeDetails}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              x
            </button>
            <Image 
              src={selectedPokemon.image}
              alt={selectedPokemon.name}
              width={128}
              height={128}
              className="w-32 h-32 mx-auto"
            />
            <h2 className="text-2xl font-bold text-center capitalize mt-4">{selectedPokemon.name}</h2>
            <p className="text-center text-gray-500">#{selectedPokemon.id}</p>
            <div className="flex justify-center gap-2 mt-4">
              { selectedPokemon.types.map((type) => (
                <span
                  key={type}
                  className="bg-gray-200 text-gray-600 text-sm px-2 py-1 rounded"
                >
                  {type}
                </span>
              )) }
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Status</h3>
              { selectedPokemon.stats.map((stat) => (
                <div key={stat.name} className="flex justify-between text-sm">
                  <span className="capitalize">{stat.name}</span>
                  <span>{stat.value}</span>
                </div>
              )) }
            </div>
          </div>
        </div>
      ) : null }
      <div className="flex justify-center mt-8 gap-4">
        <button
          type="button"
          onClick={prevPage}
          disabled={page === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Página Anterior
        </button>
        <button
          type="button"
          onClick={nextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Próxima Página
        </button>
      </div>
    </div>
  );
}
