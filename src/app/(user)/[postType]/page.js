'use client'

import { useParams } from "next/navigation";

export default function PostPage() {
  const params = useParams();

  return <div>{params.postType}</div>;
}
