import React, { Component } from 'react'
import CurrentJobs from '../../currentJobs/CurrentJobs';
import axios from 'axios'
import CompletedJob from '../../completedJobs/CompletedJobs'

export class Jobs extends Component {
    state = {
        completedJobs: [],
        uncompletedJobs: []
    }

    componentDidMount() {
        this.setState({ completedJobs: this.props.completedJobs, uncompletedJobs: this.props.uncompletedJobs })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.completedJobs !== this.props.completedJobs) {
            this.setState({ completedJobs: this.props.completedJobs })
        } else if (prevProps.uncompletedJobs !== this.props.uncompletedJobs) {
            this.setState({ uncompletedJobs: this.props.uncompletedJobs })
        }
    }

  render() {
      const { isGapiReady, user } = this.props
      const { uncompletedJobs, completedJobs } = this.props
    return (
      <div>
        <CompletedJob completedJobs={completedJobs} user={user} />
        <CurrentJobs handleRefresh={this.props.handleRefresh} user={user} uncompletedJobs={uncompletedJobs} isGapiReady={isGapiReady} />
      </div>
    )
  }
}

export default Jobs
