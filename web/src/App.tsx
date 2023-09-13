import { Button } from "./components/ui/button";
import { Github, Clapperboard, MonitorUp, Sparkles } from 'lucide-react';
import { Textarea } from "./components/ui/textarea";
import { Separator } from "./components/ui/separator";
import { Label } from "./components/ui/label";
import { SelectTrigger, SelectValue, Select, SelectContent, SelectItem } from "./components/ui/select";
import { Slider } from "./components/ui/slider";


export function App() {
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
            />
            <Textarea
              className="resize-none p-3 leading-relaxed"
              placeholder="Resultado..." readOnly
            />
          </div>

          <p className="text-muted text-sm">Lembre-se: Você pode utilizar a variável <code className="text-violet-900">{'{transcription}'}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado</p>
        </div>

        <aside className="w-80 space-y-4">
          <form className="space-y-4">
            <label
              htmlFor="video"
              className="border flex aspect-video cursor-pointer rounded-md border-muted text-sm flex-col gap-2 items-center justify-center text-muted hover:bg-primary/5"
            >
              <Clapperboard />
              Selecione o Vídeo
            </label>

            <input type="file" id="video" accept="video/mp4" className="sr-only" />

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

          <Separator />

          <form className="space-y-6">

          <div className="space-y-2">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prompt..."/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Título do YouTube</SelectItem>
                  <SelectItem value="description">Descrição do YouTube</SelectItem>
                </SelectContent>
              </Select>
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
              >

              </Slider>
              <span className="block text-xs text-muted italic leading-relaxed">Valores mais altos tendem a deixar o resultado mais criativos e com possíveis erros.</span>
            </div>

            <Separator />

            <Button type="submit" className="w-full">
              Executar
              <Sparkles className="w-4 h-4 ml-2"/>
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}
