import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";

import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '100%',
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function PostDetail() {
  const postData = useSelector((state) => state.post.postData)

  useEffect(() => {
    //call api
    
  }, []);

  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {postData.name}
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </Typography>
    </Box>
  );
}

export default PostDetail;
