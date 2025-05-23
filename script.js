// ------------------------------------------------
// This code does the Enter Key magic
// ------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const itemIDInput = document.getElementById("itemID");

    // Enable Enter key for search
    itemIDInput.addEventListener("keydown", function (event) {
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
    // Fetch inventory data and populate fields (without printing to body)
    // ------------------------------------------------
    
    function fetchInventory(itemID) {
        fetch("https://raw.githubusercontent.com/jovan-filipovic/QR_Inventory_v1/main/inventory.csv")
            .then(response => response.text())
            .then(data => {
                const rows = data.trim().split("\n").map(row => row.split(",").map(cell => cell.trim()));
                const item = rows.slice(1).find(row => row[0] === itemID);

                if (item) {
                    document.getElementById("newID").value = item[0];
                    document.getElementById("newName").value = item[1];
                    document.getElementById("newCategory").value = item[2];
                    document.getElementById("newStock").value = item[3];
                    document.getElementById("newLocation").value = item[4];
                } else {
                    alert("Item not found.");
                }
    
    // ------------------------------------------------
    // This section covers for the mobile app QR scan
    // ------------------------------------------------
                
    document.addEventListener("DOMContentLoaded", function () {
    const scanButton = document.getElementById("scanButton");
    
    scanButton.addEventListener("click", function () {
        startScanner();
    });

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

    function processScannedID(id) {
        document.getElementById("itemID").value = id; // Auto-fill ID field
        fetchInventory(id); // Call your existing fetch function to retrieve data
    }
});

            })
            .catch(error => console.error("Error fetching inventory:", error));
    }
});
