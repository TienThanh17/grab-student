"use client";
import React, { useEffect, useState } from "react";
import "./page.scss";


const xLabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const OverView = () => {
    return (
        <div></div>
    );
};

export default OverView;
