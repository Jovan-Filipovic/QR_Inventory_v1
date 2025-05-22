# QR_Inventory_v1
Inventory management system using QR scanner

This project allows users to scan QR codes and retrieve inventory details from an Excel (CSV) file hosted on GitHub.

## How It Works
- Scan a QR code that contains a link to `main.html?id=ITEM_ID`
- The webpage fetches inventory details from `inventory.csv`
- Displays item properties dynamically

## Requirements
- Web server (or local testing via browser)
- Public GitHub repository with `inventory.csv`
