const TeamMember = ({ member }: { member: any }) => {
  return (
    <div className="rounded-lg border border-gray-200 p-5 shadow-sm">
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
        {/* <p>{member.title}</p> */}
        <div className="flex gap-4">
          {member.linkedin_link.length > 0 ? (
            <a
              href={member.linkedin_link}
              target="_blank"
              rel="noreferrer"
              className="pt-2"
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
              className="pt-2"
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
    </div>
  );
};

export default TeamMember;
