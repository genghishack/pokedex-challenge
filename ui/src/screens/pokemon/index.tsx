import React from 'react'
import { Router, RouteComponentProps } from '@reach/router'
import Controls from './Controls';
import ID from './id'

const Screens: React.FC<RouteComponentProps & { clickLink: Function }> = ({
  clickLink,
}) => (
  <Router style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <Controls clickLink={clickLink} path="/" />
    <ID clickLink={clickLink} path=":id" />
  </Router>
)

export default Screens
