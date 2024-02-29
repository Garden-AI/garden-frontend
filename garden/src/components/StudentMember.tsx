const StudentMember = ({member} : {member: any}) =>{
    return(
        <div className="border border-gray-200 shadow-sm rounded-lg p-5 flex flex-col">
            <p className="text-xl font-bold">{member.name}</p>
            <p className="text-gray-600 italic">{member.major}</p>
            <div className="flex gap-5">
                {member.linkedin_link.length>0 ? <a href={member.linkedin_link} target="_blank" rel="noreferrer" className="pt-5"><img className="h-5 w-5" src="img/LinkedIn-logo.png" alt="linkedin logo"/></a> : <></>}
                {member.github_link.length>0 ? <a href={member.github_link} target="_blank" rel="noreferrer" className="pt-5"><img className="h-5 w-5" src="img/github-logo.png" alt="github logo"/></a>: <></>}
            </div>
        </div>
    )
}

export default StudentMember