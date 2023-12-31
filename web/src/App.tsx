import { Button } from "./components/ui/button";
import { Github, Sparkles } from 'lucide-react';
import { Textarea } from "./components/ui/textarea";
import { Separator } from "./components/ui/separator";
import { Label } from "./components/ui/label";
import { SelectTrigger, SelectValue, Select, SelectContent, SelectItem } from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { PromptSelect } from './components/prompt-select';

import { VideoInputForm } from "./components/video-input-form";
import { useState } from "react";

import { useCompletion } from 'ai/react';


export function App() {
  
  const [temperature, setTemperature] = useState(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);

  

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-4 py-4 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">NLW IA - upload.ai</h1>

        <div className="flex items-center gap-3">
          <Button variant={"outline"}>GitHub <Github className="w-4 h-4 ml-2" /> </Button>
        </div>
      </div>

      <main className="flex-1 p-4 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-3 leading-relaxed"
              placeholder="Inclua aqui o prompt para a IA..."
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-3 leading-relaxed"
              placeholder="Resultado..." readOnly
              value={completion}
            />
          </div>

          <p className="text-muted text-sm">Lembre-se: Você pode utilizar a variável <code className="text-violet-900">{'{transcription}'}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado</p>
        </div>

        <aside className="w-80 space-y-4">
          <VideoInputForm onVideoUploaded={setVideoId}/>

          <Separator />

          <form className="space-y-6" onSubmit={handleSubmit}>

          <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
              <span className="block text-xs text-muted italic">Você poderá customizar esta opção em breve</span>
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted italic">Você poderá customizar esta opção em breve</span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={value => setTemperature(value[0])}
              >

              </Slider>
              <span className="block text-xs text-muted italic leading-relaxed">Valores mais altos tendem a deixar o resultado mais criativos e com possíveis erros.</span>
            </div>

            <Separator />

            <Button disabled={isLoading} type="submit" className="w-full">
              Executar
              <Sparkles className="w-4 h-4 ml-2"/>
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}
