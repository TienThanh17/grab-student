import { Box, Skeleton, Stack } from '@mui/material';

function PostSkeleton() {
  return (
    <>
    <Stack spacing={1} sx={{mt: 4}}>
      <Box direction="row" width="100%" display="flex" alignItems="center">
        <Skeleton variant="circular" width={40} height={40} sx={{ marginRight: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', flexGrow: 1 }} />
      </Box>
      <Skeleton variant="rounded" width="100%" height={250} />
    </Stack>
    <Stack spacing={1} sx={{mt: 3}}>
      <Box direction="row" width="100%" display="flex" alignItems="center">
        <Skeleton variant="circular" width={40} height={40} sx={{ marginRight: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', flexGrow: 1 }} />
      </Box>
      <Skeleton variant="rounded" width="100%" height={250} />
    </Stack>
    <Stack spacing={1} sx={{mt: 3}}>
      <Box direction="row" width="100%" display="flex" alignItems="center">
        <Skeleton variant="circular" width={40} height={40} sx={{ marginRight: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', flexGrow: 1 }} />
      </Box>
      <Skeleton variant="rounded" width="100%" height={250} />
    </Stack>
    </>
  );
}

export default PostSkeleton;
