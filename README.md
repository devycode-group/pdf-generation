# PDF Generation Service

A Cloudflare Worker service that generates PDFs from HTML templates using Puppeteer. This service provides a secure and scalable way to convert HTML content to PDF documents.

## Features

- Convert HTML templates to PDF documents
- Secure API key authentication
- Error handling and validation
- A4 format with configurable margins
- Background printing support
- Font loading support

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pdf-generation
```

2. Install dependencies:
```bash
npm install
```

3. Configure your environment:
   - Create a `.dev.vars` file for local development
   - Set up your Cloudflare account and configure the browser binding

## Configuration

The service requires the following environment variables:

- `API_KEY`: A secure API key for authentication
- `BROWSER`: Cloudflare Browser binding (configured in wrangler.jsonc)

### Setting up the API_KEY

1. Generate a secure API key (you can use a UUID or a secure random string)
2. To set the API_KEY secret in Cloudflare Workers, run:
   ```bash
   npx wrangler secret put API_KEY
   ```
   When prompted, enter your secret API key.

   **Note**: If you see an error that the binding name 'API_KEY' is already in use, you have two options:
   - Use a different name for your API key (e.g., `PDF_API_KEY`) and update the code accordingly
   - Delete the existing secret first using:
     ```bash
     npx wrangler secret delete API_KEY
     ```
     Then try setting it again.

3. For local development, create a `.dev.vars` file in your project root with:
   ```
   API_KEY=your_api_key_here
   ```

### Setting up the Browser Binding

1. In your Cloudflare dashboard, navigate to Workers & Pages
2. Select your worker
3. Go to Settings > Variables
4. Add a new binding:
   - Name: `BROWSER`
   - Type: Browser
   - Click "Save"

## Development

To start the development server:

```bash
npm run dev
```

This will start a local development server at http://localhost:8787

## Deployment

To deploy to Cloudflare Workers:

```bash
npm run deploy
```

## API Usage

### Endpoint

```
POST /generate-pdf
```

### Headers

- `x-pdf-generation-api-key`: Your API key for authentication
- `Content-Type`: application/json

### Request Body

```json
{
  "htmlTemplate": "<html>Your HTML content here</html>",
  "filename": "output.pdf"
}
```

### Response

- Success: Returns a PDF file with the specified filename
- Error: Returns a JSON object with error details

### Error Codes

- `UNAUTHORIZED`: Invalid or missing API key
- `METHOD_NOT_ALLOWED`: Invalid HTTP method
- `INVALID_JSON`: Invalid request body
- `MISSING_FIELDS`: Required fields are missing
- `TEMPLATE_ERROR`: Error in HTML template
- `BROWSER_ERROR`: Browser-related error
- `DATA_VALIDATION_ERROR`: Data validation failed
- `RPC_ERROR`: RPC connection error
- `PDF_GENERATION_ERROR`: General PDF generation error
- `INTERNAL_SERVER_ERROR`: Unexpected server error

## Security

- API key authentication is required for all requests
- Input validation is performed on all requests
- Error messages are sanitized to prevent information leakage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.