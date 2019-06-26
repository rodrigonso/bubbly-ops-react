import React from 'react'
import { Button, Avatar, Typography, Card, Divider, Rate, Skeleton } from 'antd'

const { Text } = Typography

export default function EmployeeCard(props) {
  const { employees, isLoading } = props
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
      {employees.map(item => {
        return (
          <Card style={{ borderRadius: 5, margin: '10px 10px 0px 0px' }} >
            <Card.Meta 
              avatar={<Avatar size="large">{item.name[0]}</Avatar>} 
              title={item.name} 
              description={
                <React.Fragment>
                  <Text type="secondary">{item.email}</Text> 
                  <br/>
                  <Text type="secondary">{item.phoneNumber}</Text>
                  <br/>
                  <br/>
                  <Text type="secondary" >Rating </Text>
                  <br/>
                  <Rate count={5} disabled value={item.rating} style={{ color: '#1890ff' }}  /> 
                </React.Fragment>
              } 
            />
          </Card>
        )
      })}
      <Button type="dashed" icon="plus" style={{ borderRadius: 5, margin: '10px 10px 0px 0px', height: '95%' }} />  
    </div> 
  )
}
