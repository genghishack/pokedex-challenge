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
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const [types, setTypes] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name: filterName, value: filterValue, checked: filterChecked } = event.target;
    let filter = types;
    let setFilter = setTypes;
    let newFilter = [...types];
    if (filterName === 'weakness') {
      filter = weaknesses;
      setFilter = setWeaknesses;
      newFilter = [...weaknesses];
    }
    if (!filterChecked && filter.includes(filterValue)) {
      newFilter = filter.filter(value => value !== filterValue);
    } else if (filterChecked && !filter.includes(filterValue)) {
      newFilter.push(filterValue);
    }
    setFilter(newFilter);
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

  const renderFilter = (filterName: "type" | "weakness", filterValue: string) => (
    <div>
      <Label>
        <Checkbox
          type="checkbox"
          name={filterName}
          value={filterValue}
          onChange={handleFilterChange}
        />
        {filterValue}
      </Label>
    </div>
  )

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
      <Section>
        Filter by:
      </Section>
      <Section>
        <Filters>
          <strong>Types</strong>
          {filters.types.map((filter: string) => renderFilter('type', filter))}
        </Filters>
        <Filters>
          <strong>Weaknesses</strong>
          {filters.weaknesses.map((filter: string) => renderFilter('weakness', filter))}
        </Filters>
      </Section>
      <Pokemon clickLink={clickLink} searchTerm={searchTerm}/>
    </>
  )
}

export default Search
