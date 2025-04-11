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

- `X-API-Key`: Your API key for authentication
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