import React, { useState } from "react";
import "./Button.css";

export function Button({
    icon = undefined,
    type = "solid",
    color = "default",
    fontSize = "md",
    children,
}) {
    return (
        <button
            className={`m-button m-button-${type} ${color} m-button-${fontSize} ${!children && "only-icon"} ${!icon && "only-children"}`}
        >
            {icon && <div className="m-button-icon">{icon}</div>}

            {children}
        </button>
    );
}
