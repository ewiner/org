import React from "react";
import MembersList from "./MembersList";
import {Hierarchy, Person} from "../src/types";

// inspired by https://github.com/ravisankarchinnam/tailwindcss-react-flowchart/

export default function PersonView({name, role, members}: Hierarchy<Person>) {
  return (
    <div className="text-center">
      <div className="flex flex-col">
        <div className="text-gray-600">
          <p>{name}</p>
          <p>{role}</p>
        </div>
      </div>
      {members.length > 0 && <MembersList profiles={members} />}
    </div>
  );
};
