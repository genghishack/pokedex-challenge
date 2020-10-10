import {ApolloServer, gql, IResolvers} from 'apollo-server'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import pokemon from './pokemon.json'

interface Filters {
  types: string[]
  weaknesses: string[]
}

interface Pokemon {
  id: string
  num: string
  name: string
  img: string
  types: string[]
  weaknesses: string[]
  height: string
  weight: string
  egg: string
  prevEvolutions?: Array<{ num: string; name: string }>
  nextEvolutions?: Array<{ num: string; name: string }>
  candy?: string
  candyCount?: number
}

const typeDefs = gql`
  type Filters {
    types: [String!]!
    weaknesses: [String!]!
  }
  input FiltersInput {
    types: [String]
    weaknesses: [String]
  }
  type Pokemon {
    id: ID!
    num: ID!
    name: String!
    img: String!
    types: [String!]!
    weaknesses: [String!]!
    height: String!
    weight: String!
    egg: String!
    prevEvolutions: [Pokemon!]!
    nextEvolutions: [Pokemon!]!
    candy: String
    candyCount: Int
  }

  type Query {
    pokemonFilters: Filters!
    pokemonMany(skip: Int, limit: Int, searchTerm: String, filters: FiltersInput): [Pokemon!]!
    pokemonOne(id: ID!): Pokemon
  }
`

const pokemonValues = Object.values(pokemon);

const resolvers: IResolvers<any, any> = {
  Pokemon: {
    prevEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.prevEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
    nextEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.nextEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
  },
  Query: {
    pokemonFilters(_, {}: {}): any {
      let typeSet = new Set();
      let weaknessSet = new Set();
      pokemonValues.forEach(poke => {
        poke.types.forEach(type => {
          typeSet.add(type);
        })
        poke.weaknesses.forEach(type => {
          weaknessSet.add(type);
        })
      });
      const filters = {types: Array.from(typeSet), weaknesses: Array.from(weaknessSet)};
      return filters;
    },
    pokemonMany(
      _,
      {
        skip = 0, limit = 999, searchTerm = '', filters = {types: [], weaknesses: []}
      }: { skip?: number; limit?: number; searchTerm?: string; filters?: Filters }
    ): Pokemon[] {
      let searchResults = [...pokemonValues];
      if (searchTerm) {
        searchResults = pokemonValues.filter(poke => {
          return poke.name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1;
        });
      }
      return sortBy(searchResults, poke => parseInt(poke.id, 10)).slice(
        skip,
        limit + skip
      )
    },
    pokemonOne(_, {id}: { id: string }): Pokemon {
      return (pokemon as Record<string, Pokemon>)[id]
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`)
})
