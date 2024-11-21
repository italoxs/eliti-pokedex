import axios from "axios";

const API_URL = 'https://pokeapi.co/api/v2';

export const getPokemons = async (offset=0, limit=20) => {
  const response = await axios.get(`${API_URL}/pokemon?offset=${offset}&limit=${limit}`);
  return response.data;
};

export const getPokemonDetails = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
}