"use client"
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { getUserManagerService } from '@/services/adminService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import "./page.scss";

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
        field: 'name',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 250,
    },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phonenumber', headerName: 'Phone Number', width: 200 },
    { field: 'ridePoint', headerName: 'Ride Point', width: 130 },
    { field: 'isBanned', headerName: 'Banned', width: 150 },
];


const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {

    const [rows, setRows] = React.useState([]);  // State để lưu dữ liệu sinh viên
    const [loading, setLoading] = React.useState(true);  // Để hiển thị loading

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUserManagerService(); // Gọi API
                setRows(response.data); // Gắn dữ liệu trả về vào state
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="GridData-Header">
            <div className="GridData-Global">
                <div className="GridData-Icon">
                    <FontAwesomeIcon icon={faSquarePlus} className="Icon-Data" />
                    <FontAwesomeIcon icon={faPenToSquare} className="Icon-Data" />
                    <FontAwesomeIcon icon={faTrash} className="Icon-Data" />
                </div>
                <Paper sx={{ height: 630, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        loading={loading}
                        className="GridData-Content"
                    />
                </Paper>
            </div>
        </div>
    );
}
