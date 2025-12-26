import React from 'react';
import Project from './project';

import * as styles from './project.module.css'

export default props => {
  const { projects } = props;
  return (
    <div className="wrapper" id="recentWork">
      <h2 className="section-headline">Recent Work</h2>
      <ul className={styles.projectList}>
        {projects.map(({ node, index }) => {
          return (
            <Project project={node} key={node.projectName + index} />
          )
        })}
      </ul>
    </div>
  )
}