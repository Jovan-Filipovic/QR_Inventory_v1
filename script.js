document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const itemIDInput = document.getElementById("itemID");

    // Enable Enter key for search
    itemIDInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchButton.click();
        }
    });

    searchButton.addEventListener("click", function () {
        const itemID = itemIDInput.value;
        if (itemID) {
            fetchInventory(itemID);
        }
    });

    // Function to fetch inventory data
    function fetchInventory(itemID) {
        fetch("https://raw.githubusercontent.com/yourusername/QR_Inventory_2025/main/inventory.csv")
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").map(row => row.trim().split(","));
                const headers = rows[0];
                const item = rows.slice(1).find(row => row[0] === itemID);

                if (item) {
                    document.getElementById("inventoryData").innerHTML =
                        headers.map((header, i) => `<p><strong>${header}:</strong> ${item[i]}</p>`).join("");

                    // Populate form fields (except ID which remains disabled)
                    document.getElementById("newID").value = item[0];
                    document.getElementById("newName").value = item[1];
                    document.getElementById("newCategory").value = item[2];
                    document.getElementById("newStock").value = item[3];
                    document.getElementById("newLocation").value = item[4];
                } else {
                    document.getElementById("inventoryData").innerHTML = "<p>Item not found.</p>";
                }
            })
            .catch(error => console.error("Error fetching inventory:", error));
    }
});
