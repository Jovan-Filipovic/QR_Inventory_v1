document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const itemIDInput = document.getElementById("itemID");
    const scanButton = document.getElementById("scanButton");
    const loadPicButton = document.getElementById("loadPicButton");
    const fileInput = document.getElementById("fileInput");

    // Enable Enter key for search
    itemIDInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchButton.click();
        }
    });

    // Search button triggers inventory fetch
    searchButton.addEventListener("click", function () {
        const itemID = itemIDInput.value;
        if (itemID) {
            fetchInventory(itemID);
        }
    });

    // QR Scanner button triggers scanning
    scanButton.addEventListener("click", function () {
        startScanner();
    });

    // Load QR Picture button triggers file selection
    loadPicButton.addEventListener("click", function () {
        fileInput.click();
    });

    // Load QR Picture from file
    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file && file.name.endsWith(".png")) {
            const fileName = file.name.replace(".png", ""); // Extract ID from filename
            document.getElementById("itemID").value = fileName; // Auto-fill ID input

            // check if search button is triggered
            searchButton.addEventListener("click", function () {
                console.log("Search button clicked!"); // Debug check
            });
            
            fetchInventory(fileName); // Search inventory
        } else {
            alert("Please select a valid PNG file.");
        }
    });
});

// Function to fetch inventory data and populate fields
function fetchInventory(itemID) {
    console.log("Fetching inventory for ID:", itemID); // Debug check

    fetch("https://raw.githubusercontent.com/jovan-filipovic/QR_Inventory_v1/main/inventory.csv")
        .then(response => response.text())
        .then(data => {
            console.log("Fetched CSV Data:", data); // Log CSV content
            const rows = data.trim().split("\n").map(row => row.split(",").map(cell => cell.trim()));
            console.log("Parsed Rows:", rows); // Log parsed structure

            const item = rows.slice(1).find(row => row[0] === itemID);
            console.log("Matching Item:", item); // Log if ID was found

            if (item) {
                document.getElementById("newID").value = item[0];
                document.getElementById("newName").value = item[1];
                document.getElementById("newOwner").value = item[2];
                document.getElementById("newQty").value = item[3];
                document.getElementById("newLocation").value = item[4];

                // Show the corresponding QR image
                const imagePath = `https://raw.githubusercontent.com/jovan-filipovic/QR_Inventory_v1/main/images/${itemID}.png`;
                document.getElementById("qrImage").src = imagePath;
                document.getElementById("qrImage").style.display = "block";
            } else {
                alert("Item not found.");
                document.getElementById("qrImage").style.display = "none";
            }
        })
        .catch(error => console.error("Error fetching inventory:", error));
}


// ---------------------------------------
// Function to start the QR scanner
// ---------------------------------------
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

// ---------------------------------------
// Function to process the scanned QR ID
// ---------------------------------------
function processScannedID(scannedText) {
    console.log("Scanned Data:", scannedText); // Debugging check

    // Extract only the first part of the scanned text
    const itemID = scannedText.split(",")[0].trim(); 

    console.log("Extracted ID:", itemID); // Verify if correct ID is extracted
    document.getElementById("itemID").value = itemID; // Auto-fill ID field
    fetchInventory(itemID); // Auto-fetch item details
}

