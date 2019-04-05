import React, { Component } from 'react'
import { Timeline, Icon, Card, Divider, Typography } from 'antd';

const { Text } = Typography;

export class EventsTimeline extends Component {
    formatSummary = (event) => {
      const regex = /[^0-9]/g;
      return event.summary.match(regex)
  }


  render() {
      const { selectedEvents, handleEventDeselect, selectedDetailer } = this.props;
      console.log(selectedEvents);
    return (
        <Card style={{ width: 300 }} title="New Timeline" actions={[<Icon type="check-circle" />, <Icon type="delete" />]}  >
            <Timeline>
                <Timeline.Item color="green" >Bubbly HQ</Timeline.Item>
                {selectedEvents.map(event => {
                    return <Timeline.Item onClick={() => handleEventDeselect(event)} dot={<Icon type="minus-circle" />} key={event.id} >{this.formatSummary(event)}</Timeline.Item>;
                })}
                <Timeline.Item color="red" >Bubbly HQ</Timeline.Item>
            </Timeline>
            <Divider />
            <Text type="secondary" >Detailer </Text><Divider type="vertical" /> {selectedDetailer.name}
        </Card>
    )
  }
}

export default EventsTimeline
