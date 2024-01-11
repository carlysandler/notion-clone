"use client";

import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
};

const DocucmentIdPage = ({
	params
}: DocumentIdPageProps) => {
	return (
		<div>DocucmentId</div>
	)
}

export default DocucmentIdPage
