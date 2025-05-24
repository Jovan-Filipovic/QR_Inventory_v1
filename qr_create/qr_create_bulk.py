import os
import qrcode
import pandas as pd

# Load CSV file
csv_file = "inventory.csv"
df = pd.read_csv(csv_file)  # Reads the CSV file, assuming it has headers

# Create folder to store QR codes
output_folder = "qr_codes"
os.makedirs(output_folder, exist_ok=True)

# Generate QR codes for each row
for _, row in df.iterrows():
    item_id = str(row.iloc[0])  # First column as ID
    qr_data = ",".join(map(str, row))  # Convert row to CSV format

    qr = qrcode.make(qr_data)  # Generate QR code
    qr.save(os.path.join(output_folder, f"{item_id}.png"))  # Save QR code

print(f"QR codes generated successfully in '{output_folder}' folder.")
