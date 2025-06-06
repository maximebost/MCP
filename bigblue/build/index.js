import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
const BGBL_API_KEY = "YOUR_API_KEY";
const BIGBLUE_API_BASE_URL = "https://api.bigblue.co/bigblue.storeapi.v1.PublicAPI";
// Create server instance
const server = new Server({
    name: "bigblue",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get-product",
                description: "Get product information for a given product",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "XXXX-XXXXXX-XXXX format product SKU",
                        },
                    },
                    required: ["id"],
                },
            },
            {
                name: "create-product",
                description: "Create product with the given information",
                inputSchema: {
                    type: "object",
                    properties: {
                        product: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    description: "XXXX-XXXXXX-XXXX format product SKU",
                                },
                                name: {
                                    type: "string",
                                    description: "Name of the product"
                                },
                                description: {
                                    type: "string",
                                    description: "Description of the product"
                                },
                                options: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: {
                                                type: "string",
                                            },
                                            value: {
                                                type: "string"
                                            }
                                        }
                                    }
                                },
                                barcode: {
                                    type: "string"
                                },
                                value: {
                                    type: "object",
                                    properties: {
                                        amount: {
                                            type: "string"
                                        },
                                        currency: {
                                            type: "string"
                                        },
                                    }
                                },
                                tariff_number: {
                                    type: "string"
                                },
                                origin_country: {
                                    type: "string",
                                },
                                customs_description: {
                                    type: "string"
                                },
                                name_translations: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            language: {
                                                type: "string"
                                            },
                                            name: {
                                                type: "string"
                                            }
                                        }
                                    }
                                },
                                track_lots: {
                                    type: "boolean"
                                }
                            },
                        }
                    },
                    required: ["product"],
                },
            },
        ]
    };
});
// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === "get-product") {
            const { id } = GetProductArgumentsSchema.parse(args);
            const productURL = `${BIGBLUE_API_BASE_URL}/GetProduct`;
            const productBody = JSON.stringify({ "id": id });
            const productText = await makeBigblueAPIRequest(productURL, productBody);
            if (!productText) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Failed to retrieve product data",
                        },
                    ],
                };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: productText,
                    },
                ],
            };
        }
        else if (name === 'create-product') {
            const { product } = CreateProductArgumentsSchema.parse(args);
            const productURL = `${BIGBLUE_API_BASE_URL}/CreateProduct`;
            const productBody = JSON.stringify({ "product": product });
            const productText = await makeBigblueAPIRequest(productURL, productBody);
            if (!productText) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Failed to create product",
                        },
                    ],
                };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: productText,
                    },
                ],
            };
        }
        else {
            throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Invalid arguments: ${error.errors
                .map((e) => `${e.path.join(".")}: ${e.message}`)
                .join(", ")}`);
        }
        throw error;
    }
});
// Define Zod schemas for validation
const GetProductArgumentsSchema = z.object({
    id: z.string().length(16),
});
const CreateProductArgumentsSchema = z.object({
    product: z.object({
        id: z.string().length(16),
        name: z.string().describe("Name of the product"),
        description: z.string().describe("Description of the product"),
        options: z.array(z.object({
            name: z.string(),
            value: z.string(),
        })),
        barcode: z.string(),
        value: z.object({
            amount: z.string(),
            currency: z.string(),
        }),
        tariff_number: z.string(),
        origin_country: z.string(),
        customs_description: z.string(),
        name_translations: z.array(z.object({
            language: z.string(),
            name: z.string(),
        })),
        track_lots: z.boolean(),
    }),
});
// Helper function to do a POST Request on the Bigblue API.
async function makeBigblueAPIRequest(url, body) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BGBL_API_KEY}`,
                "Content-Type": "application/json"
            },
            body,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.text());
    }
    catch (error) {
        console.error("Error making Bigblue API Request:", error);
        return null;
    }
}
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Bigblue MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
