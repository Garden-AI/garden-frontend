const TeamMember = ({member} : {member: any}) =>{
    
    return(
        <div className="border border-gray-200 shadow-sm rounded-lg p-5">
            <img className="h-40 w-auto ml-auto mr-auto rounded-full" src={member.photo} alt={member.name} />
            <div className="flex flex-col items-center">
                <p className="text-xl font-bold">{member.name}</p>
                <p className="text-gray-600 italic text-center">{member.workplace}, {member.title}</p>
                {/* <p>{member.title}</p> */}
                <div className="flex gap-5">
                    {member.linkedin_link.length>0 ? <a href={member.linkedin_link} target="_blank" rel="noreferrer" className="pt-5"><img className="h-5 w-5" src="img/LinkedIn-logo.png" alt="linkedin logo"/></a> : <></>}
                    {member.twitter_link.length>0 ? <a href={member.twitter_link} target="_blank" rel="noreferrer" className="pt-5"><img className="h-5 w-5" src="img/twitter-logo.png" alt="twitter logo"/></a>: <></>}
                </div>
            </div>
        </div>
    )
}

export default TeamMember