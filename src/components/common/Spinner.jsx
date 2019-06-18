import React from 'react'
import { Spin, Icon } from 'antd';

export default function Spinner() {
  return (
    <div style={{ textAlign: 'center', marginTop: "40vh" }} >
      <Spin size="large" indicator={<Icon type="loading" /> } /> 
    </div>
  )
}