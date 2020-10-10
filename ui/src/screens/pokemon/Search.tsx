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

const Label = styled.label`
  margin-bottom: 0;
  cursor: url(https://unpkg.com/nes.css/assets/cursor-click.png), pointer;
`

const Checkbox = styled.input`
  margin-right: 0.5rem;
  cursor: url(https://unpkg.com/nes.css/assets/cursor-click.png), pointer;
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
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const {loading, error, data} = useQuery(POKEMON_FILTERS);
  const filters:
    | { types: string[]; weaknesses: string[] }
    | undefined = data?.pokemonFilters

  if (loading) {
    return <p>Loading...</p>
  }
  if (error || !filters) {
    return <p>Error!</p>
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
          {filters.types.map((filter: string) => {
            return (
              <div>
                <Label>
                  <Checkbox type="checkbox" value={filter} />
                  {filter}
                </Label>
              </div>
            );
          })}
        </Filters>
        <Filters>
          <strong>Weaknesses</strong>
          {filters.weaknesses.map((filter: string) => {
            return (
              <div>
                <Label>
                  <Checkbox type="checkbox" value={filter} />
                  {filter}
                </Label>
              </div>
            );
          })}
        </Filters>
      </Section>
      <Pokemon clickLink={clickLink} searchTerm={searchTerm} />
    </>
  )
}

export default Search
