import React, { Component } from 'react'
import { Pagination } from 'antd';
import _ from 'lodash';

export default function Pagina(props) {

const { eventsCount, pageSize } = props;

const pagesCount = eventsCount / pageSize;
const pages = _.range(1, pagesCount);
  return (
     <Pagination onChange={props.handlePageChange} pageSize={pageSize} total={pages} />
  )
}

