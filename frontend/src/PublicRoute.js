import React from 'react'
import { Route } from 'react-router-dom'
import PublicLayout from './components/Layout/PublicLayout';

export default ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (
      <PublicLayout><Component {...props} /></PublicLayout>
    )} />
  )
}