// ------------------------------------------------
// This code does the Enter Key magic
// ------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const itemIDInput = document.getElementById("itemID");

    // Enable Enter key for search
    itemIDInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchButton.click();
        }
    });

    // Enable search button for search
    searchButton.addEventListener("click", function () {
        const itemID = itemIDInput.value;
        if (itemID) {
            fetchInventory(itemID);
        }
    });
   
// ------------------------------------------------
// This section covers for the mobile app QR scan
// ------------------------------------------------
                
document.addEventListener("DOMContentLoaded", function () {
const scanButton = document.getElementById("scanButton");
    
scanButton.addEventListener("click", function () {
    startScanner();
});
.catch(error => console.error("Error fetching inventory:", error));
    }
});

// --------------------------------------------------
// This section covers for load of QR picture (*.png)
// --------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const loadPicButton = document.getElementById("loadPicButton");
    const fileInput = document.getElementById("fileInput");
    const imagePath = `https://raw.githubusercontent.com/jovan-filipovic/QR_Inventory_v1/main/${itemID}.png`;

    loadPicButton.addEventListener("click", function () {
        fileInput.click(); // Opens file dialog
    });

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file && file.name.endsWith(".png")) {
            const fileName = file.name.replace(".png", ""); // Extract ID from filename
            document.getElementById("itemID").value = fileName; // Auto-fill ID input
            fetchInventory(fileName); // Search inventory
        } else {
            alert("Please select a valid PNG file.");
        }
    });
});

// ------------------------------------------------------------------
// Fetch inventory data and populate fields (without printing to body)
// -------------------------------------------------------------------
function fetchInventory(itemID) {
    
    document.getElementById("searchButton").addEventListener("click", function () {
    console.log("Search button clicked!"); // Debugging check
    });
    
    fetch("https://raw.githubusercontent.com/jovan-filipovic/QR_Inventory_v1/main/inventory.csv")
        .then(response => response.text())
        .then(data => {
            console.log("Fetched CSV Data:", data); // Log CSV output to check format
            const rows = data.trim().split("\n").map(row => row.split(",").map(cell => cell.trim()));
            console.log("Parsed Rows:", rows); // Log parsed data
            const item = rows.slice(1).find(row => row[0] === itemID);

            if (item) {
                document.getElementById("newID").value = item[0];
                document.getElementById("newName").value = item[1];
                document.getElementById("newCategory").value = item[2];
                document.getElementById("newStock").value = item[3];
                document.getElementById("newLocation").value = item[4];

                // Ensure correct path for QR image
                const imagePath = `https://raw.githubusercontent.com/jovan-filipovic/QR_Inventory_v1/main/${itemID}.png`;
                document.getElementById("qrImage").src = imagePath;
                document.getElementById("qrImage").style.display = "block";
            } else {
                alert("Item not found.");
                document.getElementById("qrImage").style.display = "none";
            }
        })
        .catch(error => console.error("Error fetching inventory:", error));
}

// ------------------------------------------------------------------
// function startScanner
// -------------------------------------------------------------------
function startScanner() {
    const scanner = new Html5Qrcode("qr-reader");    
    scanner.start(
        { facingMode: "environment" }, // Opens the rear camera
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            console.log("QR Code Scanned:", decodedText);
            processScannedID(decodedText);
            scanner.stop(); // Stop the scanner after successful scan
        },
        (errorMessage) => {
            console.error("Scan Error:", errorMessage);
        }
    );
}

// ------------------------------------------------------------------
// function process Scanned ID
// -------------------------------------------------------------------
function processScannedID(id) {
    document.getElementById("itemID").value = id; // Auto-fill ID field
    fetchInventory(id); // Call your existing fetch function to retrieve data
    }
});

    })
        .catch(error => console.error("Error fetching inventory:", error));
    }
});
