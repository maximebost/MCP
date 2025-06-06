# Bigblue MCP Server

A Model Context Protocol (MCP) server that provides integration with Bigblue Store API.

## Overview

This MCP server allows AI assistants like Claude Desktop or Cursor to interact with Bigblue Store API. This is WIP.

## Features

- **Get Product Information**: Retrieve detailed product data by SKU
- **Create Products**: Add new products to the Bigblue system with comprehensive product details
- Built with TypeScript and the MCP SDK

## Tools Available

### `get-product`

Retrieves product information for a given product SKU.

**Parameters:**

- `id` (string, required): Product SKU in XXXX-XXXXXX-XXXX format

### `create-product`

Creates a new product with the provided information.

**Parameters:**

- `product` (object, required): Product details including:
  - `id`: Product SKU
  - `name`: Product name
  - `description`: Product description
  - `options`: Array of product options (name/value pairs)
  - `barcode`: Product barcode
  - `value`: Price information (amount and currency)
  - `tariff_number`: Customs tariff number
  - `origin_country`: Country of origin
  - `customs_description`: Customs description
  - `name_translations`: Multilingual name translations
  - `track_lots`: Boolean for lot tracking

## Installation

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd MCP
   ```

2. Install dependencies and build the project:

   ```bash
   npm install
   npm run build
   ```

3. Configure your MCP client:

   ### For Cursor

   Add the following to your `mcp.json` configuration file:

   ```json
   {
     "mcpServers": {
       "bigblue": {
         "command": "node",
         "args": ["/Users/maximebost/Desktop/MCP/bigblue/build/index.js"]
       }
     }
   }
   ```

   ### For Claude Desktop

   Add the following to your `claude_desktop_config.json` file:

   ```json
   {
     "mcpServers": {
       "bigblue": {
         "command": "node",
         "args": ["/Users/maximebost/Desktop/MCP/bigblue/build/index.js"]
       }
     }
   }
   ```

   **Note:** Update the path in `args` to match your actual installation directory.

4. Restart your MCP client (Cursor or Claude Desktop) to load the new server configuration.
