"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { getPostManagerService } from "@/services/adminService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faPenToSquare, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField, Button, Autocomplete } from "@mui/material";
import { useSnackbar } from "notistack";
import "./page.scss";
import { Scale } from "@mui/icons-material";


const columns = [
    { field: "id", headerName: "ID", width: 70, cellClassName: "center-align" },
    { field: "pickUpLocation", headerName: "Vị trí đi", width: 420, cellClassName: "center-align" },
    { field: "dropOffLocation", headerName: "Vị trí đến", width: 420, cellClassName: "center-align" },
    { field: "status", headerName: "Trạng thái", width: 150, cellClassName: "center-align" },
    { field: "startDate", headerName: "Ngày đi", width: 120, cellClassName: "center-align" },
    { field: "startTimeString", headerName: "Thời gian đi", width: 150, cellClassName: "center-align" },
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
            pickUpLocation: item.pickUpLocation,
            dropOffLocation: item.dropOffLocation,
            status: item.status ? "Đã xác nhận" : "Chưa xác nhận",
            startDate: item.startDate,
            startTimeString: item.startTimeString,
            studentName: item.student.name,
            pickUpLat: item.pickUpLat,
            pickUpLon: item.pickUpLon,
            dropOffLat: item.dropOffLat,
            dropOffLon: item.dropOffLon,
        }));
    };



    const fetchData = async () => {
        try {
            const response = await getPostManagerService();

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
                            height: 700,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 10,
                        }}
                    >
                        <h2 id="modal-title">Chi tiết bài đăng</h2>
                        <div className="location">
                            <TextField
                                label="Vị trí đi"
                                variant="outlined"
                                value={selectedPost?.pickUpLocation || ""}
                                sx={{ width: 750, borderRadius: 20, marginTop: 5 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                label="Vị trí đến"
                                variant="outlined"
                                value={selectedPost?.dropOffLocation || ""}
                                sx={{ width: 750, borderRadius: 20, marginTop: 5 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </div>
                        <div className="dou-css">
                            <TextField
                                label="Trạng thái"
                                variant="outlined"
                                value={selectedPost?.status || ""}
                                sx={{ marginBottom: 2, width: 300, marginRight: 10 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                label="Ngày đi"
                                variant="outlined"
                                value={selectedPost?.startDate || ""}
                                sx={{ marginBottom: 2, width: 300, marginLeft: 10 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </div>
                        <div className="dou-css">
                            <TextField
                                label="Người đăng bài"
                                variant="outlined"
                                value={selectedPost?.studentName || ""}
                                sx={{ marginBottom: 2, width: 300, marginRight: 10 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                label="Thời gian đi"
                                variant="outlined"
                                value={selectedPost?.startTimeString || ""}
                                sx={{ marginBottom: 2, width: 300, marginLeft: 10 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </div>
                        <div className="dou-css">
                            <Button
                                variant="contained"
                                onClick={handleClose}
                                sx={{
                                    width: 150,
                                    marginRight: 10,
                                    background: 'linear-gradient(45deg, #2e2e6f, #2a2e6c)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg,rgb(28, 28, 80), #2a2e6c)',
                                    },
                                }}
                            >
                                Danh sách yêu cầu
                            </Button>
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
                        </div>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}
