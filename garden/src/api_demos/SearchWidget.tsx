import React, { useState } from "react";

import { GARDEN_INDEX_URL, SEARCH_SCOPE } from "../constants"
import { fetchWithScope } from "../globusHelpers"

export default function GardenWidget() {
    const [status, setStatus] = useState<string>("");

    const callSearch = async () => {
        try {
            const response = await fetchWithScope(SEARCH_SCOPE, GARDEN_INDEX_URL + "/search?q=\"ionization\"");
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const content = await response.text()
            setStatus(content);
        } catch (error) {
            setStatus("failed");
        }
    };

    const handleClick = () => {
        callSearch();
    };

    return (
        <div>
        <button onClick={handleClick}>Find some gardens</button>
        <p>{status}</p>
        </div>
    );
}