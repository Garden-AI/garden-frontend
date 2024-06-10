import TeamMember from "../components/TeamMember";
import StudentMember from "../components/StudentMember";

const TeamsPage = () => {
  // 1. Ben Blaiszik; University of Chicago; Co-PI
  // 2. Ian Foster; University of Chicago; PI
  // 3. Eliu Huerta; University of Chicago; Co-PI
  // 4. Rebecca Willett; University of Chicago; Co-PI
  // 5. Aristana Scourtas; University of Chicago; Senior Personnel
  // 6. Karen Schmidt; University of Chicago; Senior Personnel
  // 7. Dane Morgan; University of Wisconsin-Madison; Senior Personnel
  // 8. Rafael Gomez-Bombarelli; Massachusetts Institute of Technology; Co-PI

  const people = [
    {
      name: "Ben Blaiszik",
      description: "Group Leader - AI and data infrastructure for science",
      workplace: "University of Chicago",
      title: "Co-PI",
      twitter_link: "https://twitter.com/BenBlaiszik",
      linkedin_link: "https://www.linkedin.com/in/benblaiszik/",
      github_link: "",
      photo: "img/team-images/benb.jpeg",
    },
    {
      name: "Ian Foster",
      description: "",
      workplace: "University of Chicago",
      title: "Co-PI",
      twitter_link: "",
      linkedin_link: "https://www.linkedin.com/in/ianfoster/",
      github_link: "",
      photo: "img/team-images/ian.jpeg",
    },
    {
      name: "Eliu Huerta",
      description: "",
      workplace: "University of Chicago",
      title: "PI",
      twitter_link: "",
      linkedin_link: "https://www.linkedin.com/in/eliu-huerta-72a84165/",
      github_link: "",
      photo: "img/team-images/eliu.jpeg",
    },
    {
      name: "Rebecca Willett",
      description: "",
      workplace: "University of Chicago",
      title: "Co-PI",
      twitter_link: "",
      linkedin_link: "https://www.linkedin.com/in/rebecca-willett-90b95973/",
      github_link: "",
      photo: "img/team-images/rebecca.jpeg",
    },
    {
      name: "Aristana Scourtas",
      description: "Research Scientist and Software Engineer",
      workplace: "University of Chicago",
      title: "Senior Personnel",
      twitter_link: "https://twitter.com/aristana_s",
      linkedin_link: "https://www.linkedin.com/in/aristana/",
      github_link: "",
      photo: "img/team-images/ari.jpg",
    },
    {
      name: "KJ Schmidt",
      description: "Research Scientist and Software Engineer",
      workplace: "University of Chicago",
      title: "Senior Personnel",
      twitter_link: "https://twitter.com/kj_schmidt",
      linkedin_link: "https://www.linkedin.com/in/schmidtkj/",
      github_link: "",
      photo: "img/team-images/kj.jpeg",
    },
    {
      name: "Dane Morgan",
      description: "",
      workplace: "University of Wisconsin-Madison",
      title: "Senior Personnel",
      twitter_link: "",
      linkedin_link: "https://www.linkedin.com/in/dane-morgan-694a38/",
      github_link: "",
      photo: "img/team-images/dane.jpeg",
    },
    {
      name: "Rafael Gomez-Bombarelli",
      description: "",
      workplace: "Massachusetts Institute of Technology",
      title: "Co-PI",
      twitter_link: "",
      linkedin_link: "https://www.linkedin.com/in/rgbombarelli/",
      github_link: "",
      photo: "img/team-images/rafael.jpeg",
    },
    {
      name: "Ben Galewsky",
      description: "Senior Research Software Engineer",
      workplace: "National Center for Supercomputing Applications",
      title: "Senior Research Software Engineer",
      twitter_link: "",
      linkedin_link: "https://www.linkedin.com/in/bengalewsky/",
      github_link: "",
      photo: "img/team-images/beng.jpeg",
    },
    {
      name: "Will Engler",
      description: "Senior Software Engineer",
      workplace: "University of Chicago",
      title: "Senior Software Engineer",
      twitter_link: "",
      linkedin_link: "https://www.linkedin.com/in/will-engler-82190b140/",
      github_link: "",
      photo: "img/team-images/will.jpeg",
    },
    {
      name: "Owen Price-Skelly",
      description: "Software Engineer",
      workplace: "University of Chicago",
      title: "Software Engineer",
      twitter_link: "",
      linkedin_link: "https://www.linkedin.com/in/owen-price-skelly-350045234/",
      github_link: "",
      photo: "img/team-images/owen.jpeg",
    },
    {
      name: "Logan Ward",
      description: "Computational Scientist",
      workplace: "Argonne National Laboratory",
      title: "Computational Scientist",
      twitter_link: "https://twitter.com/WardLT2",
      linkedin_link: "https://www.linkedin.com/in/logan-ward-4b7811126/",
      github_link: "",
      photo: "img/team-images/logan.jpeg",
    },
    // {
    //     name: "Eric Blau",
    //     description: "Senior Software Engineer",
    //     workplace: "Argonne National Laboratory",
    //     title: "Senior Software Engineer",
    //     twitter_link:"",
    //     linkedin_link:"",
    //     github_link:""
    // },
    {
      name: "Noah Paulson",
      description: "Computational Scientist",
      workplace: "Argonne National Laboratory",
      title: "Computational Scientist",
      twitter_link: "",
      linkedin_link: "https://www.linkedin.com/in/noah-paulson-9980661b/",
      github_link: "",
      photo: "img/team-images/noah.jpeg",
    },
    {
      name: "Marcus Schwarting",
      description: "AI Research Scientist",
      workplace: "Argonne National Laboratory",
      title: "AI Research Scientist",
      twitter_link: "",
      linkedin_link: "https://www.linkedin.com/in/marcus-s-a7779486/",
      github_link: "",
      photo: "img/team-images/marcus.jpeg",
    },
    // {
    //     name: "Stephen Wangen",
    //     description: "Data Scientist",
    //     workplace: "University of Wisconsin-Madison",
    //     title: "Data Scientist",
    //     twitter_link:"",
    //     linkedin_link:"https://www.linkedin.com/in/steven-wangen/",
    //     github_link:""
    // }
  ];

  const students = [
    {
      name: "Isaac Darling",
      major: "Computer Science @ University of Chicago",
      linkedin_link: "https://www.linkedin.com/in/idarling/",
      github_link: "https://github.com/isaac-darling",
    },
    {
      name: "Jennifer Jin",
      major:
        "Computer Science + Human-Computer Interaction @ Washington University in St. Louis",
      linkedin_link: "https://www.linkedin.com/in/jen-jin/",
      github_link: "",
    },
    {
      name: "Chase Jenkins",
      major: "Computer Science @ University of North Carolina at Asheville",
      linkedin_link: "https://www.linkedin.com/in/chase-jenkins-90018a26a/",
      github_link: "",
    },
    {
      name: "Max Tuecke",
      major: "Computer Science @ University of Illinois Urbana-Champaign",
      linkedin_link: "",
      github_link: "",
    },
    {
      name: "Philip Kim",
      major:
        "Computer Science, Communication Design + Human Computer Interaction @ Washington University in St. Louis",
      linkedin_link: "https://www.linkedin.com/in/phillip-kim-8601b6188/",
      github_link: "",
    },
    {
      name: "Mark Muchane",
      major: "Computer Science and Math @ University of Chicago",
      linkedin_link: "https://www.linkedin.com/in/mark-muchane-649623112",
      github_link: "https://github.com/muchanem",
    },
    {
      name: "Allison Daemicke",
      major:
        "Computer Science + Statistics @ University of Illinois Urbana-Champaign",
      linkedin_link: "https://www.linkedin.com/in/allison-daemicke/",
      github_link: "",
    },
  ];

  return (
    <div className="mx-10 font-display">
      <div className="flex justify-center">
        <h1 className="pt-8 text-5xl underline decoration-green underline-offset-4">
          Our team
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-6 py-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {people.map((person) => (
          <TeamMember key={person.name} member={person} />
        ))}
      </div>
      <div className="flex justify-center">
        <h1 className="pt-8 text-5xl underline decoration-green underline-offset-4">
          Current Students
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-6 py-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {students.map((student) => (
          <StudentMember key={student.name} member={student} />
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
