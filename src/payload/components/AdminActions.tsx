"use client";

import Link from "next/link";
import { ArrowUpRight, PlusIcon } from "./Icons";

/** Persistent utilities in the admin header: jump to the live site or start a listing. */
export default function AdminActions() {
  return (
    <div className="sliiq-admin-actions">
      <a
        className="sliiq-admin-actions__site"
        href="/"
        rel="noreferrer"
        target="_blank"
      >
        <span>Live site</span>
        <ArrowUpRight size={14} />
      </a>
      <Link
        className="sliiq-admin-actions__create"
        href="/admin/collections/listings/create"
      >
        <PlusIcon size={14} />
        <span>New listing</span>
      </Link>
    </div>
  );
}
