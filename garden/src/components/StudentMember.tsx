const StudentMember = ({ member }: { member: any }) => {
  return (
    <div className="flex flex-1 flex-col justify-between rounded-lg border border-gray-200 p-4 shadow-sm">
      <div>
        <p className="text-xl font-bold">{member.name}</p>
        <p className="text-sm italic text-gray-600">{member.major}</p>
      </div>
      <div className="">
        {member.linkedin_link.length > 0 ? (
          <a
            href={member.linkedin_link}
            target="_blank"
            rel="noreferrer"
            className="inline-block pt-2 align-bottom"
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
        {member.github_link.length > 0 ? (
          <a
            href={member.github_link}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-2 pt-2 align-bottom"
          >
            <img
              className="h-5 w-5"
              src="img/github-logo.png"
              alt="github logo"
            />
          </a>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default StudentMember;
