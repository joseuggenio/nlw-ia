import { Button } from "./components/ui/button";
import { Github } from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-12 py-6 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">NLW IA - upload.ai</h1>

        <div className="flex items-center gap-3">
          <Button variant={"outline"}>GitHub <Github className="w-4 h-4 ml-2"/> </Button>
        </div>
      </div>

      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">

          </div>

          <p className="text-muted text-sm">Lembre-se: Você pode utilizar a variável <code className="text-violet-900">{'{transcription}'}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado</p>
        </div>
        <aside className="w-80">

        </aside>
      </main>
    </div>
  )
}
