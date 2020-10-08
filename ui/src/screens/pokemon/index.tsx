import React from 'react'
import { Router, RouteComponentProps } from '@reach/router'
import Search from './Search';
import ID from './id'

const Screens: React.FC<RouteComponentProps & { clickLink: Function }> = ({
  clickLink,
}) => (
  <Router style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <Search clickLink={clickLink} path="/" />
    <ID clickLink={clickLink} path=":id" />
  </Router>
)

export default Screens
