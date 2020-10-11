import {ApolloServer, gql, IResolvers} from 'apollo-server'
import Fuse from 'fuse.js'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import pokemon from './pokemon.json'

// My original impulse was to combine both search and filters into one interface,
// so that only one result set was returned using both criteria.  However, the
// instructions say to write a new resolver for search, and to implement filtering
// on the existing pokemonMany resolver.  This indicated to me that
// the queries should be run separately, with different sets of results.  Hence
// the option to choose EITHER search OR filter, but not use both at once.
//
// If you're interested, there is a branch called 'combined' on which I saved
// my work when I was implementing both search and filter as One Query To Rule
// Them All(tm), but it's not as functionally complete as this final version.

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
    pokemonSearch(skip: Int, limit: Int, searchTerm: String): [Pokemon]
    pokemonMany(skip: Int, limit: Int, filters: FiltersInput): [Pokemon!]!
    pokemonOne(id: ID!): Pokemon
  }
`

const pokemonValues = Object.values(pokemon);

// A fuzzy search function leveraging the fuse.js library.
// I chose fuse because, honestly, implementing a fuzzy search is new to me.
// I did some research, dug into stackoverflow, read some blogs on the subject.
// I'm aware there are other libraries out there that may provide better, more
// accurate results, or are more performant, but my decision came down to overall
// popularity, recent maintenance, and documentation/ease of use.  Performance
// was not much of a consideration, given the dataset is only 150 records for
// this project.  Although I did find some complaints about fuse, they were years
// old, and more recent updates seemed to have covered these.
//
// I learned a lot in the process, and if I were to explore this more in-depth,
// I would try some of the other libraries like flexsearch.js, which uses contextual
// matching and appears to be far more performant, but has a steeper learning curve.
const applySearchTerm = (resultSet: Pokemon[], searchTerm: string) => {
  if (searchTerm) {
    const fuse = new Fuse(resultSet, {
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true,
      minMatchCharLength: 3, // so as not to get TOO many results back.
      keys: ['name']
    });
    return fuse.search(searchTerm).map(result => {
      return result.item;
    });
  }
  return resultSet;
}

// Apply type and weakness filters to an array of pokemon.
// If no filter terms are provided, all results are returned.
const applyFilters = (resultSet: Pokemon[], filters: Filters) => {
  return resultSet.filter(poke => {
    const hasAllTypes = (filters.types.length) ?
      filters.types.every(value => poke.types.indexOf(value) >= 0) : true;
    const hasAllWeaknesses = (filters.weaknesses.length) ?
      filters.weaknesses.every(value => poke.weaknesses.indexOf(value) >= 0) : true;
    return (hasAllTypes && hasAllWeaknesses);
  });
}

// Abstracted the sort function, so that it can be called by our search resolver
// without duplicating code.
const applySort = (resultSet: Pokemon[], skip: number, limit: number) => {
  return sortBy(resultSet, poke => parseInt(poke.id, 10)).slice(
    skip,
    limit + skip
  )
}

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
    // I wrote this resolver to grab the filter options from the actual data,
    // in case new pokemon are added in the future with new types or weaknesses.
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
      const filters = {
        types: Array.from(typeSet).sort(),
        weaknesses: Array.from(weaknessSet).sort()
      };
      return filters;
    },
    // A separate search resolver per the instructions.  I also wrote a combined version
    // which gives one result set using both search and filter criteria, on the branch
    // 'combined'.
    pokemonSearch(
      _, {
        skip = 0, limit = 999, searchTerm = ''
      }: { skip?: number; limit?: number; searchTerm?: string }
    ): Pokemon[] {
      return applySort(applySearchTerm(pokemonValues, searchTerm), skip, limit);
    },
    // Added filters on types and weaknesses to this resolver, per instructions.
    pokemonMany(
      _,
      {
        skip = 0, limit = 999, filters = {types: [], weaknesses: []}
      }: { skip?: number; limit?: number; filters?: Filters }
    ): Pokemon[] {
      return applySort(applyFilters(pokemonValues, filters), skip, limit);
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
