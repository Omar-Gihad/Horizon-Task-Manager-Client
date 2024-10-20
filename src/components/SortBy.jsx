import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export default function Example() {
  return (
    <div className="w-full max-w-md px-4">
      {/* Replace <Field> with <div> */}
      <div>
        {/* Replace <Label> with a label HTML tag */}
        <label className="text-sm font-medium text-grey">Sort by</label>

        {/* Replace <Description> with a paragraph or span tag */}

        <div className="relative">
          {/* Replace <Select> with a standard select HTML tag */}
          <select
            className={clsx(
              "mt-3 block w-full appearance-none rounded-lg border-none bg-grey/5 py-1.5 px-3 text-sm text-white",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/25",
              // Ensure options are black text on Windows
              "*:text-black"
            )}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="delayed">Delayed</option>
            <option value="canceled">Canceled</option>
          </select>

          {/* Chevron icon */}
          <ChevronDownIcon
            className="pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
