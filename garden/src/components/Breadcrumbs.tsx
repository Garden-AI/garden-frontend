import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  // let matches = useMatches();
  // let crumbs = matches
  // .filter((match) => Boolean(match.handle?.crumb))
  // .map((match) => match.handle?.crumb(match.data));

  //   return (
  //     <ol>
  //       {crumbs.map((crumb, index) => (
  //         <li key={index}>{crumb}</li>
  //       ))}
  //     </ol>
  //   );

  //   let matches = useMatches();
  // let crumbs = matches.filter((match) => Boolean(match.handle?.crumb))
  // .map((match) => match.handle?.crumb(match.data));
  const location = useLocation();
  const links: String[] = [];
  links.push(location.pathname);
  const here = links.map((link) => {
    return <Link to={`http://localhost:3000${link}`}>Link1</Link>;
  });

  return (
    <div className="flex">
      <Link to={"/home"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="gray"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </Link>
      {here}
    </div>
  );
};

export default Breadcrumbs;

// https://reactrouter.com/en/main/hooks/use-matches#breadcrumbs
