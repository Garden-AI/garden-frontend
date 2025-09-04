import { useState, useCallback } from "react";

export function useTreeSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const handleSearchToggle = useCallback(() => {
        if (isSearching) {
            setSearchTerm("");
        }
        setIsSearching(!isSearching);
    }, [isSearching]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm("");
        setIsSearching(false);
    }, []);

    return {
        searchTerm,
        isSearching,
        handleSearchToggle,
        handleSearchChange,
        clearSearch,
    };
}
