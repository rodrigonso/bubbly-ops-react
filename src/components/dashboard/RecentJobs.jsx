import React from 'react'
import JobCard from '../common/JobCard'

function RecentJobs(props) {
  return (
    <div>
      {props.jobs.slice(0,5).map((job, i) => {
      return (
        <JobCard 
          i={i}
          key={job._id} 
          job={job} 
          isMobile={false}
          type="recent" 
          services={props.services}
          employees={props.employees}
          handleDelete={props.handleDelete} 
          handleEdit={props.handleEdit}
          isLoading={props.isDeleting} 
        />
        ) 
      })}
    </div>
  )
}

export default RecentJobs
