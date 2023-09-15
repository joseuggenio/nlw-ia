import { Clapperboard, MonitorUp } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from '@ffmpeg/util';
import { api } from "@/lib/axios";

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages: Record<string, string> = {
    converting: 'Convertendo...',
    generating: 'Gerando...',
    uploading: 'Enviando...',
    success: 'Sucesso!',
};

interface VideoInputFormProps {
    onVideoUploaded: (id: string) => void
}

export function VideoInputForm(props: VideoInputFormProps) {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const promptInputRef = useRef<HTMLTextAreaElement>(null)
    const [status, setStatus] = useState('waiting')

    function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.currentTarget;

        if (!files) {
            return
        };

        const selectedFile = files[0];

        setVideoFile(selectedFile)
    }

    async function convertVideoToAudio(video: File) {
        console.log('Conversão iniciada...');

        const ffmpeg = await getFFmpeg();

        await ffmpeg.writeFile('input.mp4', await fetchFile(video));

        ffmpeg.on('progress', progress => {
            console.log('Em progresso de conversão... ' + Math.round(progress.progress * 100))
        })

        await ffmpeg.exec([
            '-i',
            'input.mp4',
            '-map',
            '0:a',
            '-b:a',
            '20k',
            '-acodec',
            'libmp3lame',
            'output.mp3'
        ]);

        const data = await ffmpeg.readFile('output.mp3');

        const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
        const audioFile = new File([audioFileBlob], 'audio.mp3', {
            type: 'audio/mpeg',
        });

        console.log('Conversão finalizada: ')

        return audioFile
    }

    async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const prompt = promptInputRef.current?.value

        if (!videoFile) {
            return;
        }
        setStatus('converting')

        //convertendo o vídeo em áudio
        const audioFile = await convertVideoToAudio(videoFile);

        const data = new FormData();

        data.append('file', audioFile)

        setStatus('uploading')

        const response = await api.post('/videos', data)

        const videoId = response.data.video.id

        setStatus('generating')

        await api.post(`/videos/${videoId}/transcription`, {
            prompt,
        })

        console.log('Finalizou')

        setStatus('success')

        props.onVideoUploaded(videoId)
    }

    const previewURL = useMemo(() => {
        if (!videoFile) {
            return null
        }

        return URL.createObjectURL(videoFile);
    }, [videoFile]);

    return (
        <form className="space-y-4" onSubmit={handleUploadVideo}>
            <label
                htmlFor="video"
                className="relative border flex aspect-video cursor-pointer rounded-md border-muted text-sm flex-col gap-2 items-center justify-center text-muted hover:bg-primary/5"
            >
                {previewURL ? (
                    <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0" />
                ) : (
                    <>
                        <Clapperboard className="w-4 h-4 ml-2" />
                        Selecione o Vídeo
                    </>
                )}
            </label>

            <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected} />

            <Separator />

            <div className="space-y-2">
                <Label htmlFor="transcription_prompt">Prompt de Descrição</Label>
                <Textarea
                    ref={promptInputRef}
                    disabled={status != 'waiting'}
                    id="transcription_prompt"
                    className="h-20 leading-relaxed resize-none"
                    placeholder="Inclua palavras-chave mencionadas no video separadas por vírgula (,)"
                >

                </Textarea>
            </div>

            <Button
                disabled={status != 'waiting'}
                type="submit"
                className={`w-full ${status === 'success' ? 'bg-emerald-400 text-white' : ''}`}
                variant={"secondary"}>
                {status === 'waiting' ? (
                    <>
                        Carregar Vídeo
                        <MonitorUp className="ml-2 w-4 h-4" />
                    </>
                ) : statusMessages[status]}
            </Button>
        </form>
    )
}