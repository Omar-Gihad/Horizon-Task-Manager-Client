import React, { useState } from "react";
import clsx from "clsx";

const SortBy = ({value, setValue}) => {
  return (
    <div className="max-w-md ">
      {/* Sort by label */}
      <div className="flex gap-2 items-center">
        <label htmlFor="sort-by" className="text-sm font-medium text-black">
          Sort by :
        </label>

        {/* Select dropdown */}
        <div>
          <select
            id="sort-by"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={clsx(
              " rounded-lg border-none py-1.5 px-5 text-sm text-black",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/25",
              "*:text-black" // Ensure options display in black on Windows
            )}
          >
            <option value="date">Date</option>
            <option value="priority">Priority</option>
            <option value="title">Name</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SortBy;
