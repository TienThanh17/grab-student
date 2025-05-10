"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { getRideReviewManagerService } from "@/services/adminService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField, Button, Autocomplete } from "@mui/material";
import { useSnackbar } from "notistack";
import "./page.scss";


const columns = [
    { field: "id", headerName: "ID", width: 70, cellClassName: "center-align" },
    { field: "rating", headerName: "Đánh giá", width: 200, cellClassName: "center-align" },
    { field: "comment", headerName: "Bình luận", width: 350, cellClassName: "center-align" },
    { field: "rideId", headerName: "Mã chuyến đi", width: 200, cellClassName: "center-align" },
    { field: "userReviewer", headerName: "Mã người đánh giá", width: 200, cellClassName: "center-align" },
    { field: "userReviewed", headerName: "Mã người nhận đánh giá", width: 200, cellClassName: "center-align" },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedPost, setSelectedPost] = React.useState(null);
    const { enqueueSnackbar } = useSnackbar();


    const handleOpen = () => {
        console.log(rows);
        if (selectedRows.length === 0) {
            enqueueSnackbar(
                "You haven't selected a Post to seen!",
                { variant: "error" }
            );
            return;
        }
        if (selectedRows.length > 1) {
            enqueueSnackbar(
                "Please select only one post!",
                { variant: "error" }
            );
            return;
        }
        const post = rows.find(row => row.id === selectedRows[0]);
        setSelectedPost(post);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const transformData = (data) => {
        return data.map(item => ({
            id: item.id,
            rating: item.rating,
            comment: item.comment,
            userReviewer: item.reviewerId,
            userReviewed: item.reviewedId,
            rideId: item.rideId,
        }));
    };



    const fetchData = async () => {
        try {
            const response = await getRideReviewManagerService();

            const dataArray = response.data.data;

            if (Array.isArray(dataArray)) {
                const transformedRows = transformData(dataArray);
                setRows(transformedRows);
            } else {
                console.error("Expected an array but got:", dataArray);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };


    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="GridData-Header">
            <div className="GridData-Global">
                <div className="GridData-Icon">
                    <FontAwesomeIcon icon={faEye} className="Icon-Data" onClick={handleOpen} />
                </div>
                <Paper sx={{ height: 630, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        loading={loading}
                        className="GridData-Content"
                        onRowSelectionModelChange={(newSelection) => {
                            setSelectedRows(newSelection);
                        }}
                    />
                </Paper>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 900,
                            height: 550,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 10,
                        }}
                    >
                        <h2 id="modal-title">Chi tiết đánh giá</h2>
                        <div className="dou-css">
                            <TextField
                                label="Đánh giá"
                                variant="outlined"
                                value={selectedPost?.rating || ""}
                                sx={{ marginBottom: 2, width: 300, marginRight: 10 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                label="Mã chuyến đi"
                                variant="outlined"
                                value={selectedPost?.rideId || ""}
                                sx={{ marginBottom: 2, width: 300, marginLeft: 10 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </div>
                        <div className="dou-css">
                            <TextField
                                label="Mã người đánh giá"
                                variant="outlined"
                                value={selectedPost?.userReviewer || ""}
                                sx={{ marginBottom: 2, width: 300, marginRight: 10 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                label="Mã người nhận đánh giá"
                                variant="outlined"
                                value={selectedPost?.userReviewed || ""}
                                sx={{ marginBottom: 2, width: 300, marginLeft: 10 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </div>
                        <div className="location">
                            <TextField
                                label="Bình luận"
                                variant="outlined"
                                value={selectedPost?.comment || ""}
                                sx={{ width: 750, borderRadius: 20, marginBottom: 5 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </div>
                        <Button
                            variant="contained"
                            onClick={handleClose}
                            sx={{
                                width: 150,
                                marginLeft: 10,
                                background: 'linear-gradient(45deg, #2e2e6f, #2a2e6c)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg,rgb(28, 28, 80), #2a2e6c)',
                                },
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}
