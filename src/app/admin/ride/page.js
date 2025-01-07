"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { getRideManagerService } from "@/services/adminService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faPenToSquare, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField, Button, Autocomplete } from "@mui/material";
import { useSnackbar } from "notistack";
import "./page.scss";


const columns = [
    { field: "id", headerName: "ID", width: 70, cellClassName: "center-align" },
    { field: "riderStartLocation", headerName: "Vị trí xuất phát", width: 350, cellClassName: "center-align" },
    { field: "riderEndLocation", headerName: "Vị trí kết thúc", width: 350, cellClassName: "center-align" },
    { field: "status", headerName: "Trạng thái", width: 150, cellClassName: "center-align" },
    { field: "riderName", headerName: "Người chở", width: 200, cellClassName: "center-align" },
    { field: "passengerName", headerName: "Người đi", width: 200, cellClassName: "center-align" },
];

const paginationModel = { page: 0, pageSize: 10 };

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
                "You haven't selected a Ride to seen!",
                { variant: "error" }
            );
            return;
        }
        if (selectedRows.length > 1) {
            enqueueSnackbar(
                "Please select only one Ride!",
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
            riderStartLocation: item.riderStartLocation,
            riderEndLocation: item.riderEndLocation,
            status: item.status,
            estimatedTime: item.estimatedTime,
            startTime: item.startTime,
            riderName: item.rider.name,
            passengerName: item.passenger.name,
            pickUpLat: item.pickUpLat,
            pickUpLon: item.pickUpLon,
            dropOffLat: item.dropOffLat,
            dropOffLon: item.dropOffLon,
        }));
    };



    const fetchData = async () => {
        try {
            const response = await getRideManagerService();

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
                        pageSizeOptions={[10, 15]}
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
                        <h2 id="modal-title">Chi tiết chuyến đi</h2>
                        <div className="location">
                            <TextField
                                label="Vị trí xuất phát"
                                variant="outlined"
                                value={selectedPost?.riderStartLocation || ""}
                                sx={{ width: 750, borderRadius: 20, marginTop: 5 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                label="Vị trí kết thúc"
                                variant="outlined"
                                value={selectedPost?.riderEndLocation || ""}
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
                                type="date"
                                value={selectedPost?.startTime?.slice(0, 10) || ""}
                                sx={{ marginBottom: 2, width: 300, marginLeft: 10 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                        </div>
                        <div className="dou-css">
                            <TextField
                                label="Người chở"
                                variant="outlined"
                                value={selectedPost?.riderName || ""}
                                sx={{ marginBottom: 2, width: 300, marginRight: 10 }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                label="Người đi cùng"
                                variant="outlined"
                                value={selectedPost?.passengerName || ""}
                                sx={{ marginBottom: 2, width: 300, marginLeft: 10 }}
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
