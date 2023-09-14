import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart';
import path from "node:path";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { pipeline } from "node:stream";
import fs from "node:fs";
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
    app.register(fastifyMultipart, {
        limits: {
            fileSize: 1_848_576 * 25,
        }
    });

    app.post('/videos', async (request, reply) => {
        const data = await request.file();

        if (!data) {
            return reply.status(400).send({ error: 'Nenhuma entrada de arquivo.' });
        }

        const extension = path.extname(data.filename);

        if (extension !== '.mp3') {
            return reply.status(400).send({ error: 'Tipo de arquivo inválido, por favor envie um MP3.' });
        }

        const fileBaseName = path.basename(data.filename, extension);

        const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

        const uploadDestination = path.resolve(__dirname, '../../temp', fileUploadName);

        await pump(data.file, fs.createWriteStream(uploadDestination));

        const video = await prisma.video.create({
            data: {
                name: data.filename,
                path: uploadDestination,

            }
        })

        return {
            video,
        }
    })

}