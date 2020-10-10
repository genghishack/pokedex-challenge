import React, {ChangeEvent, useState} from 'react';
import styled from 'styled-components'
import {RouteComponentProps, Link} from '@reach/router'
import {useQuery, gql} from '@apollo/client'
import Pokemon from './Pokemon'

const Section = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`

const Filters = styled.div`
  margin: 0 1rem;
`

const POKEMON_FILTERS = gql`
    query {
        pokemonFilters {
          types
          weaknesses
        }
    }
`

const Search: React.FC<RouteComponentProps & { clickLink: Function }> = ({clickLink}) => {

  const [searchTerm, setSearchTerm] = useState('');
  const {loading, error, data} = useQuery(POKEMON_FILTERS);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  return (
    <>
      <Section>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange}
        />
      </Section>
      <Section>
        Filter by:
      </Section>
      <Section>
        <Filters>
          <strong>Types</strong>
        </Filters>
        <Filters>
          <strong>Weaknesses</strong>
        </Filters>
      </Section>
      <Pokemon clickLink={clickLink} searchTerm={searchTerm} />
    </>
  )
}

export default Search
