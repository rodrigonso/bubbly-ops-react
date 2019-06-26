import React from 'react'
import { Button, Avatar, Typography, Card, Divider, Rate, Skeleton } from 'antd'

const { Text } = Typography

export default function ServicesCard(props) {
  const { services, isLoading } = props
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
      {services.map(item => {
        return (
          <Card style={{ borderRadius: 5, margin: '10px 10px 0px 0px' }} >
            <Card.Meta 
              title={item.name} 
              description={
                <React.Fragment>
                  <Text type="secondary">{item.vehicleType}</Text> 
                  <br/>
                  <Text type="secondary">{item.duration} hrs</Text> 
                  <br/>
                  <Text>${item.price}</Text> 
                </React.Fragment>
              } 
            />
          </Card>
        )
      })}
      <Button type="dashed" icon="plus" style={{ borderRadius: 5, margin: '10px 10px 0px 0px', height: '94%' }} />  
    </div> 
  )
}