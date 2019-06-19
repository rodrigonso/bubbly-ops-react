import React from 'react'
import { Button, Avatar, Typography, Tag, Divider, Rate, Skeleton } from 'antd'

const { Text } = Typography

export default function EmployeeCard(props) {
  const { employees, isLoading } = props
  return (
    <div style={{ overflowX: 'hidden', maxWidth: 800 }} >
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>Settings</h1>
      <p>View and manage all employees, services and upgrades.</p>
      <Divider />
      <h3 style={{ fontWeight: 700 }} >Employees</h3>
      <div className="employees" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: 10 }} >
        {employees.map(item => {
          return (
            <div key={item._id} style={{ padding: 25, borderRadius: 5, backgroundColor: '#fff', height: "16rem", width: "16rem", marginBottom: 10 }}>
              <div style={{ margin: 'auto' }} >
                <Avatar size="large" icon="user" style={{ backgroundColor: '#1890ff' }} />
                <Text style={{ marginLeft: 5 }} >{item.name}</Text>
              </div>
              <Divider />
              <div>
                <Text style={{ fontSize: 12 }} >Info</Text>
                <br/>
                <Text style={{ fontSize: 12 }} type="secondary">{item.email}</Text>
                <br/>
                <Text style={{ fontSize: 12 }} type="secondary">{item.phoneNumber}</Text>
                <br />
                <Text style={{ fontSize: 12 }} type="secondary">${item.wage} /hr</Text>                  
              </div>
              <Text style={{ fontSize: 12 }} >Rating</Text>
              <Rate disabled count={5} value={item.rating}  style={{ marginTop: 10, marginLeft: 10 }}  />  
            </div> 
          )
        })}
        <Button type="dashed" icon="plus" style={{ padding: 25, borderRadius: 5, backgroundColor: '#fff', height: "16rem", width: "16rem" }} />
      </div>
    </div>
  )
}
