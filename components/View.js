import React from "react";
import Ping from "@/components/Ping";
import { VIEW_COUNT } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";

const View = async ({id}) => {
    const views = await client.fetch(VIEW_COUNT, {id: await id});

    await writeClient.patch(id).inc({views: 1}).commit();

    return (
        <>
            <div className="view-container">
                <div className="absolute -top-2 -right-2">
                    <Ping />
                </div>

                <p className="view-text">
                    <span className="font-black">{views.views} Views</span>
                </p>
            </div>
        </>
    )
}

export default View;