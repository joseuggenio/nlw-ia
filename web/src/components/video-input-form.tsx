import { Clapperboard, MonitorUp } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { ChangeEvent, useMemo, useState } from "react";

export function VideoInputForm() {
    const [videoFile, setVideoFile] = useState<File | null>(null);

    function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.currentTarget;

        if (!files) {
            return
        };

        const selectedFile = files[0];

        setVideoFile(selectedFile)
    }

    const previewURL = useMemo(() => {
        if (!videoFile) {
            return
        }

        return URL.createObjectURL(videoFile);
    }, [videoFile]);

    return (
        <form className="space-y-4">
            <label
                htmlFor="video"
                className="relative border flex aspect-video cursor-pointer rounded-md border-muted text-sm flex-col gap-2 items-center justify-center text-muted hover:bg-primary/5"
            >
                {previewURL ? (
                    <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0"/>
                ) : (
                    <>
                    <Clapperboard className="w-4 h-4 ml-2"/>
                    Selecione o Vídeo
                    </>
                )}
            </label>

            <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected}/>

            <Separator />

            <div className="space-y-2">
                <Label htmlFor="transcription_prompt">Prompt de Descrição</Label>
                <Textarea
                    id="transcription_prompt"
                    className="h-20 leading-relaxed resize-none"
                    placeholder="Inclua palavras-chave mencionadas no video separadas por vírgula (,)"
                >

                </Textarea>
            </div>

            <Button type="submit" className="w-full" variant={"secondary"}>
                Carregar Vídeo
                <MonitorUp className="ml-2 w-4 h-4" />
            </Button>
        </form>
    )
}