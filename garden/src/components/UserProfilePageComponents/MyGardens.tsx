import React, { useState } from 'react';
import { Garden } from "../../types";
import GardenBox from "@/components/GardenBox";

const MyGardens = () => {
    const [gardens, setGardens] = useState<Garden[]>([]);

    return (
        <div>
            {gardens?.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gardens.map((garden: Garden, index: number) => (
                <GardenBox garden={garden} key={index} />
            ))}
            </div>
        ) : (
            <h3 className="mt-12 text-center text-xl opacity-60">
            No Gardens Created.
            </h3>
        )}
        </div>
    )
}

export default MyGardens;