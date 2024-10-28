'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import { postsData } from "@/utils/fakeData";
import Post from "@/components/Post";
import PostDetail from "@/components/PostDetail";

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  
  const params = useParams();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    //call api
    const postFilter = postsData.filter(
      (post) => post.type === params.postType
    );
    setPosts(postFilter);
  }, [params]);

  return (
    <>
      <Stack spacing={5} sx={{ marginTop: 3, alignItems: "center" }}>
        {posts.map((value, index) => (
          <Post key={index} data={value} handleOpen={handleOpen}/>
        ))}
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <PostDetail />
      </Modal>
    </>
  );
}
