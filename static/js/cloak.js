function updatePageCloak() {
    const selectedCloak = localStorage.getItem("cloak");
    
    if (!selectedCloak || selectedCloak === "none") {
        document.title = "Lithium";
        setFavicon("./images/logo.png");
        return;
    }

    const customTitle = localStorage.getItem("customTitle");
    const customFavicon = localStorage.getItem("customFavicon");

    if (customTitle && customFavicon) {
        document.title = customTitle;
        setFavicon(customFavicon);
        return;
    }

    fetch('./json/cloak.json')
        .then(response => response.json())
        .then(data => {
            if (data[selectedCloak]) {
                // Set the title based on the cloak type
                const titles = {
                    "google-docs": "Google Docs",
                    "google-classroom": "Google Classroom",
                    "blackboard": "Blackboard",
                    "moodle": "Moodle",
                    "scholastic": "Scholastic",
                    "khan-academy": "Khan Academy",
                    "quizlet": "Quizlet"
                };

                document.title = titles[selectedCloak] || "Lithium";
                setFavicon(`../logos/${data[selectedCloak]}`);
            }
        })
        .catch(error => {
            console.error('Error loading cloak settings:', error);
            document.title = "Lithium";
            setFavicon("./images/logo.png");
        });
}

function setFavicon(iconPath) {
    let favicon = document.querySelector('link[rel="icon"]');
    
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }
    
    favicon.href = iconPath;
}

document.addEventListener('DOMContentLoaded', updatePageCloak);


window.addEventListener('storage', function(e) {
    if (e.key === "cloak" || e.key === "customTitle" || e.key === "customFavicon") {
        updatePageCloak();
    }
}); 