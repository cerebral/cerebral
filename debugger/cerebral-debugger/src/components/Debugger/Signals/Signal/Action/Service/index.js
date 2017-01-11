import './styles.css'
import React from 'react'

import Inspector from '../../../../Inspector'

function Service ({service}) {
  const serviceNameStyle = {
    color: '#28a0aa'
  }

  return (
    <div className='service'>
      <i className='icon icon-service' />
      <span className='service-serviceName' style={serviceNameStyle}>{service.method}</span>
      <span className='service-serviceArgs'>
        {service.args.map((arg, index) => {
          return <Inspector key={index} value={arg} />
        })}
      </span>
    </div>
  )
}

export default Service
