import React, {ChangeEvent, useState} from 'react';
import styled from 'styled-components'
import {RouteComponentProps, Link} from '@reach/router'
import {useQuery, gql} from '@apollo/client'
import {FilterOptions, PokemonListResult} from "../../types";
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

const POKEMON_MANY = gql`
  query(
    $skip: Int, 
    $limit: Int, 
    $filters: FiltersInput
  ) {
    pokemonMany(
      skip: $skip, 
      limit: $limit, 
      filters: $filters
    ) {
      id
      name
      num
      img
    }
  }
`

const Filter: React.FC<RouteComponentProps & { clickLink: Function, filterOptions: FilterOptions }> =
  ({clickLink, filterOptions}) => {
    const [types, setTypes] = useState<string[]>([]);
    const [weaknesses, setWeaknesses] = useState<string[]>([]);
    const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
      const {name: filterName, value: filterValue, checked: filterChecked} = event.target;
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

    const {loading, error, data} = useQuery(POKEMON_MANY, {
      variables: {filters: {types, weaknesses}}
    })
    const pokemonList:
      | Array<PokemonListResult>
      | undefined = data?.pokemonMany

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
          Filter by:
        </Section>
        <Section>
          <Filters>
            <strong>Types</strong>
            {filterOptions.types.map((filter: string) => renderFilter('type', filter))}
          </Filters>
          <Filters>
            <strong>Weaknesses</strong>
            {filterOptions.weaknesses.map((filter: string) => renderFilter('weakness', filter))}
          </Filters>
        </Section>
        {
          (loading) ? <p>Loading...</p> :
            (error || !pokemonList) ? <p>Error!</p> :
              <Pokemon clickLink={clickLink} pokemonList={pokemonList}/>
        }
      </>
    )
  }

export default Filter
