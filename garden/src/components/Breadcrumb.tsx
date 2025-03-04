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

const Breadcrumb = ({ crumbs, className = "" }: { crumbs: any; className?: string }) => {
  return (
    <BreadcrumbShadcn className={`hidden md:block ${className}`}>
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
          <BreadcrumbPage className="bold">{crumbs[crumbs.length - 1].label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbShadcn>
  );
};

export default Breadcrumb;
