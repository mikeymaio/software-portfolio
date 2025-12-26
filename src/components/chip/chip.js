import React from 'react'

import * as styles from './chip.module.css'

export default ({ chip, style }) => (
  <p className={[styles.chip, style].join(' ')}>
    {chip}
  </p>
)
