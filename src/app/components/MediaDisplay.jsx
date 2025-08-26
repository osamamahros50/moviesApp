import React from "react";
import Card from "./Card";

export default function MediaDisplay({ items }) {
  return (
    <div className="bg-black text-white min-h-screen w-full flex justify-center">
      <section className="py-8 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 mx-w-[1400px] w-full">
        {items?.length > 0 ? (
          <div className="flex justify-center">
            <div
              className="inline-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5
                gap-6 md:gap-8"
              style={{ minWidth: "min-content" }}
            >
              {items.slice(0, 15).map((item) => (
                <div key={item.id}>
                  <Card
                    media={{
                      ...item,
                      media_type:
                        item.media_type ||
                        (item.first_air_date
                          ? "tv"
                          : item.known_for_department
                          ? "person"
                          : "movie"),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center "> No item found</p>
        )}
      </section>
    </div>
  );
}
