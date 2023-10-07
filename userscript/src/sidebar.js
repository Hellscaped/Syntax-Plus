import React from "react";
import "./SideBar.css";


class BarElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false,
            items: [
                {
                    text: "Home",
                    link: "/home",
                    icon: "home"
                }
            ]
        };
        var togglebutton = document.getElementById("togglebutton");
        togglebutton.addEventListener("click", this.toggleSidebar);
    }

    render() {
        if (this.state.sidebarOpen) {
            return (
                <div className="sidebar">
                    <div className="sidebar-content">
                        {this.items.map(item => (
                            <div className="sidebar-item">
                                <span class="material-symbols-outlined">{item.icon}</span>
                                <a class="sidebar-item-link" src={item.link}>{item.text}</a>
                         </div>
                        ))}
                    </div>
                </div>
            );
        } else {
            return
        }
    }

    toggleSidebar() {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }
}

export default function sidebar() {
    return (
        <BarElement />
    );
}

