'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Post from "@/components/post/Post";
import PostDetail from "@/components/post/PostDetail";
import { useRouter } from 'next/navigation';
import { getPostService } from '@/services/postService'
import { useSelector } from 'react-redux';
import PostSkeleton from "@/components/loading/PostSkeleton";

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.user.userInfo.id)

  const params = useParams();
  const router = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await getPostService(userId, params.postType, true);
      setPosts(res.data.data);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.postType !== 'rider' && params.postType !== 'passenger') {
      router.push(`/not-found`);
    }
    fetchPosts();
  }, [params, router]);

  return !loading ? (
    <Box>
      <Stack spacing={5} sx={{ mt: 3, alignItems: "center" }}>
        {posts.map((value, index) => (
          <Post key={index} data={value} handleOpen={handleOpen} />
        ))}
      </Stack>

      <Modal
        open={open}
        onClose={handleClose}
        disableScrollLock={true}
      >
        <PostDetail handleClose={handleClose} fetchPosts={fetchPosts}/>
      </Modal>
    </Box>
  ) : <PostSkeleton />
};



