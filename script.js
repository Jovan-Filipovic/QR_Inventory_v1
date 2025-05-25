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
        console.log("QR Scan button clicked!"); // ✅ Debugging check
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
            fetchInventory(fileName); // Search inventory
        } else {
            alert("Please select a valid PNG file.");
        }
    });
});

// Function to fetch inventory data and populate fields
function fetchInventory(itemID) {
    console.log("Fetching inventory for ID:", itemID);

    fetch("https://raw.githubusercontent.com/jovan-filipovic/QR_Inventory_v1/main/inventory.csv")
        .then(response => response.text())
        .then(data => {
            console.log("Fetched CSV Data:", data);
            const rows = data.trim().split("\n").map(row => row.split(",").map(cell => cell.trim()));
            console.log("Parsed Rows:", rows);
            const item = rows.slice(1).find(row => row[0].trim() === itemID.trim());
            console.log("Matching Item:", item);

            if (item) {
                document.getElementById("newID").value = item[0];
                document.getElementById("newName").value = item[1];
                document.getElementById("newOwner").value = item[2];
                document.getElementById("newQty").value = item[3];
                document.getElementById("newLocation").value = item[4];

                // ✅ Show QR Image (Updated for Debugging)
                const qrImage = document.getElementById("qrImage");
                const imagePath = `https://raw.githubusercontent.com/jovan-filipovic/QR_Inventory_v1/main/images/${itemID}.png?nocache=${new Date().getTime()}`;
                console.log("QR Image Path:", imagePath); // ✅ Debugging check
                qrImage.src = imagePath;
                qrImage.style.display = "block";

                // ✅ Debugging event listener for image loading errors
                qrImage.onload = function () {
                    console.log("QR Image Loaded Successfully!");
                };
                qrImage.onerror = function () {
                    console.error("QR Image Failed to Load:", imagePath);
                };
            } else {
                console.warn("Item not found!");
                alert("Item not found.");
                document.getElementById("qrImage").style.display = "none";
            }
        })
        .catch(error => console.error("Fetch Error:", error));
}

// Function to start the QR scanner
function startScanner() {
    // check if scanner corectly loaded before use
    if (!window.Html5Qrcode) {
        console.error("Html5Qrcode library not found!");
    }
    
    const scanner = new Html5Qrcode("qr-reader");
    scanner.start(
        { facingMode: "environment" }, // Opens the rear camera
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            console.log("QR Code Scanned:", decodedText);
            processScannedID(decodedText);

            // ✅ Stop the scanner right after scanning a valid QR code
            scanner.stop().then(() => {
                console.log("Camera stopped successfully!");
            }).catch(error => {
                console.error("Error stopping scanner:", error);
            });
        },
        (errorMessage) => {
            console.error("Scan Error:", errorMessage);
        }
    );
}

// Function to process the scanned QR ID and display the QR image
function processScannedID(scannedText) {
    console.log("Scanned Data:", scannedText);

    // ✅ Extract only the first part of the scanned text
    const itemID = scannedText.split(",")[0].trim();
    document.getElementById("itemID").value = itemID;
    fetchInventory(itemID);

    // ✅ Force refresh QR image to prevent caching issues
    const qrImage = document.getElementById("qrImage");
    const imagePath = `https://raw.githubusercontent.com/jovan-filipovic/QR_Inventory_v1/main/images/${itemID}.png?nocache=${new Date().getTime()}`;
    console.log("QR Image Path:", imagePath);
    
    qrImage.src = imagePath;
    qrImage.style.display = "block";

    // ✅ Ensure it's inside the correct container
    const qr-reader = document.getElementById("qr-reader");
    qr-reader.appendChild(qrImage);

    // ✅ Handle loading errors
    qrImage.onload = function () {
        console.log("QR Image Loaded Successfully!");
    };
    qrImage.onerror = function () {
        console.error("QR Image Failed to Load:", imagePath);
    };
}
