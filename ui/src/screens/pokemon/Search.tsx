import React, {ChangeEvent, useState} from 'react';
import styled from 'styled-components'
import {RouteComponentProps, Link} from '@reach/router'
import {useQuery, gql} from '@apollo/client'
import {PokemonListResult} from "../../types";
import Pokemon from './Pokemon'

const Section = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`

const POKEMON_SEARCH = gql`
  query(
    $skip: Int, 
    $limit: Int, 
    $searchTerm: String
  ) {
    pokemonSearch(
      skip: $skip, 
      limit: $limit, 
      searchTerm: $searchTerm
    ) {
      id
      name
      num
      img
    }
  }
`

const Search: React.FC<RouteComponentProps & { clickLink: Function }> = ({clickLink}) => {

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const {loading, error, data} = useQuery(POKEMON_SEARCH, {
    variables: {searchTerm}
  })
  const pokemonList:
    | Array<PokemonListResult>
    | undefined = data?.pokemonSearch

  return (
    <>
      <Section>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Section>
      {
        (loading) ? <p>Loading...</p> :
          (error || !pokemonList) ? <p>Error!</p> :
            <Pokemon clickLink={clickLink} pokemonList={pokemonList}/>
      }
    </>
  )
}

export default Search
