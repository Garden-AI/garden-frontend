import { useState, useEffect } from "react";
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



  // const location = useLocation();
  // const links: String[] = [];
  // links.push(location.pathname);
  // const here = links.map((link) => {
  //   return <Link to={`http://localhost:3000${link}`}>Link1</Link>;
  // });

  const location = useLocation();
  const [visitedPages, setVisitedPages] = useState<string[]>([]);

  useEffect(() => {
    setVisitedPages((prevVisitedPages) => [...prevVisitedPages, location.pathname]);
  }, [location.pathname]);

  return (
    <div>
    <div>
      Visited Pages:
      <ul>
        {visitedPages.map((page, index) => (
          <li key={index}>{page}</li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default Breadcrumbs;

// https://reactrouter.com/en/main/hooks/use-matches#breadcrumbs
