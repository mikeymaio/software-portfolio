import React from 'react';
import Project from './project';

import styles from './project.module.css'

export default props => {
  const { projects } = props;
  return (
    <div className="wrapper" id="recentWork">
      <h2 className="section-headline">Recent Work</h2>
      <ul className={styles.projectList}>
        {projects.map(({ node }) => {
          return (
            // <li key={node.slug}>
              <Project project={node} />
            // </li>
          )
        })}
      </ul>
    </div>
  )
}