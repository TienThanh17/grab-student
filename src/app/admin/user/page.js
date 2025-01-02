"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { getUserManagerService, updateUserManagerService, deleteUserManagerService, createUserManagerService } from "@/services/adminService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField, Button, Autocomplete } from "@mui/material";
import { useSnackbar } from "notistack";
import "./page.scss";


const columns = [
    { field: "id", headerName: "ID", width: 70, cellClassName: "center-align" },
    { field: "email", headerName: "Email", width: 250, cellClassName: "center-align" },
    {
        field: "name",
        headerName: "Full name",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 250,
    },
    {
        field: "gender", headerName: "Giới tính",
        width: 100, cellClassName: "center-align",
        valueGetter: (value) => (value === true ? "Nam" : "Nữ"),
    },
    { field: "birthday", headerName: "Ngày sinh", width: 150, cellClassName: "center-align" },
    { field: "studentClass", headerName: "Lớp sinh viên", width: 150, cellClassName: "center-align" },
    { field: "phonenumber", headerName: "Số điện thoại", width: 130, cellClassName: "center-align" },
    { field: "ridePoint", headerName: "Ride Point", width: 100, cellClassName: "center-align" },
    { field: "isBanned", headerName: "Banned", width: 70, cellClassName: "center-align" },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedStudent, setSelectedStudent] = React.useState(null);
    const [createStudent, setCreateStudent] = React.useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    const [newStudent, setNewStudent] = React.useState({
        name: "",
        email: "",
        gender: true,
        phonenumber: "",
        ridePoint: 100,
        isBanned: false,
        is2faEnabled: false,
        avatarUrl: "",
        verifyStudent: true,
        birthday: "",
        studentClass: "",
    });

    const handleOpen = () => {
        if (selectedRows.length === 0) {
            enqueueSnackbar(
                "You haven't selected a student to edit!",
                { variant: "error" }
            );
            return;
        }
        if (selectedRows.length > 1) {
            enqueueSnackbar(
                "Please select only one student!",
                { variant: "error" }
            );
            return;
        }
        const student = rows.find(row => row.id === selectedRows[0]);
        setSelectedStudent(student);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedStudent((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCreateOpen = () => setCreateStudent(true);
    const handleCreateClose = () => setCreateStudent(false);

    const handleNewStudentChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCreate = async () => {
        try {
            await createUserManagerService(newStudent);
            await fetchData();
            enqueueSnackbar("Student created successfully!", { variant: "success" });
            setCreateStudent(false);
            setNewStudent({
                name: "",
                email: "",
                gender: true,
                phonenumber: "",
                ridePoint: 100,
                isBanned: false,
                is2faEnabled: false,
                avatarUrl: "",
                verifyStudent: true,
                birthday: "",
                studentClass: "",
            });
        } catch (error) {
            console.error("Error creating student:", error);
            enqueueSnackbar("Failed to create student!", { variant: "error" });
        }
    };


    const handleDeleteOpen = () => {
        if (selectedRows.length === 0) {
            enqueueSnackbar("You haven't selected a student to delete!", { variant: "error" });
            return;
        }
        if (selectedRows.length > 1) {
            enqueueSnackbar("Please select only one student!", { variant: "error" });
            return;
        }
        const student = rows.find(row => row.id === selectedRows[0]);
        setSelectedStudent(student);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => setDeleteOpen(false);

    const handleDelete = async () => {
        try {
            await deleteUserManagerService(selectedStudent.id);
            setRows((prevRows) => prevRows.filter(row => row.id !== selectedStudent.id));
            enqueueSnackbar("Success Delete!", { variant: "success" });
            setDeleteOpen(false);
        } catch (error) {
            console.error("Error deleting student:", error);
            enqueueSnackbar("Failed to delete student!", { variant: "error" });
        }
    };

    const handleSave = async () => {
        const formattedData = {
            email: selectedStudent.email,
            name: selectedStudent.name,
            gender: selectedStudent.gender,
            birthday: selectedStudent.birthday,
            studentClass: selectedStudent.studentClass,
            phonenumber: selectedStudent.phonenumber,
            ridePoint: Number(selectedStudent.ridePoint),
            isBanned: selectedStudent.isBanned,
        };

        try {
            await updateUserManagerService(selectedStudent.id, formattedData);
            setRows((prevRows) =>
                prevRows.map((row) =>
                    row.id === selectedStudent.id ? { ...selectedStudent } : row
                )
            );

            enqueueSnackbar("Success Update!", { variant: "success" });
            setOpen(false);
        } catch (error) {

            console.error("Error updating student:", error);
            enqueueSnackbar("Failed to update student!", { variant: "error" });
        }
    };

    const fetchData = async () => {
        try {
            const response = await getUserManagerService();
            setRows(response.data);
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
                    <FontAwesomeIcon icon={faSquarePlus} className="Icon-Data" onClick={handleCreateOpen} />
                    <FontAwesomeIcon icon={faPenToSquare} className="Icon-Data" onClick={handleOpen} />
                    <FontAwesomeIcon icon={faTrash} className="Icon-Data" onClick={handleDeleteOpen} />
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
                        getRowClassName={(params) =>
                            params.row.isBanned ? "banned-row" : ""
                        }
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
                            height: 750,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 10,
                        }}
                    >
                        <h2 id="modal-title">Chỉnh sửa sinh viên</h2>
                        {selectedStudent && (
                            <form>
                                <div className="dou-css">
                                    <TextField
                                        label="Full Name"
                                        variant="outlined"
                                        name="name"
                                        value={selectedStudent.name || ""}
                                        onChange={handleInputChange}
                                        sx={{ width: 300, borderRadius: 20, marginRight: 10 }}
                                    />
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        name="email"
                                        value={selectedStudent.email || ""}
                                        onChange={handleInputChange}
                                        sx={{ width: 300, borderRadius: 20, marginLeft: 10 }}
                                    />
                                </div>
                                <div className="dou-css">
                                    <Autocomplete
                                        disablePortal
                                        options={["Nam", "Nữ"]}
                                        value={selectedStudent.gender ? "Nam" : "Nữ"}
                                        onChange={(event, newValue) =>
                                            setSelectedStudent((prevState) => ({
                                                ...prevState,
                                                gender: newValue === "Nam",
                                            }))
                                        }
                                        renderInput={(params) => <TextField {...params} label="Gender" />}
                                        sx={{ marginBottom: 2, width: 300, marginRight: 10 }}
                                    />

                                    <TextField
                                        label="Birthday"
                                        variant="outlined"
                                        type="date"
                                        value={selectedStudent.birthday}
                                        onChange={(event) =>
                                            setSelectedStudent((prevState) => ({
                                                ...prevState,
                                                birthday: event.target.value,
                                            }))
                                        }
                                        sx={{ marginBottom: 2, width: 300, marginLeft: 10 }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                </div>
                                <div className="dou-css">
                                    <TextField
                                        label="Class"
                                        variant="outlined"
                                        fullWidth
                                        name="studentClass"
                                        value={selectedStudent.studentClass || ""}
                                        onChange={handleInputChange}
                                        sx={{ marginBottom: 2, width: 300, marginRight: 10 }}
                                    />
                                    <TextField
                                        label="Phone Number"
                                        variant="outlined"
                                        fullWidth
                                        name="phonenumber"
                                        value={selectedStudent.phonenumber || ""}
                                        onChange={handleInputChange}
                                        sx={{ marginBottom: 2, width: 300, marginLeft: 10 }}
                                    />
                                </div>
                                <div className="dou-css">
                                    <TextField
                                        label="Ride Point"
                                        variant="outlined"
                                        fullWidth
                                        name="ridePoint"
                                        value={selectedStudent.ridePoint || ""}
                                        onChange={handleInputChange}
                                        sx={{ marginBottom: 2, width: 300, marginRight: 10 }}
                                    />
                                    <Autocomplete
                                        disablePortal
                                        options={["Yes", "No"]}
                                        value={selectedStudent.isBanned ? "Yes" : "No"}
                                        onChange={(event, newValue) =>
                                            setSelectedStudent((prevState) => ({
                                                ...prevState,
                                                isBanned: newValue === "Yes",
                                            }))
                                        }
                                        renderInput={(params) => <TextField {...params} label="Banned" />}
                                        sx={{ marginBottom: 2, width: 300, marginLeft: 10 }}
                                    />
                                </div>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    sx={{
                                        width: 150,
                                        marginLeft: 5,
                                        marginTop: 2,
                                        background: 'linear-gradient(45deg, #2e2e6f, #2a2e6c)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg,rgb(28, 28, 80), #2a2e6c)',
                                        },
                                    }}
                                >
                                    Save
                                </Button>
                            </form>
                        )}
                    </Box>
                </Modal>
                <Modal open={deleteOpen} onClose={handleDeleteClose} aria-labelledby="modal-title" aria-describedby="modal-description">
                    <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24, p: 4,
                        borderRadius: 10
                    }}>
                        <h2 className="modal-title">Delete Student</h2>
                        <text className="modal-title" >Are you sure you want to delete this student?</text>
                        <div className="dou-css-delete">
                            <Button variant="contained" color="secondary" onClick={handleDelete} sx={{ marginRight: 5 }}>Yes</Button>
                            <Button variant="contained" onClick={handleDeleteClose} sx={{ marginLeft: 5 }}>No</Button>
                        </div>

                    </Box>
                </Modal>
                <Modal
                    open={createStudent}
                    onClose={handleCreateClose}
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
                            height: 600,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 10,
                        }}
                    >
                        <h2 id="modal-title">Thêm mới sinh viên</h2>
                        <div className="dou-css">
                            <TextField
                                label="Full Name"
                                variant="outlined"
                                name="name"
                                value={newStudent.name}
                                onChange={handleNewStudentChange}
                                sx={{ width: 300, borderRadius: 20, marginRight: 10 }}
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                name="email"
                                value={newStudent.email}
                                onChange={handleNewStudentChange}
                                sx={{ width: 300, borderRadius: 20, marginLeft: 10 }}
                            />
                        </div>
                        <div className="dou-css">
                            <Autocomplete
                                disablePortal
                                options={["Nam", "Nữ"]}
                                value={newStudent.gender ? "Nam" : "Nữ"}
                                onChange={(event, newValue) =>
                                    setNewStudent((prevState) => ({
                                        ...prevState,
                                        gender: newValue === "Nam",
                                    }))
                                }
                                renderInput={(params) => <TextField {...params} label="Gender" />}
                                sx={{ marginBottom: 2, width: 300, marginRight: 10 }}
                            />

                            <TextField
                                label="Birthday"
                                variant="outlined"
                                type="date"
                                value={newStudent.birthday}
                                onChange={(event) =>
                                    setNewStudent((prevState) => ({
                                        ...prevState,
                                        birthday: event.target.value,
                                    }))
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ marginBottom: 2, width: 300, marginLeft: 10 }}
                            />
                        </div>
                        <div className="dou-css">
                            <TextField
                                label="Class"
                                variant="outlined"
                                fullWidth
                                name="studentClass"
                                value={newStudent.studentClass}
                                onChange={handleNewStudentChange}
                                sx={{ marginBottom: 2, width: 300, marginRight: 10 }}
                            />
                            <TextField
                                label="Phone Number"
                                variant="outlined"
                                fullWidth
                                name="phonenumber"
                                value={newStudent.phonenumber}
                                onChange={handleNewStudentChange}
                                sx={{ marginBottom: 2, width: 300, marginLeft: 10 }}
                            />
                        </div>
                        <Button
                            variant="contained"
                            onClick={handleCreate}
                            sx={{
                                width: 150,
                                marginLeft: 5,
                                marginTop: 2,
                                background: 'linear-gradient(45deg, #2e2e6f, #2a2e6c)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg,rgb(28, 28, 80), #2a2e6c)',
                                },
                            }}
                        >
                            Create
                        </Button>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}
