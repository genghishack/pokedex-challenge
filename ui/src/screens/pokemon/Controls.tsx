import React, {ChangeEvent, useState} from 'react';
import styled from 'styled-components';
import {RouteComponentProps, Link} from '@reach/router';
import {useQuery, gql} from '@apollo/client';
import { FilterOptions } from '../../types';
import Search from './Search';
import Filter from './Filter';

const Section = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`

const Label = styled.label`
  margin: 0 0.5rem;
  cursor: url(https://unpkg.com/nes.css/assets/cursor-click.png), pointer;
`

const Radio = styled.input`
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

// My original impulse was to combine both search and filters into one interface,
// so that only one result set was returned using both criteria.  However, the
// instructions say to write a new resolver for search.  This indicated to me that
// the queries should be run separately, with different sets of results.  Hence
// the option to choose EITHER search OR filter, but not both at once.

const Controls: React.FC<RouteComponentProps & { clickLink: Function }> = ({clickLink}) => {
  const [controlType, setControlType] = useState('search');
  const handleControlTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setControlType(event.target.value);
  }

  const {loading, error, data} = useQuery(POKEMON_FILTERS);
  const filters:
    | FilterOptions
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
        <Label>
          <Radio
            type="radio"
            name="controlType"
            value="search"
            defaultChecked={true}
            onChange={handleControlTypeChange}
          />
          Search
        </Label>
        <Label>
          <Radio
            type="radio"
            name="controlType"
            value="filter"
            onChange={handleControlTypeChange}
          />
          Filter
        </Label>
      </Section>
      {controlType === 'search' ? (
        <Search clickLink={clickLink}/>
      ) : (
        <Filter clickLink={clickLink} filterOptions={filters}/>
      )}
    </>
  )
}

export default Controls
