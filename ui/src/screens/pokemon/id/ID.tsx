import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps, Link } from '@reach/router'
import { useQuery, gql } from '@apollo/client'
import { Container as NesContainer, Table } from 'nes-react'

const Container = styled(NesContainer)`
  && {
    background: white;
    margin: 2rem 12.5%;

    ::after {
      z-index: unset;
      pointer-events: none;
    }
  }
`

const POKEMON_ONE = gql`
  query($id: ID!) {
    pokemonOne(id: $id) {
      id
      name
      num
      img
      height
      weight
      egg
      types
      weaknesses
      prevEvolutions {
        id
        name
        img
      }
      nextEvolutions {
        id
        name
        img
      }
    }
  }
`

const ID: React.FC<
  RouteComponentProps & { id?: string; clickLink: Function }
> = ({ id, clickLink }) => {
  const { loading, error, data } = useQuery(POKEMON_ONE, { variables: { id } })
  const pokemon:
    | {
        id: string
        name: string
        num: string
        img: string
        height: string
        weight: string
        egg: string
        types: string[]
        weaknesses: string[]
        prevEvolutions: Array<{ id: string; name: string; img: string }>
        nextEvolutions: Array<{ id: string; name: string; img: string }>
      }
    | undefined = data?.pokemonOne

  if (loading) {
    return <p>Loading...</p>
  }
  if (error || !pokemon) {
    return <p>Error!</p>
  }

  return (
    <>
      <Link
        onMouseDown={clickLink as any}
        to="/pokemon"
        style={{ color: 'black', marginLeft: '1rem', marginTop: '1rem' }}
      >
        <h2>{'< Back to Search'}</h2>
      </Link>
      <Container rounded>
        <h1>
          {pokemon.name} - {pokemon.num}
        </h1>
        <img style={{ marginBottom: '2rem' }} src={pokemon.img} />
        <Table bordered centered>
          <tr>
            <th>Types</th>
            <th>Weaknesses</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Egg</th>
          </tr>
          <tr>
            <td>{pokemon.types.join(', ')}</td>
            <td>{pokemon.weaknesses.join(', ')}</td>
            <td>{pokemon.height}</td>
            <td>{pokemon.weight}</td>
            <td>{pokemon.egg}</td>
          </tr>
        </Table>
        {pokemon.prevEvolutions.length > 0 && (
          <h2 style={{ marginTop: '2rem' }}>Previous Evolutions</h2>
        )}
        {pokemon.prevEvolutions.map(prevEvolution => (
          <Link
            onMouseDown={clickLink as any}
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginRight: '1rem',
            }}
            to={`/pokemon/${prevEvolution.id}`}
          >
            <img src={prevEvolution.img} />
            <h2>{prevEvolution.name}</h2>
          </Link>
        ))}
        {pokemon.nextEvolutions.length > 0 && (
          <h2 style={{ marginTop: '2rem' }}>Next Evolutions</h2>
        )}
        {pokemon.nextEvolutions.map(nextEvolution => (
          <Link
            onMouseDown={clickLink as any}
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginRight: '1rem',
            }}
            to={`/pokemon/${nextEvolution.id}`}
          >
            <img src={nextEvolution.img} />
            <h2>{nextEvolution.name}</h2>
          </Link>
        ))}
      </Container>
    </>
  )
}

export default ID
