const TeamMember = ({ member }: { member: any }) => {
  return (
    <div className="flex flex-1 flex-col justify-between rounded-lg border border-gray-200 p-5 shadow-sm">
      <div className="">
        <img
          className="mx-auto h-36 w-auto rounded-full"
          src={member.photo}
          alt={member.name}
        />
        <div className="mt-2 flex flex-col items-center">
          <p className="text-xl font-bold">{member.name}</p>
          <p className="text-center text-sm italic text-gray-600">
            {member.workplace}, {member.title}
          </p>
        </div>
        {/* <p>{member.title}</p> */}
      </div>
      <div className="mx-auto">
        {member.linkedin_link.length > 0 ? (
          <a
            href={member.linkedin_link}
            target="_blank"
            rel="noreferrer"
            className="mx-2 inline-block pt-2 align-bottom"
          >
            <img
              className="h-5 w-5"
              src="img/LinkedIn-logo.png"
              alt="linkedin logo"
            />
          </a>
        ) : (
          <></>
        )}
        {member.twitter_link.length > 0 ? (
          <a
            href={member.twitter_link}
            target="_blank"
            rel="noreferrer"
            className="mx-2 inline-block pt-2 align-bottom"
          >
            <img
              className="h-5 w-5"
              src="img/twitter-logo.png"
              alt="twitter logo"
            />
          </a>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default TeamMember;
