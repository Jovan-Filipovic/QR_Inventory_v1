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
        console.log("QR Scan button clicked!"); // Debugging check
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
            const item = rows.slice(1).find(row => row[0].trim() === itemID.trim());

            if (item) {
                // ✅ Populate inventory fields
                document.getElementById("newID").value = item[0];
                document.getElementById("newName").value = item[1];
                document.getElementById("newOwner").value = item[2];
                document.getElementById("newQty").value = item[3];
                document.getElementById("newLocation").value = item[4];

                // ✅ Stop scanner after successful fetch
                if (window.scannerInstance) {
                    window.scannerInstance.stop().then(() => {
                        console.log("Camera stopped successfully!");
                        document.getElementById("qr-reader").style.display = "none";
                    }).catch(error => {
                        console.error("Error stopping scanner:", error);
                    });
                }

                // ✅ Replace the camera feed with the QR code image
                const qrImage = document.getElementById("qrImage");
                qrImage.src = `https://raw.githubusercontent.com/jovan-filipovic/QR_Inventory_v1/main/images/${itemID}.png?nocache=${new Date().getTime()}`;
                qrImage.style.display = "block";

                // ✅ Move QR image inside the container
                const qrContainer = document.getElementById("qrContainer");
                qrContainer.appendChild(qrImage);
            } else {
                alert("Item not found.");
            }
        })
        .catch(error => console.error("Fetch Error:", error));
}


// Function to start the QR scanner
function startScanner() {
    if (!window.Html5Qrcode) {
        console.error("Html5Qrcode library not found!");
        return;
    }

    const scanner = new Html5Qrcode("qr-reader"); 
    window.scannerInstance = scanner; // ✅ Store scanner globally

    scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            console.log("QR Code Scanned:", decodedText);
            processScannedID(decodedText);

            // ✅ Stop scanner immediately after successful scan
            scanner.stop().then(() => {
                console.log("Camera stopped successfully!");

                // ✅ Completely remove the scanner instance to free up resources
                window.scannerInstance = null;

                // ✅ Hide the camera feed
                document.getElementById("qr-reader").style.display = "none";

                // ✅ Replace with the scanned QR image
                const qrImage = document.getElementById("qrImage");
                qrImage.src = `https://raw.githubusercontent.com/jovan-filipovic/QR_Inventory_v1/main/images/${decodedText}.png?nocache=${new Date().getTime()}`;
                qrImage.style.display = "block";

                // ✅ Move QR image to replace the camera feed
                const qrContainer = document.getElementById("qrContainer");
                qrContainer.appendChild(qrImage);
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

    // Extract only the first part of the scanned text
    const itemID = scannedText.split(",")[0].trim();
    document.getElementById("itemID").value = itemID;
    fetchInventory(itemID);

    // Force refresh QR image to prevent caching issues
    const qrImage = document.getElementById("qrImage");
    const imagePath = `https://raw.githubusercontent.com/jovan-filipovic/QR_Inventory_v1/main/images/${itemID}.png?nocache=${new Date().getTime()}`;
    console.log("QR Image Path:", imagePath);
    
    qrImage.src = imagePath;
    qrImage.style.display = "block";

    // Ensure it's inside the correct container
    const qrContainer = document.getElementById("qr-reader");
    qrContainer.appendChild(qrImage);

    // Handle loading errors
    qrImage.onload = function () {
        console.log("QR Image Loaded Successfully!");
    };
    qrImage.onerror = function () {
        console.error("QR Image Failed to Load:", imagePath);
    };
}


// delete inputs and results

function clearAll() {

    document.getElementById("itemID").value = "";
    qrImage.src = ``;
    document.getElementById("newID").value = "";
    document.getElementById("newName").value = "";
    document.getElementById("newOwner").value = "";
    document.getElementById("newQty").value = "";
    document.getElementById("newLocation").value = "";
}
