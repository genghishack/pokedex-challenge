import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps, Link } from '@reach/router'
import {PokemonListResult} from "../../types";
import { Container as NesContainer } from 'nes-react'

const Container = styled(NesContainer)`
  && {
    background: white;
    margin: 2rem 25%;

    ::after {
      z-index: unset;
      pointer-events: none;
    }
  }
`

const List = styled.ul`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
`

const ListItem = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1rem;

  > *:first-child {
    margin-right: 1rem;
  }
`

const Pokemon: React.FC<RouteComponentProps & {
  clickLink: Function,
  pokemonList: PokemonListResult[]
}> = ({
  clickLink, pokemonList
}) => {
  return (
    <Container rounded>
      <List>
        {pokemonList.map(pokemon => (
          <Link to={pokemon.id} onMouseDown={clickLink as any}>
            <ListItem>
              <img src={pokemon.img} />
              {pokemon.name} - {pokemon.num}
            </ListItem>
          </Link>
        ))}
      </List>
    </Container>
  )
}

export default Pokemon
