import { FastifyReply, RouteOptions } from 'fastify';
import { Page } from 'puppeteer';
import { getBrowserPage, getContainer, uploadBuffer } from '../core';

async function handle(request: any, reply: FastifyReply): Promise<void> {
  const container = await getContainer();

  if (
    (!request.body.html && !request.body.url) ||
    (request.body.html && request.body.url)
  ) {
    reply
      .status(400)
      .send({ message: `please provide the property 'html' or 'url'` });

    return;
  }

  const page: Page = await getBrowserPage(
    container.browser,
    request.body.html || null,
    request.body.url || null,
  );

  // await page.addStyleTag({
  //   content: `
  //     body::before {
  //       color: rgba(0, 0, 0, 0.1);
  //       content: "CONFIDENTIAL";
  //       left: 50%;
  //       position: fixed;
  //       font-size: 60px;
  //       pointer-events: none;
  //       top: 50%;
  //       transform: translate(-50%, -50%) rotate(-45deg);
  //       white-space: nowrap;
  //       z-index: 0;
  //     }
  //   `,
  // });

  try {
    const buffer: Uint8Array = await page.pdf({
      displayHeaderFooter:
        request.body.footer || request.body.header ? true : false,
      footerTemplate: request.body.footer || undefined,
      format: 'A4',
      headerTemplate: request.body.header || undefined,
      margin: request.body.margin
        ? {
            bottom: request.body.margin.bottom,
            left: request.body.margin.left,
            right: request.body.margin.right,
            top: request.body.margin.top,
          }
        : undefined,
      printBackground: true,
    });

    if (process.env.AWS_S3_BUCKET) {
      const url: string = await uploadBuffer(
        Buffer.from(buffer),
        undefined,
        'application/pdf',
      );

      reply
        .status(200)
        .header('Content-Type', 'application/pdf')
        .header('X-Custom-Url', url)
        .header('Access-Control-Expose-Headers', 'X-Custom-Url')
        .send(buffer);

      return;
    }

    reply.status(200).header('Content-Type', 'application/pdf').send(buffer);
  } finally {
    await page.close();
  }
}

export const RENDER_PDF_POST: RouteOptions = {
  handler: handle,
  method: 'POST',
  url: '/api/v1/render/pdf',
  schema: {
    tags: ['render'],
    body: {
      type: 'object',
      properties: {
        footer: { type: 'string', nullable: true },
        header: { type: 'string', nullable: true },
        html: { type: 'string', nullable: true },
        margin: {
          type: 'object',
          nullable: true,
          properties: {
            bottom: { type: 'string', nullable: true },
            left: { type: 'string', nullable: true },
            right: { type: 'string', nullable: true },
            top: { type: 'string', nullable: true },
          },
        },
        url: { type: 'string', nullable: true },
      },
    },
  },
};
