import { Link } from "react-router-dom";
import {
  Breadcrumb as BreadcrumbShadcn,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import React from "react";

export default function Breadcrumb({ crumbs }: { crumbs: any }) {
  return (
    <BreadcrumbShadcn className="mb-10 hidden md:block">
      <BreadcrumbList>
        {crumbs.slice(0, crumbs.length - 1).map((crumb: any, index: number) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={crumb.link}>{crumb.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
          </React.Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage className="bold">
            {crumbs[crumbs.length - 1].label}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbShadcn>
  );
}

function trimString(str: string) {
  return str.length > 40 ? str.substring(0, 50) + "..." : str;
}
