document.addEventListener("DOMContentLoaded", function () {
    const inventoryData = document.getElementById("inventoryData");
    const searchButton = document.getElementById("searchButton");
    const scanButton = document.getElementById("scanButton");

    // Function to fetch data from CSV stored on GitHub
    function fetchInventory(itemID) {
        fetch("https://raw.githubusercontent.com/yourusername/QR_Inventory_2025/main/inventory.csv")
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").map(row => row.split(","));
                const headers = rows[0];
                const item = rows.slice(1).find(row => row[0] === itemID);

                if (item) {
                    let output = "";
                    headers.forEach((header, index) => {
                        output += `<p><strong>${header}:</strong> ${item[index]}</p>`;
                    });
                    inventoryData.innerHTML = output;
                } else {
                    inventoryData.innerHTML = `<p>Item not found.</p>`;
                }
            })
            .catch(error => console.error("Error fetching inventory:", error));
    }

    // Search button (manual entry)
    searchButton.addEventListener("click", function () {
        const itemID = document.getElementById("itemID").value;
        if (itemID) {
            fetchInventory(itemID);
        }
    });

    // QR Scanner using System Camera
    scanButton.addEventListener("click", function () {
        const qrScanner = document.createElement("input");
        qrScanner.setAttribute("type", "file");
        qrScanner.setAttribute("accept", "image/*");
        qrScanner.click();

        qrScanner.addEventListener("change", function () {
            const file = qrScanner.files[0];
            if (file) {
                // Ideally use a QR library like QRCode.js to decode QR codes
                alert("Scan feature needs an integrated QR decoder.");
            }
        });
    });

    // Adding an item
    document.getElementById("addItemButton").addEventListener("click", function () {
        const newItem = [
            document.getElementById("newID").value,
            document.getElementById("newName").value,
            document.getElementById("newCategory").value,
            document.getElementById("newStock").value,
            document.getElementById("newLocation").value
        ];
        console.log("Adding item:", newItem);
        alert("Feature requires backend processing to update CSV.");
    });

    // Deleting an item
    document.getElementById("deleteItemButton").addEventListener("click", function () {
        const deleteID = document.getElementById("newID").value;
        console.log("Deleting item:", deleteID);
        alert("Feature requires backend processing to update CSV.");
    });
});
