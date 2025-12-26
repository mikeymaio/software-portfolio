import React from 'react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

import * as styles from './client.list.module.css'

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
              <GatsbyImage image={getImage(node.logo)} alt={node.clientName} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}