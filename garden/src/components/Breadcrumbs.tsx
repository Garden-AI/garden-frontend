import React from 'react'
import { useMatches } from 'react-router-dom'

const Breadcrumbs = () => {
    let matches = useMatches();
    // let crumbs = matches.filter((match) => Boolean(match.handle?.crumb))
    // .map((match) => match.handle.crumb(match.data));

    return (
        <div>Breadcrumbs</div>
    )
}

export default Breadcrumbs

// https://reactrouter.com/en/main/hooks/use-matches#breadcrumbs