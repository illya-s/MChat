import React from "react";
import "./Input.css";
import { Avatar } from "antd";

export function Input({
    icon = undefined,
    type = "outlined",
    color = "default",
    size = "md",
    placeholder = "",
    value,
    onChange,
    ...props
}) {
    return (
        <div className={`m-input m-input-${type} ${color} m-input-${size} ${!icon && "only-children"}`}>
            {icon && <div className="m-input-icon">{icon}</div>}

            <input
                className="m-input-field"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    );
}
