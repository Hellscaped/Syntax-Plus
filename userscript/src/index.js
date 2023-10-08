import ReactDOM from "react-dom";
import "./index.css";
import { deleteAllChildren } from "./utils";
import { awaitElement, log, addLocationChangeCallback, getLogo } from "./utils";
import { route_overrides, sidebar_pages } from "./routes";
import sidebar from "./sidebar.js";

log("React script has successfully started");

// Do required initial work. Gets called every time the URL changes,
// so that elements can be re-inserted as a user navigates a page with
// different routes.

async function getRank(groupId, playerId) {
    // https://www.syntax.eco/Game/LuaWebService/HandleSocialRequest.ashx?playerid=id&groupid=23&method=GetGroupRank 
    const url = `https://www.syntax.eco/Game/LuaWebService/HandleSocialRequest.ashx?playerid=${playerId}&groupid=${groupId}&method=GetGroupRank`;
    const response = await fetch(url);
    const domparser = new DOMParser();
    const dom = domparser.parseFromString(await response.text(), "text/xml");
    // Its in "Value"
    return dom.getElementsByTagName("Value")[0].textContent;
}

async function getCollectibles(playerId) {
    // https://www.syntax.eco/public-api/v1/inventory/collectibles/id
    const url = `https://www.syntax.eco/public-api/v1/inventory/collectibles/${playerId}`;
    const response = await fetch(url);
    const json = await response.json();
    // check for "assets" in the json
    if ("data" in json) {
        return json["data"]
    } else {
        return [];
    }
}

async function main() {
    // Find <body/>. This can be any element. We wait until
    // the page has loaded enough for that element to exist.

    // get the synplus logo
    if (!localStorage.getItem("customcss")) {
        localStorage.setItem("customcss", "/* Syntax+ Custom CSS */");
    }
    // eslint-disable-next-line no-undef
    GM_addStyle(localStorage.getItem("customcss"));
    if (window.location.pathname in route_overrides) {
        const oldcontainer = document.getElementsByClassName("d-flex align-items-center justify-content-center")[0];
        deleteAllChildren(oldcontainer);
        const body = await awaitElement("body > div");
        const container = document.createElement("div");
        body.appendChild(container);
        ReactDOM.render(route_overrides[window.location.pathname][0], container);
        document.title = route_overrides[window.location.pathname][1];
    }

    // check if the path startswith any of the sidebar pages
    // for (const page of sidebar_pages) {
    //     if (window.location.pathname.startsWith(page)) {
    //         // if it does, then we need to add the sidebar
    //         const body = await awaitElement("body");
    //         const bar = document.createElement("div");
    //         body.appendChild(sidebar());
    //         ReactDOM.render(<sidebar />, bar);
    //         break;
    //     }
    // }

    if (window.location.pathname.startsWith("/users")) {
        // if it is /users, then check for the user id (/users/359/profile)
        // console.log(window.location.pathname.split("/")[3]);
        // if (window.location.pathname.split("/")[3] == "profile") {
            const userid = window.location.pathname.split("/")[2];
            // username
            // /html/body/div[2]/div/div[1]/div[1]/div[2]/div[1]/h1
            // dom btw
            // rank
            const userelement = document.evaluate("/html/body/div[2]/div/div[1]/div[1]/div[2]/div[1]/h1", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const nameholder = userelement.parentElement;
            const logoSrc = await getLogo();
            const rank = await getRank(23, userid);
            const isAdmin = await getRank(15, userid);
            if (Number(isAdmin) > 0) {
                const logo = document.createElement("img");
                logo.src = "https://cdn.syntax.eco/75f2f7aa21c88470b2fd325523e0dbe36203a52758a29fef328f5613cac9b4ba1e8f85fbfdcf1c982c2ba1a4f09b9877a7558dc2618d092a494cb4246258cd3d";
                logo.style = "height: 40px; width: 40px;";
                nameholder.insertBefore(logo, userelement.nextSibling);
            }
            if (Number(rank) > 0) {
                const nameholder = userelement.parentElement;
                const logo = document.createElement("img");
                logo.src = logoSrc;
                logo.style = "height: 40px; width: 40px;";
                nameholder.insertBefore(logo, userelement.nextSibling);
            }
            // User Recent Average Price sum of collectibles
            var rap = 0;
            const collectibles = await getCollectibles(userid);
            for (const collectible of collectibles) {
                rap += Number(collectible["asset"]["asset_rap"] || 0);
            }
            // get /html/body/div[2]/div/div[1]/div[1]/div[2]/div[2]
            const statbox = document.evaluate("/html/body/div[2]/div/div[1]/div[1]/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const holder = document.createElement("div");
            holder.style = "width: fit-content;";
            holder.className = "me-3"
            const title = document.createElement("p");
            title.className = "m-0 text-secondary w-100 text-center d-block";
            title.innerText = "User RAP";
            title.style = "font-size: 15px;";
            const rapElement = document.createElement("p");
            rapElement.className = "m-0 text-decoration-none text-white w-100 text-center d-block";
            rapElement.innerText = rap;
            rapElement.style = "font-size: 25px;";
            holder.appendChild(title);
            holder.appendChild(rapElement);
            statbox.insertBefore(holder, statbox.firstChild);


        // }
    }
}

// Call `main()` every time the page URL changes, including on first load.
addLocationChangeCallback(() => {
    // Greasemonkey doesn't bubble errors up to the main console,
    // so we have to catch them manually and log them
    main().catch((e) => {
        log(e);
    });
});
