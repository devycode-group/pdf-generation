/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { PDFService, PDFGenerationError } from './services/pdf.service';

interface RequestBody {
	filename: string;
	url: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			// Check API key
			const apiKey = request.headers.get('X-API-Key');
			if (!apiKey || apiKey !== env.API_KEY) {
				return new Response(
					JSON.stringify({
						error: 'Unauthorized',
						code: 'UNAUTHORIZED',
					}),
					{
						status: 401,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			}

			// Only allow POST requests
			if (request.method !== 'POST') {
				return new Response(
					JSON.stringify({
						error: 'Method not allowed',
						code: 'METHOD_NOT_ALLOWED',
					}),
					{
						status: 405,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			}

			// Parse request body
			let body: RequestBody;
			try {
				body = (await request.json()) as RequestBody;
			} catch (error: unknown) {
				const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
				return new Response(
					JSON.stringify({
						error: errorMessage,
						code: 'INVALID_JSON',
					}),
					{
						status: 400,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			}

			const { filename, url } = body;

			if (!filename || !url) {
				return new Response(
					JSON.stringify({
						error: 'Missing required fields',
						code: 'MISSING_FIELDS',
					}),
					{
						status: 400,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			}

			// Initialize PDF service
			const pdfService = new PDFService(env);

			try {
				// Generate PDF
				const pdfBuffer = await pdfService.generatePDF(url);

				// Create response with PDF
				const response = new Response(pdfBuffer, {
					headers: {
						'Content-Type': 'application/pdf',
						'Content-Disposition': `attachment; filename="${filename}"`,
					},
				});

				return response;
			} finally {
				// Cleanup
				await pdfService.cleanup();
			}
		} catch (error: unknown) {
			console.error('Error processing request:', error);

			if (error instanceof PDFGenerationError) {
				return new Response(
					JSON.stringify({
						error: error.message,
						code: error.code,
					}),
					{
						status: 400,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			}

			return new Response(
				JSON.stringify({
					error: 'Internal server error',
					code: 'INTERNAL_SERVER_ERROR',
				}),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}
	},
} satisfies ExportedHandler<Env>;
