import puppeteer, { Browser } from '@cloudflare/puppeteer';

export class PDFGenerationError extends Error {
	constructor(message: string, public readonly code: string) {
		super(message);
		this.name = 'PDFGenerationError';
	}
}

export class TemplateError extends PDFGenerationError {
	constructor(message: string) {
		super(message, 'TEMPLATE_ERROR');
		this.name = 'TemplateError';
	}
}

export class BrowserError extends PDFGenerationError {
	constructor(message: string) {
		super(message, 'BROWSER_ERROR');
		this.name = 'BrowserError';
	}
}

export class DataValidationError extends PDFGenerationError {
	constructor(message: string) {
		super(message, 'DATA_VALIDATION_ERROR');
		this.name = 'DataValidationError';
	}
}

export class RPCError extends PDFGenerationError {
	constructor(message: string) {
		super(message, 'RPC_ERROR');
		this.name = 'RPCError';
	}
}

export class PDFService {
	private browser: Browser | null = null;

	constructor(private env: any) {
		if (!env.BROWSER) {
			throw new RPCError('Browser binding is not configured');
		}
	}

	private async getBrowser(): Promise<Browser> {
		try {
			if (!this.browser) {
				if (!this.env.BROWSER) {
					throw new RPCError(
						'Browser binding is not available. Please check your Cloudflare dashboard and ensure the browser binding is properly configured.'
					);
				}

				try {
					this.browser = await puppeteer.launch(this.env.BROWSER);
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					if (errorMessage.includes('RPC') || errorMessage.includes('receiver')) {
						throw new RPCError(
							`Failed to initialize browser: RPC connection error. Please ensure the browser binding is properly configured in your Cloudflare dashboard. Error details: ${errorMessage}`
						);
					}
					throw new BrowserError(`Failed to launch browser: ${errorMessage}`);
				}
			}
			return this.browser;
		} catch (error: unknown) {
			if (error instanceof PDFGenerationError) {
				throw error;
			}
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			throw new BrowserError(`Failed to get browser instance: ${errorMessage}`);
		}
	}

	async generatePDF(url: string): Promise<Buffer> {
		const browser = await this.getBrowser();
		const page = await browser.newPage();

		try {
			// await page.setViewport({ width: 1920, height: 1080 });
			
			await page.goto(url, { 
				waitUntil: ['domcontentloaded'],
				timeout: 30000
			});
			await page.evaluateHandle('document.fonts.ready');
			
			const pdfBuffer = await page.pdf({
				format: 'A4',
				printBackground: true,
				margin: {
					top: '10mm',
					right: '10mm',
					bottom: '10mm',
					left: '10mm',
				},
			});

			return pdfBuffer;
		} catch (error: unknown) {
			await page.close();
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			if (errorMessage.includes('RPC') || errorMessage.includes('receiver')) {
				throw new RPCError('Failed to generate PDF: RPC connection error');
			}
			throw new PDFGenerationError(`Failed to generate PDF: ${errorMessage}`, 'PDF_GENERATION_ERROR');
		}
	}

	async generateBasicPDF(): Promise<Buffer> {
		const browser = await this.getBrowser();
		const page = await browser.newPage();

		await page.goto("https://www.google.com", { waitUntil: ['domcontentloaded'], timeout: 30000 });

		const pdfBuffer = await page.pdf({
			format: 'A4',
			printBackground: true,
			margin: {
				top: '10mm',
				right: '10mm',
				bottom: '10mm',
				left: '10mm',
			},
		});

		return pdfBuffer;
	}

	public async cleanup(): Promise<void> {
		try {
			if (this.browser) {
				await this.browser.close();
				this.browser = null;
			}
		} catch (error: unknown) {
			console.error('Error during cleanup:', error);
			// Don't throw during cleanup to ensure resources are released
		}
	}
}
