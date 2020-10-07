import React, {ChangeEvent, useState} from 'react';
import styled from 'styled-components'
import {RouteComponentProps, Link} from '@reach/router'
import {useQuery, gql} from '@apollo/client'
import Pokemon from './Pokemon'

const Input = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`

const POKEMON_SEARCH = gql`
    query($searchTerm: String) {
        pokemonSearch(searchTerm: $searchTerm) {
            id
            name
            num
            img
        }
    }
`

const Search: React.FC<RouteComponentProps & { clickLink: Function }> = ({clickLink}) => {
  // const {loading, error, data} = useQuery(POKEMON_SEARCH)

  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value);

  return (
    <>
      <Input>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange}
        />
      </Input>
      <Pokemon clickLink={clickLink} />
    </>
  )
}

export default Search
