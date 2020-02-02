import React from 'react';
import Img from 'gatsby-image'

import styles from './client.list.module.css'

export default props => {
  const { clients } = props;

  console.log('clients: ', clients);

  // return null;
  return (
    <div className="wrapper" id="clients">
      <h2 className="section-headline">Clients</h2>
      <ul className={styles.clientList}>
        {clients.map(({ node }) => {
          return (
            <li key={node.clientName}>
              <Img fluid={node.logo.fluid} alt={node.clientName} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}